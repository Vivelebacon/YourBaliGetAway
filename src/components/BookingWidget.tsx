'use client'

import Script from 'next/script'

// Embed the Smoobu booking widget exactly as provided by Smoobu dashboard.
// Do NOT modify the URL or add query params — Smoobu controls language/currency
// from its own dashboard settings (Booking Engine > Booking System Settings).

const SMOOBU_ALL_ID = '1690897'

interface BookingWidgetProps {
  widgetId?: string
}

export default function BookingWidget({ widgetId }: BookingWidgetProps = {}) {
  const id = widgetId ?? SMOOBU_ALL_ID
  const containerId = `apartmentIframe-${id}`

  return (
    <div className="smoobu-widget-wrapper w-full min-h-[600px]">
      <div id={containerId} />
      <Script
        src="https://login.smoobu.com/js/Settings/BookingToolIframe.js"
        strategy="afterInteractive"
        onLoad={() => {
          // @ts-expect-error: BookingToolIframe injected by Smoobu script
          window.BookingToolIframe.initialize({
            url: `https://login.smoobu.com/en/booking-tool/iframe/${id}?locale=en_US`,
            baseUrl: 'https://login.smoobu.com',
            target: `#${containerId}`,
          })
        }}
      />
    </div>
  )
}
