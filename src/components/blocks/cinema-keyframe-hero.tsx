'use client'

/**
 * CinemaKeyframeHero
 * ------------------
 * Scroll-driven cinematic composite built from THREE stills:
 *   frame1 = open villa (curtains tied back)
 *   frame2 = home cinema formed (curtains closed, screen down showing the pool)
 *   frame3 = the pool, full-frame (what lives on the screen, zoomed in)
 *
 * As the visitor scrolls (pinned + scrubbed via GSAP):
 *   Phase A  villa dims + pushes in, theatre curtains sweep closed, cross-dissolve to the cinema.
 *   Phase B  the camera dives INTO the projector screen until the pool fills the whole viewport.
 *
 * Native-resolution stills + GPU transforms = perfectly smooth, no video compression.
 */

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '@/lib/gsap'

interface CinemaKeyframeHeroProps {
  frame1Src?: string
  frame2Src?: string
  frame3Src?: string
  title?: string
  kicker?: string
  scrollHint?: string
  /** Total section height in vh; higher = slower scroll. Pin scrub distance = this minus 100vh. */
  scrollLengthVh?: number
  /** Transform origin (viewport %) of the projector screen inside frame2 — the zoom target. */
  screenOriginX?: number
  screenOriginY?: number
  /** How far to dive into the screen. */
  zoomScale?: number
}

