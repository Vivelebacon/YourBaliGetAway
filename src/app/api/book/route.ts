import { NextRequest, NextResponse } from 'next/server'
import { createBookingRequest } from '@/lib/hostaway'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const listingId = Number(body.listingId)
  const arrivalDate = String(body.arrivalDate ?? '')
  const departureDate = String(body.departureDate ?? '')
  const guestName = String(body.guestName ?? '').trim()
  const guestEmail = String(body.guestEmail ?? '').trim()
  const numberOfGuests = Number(body.numberOfGuests)
  const phone = body.phone ? String(body.phone).trim() : undefined
  const comment = body.comment ? String(body.comment).trim() : undefined

  if (!listingId) return NextResponse.json({ error: 'Missing listingId' }, { status: 400 })
  if (!DATE_RE.test(arrivalDate) || !DATE_RE.test(departureDate)) {
    return NextResponse.json({ error: 'Invalid dates' }, { status: 400 })
  }
  if (departureDate <= arrivalDate) {
    return NextResponse.json({ error: 'Departure must be after arrival' }, { status: 400 })
  }
  if (!guestName) return NextResponse.json({ error: 'Missing name' }, { status: 400 })
  if (!EMAIL_RE.test(guestEmail)) return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  if (!numberOfGuests || numberOfGuests < 1) {
    return NextResponse.json({ error: 'Invalid guest count' }, { status: 400 })
  }

  try {
    const result = await createBookingRequest({
      listingId,
      arrivalDate,
      departureDate,
      guestName,
      guestEmail,
      numberOfGuests,
      phone,
      comment,
    })
    return NextResponse.json({ ok: true, reservationId: result.id, status: result.status })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 })
  }
}
