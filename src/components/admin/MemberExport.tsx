'use client'

// Copy opted-in subscriber emails, or download the full member list as CSV.
import { useState } from 'react'

export interface MemberRow {
  email: string
  displayName: string
  newsletter: boolean
  joined: string
}

function csvCell(v: string): string {
  // Quote and escape for CSV safety.
  return `"${(v ?? '').replace(/"/g, '""')}"`
}

export default function MemberExport({
  emails,
  members,
}: {
  emails: string[]
  members: MemberRow[]
}) {
  const [copied, setCopied] = useState(false)

  async function copyEmails() {
    try {
      await navigator.clipboard.writeText(emails.join(', '))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  function downloadCsv() {
    const header = ['Name', 'Email', 'Newsletter', 'Joined']
    const lines = members.map((m) =>
      [m.displayName, m.email, m.newsletter ? 'Yes' : 'No', m.joined].map(csvCell).join(','),
    )
    const csv = [header.map(csvCell).join(','), ...lines].join('\r\n')
    const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ybg-members-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={copyEmails}
        disabled={emails.length === 0}
        className="rounded-xl border border-stone-300 px-5 py-2.5 text-sm text-stone-600 transition-colors hover:border-villa-green hover:text-villa-green disabled:opacity-50"
      >
        {copied ? 'Copied!' : `Copy ${emails.length} emails`}
      </button>
      <button
        onClick={downloadCsv}
        disabled={members.length === 0}
        className="rounded-xl bg-villa-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-villa-green-light disabled:opacity-50"
      >
        Export CSV
      </button>
    </div>
  )
}
