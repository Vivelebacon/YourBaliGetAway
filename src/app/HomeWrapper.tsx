'use client'

import dynamic from 'next/dynamic'
import type { VillaListItem } from '@/lib/content'

const HomeClient = dynamic(() => import('./HomeClient'), { ssr: false })

export default function HomeWrapper({ villas }: { villas: VillaListItem[] }) {
  return <HomeClient villas={villas} />
}
