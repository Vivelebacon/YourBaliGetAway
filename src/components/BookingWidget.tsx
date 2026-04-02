'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'

const SMOOBU_GROUP_ID = '1690897'
const SCRIPT_SRC = 'https://login.smoobu.com/js/Settings/BookingToolIframe.js'

interface BookingWidgetProps {
  // Per-villa apartment ID (e.g. "3241317"). Omit for the all-villas homepage widget.
  widgetId?: string
}

function buildWidgetUrl(villaId?: string) {
  if (villaId) {
    return `https://login.smoobu.com/en/booking-tool/iframe/${SMOOBU_GROUP_ID}/${villaId}`
  }
  return `https://login.smoobu.com/en/booking-tool/iframe/${SMOOBU_GROUP_ID}`
}

function buildContainerId(villaId?: string) {
  return villaId ? `apartmentIframe${villaId}` : `apartmentIframe${SMOOBU_GROUP_ID}`
}

function initWidget(villaId?: string) {
  if (typeof window === 'undefined') return
  // @ts-expect-error: BookingToolIframe injected by Smoobu script
  if (!window.BookingToolIframe) return
  const containerId = buildContainerId(villaId)
  // @ts-expect-error
  window.BookingToolIframe.initialize({
    url: buildWidgetUrl(villaId),
    baseUrl: 'https://login.smoobu.com',
    target: `#${containerId}`,
  })
}

export default function BookingWidget({ widgetId }: BookingWidgetProps = {}) {
  const containerId = buildContainerId(widgetId)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    const t = setTimeout(() => initWidget(widgetId), 100)
    return () => clearTimeout(t)
  }, [widgetId])

  return (
    <div className="smoobu-widget-wrapper w-full min-h-[600px]">
      <div id={containerId} />
      <Script
        src={SCRIPT_SRC}
        strategy="afterInteractive"
        onLoad={() => initWidget(widgetId)}
      />
    </div>
  )
}
