import HomeWrapper from './HomeWrapper'
import { getVillasList } from '@/lib/content'

export const revalidate = 60

export default async function Page() {
  const villas = await getVillasList()
  return <HomeWrapper villas={villas} />
}
