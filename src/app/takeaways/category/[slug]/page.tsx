// Dedicated page per category. The category cards on the guide link here
// rather than filtering the landing page, so every category is a real URL that
// can rank, be linked to, and grow its own content over time.
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Reveal from '@/components/takeaways/Reveal'
import ArticleCard from '@/components/takeaways/ArticleCard'
import RecFeed from '@/components/takeaways/RecFeed'
import CategoryGrid from '@/components/takeaways/CategoryGrid'
import {
  getArticlesByCategory,
  findCategory,
  categoryLabel,
  PUBLIC_CATEGORIES,
} from '@/lib/takeaways'
import { getLocale } from '@/lib/locale'
import { getMessages, translateTexts } from '@/lib/translate'
import { SITE_URL, SITE_NAME } from '@/lib/site'

interface Props {
  params: Promise<{ slug: string }>
}

// Locale comes from a cookie, so these render per request like the articles.
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cat = findCategory(slug)
  if (!cat || cat.hidden || cat.href) return {}
  return {
    title: `${cat.label} in Bali | Our Bali Takeaways`,
    description: cat.description,
    alternates: { canonical: `${SITE_URL}/takeaways/category/${cat.slug}` },
    openGraph: {
      title: `${cat.label} | Our Bali Takeaways`,
      description: cat.description,
      url: `${SITE_URL}/takeaways/category/${cat.slug}`,
      type: 'website',
      images: [cat.image ?? '/takeaways/hero-poster.jpg'],
    },
  }
}

export default async function TakeawayCategoryPage({ params }: Props) {
  const { slug } = await params
  const cat = findCategory(slug)
  // Hidden categories and categories with their own page (perks) are not here.
  if (!cat || cat.hidden || cat.href) notFound()

  const locale = await getLocale()
  const [articles, messages] = await Promise.all([getArticlesByCategory(slug, locale), getMessages(locale)])
  const t = (s: string) => messages[s] ?? s

  const [label, description] = await translateTexts([cat.label, cat.description], locale)

  // Three sibling categories, so a visitor who lands here from search has
  // somewhere natural to go next.
  const siblings = PUBLIC_CATEGORIES.filter((c) => c.slug !== cat.slug).slice(0, 3)
  const sibTr = await translateTexts(siblings.flatMap((c) => [c.label, c.description]), locale)
  const sibCopy = siblings.map((c, i) => ({
    label: sibTr[i * 2] ?? c.label,
    description: sibTr[i * 2 + 1] ?? c.description,
  }))

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Our Bali Takeaways', item: `${SITE_URL}/takeaways` },
      { '@type': 'ListItem', position: 3, name: cat.label, item: `${SITE_URL}/takeaways/category/${cat.slug}` },
    ],
  }
  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${cat.label} | Our Bali Takeaways`,
    description: cat.description,
    url: `${SITE_URL}/takeaways/category/${cat.slug}`,
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    hasPart: articles.map((a) => ({
      '@type': 'Article',
      headline: a.title,
      url: `${SITE_URL}/takeaways/${a.slug}`,
      image: a.coverUrl || undefined,
      author: { '@type': 'Person', name: a.author },
    })),
  }

  return (
    <div className="min-h-screen bg-villa-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      <Navbar />

      {/* ── Category header ── */}
      <section className="relative flex min-h-[42vh] items-center justify-center overflow-hidden bg-villa-dark px-6 pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${cat.image ?? '/takeaways/hero-poster.jpg'})` }}
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-villa-cream" />
        <div className="relative z-10 py-16 text-center">
          <Link
            href="/takeaways"
            className="mb-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-villa-gold transition-opacity hover:opacity-80"
          >
            <span aria-hidden="true">←</span> {t('Our Bali Takeaways')}
          </Link>
          <h1 className="max-w-3xl font-serif text-4xl font-light text-white [text-shadow:_0_2px_16px_rgba(0,0,0,0.5)] md:text-6xl">
            {label}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-white/90 [text-shadow:_0_1px_10px_rgba(0,0,0,0.6)]">
            {description}
          </p>
        </div>
      </section>

      {/* ── Articles in this category ── */}
      <section data-nav-light-bg className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a, i) => (
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
          ) : (
            <Reveal className="mx-auto max-w-xl rounded-2xl border border-dashed border-stone-300 bg-white/60 px-8 py-12 text-center">
              <p className="font-serif text-2xl font-light text-villa-dark">{t('Nothing here yet')}</p>
              <p className="mx-auto mt-3 max-w-md text-sm text-villa-muted">
                {t('We are writing this section up. In the meantime, guests share their own finds below.')}
              </p>
            </Reveal>
          )}
        </div>
      </section>

      {/* ── Community recommendations in this category ── */}
      <section data-nav-light-bg className="px-6 pb-16">
        <div className="mx-auto max-w-3xl">
          <Reveal className="mb-8 text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-villa-gold">{t('From the community')}</p>
            <h2 className="font-serif text-3xl font-light text-villa-dark md:text-4xl">{t('Guest recommendations')}</h2>
            <div className="mx-auto mt-5 h-px w-16 bg-villa-gold/70" />
          </Reveal>
          <RecFeed category={cat.slug} showComposer={false} pageSize={10} />
        </div>
      </section>

      {/* ── Keep browsing ── */}
      <section data-nav-light-bg className="px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-10 text-center">
            <h2 className="font-serif text-3xl font-light text-villa-dark md:text-4xl">{t('Keep browsing')}</h2>
            <div className="mx-auto mt-5 h-px w-16 bg-villa-gold/70" />
          </Reveal>
          <CategoryGrid
            categories={siblings}
            copy={sibCopy}
            countLabel={t('guides')}
            emptyLabel={t('Coming soon')}
          />
        </div>
      </section>

      <Footer />
    </div>
  )
}
