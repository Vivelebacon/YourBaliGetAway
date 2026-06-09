'use client'

import dynamic from 'next/dynamic'
import type { VillaListItem } from '@/lib/content'

const HomeClient = dynamic(() => import('./HomeClient'), { ssr: false })

export type VillaCard = VillaListItem & { fromPrice: number | null }

export default function HomeWrapper({ villas }: { villas: VillaCard[] }) {
  return <HomeClient villas={villas} />
}
