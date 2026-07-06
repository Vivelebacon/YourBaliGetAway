import { createClient } from '@/lib/supabase/server'
import CopyEmailsButton from '@/components/admin/CopyEmailsButton'

export const dynamic = 'force-dynamic'

export default async function AdminNewsletter() {
  // Admin session: RLS "read own profile or admin" exposes all member rows.
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('email,display_name,newsletter_opt_in,created_at')
    .eq('role', 'member')
    .order('created_at', { ascending: false })

  const members = data ?? []
  const subscribers = members.filter((m) => m.newsletter_opt_in && m.email)
  const emails = subscribers.map((s) => s.email as string)

  return (
    <div>
      <h1 className="font-serif text-3xl text-villa-dark mb-2">Newsletter</h1>
      <p className="text-stone-500 mb-8">
        Members who ticked the newsletter box at signup. Copy the list into BCC for the monthly Bali tips email.
      </p>

      <div className="mb-8 flex flex-wrap items-center gap-6 rounded-2xl bg-white p-6 shadow-sm">
        <div>
          <p className="font-serif text-4xl text-villa-dark">{subscribers.length}</p>
          <p className="text-sm text-stone-500">subscribers</p>
        </div>
        <div>
          <p className="font-serif text-4xl text-villa-dark">{members.length}</p>
          <p className="text-sm text-stone-500">total members</p>
        </div>
        <div className="ml-auto">
          <CopyEmailsButton emails={emails} />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Newsletter</th>
              <th className="px-5 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.email as string} className="border-b border-stone-100 last:border-0">
                <td className="px-5 py-3 text-stone-700">{(m.display_name as string) || '·'}</td>
                <td className="px-5 py-3 text-stone-700">{m.email as string}</td>
                <td className="px-5 py-3">
                  {m.newsletter_opt_in ? (
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">Yes</span>
                  ) : (
                    <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-500">No</span>
                  )}
                </td>
                <td className="px-5 py-3 text-stone-500">{new Date(m.created_at as string).toLocaleDateString()}</td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-stone-400">
                  No members yet. They will appear here as guests create accounts on /takeaways.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
