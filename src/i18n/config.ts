// Shared i18n config. Client-safe: no server-only imports here.
// EN is the base language the whole site is authored in; everything else is
// produced by the AI translation layer (src/lib/translate.ts).

export const LOCALES = ['en', 'nl', 'fr', 'de', 'es', 'id', 'zh', 'ja', 'ko'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALE_COOKIE = 'locale'

// Native label shown in the switcher.
export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  nl: 'Nederlands',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  id: 'Bahasa Indonesia',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
}

// Full English language name, used when instructing the translation model.
export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  nl: 'Dutch',
  fr: 'French',
  de: 'German',
  es: 'Spanish',
  id: 'Indonesian',
  zh: 'Simplified Chinese',
  ja: 'Japanese',
  ko: 'Korean',
}

export function isLocale(v: string | undefined | null): v is Locale {
  return !!v && (LOCALES as readonly string[]).includes(v)
}
