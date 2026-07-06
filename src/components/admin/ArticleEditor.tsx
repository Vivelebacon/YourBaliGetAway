'use client'

// CMS editor for a Takeaways article: content, cover, Joel's insider picks
// (the members-only block) and publish controls. Saves through RLS-checked
// admin writes, then revalidates the live pages.
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { imageUrl, slugifyFilename } from '@/lib/admin'
import { TAKEAWAY_CATEGORIES } from '@/lib/takeaways-shared'
import RichTextEditor from './RichTextEditor'

export interface ArticleRow {
  id: string
  slug: string
  title: string
  excerpt: string | null
  category: string
  cover_url: string | null
  body: string | null
  joel_picks: string | null
  featured: boolean
  published: boolean
  sort_order: number
}

async function pushTakeawaysLive(slug: string) {
  try {
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, scope: 'takeaways' }),
    })
  } catch {
    // non-fatal
  }
}

export default function ArticleEditor({ initial }: { initial: ArticleRow }) {
  const supabase = createClient()
  const router = useRouter()

  const [title, setTitle] = useState(initial.title)
  const [excerpt, setExcerpt] = useState(initial.excerpt ?? '')
  const [category, setCategory] = useState(initial.category)
  const [coverUrl, setCoverUrl] = useState(initial.cover_url ?? '')
  const [body, setBody] = useState(initial.body ?? '')
  const [picks, setPicks] = useState(initial.joel_picks ?? '')
  const [featured, setFeatured] = useState(initial.featured)
  const [published, setPublished] = useState(initial.published)
  const [sortOrder, setSortOrder] = useState(initial.sort_order)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function save() {
    if (saving) return
    setSaving(true)
    setMsg(null)
    const { error } = await supabase
      .from('takeaway_articles')
      .update({
        title: title.trim(),
        excerpt: excerpt.trim() || null,
        category,
        cover_url: coverUrl || null,
        body: body || null,
        joel_picks: picks || null,
        featured,
        published,
        sort_order: sortOrder,
        updated_at: new Date().toISOString(),
      })
      .eq('id', initial.id)
    setSaving(false)
    if (error) {
      setMsg(`Error: ${error.message}`)
      return
    }
    setMsg('Saved. Live in a few seconds.')
    pushTakeawaysLive(initial.slug)
  }

  async function uploadCover(file: File) {
    setUploading(true)
    setMsg(null)
    const path = `takeaways/${initial.slug}-${slugifyFilename(file.name)}`
    const { error } = await supabase.storage.from('villa-images').upload(path, file, { upsert: true })
    setUploading(false)
    if (error) {
      setMsg(`Upload error: ${error.message}`)
      return
    }
    setCoverUrl(path)
  }

  async function remove() {
    if (!confirm('Delete this article? This cannot be undone.')) return
    const { error } = await supabase.from('takeaway_articles').delete().eq('id', initial.id)
    if (error) {
      setMsg(`Error: ${error.message}`)
      return
    }
    pushTakeawaysLive(initial.slug)
    router.push('/admin/takeaways')
  }

  const field = 'w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-villa-green'

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/admin/takeaways" className="text-sm text-stone-500 hover:text-villa-green">
            ← All articles
          </Link>
          <h1 className="font-serif text-3xl text-villa-dark mt-1">Edit article</h1>
          <p className="text-xs text-stone-400 mt-1">/takeaways/{initial.slug}</p>
        </div>
        <div className="flex items-center gap-3">
          {published && (
            <a
              href={`/takeaways/${initial.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-stone-600 hover:text-villa-green"
            >
              View live ↗
            </a>
          )}
          <button
            onClick={save}
            disabled={saving}
            className="rounded-xl bg-villa-green px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-villa-green-light disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {msg && (
        <p className={`mb-5 rounded-xl px-4 py-3 text-sm ${msg.startsWith('Error') || msg.startsWith('Upload') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {msg}
        </p>
      )}

      <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={field} />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={field}>
              {TAKEAWAY_CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">Order</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
              className={field}
            />
          </div>
          <div className="flex items-end gap-5 pb-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-700">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4 accent-[#3d5a3e]" />
              Published
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-700">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 accent-[#3d5a3e]" />
              Featured
            </label>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">Excerpt (shown on cards and Google)</label>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} maxLength={200} className={field} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">Cover photo</label>
          <div className="flex items-center gap-4">
            <div className="relative h-24 w-40 overflow-hidden rounded-xl bg-stone-100">
              {coverUrl && <Image src={imageUrl(coverUrl)} alt="Cover" fill className="object-cover" />}
            </div>
            <label className="cursor-pointer rounded-xl border border-stone-300 px-4 py-2 text-sm text-stone-600 transition-colors hover:border-villa-green hover:text-villa-green">
              {uploading ? 'Uploading…' : 'Upload new'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0])}
              />
            </label>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-stone-700">Article body</label>
          <RichTextEditor value={body} onChange={setBody} />
        </div>

        <div className="rounded-xl border border-villa-gold/40 bg-[#fdf8ee] p-4">
          <label className="mb-1.5 block text-sm font-medium text-stone-700">
            Joel&apos;s insider picks (members only: visitors must create a free account to read this)
          </label>
          <RichTextEditor value={picks} onChange={setPicks} />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button onClick={remove} className="text-sm text-red-500 hover:text-red-700 hover:underline">
          Delete article
        </button>
      </div>
    </div>
  )
}
