// ──────────────────────────────────────────────────────────────
// Our Bali Takeaways: the navigation hub for articles, recommendations,
// practical Bali information and guest benefits.
//
// Page order (fixed by design, each block independent and expandable):
//   1. Short hero                    5. Tried & Tested
//   2. Recommendation philosophy     6. Guest Discounts & Perks
//   3. Browse by category            7. Latest additions
//   4. Featured Takeaways            8. Archive + filters
//
// Blocks 7 and 8 only make sense with a body of content behind them, so they
// appear automatically once the thresholds below are met. Nothing else has to
// change when they do.
// ──────────────────────────────────────────────────────────────
import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TakeawaysHero from '@/components/takeaways/TakeawaysHero'
import Reveal from '@/components/takeaways/Reveal'
import ArticleCard from '@/components/takeaways/ArticleCard'
import CategoryGrid from '@/components/takeaways/CategoryGrid'
import TriedTested from '@/components/takeaways/TriedTested'
import ArchiveFilters from '@/components/takeaways/ArchiveFilters'
import { getArticlesList, PUBLIC_CATEGORIES, categoryLabel, categoryHref } from '@/lib/takeaways'
import { TRIED_AND_TESTED } from '@/lib/tried-tested'
import { getLocale } from '@/lib/locale'
import { getMessages, translateTexts } from '@/lib/translate'
import { SITE_URL, SITE_NAME } from '@/lib/site'

// The editorial piece that explains the whole approach. Linked from the
// philosophy block, and excluded from "Latest" so it is never shown twice.
const PHILOSOPHY_ARTICLE = 'why-i-stopped-recommending-restaurants-and-spas'

// Content thresholds for the optional lower blocks.
const LATEST_MIN_ARTICLES = 4
const ARCHIVE_MIN_ARTICLES = 6

export const metadata: Metadata = {
  title: 'Our Bali Takeaways: The Insider Bali Guide | YBG Villas',
  description:
    'Specific recommendations, practical local knowledge and entertaining Bali insights from our hosts and fellow guests: food, massage, sunsets, day trips and guest perks.',
  alternates: { canonical: `${SITE_URL}/takeaways` },
  openGraph: {
    title: 'Our Bali Takeaways | The Insider Bali Guide',
    description:
      'Specific recommendations, practical local knowledge and entertaining Bali insights from the hosts of five private pool villas in Seminyak, and from the guests who stayed there.',
    url: `${SITE_URL}/takeaways`,
    type: 'website',
    images: ['/takeaways/hero-poster.jpg'],
  },
}

