import type { Metadata } from 'next'
import './globals.css'
import { CurrencyProvider } from '@/components/CurrencyProvider'
import ChatWidget from '@/components/ChatWidget'

export const metadata: Metadata = {
  title: 'Luxury Private Pool Villas in Bali | Your Bali Getaway',
  description:
    'Book one of five private pool villas in Bali direct with the host. No platform fees, best rates, and instant WhatsApp confirmation for your luxury Bali stay.',
  openGraph: {
    title: 'Luxury Private Pool Villas in Bali | Your Bali Getaway',
    description:
      'Five private pool villas in Bali, booked direct with the host. No fees, best rates, instant confirmation.',
    images: ['/images/bali-sol/Exterior/Exterior_01.jpeg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <CurrencyProvider>{children}</CurrencyProvider>
        <ChatWidget />
      </body>
    </html>
  )
}
