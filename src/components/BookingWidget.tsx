'use client'

import Script from 'next/script'

// Embed the Smoobu booking widget exactly as provided by Smoobu dashboard.
// Do NOT modify the URL or add query params — Smoobu controls language/currency
// from its own dashboard settings (Booking Engine > Booking System Settings).

export default function BookingWidget() {
  return (
    <div className="smoobu-widget-wrapper w-full min-h-[600px]">
      <div id="apartmentIframeAll" />
      <Script
        src="https://login.smoobu.com/js/Settings/BookingToolIframe.js"
        strategy="afterInteractive"
        onLoad={() => {
          // @ts-expect-error: BookingToolIframe injected by Smoobu script
          window.BookingToolIframe.initialize({
            url: 'https://login.smoobu.com/en/booking-tool/iframe/1690897',
            baseUrl: 'https://login.smoobu.com',
            target: '#apartmentIframeAll',
          })
        }}
      />
    </div>
  )
}
