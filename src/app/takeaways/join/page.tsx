import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import JoinClient from './JoinClient'

export const metadata: Metadata = {
  title: 'Join Our Bali Takeaways | Your Bali Getaway',
  robots: { index: false },
}

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-villa-cream">
      <Navbar />
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-28">
        {/* Soft branded backdrop */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(61,90,62,0.10),_transparent_55%)]" />
        <div className="pointer-events-none absolute -bottom-32 left-1/2 h-72 w-[720px] -translate-x-1/2 rounded-full bg-villa-gold/10 blur-3xl" />
        <JoinClient />
      </div>
      <Footer />
    </div>
  )
}
