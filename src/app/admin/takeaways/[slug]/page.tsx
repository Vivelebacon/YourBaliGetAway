import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ArticleEditor, { type ArticleRow } from '@/components/admin/ArticleEditor'

export const dynamic = 'force-dynamic'

export default async function AdminTakeawayArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('takeaway_articles').select('*').eq('slug', slug).maybeSingle()
  if (!data) notFound()

  return <ArticleEditor initial={data as ArticleRow} />
}
