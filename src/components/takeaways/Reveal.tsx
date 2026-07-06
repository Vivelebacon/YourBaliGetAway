'use client'

// Small scroll-reveal wrapper: server-rendered children (SEO-safe) get a
// gentle GSAP rise-in when they enter the viewport.
import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'

export default function Reveal({
  children,
  className,
  delay = 0,
  y = 32,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from(ref.current, {
        autoAlpha: 0,
        y,
        duration: 0.8,
        delay,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
      })
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
