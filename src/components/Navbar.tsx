'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import CurrencySwitcher from './CurrencySwitcher'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from './LanguageProvider'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [darkText, setDarkText] = useState(false)
  const pathname = usePathname()
  const isLanding = pathname === '/'
  const { t } = useLanguage()

  // Header positioning:
  //  - Non-landing pages: non-sticky. It sits over the top hero (absolute) and simply
  //    scrolls out of view with the page.
  //  - Landing page: it STAYS pinned (fixed) over the whole hero scroll animation, then
  //    once the hero is finished it releases and scrolls away — never seen again.
  const [navFixed, setNavFixed] = useState(false)
  const [navTop, setNavTop] = useState(0)

  // Adaptive text colour + landing sticky-until-hero-ends behaviour, driven by scroll.
  useEffect(() => {
    const sample = 60 // px below the top of the viewport
    // End of the pinned hero = its bottom reaching the viewport bottom.
    let heroEnd = 2.4 * window.innerHeight // fallback (scrollLengthVh 340 - 100)
    const measure = () => {
      const hero = document.getElementById('hero')
      heroEnd = hero
        ? hero.offsetTop + hero.offsetHeight - window.innerHeight
        : 2.4 * window.innerHeight
    }
    const onScroll = () => {
      // Over light-background sections (data-nav-light-bg) the text flips to dark.
      let dark = false
      document.querySelectorAll<HTMLElement>('[data-nav-light-bg]').forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top <= sample && r.bottom >= sample) dark = true
      })
      setDarkText(dark)

      if (isLanding) {
        if (window.scrollY < heroEnd) {
          setNavFixed(true) // pinned over the hero animation
        } else {
          setNavFixed(false)
          setNavTop(heroEnd) // released at the hero's end, scrolls away for good
        }
      } else {
        setNavFixed(false)
        setNavTop(0) // non-sticky: sits at the top and scrolls off
      }
    }
    measure()
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const onResize = () => {
      measure()
      onScroll()
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [pathname, isLanding])

  // On the homepage the hero locks scrolling until its animation completes.
  // Clicking a section link should release the hero and jump to the section.
  function goToSection(e: React.MouseEvent, id: string) {
    setOpen(false)
    if (pathname !== '/') return // other pages: let the Link navigate to /#id normally
    e.preventDefault()
    window.dispatchEvent(new CustomEvent('hero:expand'))
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 80)
  }

  // Home: on the homepage, reset the hero to its initial state at the very top.
  function goHome(e: React.MouseEvent) {
    setOpen(false)
    if (pathname !== '/') return
    e.preventDefault()
    window.dispatchEvent(new CustomEvent('hero:reset'))
  }

  const linkClass = darkText
    ? 'text-sm transition-colors text-villa-dark hover:text-villa-green'
    : 'text-sm transition-colors text-white hover:text-villa-gold [text-shadow:_0_1px_8px_rgba(0,0,0,0.6)]'

  return (
    <nav
      className={`${navFixed ? 'fixed' : 'absolute'} left-0 right-0 z-50 transition-colors duration-300 ${
        darkText ? 'bg-transparent' : 'bg-gradient-to-b from-black/55 via-black/25 to-transparent'
      }`}
      style={{ top: navFixed ? 0 : navTop }}
    >
      <div className="max-w-6xl mx-auto px-6 h-24 flex items-center justify-between">
        <Link href="/" onClick={goHome}>
          <Image
            src="/logo_transparent.png"
            alt="YBG Villas"
            width={168}
            height={84}
            className="object-contain w-auto h-[84px]"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" onClick={goHome} className={linkClass}>
            {t('Home')}
          </Link>
          <Link href="/#villas" onClick={(e) => goToSection(e, 'villas')} className={linkClass}>
            {t('Our Villas')}
          </Link>
          <Link href="/#book" onClick={(e) => goToSection(e, 'book')} className={linkClass}>
            {t('Book')}
          </Link>
          <Link href="/#contact" onClick={(e) => goToSection(e, 'contact')} className={linkClass}>
            {t('Contact')}
          </Link>
          <LanguageSwitcher light={!darkText} />
          <CurrencySwitcher light={!darkText} />
          <a
            href="https://wa.me/6282221762980"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-villa-green text-white text-sm px-5 py-2 rounded-full hover:bg-villa-green-light transition-colors"
          >
            {t('WhatsApp Us')}
          </a>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 transition-all ${darkText ? 'bg-villa-dark' : 'bg-white'} ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 transition-all ${darkText ? 'bg-villa-dark' : 'bg-white'} ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 transition-all ${darkText ? 'bg-villa-dark' : 'bg-white'} ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-stone-200 px-6 py-4 flex flex-col gap-4">
          <Link href="/" onClick={goHome} className="text-villa-dark hover:text-villa-green">{t('Home')}</Link>
          <Link href="/#villas" onClick={(e) => goToSection(e, 'villas')} className="text-villa-dark hover:text-villa-green">{t('Our Villas')}</Link>
          <Link href="/#book" onClick={(e) => goToSection(e, 'book')} className="text-villa-dark hover:text-villa-green">{t('Book')}</Link>
          <Link href="/#contact" onClick={(e) => goToSection(e, 'contact')} className="text-villa-dark hover:text-villa-green">{t('Contact')}</Link>
          <div className="flex items-center gap-2">
            <span className="text-sm text-villa-muted">{t('Language')}</span>
            <LanguageSwitcher />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-villa-muted">{t('Currency')}</span>
            <CurrencySwitcher />
          </div>
          <a
            href="https://wa.me/6282221762980"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-villa-green text-white text-center px-5 py-2 rounded-full"
          >
            {t('WhatsApp Us')}
          </a>
        </div>
      )}
    </nav>
  )
}
