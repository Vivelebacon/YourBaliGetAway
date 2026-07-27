// ──────────────────────────────────────────────────────────────
// SEO helpers — titles, meta descriptions, canonicals, JSON-LD.
//
// Guest-facing villa copy lives in Supabase and is written for the page
// (long subtitles, rich-text HTML descriptions). That copy is great on the
// page but unusable as-is in <title>/<meta>, so search-engine copy is kept
// here: short, unique, and independent of what the CMS holds.
// ──────────────────────────────────────────────────────────────
import type { VillaDetail, VillaListItem } from '@/lib/content'
import { SITE_URL, SITE_NAME } from '@/lib/site'

// ── Business identity (must match the footer NAP) ──
export const BUSINESS = {
  name: SITE_NAME,
  alternateName: 'YBG Villas',
  telephone: '+62 822-2176-2980',
  email: 'yourbaligetaway.bali@gmail.com',
  addressLocality: 'Seminyak',
  addressRegion: 'Bali',
  addressCountry: 'ID',
  logo: '/logo.jpeg',
} as const

export const ORGANIZATION_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * Plain text from a rich-text/HTML string.
 * Encoded tags are decoded first so `&lt;p&gt;` is stripped like a real tag.
 */
export function stripHtml(input: string): string {
  if (!input) return ''
  return input
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&#x27;|&apos;/gi, "'")
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Trim to `max` chars on a word boundary, without trailing punctuation. */
export function truncateAtWord(text: string, max = 158): string {
  const clean = text.trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.\-]+$/, '')
}

// ── Per-villa search copy ──
// Titles target 50-60 chars, descriptions 140-160, each unique.
interface VillaSeoCopy {
  title: string
  description: string
  /** Optional exact coordinates. Left unset until verified: see README note. */
  geo?: { latitude: number; longitude: number }
}

const VILLA_SEO: Record<string, VillaSeoCopy> = {
  'bali-bliss': {
    title: 'Bali Bliss: 2-Bed Private Pool Villa Seminyak | YBG Villas',
    description:
      'A cheerful 2-bedroom private pool villa in Seminyak, a 10-minute walk from the beach. Book direct with your host: no platform fees, best rate guaranteed.',
    geo: { latitude: -8.68639942, longitude: 115.16202774 },
  },
  'bali-blue-1': {
    title: 'Bali Blue 1: 2-Bed Pool Villa near Eat Street | YBG Villas',
    description:
      'Peaceful 2-bedroom pool villa with a master suite and bathtub, steps from Kayu Aya Eat Street. Book direct: no platform fees and instant confirmation.',
    geo: { latitude: -8.68646431, longitude: 115.16239166 },
  },
  'bali-blue-2': {
    title: 'Bali Blue 2: 2-Bed Pool Villa, Seminyak Bali | YBG Villas',
    description:
      'Relaxed 2-bedroom private pool villa with a lush tropical garden in central Seminyak. Book direct with your host for the best rate and an instant reply.',
    geo: { latitude: -8.68640614, longitude: 115.16242981 },
  },
  'bali-green': {
    title: 'Bali Green: 4-Bed Pool Villa, Seminyak Bali | YBG Villas',
    description:
      'Spacious 4-bedroom private pool villa near Double Six Beach, ideal for groups and families. Book direct: no platform fees, best rate guaranteed.',
    geo: { latitude: -8.697681, longitude: 115.169723 },
  },
  'bali-sol': {
    title: 'Bali Sol: 2-Bed Seminyak Pool Villa + Cinema | YBG Villas',
    description:
      'Exceptionally spacious 2-bedroom Seminyak villa with a private pool and home cinema. Book direct with your host: no fees and instant WhatsApp reply.',
    geo: { latitude: -8.68387318, longitude: 115.16553215 },
  },
}

