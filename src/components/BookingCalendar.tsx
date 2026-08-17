'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useCurrency } from './CurrencyProvider'
import { useLanguage } from './LanguageProvider'

// ── Date helpers (local, no timezone surprises) ──
function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function fromYmd(s: string) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}
function addDays(d: Date, n: number) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}
function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1)
}
function nights(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / 86_400_000)
}

interface DayInfo {
  date: string
  available: boolean
  price: number
  minStay: number
  closedOnArrival: boolean
  closedOnDeparture: boolean
}

interface BookingCalendarProps {
  listingId: number
  villaName: string
  maxGuests: number
}

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
// How far ahead the calendar is loaded. Hostaway (and the Airbnb sync behind it)
// does not publish rates/availability much beyond 24 months, so loading more
// would only add empty months.
const MONTHS_TO_LOAD = 24

export default function BookingCalendar({ listingId, villaName, maxGuests }: BookingCalendarProps) {
  const today = useMemo(() => {
    const t = new Date()
    return new Date(t.getFullYear(), t.getMonth(), t.getDate())
  }, [])

  const { format } = useCurrency()
  const { t, locale } = useLanguage()
  const localeTag = locale === 'en' ? 'en-US' : locale
  const [days, setDays] = useState<Map<string, DayInfo>>(new Map())
  // Length-of-stay discount multipliers from Hostaway (1 = no discount).
  const [discount, setDiscount] = useState({ weekly: 1, monthly: 1 })
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [viewMonth, setViewMonth] = useState(() => startOfMonth(new Date()))
  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [rangeError, setRangeError] = useState<string | null>(null)

  // Guest form
  const [form, setForm] = useState({ name: '', email: '', guests: 2, phone: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  // ── Load availability for the next MONTHS_TO_LOAD months ──
  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setLoadError(null)
      try {
        const start = ymd(today)
        const end = ymd(addDays(addMonths(startOfMonth(today), MONTHS_TO_LOAD), -1))
        const res = await fetch(`/api/availability?listingId=${listingId}&start=${start}&end=${end}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to load availability')
        if (cancelled) return
        const map = new Map<string, DayInfo>()
        for (const d of data.days as DayInfo[]) map.set(d.date, d)
        setDays(map)
        setDiscount({ weekly: data.weeklyDiscount ?? 1, monthly: data.monthlyDiscount ?? 1 })
      } catch (e) {
        if (!cancelled) setLoadError((e as Error).message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [listingId, today])

  // ── Prefill dates from ?checkIn=&checkOut= (e.g. coming from homepage search) ──
  const prefilled = useRef(false)
  useEffect(() => {
    if (loading || prefilled.current || days.size === 0) return
    prefilled.current = true
    const params = new URLSearchParams(window.location.search)
    const ci = params.get('checkIn')
    const co = params.get('checkOut')
    const re = /^\d{4}-\d{2}-\d{2}$/
    if (!ci || !co || !re.test(ci) || !re.test(co)) return
    const inDate = fromYmd(ci)
    const outDate = fromYmd(co)
    if (outDate <= inDate) return
    // Validate availability + min stay before applying.
    for (let i = 0; i < nights(inDate, outDate); i++) {
      const info = days.get(ymd(addDays(inDate, i)))
      if (!info || !info.available) return
    }
    if (nights(inDate, outDate) < (days.get(ci)?.minStay ?? 1)) return
    setCheckIn(inDate)
    setCheckOut(outDate)
    setViewMonth(startOfMonth(inDate))
  }, [loading, days])

  // ── Range math ──
  const nightsCount = checkIn && checkOut ? nights(checkIn, checkOut) : 0
  const totalPrice = useMemo(() => {
    if (!checkIn || !checkOut) return 0
    let sum = 0
    for (let i = 0; i < nightsCount; i++) {
      const info = days.get(ymd(addDays(checkIn, i)))
      sum += info?.price ?? 0
    }
    return sum
  }, [checkIn, checkOut, nightsCount, days])

  const money = (n: number) => format(n)

  // Length-of-stay discount applied to the displayed total.
  const discountMult = nightsCount >= 28 ? discount.monthly : nightsCount >= 7 ? discount.weekly : 1
  const discountedTotal = Math.round(totalPrice * discountMult)
  const discountPct = Math.round((1 - discountMult) * 100)

  // All nights in [a, b) are available?
  function rangeAvailable(a: Date, b: Date) {
    for (let i = 0; i < nights(a, b); i++) {
      const info = days.get(ymd(addDays(a, i)))
      if (!info || !info.available) return false
    }
    return true
  }

  function handleDayClick(date: Date) {
    setRangeError(null)
    const info = days.get(ymd(date))
    if (!info || !info.available) return

    // Start fresh
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date)
      setCheckOut(null)
      return
    }
    // Clicking same or earlier day restarts from there
    if (date <= checkIn) {
      setCheckIn(date)
      setCheckOut(null)
      return
    }
    // Tentative checkout
    if (!rangeAvailable(checkIn, date)) {
      setRangeError(t('Those dates include unavailable nights. Pick a different range.'))
      setCheckIn(date)
      setCheckOut(null)
      return
    }
    const minStay = days.get(ymd(checkIn))?.minStay ?? 1
    if (nights(checkIn, date) < minStay) {
      setRangeError(t('Minimum stay for these dates is {n} nights.').replace('{n}', String(minStay)))
      return
    }
    setCheckOut(date)
  }

  function dayState(date: Date) {
    const info = days.get(ymd(date))
    const isPast = date < today
    const selectable = !!info?.available && !isPast
    const isStart = checkIn && ymd(date) === ymd(checkIn)
    const isEnd = checkOut && ymd(date) === ymd(checkOut)
    const inRange = checkIn && checkOut && date > checkIn && date < checkOut
    return { info, isPast, selectable, isStart, isEnd, inRange }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!checkIn || !checkOut) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          arrivalDate: ymd(checkIn),
          departureDate: ymd(checkOut),
          guestName: form.name,
          guestEmail: form.email,
          numberOfGuests: form.guests,
          phone: form.phone,
          comment: form.message,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')
      setDone(true)
    } catch (e) {
      setSubmitError((e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Render a single month grid ──
  function Month({ monthDate }: { monthDate: Date }) {
    const first = startOfMonth(monthDate)
    const offset = (first.getDay() + 6) % 7 // Monday-first
    const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate()
    const cells: (Date | null)[] = []
    for (let i = 0; i < offset; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(monthDate.getFullYear(), monthDate.getMonth(), d))

    return (
      <div className="flex-1 min-w-[260px]">
        <p className="text-center font-serif text-lg text-villa-dark mb-3">
          {monthDate.toLocaleString(localeTag, { month: 'long', year: 'numeric' })}
        </p>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-villa-muted mb-1">
          {WEEKDAYS.map((w) => (
            <div key={w} className="py-1">{w}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((date, i) => {
            if (!date) return <div key={i} />
            const { info, selectable, isStart, isEnd, inRange } = dayState(date)
            const base = 'aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-colors'
            let cls = ''
            if (isStart || isEnd) cls = 'bg-villa-green text-white font-medium'
            else if (inRange) cls = 'bg-villa-green/15 text-villa-dark'
            else if (selectable) cls = 'hover:bg-villa-green/10 text-villa-dark cursor-pointer'
            else cls = 'text-stone-300 line-through cursor-not-allowed'
            return (
              <button
                key={i}
                type="button"
                disabled={!selectable}
                onClick={() => handleDayClick(date)}
                className={`${base} ${cls}`}
              >
                <span>{date.getDate()}</span>
                {selectable && info && (
                  <span className="text-[9px] leading-none opacity-70">{format(info.price, { compact: true })}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ── States ──
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-villa-muted">
        {t('Loading live availability…')}
      </div>
    )
  }
  if (loadError) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
        <p className="text-villa-dark mb-2">{t("We couldn't load availability right now.")}</p>
        <p className="text-villa-muted text-sm">{t('Please refresh, or contact us directly via WhatsApp.')}</p>
      </div>
    )
  }
  if (done) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-10 text-center max-w-xl mx-auto">
        <div className="text-villa-gold text-3xl mb-4">✦</div>
        <h3 className="font-serif text-2xl text-villa-dark mb-3">{t('Request sent')}</h3>
        <p className="text-villa-muted leading-relaxed">
          {t('Thank you. Your request for {villa} from {from} to {to} has been received. Your host will review and confirm with you shortly. These dates are not blocked until confirmed.')
            .replace('{villa}', villaName)
            .replace('{from}', checkIn ? ymd(checkIn) : '')
            .replace('{to}', checkOut ? ymd(checkOut) : '')}
        </p>
      </div>
    )
  }

  const canBook = checkIn && checkOut

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => setViewMonth(addMonths(viewMonth, -1))}
          disabled={ymd(viewMonth) <= ymd(startOfMonth(today))}
          className="px-3 py-1.5 rounded-lg text-villa-green hover:bg-villa-green/10 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label={t('Previous month')}
        >
          ←
        </button>
        <span className="text-sm text-villa-muted">{t('Select your dates')}</span>
        <button
          type="button"
          onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          className="px-3 py-1.5 rounded-lg text-villa-green hover:bg-villa-green/10"
          aria-label={t('Next month')}
        >
          →
        </button>
      </div>

      {/* Two months side by side */}
      <div className="flex flex-col md:flex-row gap-8">
        <Month monthDate={viewMonth} />
        <Month monthDate={addMonths(viewMonth, 1)} />
      </div>

      {rangeError && <p className="text-sm text-red-600 mt-4 text-center">{rangeError}</p>}

      {/* Summary + form */}
      {canBook && (
        <div className="mt-8 border-t border-stone-100 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-villa-dark font-medium">
                {ymd(checkIn!)} → {ymd(checkOut!)}
              </p>
              <p className="text-villa-muted text-sm">
                {nightsCount} {nightsCount === 1 ? t('night') : t('nights')} ·{' '}
                {discountPct > 0 ? (
                  <>
                    <span className="line-through opacity-60">{money(totalPrice)}</span>{' '}
                    <span className="text-villa-dark font-medium">{money(discountedTotal)}</span> {t('total')}
                  </>
                ) : (
                  <>{money(totalPrice)} {t('total')}</>
                )}
              </p>
              {discountPct > 0 && (
                <p className="text-villa-green text-xs mt-1">
                  {discountPct}% {nightsCount >= 28 ? t('monthly discount applied') : t('weekly discount applied')}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setCheckIn(null)
                setCheckOut(null)
                setRangeError(null)
              }}
              className="text-sm text-villa-muted hover:text-villa-green underline"
            >
              {t('Clear dates')}
            </button>
          </div>

          <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label={t('Full name')}>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
              />
            </Field>
            <Field label={t('Email')}>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input"
              />
            </Field>
            <Field label={t('Guests')}>
              <select
                value={form.guests}
                onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })}
                className="input"
              >
                {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? t('guest') : t('guests')}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t('Phone (optional)')}>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input"
              />
            </Field>
            <div className="md:col-span-2">
              <Field label={t('Message (optional)')}>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="input resize-none"
                />
              </Field>
            </div>

            {submitError && <p className="md:col-span-2 text-sm text-red-600">{submitError}</p>}

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-villa-green text-white font-medium py-3.5 rounded-xl hover:bg-villa-green-light transition-colors disabled:opacity-60"
              >
                {submitting ? t('Sending…') : t('Request to Book')}
              </button>
              <p className="text-center text-xs text-villa-muted mt-3">
                {t('No instant booking. Your host confirms before any dates are blocked.')}
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm text-villa-muted mb-1.5">{label}</span>
      {children}
    </label>
  )
}
