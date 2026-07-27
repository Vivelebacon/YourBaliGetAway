// ──────────────────────────────────────────────────────────────
// /faq — Frequently Asked Questions.
//
// Server-rendered with FAQPage schema, which feeds Google's AI Overviews
// and Maps AI answers. Answers are deliberately truthful: grounded in the
// villa data and genuine guest reviews. No prices, cancellation terms or
// check-in times are invented — those point the guest to WhatsApp.
// ──────────────────────────────────────────────────────────────
import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getLocale } from '@/lib/locale'
import { getMessages } from '@/lib/translate'
import { SITE_URL, SITE_NAME } from '@/lib/site'
import { WEBSITE_ID, ORGANIZATION_ID } from '@/lib/seo'

const TITLE = 'FAQ: Booking Your Seminyak Villa | Your Bali Getaway'
const DESCRIPTION =
  'Answers to common questions about booking a Your Bali Getaway villa in Seminyak: how to book direct, location, private pools, airport pickup, families and pets.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/faq` },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    url: `${SITE_URL}/faq`,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/og/home.jpg', width: 1200, height: 630, alt: 'Private pool villas in Seminyak, Bali' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/og/home.jpg'] },
}

// Single source of truth: rendered on the page AND emitted as FAQPage schema.
const FAQS: { q: string; a: string }[] = [
  {
    q: 'How do I book one of the villas?',
    a: 'Book directly with us: send a request on the villa page or message us on WhatsApp, and your host confirms your dates. There are no platform fees, the rate is guaranteed to be the best available, and you get an instant, personal reply.',
  },
  {
    q: 'Where are the villas located?',
    a: 'All five villas are in Seminyak, Bali, close to Kayu Aya (Eat Street), Seminyak Beach and Double Six Beach, and within easy reach of the area’s restaurants, beach clubs, spas and shops.',
  },
  {
    q: 'How many villas are there, and what sizes?',
    a: 'There are five private-pool villas. Four are two-bedroom villas ideal for couples, families and small groups, and Bali Green is a spacious four-bedroom villa for larger groups and families.',
  },
  {
    q: 'Does every villa have a private pool?',
    a: 'Yes. All five villas have their own private pool, along with air conditioning, high-speed WiFi and daily housekeeping.',
  },
  {
    q: 'Why book direct instead of Airbnb or Booking.com?',
    a: 'Booking direct means no online travel agency fees, the best rate guaranteed, and a direct line to your host on WhatsApp for anything you need before or during your stay.',
  },
  {
    q: 'Can you arrange airport pickup and transport?',
    a: 'Yes. Your villa manager can arrange airport pickup, drivers for day trips and trusted local recommendations. Just let us know your flight details on WhatsApp.',
  },
  {
    q: 'Are the villas suitable for families with young children?',
    a: 'Yes. Extras such as a pool safety fence or a cot can be arranged on request, and Bali Green’s four bedrooms suit larger families. Tell us what you need when you book and we will have it ready.',
  },
  {
    q: 'Are pets allowed?',
    a: 'Bali Green is pet-friendly. The other villas are not, so please check with us before booking if you plan to travel with a pet.',
  },
  {
    q: 'How do I check availability and current rates?',
    a: 'Live availability is shown on each villa’s page, where you can send a booking request. Message us on WhatsApp for current rates, minimum stay and any current offers.',
  },
]

export default async function FaqPage() {
  const locale = await getLocale()
  const messages = await getMessages(locale)
  const t = (s: string) => messages[s] ?? s

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/faq#faq`,
    url: `${SITE_URL}/faq`,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORGANIZATION_ID },
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t('Home'), item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: t('FAQ'), item: `${SITE_URL}/faq` },
    ],
  }

  return (
    <div className="min-h-screen bg-villa-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Navbar />

      {/* ── Header (light, so the nav flips to dark text) ── */}
      <section data-nav-light-bg className="px-6 pb-14 pt-40 text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-villa-gold">{t('Good to Know')}</p>
        <h1 className="mx-auto max-w-3xl font-serif text-4xl font-light text-villa-dark md:text-6xl">
          {t('Frequently Asked Questions')}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl font-light leading-relaxed text-stone-600">
          {t('Everything you need to know about booking a private pool villa with us in Seminyak.')}
        </p>
      </section>

      {/* ── FAQ list ── */}
      <section data-nav-light-bg className="px-6 pb-20">
        <div className="mx-auto max-w-3xl divide-y divide-stone-200 border-t border-stone-200">
          {FAQS.map((f) => (
            <div key={f.q} className="py-7">
              <h2 className="font-serif text-xl text-villa-dark md:text-2xl">{t(f.q)}</h2>
              <p className="mt-3 font-light leading-relaxed text-stone-600">{t(f.a)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section data-nav-light-bg className="bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 font-serif text-3xl font-light text-villa-dark md:text-4xl">{t('Still have a question?')}</h2>
          <p className="mx-auto mb-8 max-w-2xl font-light leading-relaxed text-stone-600">
            {t('Message us on WhatsApp and your host will get straight back to you.')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/6282221762980"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-villa-green px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-villa-green-light"
            >
              {t('WhatsApp Us')}
            </a>
            <Link
              href="/villas"
              className="inline-flex items-center justify-center rounded-full border border-villa-green px-7 py-3 text-sm font-medium text-villa-green transition-colors hover:bg-villa-green hover:text-white"
            >
              {t('View our villas')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
