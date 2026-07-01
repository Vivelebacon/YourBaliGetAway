import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BookingCalendar from '@/components/BookingCalendar'
import Gallery from '@/components/Gallery'
import { getHostawayListingId } from '@/lib/villas'
import { getVillaBySlug, getVillaSlugs, getVillasList } from '@/lib/content'

// Revalidate from Supabase periodically; admin edits also trigger on-demand
// revalidation, so changes appear within seconds.
export const revalidate = 60

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getVillaSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const villa = await getVillaBySlug(slug)
  if (!villa) return {}
  return {
    title: `${villa.name} — ${villa.subtitle} | YBG Villas`,
    description: villa.description.slice(0, 160),
  }
}

export default async function VillaPage({ params }: Props) {
  const { slug } = await params
  const villa = await getVillaBySlug(slug)
  if (!villa) notFound()

  const listingId = getHostawayListingId(slug)
  const others = (await getVillasList()).filter((v) => v.slug !== slug).slice(0, 3)

  const descIsHtml = /<[a-z][\s\S]*>/i.test(villa.description)
  const descParagraphs = villa.description.split('\n\n').filter(Boolean)

  return (
    <div className="min-h-screen bg-villa-cream">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative h-[80vh]">
        <Image src={villa.coverUrl} alt={villa.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pt-16">
          <p className="text-villa-gold text-sm tracking-[0.3em] uppercase mb-3">YBG Villas</p>
          <h1 className="font-serif text-5xl md:text-7xl text-white font-light mb-3">{villa.name}</h1>
          {/* Rating */}
          <div className="flex items-center gap-2 mt-4 text-white/80 text-sm">
            <span className="text-villa-gold">★</span>
            <span>{villa.rating}</span>
            <span className="text-white/40">·</span>
            <span>{villa.reviewCount} reviews</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {villa.highlights.map((h) => (
              <span key={h} className="bg-white/15 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full border border-white/30">{h}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats + Description ── */}
      <section data-nav-light-bg className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            {villa.subtitle && (
              <p className="text-villa-green text-lg font-light italic mb-6">{villa.subtitle}</p>
            )}
            <div className="flex gap-8 mb-8">
              <Stat label="Bedrooms" value={String(villa.bedrooms)} />
              <Stat label="Bathrooms" value={String(villa.bathrooms)} />
              <Stat label="Guests" value={`Up to ${villa.guests}`} />
            </div>
            {descIsHtml ? (
              <div
                className="prose prose-stone max-w-none text-stone-600 font-light prose-headings:font-serif prose-headings:text-villa-dark prose-headings:font-light prose-a:text-villa-green"
                dangerouslySetInnerHTML={{ __html: villa.description }}
              />
            ) : (
              <div className="space-y-4">
                {descParagraphs.map((p, i) => (
                  <p key={i} className="text-stone-600 leading-relaxed font-light">{p}</p>
                ))}
              </div>
            )}
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="font-serif text-2xl text-villa-dark mb-5">Amenities</h3>
            <ul className="grid grid-cols-1 gap-3">
              {villa.amenities.map((a) => (
                <li key={a} className="flex items-center gap-3 text-sm text-stone-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-villa-gold flex-shrink-0" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Booking Widget ── */}
      <section id="book" data-nav-light-bg className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-villa-gold text-sm tracking-[0.3em] uppercase mb-3">Direct Booking</p>
            <h2 className="font-serif text-4xl text-villa-dark font-light mb-3">Reserve {villa.name}</h2>
            <p className="text-stone-500 text-sm">Real-time availability. Send a request and your host confirms. Best rate guaranteed.</p>
          </div>
          {listingId && (
            <BookingCalendar listingId={listingId} villaName={villa.name} maxGuests={villa.guests} />
          )}
        </div>
      </section>

      {/* ── Gallery ── */}
      <section data-nav-light-bg className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl text-villa-dark mb-8">Gallery</h2>
          <Gallery images={villa.images} />
        </div>
      </section>

      {/* ── Reviews ── */}
      <section data-nav-light-bg className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-baseline gap-4 mb-10">
            <h2 className="font-serif text-3xl text-villa-dark">Guest Reviews</h2>
            <span className="text-villa-gold text-lg">★ {villa.rating}</span>
            <span className="text-stone-400 text-sm">({villa.reviewCount} reviews on Airbnb)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {villa.reviews.map((r) => (
              <div key={r.name} className="bg-villa-cream rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-villa-green flex items-center justify-center text-white font-medium text-sm">
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-villa-dark text-sm">{r.name}</p>
                    <div className="flex gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => <span key={i} className="text-villa-gold text-xs">★</span>)}
                    </div>
                  </div>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed italic">&ldquo;{r.text}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Other Villas ── */}
      <section data-nav-light-bg className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl text-villa-dark mb-10">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {others.map((v) => (
              <Link key={v.slug} href={`/villas/${v.slug}`} className="group bg-villa-cream rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                <div className="relative h-48 overflow-hidden">
                  <Image src={v.coverUrl} alt={v.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-serif text-xl text-villa-dark">{v.name}</h3>
                    <span className="text-villa-gold text-sm">★ {v.rating}</span>
                  </div>
                  <p className="text-villa-muted text-sm">{v.subtitle}</p>
                  <span className="text-villa-green text-sm mt-3 inline-block group-hover:underline">View Villa →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="text-center py-8">
        <Link href="/" className="text-villa-muted text-sm hover:text-villa-green transition-colors">← Back to all villas</Link>
      </div>

      <Footer />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-serif text-3xl text-villa-green">{value}</p>
      <p className="text-sm text-stone-500 mt-0.5">{label}</p>
    </div>
  )
}
