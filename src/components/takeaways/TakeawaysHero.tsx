'use client'

// Cinematic hero for Our Bali Takeaways: a compact villa-tour loop with a
// scroll parallax and a staged title reveal. Light by design (1.8MB loop,
// poster for instant LCP) so the guide page stays fast and SEO-friendly.
import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { useLanguage } from '@/components/LanguageProvider'

export default function TakeawaysHero() {
  const rootRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      // Staged entrance: kicker, split title, subtitle, scroll cue.
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.tk-hero-kicker', { autoAlpha: 0, y: 22, duration: 0.7 }, 0.15)
        .from('.tk-hero-line', { autoAlpha: 0, y: 42, duration: 0.9, stagger: 0.14 }, 0.3)
        .from('.tk-hero-sub', { autoAlpha: 0, y: 20, duration: 0.7 }, 0.85)
        .from('.tk-hero-cue', { autoAlpha: 0, y: 12, duration: 0.6 }, 1.05)

      // Scroll parallax: the film slowly pushes in and dims as the guide arrives.
      gsap.to(mediaRef.current, {
        scale: 1.12,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.tk-hero-veil', {
        opacity: 0.75,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.tk-hero-copy', {
        yPercent: -18,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: '70% top', scrub: true },
      })
    },
    { scope: rootRef },
  )

  return (
    <section ref={rootRef} className="relative h-screen w-full overflow-hidden bg-villa-dark">
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
      <div className="tk-hero-veil pointer-events-none absolute inset-0 bg-black/35" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-villa-cream" />

      <div className="tk-hero-copy absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <p className="tk-hero-kicker mb-5 text-xs uppercase tracking-[0.45em] text-villa-gold [text-shadow:_0_1px_10px_rgba(0,0,0,0.6)] md:text-sm">
          {t('Insider Guide')}
        </p>
        {/* Brand name: intentionally not translated */}
        <h1 className="font-serif font-light tracking-wide text-white [-webkit-text-stroke:0.5px_rgba(0,0,0,0.45)] [paint-order:stroke_fill] [text-shadow:_0_2px_18px_rgba(0,0,0,0.5)]">
          <span className="tk-hero-line block text-5xl md:text-7xl lg:text-8xl">Our Bali</span>
          <span className="tk-hero-line block text-5xl italic md:text-7xl lg:text-8xl">Takeaways</span>
        </h1>
        <p className="tk-hero-sub mt-6 max-w-xl font-serif text-lg italic text-white/90 [text-shadow:_0_1px_10px_rgba(0,0,0,0.55)] md:text-xl">
          {t('The insider guide to Bali by your hosts and fellow guests.')}
        </p>
      </div>

      <div className="tk-hero-cue absolute bottom-9 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/90">
        <span className="text-[0.7rem] uppercase tracking-[0.35em] [text-shadow:_0_1px_8px_rgba(0,0,0,0.7)]">
          {t('Scroll to explore')}
        </span>
        <svg className="h-5 w-5 animate-bounce [filter:drop-shadow(0_1px_6px_rgba(0,0,0,0.6))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
