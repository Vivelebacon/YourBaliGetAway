'use client'

import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BookingWidget from '@/components/BookingWidget'
import { villas } from '@/lib/villas'

export default function HomeClient() {
  return (
    <div className="min-h-screen bg-villa-cream">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative h-screen">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="text-villa-gold text-sm tracking-[0.3em] uppercase mb-4">Bali, Indonesia</p>
          <h1 className="font-serif text-5xl md:text-7xl text-white font-light leading-tight mb-6">
            Your Private Bali Escape
          </h1>
          <p className="text-stone-200 text-lg md:text-xl max-w-xl mb-10 font-light">
            Five luxury pool villas. Book direct for the best rates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#villas"
              className="bg-villa-gold text-villa-dark px-8 py-3 rounded-full font-medium hover:bg-yellow-400 transition-colors"
            >
              Explore Villas
            </a>
            <a
              href="#book"
              className="border border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white/10 transition-colors"
            >
              Check Availability
            </a>
          </div>
        </div>
        <a
          href="#villas"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors"
          aria-label="Scroll down"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <svg className="w-6 h-6 animate-bounce mt-1" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </section>

      {/* ── Villa Collection ── */}
      <section id="villas" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-villa-gold text-sm tracking-[0.3em] uppercase mb-3">The Collection</p>
            <h2 className="font-serif text-4xl md:text-5xl text-villa-dark font-light">
              Five Exceptional Villas
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {villas.map((villa) => (
              <Link
                key={villa.slug}
                href={`/villas/${villa.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={`/images/${villa.slug}/${villa.coverImage}`}
                    alt={villa.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex flex-wrap gap-1">
                      {villa.highlights.slice(0, 2).map((h) => (
                        <span key={h} className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full border border-white/30">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-2xl text-villa-dark mb-1">{villa.name}</h3>
                  <p className="text-villa-muted text-sm mb-4">{villa.subtitle}</p>
                  <div className="flex items-center gap-4 text-sm text-villa-muted mb-5">
                    <span className="flex items-center gap-1"><BedIcon /> {villa.bedrooms} BR</span>
                    <span className="flex items-center gap-1"><BathIcon /> {villa.bathrooms} BA</span>
                    <span className="flex items-center gap-1"><GuestIcon /> {villa.guests} guests</span>
                  </div>
                  <span className="text-villa-green text-sm font-medium group-hover:underline">View Villa →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Book Direct ── */}
      <section className="bg-villa-green py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {[
            { icon: '✦', title: 'Best Rate Guarantee', body: 'Book direct and pay no platform fees. Always cheaper than Airbnb.' },
            { icon: '◈', title: 'Instant Confirmation', body: 'Real-time availability powered by Smoobu. No waiting, no double bookings.' },
            { icon: '❋', title: 'Personal Service', body: 'Direct contact with your host via WhatsApp for a tailored Bali experience.' },
          ].map((item) => (
            <div key={item.title} className="text-white">
              <div className="text-villa-gold text-2xl mb-4">{item.icon}</div>
              <h3 className="font-serif text-xl mb-2">{item.title}</h3>
              <p className="text-stone-300 text-sm leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Booking Widget ── */}
      <section id="book" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-villa-gold text-sm tracking-[0.3em] uppercase mb-3">Direct Booking</p>
            <h2 className="font-serif text-4xl md:text-5xl text-villa-dark font-light mb-4">Check Availability</h2>
            <p className="text-villa-muted max-w-lg mx-auto">
              Select your dates and villa below. Real-time calendar — no double bookings, ever.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <BookingWidget />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function BedIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10V6a1 1 0 011-1h16a1 1 0 011 1v4M3 10h18M3 10v8m18-8v8M3 18h18" />
    </svg>
  )
}

function BathIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 12h16M4 12a2 2 0 01-2-2V6a1 1 0 011-1h4v7M4 12v5a2 2 0 002 2h12a2 2 0 002-2v-5" />
    </svg>
  )
}

function GuestIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}