export default function CinemaKeyframeHero({
  frame1Src = '/hero-cinema/frame1.webp',
  frame2Src = '/hero-cinema/frame2.webp',
  frame3Src = '/hero-cinema/frame3.webp',
  title = 'Your Bali Getaway',
  kicker = 'Bali, Indonesia',
  scrollHint = 'Scroll to explore',
  scrollLengthVh = 360,
  screenOriginX = 50,
  screenOriginY = 38,
  zoomScale = 4.0,
}: CinemaKeyframeHeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const layer1Ref = useRef<HTMLDivElement>(null)
  const layer2Ref = useRef<HTMLDivElement>(null)
  const layer3Ref = useRef<HTMLDivElement>(null)
  const curtainLRef = useRef<HTMLDivElement>(null)
  const curtainRRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const [loaded, setLoaded] = useState(0)
  const [ready, setReady] = useState(false)
  const [reduced, setReduced] = useState(false)

  const sources = [frame1Src, frame2Src, frame3Src]

  // ── Reduced-motion probe ──
  useEffect(() => {
    setReduced(prefersReducedMotion())
  }, [])

  // ── Preload the three stills ──
  useEffect(() => {
    let cancelled = false
    let count = 0
    for (const src of sources) {
      const img = new Image()
      const onOne = () => {
        if (cancelled) return
        count += 1
        setLoaded(count)
      }
      img.onload = onOne
      img.onerror = onOne
      img.src = src
    }
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame1Src, frame2Src, frame3Src])

  useEffect(() => {
    if (ready) return
    if (loaded >= 3) {
      setReady(true)
      return
    }
    const t = setTimeout(() => setReady(true), 5000)
    return () => clearTimeout(t)
  }, [loaded, ready])

  // Lock scroll behind the loader until the stills are ready.
  useEffect(() => {
    if (reduced) return
    document.body.style.overflow = ready ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [ready, reduced])

  // Keep the Navbar's "jump to section" / "back to top" behaviour working.
  useEffect(() => {
    const onExpand = () => setReady(true)
    const onReset = () => window.scrollTo({ top: 0, behavior: 'smooth' })
    window.addEventListener('hero:expand', onExpand)
    window.addEventListener('hero:reset', onReset)
    return () => {
      window.removeEventListener('hero:expand', onExpand)
      window.removeEventListener('hero:reset', onReset)
    }
  }, [])

  // ── Scroll-scrubbed timeline ──
  useGSAP(
    () => {
      const l1 = layer1Ref.current
      const l2 = layer2Ref.current
      const l3 = layer3Ref.current
      const cl = curtainLRef.current
      const cr = curtainRRef.current
      if (!l1 || !l2 || !l3) return

      if (reduced) {
        gsap.set(l1, { opacity: 1, scale: 1 })
        gsap.set([l2, l3], { opacity: 0 })
        return
      }
      if (!ready) return

      // Initial states
      gsap.set(l1, { opacity: 1, scale: 1, filter: 'brightness(1)', transformOrigin: '50% 46%' })
      gsap.set(l2, { opacity: 0, scale: 1.06, transformOrigin: `${screenOriginX}% ${screenOriginY}%` })
      gsap.set(l3, { opacity: 0, scale: 1.16, transformOrigin: '50% 44%' })
      gsap.set([cl, cr], { opacity: 1 })
      gsap.set(cl, { xPercent: -100 })
      gsap.set(cr, { xPercent: 100 })

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1, // 1s catch-up = silky, slow feel
          pin: pinRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // Title + hint dissolve immediately as we push in.
      tl.to(overlayRef.current, { autoAlpha: 0, scale: 1.18, filter: 'blur(10px)', ease: 'power1.in', duration: 0.16 }, 0)
      tl.to('.kf-hint', { autoAlpha: 0, y: 12, duration: 0.06 }, 0)

      // ── Phase A — villa dims & pushes in, curtains sweep closed, dissolve to cinema ──
      tl.to(l1, { scale: 1.1, filter: 'brightness(0.32)', ease: 'power1.inOut', duration: 0.36 }, 0.06)
      tl.to(cl, { xPercent: -62, ease: 'power2.inOut', duration: 0.26 }, 0.05)
      tl.to(cr, { xPercent: 62, ease: 'power2.inOut', duration: 0.26 }, 0.05)
      tl.to(l2, { opacity: 1, duration: 0.2 }, 0.22)
      tl.to(l2, { scale: 1.0, ease: 'power2.out', duration: 0.24 }, 0.22)
      tl.to([cl, cr], { autoAlpha: 0, ease: 'power1.out', duration: 0.1 }, 0.36)

      // ── Phase B — dive into the projector screen until the pool fills the frame ──
      // Grow frame2 so its screen fills the viewport FIRST, then a short late
      // cross-dissolve swaps the (soft, upscaled) on-screen pool for the sharp full pool.
      tl.to(l2, { scale: zoomScale, ease: 'power1.in', duration: 0.54 }, 0.46)
      tl.fromTo(l3, { scale: 1.12 }, { scale: 1.0, ease: 'power1.out', duration: 0.44 }, 0.56)
      tl.to(l3, { opacity: 1, duration: 0.18 }, 0.8)

      const onResize = () => ScrollTrigger.refresh()
      window.addEventListener('resize', onResize)
      ScrollTrigger.refresh()
      return () => window.removeEventListener('resize', onResize)
    },
    { scope: sectionRef, dependencies: [ready, reduced] }
  )

  const progress = Math.round((loaded / 3) * 100)

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-villa-dark"
      style={{ height: reduced ? '100vh' : `${scrollLengthVh}vh` }}
    >
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        {/* Layer 1 — open villa */}
        <div ref={layer1Ref} className="absolute inset-0 will-change-transform">
          <img src={frame1Src} alt="Villa" className="h-full w-full object-cover" />
        </div>

        {/* Layer 2 — home cinema (zoom target) */}
        <div ref={layer2Ref} className="absolute inset-0 will-change-transform">
          <img src={frame2Src} alt="Home cinema" className="h-full w-full object-cover" />
        </div>

        {/* Layer 3 — pool, full frame */}
        <div ref={layer3Ref} className="absolute inset-0 will-change-transform">
          <img src={frame3Src} alt="Private pool" className="h-full w-full object-cover" />
        </div>

        {/* Theatre curtains (Phase A flourish) */}
        <div
          ref={curtainLRef}
          className="pointer-events-none absolute inset-y-0 left-0 z-[6] w-1/2"
          style={{
            background:
              'linear-gradient(90deg, #2a0709 0%, #4a0d12 55%, #6d1119 82%, rgba(109,17,25,0.15) 100%)',
            boxShadow: 'inset -30px 0 60px rgba(0,0,0,0.55)',
          }}
        />
        <div
          ref={curtainRRef}
          className="pointer-events-none absolute inset-y-0 right-0 z-[6] w-1/2"
          style={{
            background:
              'linear-gradient(270deg, #2a0709 0%, #4a0d12 55%, #6d1119 82%, rgba(109,17,25,0.15) 100%)',
            boxShadow: 'inset 30px 0 60px rgba(0,0,0,0.55)',
          }}
        />

        {/* Readability gradients */}
        <div className="pointer-events-none absolute inset-0 z-[7] bg-gradient-to-b from-black/30 via-transparent to-black/45" />
        <div className="pointer-events-none absolute inset-0 z-[7] bg-[radial-gradient(ellipse_at_center,_transparent_45%,_rgba(0,0,0,0.35)_100%)]" />

        {/* Title overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center will-change-transform"
        >
          {kicker && (
            <p className="mb-4 text-xs uppercase tracking-[0.4em] text-villa-gold [text-shadow:_0_1px_10px_rgba(0,0,0,0.65)] md:text-sm">
              {kicker}
            </p>
          )}
          {title && (
            <h1 className="font-serif text-5xl font-light leading-[1.05] tracking-wide text-white [-webkit-text-stroke:0.5px_rgba(0,0,0,0.5)] [paint-order:stroke_fill] [text-shadow:_0_2px_18px_rgba(0,0,0,0.5)] md:text-7xl lg:text-8xl">
              {title}
            </h1>
          )}
          <div className="mt-7 h-px w-16 bg-villa-gold/70" />
        </div>

        {/* Scroll hint */}
        <div className="kf-hint absolute bottom-9 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/90">
          <span className="text-[0.7rem] uppercase tracking-[0.35em] [text-shadow:_0_1px_8px_rgba(0,0,0,0.7)]">
            {scrollHint}
          </span>
          <svg
            className="h-5 w-5 animate-bounce [filter:drop-shadow(0_1px_6px_rgba(0,0,0,0.6))]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Loader */}
        <div
          className={`absolute inset-0 z-20 flex flex-col items-center justify-center bg-villa-dark transition-opacity duration-700 ${
            ready ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        >
          <p className="mb-5 font-serif text-2xl font-light tracking-wide text-white/90">{title}</p>
          <div className="h-px w-40 overflow-hidden bg-white/15">
            <div className="h-full bg-villa-gold transition-[width] duration-200 ease-out" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-3 text-[0.7rem] uppercase tracking-[0.35em] text-white/50">Loading {progress}%</p>
        </div>
      </div>
    </section>
  )
}
