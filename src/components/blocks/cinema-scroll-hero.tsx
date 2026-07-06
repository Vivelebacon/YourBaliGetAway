'use client'

/**
 * CinemaScrollHero
 * ----------------
 * Apple-style scroll-scrubbed image sequence. As the visitor scrolls, the camera
 * dollies from the villa living room *into* the home-cinema screen and ends fully
 * immersed in the pool scene. Every scroll pixel scrubs one frame of a pre-extracted
 * WebP sequence drawn onto a <canvas> (no <video>), driven by GSAP ScrollTrigger.
 *
 * Mobile: to stay light and smooth on phones, we swap to a lower-resolution,
 * half-frame-count sequence (public/hero-seq-mobile, 1152×648, 122 frames ≈ 6.9MB
 * vs the desktop 1600×900, 244 frames ≈ 30MB) and cap the canvas at 1× DPR.
 * Desktop rendering is unchanged.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '@/lib/gsap'

interface CinemaScrollHeroProps {
  frameCount?: number
  framePath?: (i: number) => string
  /** Lighter frame set + count used on phones (defaults to the hero-seq-mobile sequence). */
  mobileFrameCount?: number
  mobileFramePath?: (i: number) => string
  title?: string
  kicker?: string
  scrollHint?: string
  /** Total section height in vh; pin scrub distance = this minus 100vh. */
  scrollLengthVh?: number
}

const pad4 = (n: number) => String(n).padStart(4, '0')

