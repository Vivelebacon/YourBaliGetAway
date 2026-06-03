'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface VillaResult {
  slug: string
  name: string
  subtitle: string
  coverImage: string
  guests: number
  bedrooms: number
  available: boolean
  total: number
}

function todayISO(offsetDays = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function VillaSearch() {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<VillaResult[] | null>(null)
  const [currency, setCurrency] = useState('USD')
  const [searched, setSearched] = useState(false)

  const money = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n)

  async function search(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!checkIn || !checkOut) {
      setError('Please pick your check-in and check-out dates.')
      return
    }
    if (checkOut <= checkIn) {
      setError('Check-out must be after check-in.')
      return
    }
    setLoading(true)
    setSearched(true)
    try {
      const res = await fetch(`/api/search?start=${checkIn}&end=${checkOut}&guests=${guests}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Search failed')
      setResults(data.villas)
      setCurrency(data.currency || 'USD')
    } catch (err) {
      setError((err as Error).message)
      setResults(null)
    } finally {
      setLoading(false)
    }
  }

  const available = results?.filter((v) => v.available) ?? []

  return (
    <div>
      {/* Search form */}
      <form onSubmit={search} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
        <label className="block">
          <span className="block text-sm text-villa-muted mb-1.5">Check-in</span>
          <input
            type="date"
            min={todayISO()}
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="input"
          />
        </label>
        <label className="block">
          <span className="block text-sm text-villa-muted mb-1.5">Check-out</span>
          <input
            type="date"
            min={checkIn || todayISO(1)}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="input"
          />
        </label>
        <label className="block">
          <span className="block text-sm text-villa-muted mb-1.5">Guests</span>
          <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="input">
            {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="bg-villa-green text-white font-medium py-3 rounded-xl hover:bg-villa-green-light transition-colors disabled:opacity-60"
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

      {/* Results */}
      {searched && !loading && !error && (
        <div className="mt-8">
          {available.length === 0 ? (
            <p className="text-center text-villa-muted py-6">
              No villas available for those dates. Try different dates or fewer guests.
            </p>
          ) : (
            <>
              <p className="text-sm text-villa-muted mb-4">
                {available.length} {available.length === 1 ? 'villa' : 'villas'} available
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {available.map((v) => (
                  <Link
                    key={v.slug}
                    href={`/villas/${v.slug}?checkIn=${checkIn}&checkOut=${checkOut}`}
                    className="group bg-villa-cream rounded-2xl overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={`/images/${v.slug}/${v.coverImage}`}
                        alt={v.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-xl text-villa-dark">{v.name}</h3>
                      <p className="text-villa-muted text-sm mb-3">{v.subtitle}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-villa-dark font-medium">{money(v.total)}</span>
                        <span className="text-villa-green text-sm group-hover:underline">View &amp; book →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
