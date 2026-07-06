'use client'

// Creates a draft article from a title and jumps into the editor.
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60)
}

export default function NewArticleForm() {
  const supabase = createClient()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function create() {
    const clean = title.trim()
    if (!clean || busy) return
    setBusy(true)
    setError(null)
    let slug = slugify(clean) || `article-${Date.now()}`
    // Avoid slug collisions by suffixing if needed.
    const { data: existing } = await supabase.from('takeaway_articles').select('slug').eq('slug', slug).maybeSingle()
    if (existing) slug = `${slug}-${String(Date.now()).slice(-4)}`

    const { error } = await supabase
      .from('takeaway_articles')
      .insert({ slug, title: clean, published: false, sort_order: 99 })
    setBusy(false)
    if (error) {
      setError(error.message)
      return
    }
    router.push(`/admin/takeaways/${slug}`)
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && create()}
          placeholder="New article title…"
          className="w-64 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-villa-green"
        />
        <button
          onClick={create}
          disabled={busy || !title.trim()}
          className="rounded-xl bg-villa-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-villa-green-light disabled:opacity-50"
        >
          {busy ? 'Creating…' : '+ New article'}
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
