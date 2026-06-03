// ──────────────────────────────────────────────────────────────
// Hostaway Public API client — SERVER ONLY.
// Never import this from a client component. It reads the secret
// API key from env and talks to Hostaway directly.
// ──────────────────────────────────────────────────────────────

const API_BASE = 'https://api.hostaway.com/v1'

// Channel id for direct/website bookings in Hostaway.
const DIRECT_CHANNEL_ID = 2000

// ── Access token (cached in module memory across warm invocations) ──
let cachedToken: { token: string; expiresAt: number } | null = null

export async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token
  }

  const accountId = process.env.HOSTAWAY_ACCOUNT_ID
  const apiKey = process.env.HOSTAWAY_API_KEY
  if (!accountId || !apiKey) {
    throw new Error('Missing HOSTAWAY_ACCOUNT_ID or HOSTAWAY_API_KEY env var')
  }

  const res = await fetch(`${API_BASE}/accessTokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: accountId,
      client_secret: apiKey,
      scope: 'general',
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Hostaway auth failed (${res.status}): ${text}`)
  }

  const data = (await res.json()) as { access_token: string; expires_in?: number }
  cachedToken = {
    token: data.access_token,
    // Tokens are long-lived; refresh a minute early regardless.
    expiresAt: Date.now() + (data.expires_in ?? 60 * 60 * 24) * 1000,
  }
  return cachedToken.token
}

async function hostawayGet<T>(path: string): Promise<T> {
  const token = await getAccessToken()
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Hostaway GET ${path} failed (${res.status}): ${text}`)
  }
  const json = (await res.json()) as { result: T }
  return json.result
}

// ── Calendar / availability ──
export interface CalendarDay {
  date: string
  isAvailable: number // 1 = bookable, 0 = not
  status: string // 'available' | 'blocked' | 'reserved' | ...
  price: number
  minimumStay: number
  closedOnArrival?: boolean
  closedOnDeparture?: boolean
}

export async function getCalendar(
  listingId: number,
  startDate: string,
  endDate: string,
): Promise<CalendarDay[]> {
  return hostawayGet<CalendarDay[]>(
    `/listings/${listingId}/calendar?startDate=${startDate}&endDate=${endDate}`,
  )
}

// Listing currency, cached per listing in module memory.
const currencyCache = new Map<number, string>()
export async function getListingCurrency(listingId: number): Promise<string> {
  const cached = currencyCache.get(listingId)
  if (cached) return cached
  const listing = await hostawayGet<{ currencyCode?: string }>(`/listings/${listingId}`)
  const currency = listing.currencyCode || 'USD'
  currencyCache.set(listingId, currency)
  return currency
}

// ── Create a request-to-book (inquiry) reservation ──
// status 'inquiry' = a request that does NOT block the calendar.
// Joel approves it in Hostaway before it becomes a confirmed booking.
export interface BookingRequestInput {
  listingId: number
  arrivalDate: string // YYYY-MM-DD
  departureDate: string // YYYY-MM-DD
  guestName: string
  guestEmail: string
  numberOfGuests: number
  phone?: string
  comment?: string
}

export async function createBookingRequest(
  input: BookingRequestInput,
): Promise<{ id: number; status: string }> {
  const token = await getAccessToken()
  const res = await fetch(`${API_BASE}/reservations?forceOverbooking=0`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
    body: JSON.stringify({
      listingMapId: input.listingId,
      channelId: DIRECT_CHANNEL_ID,
      arrivalDate: input.arrivalDate,
      departureDate: input.departureDate,
      guestName: input.guestName,
      guestEmail: input.guestEmail,
      numberOfGuests: input.numberOfGuests,
      phone: input.phone,
      comment: input.comment,
      status: 'inquiry',
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Hostaway create reservation failed (${res.status}): ${text}`)
  }

  const json = (await res.json()) as { result: { id: number; status: string } }
  return json.result
}
