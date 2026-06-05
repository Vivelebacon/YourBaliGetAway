import Link from 'next/link'
import Image from 'next/image'
import { getVillasList } from '@/lib/content'

export const dynamic = 'force-dynamic'

export default async function AdminHome() {
  const villas = await getVillasList()

  return (
    <div>
      <h1 className="font-serif text-3xl text-villa-dark mb-2">Your villas</h1>
      <p className="text-stone-500 mb-8">Choose a villa to edit its content, photos and reviews.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {villas.map((v) => (
          <Link
            key={v.slug}
            href={`/admin/villas/${v.slug}`}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <div className="relative h-40">
              {v.coverUrl && (
                <Image src={v.coverUrl} alt={v.name} fill className="object-cover" />
              )}
            </div>
            <div className="p-5">
              <h2 className="font-serif text-xl text-villa-dark">{v.name}</h2>
              <p className="text-stone-500 text-sm">{v.subtitle}</p>
              <span className="text-villa-green text-sm mt-3 inline-block group-hover:underline">
                Edit →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
