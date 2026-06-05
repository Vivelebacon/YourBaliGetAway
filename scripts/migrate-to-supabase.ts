/**
 * One-time migration: src/lib/villas.ts + public/images → Supabase.
 *
 * Run with:
 *   node --env-file=.env.local --import tsx scripts/migrate-to-supabase.ts
 *
 * Idempotent: re-running upserts villas by slug and rebuilds their images/reviews.
 * Uses the service_role key (bypasses RLS). Never run this in the browser.
 */
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { villas } from '../src/lib/villas'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const IMAGES_ROOT = path.resolve(__dirname, '../public/images')
const BUCKET = 'villa-images'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

function contentType(file: string): string {
  const ext = file.toLowerCase().split('.').pop()
  if (ext === 'png') return 'image/png'
  if (ext === 'webp') return 'image/webp'
  return 'image/jpeg'
}

// storage keys: no spaces (avoids URL-encoding headaches when served)
function toKey(slug: string, relPath: string) {
  return `${slug}/${relPath.split(' ').join('_')}`
}

async function uploadFile(localPath: string, key: string): Promise<boolean> {
  if (!fs.existsSync(localPath)) {
    console.warn(`   ⚠ missing file: ${localPath}`)
    return false
  }
  const buf = fs.readFileSync(localPath)
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(key, buf, { contentType: contentType(localPath), upsert: true })
  if (error) {
    console.warn(`   ⚠ upload failed ${key}: ${error.message}`)
    return false
  }
  return true
}

async function main() {
  console.log(`Migrating ${villas.length} villas → ${url}\n`)

  for (let v = 0; v < villas.length; v++) {
    const villa = villas[v]
    console.log(`• ${villa.name} (${villa.slug})`)

    // 1. Cover image
    const coverKey = toKey(villa.slug, villa.coverImage)
    await uploadFile(path.join(IMAGES_ROOT, villa.slug, villa.coverImage), coverKey)

    // 2. Upsert villa row
    const { data: villaRow, error: vErr } = await supabase
      .from('villas')
      .upsert(
        {
          slug: villa.slug,
          name: villa.name,
          subtitle: villa.subtitle,
          description: villa.description,
          bedrooms: villa.bedrooms,
          bathrooms: villa.bathrooms,
          guests: villa.guests,
          rating: villa.rating,
          review_count: villa.reviewCount,
          highlights: villa.highlights,
          amenities: villa.amenities,
          cover_image: coverKey,
          sort_order: v,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slug' },
      )
      .select('id')
      .single()

    if (vErr || !villaRow) {
      console.error(`   ✗ villa upsert failed: ${vErr?.message}`)
      continue
    }
    const villaId = villaRow.id

    // 3. Rebuild images + reviews idempotently
    await supabase.from('villa_images').delete().eq('villa_id', villaId)
    await supabase.from('reviews').delete().eq('villa_id', villaId)

    // 4. Gallery images
    const imageRows: Record<string, unknown>[] = []
    for (let i = 0; i < villa.images.length; i++) {
      const img = villa.images[i]
      const key = toKey(villa.slug, img.path)
      const ok = await uploadFile(path.join(IMAGES_ROOT, villa.slug, img.path), key)
      if (!ok) continue
      imageRows.push({
        villa_id: villaId,
        storage_path: key,
        caption: img.caption ?? null,
        category: img.category,
        sort_order: i,
      })
    }
    if (imageRows.length) {
      const { error } = await supabase.from('villa_images').insert(imageRows)
      if (error) console.error(`   ✗ images insert failed: ${error.message}`)
    }

    // 5. Reviews
    const reviewRows = villa.reviews.map((r, i) => ({
      villa_id: villaId,
      name: r.name,
      text: r.text,
      sort_order: i,
    }))
    if (reviewRows.length) {
      const { error } = await supabase.from('reviews').insert(reviewRows)
      if (error) console.error(`   ✗ reviews insert failed: ${error.message}`)
    }

    console.log(`   ✓ ${imageRows.length} images, ${reviewRows.length} reviews`)
  }

  console.log('\nDone.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