/** Search title for a villa. Falls back to a short generated title for new slugs. */
export function villaTitle(slug: string, villa: Pick<VillaListItem, 'name' | 'bedrooms'>): string {
  const curated = VILLA_SEO[slug]?.title
  if (curated) return curated
  return `${villa.name}: ${villa.bedrooms}-Bed Pool Villa, Seminyak Bali | YBG Villas`
}

/** Meta description for a villa. Falls back to the CMS description as plain text. */
export function villaDescription(
  slug: string,
  villa: Pick<VillaDetail, 'description'>,
): string {
  const curated = VILLA_SEO[slug]?.description
  if (curated) return curated
  return truncateAtWord(stripHtml(villa.description), 158)
}

/** Canonical (absolute) URL for a villa page. */
export function villaCanonical(slug: string): string {
  return `${SITE_URL}/villas/${slug}`
}

/** Per-villa 1200x630 Open Graph image, generated from the villa's cover photo. */
export function villaOgImage(slug: string): string {
  return VILLA_SEO[slug] ? `/og/${slug}.jpg` : '/og/home.jpg'
}

const postalAddress = {
  '@type': 'PostalAddress',
  addressLocality: BUSINESS.addressLocality,
  addressRegion: BUSINESS.addressRegion,
  addressCountry: BUSINESS.addressCountry,
} as const

/** Sitewide publisher entity. Rendered once in the root layout. */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: BUSINESS.name,
    alternateName: BUSINESS.alternateName,
    url: SITE_URL,
    logo: absoluteUrl(BUSINESS.logo),
    image: absoluteUrl('/og/home.jpg'),
    email: BUSINESS.email,
    telephone: BUSINESS.telephone,
    address: postalAddress,
    areaServed: { '@type': 'Place', name: 'Seminyak, Bali, Indonesia' },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'reservations',
      telephone: BUSINESS.telephone,
      email: BUSINESS.email,
      availableLanguage: ['en', 'id', 'nl', 'fr', 'de', 'es'],
    },
  }
}

/** Sitewide WebSite entity. Rendered once in the root layout. */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: BUSINESS.name,
    url: SITE_URL,
    inLanguage: 'en',
    publisher: { '@id': ORGANIZATION_ID },
  }
}

/**
 * Villa entity: VacationRental (most specific) plus LodgingBusiness so
 * consumers that only match the broader type still resolve it.
 * Only facts shown on the page are emitted: no invented price or coordinates.
 */
export function villaJsonLd(slug: string, villa: VillaDetail) {
  const url = villaCanonical(slug)
  const images = [
    absoluteUrl(villaOgImage(slug)),
    villa.coverUrl,
    ...villa.images.slice(0, 5).map((i) => i.url),
  ].filter(Boolean)

  const geo = VILLA_SEO[slug]?.geo

  return {
    '@context': 'https://schema.org',
    '@type': ['VacationRental', 'LodgingBusiness'],
    '@id': `${url}#lodging`,
    name: villa.name,
    description: villaDescription(slug, villa),
    url,
    image: Array.from(new Set(images)),
    address: postalAddress,
    ...(geo ? { geo: { '@type': 'GeoCoordinates', ...geo } } : {}),
    containedInPlace: { '@type': 'Place', name: 'Seminyak, Bali, Indonesia' },
    numberOfRooms: villa.bedrooms,
    numberOfBedrooms: villa.bedrooms,
    numberOfBathroomsTotal: villa.bathrooms,
    occupancy: {
      '@type': 'QuantitativeValue',
      unitText: 'guests',
      maxValue: villa.guests,
    },
    amenityFeature: villa.amenities.map((name) => ({
      '@type': 'LocationFeatureSpecification',
      name,
      value: true,
    })),
    ...(villa.rating > 0 && villa.reviewCount > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: villa.rating,
            reviewCount: villa.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    brand: { '@id': ORGANIZATION_ID },
    parentOrganization: { '@id': ORGANIZATION_ID },
    isPartOf: { '@id': WEBSITE_ID },
  }
}
