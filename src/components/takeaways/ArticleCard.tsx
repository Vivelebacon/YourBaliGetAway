// Server-safe article card for the Takeaways guide (SEO: real links + text).
import Image from 'next/image'
import Link from 'next/link'
import type { TakeawayArticleCard } from '@/lib/takeaways'

export default function ArticleCard({
  article,
  categoryLabel,
  readLabel,
  large = false,
}: {
  article: TakeawayArticleCard
  categoryLabel: string
  readLabel: string
  large?: boolean
}) {
  return (
    <Link
      href={`/takeaways/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-transparent bg-white shadow-sm transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-villa-gold/30 hover:shadow-[0_24px_50px_-18px_rgba(61,90,62,0.35)]"
    >
      <div className={`relative overflow-hidden ${large ? 'h-72 md:h-96' : 'h-56'}`}>
        {article.coverUrl && (
          <Image
            src={article.coverUrl}
            alt={article.title}
            fill
            sizes={large ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/30 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white backdrop-blur-sm">
          {categoryLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className={`font-serif text-villa-dark transition-colors duration-300 group-hover:text-villa-green ${large ? 'text-3xl' : 'text-2xl'}`}>
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-villa-muted">{article.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-villa-green">
          {readLabel}
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
            →
          </span>
        </span>
      </div>
    </Link>
  )
}
