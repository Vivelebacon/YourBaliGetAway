import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Member signup for the Takeaways community. Creates the account already
// confirmed (service role) so there is no email-confirmation step and no
// dependency on an SMTP provider: guests can sign up and are immediately
// members. The handle_new_user trigger creates their profile (role=member,
// display_name, newsletter opt-in) from the metadata below.
const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body.password === 'string' ? body.password : ''
  const displayName = typeof body.displayName === 'string' ? body.displayName.trim().slice(0, 40) : ''
  const newsletter = !!body.newsletter

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
  }

  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: displayName || email.split('@')[0], newsletter_opt_in: newsletter },
  })

  if (error) {
    const already = /already|registered|exists/i.test(error.message)
    return NextResponse.json(
      { error: already ? 'This email is already registered. Please sign in instead.' : error.message },
      { status: already ? 409 : 400 },
    )
  }

  return NextResponse.json({ ok: true })
}
