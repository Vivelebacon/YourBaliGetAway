'use client'

// Community feed: guest recommendations with likes and comments.
// Members only: RLS blocks anonymous reads, so recs are fetched client-side
// with the member's session. Non-members see a join gate instead of any
// recommendations. Every interaction runs through RLS-checked Supabase calls.
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { TAKEAWAY_CATEGORIES, type CommunityRec } from '@/lib/takeaways-shared'
import { useMember } from './MemberProvider'
import { useLanguage } from '@/components/LanguageProvider'

function mapRec(r: Record<string, unknown>): CommunityRec {
  return {
    id: r.id as string,
    authorName: r.author_name as string,
    category: r.category as string,
    title: r.title as string,
    body: r.body as string,
    placeName: (r.place_name as string | null) ?? null,
    area: (r.area as string | null) ?? null,
    likesCount: (r.likes_count as number) ?? 0,
    createdAt: r.created_at as string,
  }
}

interface RecComment {
  id: string
  rec_id: string
  user_id: string
  author_name: string
  body: string
  created_at: string
}

function timeAgo(iso: string): string {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
  if (s < 3600) return `${Math.max(1, Math.floor(s / 60))} min`
  if (s < 86400) return `${Math.floor(s / 3600)} h`
  return `${Math.floor(s / 86400)} d`
}

