import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Reveal from '@/components/takeaways/Reveal'
import ArticleCard from '@/components/takeaways/ArticleCard'
import JoelPicks from '@/components/takeaways/JoelPicks'
import RecFeed from '@/components/takeaways/RecFeed'
import { getArticleBySlug, getArticlesList, categoryLabel } from '@/lib/takeaways'
import { getLocale } from '@/lib/locale'
import { getMessages } from '@/lib/translate'
import { createClient } from '@/lib/supabase/server'
import { SITE_URL, SITE_NAME } from '@/lib/site'

interface Props {
  params: Promise<{ slug: string }>
}

// Render per request: the page reads the locale cookie and translates content
// per locale, so it is dynamic. An unknown slug then resolves to a clean 404
// (a static render of an unknown slug throws DYNAMIC_SERVER_USAGE on cookies()).
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}
  return {
    title: `${article.title} | Our Bali Takeaways`,
    description: article.excerpt.slice(0, 160),
    alternates: { canonical: `${SITE_URL}/takeaways/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `${SITE_URL}/takeaways/${article.slug}`,
      type: 'article',
      images: article.coverUrl ? [article.coverUrl] : ['/takeaways/hero-poster.jpg'],
    },
  }
}

export default async function TakeawayArticlePage({ params }: Props) {
  const { slug } = await params
  const locale = await getLocale()
  const article = await getArticleBySlug(slug, locale)
  if (!article) notFound()

  const [messages, all] = await Promise.all([getMessages(locale), getArticlesList(locale)])
  const t = (s: string) => messages[s] ?? s

  // Members-only articles: hide the body from non-logged-in visitors (checked
  // server-side, so the body is never sent in the HTML for anon).
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const locked = article.membersOnly && !user

  const related = all.filter((a) => a.slug !== slug && a.category === article.category).slice(0, 3)
  const fallbackRelated = related.length > 0 ? related : all.filter((a) => a.slug !== slug).slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.coverUrl || `${SITE_URL}/takeaways/hero-poster.jpg`,
    datePublished: article.createdAt,
    dateModified: article.updatedAt,
    author: { '@type': 'Person', name: 'Joel', jobTitle: 'Host, Your Bali Getaway' },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/takeaways/${article.slug}`,
  }
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Our Bali Takeaways', item: `${SITE_URL}/takeaways` },
      { '@type': 'ListItem', position: 3, name: article.title, item: `${SITE_URL}/takeaways/${article.slug}` },
    ],
  }

  return (
    <div className="min-h-screen bg-villa-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Navbar />

      {/* ── Article hero ── */}
      <section className="relative h-[62vh] min-h-[420px]">
        {article.coverUrl && (
          <Image src={article.coverUrl} alt={article.title} fill priority className="object-cover" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-villa-cream" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pt-16 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-villa-gold [text-shadow:_0_1px_8px_rgba(0,0,0,0.6)]">
            {t(categoryLabel(article.category))}
          </p>
          <h1 className="max-w-4xl font-serif text-4xl font-light text-white [text-shadow:_0_2px_16px_rgba(0,0,0,0.5)] md:text-6xl">
            {article.title}
          </h1>
        </div>
      </section>

      {/* ── Body ── */}
      <article data-nav-light-bg className="px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <p className="font-serif text-xl italic leading-relaxed text-villa-green">{article.excerpt}</p>

          {locked ? (
            // Members-only article, visitor not logged in: teaser + join gate.
            <div className="relative mt-8">
              <div className="pointer-events-none max-h-40 overflow-hidden [mask-image:linear-gradient(to_bottom,black,transparent)]">
                <div
                  className="prose prose-stone max-w-none prose-headings:font-serif prose-p:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: article.body.slice(0, 400) }}
                />
              </div>
              <div className="mt-6 rounded-2xl border border-villa-gold/40 bg-gradient-to-br from-[#fdf8ee] to-[#f7efdd] p-8 text-center">
                <p className="text-xs uppercase tracking-[0.35em] text-villa-gold">{t('Members only')}</p>
                <h2 className="mt-2 font-serif text-2xl font-light text-villa-dark">
                  {t('This guide is for members')}
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-villa-muted">
                  {t('Create a free account to read the full guide and unlock the insider picks.')}
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/takeaways/join"
                    className="rounded-full bg-villa-green px-7 py-2.5 text-sm font-medium text-white transition-colors hover:bg-villa-green-light"
                  >
                    {t('Create a free account')}
                  </Link>
                  <Link href="/takeaways/join?mode=signin" className="text-sm font-medium text-villa-green hover:underline">
                    {t('Sign in')}
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div
                className="prose prose-stone mt-8 max-w-none prose-headings:font-serif prose-headings:font-light prose-headings:text-villa-dark prose-p:leading-relaxed prose-strong:text-villa-dark"
                dangerouslySetInnerHTML={{ __html: article.body }}
              />

              {/* Members-only: Joel's insider picks (gated at the DB level) */}
              <JoelPicks slug={article.slug} hasPicks={article.hasJoelPicks} />
            </>
          )}

          <Link href="/takeaways" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-villa-green hover:underline">
            <span aria-hidden="true">←</span> {t('Back to the guide')}
          </Link>
        </div>
      </article>

      {/* ── Community tips on this topic ── */}
      <section data-nav-light-bg className="px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <Reveal className="mb-8 text-center">
            <h2 className="font-serif text-3xl font-light text-villa-dark md:text-4xl">
              {t('Community tips on this topic')}
            </h2>
            <div className="mx-auto mt-5 h-px w-16 bg-villa-gold/70" />
          </Reveal>
          <RecFeed category={article.category} showComposer={false} pageSize={10} />
          <div className="mt-8 text-center">
            <Link
              href="/takeaways/community"
              className="inline-block rounded-full border border-villa-green px-7 py-2.5 text-sm font-medium text-villa-green transition-colors hover:bg-villa-green hover:text-white"
            >
              {t('Join the community')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Related ── */}
      {fallbackRelated.length > 0 && (
        <section data-nav-light-bg className="px-6 pb-20">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mb-10 text-center">
              <h2 className="font-serif text-3xl font-light text-villa-dark md:text-4xl">{t('Related takeaways')}</h2>
              <div className="mx-auto mt-5 h-px w-16 bg-villa-gold/70" />
            </Reveal>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {fallbackRelated.map((a) => (
                <ArticleCard
                  key={a.slug}
                  article={a}
                  categoryLabel={t(categoryLabel(a.category))}
                  readLabel={t('Read article')}
                        membersLabel={t('Members')}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
