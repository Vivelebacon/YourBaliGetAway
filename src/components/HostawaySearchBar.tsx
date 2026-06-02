'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'

// Hostaway search-bar widget (homepage). Lets guests pick a location + dates,
// then redirects to the Hostaway booking site to see matching villas.
const WIDGET_SRC = 'https://d2q3n06xhbi0am.cloudfront.net/widget.js?1640277196'

// baseUrl = the Hostaway booking website the widget redirects to.
// Set NEXT_PUBLIC_HOSTAWAY_BASE_URL to Joel's Hostaway booking site URL.
const BASE_URL =
  process.env.NEXT_PUBLIC_HOSTAWAY_BASE_URL || 'https://www.yourbaligetaway.com/'

declare global {
  interface Window {
    searchBar?: (opts: Record<string, unknown>) => void
  }
}

function initSearchBar() {
  if (typeof window === 'undefined' || !window.searchBar) return
  window.searchBar({
    baseUrl: BASE_URL,
    showLocation: true,
    color: '#3D5A3E', // villa green
    rounded: true,
    openInNewTab: false,
    font: 'Inter',
  })
}

export default function HostawaySearchBar() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    const t = setTimeout(initSearchBar, 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="w-full">
      <div id="hostaway-booking-widget" />
      <Script src={WIDGET_SRC} strategy="afterInteractive" onLoad={initSearchBar} />
    </div>
  )
}
