'use client'

// Admin moderation: delete guest recommendations (RLS: admin may delete any).
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TAKEAWAY_CATEGORIES } from '@/lib/takeaways-shared'

export interface ModRec {
  id: string
  author_name: string
  category: string
  title: string
  body: string
  place_name: string | null
  area: string | null
  status: string
  likes_count: number
  created_at: string
}

export default function ModerationList({ initial }: { initial: ModRec[] }) {
  const supabase = createClient()
  const [recs, setRecs] = useState(initial)
  const [error, setError] = useState<string | null>(null)

  async function remove(id: string) {
    if (!confirm('Delete this recommendation (and its likes and comments)?')) return
    const { error } = await supabase.from('takeaway_recs').delete().eq('id', id)
    if (error) {
      setError(error.message)
      return
    }
    setRecs((prev) => prev.filter((r) => r.id !== id))
  }

  if (recs.length === 0) {
    return <p className="text-stone-500">No community recommendations yet.</p>
  }

  return (
    <div className="space-y-4">
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {recs.map((r) => (
        <div key={r.id} className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-stone-400">
                <span className="font-medium text-stone-700">{r.author_name}</span>
                {' · '}
                {new Date(r.created_at).toLocaleDateString()}
                {' · '}
                {TAKEAWAY_CATEGORIES.find((c) => c.slug === r.category)?.label ?? r.category}
                {r.area ? ` · ${r.area}` : ''}
                {' · '}
                {r.likes_count} likes
              </p>
              <h3 className="font-serif text-lg text-villa-dark mt-1">{r.title}</h3>
              {r.place_name && <p className="text-xs uppercase tracking-wide text-villa-gold">{r.place_name}</p>}
              <p className="mt-1 text-sm text-stone-600 whitespace-pre-line">{r.body}</p>
            </div>
            <button
              onClick={() => remove(r.id)}
              className="shrink-0 rounded-xl border border-red-200 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
