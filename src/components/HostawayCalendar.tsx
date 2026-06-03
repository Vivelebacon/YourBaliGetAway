'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'

// Hostaway calendar widget (per villa page). Shows real-time availability for
// one listing and lets the guest send a request.
const CALENDAR_SRC = 'https://d2q3n06xhbi0am.cloudfront.net/calendar.js'

// baseUrl = the Hostaway booking website the widget redirects to.
// Set NEXT_PUBLIC_HOSTAWAY_BASE_URL to Joel's Hostaway booking site URL.
const BASE_URL =
  process.env.NEXT_PUBLIC_HOSTAWAY_BASE_URL || 'https://197676_1.holidayfuture.com/'

declare global {
  interface Window {
    hostawayCalendarWidget?: (opts: Record<string, unknown>) => void
  }
}

interface HostawayCalendarProps {
  listingId: number
}

function initCalendar(listingId: number) {
  if (typeof window === 'undefined' || !window.hostawayCalendarWidget) return
  window.hostawayCalendarWidget({
    baseUrl: BASE_URL,
    listingId,
    numberOfMonths: 2,
    openInNewTab: false,
    font: 'Inter',
    rounded: true,
    // 'inquiry' = guest sends a request, host approves before dates are blocked.
    // (No instant booking — matches Joel's request-to-book setup.)
    button: { action: 'inquiry', text: 'Request to Book' },
    clearButtonText: 'Clear dates',
    color: {
      mainColor: '#3D5A3E', // villa green
      frameColor: '#C9A84C', // villa gold
      textColor: '#1A1A1A', // villa dark
    },
  })
}

export default function HostawayCalendar({ listingId }: HostawayCalendarProps) {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    const t = setTimeout(() => initCalendar(listingId), 100)
    return () => clearTimeout(t)
  }, [listingId])

  return (
    <div className="w-full">
      <div id="hostaway-calendar-widget" />
      <Script
        src={CALENDAR_SRC}
        strategy="afterInteractive"
        onLoad={() => initCalendar(listingId)}
      />
    </div>
  )
}
