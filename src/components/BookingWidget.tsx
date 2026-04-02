'use client'

import { useEffect } from 'react'
import { SMOOBU_ALL_ID } from '@/lib/villas'

declare global {
  interface Window {
    BookingToolIframe?: {
      initialize: (opts: { url: string; baseUrl: string; target: string }) => void
    }
  }
}

interface BookingWidgetProps {
  widgetId?: string
}

const SCRIPT_SRC = 'https://login.smoobu.com/js/Settings/BookingToolIframe.js'

export default function BookingWidget({ widgetId }: BookingWidgetProps) {
  const id = widgetId ?? SMOOBU_ALL_ID
  // Stable ID based on widget — keeps DOM target consistent
  const containerId = `smoobu-widget-${id}`

  useEffect(() => {
    const container = document.getElementById(containerId)
    if (!container) return

    function initialize() {
      // ?language=en&currency=USD forces English UI and USD pricing
      window.BookingToolIframe?.initialize({
        url: `https://login.smoobu.com/en/booking-tool/iframe/${id}?language=en&currency=USD`,
        baseUrl: 'https://login.smoobu.com',
        target: `#${containerId}`,
      })
    }

    // Script already loaded and ready
    if (window.BookingToolIframe) {
      initialize()
      return
    }

    // Script tag already in DOM (e.g. added by another widget) — wait for it
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`
    )
    if (existing) {
      existing.addEventListener('load', initialize, { once: true })
      return () => existing.removeEventListener('load', initialize)
    }

    // First time — inject script
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.addEventListener('load', initialize, { once: true })
    document.head.appendChild(script)
  }, [id, containerId])

  return (
    <div className="smoobu-widget-wrapper w-full min-h-[600px]">
      <div id={containerId} />
    </div>
  )
}
