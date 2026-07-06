'use client'

// Member session layer for the Takeaways community. Wraps the /takeaways tree
// and exposes the Supabase auth user (or null) plus their profile basics.
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface MemberCtx {
  user: User | null
  displayName: string
  isAdmin: boolean
  loading: boolean
  signOut: () => Promise<void>
}

const Ctx = createContext<MemberCtx>({
  user: null,
  displayName: '',
  isAdmin: false,
  loading: true,
  signOut: async () => {},
})

export function MemberProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadProfile(u: User | null) {
      if (cancelled) return
      setUser(u)
      if (!u) {
        setDisplayName('')
        setIsAdmin(false)
        setLoading(false)
        return
      }
      const { data } = await supabase
        .from('profiles')
        .select('display_name,role')
        .eq('id', u.id)
        .maybeSingle()
      if (cancelled) return
      const fallback = u.email ? u.email.split('@')[0] : 'Guest'
      setDisplayName((data?.display_name as string) || fallback)
      setIsAdmin((data?.role as string) === 'admin')
      setLoading(false)
    }

    supabase.auth.getUser().then(({ data }) => loadProfile(data.user))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      loadProfile(session?.user ?? null)
    })
    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [supabase])

  const signOut = useMemo(
    () => async () => {
      await supabase.auth.signOut()
    },
    [supabase],
  )

  return (
    <Ctx.Provider value={{ user, displayName, isAdmin, loading, signOut }}>{children}</Ctx.Provider>
  )
}

export function useMember(): MemberCtx {
  return useContext(Ctx)
}
