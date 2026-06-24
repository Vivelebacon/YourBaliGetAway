// Client-safe helpers shared by the admin UI.

export function imageUrl(storagePath: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/villa-images/${encodeURI(storagePath)}`
}

// Trigger on-demand revalidation so an edit appears on the live site in seconds.
export async function pushLive(slug: string): Promise<void> {
  try {
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })
  } catch {
    // non-fatal: the page still revalidates on its own timer
  }
}

export function slugifyFilename(name: string): string {
  const dot = name.lastIndexOf('.')
  const base = (dot >= 0 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  const ext = dot >= 0 ? name.slice(dot + 1).toLowerCase() : 'jpg'
  return `${base || 'image'}.${ext}`
}

export interface ImageRow {
  id: string
  villa_id: string
  storage_path: string
  caption: string | null
  category: string | null
  sort_order: number
}

export interface ReviewRow {
  id: string
  villa_id: string
  name: string
  text: string
  sort_order: number
}

export interface VillaRow {
  id: string
  slug: string
  name: string
  subtitle: string | null
  description: string | null
  bedrooms: number
  bathrooms: number
  guests: number
  rating: number | null
  review_count: number
  highlights: string[] | null
  amenities: string[] | null
  cover_image: string | null
  preview_highlights_count: number | null
}
