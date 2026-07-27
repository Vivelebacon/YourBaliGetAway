import type { Metadata } from 'next'
import './globals.css'
import { CurrencyProvider } from '@/components/CurrencyProvider'
import { LanguageProvider } from '@/components/LanguageProvider'
import ChatWidget from '@/components/ChatWidget'
import { Analytics } from '@vercel/analytics/next'
import { getLocale } from '@/lib/locale'
import { getMessages } from '@/lib/translate'
import { SITE_URL, SITE_NAME } from '@/lib/site'
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Luxury Private Pool Villas in Bali | Your Bali Getaway',
  description:
    'Book one of five private pool villas in Bali direct with the host. No platform fees, best rates, and instant WhatsApp confirmation for your luxury Bali stay.',
  verification: { google: 'sR2l19y63yScbBUakk0fqnWdD4PhfmawGan6-dfo4Y0' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    url: SITE_URL,
    title: 'Luxury Private Pool Villas in Bali | Your Bali Getaway',
    description:
      'Five private pool villas in Bali, booked direct with the host. No fees, best rates, instant confirmation.',
    images: [{ url: '/og/home.jpg', width: 1200, height: 630, alt: 'Private pool villa in Seminyak, Bali' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxury Private Pool Villas in Bali | Your Bali Getaway',
    description:
      'Five private pool villas in Bali, booked direct with the host. No fees, best rates, instant confirmation.',
    images: ['/og/home.jpg'],
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages(locale)
  return (
    <html lang={locale}>
      <body suppressHydrationWarning>
        {/* Sitewide entities for search engines and AI crawlers. Renders no UI. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
        <LanguageProvider locale={locale} messages={messages}>
          <CurrencyProvider>{children}</CurrencyProvider>
          <ChatWidget />
        </LanguageProvider>
        {/* Vercel Web Analytics — cookieless, privacy-friendly (no consent banner needed). */}
        <Analytics />
      </body>
    </html>
  )
}
