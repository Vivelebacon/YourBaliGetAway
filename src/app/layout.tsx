import type { Metadata } from 'next'
import './globals.css'
import { CurrencyProvider } from '@/components/CurrencyProvider'

export const metadata: Metadata = {
  title: 'YBG Villas — Luxury Bali Retreats',
  description:
    'Discover five exceptional private pool villas in Bali. Book your luxury escape directly — no fees, instant confirmation.',
  openGraph: {
    title: 'YBG Villas — Luxury Bali Retreats',
    description: 'Five private pool villas in Bali. Book direct.',
    images: ['/images/bali-sol/Exterior/Exterior_01.jpeg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <CurrencyProvider>{children}</CurrencyProvider>
      </body>
    </html>
  )
}
