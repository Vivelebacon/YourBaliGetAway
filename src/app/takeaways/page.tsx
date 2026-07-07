import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TakeawaysHero from '@/components/takeaways/TakeawaysHero'
import ScrubShowcase from '@/components/takeaways/ScrubShowcase'
import Reveal from '@/components/takeaways/Reveal'
import ArticleCard from '@/components/takeaways/ArticleCard'
import RecFeed from '@/components/takeaways/RecFeed'
import { getArticlesList, getApprovedRecs, TAKEAWAY_CATEGORIES, categoryLabel } from '@/lib/takeaways'
import { getLocale } from '@/lib/locale'
import { getMessages, translateTexts } from '@/lib/translate'
import { SITE_URL, SITE_NAME } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Our Bali Takeaways | The Insider Bali Guide by Your Bali Getaway',
  description:
    'The insider guide to Bali by your hosts and fellow guests: the best restaurants in Seminyak, massages, beaches, day trips and the exact tips locals give their friends.',
  alternates: { canonical: `${SITE_URL}/takeaways` },
  openGraph: {
    title: 'Our Bali Takeaways | The Insider Bali Guide',
    description:
      'Restaurants, massages, beaches, day trips: real Bali recommendations from the hosts of five private pool villas in Seminyak, and from the guests who stayed there.',
    url: `${SITE_URL}/takeaways`,
    type: 'website',
    images: ['/takeaways/hero-poster.jpg'],
  },
}

export default async function TakeawaysPage() {
  const locale = await getLocale()
  const [articles, recs, messages] = await Promise.all([
    getArticlesList(locale),
    getApprovedRecs(3),
    getMessages(locale),
  ])
  const t = (s: string) => messages[s] ?? s

  const featured = articles.filter((a) => a.featured)
  const rest = articles.filter((a) => !a.featured)

  // Category labels for the chips row, translated once server-side.
  const catLabels = await translateTexts(TAKEAWAY_CATEGORIES.map((c) => c.label), locale)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Our Bali Takeaways',
    description: metadata.description,
    url: `${SITE_URL}/takeaways`,
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    hasPart: articles.map((a) => ({
      '@type': 'Article',
      headline: a.title,
      url: `${SITE_URL}/takeaways/${a.slug}`,
      image: a.coverUrl || undefined,
    })),
  }

  return (
    <div className="min-h-screen bg-villa-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <TakeawaysHero />

      {/* ── Category chips ── */}
      <section data-nav-light-bg className="px-6 pt-16">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-2">
          {TAKEAWAY_CATEGORIES.map((c, i) =>
            c.slug === 'other' ? null : (
              <span
                key={c.slug}
                className="rounded-full border border-villa-green/25 bg-white px-4 py-1.5 text-xs uppercase tracking-[0.14em] text-villa-green"
              >
                {catLabels[i] ?? c.label}
              </span>
            ),
          )}
        </div>
      </section>

      {articles.length > 0 ? (
        <>
          {/* ── Featured ── */}
          {featured.length > 0 && (
            <section data-nav-light-bg className="px-6 py-16">
              <div className="mx-auto max-w-6xl">
                <Reveal className="mb-10 text-center">
                  <p className="mb-3 text-sm uppercase tracking-[0.3em] text-villa-gold">{t('Featured')}</p>
                  <h2 className="font-serif text-4xl font-light text-villa-dark md:text-5xl">
                    {t('Our Bali Takeaways')}
                  </h2>
                  <div className="mx-auto mt-6 h-px w-16 bg-villa-gold/70" />
                </Reveal>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {featured.map((a, i) => (
                    <Reveal key={a.slug} delay={i * 0.08}>
                      <ArticleCard
                        article={a}
                        categoryLabel={t(categoryLabel(a.category))}
                        readLabel={t('Read article')}
                        large
                      />
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── All guides ── */}
          <section data-nav-light-bg className="px-6 pb-20">
            <div className="mx-auto max-w-6xl">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((a, i) => (
                  <Reveal key={a.slug} delay={(i % 3) * 0.08}>
                    <ArticleCard
                      article={a}
                      categoryLabel={t(categoryLabel(a.category))}
                      readLabel={t('Read article')}
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        /* ── No articles yet: elegant "coming soon" state ── */
        <section data-nav-light-bg className="px-6 py-24">
          <Reveal className="mx-auto max-w-xl text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-villa-gold/15 text-2xl text-villa-gold">
              ✦
            </div>
            <h2 className="font-serif text-3xl font-light text-villa-dark md:text-4xl">
              {t('Recommendations coming soon')}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-villa-muted">
              {t('Our hosts are writing up their favourite Bali spots. Check back very soon, or share your own below.')}
            </p>
            <div className="mx-auto mt-6 h-px w-16 bg-villa-gold/70" />
          </Reveal>
        </section>
      )}

      {/* ── 3D scroll moment: step inside the villas ── */}
      <ScrubShowcase />

      {/* ── Community teaser ── */}
      <section data-nav-light-bg className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal className="mb-10 text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-villa-gold">{t('From the community')}</p>
            <h2 className="font-serif text-4xl font-light text-villa-dark md:text-5xl">{t('The community wall')}</h2>
            <p className="mx-auto mt-4 max-w-lg text-villa-muted">{t('Real tips left by guests who stayed with us.')}</p>
            <div className="mx-auto mt-6 h-px w-16 bg-villa-gold/70" />
          </Reveal>
          <RecFeed initialRecs={recs} showComposer={false} pageSize={99} />
          <div className="mt-10 text-center">
            <Link
              href="/takeaways/community"
              className="inline-block rounded-full bg-villa-green px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-villa-green-light"
            >
              {t('Join the community')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Join band ── */}
      <section className="relative overflow-hidden bg-villa-green px-6 py-20 text-center">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[640px] -translate-x-1/2 rounded-full bg-villa-gold/10 blur-3xl" />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-serif text-3xl font-light text-white md:text-4xl">{t('Join Our Bali Takeaways')}</h2>
          <p className="mt-4 text-stone-300">
            {t('Share your own Bali finds, save your favourites and unlock the insider picks.')}
          </p>
          <Link
            href="/takeaways/join"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3 text-sm font-medium text-villa-green transition-colors hover:bg-villa-cream"
          >
            {t('Create a free account')}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