export default function CinemaScrollHero({
  frameCount = 244,
  framePath = (i) => `/hero-seq/frame_${pad4(i)}.webp`,
  mobileFrameCount = 122,
  mobileFramePath = (i) => `/hero-seq-mobile/frame_${pad4(i)}.webp`,
  title = 'Your Bali Getaway',
  kicker = 'Bali, Indonesia',
  scrollHint = 'Scroll to explore',
  scrollLengthVh = 340,
}: CinemaScrollHeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const frameRef = useRef({ i: 0 })

  const [loaded, setLoaded] = useState(0)
  const [ready, setReady] = useState(false)
  const [reduced, setReduced] = useState(false)

  // Decide the device tier once, synchronously, before the preloader runs so we
  // fetch the right frame set exactly once (no double download on phones).
  const [isMobile] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 768px), (pointer: coarse) and (max-width: 926px)').matches
  )
  const activeFrameCount = isMobile ? mobileFrameCount : frameCount
  const activeFramePath = isMobile ? mobileFramePath : framePath

  // ── Canvas helpers ────────────────────────────────────────────────────────
  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    // Cap at 1× on phones: a lower-res source gains nothing from a 2×–3× canvas
    // and the extra pixels are what make the scroll scrub stutter on mobile GPUs.
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 2)
    canvas.width = Math.floor(window.innerWidth * dpr)
    canvas.height = Math.floor(window.innerHeight * dpr)
  }, [isMobile])

  const drawFrame = useCallback((target: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Pick the requested frame, falling back to the nearest already-decoded one.
    let idx = Math.max(0, Math.min(activeFrameCount - 1, Math.round(target)))
    let img = imagesRef.current[idx]
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let j = idx; j >= 0; j--) {
        const candidate = imagesRef.current[j]
        if (candidate && candidate.complete && candidate.naturalWidth) {
          idx = j
          img = candidate
          break
        }
      }
    }
    if (!img || !img.complete || img.naturalWidth === 0) return

    const cw = canvas.width
    const ch = canvas.height
    const iw = img.naturalWidth
    const ih = img.naturalHeight
    const scale = Math.max(cw / iw, ch / ih) // object-fit: cover
    const dw = iw * scale
    const dh = ih * scale
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
  }, [activeFrameCount])

  // ── Reduced-motion probe ──────────────────────────────────────────────────
  useEffect(() => {
    setReduced(prefersReducedMotion())
  }, [])

  // ── Preload the whole sequence ────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    let count = 0
    const imgs: HTMLImageElement[] = new Array(activeFrameCount)

    for (let i = 1; i <= activeFrameCount; i++) {
      const img = new Image()
      img.decoding = 'async'
      const onOne = () => {
        if (cancelled) return
        count += 1
        setLoaded(count)
        if (i === 1) {
          sizeCanvas()
          drawFrame(0) // show something the instant the first frame is ready
        }
      }
      img.onload = onOne
      img.onerror = onOne
      img.src = activeFramePath(i)
      imgs[i - 1] = img
    }

    imagesRef.current = imgs
    return () => {
      cancelled = true
    }
  }, [activeFrameCount, activeFramePath, sizeCanvas, drawFrame])

  // Reveal when every frame is decoded, with a safety timeout for slow links.
  useEffect(() => {
    if (ready) return
    if (loaded >= activeFrameCount) {
      setReady(true)
      return
    }
    const t = setTimeout(() => setReady(true), 6000)
    return () => clearTimeout(t)
  }, [loaded, activeFrameCount, ready])

  // Lock scroll behind the loader so the sequence never plays half-loaded.
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

  // ── Scroll-scrub timeline ─────────────────────────────────────────────────
  useGSAP(
    () => {
      if (reduced) {
        // Static, immersive end-frame. No pin, no scrub.
        sizeCanvas()
        drawFrame(activeFrameCount - 1)
        const onResize = () => {
          sizeCanvas()
          drawFrame(activeFrameCount - 1)
        }
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
      }

      if (!ready) return

      sizeCanvas()
      drawFrame(0)

      const render = () => drawFrame(frameRef.current.i)

      // Frame scrub: 0 → last across the pinned distance.
      gsap.to(frameRef.current, {
        i: activeFrameCount - 1,
        ease: 'none',
        onUpdate: render,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
          pin: pinRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // Title pulls toward the lens and dissolves as we enter the screen.
      gsap.to(overlayRef.current, {
        autoAlpha: 0,
        scale: 1.28,
        filter: 'blur(10px)',
        ease: 'power1.in',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '34% top',
          scrub: true,
        },
      })

      // Subtitle + scroll cue fade as the dive begins.
      gsap.to('.cinema-scroll-hint', {
        autoAlpha: 0,
        y: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '16% top',
          scrub: true,
        },
      })

      const onResize = () => {
        sizeCanvas()
        render()
        ScrollTrigger.refresh()
      }
      window.addEventListener('resize', onResize)
      ScrollTrigger.refresh()
      return () => window.removeEventListener('resize', onResize)
    },
    { scope: sectionRef, dependencies: [ready, reduced, activeFrameCount] }
  )

  const progress = Math.round((loaded / activeFrameCount) * 100)

  // Typography matched to the live site: split serif title + italic subtitle + gold cue.
  const firstWord = title ? title.split(' ')[0] : ''
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : ''
  const titleClasses =
    'font-serif font-light tracking-wide text-5xl md:text-6xl lg:text-7xl text-white [-webkit-text-stroke:0.5px_rgba(0,0,0,0.55)] [paint-order:stroke_fill] [text-shadow:_0_2px_14px_rgba(0,0,0,0.45)]'

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full bg-villa-dark"
      style={{ height: reduced ? '100vh' : `${scrollLengthVh}vh` }}
    >
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />

        {/* Cinematic readability gradients */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/45" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_45%,_rgba(0,0,0,0.35)_100%)]" />

        {/* Title overlay (matches the live site: split serif headline) */}
        <div
          ref={overlayRef}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center will-change-transform"
        >
          {title && (
            <>
              <h2 className={titleClasses}>{firstWord}</h2>
              <h2 className={titleClasses}>{restOfTitle}</h2>
            </>
          )}
        </div>

        {/* Subtitle + scroll cue (bottom): italic place, gold cue — as on the live site */}
        <div className="cinema-scroll-hint absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-center">
          {kicker && (
            <p className="font-serif italic text-xl text-white/90 [text-shadow:_0_1px_10px_rgba(0,0,0,0.5)] md:text-2xl">
              {kicker}
            </p>
          )}
          {scrollHint && (
            <p className="text-xs uppercase tracking-[0.35em] text-villa-gold [text-shadow:_0_1px_8px_rgba(0,0,0,0.6)] md:text-sm">
              {scrollHint}
            </p>
          )}
        </div>

        {/* Loader */}
        <div
          className={`absolute inset-0 z-20 flex flex-col items-center justify-center bg-villa-dark transition-opacity duration-700 ${
            ready ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        >
          <p className="mb-5 font-serif text-2xl font-light tracking-wide text-white/90">
            {title}
          </p>
          <div className="h-px w-40 overflow-hidden bg-white/15">
            <div
              className="h-full bg-villa-gold transition-[width] duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-[0.7rem] uppercase tracking-[0.35em] text-white/50">
            Loading {progress}%
          </p>
        </div>
      </div>
    </section>
  )
}
