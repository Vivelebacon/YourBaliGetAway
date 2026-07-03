'use client'

import { useLanguage } from './LanguageProvider'
import { LOCALES, LOCALE_LABELS, type Locale } from '@/i18n/config'

export default function LanguageSwitcher({ light = false }: { light?: boolean }) {
  const { locale, setLocale } = useLanguage()
  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
      aria-label="Language"
      className={`text-sm rounded-full px-3 py-1 cursor-pointer border bg-transparent outline-none ${
        light
          ? 'text-white border-white/40 [text-shadow:_0_1px_8px_rgba(0,0,0,0.6)]'
          : 'text-villa-dark border-stone-300'
      }`}
    >
      {LOCALES.map((l) => (
        <option key={l} value={l} className="text-villa-dark">
          {LOCALE_LABELS[l]}
        </option>
      ))}
    </select>
  )
}