export default function RecFeed({
  category,
  showComposer = true,
  pageSize = 10,
}: {
  category?: string
  showComposer?: boolean
  pageSize?: number
}) {
  const supabase = useMemo(() => createClient(), [])
  const { user, displayName, isAdmin, loading: memberLoading } = useMember()
  const { t } = useLanguage()

  const [recs, setRecs] = useState<CommunityRec[]>([])
  const [feedLoading, setFeedLoading] = useState(true)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [openComments, setOpenComments] = useState<Set<string>>(new Set())
  const [comments, setComments] = useState<Record<string, RecComment[]>>({})
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({})
  const [hasMore, setHasMore] = useState(false)

  // Members only: fetch the feed with the member's session (anon is blocked by RLS).
  useEffect(() => {
    if (memberLoading) return
    if (!user) {
      setRecs([])
      setFeedLoading(false)
      return
    }
    let cancelled = false
    setFeedLoading(true)
    let q = supabase
      .from('takeaway_recs')
      .select('id,author_name,category,title,body,place_name,area,likes_count,created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .range(0, pageSize - 1)
    if (category) q = q.eq('category', category)
    q.then(({ data }) => {
      if (cancelled) return
      const rows = (data ?? []).map(mapRec)
      setRecs(rows)
      setHasMore(rows.length >= pageSize)
      setFeedLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [user, memberLoading, category, pageSize, supabase])

  // Which of the visible recs has the member already liked?
  useEffect(() => {
    if (!user || recs.length === 0) return
    let cancelled = false
    supabase
      .from('takeaway_rec_likes')
      .select('rec_id')
      .eq('user_id', user.id)
      .in('rec_id', recs.map((r) => r.id))
      .then(({ data }) => {
        if (!cancelled && data) setLikedIds(new Set(data.map((d) => d.rec_id as string)))
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, recs.length])

  async function toggleLike(rec: CommunityRec) {
    if (!user) return
    const liked = likedIds.has(rec.id)
    // Optimistic UI
    setLikedIds((prev) => {
      const next = new Set(prev)
      if (liked) next.delete(rec.id)
      else next.add(rec.id)
      return next
    })
    setRecs((prev) =>
      prev.map((r) => (r.id === rec.id ? { ...r, likesCount: Math.max(0, r.likesCount + (liked ? -1 : 1)) } : r)),
    )
    if (liked) {
      await supabase.from('takeaway_rec_likes').delete().eq('rec_id', rec.id).eq('user_id', user.id)
    } else {
      await supabase.from('takeaway_rec_likes').insert({ rec_id: rec.id, user_id: user.id })
    }
  }

  async function toggleComments(recId: string) {
    setOpenComments((prev) => {
      const next = new Set(prev)
      if (next.has(recId)) next.delete(recId)
      else next.add(recId)
      return next
    })
    if (!comments[recId]) {
      const { data } = await supabase
        .from('takeaway_rec_comments')
        .select('*')
        .eq('rec_id', recId)
        .order('created_at', { ascending: true })
      setComments((prev) => ({ ...prev, [recId]: (data as RecComment[]) ?? [] }))
    }
  }

  async function postComment(recId: string) {
    const body = (commentDraft[recId] ?? '').trim()
    if (!user || !body) return
    const { data, error } = await supabase
      .from('takeaway_rec_comments')
      .insert({ rec_id: recId, user_id: user.id, author_name: displayName || 'Guest', body })
      .select()
      .single()
    if (!error && data) {
      setComments((prev) => ({ ...prev, [recId]: [...(prev[recId] ?? []), data as RecComment] }))
      setCommentDraft((prev) => ({ ...prev, [recId]: '' }))
    }
  }

  async function deleteComment(recId: string, commentId: string) {
    await supabase.from('takeaway_rec_comments').delete().eq('id', commentId)
    setComments((prev) => ({ ...prev, [recId]: (prev[recId] ?? []).filter((c) => c.id !== commentId) }))
  }

  async function deleteRec(recId: string) {
    await supabase.from('takeaway_recs').delete().eq('id', recId)
    setRecs((prev) => prev.filter((r) => r.id !== recId))
  }

  async function loadMore() {
    let q = supabase
      .from('takeaway_recs')
      .select('id,author_name,category,title,body,place_name,area,likes_count,created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .range(recs.length, recs.length + pageSize - 1)
    if (category) q = q.eq('category', category)
    const { data } = await q
    const more = (data ?? []).map(mapRec)
    setRecs((prev) => [...prev, ...more])
    setHasMore(more.length >= pageSize)
  }

  // Non-members never see recommendations: show the join gate instead.
  if (!memberLoading && !user) {
    return (
      <div className="rounded-2xl border border-dashed border-villa-green/40 bg-white/70 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-villa-green/10 text-xl text-villa-green">
          ✦
        </div>
        <h3 className="font-serif text-2xl font-light text-villa-dark">{t('A members-only community')}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-villa-muted">
          {t('Create a free account to see and share Bali recommendations from fellow guests.')}
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
    )
  }

  if (memberLoading || feedLoading) {
    return (
      <div className="space-y-4" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/60 ring-1 ring-stone-100" />
        ))}
      </div>
    )
  }

  return (
    <div>
      {showComposer && (
        <div className="mb-10">
          <Composer onPosted={(rec) => setRecs((prev) => [rec, ...prev])} />
        </div>
      )}

      {recs.length === 0 && (
        <p className="py-10 text-center text-sm text-villa-muted">{t('No recommendations yet. Be the first to share one!')}</p>
      )}

      <div className="space-y-5">
        {recs.map((rec) => {
          const liked = likedIds.has(rec.id)
          const mine = user && (isAdmin || rec.authorName === displayName)
          const catLabel = TAKEAWAY_CATEGORIES.find((c) => c.slug === rec.category)?.label ?? rec.category
          return (
            <article key={rec.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-100">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-villa-green/10 font-serif text-lg text-villa-green">
                    {rec.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-villa-dark">{rec.authorName}</p>
                    <p className="text-xs text-villa-muted">
                      {timeAgo(rec.createdAt)} · {t(catLabel)}
                      {rec.area ? ` · ${rec.area}` : ''}
                    </p>
                  </div>
                </div>
                {mine && (
                  <button
                    onClick={() => deleteRec(rec.id)}
                    className="text-xs text-stone-400 transition-colors hover:text-red-500"
                    title={t('Delete')}
                  >
                    ✕
                  </button>
                )}
              </div>

              <h3 className="mt-4 font-serif text-xl text-villa-dark">{rec.title}</h3>
              {rec.placeName && (
                <p className="mt-0.5 text-xs uppercase tracking-[0.18em] text-villa-gold">{rec.placeName}</p>
              )}
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-stone-600">{rec.body}</p>

              <div className="mt-5 flex items-center gap-5 border-t border-stone-100 pt-4">
                <button
                  onClick={() => toggleLike(rec)}
                  disabled={!user}
                  className={`inline-flex items-center gap-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    liked ? 'text-villa-green' : 'text-stone-500 hover:text-villa-green'
                  }`}
                  title={user ? (liked ? t('Liked') : t('Like')) : t('Sign in')}
                >
                  <svg className="h-4.5 w-4.5" width="18" height="18" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {rec.likesCount}
                </button>
                <button
                  onClick={() => toggleComments(rec.id)}
                  className="inline-flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-villa-green"
                >
                  <svg className="h-4.5 w-4.5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8m-8 4h5m7-4a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('Comments')}
                  {comments[rec.id] ? ` (${comments[rec.id].length})` : ''}
                </button>
              </div>

              {openComments.has(rec.id) && (
                <div className="mt-4 space-y-3 rounded-xl bg-stone-50 p-4">
                  {(comments[rec.id] ?? []).map((c) => (
                    <div key={c.id} className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium text-villa-dark">
                          {c.author_name} <span className="font-normal text-stone-400">· {timeAgo(c.created_at)}</span>
                        </p>
                        <p className="mt-0.5 text-sm text-stone-600">{c.body}</p>
                      </div>
                      {user && (isAdmin || c.user_id === user.id) && (
                        <button
                          onClick={() => deleteComment(rec.id, c.id)}
                          className="text-xs text-stone-300 transition-colors hover:text-red-500"
                          title={t('Delete')}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  {user ? (
                    <div className="flex gap-2 pt-1">
                      <input
                        value={commentDraft[rec.id] ?? ''}
                        onChange={(e) => setCommentDraft((prev) => ({ ...prev, [rec.id]: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && postComment(rec.id)}
                        placeholder={t('Add a comment…')}
                        className="flex-1 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm outline-none focus:border-villa-green"
                      />
                      <button
                        onClick={() => postComment(rec.id)}
                        className="rounded-full bg-villa-green px-4 py-2 text-sm text-white transition-colors hover:bg-villa-green-light"
                      >
                        {t('Reply')}
                      </button>
                    </div>
                  ) : (
                    <Link href="/takeaways/join?mode=signin" className="block pt-1 text-xs font-medium text-villa-green hover:underline">
                      {t('Sign in to share your own recommendation')}
                    </Link>
                  )}
                </div>
              )}
            </article>
          )
        })}
      </div>

      {hasMore && recs.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            className="rounded-full border border-villa-green px-7 py-2.5 text-sm font-medium text-villa-green transition-colors hover:bg-villa-green hover:text-white"
          >
            {t('Load more')}
          </button>
        </div>
      )}
    </div>
  )
}

// ── Composer ──────────────────────────────────────────────────
function Composer({ onPosted }: { onPosted: (rec: CommunityRec) => void }) {
  const supabase = useMemo(() => createClient(), [])
  const { user, displayName } = useMember()
  const { t } = useLanguage()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [placeName, setPlaceName] = useState('')
  const [area, setArea] = useState('')
  const [category, setCategory] = useState('food')
  const [customCategory, setCustomCategory] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<'ok' | 'err' | null>(null)

  async function submit() {
    if (!user || !title.trim() || !body.trim() || busy) return
    // "Other" lets the member name their own category; store that free text.
    const finalCategory =
      category === 'other' && customCategory.trim() ? customCategory.trim().slice(0, 40) : category
    setBusy(true)
    setMsg(null)
    const { data, error } = await supabase
      .from('takeaway_recs')
      .insert({
        user_id: user.id,
        author_name: displayName || 'Guest',
        category: finalCategory,
        title: title.trim(),
        body: body.trim(),
        place_name: placeName.trim() || null,
        area: area.trim() || null,
      })
      .select()
      .single()
    setBusy(false)
    if (error || !data) {
      setMsg('err')
      return
    }
    setMsg('ok')
    setTitle('')
    setBody('')
    setPlaceName('')
    setArea('')
    setCustomCategory('')
    onPosted({
      id: data.id as string,
      authorName: data.author_name as string,
      category: data.category as string,
      title: data.title as string,
      body: data.body as string,
      placeName: (data.place_name as string | null) ?? null,
      area: (data.area as string | null) ?? null,
      likesCount: 0,
      createdAt: data.created_at as string,
    })
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-100">
      <h3 className="font-serif text-2xl font-light text-villa-dark">{t('Share a recommendation')}</h3>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('Give it a short title')}
          maxLength={90}
          className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-villa-green md:col-span-2"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={t('Tell us the place, the dish, the exact tip…')}
          rows={3}
          maxLength={1200}
          className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-villa-green md:col-span-2"
        />
        <input
          value={placeName}
          onChange={(e) => setPlaceName(e.target.value)}
          placeholder={t('Place name (optional)')}
          maxLength={80}
          className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-villa-green"
        />
        <input
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder={t('Area, e.g. Seminyak (optional)')}
          maxLength={60}
          className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-villa-green"
        />
        <div className="flex flex-wrap items-center gap-3 md:col-span-2">
          <label className="text-sm text-villa-muted">{t('Category')}</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-villa-green"
          >
            {TAKEAWAY_CATEGORIES.filter((c) => c.slug !== 'perks').map((c) => (
              <option key={c.slug} value={c.slug}>
                {t(c.label)}
              </option>
            ))}
          </select>
          {category === 'other' && (
            <input
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder={t('Your own category')}
              maxLength={40}
              className="min-w-[10rem] flex-1 rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-villa-green"
            />
          )}
          <button
            onClick={submit}
            disabled={busy || !title.trim() || !body.trim() || (category === 'other' && !customCategory.trim())}
            className="ml-auto rounded-full bg-villa-green px-7 py-2.5 text-sm font-medium text-white transition-colors hover:bg-villa-green-light disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? t('Posting…') : t('Post recommendation')}
          </button>
        </div>
      </div>
      {msg === 'ok' && <p className="mt-3 text-sm text-villa-green">{t('Thank you! Your recommendation is live.')}</p>}
      {msg === 'err' && <p className="mt-3 text-sm text-red-600">{t('Something went wrong. Please try again.')}</p>}
    </div>
  )
}
