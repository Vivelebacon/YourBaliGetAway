import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { imageUrl } from '@/lib/content'
import { TAKEAWAY_CATEGORIES } from '@/lib/takeaways'
import NewArticleForm from '@/components/admin/NewArticleForm'

export const dynamic = 'force-dynamic'

export default async function AdminTakeaways() {
  // Admin session: RLS lets us see drafts too.
  const supabase = await createClient()
  const { data } = await supabase
    .from('takeaway_articles')
    .select('slug,title,category,cover_url,published,featured,sort_order')
    .order('sort_order', { ascending: true })

  const articles = data ?? []

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-villa-dark mb-2">Our Bali Takeaways</h1>
          <p className="text-stone-500">
            Write and edit the Bali guide articles. Guests see published articles at /takeaways.
          </p>
        </div>
        <NewArticleForm />
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`/admin/takeaways/${a.slug}`}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <div className="relative h-40 bg-stone-200">
              {a.cover_url && (
                <Image src={imageUrl(a.cover_url)} alt={a.title} fill className="object-cover" />
              )}
              <div className="absolute left-3 top-3 flex gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    a.published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {a.published ? 'Published' : 'Draft'}
                </span>
                {a.featured && (
                  <span className="rounded-full bg-villa-gold/20 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                    Featured
                  </span>
                )}
              </div>
            </div>
            <div className="p-5">
              <p className="text-xs uppercase tracking-wide text-stone-400">
                {TAKEAWAY_CATEGORIES.find((c) => c.slug === a.category)?.label ?? a.category}
              </p>
              <h2 className="font-serif text-lg text-villa-dark mt-1">{a.title}</h2>
              <span className="text-villa-green text-sm mt-3 inline-block group-hover:underline">Edit →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
