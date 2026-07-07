'use client'

// Compose a newsletter in the CMS and send it to opted-in members.
// Sending uses the admin's own Gmail/mail app with every subscriber pre-filled
// in BCC (no external email provider needed), and each send is logged to the
// newsletters table for history. Big lists fall back to copy buttons because
// mailto/Gmail-compose URLs have a length limit.
import { useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface NewsletterDraft {
  id: string
  subject: string
  body: string
  status: string
  recipient_count: number
  sent_at: string | null
  created_at: string
}
type Draft = NewsletterDraft

// mailto / Gmail-compose URLs break past ~1900 chars; keep a safe margin.
const URL_LIMIT = 1800

export default function NewsletterComposer({
  emails,
  initialDrafts,
}: {
  emails: string[]
  initialDrafts: Draft[]
}) {
  const supabase = useMemo(() => createClient(), [])
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [drafts, setDrafts] = useState<Draft[]>(initialDrafts)
  const [copied, setCopied] = useState<string | null>(null)
  const [savedMsg, setSavedMsg] = useState<string | null>(null)

  const bcc = emails.join(',')
  const gmailUrl =
    `https://mail.google.com/mail/?view=cm&fs=1&bcc=${encodeURIComponent(bcc)}` +
    `&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  const mailtoUrl = `mailto:?bcc=${encodeURIComponent(bcc)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  const tooLong = gmailUrl.length > URL_LIMIT
  const canSend = emails.length > 0 && subject.trim().length > 0

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(label)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  async function logSend(status: 'sent' | 'draft') {
    const row = {
      subject: subject.trim() || '(no subject)',
      body,
      status,
      recipient_count: status === 'sent' ? emails.length : 0,
      sent_at: status === 'sent' ? new Date().toISOString() : null,
    }
    const { data } = await supabase.from('newsletters').insert(row).select().single()
    if (data) setDrafts((prev) => [data as Draft, ...prev])
    setSavedMsg(status === 'sent' ? 'Logged as sent.' : 'Draft saved.')
    setTimeout(() => setSavedMsg(null), 2500)
  }

  function openAndLog(url: string) {
    window.open(url, '_blank')
    logSend('sent')
  }

  return (
    <div className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="font-serif text-2xl font-light text-villa-dark">Write the newsletter</h2>
      <p className="mt-1 text-sm text-stone-500">
        Compose here, then send it to your {emails.length} subscriber{emails.length === 1 ? '' : 's'} in one click. It opens
        your email with everyone in BCC (they never see each other), and you send from your own address.
      </p>

      <div className="mt-5 space-y-3">
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject, e.g. Your Bali tips for July + a villa treat"
          className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm outline-none focus:border-villa-green"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={10}
          placeholder={
            'Write your monthly Bali tips here.\n\nKeep it warm and short: a couple of recommendations, maybe a promo code for the villas, and a link back to yourbaligetaway.com.'
          }
          className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm leading-relaxed outline-none focus:border-villa-green"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!tooLong ? (
          <>
            <button
              onClick={() => openAndLog(gmailUrl)}
              disabled={!canSend}
              className="rounded-full bg-villa-green px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-villa-green-light disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send with Gmail
            </button>
            <button
              onClick={() => openAndLog(mailtoUrl)}
              disabled={!canSend}
              className="rounded-full border border-villa-green px-6 py-2.5 text-sm font-medium text-villa-green transition-colors hover:bg-villa-green hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send with my email app
            </button>
          </>
        ) : (
          <p className="rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
            Your list is large. One-click send is capped, so copy the emails and message below and paste them into a BCC
            email yourself.
          </p>
        )}
        <button
          onClick={() => copy(emails.join(', '), 'emails')}
          disabled={emails.length === 0}
          className="rounded-full border border-stone-300 px-5 py-2.5 text-sm text-stone-600 transition-colors hover:border-villa-green hover:text-villa-green disabled:opacity-50"
        >
          {copied === 'emails' ? 'Copied!' : 'Copy emails'}
        </button>
        <button
          onClick={() => copy(`Subject: ${subject}\n\n${body}`, 'msg')}
          disabled={!subject.trim() && !body.trim()}
          className="rounded-full border border-stone-300 px-5 py-2.5 text-sm text-stone-600 transition-colors hover:border-villa-green hover:text-villa-green disabled:opacity-50"
        >
          {copied === 'msg' ? 'Copied!' : 'Copy message'}
        </button>
        <button
          onClick={() => logSend('draft')}
          disabled={!subject.trim() && !body.trim()}
          className="ml-auto text-sm text-stone-500 hover:text-villa-green disabled:opacity-50"
        >
          Save draft
        </button>
      </div>
      {savedMsg && <p className="mt-3 text-sm text-villa-green">{savedMsg}</p>}

      {drafts.length > 0 && (
        <div className="mt-8 border-t border-stone-100 pt-6">
          <h3 className="text-sm font-medium text-stone-700">Recent newsletters</h3>
          <ul className="mt-3 space-y-2">
            {drafts.slice(0, 8).map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-4 text-sm">
                <button
                  onClick={() => {
                    setSubject(d.subject === '(no subject)' ? '' : d.subject)
                    setBody(d.body)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="truncate text-left text-stone-700 hover:text-villa-green"
                  title="Load into the composer"
                >
                  {d.subject}
                </button>
                <span className="shrink-0 text-xs text-stone-400">
                  {d.status === 'sent'
                    ? `Sent to ${d.recipient_count} · ${new Date(d.sent_at ?? d.created_at).toLocaleDateString()}`
                    : `Draft · ${new Date(d.created_at).toLocaleDateString()}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
