import { NextRequest, NextResponse } from 'next/server'
import { getCalendar, getListingCurrency } from '@/lib/hostaway'
import { getHostawayListingId } from '@/lib/villas'
import { getVillasList } from '@/lib/content'

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function nightsBetween(start: string, end: string) {
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86_400_000)
}

// GET /api/search?start=YYYY-MM-DD&end=YYYY-MM-DD&guests=2
// Returns each villa with whether it's available for the whole range + total price.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const start = searchParams.get('start') ?? ''
  const end = searchParams.get('end') ?? ''
  const guests = Number(searchParams.get('guests') || '1')

  if (!DATE_RE.test(start) || !DATE_RE.test(end)) {
    return NextResponse.json({ error: 'Invalid dates' }, { status: 400 })
  }
  if (end <= start) {
    return NextResponse.json({ error: 'Departure must be after arrival' }, { status: 400 })
  }

  const totalNights = nightsBetween(start, end)
  let currency = 'USD'

  const villas = await getVillasList()

  const results = await Promise.all(
    villas.map(async (v) => {
      const listingId = getHostawayListingId(v.slug)
      const base = {
        slug: v.slug,
        name: v.name,
        subtitle: v.subtitle,
        coverUrl: v.coverUrl,
        guests: v.guests,
        bedrooms: v.bedrooms,
      }
      if (!listingId) return { ...base, available: false, total: 0 }
      if (v.guests < guests) return { ...base, available: false, total: 0 }

      try {
        const days = await getCalendar(listingId, start, end)
        const byDate = new Map(days.map((d) => [d.date, d]))
        // Check each night from start (inclusive) to end (exclusive).
        let total = 0
        let available = true
        const d = new Date(start)
        for (let i = 0; i < totalNights; i++) {
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
          const info = byDate.get(key)
          if (!info || info.isAvailable !== 1 || info.status !== 'available') {
            available = false
            break
          }
          total += info.price
          d.setDate(d.getDate() + 1)
        }
        // Minimum-stay check on the arrival night.
        const arrivalInfo = byDate.get(start)
        if (available && arrivalInfo && totalNights < arrivalInfo.minimumStay) {
          available = false
        }
        return { ...base, available, total: available ? total : 0 }
      } catch {
        return { ...base, available: false, total: 0 }
      }
    }),
  )

  try {
    const firstId = villas[0] ? getHostawayListingId(villas[0].slug) : undefined
    if (firstId) currency = await getListingCurrency(firstId)
  } catch {
    /* keep default */
  }

  return NextResponse.json(
    { nights: totalNights, currency, villas: results },
    { headers: { 'Cache-Control': 's-maxage=120, stale-while-revalidate=300' } },
  )
}
