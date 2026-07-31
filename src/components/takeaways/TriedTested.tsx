// Tried & Tested: a flexible strip of individual recommendations. Cards link
// through to the relevant category page. The card body is intentionally light:
// the final structure of a recommendation is not decided yet, so extra fields
// (photo, area, price, booking link) can be added without changing the section.
import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/takeaways/Reveal'
import { categoryHref } from '@/lib/takeaways-shared'
import type { TriedTestedItem } from '@/lib/tried-tested'

export default function TriedTested({
  items,
  copy,
  soonLabel,
  seeLabel,
}: {
  items: TriedTestedItem[]
  /** Translated kind + title + note per item, same order as `items`. */
  copy: { kind: string; title: string; note?: string }[]
  soonLabel: string
  seeLabel: string
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => {
        const c = copy[i] ?? item
        const placeholder = item.status === 'placeholder'
        // A slot with no photo yet gets the dashed outline; once it has an
        // image the card reads as a real card carrying a "coming soon" tag.
        const outlined = placeholder && !item.image
        return (
          <Reveal key={`${item.category}-${i}`} delay={(i % 3) * 0.06}>
            <Link
              href={categoryHref(item.category)}
              className={`group flex h-full flex-col rounded-2xl border p-6 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-villa-gold/40 hover:shadow-[0_18px_40px_-22px_rgba(61,90,62,0.4)] ${
                outlined ? 'border-dashed border-stone-300 bg-white/60' : 'border-stone-200/80 bg-white'
              }`}
            >
              {item.image && (
                <div className="relative mb-5 h-36 overflow-hidden rounded-xl">
                  <Image
                    src={item.image}
                    alt={c.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.7rem] uppercase tracking-[0.22em] text-villa-gold">{c.kind}</p>
                {placeholder && (
                  <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[0.65rem] uppercase tracking-[0.14em] text-villa-muted">
                    {soonLabel}
                  </span>
                )}
              </div>
              <h3
                className={`mt-3 font-serif text-xl font-light leading-snug transition-colors duration-300 group-hover:text-villa-green ${
                  outlined ? 'text-villa-dark/70' : 'text-villa-dark'
                }`}
              >
                {c.title}
              </h3>
              {c.note && <p className="mt-2 text-sm leading-relaxed text-villa-muted">{c.note}</p>}
              <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-villa-green">
                {seeLabel}
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                  →
                </span>
              </span>
            </Link>
          </Reveal>
        )
      })}
    </div>
  )
}
