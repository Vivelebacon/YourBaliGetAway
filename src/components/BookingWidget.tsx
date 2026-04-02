'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'

const SMOOBU_ALL_ID = '1690897'
const SCRIPT_SRC = 'https://login.smoobu.com/js/Settings/BookingToolIframe.js'

interface BookingWidgetProps {
  widgetId?: string
}

function initWidget(id: string) {
  // @ts-expect-error: BookingToolIframe injected by Smoobu script
  if (typeof window !== 'undefined' && window.BookingToolIframe) {
    // @ts-expect-error
    window.BookingToolIframe.initialize({
      url: `https://login.smoobu.com/en/booking-tool/iframe/${id}?locale=en_US`,
      baseUrl: 'https://login.smoobu.com',
      target: `#apartmentIframe-${id}`,
    })
  }
}

export default function BookingWidget({ widgetId }: BookingWidgetProps = {}) {
  const id = widgetId ?? SMOOBU_ALL_ID
  const initialized = useRef(false)

  // Re-initialize on mount (handles client-side navigation where script is already loaded)
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // Small delay to let the container render
    const t = setTimeout(() => initWidget(id), 100)
    return () => clearTimeout(t)
  }, [id])

  return (
    <div className="smoobu-widget-wrapper w-full min-h-[600px]">
      <div id={`apartmentIframe-${id}`} />
      <Script
        src={SCRIPT_SRC}
        strategy="afterInteractive"
        onLoad={() => initWidget(id)}
      />
    </div>
  )
}
