'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

interface ChatMsg {
  role: 'user' | 'assistant'
  content: string
  bookSlug?: string | null
  showWhatsApp?: boolean
}

const VILLA_NAMES: Record<string, string> = {
  'bali-bliss': 'Bali Bliss',
  'bali-blue-1': 'Bali Blue 1',
  'bali-blue-2': 'Bali Blue 2',
  'bali-green': 'Bali Green',
  'bali-sol': 'Bali Sol',
}

const WHATSAPP = 'https://wa.me/6282221762980'

const GREETING: ChatMsg = {
  role: 'assistant',
  content:
    "Hi, I'm Maya from Your Bali Getaway. I can help you find the perfect villa, check dates and prices, or answer any question. What are you looking for?",
}

const QUICK_REPLIES = [
  'Which villa is best for a couple?',
  'A villa for a family of 6?',
  'What is included?',
  'Check availability for my dates',
]

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMsg[]>([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, open])

  async function send(text: string) {
    const content = text.trim()
    if (!content || loading) return
    const next: ChatMsg[] = [...messages, { role: 'user', content }]
    setMessages(next)
    setInput('')
    setLoading(true)

    // Build API payload: alternate turns starting with a user message.
    const payload = next.map((m) => ({ role: m.role, content: m.content }))
    while (payload.length && payload[0].role === 'assistant') payload.shift()

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: payload.slice(-20) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error')
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: data.reply, bookSlug: data.bookSlug, showWhatsApp: data.showWhatsApp },
      ])
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content:
            "Sorry, I couldn't respond just now. You can reach the team directly on WhatsApp.",
          showWhatsApp: true,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Guest widget only — never on the admin area.
  if (pathname?.startsWith('/admin')) return null

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Chat with us"
        className="fixed bottom-5 right-5 z-[60] w-14 h-14 rounded-full bg-villa-green text-white shadow-lg flex items-center justify-center hover:bg-villa-green-light transition-colors"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12a8 8 0 01-11.6 7.1L3 21l1.9-6.4A8 8 0 1121 12z" />
          </svg>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-[60] w-[calc(100vw-2.5rem)] sm:w-96 h-[32rem] max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-villa-green text-white px-5 py-4">
            <p className="font-serif text-lg leading-tight">Your Bali Getaway</p>
            <p className="text-white/70 text-xs">Maya · usually replies instantly</p>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-villa-cream">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-villa-green text-white rounded-br-sm'
                      : 'bg-white text-villa-dark border border-stone-100 rounded-bl-sm'
                  }`}
                >
                  {m.content}
                  {(m.bookSlug || m.showWhatsApp) && (
                    <div className="mt-3 flex flex-col gap-2">
                      {m.bookSlug && VILLA_NAMES[m.bookSlug] && (
                        <a
                          href={`/villas/${m.bookSlug}#book`}
                          className="block text-center bg-villa-green text-white text-sm font-medium py-2 rounded-lg hover:bg-villa-green-light transition-colors"
                        >
                          Book {VILLA_NAMES[m.bookSlug]} →
                        </a>
                      )}
                      {m.showWhatsApp && (
                        <a
                          href={WHATSAPP}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-center border border-villa-green text-villa-green text-sm font-medium py-2 rounded-lg hover:bg-villa-green/5 transition-colors"
                        >
                          Chat on WhatsApp
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-100 rounded-2xl rounded-bl-sm px-4 py-3">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-villa-muted rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-villa-muted rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-villa-muted rounded-full animate-bounce" />
                  </span>
                </div>
              </div>
            )}

            {/* Quick replies (only before the first user message) */}
            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-xs text-villa-green border border-villa-green/40 rounded-full px-3 py-1.5 hover:bg-villa-green/5"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
            className="border-t border-stone-200 p-3 flex items-center gap-2 bg-white"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the villas…"
              maxLength={2000}
              className="flex-1 text-sm px-3 py-2 rounded-full border border-stone-300 outline-none focus:border-villa-green"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send"
              className="w-9 h-9 rounded-full bg-villa-green text-white flex items-center justify-center disabled:opacity-40"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  )
}
