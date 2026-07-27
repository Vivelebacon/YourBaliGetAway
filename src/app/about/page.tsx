// ──────────────────────────────────────────────────────────────
// /about — "Meet Your Hosts".
//
// E-E-A-T page: real people behind the villas (owner Joel + villa manager
// Dewa) and the direct-booking story. Server-rendered with AboutPage +
// Person schema. Copy is deliberately truthful — Dewa's description is
// grounded in the actual guest reviews; nothing biographical is invented.
// Joel should personalise his own paragraph and add real host photos
// (see the avatar note below).
// ──────────────────────────────────────────────────────────────
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getLocale } from '@/lib/locale'
import { getMessages } from '@/lib/translate'
import { SITE_URL, SITE_NAME } from '@/lib/site'
import { ORGANIZATION_ID, WEBSITE_ID } from '@/lib/seo'

const TITLE = 'Meet Your Hosts: Joel & Dewa, Seminyak | YBG Villas'
const DESCRIPTION =
  'Meet the hosts of Your Bali Getaway: five private pool villas in Seminyak run direct by owner Joel and villa manager Dewa. Personal service, no platform fees.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    url: `${SITE_URL}/about`,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/og/home.jpg', width: 1200, height: 630, alt: 'Private pool villas in Seminyak, Bali' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/og/home.jpg'] },
}

// Hosts. Photos: swap `avatar` initials for a real image once available
// (drop a photo in the villa-images bucket and reference it here).
const HOSTS = [
  {
    initial: 'J',
    name: 'Joel',
    role: 'Owner & Host',
    bio: 'Joel is the owner of Your Bali Getaway. He looks after the villas with the care of someone hosting guests in his own home, and he is the reason bookings run direct: better rates for you, and a personal relationship instead of a platform in the middle.',
  },
  {
    initial: 'D',
    name: 'Dewa',
    role: 'Villa Manager',
    bio: 'Dewa is the villa manager, and if you read the guest reviews you will see his name again and again. He is the one who replies within minutes, meets you at the airport, arranges a driver for a day trip, sorts a pool fence or a cot for little ones, and has been known to wait up past midnight to welcome a delayed flight. More than anyone, Dewa is why a stay here feels effortless.',
  },
]

export default async function AboutPage() {
  const locale = await getLocale()
  const messages = await getMessages(locale)
  const t = (s: string) => messages[s] ?? s

  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Meet Your Hosts',
    url: `${SITE_URL}/about`,
    description: DESCRIPTION,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORGANIZATION_ID },
    mainEntity: HOSTS.map((h) => ({
      '@type': 'Person',
      name: h.name,
      jobTitle: h.role,
      worksFor: { '@id': ORGANIZATION_ID },
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t('Home'), item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: t('Meet Your Hosts'), item: `${SITE_URL}/about` },
    ],
  }

  return (
    <div className="min-h-screen bg-villa-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative h-[62vh] min-h-[440px]">
        <Image src="/hero1.jpg" alt="Private pool villas in Seminyak, Bali" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pt-16 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-villa-gold">{t('Your Bali Getaway')}</p>
          <h1 className="mb-4 font-serif text-5xl font-light text-white md:text-7xl">{t('Meet Your Hosts')}</h1>
          <p className="max-w-2xl text-base font-light leading-relaxed text-white/85 md:text-lg">
            {t('Five private pool villas in Seminyak, hosted directly by the people who own and run them.')}
          </p>
        </div>
      </section>

      {/* ── The direct-booking story ── */}
      <section data-nav-light-bg className="px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-villa-gold">{t('Booked Direct')}</p>
          <h2 className="mb-6 font-serif text-3xl font-light text-villa-dark md:text-4xl">
            {t('The people behind the villas')}
          </h2>
          <div className="space-y-5 text-left font-light leading-relaxed text-stone-600 md:text-center">
            <p>
              {t('Your Bali Getaway is a small, independent collection of five private-pool villas in the heart of Seminyak. We host every villa ourselves and take bookings directly, with no online travel agency in between.')}
            </p>
            <p>
              {t('That means no platform fees, the best rate guaranteed, and a real person on WhatsApp from your first question to your last morning. The details are handled by people who actually know the villas, not a faceless call centre.')}
            </p>
          </div>
        </div>
      </section>

      {/* ── The hosts ── */}
      <section data-nav-light-bg className="bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl font-light text-villa-dark md:text-4xl">{t('The team')}</h2>
            <div className="mx-auto mt-5 h-px w-16 bg-villa-gold/70" />
            <p className="mx-auto mt-5 max-w-2xl font-light leading-relaxed text-stone-500">
              {t('Across more than 500 guest reviews, two names come up more than any other.')}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {HOSTS.map((h) => (
              <div key={h.name} className="rounded-2xl bg-villa-cream p-8 shadow-sm">
                <div className="mb-5 flex items-center gap-4">
                  {/* Placeholder avatar — swap for a real host photo when available */}
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-villa-green font-serif text-2xl text-white">
                    {h.initial}
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-villa-dark">{t(h.name)}</h3>
                    <p className="text-sm uppercase tracking-[0.18em] text-villa-gold">{t(h.role)}</p>
                  </div>
                </div>
                <p className="font-light leading-relaxed text-stone-600">{t(h.bio)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section data-nav-light-bg className="px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 font-serif text-3xl font-light text-villa-dark md:text-4xl">
            {t('Come and stay with us')}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl font-light leading-relaxed text-stone-600">
            {t('Browse the five villas and book direct with your host: best rate guaranteed, and an instant reply on WhatsApp.')}
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
