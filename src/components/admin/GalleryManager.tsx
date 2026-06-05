'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { imageUrl, pushLive, slugifyFilename, type ImageRow } from '@/lib/admin'

interface Props {
  villaId: string
  slug: string
  coverPath: string | null
  initialImages: ImageRow[]
}

const BUCKET = 'villa-images'

export default function GalleryManager({ villaId, slug, coverPath, initialImages }: Props) {
  const supabase = createClient()
  const [images, setImages] = useState<ImageRow[]>(initialImages)
  const [cover, setCover] = useState<string | null>(coverPath)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const dragIndex = useRef<number | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  function flash(msg: string) {
    setStatus(msg)
    setTimeout(() => setStatus(null), 2000)
  }

  // ── Drag to reorder ──
  function onDragStart(i: number) {
    dragIndex.current = i
  }
  function onDragOver(e: React.DragEvent, i: number) {
    e.preventDefault()
    const from = dragIndex.current
    if (from === null || from === i) return
    setImages((prev) => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(i, 0, moved)
      return next
    })
    dragIndex.current = i
  }
  async function onDrop() {
    dragIndex.current = null
    // Persist new order: write each row's new index.
    await Promise.all(
      images.map((img, idx) =>
        supabase.from('villa_images').update({ sort_order: idx }).eq('id', img.id),
      ),
    )
    await pushLive(slug)
    flash('Order saved')
  }

  // ── Edit caption / category ──
  async function updateField(id: string, field: 'caption' | 'category', value: string) {
    setImages((prev) => prev.map((im) => (im.id === id ? { ...im, [field]: value } : im)))
  }
  async function persistField(id: string, field: 'caption' | 'category', value: string) {
    await supabase.from('villa_images').update({ [field]: value }).eq('id', id)
    await pushLive(slug)
    flash('Saved')
  }

  // ── Set as cover ──
  async function setAsCover(path: string) {
    await supabase.from('villas').update({ cover_image: path }).eq('id', villaId)
    setCover(path)
    await pushLive(slug)
    flash('Cover updated')
  }

  // ── Delete ──
  async function remove(img: ImageRow) {
    if (!confirm('Delete this photo?')) return
    await supabase.storage.from(BUCKET).remove([img.storage_path])
    await supabase.from('villa_images').delete().eq('id', img.id)
    setImages((prev) => prev.filter((im) => im.id !== img.id))
    await pushLive(slug)
    flash('Deleted')
  }

  // ── Upload ──
  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    let order = images.length
    const added: ImageRow[] = []
    for (const file of files) {
      const path = `${slug}/uploads/${Date.now()}-${slugifyFilename(file.name)}`
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: true, contentType: file.type })
      if (upErr) {
        flash(`Upload failed: ${upErr.message}`)
        continue
      }
      const { data, error } = await supabase
        .from('villa_images')
        .insert({ villa_id: villaId, storage_path: path, caption: '', category: 'Gallery', sort_order: order })
        .select('*')
        .single()
      if (!error && data) {
        added.push(data as ImageRow)
        order++
      }
    }
    setImages((prev) => [...prev, ...added])
    if (fileInput.current) fileInput.current.value = ''
    setUploading(false)
    await pushLive(slug)
    flash(`${added.length} photo(s) added`)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-serif text-2xl text-villa-dark">Gallery</h2>
          <p className="text-sm text-stone-500">Drag photos to reorder. Click a field to edit.</p>
        </div>
        <div className="flex items-center gap-3">
          {status && <span className="text-sm text-villa-green">{status}</span>}
          <button
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
            className="bg-villa-green text-white text-sm px-4 py-2 rounded-lg hover:bg-villa-green-light disabled:opacity-60"
          >
            {uploading ? 'Uploading…' : '+ Add photos'}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            onChange={onFiles}
            className="hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <div
            key={img.id}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragOver={(e) => onDragOver(e, i)}
            onDrop={onDrop}
            className="bg-white rounded-xl border border-stone-200 overflow-hidden cursor-move"
          >
            <div className="relative aspect-[4/3]">
              <Image src={imageUrl(img.storage_path)} alt={img.category ?? ''} fill className="object-cover" />
              {cover === img.storage_path && (
                <span className="absolute top-2 left-2 bg-villa-gold text-white text-[10px] px-2 py-0.5 rounded-full">
                  Cover
                </span>
              )}
            </div>
            <div className="p-2 space-y-2">
              <input
                value={img.category ?? ''}
                onChange={(e) => updateField(img.id, 'category', e.target.value)}
                onBlur={(e) => persistField(img.id, 'category', e.target.value)}
                placeholder="Category"
                className="w-full text-xs border border-stone-200 rounded px-2 py-1"
              />
              <textarea
                value={img.caption ?? ''}
                onChange={(e) => updateField(img.id, 'caption', e.target.value)}
                onBlur={(e) => persistField(img.id, 'caption', e.target.value)}
                placeholder="Caption"
                rows={2}
                className="w-full text-xs border border-stone-200 rounded px-2 py-1 resize-none"
              />
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setAsCover(img.storage_path)}
                  className="text-[11px] text-villa-green hover:underline"
                >
                  Set as cover
                </button>
                <button
                  onClick={() => remove(img)}
                  className="text-[11px] text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
