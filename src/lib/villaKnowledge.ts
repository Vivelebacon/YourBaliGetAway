// ──────────────────────────────────────────────────────────────
// Builds the GUEST-SAFE knowledge base for the chatbot.
// Only public info: villa descriptions, capacity, amenities, public
// pricing/fees, check-in/out, discounts, "from" price. NEVER includes
// financials, staff data, internal notes, or anything not shown publicly.
// ──────────────────────────────────────────────────────────────
import { getVillaSlugs, getVillaBySlug } from './content'
import { getHostawayListingId } from './villas'
import { getListingGuestInfo, getMinNightlyPrice } from './hostaway'

let cache: { text: string; at: number } | null = null
const TTL_MS = 10 * 60 * 1000 // 10 minutes

export async function getVillaKnowledge(): Promise<string> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.text

  const slugs = await getVillaSlugs()
  const blocks: string[] = []

  for (const slug of slugs) {
    const villa = await getVillaBySlug(slug)
    if (!villa) continue
    const listingId = getHostawayListingId(slug)

    let pricing = ''
    if (listingId) {
      try {
        const [info, fromPrice] = await Promise.all([
          getListingGuestInfo(listingId),
          getMinNightlyPrice(listingId),
        ])
        const weeklyPct = Math.round((1 - info.weeklyDiscount) * 100)
        const monthlyPct = Math.round((1 - info.monthlyDiscount) * 100)
        pricing = [
          fromPrice != null ? `From ${fromPrice} ${info.currency}/night (varies by date and season).` : '',
          `Cleaning fee: ${info.cleaningFee} ${info.currency}.`,
          info.extraPersonFee ? `Extra guest fee: ${info.extraPersonFee} ${info.currency}/night beyond ${info.guestsIncluded} guests.` : '',
          `Minimum stay: ${info.minNights} nights.`,
          `Check-in from ${info.checkInTime}, check-out by ${info.checkOutTime}.`,
          weeklyPct > 0 ? `Weekly discount: ${weeklyPct}% off for 7+ nights.` : '',
          monthlyPct > 0 ? `Monthly discount: ${monthlyPct}% off for 28+ nights.` : '',
        ]
          .filter(Boolean)
          .join(' ')
      } catch {
        /* pricing unavailable */
      }
    }

    blocks.push(
      [
        `### ${villa.name} (page: /villas/${slug})`,
        `${villa.subtitle}. ${villa.bedrooms} bedrooms, ${villa.bathrooms} bathrooms, sleeps up to ${villa.guests}. Rating ${villa.rating} (${villa.reviewCount} reviews).`,
        `Highlights: ${villa.highlights.join(', ')}.`,
        `Amenities: ${villa.amenities.join(', ')}.`,
        pricing,
        `About: ${villa.description.replace(/\s+/g, ' ').slice(0, 500)}`,
      ]
        .filter(Boolean)
        .join('\n'),
    )
  }

  const text = blocks.join('\n\n')
  cache = { text, at: Date.now() }
  return text
}
