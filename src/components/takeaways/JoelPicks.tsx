'use client'

// Members-only block: Joel's insider picks. The content column (joel_picks)
// is unreadable by anon at the Postgres level, so this island fetches it with
// the member session only. Non-members get an inviting locked teaser.
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useMember } from './MemberProvider'
import { useLanguage } from '@/components/LanguageProvider'

export default function JoelPicks({ slug, hasPicks }: { slug: string; hasPicks: boolean }) {
  const supabase = useMemo(() => createClient(), [])
  const { user, loading } = useMember()
  const { t } = useLanguage()
  const [html, setHtml] = useState<string | null>(null)

  useEffect(() => {
    if (!user || !hasPicks) return
    let cancelled = false
    supabase
      .from('takeaway_articles')
      .select('joel_picks')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setHtml((data?.joel_picks as string) ?? null)
      })
    return () => {
      cancelled = true
    }
  }, [user, hasPicks, slug, supabase])

  if (!hasPicks) return null

  return (
    <aside className="relative my-12 overflow-hidden rounded-2xl border border-villa-gold/40 bg-gradient-to-br from-[#fdf8ee] to-[#f7efdd] p-8 shadow-[0_18px_50px_-24px_rgba(61,90,62,0.3)] md:p-10">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-villa-gold/10 blur-2xl" />
      <p className="text-xs uppercase tracking-[0.35em] text-villa-gold">{t('Members only')}</p>
      <h2 className="mt-2 font-serif text-3xl font-light text-villa-dark">{t("Joel's insider picks")}</h2>

      {user && html !== null ? (
        <div
          className="prose prose-stone mt-5 max-w-none prose-p:leading-relaxed prose-strong:text-villa-dark"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : user || loading ? (
        // Signed in, content on its way (or auth state still resolving)
        <div className="mt-6 space-y-3" aria-hidden="true">
          <div className="h-4 w-3/4 animate-pulse rounded bg-villa-gold/15" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-villa-gold/15" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-villa-gold/15" />
        </div>
      ) : (
        <div className="mt-5">
          <p className="max-w-xl text-sm leading-relaxed text-villa-muted">
            {t('The good stuff. The exact tables, time slots and shortcuts Joel gives his friends.')}
          </p>
          {/* Locked preview lines */}
          <div className="mt-5 select-none space-y-3 blur-[7px]" aria-hidden="true">
            <div className="h-4 w-4/5 rounded bg-villa-dark/20" />
            <div className="h-4 w-2/3 rounded bg-villa-dark/15" />
            <div className="h-4 w-3/4 rounded bg-villa-dark/20" />
            <div className="h-4 w-1/2 rounded bg-villa-dark/15" />
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link
              href="/takeaways/join"
              className="rounded-full bg-villa-green px-7 py-2.5 text-sm font-medium text-white transition-colors hover:bg-villa-green-light"
            >
              {t('Create a free account')}
            </Link>
            <Link href="/takeaways/join?mode=signin" className="text-sm font-medium text-villa-green hover:underline">
              {t('Sign in to unlock')}
            </Link>
          </div>
        </div>
      )}
    </aside>
  )
}
