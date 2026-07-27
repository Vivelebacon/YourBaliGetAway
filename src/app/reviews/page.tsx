// ──────────────────────────────────────────────────────────────
// /reviews — guest reviews across all five villas.
//
// Trust / E-E-A-T page. Server-rendered real guest quotes, grouped by villa.
// Schema: per-villa VacationRental nodes (same @id as the villa pages) with
// real AggregateRating + Review items (author + reviewBody). No per-review
// star rating is emitted — the reviews table has no per-review score, and
// none is invented.
// ──────────────────────────────────────────────────────────────
import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getAllVillaReviews } from '@/lib/content'
import { getLocale } from '@/lib/locale'
import { getMessages } from '@/lib/translate'
import { SITE_URL, SITE_NAME } from '@/lib/site'
import { villaCanonical, WEBSITE_ID, ORGANIZATION_ID } from '@/lib/seo'

const TITLE = 'Guest Reviews | Your Bali Getaway Villas in Seminyak'
const DESCRIPTION =
  'Read real guest reviews of Your Bali Getaway’s five private pool villas in Seminyak. Hundreds of stays, rated 4.9+ on Airbnb, hosted direct by Joel and Dewa.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/reviews` },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    url: `${SITE_URL}/reviews`,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/og/home.jpg', width: 1200, height: 630, alt: 'Private pool villas in Seminyak, Bali' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/og/home.jpg'] },
}

export default async function ReviewsPage() {
  const locale = await getLocale()
  const [groups, messages] = await Promise.all([getAllVillaReviews(locale), getMessages(locale)])
  const t = (s: string) => messages[s] ?? s

  // Overall stats (only over villas that actually have a rating + count).
  const rated = groups.filter((g) => g.rating > 0 && g.reviewCount > 0)
  const totalReviews = rated.reduce((n, g) => n + g.reviewCount, 0)
  const avg =
    totalReviews > 0
      ? (rated.reduce((s, g) => s + g.rating * g.reviewCount, 0) / totalReviews).toFixed(2)
      : null

  // Per-villa VacationRental nodes (same @id as villa pages) with real
  // AggregateRating + genuine Review items.
  const reviewJsonLd = groups
    .filter((g) => g.reviews.length > 0)
    .map((g) => ({
      '@context': 'https://schema.org',
      '@type': ['VacationRental', 'LodgingBusiness'],
      '@id': `${villaCanonical(g.slug)}#lodging`,
      name: g.name,
      url: villaCanonical(g.slug),
      ...(g.rating > 0 && g.reviewCount > 0
        ? {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: g.rating,
              reviewCount: g.reviewCount,
              bestRating: 5,
              worstRating: 1,
            },
          }
        : {}),
      review: g.reviews.map((rv) => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: rv.name },
        reviewBody: rv.text,
        itemReviewed: { '@id': `${villaCanonical(g.slug)}#lodging` },
      })),
    }))

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t('Home'), item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: t('Guest Reviews'), item: `${SITE_URL}/reviews` },
    ],
  }

  return (
    <div className="min-h-screen bg-villa-cream">
      {reviewJsonLd.map((node) => (
        <script
          key={node['@id']}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Navbar />

      {/* ── Header (light, so the nav flips to dark text) ── */}
      <section data-nav-light-bg className="px-6 pb-12 pt-40 text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-villa-gold">{t('Loved by our guests')}</p>
        <h1 className="font-serif text-4xl font-light text-villa-dark md:text-6xl">{t('Guest Reviews')}</h1>
        {avg && (
          <div className="mt-6 flex flex-wrap items-baseline justify-center gap-2 text-villa-dark">
            <span className="text-villa-gold">★</span>
            <span className="font-serif text-3xl">{avg}</span>
            <span className="text-stone-500">
              {t('average across {n} guest reviews').replace('{n}', String(totalReviews))}
            </span>
          </div>
        )}
      </section>

      {/* ── Reviews grouped by villa ── */}
      <section data-nav-light-bg className="px-6 pb-20">
        <div className="mx-auto max-w-6xl space-y-16">
          {groups
            .filter((g) => g.reviews.length > 0)
            .map((g) => (
              <div key={g.slug}>
                <div className="mb-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <Link href={`/villas/${g.slug}`}>
                    <h2 className="font-serif text-3xl font-light text-villa-dark transition-colors hover:text-villa-green">
                      {g.name}
                    </h2>
                  </Link>
                  {g.rating > 0 && (
                    <span className="text-sm text-villa-gold">
                      ★ {g.rating}
                      <span className="ml-2 text-stone-400">
                        {t('({n} reviews on Airbnb)').replace('{n}', String(g.reviewCount))}
                      </span>
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {g.reviews.map((rv, i) => (
                    <div key={`${g.slug}-${i}`} className="rounded-xl bg-white p-6 shadow-sm">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-villa-green text-sm font-medium text-white">
                          {rv.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-villa-dark">{rv.name}</p>
                          <div className="mt-0.5 flex gap-0.5">
                            {[...Array(5)].map((_, s) => (
                              <span key={s} className="text-xs text-villa-gold">★</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm italic leading-relaxed text-stone-600">&ldquo;{rv.text}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section data-nav-light-bg className="bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 font-serif text-3xl font-light text-villa-dark md:text-4xl">
            {t('Your stay could be the next review')}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl font-light leading-relaxed text-stone-600">
            {t('Browse the villas and book direct with your host: best rate guaranteed, and an instant reply on WhatsApp.')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/villas"
              className="inline-flex items-center justify-center rounded-full bg-villa-green px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-villa-green-light"
            >
              {t('View our villas')}
            </Link>
            <a
              href="https://wa.me/6282221762980"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-villa-green px-7 py-3 text-sm font-medium text-villa-green transition-colors hover:bg-villa-green hover:text-white"
            >
              {t('WhatsApp Us')}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
