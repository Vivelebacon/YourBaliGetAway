'use client'

import Script from 'next/script'
import { SMOOBU_ALL_ID } from '@/lib/villas'

interface BookingWidgetProps {
  widgetId?: string
}

export default function BookingWidget({ widgetId }: BookingWidgetProps) {
  const id = widgetId ?? SMOOBU_ALL_ID
  const containerId = `apartmentIframe-${id}`

  return (
    <div className="smoobu-widget-wrapper w-full min-h-[600px]">
      <div id={containerId} />
      <Script
        src="https://login.smoobu.com/js/Settings/BookingToolIframe.js"
        strategy="afterInteractive"
        onLoad={() => {
          // @ts-expect-error: injected by Smoobu script
          window.BookingToolIframe?.initialize({
            url: `https://login.smoobu.com/en/booking-tool/iframe/${id}?language=en&currency=USD`,
            baseUrl: 'https://login.smoobu.com',
            target: `#${containerId}`,
          })
        }}
      />
    </div>
  )
}