import Link from 'next/link'

export default function Footer() {
  return (
    <footer id="contact" className="bg-villa-dark text-stone-300 py-16">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="font-serif text-2xl text-white mb-3">YBG Villas</h3>
          <p className="text-sm leading-relaxed text-stone-400">
            Five private pool villas in the heart of Bali. Book direct for the best rates
            and personalised service.
          </p>
        </div>

        <div>
          <h4 className="font-serif text-lg text-white mb-3">Our Villas</h4>
          <ul className="space-y-2 text-sm">
            {[
              { slug: 'bali-bliss', name: 'Bali Bliss' },
              { slug: 'bali-blue-1', name: 'Bali Blue 1' },
              { slug: 'bali-blue-2', name: 'Bali Blue 2' },
              { slug: 'bali-green', name: 'Bali Green' },
              { slug: 'bali-sol', name: 'Bali Sol' },
            ].map((v) => (
              <li key={v.slug}>
                <Link href={`/villas/${v.slug}`} className="hover:text-villa-gold transition-colors">
                  {v.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg text-white mb-3">Contact</h4>
          <div className="space-y-3 text-sm">
            <a
              href="https://wa.me/message/YOURLINK"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-villa-gold transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.103 1.51 5.833L0 24l6.335-1.652A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.372l-.36-.214-3.727.977.994-3.634-.234-.373A9.818 9.818 0 1112 21.818z"/>
              </svg>
              WhatsApp
            </a>
            <p className="text-stone-400">Bali, Indonesia</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12 pt-6 border-t border-stone-700 text-xs text-stone-500 flex flex-col md:flex-row justify-between gap-2">
        <p>© {new Date().getFullYear()} YBG Villas. All rights reserved.</p>
        <p>Powered by Smoobu — Real-time availability, zero double bookings.</p>
      </div>
    </footer>
  )
}
