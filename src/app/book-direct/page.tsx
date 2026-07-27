// ──────────────────────────────────────────────────────────────
// /book-direct — the direct-booking differentiator page.
//
// Targets "book direct / no fees / best rate" intent. Claims are kept
// consistent with the homepage "Why Book Direct" section (no platform fees,
// best rate, instant personal confirmation, WhatsApp). Server-rendered with
// WebPage + BreadcrumbList schema. No prices or invented terms.
// ──────────────────────────────────────────────────────────────
import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getLocale } from '@/lib/locale'
import { getMessages } from '@/lib/translate'
import { SITE_URL, SITE_NAME } from '@/lib/site'
import { WEBSITE_ID, ORGANIZATION_ID } from '@/lib/seo'

const TITLE = 'Book Direct: Best-Rate Seminyak Villas, No Fees | YBG'
const DESCRIPTION =
  'Book your Seminyak villa direct with the host: no platform fees, best rate guaranteed, instant WhatsApp confirmation. Direct always beats the platforms.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/book-direct` },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    url: `${SITE_URL}/book-direct`,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/og/home.jpg', width: 1200, height: 630, alt: 'Private pool villas in Seminyak, Bali' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/og/home.jpg'] },
}

const BENEFITS = [
  { icon: '✦', title: 'No platform fees', body: 'Book direct and skip the service fees the platforms add at checkout. The same villa, for less.' },
  { icon: '◈', title: 'Best rate guaranteed', body: 'Our direct rate is the lowest you will find anywhere: always cheaper than Airbnb or Booking.com.' },
  { icon: '❋', title: 'Talk to your host', body: 'A direct line to your host on WhatsApp, before and during your stay. No call centre in the middle.' },
  { icon: '✧', title: 'Instant confirmation', body: 'Real-time availability and a personal confirmation from your host. No double bookings, ever.' },
]

const STEPS = [
  { n: '1', title: 'Choose your villa', body: 'Browse the five villas and pick the one that fits your trip.' },
  { n: '2', title: 'Send your dates', body: 'Request your dates on the villa page or message us on WhatsApp.' },
  { n: '3', title: 'Your host confirms', body: 'We confirm personally and help with anything you need for your stay.' },
]

export default async function BookDirectPage() {
  const locale = await getLocale()
  const messages = await getMessages(locale)
  const t = (s: string) => messages[s] ?? s

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Book Direct',
    url: `${SITE_URL}/book-direct`,
    description: DESCRIPTION,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORGANIZATION_ID },
  }
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t('Home'), item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: t('Book Direct'), item: `${SITE_URL}/book-direct` },
    ],
  }

  return (
    <div className="min-h-screen bg-villa-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Navbar />

      {/* ── Header (light, so the nav flips to dark text) ── */}
      <section data-nav-light-bg className="px-6 pb-12 pt-40 text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-villa-gold">{t('Booked Direct')}</p>
        <h1 className="mx-auto max-w-3xl font-serif text-4xl font-light text-villa-dark md:text-6xl">
          {t('Book Direct with Your Host')}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl font-light leading-relaxed text-stone-600">
          {t('Same villas, same host, a better price. Book directly with us and skip the platform fees entirely.')}
        </p>
      </section>

      {/* ── Benefits ── */}
      <section data-nav-light-bg className="px-6 pb-8">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div key={b.title} className="rounded-2xl bg-white p-7 text-center shadow-sm">
              <div className="mb-3 text-2xl text-villa-gold">{b.icon}</div>
              <h2 className="mb-2 font-serif text-lg text-villa-dark">{t(b.title)}</h2>
              <p className="text-sm font-light leading-relaxed text-stone-600">{t(b.body)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Direct vs platforms ── */}
      <section data-nav-light-bg className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center font-serif text-3xl font-light text-villa-dark md:text-4xl">
            {t('Direct vs the platforms')}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border-2 border-villa-green bg-white p-8">
              <h3 className="mb-5 font-serif text-2xl text-villa-green">{t('Booking direct with us')}</h3>
              <ul className="space-y-3 text-sm text-stone-700">
                {[
                  'No platform or service fees',
                  'The best rate, guaranteed',
                  'A direct line to your host on WhatsApp',
                  'Personal help: airport pickup, drivers, local tips',
                  'Real-time availability and instant confirmation',
                ].map((li) => (
                  <li key={li} className="flex items-start gap-3">
                    <span className="mt-0.5 text-villa-green" aria-hidden="true">✓</span>
                    <span>{t(li)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white/60 p-8">
              <h3 className="mb-5 font-serif text-2xl text-stone-400">{t('Booking through a platform')}</h3>
              <ul className="space-y-3 text-sm text-stone-500">
                {[
                  'Guest service fees added at checkout',
                  'The same villa, at a higher total price',
                  'Messages go through the platform',
                  'Generic, third-party support',
                  'The host is one step removed from your stay',
                ].map((li) => (
                  <li key={li} className="flex items-start gap-3">
                    <span className="mt-0.5 text-stone-300" aria-hidden="true">✕</span>
                    <span>{t(li)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── How to book ── */}
      <section data-nav-light-bg className="bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center font-serif text-3xl font-light text-villa-dark md:text-4xl">
            {t('How to book direct')}
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-villa-green font-serif text-xl text-white">
                  {s.n}
                </div>
                <h3 className="mb-2 font-serif text-xl text-villa-dark">{t(s.title)}</h3>
                <p className="mx-auto max-w-xs text-sm font-light leading-relaxed text-stone-600">{t(s.body)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section data-nav-light-bg className="px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 font-serif text-3xl font-light text-villa-dark md:text-4xl">
            {t('Ready to book direct?')}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl font-light leading-relaxed text-stone-600">
            {t('Browse the villas and send your dates, or message your host on WhatsApp for an instant reply.')}
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
