import type { Metadata } from 'next'
import './globals.css'
import { CurrencyProvider } from '@/components/CurrencyProvider'
import { LanguageProvider } from '@/components/LanguageProvider'
import ChatWidget from '@/components/ChatWidget'
import { getLocale } from '@/lib/locale'
import { getMessages } from '@/lib/translate'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages(locale)
  return (
    <html lang={locale}>
      <body suppressHydrationWarning>
        <LanguageProvider locale={locale} messages={messages}>
          <CurrencyProvider>{children}</CurrencyProvider>
          <ChatWidget />
        </LanguageProvider>
      </body>
    </html>
  )
}
