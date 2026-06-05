# Your Bali Getaway CMS — Supabase setup

Follow these once to stand up the CMS backend. ~10 minutes.

## 1. Create the project
1. Go to https://supabase.com → New project (free tier is fine).
2. Pick a name (e.g. `ybg-villas`) and a strong database password.
3. Region: choose one close to your guests (e.g. Singapore for Bali/SEA).

## 2. Run the schema
1. In the project: **SQL Editor → New query**.
2. Paste the entire contents of `supabase/schema.sql` and **Run**.
3. This creates the tables, security rules, the auto-admin trigger, and the
   `villa-images` storage bucket.

## 3. Get the keys
**Project Settings → API**, copy:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL` (e.g. `https://xxxx.supabase.co`)
- **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (server-side only, never in the browser)

These go in `.env.local` (gitignored) and in Vercel env. Do NOT paste real keys
into this file: it is committed to git.

## 4. Create the admin login(s)
**Authentication → Users → Add user** (email + password). Create one for you and
one for Joel. Every user created is automatically an admin (invite-only model).

## 5. Migrate the existing content
Once the keys are set, Hugo runs the one-time migration script that reads the
current `src/lib/villas.ts` + `/public/images` and loads them into Supabase
(villas, gallery images with order + captions, reviews).

---

After this, content is managed at `/admin` on the website. The Hostaway booking
widget is NOT part of the CMS and cannot be edited from it.
