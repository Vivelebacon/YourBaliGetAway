import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SignOutButton from '@/components/admin/SignOutButton'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Community members are authenticated too: only admins may see the CMS.
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()
    if (profile?.role !== 'admin') redirect('/takeaways')
  }

  return (
    <div className="min-h-screen bg-stone-100">
      {user && (
        <header className="bg-white border-b border-stone-200">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/admin" className="font-serif text-xl text-villa-dark">
              YBG Admin
            </Link>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/admin" className="text-stone-600 hover:text-villa-green">
                Villas
              </Link>
              <Link href="/admin/takeaways" className="text-stone-600 hover:text-villa-green">
                Takeaways
              </Link>
              <Link href="/admin/community" className="text-stone-600 hover:text-villa-green">
                Community
              </Link>
              <Link href="/admin/newsletter" className="text-stone-600 hover:text-villa-green">
                Newsletter
              </Link>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="text-stone-600 hover:text-villa-green"
              >
                View site ↗
              </a>
              <span className="text-stone-400">{user.email}</span>
              <SignOutButton />
            </div>
          </div>
        </header>
      )}
      <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
    </div>
  )
}
