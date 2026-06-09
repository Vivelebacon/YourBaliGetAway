import HomeWrapper from './HomeWrapper'
import { getVillasList } from '@/lib/content'
import { getHostawayListingId } from '@/lib/villas'
import { getMinNightlyPrice } from '@/lib/hostaway'

export const revalidate = 60

export default async function Page() {
  const villas = await getVillasList()
  // Attach each villa's lowest available nightly price (EUR) for "from X/night".
  const withPrices = await Promise.all(
    villas.map(async (v) => {
      const listingId = getHostawayListingId(v.slug)
      const fromPrice = listingId ? await getMinNightlyPrice(listingId) : null
      return { ...v, fromPrice }
    }),
  )
  return <HomeWrapper villas={withPrices} />
}
