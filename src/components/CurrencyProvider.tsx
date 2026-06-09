'use client'

// Display-only currency conversion. All real prices stay in EUR (Hostaway side
// is never touched). This just lets a visitor view converted prices on the site.
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

// Currencies offered in the switcher (relevant to a Bali villa audience).
const SUPPORTED = ['EUR', 'USD', 'AUD', 'GBP', 'SGD', 'IDR', 'CAD'] as const
type Code = (typeof SUPPORTED)[number]

const STORAGE_KEY = 'ybg_currency'

interface CurrencyCtx {
  currency: Code
  setCurrency: (c: Code) => void
  currencies: readonly Code[]
  /** Format an amount given in EUR into the selected currency. */
  format: (amountEur: number, opts?: { compact?: boolean }) => string
}

const Ctx = createContext<CurrencyCtx | null>(null)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Code>('EUR')
  const [rates, setRates] = useState<Record<string, number>>({ EUR: 1 })

  // Restore saved choice.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && (SUPPORTED as readonly string[]).includes(saved)) {
      setCurrencyState(saved as Code)
    }
  }, [])

  // Fetch live EUR-based rates once (no key needed). Falls back to EUR only.
  useEffect(() => {
    let cancelled = false
    fetch('https://open.er-api.com/v6/latest/EUR')
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d?.rates) setRates({ EUR: 1, ...d.rates })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  function setCurrency(c: Code) {
    setCurrencyState(c)
    try {
      localStorage.setItem(STORAGE_KEY, c)
    } catch {}
  }

  const value = useMemo<CurrencyCtx>(() => {
    return {
      currency,
      setCurrency,
      currencies: SUPPORTED,
      format(amountEur: number, opts) {
        const rate = rates[currency] ?? 1
        const converted = amountEur * rate
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency,
          maximumFractionDigits: 0,
          notation: opts?.compact ? 'compact' : 'standard',
        }).format(converted)
      },
    }
  }, [currency, rates])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCurrency(): CurrencyCtx {
  const ctx = useContext(Ctx)
  if (!ctx) {
    // Fallback so components never crash if used outside the provider.
    return {
      currency: 'EUR',
      setCurrency: () => {},
      currencies: SUPPORTED,
      format: (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n),
    }
  }
  return ctx
}
