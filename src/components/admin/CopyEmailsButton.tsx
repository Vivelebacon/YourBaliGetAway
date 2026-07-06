'use client'

import { useState } from 'react'

export default function CopyEmailsButton({ emails }: { emails: string[] }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(emails.join(', '))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable: no-op
    }
  }

  return (
    <button
      onClick={copy}
      disabled={emails.length === 0}
      className="rounded-xl bg-villa-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-villa-green-light disabled:opacity-50"
    >
      {copied ? 'Copied!' : `Copy ${emails.length} emails`}
    </button>
  )
}
