import { NextRequest, NextResponse } from 'next/server'
import { getCalendar, getListingPricing } from '@/lib/hostaway'

// Cache availability briefly at the edge; it doesn't change second-to-second.
export const revalidate = 0

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const listingId = Number(searchParams.get('listingId'))
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  if (!listingId || !start || !end) {
    return NextResponse.json({ error: 'Missing listingId, start or end' }, { status: 400 })
  }

  try {
    const [days, pricing] = await Promise.all([
      getCalendar(listingId, start, end),
      getListingPricing(listingId),
    ])

    const slim = days.map((d) => ({
      date: d.date,
      available: d.isAvailable === 1 && d.status === 'available',
      price: d.price,
      minStay: d.minimumStay,
      closedOnArrival: d.closedOnArrival ?? false,
      closedOnDeparture: d.closedOnDeparture ?? false,
    }))

    return NextResponse.json(
      {
        days: slim,
        currency: pricing.currency,
        weeklyDiscount: pricing.weeklyDiscount,
        monthlyDiscount: pricing.monthlyDiscount,
      },
      { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' } },
    )
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 })
  }
}
