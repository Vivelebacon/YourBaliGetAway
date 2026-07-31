// Guest Discounts & Perks: its own page, on purpose. Discounts are commercial
// arrangements, recommendations are editorial, and the two must not blur into
// each other on the guide.
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Reveal from '@/components/takeaways/Reveal'
import { GUEST_PERKS } from '@/lib/perks'
import { getLocale } from '@/lib/locale'
import { getMessages } from '@/lib/translate'
import { SITE_URL, SITE_NAME } from '@/lib/site'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Guest Discounts & Perks | Our Bali Takeaways',
  description:
    'The current benefits and special offers available to Your Bali Getaway guests: discounts, upgrades and partner perks around Seminyak.',
  alternates: { canonical: `${SITE_URL}/takeaways/perks` },
  openGraph: {
    title: 'Guest Discounts & Perks | Your Bali Getaway',
    description: 'Current benefits and special offers available to Your Bali Getaway guests.',
    url: `${SITE_URL}/takeaways/perks`,
    type: 'website',
    images: ['/takeaways/hero-poster.jpg'],
  },
}

export default async function PerksPage() {
  const locale = await getLocale()
  const messages = await getMessages(locale)
  const t = (s: string) => messages[s] ?? s

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Our Bali Takeaways', item: `${SITE_URL}/takeaways` },
      { '@type': 'ListItem', position: 3, name: 'Guest Discounts & Perks', item: `${SITE_URL}/takeaways/perks` },
    ],
  }

  return (
    <div className="min-h-screen bg-villa-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Navbar />

      {/* ── Header ── */}
      <section className="relative flex min-h-[40vh] items-center justify-center overflow-hidden bg-villa-green px-6 pt-20">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[720px] -translate-x-1/2 rounded-full bg-villa-gold/15 blur-3xl" />
        <div className="relative z-10 py-16 text-center">
          <Link
            href="/takeaways"
            className="mb-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-villa-gold transition-opacity hover:opacity-80"
          >
            <span aria-hidden="true">←</span> {t('Our Bali Takeaways')}
          </Link>
          <h1 className="max-w-3xl font-serif text-4xl font-light text-white md:text-6xl">
            {t('Guest Discounts & Perks')}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-stone-300">
            {t('See the current benefits and special offers available to Your Bali Getaway guests.')}
          </p>
        </div>
      </section>

      {/* ── Perks ── */}
      <section data-nav-light-bg className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          {GUEST_PERKS.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {GUEST_PERKS.map((perk, i) => (
                <Reveal key={perk.name} delay={(i % 3) * 0.06}>
                  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white">
                    {perk.image && (
                      <div className="relative h-40">
                        <Image
                          src={perk.image}
                          alt={perk.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      {perk.area && (
                        <p className="text-[0.7rem] uppercase tracking-[0.22em] text-villa-gold">{perk.area}</p>
                      )}
                      <h2 className="mt-2 font-serif text-2xl font-light text-villa-dark">{perk.name}</h2>
                      <p className="mt-2 text-sm leading-relaxed text-villa-muted">{perk.benefit}</p>
                      {perk.howToClaim && (
                        <p className="mt-4 rounded-xl bg-villa-cream px-4 py-3 text-xs leading-relaxed text-villa-muted">
                          {perk.howToClaim}
                        </p>
                      )}
                      {perk.url && (
                        <a
                          href={perk.url}
                          target="_blank"
                          rel="noreferrer nofollow"
                          className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-villa-green hover:underline"
                        >
                          {t('Visit')} <span aria-hidden="true">↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal className="mx-auto max-w-xl rounded-2xl border border-dashed border-stone-300 bg-white/60 px-8 py-14 text-center">
              <p className="font-serif text-2xl font-light text-villa-dark">{t('Guest benefits are being arranged')}</p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-villa-muted">
                {t('We are putting together discounts and perks with places around the villas. They will be listed here as soon as they are confirmed.')}
              </p>
            </Reveal>
          )}

          <Reveal className="mx-auto mt-12 max-w-2xl rounded-2xl border border-villa-gold/40 bg-[#fdf8ee] px-8 py-6 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-villa-gold">{t('Good to know')}</p>
            <p className="mt-3 text-sm leading-relaxed text-villa-muted">
              {t(
                'A discount is not a recommendation. A business offering a guest benefit does not mean we recommend every product or service it provides. Our recommendations live in the guide, and they are kept separate on purpose.',
              )}
            </p>
            <Link
              href="/takeaways"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-villa-green hover:underline"
            >
              {t('Back to the guide')} <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}