export default async function TakeawaysPage() {
  const locale = await getLocale()
  const [articles, messages] = await Promise.all([getArticlesList(locale), getMessages(locale)])
  const t = (s: string) => messages[s] ?? s

  const featured = articles.filter((a) => a.featured)
  const rest = articles.filter((a) => !a.featured)

  // How much content sits behind each category: shown on the cards, and used to
  // keep the archive filters down to categories that actually have something.
  const countByCategory = articles.reduce<Record<string, number>>((acc, a) => {
    acc[a.category] = (acc[a.category] ?? 0) + 1
    return acc
  }, {})

  // Category and Tried & Tested copy lives in config, so it is translated here
  // in one batch rather than string by string.
  const catTexts = PUBLIC_CATEGORIES.flatMap((c) => [c.label, c.description])
  const ttTexts = TRIED_AND_TESTED.flatMap((i) => [i.kind, i.title, i.note ?? ''])
  const [catTr, ttTr] = await Promise.all([translateTexts(catTexts, locale), translateTexts(ttTexts, locale)])

  const categoryCopy = PUBLIC_CATEGORIES.map((c, i) => ({
    label: catTr[i * 2] ?? c.label,
    description: catTr[i * 2 + 1] ?? c.description,
    count: countByCategory[c.slug],
  }))
  const triedTestedCopy = TRIED_AND_TESTED.map((item, i) => ({
    kind: ttTr[i * 3] ?? item.kind,
    title: ttTr[i * 3 + 1] ?? item.title,
    note: ttTr[i * 3 + 2] || item.note,
  }))

  // Latest = most recently updated, whatever the type. Ready for the day
  // recommendations and perks join articles in the same stream.
  const latest = [...articles]
    .filter((a) => a.slug !== PHILOSOPHY_ARTICLE)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 3)
  const showLatest = articles.length >= LATEST_MIN_ARTICLES
  const showArchive = articles.length >= ARCHIVE_MIN_ARTICLES

  const archiveCategories = PUBLIC_CATEGORIES.filter((c) => countByCategory[c.slug]).map((c) => ({
    slug: c.slug,
    label: categoryCopy[PUBLIC_CATEGORIES.indexOf(c)]?.label ?? c.label,
  }))

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
      author: { '@type': 'Person', name: a.author },
    })),
  }

  const sectionKicker = 'mb-3 text-sm uppercase tracking-[0.3em] text-villa-gold'
  const sectionTitle = 'font-serif text-4xl font-light text-villa-dark md:text-5xl'
  const rule = 'mx-auto mt-6 h-px w-16 bg-villa-gold/70'

  return (
    <div className="min-h-screen bg-villa-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      {/* ── 1. Hero (short by design: the categories sit just below the fold) ── */}
      <TakeawaysHero />

      {/* ── 2. Recommendation philosophy ── */}
      <section data-nav-light-bg className="px-6 pb-4 pt-16 md:pt-20">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className={sectionKicker}>{t('Our approach')}</p>
          <h2 className="font-serif text-3xl font-light leading-snug text-villa-dark md:text-4xl">
            {t('We recommend the experience, not just the address.')}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-villa-muted">
            {t(
              'At Your Bali Getaway, we aim to recommend the specific dish, therapist, treatment, table, view, class or performance that made an experience worthwhile.',
            )}
          </p>
          <Link
            href={`/takeaways/${PHILOSOPHY_ARTICLE}`}
            className="mt-6 inline-flex items-center gap-2 border-b border-villa-green/40 pb-0.5 text-sm font-medium text-villa-green transition-colors hover:border-villa-green"
          >
            {t('How Our Recommendations Work')}
            <span aria-hidden="true">→</span>
          </Link>
          <div className={rule} />
        </Reveal>
      </section>

      {/* ── 3. Browse by category (primary navigation) ── */}
      <section id="browse-by-category" data-nav-light-bg className="scroll-mt-24 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-10 text-center">
            <p className={sectionKicker}>{t('Browse')}</p>
            <h2 className={sectionTitle}>{t('Browse by Category')}</h2>
            <p className="mx-auto mt-4 max-w-xl text-villa-muted">
              {t('Every category has its own page, with the articles and recommendations that belong to it.')}
            </p>
            <div className={rule} />
          </Reveal>
          <CategoryGrid
            categories={PUBLIC_CATEGORIES}
            copy={categoryCopy}
            countLabel={t('guides')}
            emptyLabel={t('Coming soon')}
          />
        </div>
      </section>

      {/* ── 4. Featured Takeaways ── */}
      <section id="featured-takeaways" data-nav-light-bg className="scroll-mt-24 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-10 text-center">
            <p className={sectionKicker}>{t('Editorial')}</p>
            <h2 className={sectionTitle}>{t('Featured Takeaways')}</h2>
            <p className="mx-auto mt-4 max-w-xl text-villa-muted">
              {t('The longer reads: what we learned, what surprised us, and what nobody tells you before you land.')}
            </p>
            <div className={rule} />
          </Reveal>

          {featured.length > 0 || rest.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {[...featured, ...rest].slice(0, 4).map((a, i) => (
                <Reveal key={a.slug} delay={(i % 2) * 0.08}>
                  <ArticleCard
                    article={a}
                    categoryLabel={t(categoryLabel(a.category))}
                    readLabel={t('Read article')}
                    membersLabel={t('Members')}
                    byLabel={t('By')}
                    large
                  />
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal className="mx-auto max-w-xl rounded-2xl border border-dashed border-stone-300 bg-white/60 px-8 py-12 text-center">
              <p className="font-serif text-2xl font-light text-villa-dark">{t('The first takeaways are being written')}</p>
              <p className="mx-auto mt-3 max-w-md text-sm text-villa-muted">
                {t('Our hosts are writing up their favourite Bali finds. Check back very soon.')}
              </p>
            </Reveal>
          )}
        </div>
      </section>

      {/* ── 5. Tried & Tested ── */}
      <section data-nav-light-bg className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-10 text-center">
            <p className={sectionKicker}>{t('Recommendations')}</p>
            <h2 className={sectionTitle}>{t('Tried & Tested')}</h2>
            <p className="mx-auto mt-4 max-w-xl text-villa-muted">
              {t('Single recommendations rather than full guides: one therapist, one dish, one table, one class.')}
            </p>
            <div className={rule} />
          </Reveal>
          <TriedTested
            items={TRIED_AND_TESTED}
            copy={triedTestedCopy}
            soonLabel={t('Coming soon')}
            seeLabel={t('See the category')}
          />
        </div>
      </section>

      {/* ── 6. Guest Discounts & Perks (deliberately separate from recommendations) ── */}
      <section className="px-6 py-10">
        <Reveal className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-villa-green px-8 py-14 text-center md:px-16">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-villa-gold">{t('For our guests')}</p>
          <h2 className="font-serif text-3xl font-light text-white md:text-4xl">{t('Guest Discounts & Perks')}</h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-stone-300">
            {t('See the current benefits and special offers available to Your Bali Getaway guests.')}
          </p>
          <Link
            href={categoryHref('perks')}
            className="mt-8 inline-block rounded-full bg-white px-8 py-3 text-sm font-medium text-villa-green transition-colors hover:bg-villa-cream"
          >
            {t('View guest discounts & perks')}
          </Link>
          <p className="mx-auto mt-8 max-w-lg border-t border-white/15 pt-6 text-xs leading-relaxed text-stone-300/90">
            {t(
              'A discount is not a recommendation: a business offering a guest benefit does not mean we recommend everything it does.',
            )}
          </p>
        </Reveal>
      </section>

      {/* ── 7. Latest additions (appears once there is enough content) ── */}
      {showLatest && (
        <section data-nav-light-bg className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mb-10 text-center">
              <p className={sectionKicker}>{t('New')}</p>
              <h2 className={sectionTitle}>{t('Latest from Our Bali Takeaways')}</h2>
              <div className={rule} />
            </Reveal>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {latest.map((a, i) => (
                <Reveal key={a.slug} delay={(i % 3) * 0.08}>
                  <ArticleCard
                    article={a}
                    categoryLabel={t(categoryLabel(a.category))}
                    readLabel={t('Read article')}
                    membersLabel={t('Members')}
                    byLabel={t('By')}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 8. Archive + filters (appears once there is enough content) ── */}
      {showArchive && (
        <section data-nav-light-bg className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mb-10 text-center">
              <p className={sectionKicker}>{t('Everything')}</p>
              <h2 className="font-serif text-3xl font-light text-villa-dark md:text-4xl">{t('Full archive')}</h2>
              <p className="mx-auto mt-4 max-w-xl text-villa-muted">
                {t('Every takeaway we have published, filtered by category.')}
              </p>
              <div className={rule} />
            </Reveal>
            <ArchiveFilters
              articles={articles}
              categories={archiveCategories}
              allLabel={t('All')}
              byLabel={t('By')}
            />
          </div>
        </section>
      )}

      {/* ── Community + membership CTA ── */}
      <section className="relative overflow-hidden bg-villa-dark px-6 py-20 text-center">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[640px] -translate-x-1/2 rounded-full bg-villa-gold/10 blur-3xl" />
        <div className="relative mx-auto max-w-2xl">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-villa-gold">{t('From the community')}</p>
          <h2 className="font-serif text-3xl font-light text-white md:text-4xl">{t('Add your own takeaway')}</h2>
          <p className="mt-4 leading-relaxed text-stone-300">
            {t('Share your own Bali finds, save your favourites and unlock the insider picks.')}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/takeaways/join"
              className="rounded-full bg-white px-8 py-3 text-sm font-medium text-villa-green transition-colors hover:bg-villa-cream"
            >
              {t('Create a free account')}
            </Link>
            <Link
              href="/takeaways/community"
              className="rounded-full border border-white/60 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              {t('See the community wall')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
