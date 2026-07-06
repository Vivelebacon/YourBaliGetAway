'use client'

// Creates a draft article from a template + title, then jumps into the editor.
// The template pre-fills the category and a structured body so Joel only has
// to fill in the blanks.
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ARTICLE_TEMPLATES, getTemplate } from '@/lib/article-templates'

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
  const [open, setOpen] = useState(false)
  const [templateId, setTemplateId] = useState(ARTICLE_TEMPLATES[0].id)
  const [title, setTitle] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const template = getTemplate(templateId)

  async function create() {
    const clean = title.trim()
    if (!clean || busy) return
    setBusy(true)
    setError(null)
    let slug = slugify(clean) || `article-${Date.now()}`
    const { data: existing } = await supabase.from('takeaway_articles').select('slug').eq('slug', slug).maybeSingle()
    if (existing) slug = `${slug}-${String(Date.now()).slice(-4)}`

    const { error } = await supabase.from('takeaway_articles').insert({
      slug,
      title: clean,
      category: template.category,
      excerpt: template.excerpt || null,
      body: template.body || null,
      joel_picks: template.joelPicks || null,
      published: false,
      sort_order: 99,
    })
    setBusy(false)
    if (error) {
      setError(error.message)
      return
    }
    router.push(`/admin/takeaways/${slug}`)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl bg-villa-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-villa-green-light"
      >
        + New article
      </button>
    )
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <p className="mb-3 text-sm font-medium text-villa-dark">Create an article</p>

      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-stone-500">
        1. Pick a template
      </label>
      <select
        value={templateId}
        onChange={(e) => setTemplateId(e.target.value)}
        className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-villa-green"
      >
        {ARTICLE_TEMPLATES.map((tpl) => (
          <option key={tpl.id} value={tpl.id}>
            {tpl.label}
          </option>
        ))}
      </select>
      <p className="mt-1.5 text-xs text-stone-400">{template.hint}</p>

      <label className="mb-1.5 mt-4 block text-xs font-medium uppercase tracking-wide text-stone-500">
        2. Give it a title
      </label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && create()}
        placeholder="e.g. The Best Restaurants in Seminyak"
        className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-villa-green"
      />

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={create}
          disabled={busy || !title.trim()}
          className="flex-1 rounded-xl bg-villa-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-villa-green-light disabled:opacity-50"
        >
          {busy ? 'Creating…' : 'Create and edit'}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="rounded-xl px-4 py-2.5 text-sm text-stone-500 transition-colors hover:text-stone-700"
        >
          Cancel
        </button>
      </div>
      <p className="mt-3 text-xs text-stone-400">
        The template fills in the structure with prompts. You then just replace the placeholder text, add a cover photo, and hit Publish.
      </p>
    </div>
  )
}
