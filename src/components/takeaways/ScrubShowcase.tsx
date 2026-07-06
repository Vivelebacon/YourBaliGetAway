'use client'

// Pinned 3D scroll moment for the Takeaways page: a 64-frame walk toward the
// villa pool (from the Bali Sol tour), scrubbed by scroll on a 2x-DPR canvas.
// The frame set (~5.4MB) is lazy: it only downloads when the section is close.
import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { useLanguage } from '@/components/LanguageProvider'

const FRAME_COUNT = 64
const framePath = (i: number) => `/takeaways/seq/frame_${String(i).padStart(3, '0')}.webp`

export default function ScrubShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const frameRef = useRef({ i: 0 })
  const [shouldLoad, setShouldLoad] = useState(false)
  const [ready, setReady] = useState(false)
  const [reduced, setReduced] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    setReduced(prefersReducedMotion())
  }, [])

  // Start downloading frames only when the section approaches the viewport.
  useEffect(() => {
    const el = sectionRef.current
    if (!el || shouldLoad) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setShouldLoad(true)
      },
      { rootMargin: '150% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [shouldLoad])

  useEffect(() => {
    if (!shouldLoad) return
    let cancelled = false
    let count = 0
    const imgs: HTMLImageElement[] = new Array(FRAME_COUNT)
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image()
      img.decoding = 'async'
      const onOne = () => {
        if (cancelled) return
        count += 1
        if (count >= FRAME_COUNT) setReady(true)
      }
      img.onload = onOne
      img.onerror = onOne
      img.src = framePath(i)
      imgs[i - 1] = img
    }
    imagesRef.current = imgs
    return () => {
      cancelled = true
    }
  }, [shouldLoad])

  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    // Real device density capped at 2x: a 1x canvas looks blurry on retina.
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.floor(window.innerWidth * dpr)
    canvas.height = Math.floor(window.innerHeight * dpr)
  }, [])

  const drawFrame = useCallback((target: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    let idx = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(target)))
    let img = imagesRef.current[idx]
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let j = idx; j >= 0; j--) {
        const c = imagesRef.current[j]
        if (c && c.complete && c.naturalWidth) {
          idx = j
          img = c
          break
        }
      }
    }
    if (!img || !img.complete || img.naturalWidth === 0) return
    const cw = canvas.width
    const ch = canvas.height
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
    const dw = img.naturalWidth * scale
    const dh = img.naturalHeight * scale
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
  }, [])

  useGSAP(
    () => {
      if (reduced || !ready) return

      sizeCanvas()
      drawFrame(0)
      const render = () => drawFrame(frameRef.current.i)

      gsap.to(frameRef.current, {
        i: FRAME_COUNT - 1,
        ease: 'none',
        onUpdate: render,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          pin: pinRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // The message lands as the camera reaches the pool.
      gsap.fromTo(
        '.tk-scrub-copy',
        { autoAlpha: 0, y: 36 },
        {
          autoAlpha: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: '55% bottom',
            end: '85% bottom',
            scrub: true,
          },
        },
      )

      const onResize = () => {
        sizeCanvas()
        render()
        ScrollTrigger.refresh()
      }
      window.addEventListener('resize', onResize)
      ScrollTrigger.refresh()
      return () => window.removeEventListener('resize', onResize)
    },
    { scope: sectionRef, dependencies: [ready, reduced] },
  )

  // Reduced motion or frames still loading: a static, elegant still.
  const showCanvas = ready && !reduced

  return (
    <section ref={sectionRef} className="relative w-full bg-villa-dark" style={{ height: reduced ? '100vh' : '280vh' }}>
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={framePath(reduced ? FRAME_COUNT : 1)}
          alt="Walking toward the private pool at a Your Bali Getaway villa"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${showCanvas ? 'opacity-0' : 'opacity-100'}`}
        />
        <canvas ref={canvasRef} className={`absolute inset-0 block h-full w-full ${showCanvas ? '' : 'opacity-0'}`} />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-villa-cream via-transparent to-black/50" />

        <div className="tk-scrub-copy absolute inset-x-0 bottom-0 z-10 px-6 pb-16 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-villa-gold [text-shadow:_0_1px_8px_rgba(0,0,0,0.6)]">
            Your Bali Getaway
          </p>
          <h2 className="font-serif text-4xl font-light text-white [text-shadow:_0_2px_14px_rgba(0,0,0,0.5)] md:text-6xl">
            {t('Step inside the villas')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-serif text-lg italic text-white/90 [text-shadow:_0_1px_10px_rgba(0,0,0,0.55)]">
            {t('Every takeaway on this page is minutes from your private pool.')}
          </p>
          <Link
            href="/#villas"
            className="mt-7 inline-block rounded-full bg-villa-green px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-villa-green-light"
          >
            {t('See the villas')}
          </Link>
        </div>
      </div>
    </section>
  )
}
