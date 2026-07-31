// Browse by category: the primary navigation of Our Bali Takeaways.
// Server-rendered real links (SEO) to dedicated category pages, never filters.
// The grid is driven by PUBLIC_CATEGORIES, so adding a category (tours, water
// sports, hikes, nightlife, nomad life...) needs no change here.
import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/takeaways/Reveal'
import { categoryHref, type TakeawayCategory } from '@/lib/takeaways-shared'

// Placeholder panels for categories that have no photo yet. Three brand tints
// rotate through the grid so it reads as a designed set, not a missing image.
const PLACEHOLDER_TINTS = [
  'from-villa-green via-[#47694a] to-[#2b402c]',
  'from-[#2b402c] via-villa-green to-villa-green-light',
  'from-[#4a5f3c] via-[#3d5a3e] to-[#243524]',
]

export interface CategoryCardCopy {
  label: string
  description: string
  count?: number
}

export default function CategoryGrid({
  categories,
  copy,
  countLabel,
  emptyLabel,
}: {
  categories: TakeawayCategory[]
  /** Translated label + description per category, same order as `categories`. */
  copy: CategoryCardCopy[]
  /** e.g. "guides" — rendered as "3 guides". */
  countLabel: string
  /** Shown instead of a count while a category has no content yet. */
  emptyLabel: string
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((cat, i) => {
        const c = copy[i] ?? { label: cat.label, description: cat.description }
        return (
          <Reveal key={cat.slug} delay={(i % 3) * 0.06}>
            <Link
              href={categoryHref(cat.slug)}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-villa-gold/40 hover:shadow-[0_22px_45px_-20px_rgba(61,90,62,0.4)]"
            >
              <div className="relative h-40 overflow-hidden">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={c.label}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  // Placeholder panel until a category photo is added. Keeps the
                  // card layout identical, so dropping in an image changes nothing.
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${PLACEHOLDER_TINTS[i % PLACEHOLDER_TINTS.length]}`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(201,168,76,0.28),transparent_60%)]" />
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-8 right-3 select-none font-serif text-[8.5rem] italic leading-none text-white/[0.13]"
                    >
                      {c.label.charAt(0)}
                    </span>
                    <span className="absolute bottom-5 left-6 h-px w-10 bg-villa-gold/70" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-serif text-2xl font-light text-villa-dark transition-colors duration-300 group-hover:text-villa-green">
                  {c.label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-villa-muted">{c.description}</p>
                <div className="mt-auto flex items-center justify-between pt-5">
                  <span className="text-xs uppercase tracking-[0.16em] text-villa-muted/80">
                    {c.count ? `${c.count} ${countLabel}` : emptyLabel}
                  </span>
                  <span
                    className="text-villa-green transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        )
      })}
    </div>
  )
}
