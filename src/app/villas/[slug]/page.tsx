import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BookingWidget from '@/components/BookingWidget'
import Gallery from '@/components/Gallery'
import { villas, getVilla, getSmoobuId } from '@/lib/villas'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return villas.map((v) => ({ slug: v.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const villa = getVilla(slug)
  if (!villa) return {}
  return {
    title: `${villa.name} — ${villa.subtitle} | YBG Villas`,
    description: villa.description,
  }
}

export default async function VillaPage({ params }: Props) {
  const { slug } = await params
  const villa = getVilla(slug)
  if (!villa) notFound()

  const widgetId = getSmoobuId(slug)
  const base = `/images/${slug}`

  // Hero: first exterior image, fallback to first image
  const hero =
    villa.images.find((i) => i.category === 'Exterior') ??
    villa.images[0]

  // Gallery: all images from the villa's image list
  const gallery = villa.images

  // Other villas for "You might also like"
  const others = villas.filter((v) => v.slug !== slug).slice(0, 3)

  return (
    <div className="min-h-screen bg-villa-cream">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative h-[80vh]">
        <Image
          src={`${base}/${hero.path}`}
          alt={`${villa.name} — ${hero.category}`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pt-16">
          <p className="text-villa-gold text-sm tracking-[0.3em] uppercase mb-3">YBG Villas</p>
          <h1 className="font-serif text-5xl md:text-7xl text-white font-light mb-3">
            {villa.name}
          </h1>
          <p className="text-stone-200 text-lg font-light">{villa.subtitle}</p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {villa.highlights.map((h) => (
              <span
                key={h}
                className="bg-white/15 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full border border-white/30"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats + description ── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="flex gap-8 mb-8">
              <Stat label="Bedrooms" value={String(villa.bedrooms)} />
              <Stat label="Bathrooms" value={String(villa.bathrooms)} />
              <Stat label="Guests" value={`Up to ${villa.guests}`} />
            </div>
            <p className="text-stone-600 leading-relaxed text-lg font-light">{villa.description}</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="font-serif text-2xl text-villa-dark mb-5">What&apos;s Included</h3>
            <ul className="grid grid-cols-2 gap-3">
              {[...villa.highlights, 'Air Conditioning', 'WiFi', 'Daily Housekeeping']
                .filter((v, i, a) => a.indexOf(v) === i) // dedupe
                .map((h) => (
                  <li key={h} className="flex items-center gap-2 text-sm text-stone-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-villa-gold flex-shrink-0" />
                    {h}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Photo Gallery with lightbox ── */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl text-villa-dark mb-8">Gallery</h2>
          <Gallery slug={slug} images={gallery} />
        </div>
      </section>

      {/* ── Booking Widget ── */}
      <section id="book" className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-villa-gold text-sm tracking-[0.3em] uppercase mb-3">Direct Booking</p>
            <h2 className="font-serif text-4xl text-villa-dark font-light mb-3">
              Reserve {villa.name}
            </h2>
            <p className="text-stone-500 text-sm">
              Real-time availability. No double bookings. Best rate guaranteed.
            </p>
          </div>
          <BookingWidget widgetId={widgetId} />
        </div>
      </section>

      {/* ── Other Villas ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl text-villa-dark mb-10">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {others.map((v) => (
              <Link
                key={v.slug}
                href={`/villas/${v.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={`/images/${v.slug}/${v.coverImage}`}
                    alt={v.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-xl text-villa-dark">{v.name}</h3>
                  <p className="text-villa-muted text-sm mt-1">{v.subtitle}</p>
                  <span className="text-villa-green text-sm mt-3 inline-block group-hover:underline">
                    View Villa →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="text-center py-8">
        <Link href="/" className="text-villa-muted text-sm hover:text-villa-green transition-colors">
          ← Back to all villas
        </Link>
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
