// ──────────────────────────────────────────────────────────────
// Our Bali Takeaways: public content layer.
// Articles are CMS-managed (admin) and read here with the anon key.
// NOTE: never select joel_picks with the anon client. The column is
// revoked for anon at the Postgres level (members-only content); it is
// fetched client-side by the JoelPicks component with the member session.
// ──────────────────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js'
import { translateTexts } from '@/lib/translate'
import { imageUrl } from '@/lib/content'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: { persistSession: false },
})

// Categories and shared types live in takeaways-shared.ts (client-safe);
// re-exported here so server code can import everything from one place.
export { TAKEAWAY_CATEGORIES, categoryLabel, type CommunityRec } from '@/lib/takeaways-shared'
import type { CommunityRec } from '@/lib/takeaways-shared'

export interface TakeawayArticleCard {
  slug: string
  title: string
  excerpt: string
  category: string
  coverUrl: string
  featured: boolean
  membersOnly: boolean
  updatedAt: string
}

export interface TakeawayArticle extends TakeawayArticleCard {
  subtitle: string
  body: string
  hasJoelPicks: boolean
  createdAt: string
}

interface ArticleRow {
  slug: string
  title: string
  excerpt: string | null
  category: string
  cover_url: string | null
  featured: boolean
  members_only: boolean
  updated_at: string
}

const CARD_COLS = 'slug,title,excerpt,category,cover_url,featured,members_only,updated_at'

function toCard(r: ArticleRow): TakeawayArticleCard {
  return {
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? '',
    category: r.category,
    coverUrl: r.cover_url ? imageUrl(r.cover_url) : '',
    featured: r.featured,
    membersOnly: r.members_only,
    updatedAt: r.updated_at,
  }
}

async function localizeCards(cards: TakeawayArticleCard[], locale: string): Promise<TakeawayArticleCard[]> {
  if (locale === 'en' || cards.length === 0) return cards
  const src = cards.flatMap((c) => [c.title, c.excerpt])
  const tr = await translateTexts(src, locale)
  return cards.map((c, i) => ({ ...c, title: tr[i * 2] ?? c.title, excerpt: tr[i * 2 + 1] ?? c.excerpt }))
}

export async function getArticlesList(locale = 'en'): Promise<TakeawayArticleCard[]> {
  const { data, error } = await supabase
    .from('takeaway_articles')
    .select(CARD_COLS)
    .eq('published', true)
    .order('sort_order', { ascending: true })
  if (error || !data) return []
  return localizeCards((data as ArticleRow[]).map(toCard), locale)
}

export async function getArticleSlugs(): Promise<string[]> {
  const { data } = await supabase
    .from('takeaway_articles')
    .select('slug')
    .eq('published', true)
    .order('sort_order')
  return (data ?? []).map((r) => (r as { slug: string }).slug)
}

export async function getArticleBySlug(slug: string, locale = 'en'): Promise<TakeawayArticle | null> {
  // has_picks is a generated boolean column: it tells us whether the gated
  // Joel's picks block exists without exposing the gated content to anon.
  const { data, error } = await supabase
    .from('takeaway_articles')
    .select(`${CARD_COLS},subtitle,body,created_at,has_picks`)
    .eq('published', true)
    .eq('slug', slug)
    .maybeSingle()
  if (error || !data) return null
  const row = data as ArticleRow & {
    subtitle: string | null
    body: string | null
    created_at: string
    has_picks: boolean | null
  }

  const article: TakeawayArticle = {
    ...toCard(row),
    subtitle: row.subtitle ?? '',
    body: row.body ?? '',
    hasJoelPicks: row.has_picks ?? false,
    createdAt: row.created_at,
  }

  if (locale === 'en') return article
  const [title, subtitle, excerpt, body] = await translateTexts(
    [article.title, article.subtitle, article.excerpt, article.body],
    locale,
  )
  return {
    ...article,
    title: title ?? article.title,
    subtitle: subtitle ?? article.subtitle,
    excerpt: excerpt ?? article.excerpt,
    body: body ?? article.body,
  }
}

export async function getApprovedRecs(limit = 20, category?: string): Promise<CommunityRec[]> {
  let q = supabase
    .from('takeaway_recs')
    .select('id,author_name,category,title,body,place_name,area,likes_count,created_at')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (category) q = q.eq('category', category)
  const { data, error } = await q
  if (error || !data) return []
  return data.map((r) => ({
    id: r.id as string,
    authorName: r.author_name as string,
    category: r.category as string,
    title: r.title as string,
    body: r.body as string,
    placeName: (r.place_name as string | null) ?? null,
    area: (r.area as string | null) ?? null,
    likesCount: (r.likes_count as number) ?? 0,
    createdAt: r.created_at as string,
  }))
}
