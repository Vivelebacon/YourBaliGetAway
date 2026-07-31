'use client'

// Full-content archive with category filters, at the bottom of the guide.
// The old pills used to be the page's main navigation; here they are only a
// filter over a complete list, which is what they are actually good for.
// The whole archive is rendered server-side first (SEO), then filtered in place.
import { useState } from 'react'
import Link from 'next/link'
import type { TakeawayArticleCard } from '@/lib/takeaways'

export default function ArchiveFilters({
  articles,
  categories,
  allLabel,
  byLabel,
}: {
  articles: TakeawayArticleCard[]
  /** Only the categories that actually have content, with translated labels. */
  categories: { slug: string; label: string }[]
  allLabel: string
  byLabel: string
}) {
  const [active, setActive] = useState<string | null>(null)
  const shown = active ? articles.filter((a) => a.category === active) : articles
  const labels = Object.fromEntries(categories.map((c) => [c.slug, c.label]))

  const pill = 'rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.14em] transition-colors'

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setActive(null)}
          className={`${pill} ${
            active === null
              ? 'border-villa-green bg-villa-green text-white'
              : 'border-villa-green/25 bg-white text-villa-green hover:border-villa-green/60'
          }`}
        >
          {allLabel}
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setActive(c.slug)}
            className={`${pill} ${
              active === c.slug
                ? 'border-villa-green bg-villa-green text-white'
                : 'border-villa-green/25 bg-white text-villa-green hover:border-villa-green/60'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <ul className="mx-auto mt-10 max-w-3xl divide-y divide-stone-200">
        {shown.map((a) => (
          <li key={a.slug}>
            <Link
              href={`/takeaways/${a.slug}`}
              className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4"
            >
              <span className="font-serif text-lg text-villa-dark transition-colors group-hover:text-villa-green">
                {a.title}
              </span>
              <span className="text-xs uppercase tracking-[0.14em] text-villa-muted">
                {labels[a.category] ?? a.category} · {byLabel} {a.author}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
