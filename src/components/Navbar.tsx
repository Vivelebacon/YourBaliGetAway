'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/logo_transparent.png"
            alt="YBG Villas"
            width={140}
            height={70}
            className="object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#villas" className="text-sm text-white/90 hover:text-white transition-colors">
            Our Villas
          </Link>
          <Link href="/#book" className="text-sm text-white/90 hover:text-white transition-colors">
            Book
          </Link>
          <Link href="/#contact" className="text-sm text-white/90 hover:text-white transition-colors">
            Contact
          </Link>
          <a
            href="https://wa.me/6282221762980"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-villa-green text-white text-sm px-5 py-2 rounded-full hover:bg-villa-green-light transition-colors"
          >
            WhatsApp Us
          </a>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-white transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-stone-200 px-6 py-4 flex flex-col gap-4">
          <Link href="/#villas" onClick={() => setOpen(false)} className="text-villa-dark hover:text-villa-green">Our Villas</Link>
          <Link href="/#book" onClick={() => setOpen(false)} className="text-villa-dark hover:text-villa-green">Book</Link>
          <Link href="/#contact" onClick={() => setOpen(false)} className="text-villa-dark hover:text-villa-green">Contact</Link>
          <a
            href="https://wa.me/6282221762980"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-villa-green text-white text-center px-5 py-2 rounded-full"
          >
            WhatsApp Us
          </a>
        </div>
      )}
    </nav>
  )
}
