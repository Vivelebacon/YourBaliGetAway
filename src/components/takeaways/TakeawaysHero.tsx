'use client'

// Compact hero for Our Bali Takeaways. Deliberately shorter than a full
// viewport: the category grid has to be visible (or near-visible) without
// scrolling, so visitors see what the hub offers straight away. Keeps the
// villa-tour loop and the staged title reveal for the brand identity.
import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { useLanguage } from '@/components/LanguageProvider'

// Anchors live on the landing page sections; the buttons scroll to them.
const ANCHORS = { categories: '#browse-by-category', featured: '#featured-takeaways' }

export default function TakeawaysHero() {
  const rootRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      // Staged entrance: kicker, split title, subtitle, buttons.
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.tk-hero-kicker', { autoAlpha: 0, y: 18, duration: 0.6 }, 0.1)
        .from('.tk-hero-line', { autoAlpha: 0, y: 34, duration: 0.8, stagger: 0.12 }, 0.22)
        .from('.tk-hero-sub', { autoAlpha: 0, y: 16, duration: 0.6 }, 0.7)
        .from('.tk-hero-cta', { autoAlpha: 0, y: 14, duration: 0.6, stagger: 0.08 }, 0.85)

      // Gentle push-in on scroll. Short travel: the hero leaves quickly.
      gsap.to(mediaRef.current, {
        scale: 1.08,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.tk-hero-veil', {
        opacity: 0.7,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    },
    { scope: rootRef },
  )

  function scrollTo(hash: string) {
    document.querySelector(hash)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <section
      ref={rootRef}
      className="relative flex h-[58vh] min-h-[430px] max-h-[620px] w-full items-center justify-center overflow-hidden bg-villa-dark"
    >
      <div ref={mediaRef} className="absolute inset-0 will-change-transform">
        <video
          className="h-full w-full object-cover"
          src="/takeaways/hero-loop.mp4"
          poster="/takeaways/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>

      {/* Readability veils */}
      <div className="tk-hero-veil pointer-events-none absolute inset-0 bg-black/40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-villa-cream" />

      <div className="relative z-10 flex w-full flex-col items-center px-6 pt-16 text-center">
        <p className="tk-hero-kicker mb-4 text-[0.7rem] uppercase tracking-[0.45em] text-villa-gold [text-shadow:_0_1px_10px_rgba(0,0,0,0.6)] md:text-xs">
          {t('Insider Guide')}
        </p>
        {/* Brand name: intentionally not translated */}
        <h1 className="font-serif font-light tracking-wide text-white [-webkit-text-stroke:0.5px_rgba(0,0,0,0.45)] [paint-order:stroke_fill] [text-shadow:_0_2px_18px_rgba(0,0,0,0.5)]">
          <span className="tk-hero-line block text-4xl md:text-6xl lg:text-7xl">Our Bali</span>
          <span className="tk-hero-line block text-4xl italic md:text-6xl lg:text-7xl">Takeaways</span>
        </h1>
        <p className="tk-hero-sub mt-5 max-w-2xl text-sm leading-relaxed text-white/90 [text-shadow:_0_1px_10px_rgba(0,0,0,0.6)] md:text-base">
          {t(
            'Specific recommendations, practical local knowledge, and entertaining Bali insights from our hosts and fellow guests.',
          )}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => scrollTo(ANCHORS.categories)}
            className="tk-hero-cta rounded-full bg-white px-7 py-3 text-sm font-medium text-villa-green shadow-lg shadow-black/20 transition-colors hover:bg-villa-cream"
          >
            {t('Browse Recommendations')}
          </button>
          <button
            type="button"
            onClick={() => scrollTo(ANCHORS.featured)}
            className="tk-hero-cta rounded-full border border-white/70 px-7 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/15"
          >
            {t('Read Featured Takeaways')}
          </button>
        </div>
      </div>
    </section>
  )
}
