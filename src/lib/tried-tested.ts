// Tried & Tested: individual recommendations (a therapist, a dish, a table, a
// dance class, a band, a guide) as opposed to full articles.
//
// Deliberately a plain config file for now: the shape of a recommendation is
// not settled yet, so this holds the structure and nothing else. Each entry can
// grow (price, area, booking link, photo) without touching the section layout,
// and the list can move to Supabase later behind the same TriedTestedItem type.
//
// `status: 'placeholder'` renders the slot as a muted "coming soon" card that
// still links to its category page. Swap it to 'live' once the real
// recommendation is written, and add `image` when there is a photo.

export interface TriedTestedItem {
  /** What kind of recommendation this is, shown as the card kicker. */
  kind: string
  /** The recommendation itself, or the slot description while placeholder. */
  title: string
  /** One line of context: why it is worth it, what to ask for. */
  note?: string
  /** Category slug: drives the link to the relevant category page. */
  category: string
  /** Optional photo, relative to /public or a full URL. */
  image?: string
  status: 'live' | 'placeholder'
}

export const TRIED_AND_TESTED: TriedTestedItem[] = [
  { kind: 'Massage & Wellness', title: 'A therapist and a treatment worth booking twice', category: 'wellness', status: 'placeholder' },
  { kind: 'Food & Drink', title: 'One dish, at one restaurant, ordered the right way', category: 'food', status: 'placeholder' },
  { kind: 'Sunsets & Beach Bars', title: 'A sunset spot, and the seat to ask for', category: 'beaches', status: 'placeholder' },
  { kind: 'Activities & Entertainment', title: 'A Latin dance class or social that is genuinely good', category: 'activities', status: 'placeholder' },
  { kind: 'Live Music', title: 'A band or performance worth planning an evening around', category: 'beaches', status: 'placeholder' },
  { kind: 'Day Trips & Culture', title: 'A guide or excursion we would send friends to', category: 'explore', status: 'placeholder' },
]
