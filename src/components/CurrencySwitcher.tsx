'use client'

import { useCurrency } from './CurrencyProvider'

export default function CurrencySwitcher({ light = false }: { light?: boolean }) {
  const { currency, setCurrency, currencies } = useCurrency()
  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value as typeof currency)}
      aria-label="Display currency"
      className={`text-sm rounded-full px-3 py-1 cursor-pointer border bg-transparent outline-none ${
        light
          ? 'text-white border-white/40 [text-shadow:_0_1px_8px_rgba(0,0,0,0.6)]'
          : 'text-villa-dark border-stone-300'
      }`}
    >
      {currencies.map((c) => (
        <option key={c} value={c} className="text-villa-dark">
          {c}
        </option>
      ))}
    </select>
  )
}
