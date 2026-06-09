// ──────────────────────────────────────────────────────────────
// Hostaway Public API client — SERVER ONLY.
// Never import this from a client component. It reads the secret
// API key from env and talks to Hostaway directly.
//
// ⚠️ SAFETY CONTRACT (do not weaken):
// This client is intentionally restricted to THREE operations:
//   1. authenticate                 → POST /accessTokens
//   2. read availability/listings   → GET  (any path)
//   3. create a request-to-book     → POST /reservations  (status 'inquiry' only)
// It must NEVER cancel, modify, or delete a reservation, nor block/unblock a
// calendar. Hostaway's API key cannot be scoped read-only, so we enforce this
// in code: guardedFetch() throws on any PUT/PATCH/DELETE and on any POST to a
// path other than the two allowed. A leaked-key scenario is out of scope here;
// this guard protects against our own code (or a future edit) ever issuing a
// destructive call to real bookings or the Airbnb-synced calendar.
// ──────────────────────────────────────────────────────────────

const API_BASE = 'https://api.hostaway.com/v1'

// Channel id for direct/website bookings in Hostaway.
const DIRECT_CHANNEL_ID = 2000

// The ONLY non-GET endpoints this client is permitted to call.
const ALLOWED_POST_PATHS = ['/accessTokens', '/reservations']

function assertAllowed(method: string, path: string) {
  const m = (method || 'GET').toUpperCase()
  if (m === 'GET') return // reads are always safe
  const basePath = path.split('?')[0]
  if (m === 'POST' && ALLOWED_POST_PATHS.includes(basePath)) return
  throw new Error(
    `Hostaway client BLOCKED a ${m} ${basePath}. This integration is read + create-inquiry only; ` +
      `cancelling, modifying, deleting reservations or blocking calendars is forbidden.`,
  )
}

// Every call to Hostaway goes through here.
async function guardedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  assertAllowed(init.method ?? 'GET', path)
  return fetch(`${API_BASE}${path}`, init)
}

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

  const res = await guardedFetch('/accessTokens', {
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
  const res = await guardedFetch(path, {
    method: 'GET',
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

// Listing pricing info (currency + length-of-stay discount multipliers),
// cached per listing in module memory.
// weeklyDiscount/monthlyDiscount are Hostaway multipliers (e.g. 0.9 = 10% off).
export interface ListingPricing {
  currency: string
  weeklyDiscount: number // applied for stays >= 7 nights
  monthlyDiscount: number // applied for stays >= 28 nights
}

const pricingCache = new Map<number, ListingPricing>()

export async function getListingPricing(listingId: number): Promise<ListingPricing> {
  const cached = pricingCache.get(listingId)
  if (cached) return cached
  const l = await hostawayGet<{
    currencyCode?: string
    weeklyDiscount?: number
    monthlyDiscount?: number
  }>(`/listings/${listingId}`)
  // Only treat a value as a real discount if it's a fraction in (0, 1).
  const norm = (v?: number) => (typeof v === 'number' && v > 0 && v < 1 ? v : 1)
  const pricing: ListingPricing = {
    currency: l.currencyCode || 'USD',
    weeklyDiscount: norm(l.weeklyDiscount),
    monthlyDiscount: norm(l.monthlyDiscount),
  }
  pricingCache.set(listingId, pricing)
  return pricing
}

// Lowest available nightly price over the next `days` days (for "from X/night").
// Returns the EUR amount, or null if nothing is available.
export async function getMinNightlyPrice(listingId: number, days = 120): Promise<number | null> {
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  const start = new Date()
  const end = new Date()
  end.setDate(end.getDate() + days)
  try {
    const cal = await getCalendar(listingId, fmt(start), fmt(end))
    const prices = cal
      .filter((d) => d.isAvailable === 1 && d.status === 'available' && d.price > 0)
      .map((d) => d.price)
    return prices.length ? Math.min(...prices) : null
  } catch {
    return null
  }
}

// Length-of-stay discount multiplier for a given number of nights.
export function losDiscountMultiplier(
  nights: number,
  p: { weeklyDiscount: number; monthlyDiscount: number },
): number {
  if (nights >= 28) return p.monthlyDiscount
  if (nights >= 7) return p.weeklyDiscount
  return 1
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
  // forceOverbooking=0 ensures we never overwrite an existing reservation.
  const res = await guardedFetch('/reservations?forceOverbooking=0', {
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
      // Hardcoded: a website request is ALWAYS an inquiry. Never a confirmed booking.
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
