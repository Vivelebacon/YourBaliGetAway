'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { pushLive, type ImageRow, type ReviewRow, type VillaRow } from '@/lib/admin'
import GalleryManager from './GalleryManager'

interface Props {
  villa: VillaRow
  initialImages: ImageRow[]
  initialReviews: ReviewRow[]
}

export default function VillaEditor({ villa, initialImages, initialReviews }: Props) {
  const supabase = createClient()

  const [form, setForm] = useState({
    name: villa.name,
    subtitle: villa.subtitle ?? '',
    description: villa.description ?? '',
    bedrooms: villa.bedrooms,
    bathrooms: villa.bathrooms,
    guests: villa.guests,
    rating: villa.rating ?? 0,
    review_count: villa.review_count,
  })
  const [highlights, setHighlights] = useState<string[]>(villa.highlights ?? [])
  const [amenities, setAmenities] = useState<string[]>(villa.amenities ?? [])
  const [reviews, setReviews] = useState(
    initialReviews.map((r) => ({ name: r.name, text: r.text })),
  )

  const [savingDetails, setSavingDetails] = useState(false)
  const [savingReviews, setSavingReviews] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  function flash(m: string) {
    setMsg(m)
    setTimeout(() => setMsg(null), 2500)
  }

  async function saveDetails() {
    setSavingDetails(true)
    const { error } = await supabase
      .from('villas')
      .update({
        name: form.name,
        subtitle: form.subtitle,
        description: form.description,
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        guests: Number(form.guests),
        rating: Number(form.rating),
        review_count: Number(form.review_count),
        highlights: highlights.map((h) => h.trim()).filter(Boolean),
        amenities: amenities.map((a) => a.trim()).filter(Boolean),
        updated_at: new Date().toISOString(),
      })
      .eq('id', villa.id)
    setSavingDetails(false)
    if (error) return flash(`Error: ${error.message}`)
    await pushLive(villa.slug)
    flash('Details saved')
  }

  async function saveReviews() {
    setSavingReviews(true)
    await supabase.from('reviews').delete().eq('villa_id', villa.id)
    const rows = reviews
      .filter((r) => r.name.trim() && r.text.trim())
      .map((r, i) => ({ villa_id: villa.id, name: r.name.trim(), text: r.text.trim(), sort_order: i }))
    if (rows.length) {
      const { error } = await supabase.from('reviews').insert(rows)
      if (error) {
        setSavingReviews(false)
        return flash(`Error: ${error.message}`)
      }
    }
    setSavingReviews(false)
    await pushLive(villa.slug)
    flash('Reviews saved')
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin" className="text-sm text-stone-500 hover:text-villa-green">
            ← All villas
          </Link>
          <h1 className="font-serif text-3xl text-villa-dark mt-1">{form.name}</h1>
        </div>
        {msg && <span className="text-sm text-villa-green">{msg}</span>}
      </div>

      {/* ── Details ── */}
      <section className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
        <h2 className="font-serif text-2xl text-villa-dark mb-6">Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Name">
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Subtitle">
            <input className="input" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Description">
              <textarea
                className="input min-h-[160px]"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Bedrooms">
            <input type="number" className="input" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })} />
          </Field>
          <Field label="Bathrooms">
            <input type="number" className="input" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: Number(e.target.value) })} />
          </Field>
          <Field label="Max guests">
            <input type="number" className="input" value={form.guests} onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Rating">
              <input type="number" step="0.01" className="input" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
            </Field>
            <Field label="Review count">
              <input type="number" className="input" value={form.review_count} onChange={(e) => setForm({ ...form, review_count: Number(e.target.value) })} />
            </Field>
          </div>
        </div>

        <TagEditor label="Highlights" items={highlights} setItems={setHighlights} />
        <TagEditor label="Amenities" items={amenities} setItems={setAmenities} />

        <button
          onClick={saveDetails}
          disabled={savingDetails}
          className="mt-6 bg-villa-green text-white font-medium px-6 py-3 rounded-xl hover:bg-villa-green-light disabled:opacity-60"
        >
          {savingDetails ? 'Saving…' : 'Save details'}
        </button>
      </section>

      {/* ── Gallery ── */}
      <section className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
        <GalleryManager
          villaId={villa.id}
          slug={villa.slug}
          coverPath={villa.cover_image}
          initialImages={initialImages}
        />
      </section>

      {/* ── Reviews ── */}
      <section className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
        <h2 className="font-serif text-2xl text-villa-dark mb-6">Reviews</h2>
        <div className="space-y-4">
          {reviews.map((r, i) => (
            <div key={i} className="border border-stone-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <input
                  className="input max-w-xs"
                  placeholder="Guest name"
                  value={r.name}
                  onChange={(e) => setReviews(reviews.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
                />
                <button onClick={() => setReviews(reviews.filter((_, j) => j !== i))} className="text-sm text-red-500 hover:underline">
                  Remove
                </button>
              </div>
              <textarea
                className="input"
                rows={3}
                placeholder="Review text"
                value={r.text}
                onChange={(e) => setReviews(reviews.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button onClick={() => setReviews([...reviews, { name: '', text: '' }])} className="text-sm text-villa-green hover:underline">
            + Add review
          </button>
          <button
            onClick={saveReviews}
            disabled={savingReviews}
            className="bg-villa-green text-white font-medium px-6 py-3 rounded-xl hover:bg-villa-green-light disabled:opacity-60"
          >
            {savingReviews ? 'Saving…' : 'Save reviews'}
          </button>
        </div>
      </section>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm text-villa-muted mb-1.5">{label}</span>
      {children}
    </label>
  )
}

function TagEditor({
  label,
  items,
  setItems,
}: {
  label: string
  items: string[]
  setItems: (v: string[]) => void
}) {
  return (
    <div className="mt-6">
      <p className="text-sm text-villa-muted mb-2">{label}</p>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              className="input"
              value={item}
              onChange={(e) => setItems(items.map((x, j) => (j === i ? e.target.value : x)))}
            />
            <button
              onClick={() => setItems(items.filter((_, j) => j !== i))}
              className="px-3 text-stone-400 hover:text-red-500"
              aria-label="Remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button onClick={() => setItems([...items, ''])} className="text-sm text-villa-green hover:underline mt-2">
        + Add {label.toLowerCase().replace(/s$/, '')}
      </button>
    </div>
  )
}
