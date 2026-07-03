import 'server-only'

// ──────────────────────────────────────────────────────────────
// AI translation layer with a persistent Supabase cache.
// English is the source. Each unique string is translated once per locale by
// an LLM (via OpenRouter) and stored in public.translations; every later render
// reads it back for free. When Joel edits CMS content, the new text is a new
// string, so it is translated fresh automatically.
// ──────────────────────────────────────────────────────────────
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'
import { LOCALE_NAMES, isLocale, type Locale } from '@/i18n/config'
import { UI_STRINGS } from '@/i18n/strings'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Service role for cache writes (bypasses RLS); anon is enough for reads.
const db = createClient(SUPABASE_URL, SERVICE_KEY || ANON_KEY, {
  auth: { persistSession: false },
})

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = process.env.TRANSLATE_MODEL || 'google/gemini-2.5-flash'
const CHUNK = 40

function hash(s: string) {
  return createHash('sha1').update(s).digest('hex')
}

// Ask the model to translate a batch, returning an array in the same order.
async function llmTranslate(texts: string[], locale: Locale): Promise<string[]> {
  const apiKey = process.env.OPENROUTER_API_KEY?.replace(/[^\x20-\x7E]/g, '').trim()
  if (!apiKey) return texts
  const lang = LOCALE_NAMES[locale]
  const system =
    `You are a professional translator for a luxury Bali villa rental website (Your Bali Getaway). ` +
    `Translate each string from English into ${lang}. Keep the warm, upscale, concise tone. ` +
    `Preserve exactly any HTML tags, markdown, placeholders like {name}, emojis, line breaks and punctuation. ` +
    `Do NOT translate villa or brand names: "Your Bali Getaway", "Bali Bliss", "Bali Green", "Bali Blue 1", "Bali Blue 2", "Bali Sol", "Seminyak", "WhatsApp". ` +
    `Return ONLY a JSON array of the translated strings, same length and order as the input, and nothing else.`
  try {
    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: JSON.stringify(texts) },
        ],
        temperature: 0,
        max_tokens: 4000,
      }),
    })
    if (!res.ok) {
      console.error('translate: OpenRouter', res.status, await res.text())
      return texts
    }
    const data = await res.json()
    let content: string = data.choices?.[0]?.message?.content ?? ''
    // Strip ```json fences the model sometimes adds.
    content = content.trim().replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim()
    const arr = JSON.parse(content)
    if (Array.isArray(arr) && arr.length === texts.length) {
      return arr.map((v, i) => (typeof v === 'string' ? v : texts[i]))
    }
    console.error('translate: shape mismatch', arr?.length, 'vs', texts.length)
    return texts
  } catch (e) {
    console.error('translate: error', (e as Error).message)
    return texts
  }
}

// Translate a list of English strings into `locale`, using the cache. Order and
// length of the returned array match the input. English (or anything untranslatable)
// falls back to the source string, so the site never breaks on a translation failure.
export async function translateTexts(texts: string[], locale: string): Promise<string[]> {
  if (!isLocale(locale) || locale === 'en') return texts

  const uniq = [...new Set(texts.filter((t) => t && t.trim().length > 0))]
  if (uniq.length === 0) return texts

  const hashes = uniq.map(hash)
  const have = new Map<string, string>() // source_hash -> translated

  try {
    const { data } = await db
      .from('translations')
      .select('source_hash,translated')
      .eq('locale', locale)
      .in('source_hash', hashes)
    for (const r of data ?? []) have.set(r.source_hash, r.translated as string)
  } catch (e) {
    console.error('translate: cache read failed', (e as Error).message)
  }

  const misses = uniq.filter((_, i) => !have.has(hashes[i]))
  for (let i = 0; i < misses.length; i += CHUNK) {
    const chunk = misses.slice(i, i + CHUNK)
    const out = await llmTranslate(chunk, locale)
    const rows = chunk.map((s, j) => ({
      locale,
      source_hash: hash(s),
      source: s,
      translated: out[j] ?? s,
    }))
    try {
      await db.from('translations').upsert(rows, { onConflict: 'locale,source_hash' })
    } catch (e) {
      console.error('translate: cache write failed', (e as Error).message)
    }
    for (const r of rows) have.set(r.source_hash, r.translated)
  }

  const bySource = new Map<string, string>()
  uniq.forEach((s, i) => bySource.set(s, have.get(hashes[i]) ?? s))
  return texts.map((t) => (t && bySource.has(t) ? bySource.get(t)! : t))
}

// Convenience: translate a single string.
export async function translateOne(text: string, locale: string): Promise<string> {
  const [out] = await translateTexts([text], locale)
  return out
}

// Build the UI message map (English source -> translated) for the whole static
// catalog, handed to the client LanguageProvider so t() is synchronous (no flash).
export async function getMessages(locale: string): Promise<Record<string, string>> {
  if (!isLocale(locale) || locale === 'en') return {}
  const translated = await translateTexts(UI_STRINGS, locale)
  const map: Record<string, string> = {}
  UI_STRINGS.forEach((s, i) => {
    if (translated[i] && translated[i] !== s) map[s] = translated[i]
  })
  return map
}
