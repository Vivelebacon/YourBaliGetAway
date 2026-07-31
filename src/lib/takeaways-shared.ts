// Client-safe Takeaways constants and types (no server-only imports).

export interface TakeawayCategory {
  /** Stored on articles and community recs. Never rename an existing slug. */
  slug: string
  label: string
  /** One line shown on the category card and at the top of the category page. */
  description: string
  /**
   * Optional cover for the category card, relative to /public (or a full URL).
   * When absent the card falls back to a tinted brand panel, so a category can
   * be added with copy only and get its photo later.
   */
  image?: string
  /** Hidden from the public category grid (still selectable in the CMS). */
  hidden?: boolean
  /**
   * Categories that live on their own page instead of /takeaways/category/<slug>
   * (Guest Discounts and Perks is deliberately kept apart from recommendations).
   */
  href?: string
}

// The grid is driven entirely by this array: adding a category here (tours,
// water sports, hikes, nightlife, nomad life...) adds a card, a category page
// and an archive filter, with no layout change anywhere.
export const TAKEAWAY_CATEGORIES: TakeawayCategory[] = [
  {
    slug: 'food',
    label: 'Food & Drink',
    description: 'Specific dishes, restaurants, cocktails, tables, and useful ordering advice.',
  },
  {
    slug: 'wellness',
    label: 'Massage & Wellness',
    description: 'Therapists, treatments, wellness experiences, and advice on finding the right specialist.',
  },
  {
    slug: 'beaches',
    label: 'Sunsets, Beach Bars & Live Music',
    description: 'Where to sit, when to arrive, what to wear, and which venues or performances are worth checking.',
  },
  {
    slug: 'activities',
    label: 'Activities & Entertainment',
    description: 'Dance classes, dance socials, shows, nightlife, and other enjoyable things to do around Bali.',
  },
  {
    slug: 'explore',
    label: 'Day Trips & Culture',
    description: 'Excursions, tours, cultural experiences, and places worth exploring beyond the villa.',
  },
  {
    slug: 'practical',
    label: 'Practical Bali Tips',
    description: 'Helpful and entertaining explanations of things visitors often wonder about.',
  },
  {
    slug: 'perks',
    label: 'Guest Discounts & Perks',
    description: 'Current benefits and special offers available to Your Bali Getaway guests.',
    href: '/takeaways/perks',
  },
  {
    slug: 'other',
    label: 'Other',
    description: 'Everything else worth passing on.',
    hidden: true,
  },
]

// Retired slugs kept for label resolution only: existing articles and community
// recs saved under them still render a proper name instead of a raw slug.
const RETIRED_CATEGORY_LABELS: Record<string, string> = {
  bars: 'Food & Drink',
  joel: 'Practical Bali Tips',
}

/** Categories shown in the public grid and in the archive filters. */
export const PUBLIC_CATEGORIES = TAKEAWAY_CATEGORIES.filter((c) => !c.hidden)

export function categoryLabel(slug: string): string {
  return TAKEAWAY_CATEGORIES.find((c) => c.slug === slug)?.label ?? RETIRED_CATEGORY_LABELS[slug] ?? slug
}

export function findCategory(slug: string): TakeawayCategory | undefined {
  return TAKEAWAY_CATEGORIES.find((c) => c.slug === slug)
}

/** Where a category card or label points to. */
export function categoryHref(slug: string): string {
  const cat = findCategory(slug)
  if (cat?.href) return cat.href
  return `/takeaways/category/${slug}`
}

export interface CommunityRec {
  id: string
  authorName: string
  category: string
  title: string
  body: string
  placeName: string | null
  area: string | null
  likesCount: number
  createdAt: string
}
