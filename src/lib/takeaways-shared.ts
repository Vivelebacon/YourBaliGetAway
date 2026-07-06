// Client-safe Takeaways constants and types (no server-only imports).

export const TAKEAWAY_CATEGORIES = [
  { slug: 'joel', label: "Joel's Specials" },
  { slug: 'food', label: 'Food and Restaurants' },
  { slug: 'wellness', label: 'Massage and Wellness' },
  { slug: 'beaches', label: 'Beaches and Sunsets' },
  { slug: 'explore', label: 'Day Trips and Culture' },
  { slug: 'practical', label: 'Practical Tips' },
] as const

export function categoryLabel(slug: string): string {
  return TAKEAWAY_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug
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
