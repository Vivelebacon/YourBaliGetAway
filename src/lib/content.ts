// ──────────────────────────────────────────────────────────────
// Public content layer — reads villa content from Supabase.
// Uses the anon key (public read is allowed by RLS). Safe on server.
// ──────────────────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const STORAGE_BASE = `${SUPABASE_URL}/storage/v1/object/public/villa-images/`

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: { persistSession: false },
})

export function imageUrl(storagePath: string): string {
  return STORAGE_BASE + encodeURI(storagePath)
}

export interface GalleryImage {
  url: string
  caption?: string
  category: string
}

export interface VillaListItem {
  slug: string
  name: string
  subtitle: string
  coverUrl: string
  highlights: string[]
  bedrooms: number
  bathrooms: number
  guests: number
  rating: number
}

export interface VillaDetail extends VillaListItem {
  description: string
  amenities: string[]
  reviewCount: number
  reviews: { name: string; text: string }[]
  images: GalleryImage[]
}

interface VillaRow {
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
}

function toListItem(r: VillaRow): VillaListItem {
  return {
    slug: r.slug,
    name: r.name,
    subtitle: r.subtitle ?? '',
    coverUrl: r.cover_image ? imageUrl(r.cover_image) : '',
    highlights: r.highlights ?? [],
    bedrooms: r.bedrooms,
    bathrooms: r.bathrooms,
    guests: r.guests,
    rating: r.rating ?? 0,
  }
}

export async function getVillasList(): Promise<VillaListItem[]> {
  const { data, error } = await supabase
    .from('villas')
    .select('slug,name,subtitle,cover_image,highlights,bedrooms,bathrooms,guests,rating')
    .order('sort_order', { ascending: true })
  if (error || !data) return []
  return (data as VillaRow[]).map(toListItem)
}

export async function getVillaSlugs(): Promise<string[]> {
  const { data } = await supabase.from('villas').select('slug').order('sort_order')
  return (data ?? []).map((v) => (v as { slug: string }).slug)
}

export async function getVillaBySlug(slug: string): Promise<VillaDetail | null> {
  const { data, error } = await supabase
    .from('villas')
    .select(
      '*, villa_images(storage_path,caption,category,sort_order), reviews(name,text,sort_order)',
    )
    .eq('slug', slug)
    .single()

  if (error || !data) return null

  const row = data as VillaRow & {
    villa_images: { storage_path: string; caption: string | null; category: string; sort_order: number }[]
    reviews: { name: string; text: string; sort_order: number }[]
  }

  const images: GalleryImage[] = [...(row.villa_images ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((img) => ({
      url: imageUrl(img.storage_path),
      caption: img.caption ?? undefined,
      category: img.category,
    }))

  const reviews = [...(row.reviews ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((r) => ({ name: r.name, text: r.text }))

  return {
    ...toListItem(row),
    description: row.description ?? '',
    amenities: row.amenities ?? [],
    reviewCount: row.review_count,
    reviews,
    images,
  }
}
