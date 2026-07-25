import type { Metadata } from 'next'
import HomeWrapper from './HomeWrapper'
import { getVillasList } from '@/lib/content'
import { getHostawayListingId } from '@/lib/villas'
import { getMinNightlyPrice } from '@/lib/hostaway'
import { getLocale } from '@/lib/locale'
import { SITE_URL } from '@/lib/site'

// Title, description and Open Graph are inherited from the root layout.
// Only the self-referencing canonical is page-specific.
export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
}

export default async function Page() {
  const locale = await getLocale()
  const villas = await getVillasList(locale)
  // Attach each villa's lowest available nightly price (EUR) for "from X/night".
  const withPrices = await Promise.all(
    villas.map(async (v) => {
      const listingId = getHostawayListingId(v.slug)
      const fromPrice = listingId ? await getMinNightlyPrice(listingId) : null
      return { ...v, fromPrice }
    }),
  )
  return (
    <>
      {/*
        Server-rendered H1 for crawlers and AI engines. The homepage body is a
        client-only component (dynamic import, ssr:false) whose hero renders the
        brand as styled H2s, so the server HTML otherwise has no H1. This is
        visually hidden (sr-only): screen-reader accessible, zero visual change.
      */}
      <h1 className="sr-only">
        Your Bali Getaway: Luxury Private Pool Villas in Seminyak, Bali
      </h1>
      <HomeWrapper villas={withPrices} />
    </>
  )
}
