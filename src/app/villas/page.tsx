// ──────────────────────────────────────────────────────────────
// /villas — the villa collection hub.
//
// Why this page exists (SEO): the homepage villa grid is client-rendered
// (HomeClient, ssr:false), so search engines and AI crawlers never see the
// villa list or its links on "/". This hub is fully server-rendered: real
// <a> links, real text, ItemList + BreadcrumbList schema. It is the internal
// linking anchor for the whole site and fixes the /villas 404.
// ──────────────────────────────────────────────────────────────
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getVillasList } from '@/lib/content'
import { getLocale } from '@/lib/locale'
import { getMessages } from '@/lib/translate'
import { SITE_URL, SITE_NAME } from '@/lib/site'
import { absoluteUrl, villaCanonical, ORGANIZATION_ID, WEBSITE_ID } from '@/lib/seo'

const TITLE = 'Our Villas: 5 Private Pool Villas in Seminyak | YBG'
const DESCRIPTION =
  'Browse all five Your Bali Getaway private pool villas in Seminyak, from 2-bedroom couples’ retreats to a 4-bedroom family villa. Book direct, no platform fees.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/villas` },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    url: `${SITE_URL}/villas`,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/og/home.jpg', width: 1200, height: 630, alt: 'Private pool villas in Seminyak, Bali' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/og/home.jpg'] },
}

export default async function VillasHubPage() {
  const locale = await getLocale()
  const [villas, messages] = await Promise.all([getVillasList(locale), getMessages(locale)])
  const t = (s: string) => messages[s] ?? s

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Our Villas',
    description: DESCRIPTION,
    url: `${SITE_URL}/villas`,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORGANIZATION_ID },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: villas.length,
      itemListElement: villas.map((v, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: villaCanonical(v.slug),
        name: v.name,
      })),
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t('Home'), item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: t('Our Villas'), item: `${SITE_URL}/villas` },
    ],
  }

  return (
    <div className="min-h-screen bg-villa-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative h-[68vh] min-h-[480px]">
        <Image src="/hero1.jpg" alt="Private pool villas in Seminyak, Bali" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pt-16 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-villa-gold">{t('The Collection')}</p>
          <h1 className="mb-4 font-serif text-5xl font-light text-white md:text-7xl">{t('Our Villas')}</h1>
          <p className="max-w-2xl text-base font-light leading-relaxed text-white/85 md:text-lg">
            {t('Five private pool villas in the heart of Seminyak, booked direct with your host. No platform fees, best rate guaranteed.')}
          </p>
        </div>
      </section>

      {/* ── Villa grid ── */}
      <section data-nav-light-bg className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {villas.map((villa) => (
              <div
                key={villa.slug}
                className="group flex flex-col overflow-hidden rounded-2xl border border-transparent bg-white shadow-sm transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-villa-gold/30 hover:shadow-[0_24px_50px_-18px_rgba(61,90,62,0.35)]"
              >
                <Link href={`/villas/${villa.slug}`} className="relative block h-64 overflow-hidden">
                  {villa.coverUrl && (
                    <Image
                      src={villa.coverUrl}
                      alt={villa.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex flex-wrap gap-1">
                      {villa.highlights.slice(0, villa.previewHighlightsCount ?? 3).map((h) => (
                        <span
                          key={h}
                          className="rounded-full border border-white/30 bg-white/20 px-2 py-0.5 text-xs text-white backdrop-blur-sm"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-1 flex items-start justify-between gap-3">
                    <Link href={`/villas/${villa.slug}`}>
                      <h2 className="font-serif text-2xl text-villa-dark transition-colors duration-300 group-hover:text-villa-green">
                        {villa.name}
                      </h2>
                    </Link>
                    <span className="flex items-center gap-1 whitespace-nowrap text-sm text-villa-gold">★ {villa.rating}</span>
                  </div>
                  <p className="mb-4 line-clamp-2 text-sm text-villa-muted">{villa.subtitle}</p>
                  <div className="mb-5 flex items-center gap-4 text-sm text-villa-muted">
                    <span>{villa.bedrooms} {t('BR')}</span>
                    <span aria-hidden="true">·</span>
                    <span>{villa.bathrooms} {t('BA')}</span>
                    <span aria-hidden="true">·</span>
                    <span>{t('Up to {n}').replace('{n}', String(villa.guests))} {t('guests')}</span>
                  </div>
                  <div className="mt-auto flex items-center gap-3 pt-1">
                    <Link
                      href={`/villas/${villa.slug}#book`}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-villa-green px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-villa-green-light"
                    >
                      {t('Check availability')}
                    </Link>
                    <Link
                      href={`/villas/${villa.slug}`}
                      className="group/view inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium text-villa-green"
                    >
                      {t('View villa')}
                      <span className="inline-block transition-transform duration-300 group-hover/view:translate-x-1" aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Book direct band ── */}
      <section data-nav-light-bg className="bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-villa-gold">{t('Direct Booking')}</p>
          <h2 className="mb-4 font-serif text-3xl font-light text-villa-dark md:text-4xl">
            {t('Book direct with your host')}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl font-light leading-relaxed text-stone-600">
            {t('Every villa is booked directly with us: no platform fees, the best rate guaranteed, and an instant reply on WhatsApp.')}
          </p>
          <a
            href="https://wa.me/6282221762980"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-villa-green px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-villa-green-light"
          >
            {t('WhatsApp Us')}
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
