import { createClient } from '@/lib/supabase/server'
import ModerationList, { type ModRec } from '@/components/admin/ModerationList'

export const dynamic = 'force-dynamic'

export default async function AdminCommunity() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('takeaway_recs')
    .select('id,author_name,category,title,body,place_name,area,status,likes_count,created_at')
    .order('created_at', { ascending: false })
    .limit(200)

  return (
    <div>
      <h1 className="font-serif text-3xl text-villa-dark mb-2">Community recommendations</h1>
      <p className="text-stone-500 mb-8">
        Guest posts go live immediately. Remove anything off-brand or spammy here; deleting also removes its likes and comments.
      </p>
      <ModerationList initial={(data ?? []) as ModRec[]} />
    </div>
  )
}
