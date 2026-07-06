'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import VillaSearch from '@/components/VillaSearch'
import ReviewCarousel from '@/components/ReviewCarousel'
import CinemaScrollHero from '@/components/blocks/cinema-scroll-hero'
import { useCurrency } from '@/components/CurrencyProvider'
import { useLanguage } from '@/components/LanguageProvider'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import type { VillaCard } from './HomeWrapper'

export default function HomeClient({ villas }: { villas: VillaCard[] }) {
  const { format } = useCurrency()
  const { t } = useLanguage()
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      // Section headings: kicker, title, gold rule rise in sequence
      gsap.utils.toArray<HTMLElement>('.reveal-heading').forEach((el) => {
        gsap.from(el.children, {
          autoAlpha: 0,
          y: 26,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })

      // Gold hairlines grow from the center
      gsap.utils.toArray<HTMLElement>('.gold-rule').forEach((el) => {
        gsap.from(el, {
          scaleX: 0,
          duration: 1.1,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        })
      })

      // Villa cards: each card fully lit by the time it is in view (per-card triggers),
      // with a slow parallax drift on the cover photo while scrolling past
      gsap.utils.toArray<HTMLElement>('.villa-card').forEach((card) => {
        gsap.from(card, {
          autoAlpha: 0,
          y: 44,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 92%', once: true },
        })
        const media = card.querySelector('.villa-card-media')
        if (media) {
          gsap.fromTo(
            media,
            { yPercent: -7 },
            {
              yPercent: 7,
              ease: 'none',
              scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          )
        }
      })

      // Generic per-item rise (perks, booking panel, review block)
      gsap.utils.toArray<HTMLElement>('.rise-item').forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 34,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        })
      })
    },
    { scope: rootRef }
  )

  return (
    <div ref={rootRef} className="min-h-screen bg-villa-cream">
      <Navbar />

      {/* ── Hero (scroll-scrubbed 4K: V3 villa→cinema, V5 zoom, V2 immersive enter→pool) ── */}
      <CinemaScrollHero
        frameCount={244}
        scrollLengthVh={340}
        title="Your Bali Getaway"
        kicker={t('Bali, Indonesia')}
        scrollHint={t('Scroll to explore')}
      />


      {/* ── Villa Collection ── */}
      <section id="villas" data-nav-light-bg className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="reveal-heading text-center mb-16">
            <p className="text-villa-gold text-sm tracking-[0.3em] uppercase mb-3">{t('The Collection')}</p>
            <h2 className="font-serif text-4xl md:text-5xl text-villa-dark font-light">
              {t('Five Exceptional Villas')}
            </h2>
            <div className="gold-rule mx-auto mt-6 h-px w-16 bg-villa-gold/70" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {villas.map((villa) => (
              <div
                key={villa.slug}
                className="villa-card group flex flex-col bg-white rounded-2xl overflow-hidden border border-transparent shadow-sm transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-villa-gold/30 hover:shadow-[0_24px_50px_-18px_rgba(61,90,62,0.35)]"
              >
                <Link href={`/villas/${villa.slug}`} className="relative block h-64 overflow-hidden">
                  <div className="villa-card-media absolute inset-0 scale-[1.16] will-change-transform">
                    <Image
                      src={villa.coverUrl}
                      alt={villa.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex flex-wrap gap-1">
                      {villa.highlights.slice(0, villa.previewHighlightsCount ?? 3).map((h) => (
                        <span key={h} className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full border border-white/30">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
                <div className="p-6 flex flex-1 flex-col">
                  <div className="flex items-start justify-between mb-1">
                    <Link href={`/villas/${villa.slug}`}>
                      <h3 className="font-serif text-2xl text-villa-dark transition-colors duration-300 group-hover:text-villa-green">{villa.name}</h3>
                    </Link>
                    <span className="text-villa-gold text-sm flex items-center gap-1">★ {villa.rating}</span>
                  </div>
                  <p className="text-villa-muted text-sm mb-4">{villa.subtitle}</p>
                  <div className="flex items-center gap-4 text-sm text-villa-muted mb-4">
                    <span className="flex items-center gap-1"><BedIcon /> {villa.bedrooms} BR</span>
                    <span className="flex items-center gap-1"><BathIcon /> {villa.bathrooms} BA</span>
                    <span className="flex items-center gap-1"><GuestIcon /> {villa.guests} {t('guests')}</span>
                  </div>
                  {villa.fromPrice != null && (
                    <p className="text-villa-dark mb-4">
                      <span className="text-xs text-villa-muted">{t('From')} </span>
                      <span className="font-medium">{format(villa.fromPrice)}</span>
                      <span className="text-xs text-villa-muted"> {t('/ night')}</span>
                    </p>
                  )}
                  <div className="mt-auto flex items-center gap-3 pt-1">
                    <Link
                      href={`/villas/${villa.slug}#book`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-villa-green px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-villa-green-light"
                    >
                      {t('Check availability')}
                    </Link>
                    <Link
                      href={`/villas/${villa.slug}`}
                      className="group/view text-villa-green text-sm font-medium inline-flex items-center gap-1 whitespace-nowrap"
                    >
                      {t('View villa')}
                      <span className="inline-block transition-transform duration-300 group-hover/view:translate-x-1" aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Book Direct ── */}
      <section className="bg-villa-green py-20 px-6 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[640px] -translate-x-1/2 rounded-full bg-villa-gold/10 blur-3xl" />
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center relative">
          {[
            { icon: '✦', title: 'Best Rate Guarantee', body: 'Book direct and pay no platform fees. Always cheaper than Airbnb.' },
            { icon: '◈', title: 'Quick Confirmation', body: 'Send your dates and your host confirms personally. No double bookings, ever.' },
            { icon: '❋', title: 'Personal Service', body: 'Direct contact with your host via WhatsApp for a tailored Bali experience.' },
          ].map((item) => (
            <div key={item.title} className="rise-item text-white">
              <div className="text-villa-gold text-2xl mb-4">{item.icon}</div>
              <h3 className="font-serif text-xl mb-2">{t(item.title)}</h3>
              <p className="text-stone-300 text-sm leading-relaxed">{t(item.body)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Booking Widget ── */}
      <section id="book" data-nav-light-bg className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="reveal-heading text-center mb-12">
            <p className="text-villa-gold text-sm tracking-[0.3em] uppercase mb-3">{t('Direct Booking')}</p>
            <h2 className="font-serif text-4xl md:text-5xl text-villa-dark font-light mb-4">{t('Check Availability')}</h2>
            <p className="text-villa-muted max-w-lg mx-auto">
              {t('Select your dates and villa below. Real-time calendar. No double bookings, ever.')}
            </p>
          </div>
          <div className="rise-item relative bg-white rounded-2xl shadow-[0_18px_50px_-20px_rgba(26,26,26,0.18)] ring-1 ring-stone-100 p-6 md:p-8">
            <VillaSearch />
          </div>
        </div>
      </section>

      {/* ── Reviews Carousel ── */}
      <section data-nav-light-bg className="py-24 px-6 bg-villa-cream">
        <div className="max-w-5xl mx-auto">
          <div className="reveal-heading text-center mb-16">
            <p className="text-villa-gold text-sm tracking-[0.3em] uppercase mb-3">{t('Guest Experiences')}</p>
            <h2 className="font-serif text-4xl md:text-5xl text-villa-dark font-light">
              {t('What Our Guests Say')}
            </h2>
            <div className="gold-rule mx-auto mt-6 h-px w-16 bg-villa-gold/70" />
          </div>
          <div className="rise-item">
            <ReviewCarousel />
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
