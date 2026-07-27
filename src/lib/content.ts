// ──────────────────────────────────────────────────────────────
// Public content layer — reads villa content from Supabase.
// Uses the anon key (public read is allowed by RLS). Safe on server.
// ──────────────────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js'
import { translateTexts } from '@/lib/translate'

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
  previewHighlightsCount: number
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
  preview_highlights_count: number | null
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
    previewHighlightsCount: r.preview_highlights_count ?? 3,
  }
}

// ── Localization: translate the guest-facing CMS text into `locale`.
// Villa/brand names are intentionally left untranslated. English is a no-op.
async function localizeList(items: VillaListItem[], locale: string): Promise<VillaListItem[]> {
  if (locale === 'en' || items.length === 0) return items
  const src: string[] = []
  for (const v of items) {
    src.push(v.subtitle)
    for (const h of v.highlights) src.push(h)
  }
  const tr = await translateTexts(src, locale)
  let k = 0
  return items.map((v) => {
    const subtitle = tr[k++] ?? v.subtitle
    const highlights = v.highlights.map(() => tr[k++] ?? '')
    return { ...v, subtitle, highlights }
  })
}

async function localizeDetail(v: VillaDetail, locale: string): Promise<VillaDetail> {
  if (locale === 'en') return v
  const src: string[] = [
    v.subtitle,
    v.description,
    ...v.highlights,
    ...v.amenities,
    ...v.reviews.map((r) => r.text),
    ...v.images.map((i) => i.caption ?? ''),
  ]
  const tr = await translateTexts(src, locale)
  let k = 0
  const subtitle = tr[k++] ?? v.subtitle
  const description = tr[k++] ?? v.description
  const highlights = v.highlights.map(() => tr[k++] ?? '')
  const amenities = v.amenities.map(() => tr[k++] ?? '')
  const reviews = v.reviews.map((r) => ({ ...r, text: tr[k++] ?? r.text }))
  const images = v.images.map((i) => {
    const t = tr[k++]
    return { ...i, caption: i.caption ? t ?? i.caption : i.caption }
  })
  return { ...v, subtitle, description, highlights, amenities, reviews, images }
}

export async function getVillasList(locale = 'en'): Promise<VillaListItem[]> {
  const { data, error } = await supabase
    .from('villas')
    .select('slug,name,subtitle,cover_image,highlights,bedrooms,bathrooms,guests,rating,preview_highlights_count')
    .order('sort_order', { ascending: true })
  if (error || !data) return []
  return localizeList((data as VillaRow[]).map(toListItem), locale)
}

export async function getVillaSlugs(): Promise<string[]> {
  const { data } = await supabase.from('villas').select('slug').order('sort_order')
  return (data ?? []).map((v) => (v as { slug: string }).slug)
}

export interface VillaReviewsGroup {
  slug: string
  name: string
  rating: number
  reviewCount: number
  reviews: { name: string; text: string }[]
}

// All villas with their curated guest reviews, in one query. Used by /reviews.
export async function getAllVillaReviews(locale = 'en'): Promise<VillaReviewsGroup[]> {
  const { data, error } = await supabase
    .from('villas')
    .select('slug,name,rating,review_count,reviews(name,text,sort_order)')
    .order('sort_order', { ascending: true })
  if (error || !data) return []

  const groups: VillaReviewsGroup[] = (
    data as (VillaRow & { reviews: { name: string; text: string; sort_order: number }[] })[]
  ).map((r) => ({
    slug: r.slug,
    name: r.name,
    rating: r.rating ?? 0,
    reviewCount: r.review_count,
    reviews: [...(r.reviews ?? [])]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((x) => ({ name: x.name, text: x.text })),
  }))

  if (locale === 'en') return groups

  // Localize review text only (guest names and villa names stay as-is).
  const src: string[] = []
  for (const g of groups) for (const rv of g.reviews) src.push(rv.text)
  const tr = await translateTexts(src, locale)
  let k = 0
  return groups.map((g) => ({
    ...g,
    reviews: g.reviews.map((rv) => ({ ...rv, text: tr[k++] ?? rv.text })),
  }))
}

export async function getVillaBySlug(slug: string, locale = 'en'): Promise<VillaDetail | null> {
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

  const detail: VillaDetail = {
    ...toListItem(row),
    description: row.description ?? '',
    amenities: row.amenities ?? [],
    reviewCount: row.review_count,
    reviews,
    images,
  }
  return localizeDetail(detail, locale)
}
