import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

// Called by the admin after a content change to push it live within seconds.
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const slug = typeof body.slug === 'string' ? body.slug : undefined

  revalidatePath('/')
  if (slug) revalidatePath(`/villas/${slug}`)

  return NextResponse.json({ ok: true })
}
