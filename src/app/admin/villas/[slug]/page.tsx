import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import VillaEditor from '@/components/admin/VillaEditor'

export const dynamic = 'force-dynamic'

export default async function EditVillaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: villa } = await supabase.from('villas').select('*').eq('slug', slug).single()
  if (!villa) notFound()

  const { data: images } = await supabase
    .from('villa_images')
    .select('*')
    .eq('villa_id', villa.id)
    .order('sort_order', { ascending: true })

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('villa_id', villa.id)
    .order('sort_order', { ascending: true })

  return <VillaEditor villa={villa} initialImages={images ?? []} initialReviews={reviews ?? []} />
}
