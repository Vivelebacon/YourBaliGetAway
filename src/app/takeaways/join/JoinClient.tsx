'use client'

// Sign in / create account for the Takeaways community.
// Signup metadata (display_name, newsletter_opt_in) is picked up by the
// handle_new_user trigger, which creates the member profile row.
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/components/LanguageProvider'

export default function JoinClient() {
  return (
    <Suspense fallback={null}>
      <JoinForm />
    </Suspense>
  )
}

function JoinForm() {
  const supabase = createClient()
  const router = useRouter()
  const params = useSearchParams()
  const { t } = useLanguage()

  const [mode, setMode] = useState<'signup' | 'signin'>(params.get('mode') === 'signin' ? 'signin' : 'signup')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newsletter, setNewsletter] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmSent, setConfirmSent] = useState(false)

  const next = params.get('next') || '/takeaways/community'

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError(null)

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { display_name: name.trim() || email.split('@')[0], newsletter_opt_in: newsletter },
          emailRedirectTo: `${window.location.origin}${next}`,
        },
      })
      setBusy(false)
      if (error) {
        setError(error.message)
        return
      }
      // Depending on the project's auth settings, signup may require email
      // confirmation (no session yet) or sign the user straight in.
      if (data.session) {
        router.push(next)
        router.refresh()
      } else {
        setConfirmSent(true)
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      setBusy(false)
      if (error) {
        setError(error.message)
        return
      }
      router.push(next)
      router.refresh()
    }
  }

  return (
    <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-[0_24px_60px_-24px_rgba(26,26,26,0.25)] ring-1 ring-stone-100 md:p-10">
      <p className="text-xs uppercase tracking-[0.35em] text-villa-gold">Our Bali Takeaways</p>
      <h1 className="mt-2 font-serif text-3xl font-light text-villa-dark">
        {mode === 'signup' ? t('Join Our Bali Takeaways') : t('Welcome back')}
      </h1>
      <p className="mt-2 text-sm text-villa-muted">
        {t('One account for recommendations, likes and insider picks.')}
      </p>

      {confirmSent ? (
        <div className="mt-8 rounded-2xl bg-villa-green/10 p-5 text-sm leading-relaxed text-villa-green">
          {t('Check your inbox to confirm your email, then sign in.')}
        </div>
      ) : (
        <form onSubmit={submit} className="mt-7 space-y-4">
          {mode === 'signup' && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('Your name')}
              maxLength={40}
              className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-villa-green"
            />
          )}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('Email')}
            className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-villa-green"
          />
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === 'signup' ? t('At least 8 characters') : t('Password')}
            className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-villa-green"
          />

          {mode === 'signup' && (
            <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-stone-50 p-4 text-sm text-stone-600">
              <input
                type="checkbox"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[#3d5a3e]"
              />
              <span>{t('Send me Bali tips and villa offers (about once a month, no spam)')}</span>
            </label>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-villa-green py-3 text-sm font-medium text-white transition-colors hover:bg-villa-green-light disabled:opacity-60"
          >
            {mode === 'signup' ? (busy ? t('Creating…') : t('Create account')) : busy ? t('Signing in…') : t('Sign in')}
          </button>
        </form>
      )}

      {!confirmSent && (
        <button
          onClick={() => {
            setMode(mode === 'signup' ? 'signin' : 'signup')
            setError(null)
          }}
          className="mt-5 w-full text-center text-sm font-medium text-villa-green hover:underline"
        >
          {mode === 'signup' ? t('Already a member? Sign in') : t('New here? Create a free account')}
        </button>
      )}
    </div>
  )
}
