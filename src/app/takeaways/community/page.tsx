import type { Metadata } from 'next'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import RecFeed from '@/components/takeaways/RecFeed'
import { getApprovedRecs } from '@/lib/takeaways'
import { getLocale } from '@/lib/locale'
import { getMessages } from '@/lib/translate'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'The Community Wall | Our Bali Takeaways',
  description:
    'Real Bali tips from guests, for guests: restaurants, massages, beaches and hidden gems recommended by travellers who stayed at Your Bali Getaway.',
  alternates: { canonical: `${SITE_URL}/takeaways/community` },
}

export default async function CommunityPage() {
  const locale = await getLocale()
  const [recs, messages] = await Promise.all([getApprovedRecs(10), getMessages(locale)])
  const t = (s: string) => messages[s] ?? s

  return (
    <div className="min-h-screen bg-villa-cream">
      <Navbar />

      {/* ── Header ── */}
      <section className="relative h-[46vh] min-h-[360px]">
        <Image
          src="/takeaways/hero-poster.jpg"
          alt="The Your Bali Getaway community wall"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-villa-cream" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pt-16 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-villa-gold [text-shadow:_0_1px_8px_rgba(0,0,0,0.6)]">
            {t('From the community')}
          </p>
          <h1 className="font-serif text-4xl font-light text-white [text-shadow:_0_2px_16px_rgba(0,0,0,0.5)] md:text-6xl">
            {t('The community wall')}
          </h1>
          <p className="mt-4 max-w-xl font-serif text-lg italic text-white/90 [text-shadow:_0_1px_10px_rgba(0,0,0,0.55)]">
            {t('Tips from guests, for guests. Add yours after your stay.')}
          </p>
        </div>
      </section>

      {/* ── Feed ── */}
      <section data-nav-light-bg className="px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <RecFeed initialRecs={recs} showComposer pageSize={10} />
        </div>
      </section>

      <Footer />
    </div>
  )
}
