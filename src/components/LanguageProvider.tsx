'use client'

// Guest-facing language layer. The active locale is decided server-side from the
// `locale` cookie; the server passes the already-translated UI message map down,
// so t() is synchronous and there is no translation flash. Switching language
// writes the cookie and reloads, so the server re-renders everything (UI + CMS
// content) in the new language.
import { createContext, useCallback, useContext } from 'react'
import { DEFAULT_LOCALE, LOCALE_COOKIE, type Locale } from '@/i18n/config'

interface LanguageCtx {
  locale: Locale
  t: (s: string) => string
  setLocale: (l: Locale) => void
}

const Ctx = createContext<LanguageCtx | null>(null)

export function LanguageProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale
  messages: Record<string, string>
  children: React.ReactNode
}) {
  const t = useCallback((s: string) => messages[s] ?? s, [messages])

  const setLocale = useCallback((l: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`
    try {
      localStorage.setItem(LOCALE_COOKIE, l)
    } catch {}
    window.location.reload()
  }, [])

  return <Ctx.Provider value={{ locale, t, setLocale }}>{children}</Ctx.Provider>
}

export function useLanguage(): LanguageCtx {
  const ctx = useContext(Ctx)
  if (!ctx) return { locale: DEFAULT_LOCALE, t: (s) => s, setLocale: () => {} }
  return ctx
}
