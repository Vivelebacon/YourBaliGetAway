'use client'

import { useState, useEffect, useCallback } from 'react'
import { villas } from '@/lib/villas'

// Flatten all reviews across all villas, tag with villa name
const ALL_REVIEWS = villas.flatMap((v) =>
  v.reviews.map((r) => ({ ...r, villaName: v.name, villaSlug: v.slug, rating: v.rating }))
)

export default function ReviewCarousel() {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const go = useCallback((index: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrent(index)
      setIsAnimating(false)
    }, 200)
  }, [isAnimating])

  const prev = () => go((current - 1 + ALL_REVIEWS.length) % ALL_REVIEWS.length)
  const next = useCallback(() => go((current + 1) % ALL_REVIEWS.length), [current, go])

  // Auto-advance
  useEffect(() => {
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [next])

  const review = ALL_REVIEWS[current]

  // Visible cards: center + 2 sides on desktop
  const getVisible = () => {
    const indices = []
    for (let i = -2; i <= 2; i++) {
      indices.push((current + i + ALL_REVIEWS.length) % ALL_REVIEWS.length)
    }
    return indices
  }

  return (
    <div className="relative">
      {/* Main featured review */}
      <div
        className={`transition-opacity duration-200 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
      >
        <div className="max-w-3xl mx-auto text-center px-12">
          {/* Stars */}
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-villa-gold" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          {/* Quote */}
          <blockquote className="font-serif text-xl md:text-2xl text-villa-dark font-light leading-relaxed mb-8">
            &ldquo;{review.text}&rdquo;
          </blockquote>

          {/* Reviewer */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-villa-green flex items-center justify-center text-white font-medium">
              {review.name[0]}
            </div>
            <div className="text-left">
              <p className="font-medium text-villa-dark text-sm">{review.name}</p>
              <p className="text-villa-muted text-xs">{review.villaName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-villa-muted hover:text-villa-dark transition-colors"
        aria-label="Previous review"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-villa-muted hover:text-villa-dark transition-colors"
        aria-label="Next review"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-10">
        {getVisible().map((idx, i) => (
          <button
            key={i}
            onClick={() => go(idx)}
            className={`rounded-full transition-all duration-300 ${
              idx === current
                ? 'w-6 h-2 bg-villa-green'
                : 'w-2 h-2 bg-stone-300 hover:bg-stone-400'
            }`}
            aria-label={`Review ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
