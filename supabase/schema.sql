-- ============================================================
-- Your Bali Getaway CMS — Supabase schema (Phase 1)
-- Run this in the Supabase dashboard → SQL Editor.
-- Safe to re-run (uses IF NOT EXISTS / OR REPLACE where possible).
--
-- NOTE: Hostaway listing IDs are intentionally NOT stored here.
-- The slug → listingId mapping lives in code (src/lib/villas.ts) so the
-- CMS can never alter or break the booking widget.
-- ============================================================

-- ── Tables ────────────────────────────────────────────────
create table if not exists public.villas (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name         text not null,
  subtitle     text,
  description  text,
  bedrooms     int  default 0,
  bathrooms    int  default 0,
  guests       int  default 0,
  rating       numeric(3,2),
  review_count int  default 0,
  highlights   text[] default '{}',
  amenities    text[] default '{}',
  cover_image  text,                 -- storage path in the 'villa-images' bucket
  sort_order   int  default 0,
  updated_at   timestamptz default now()
);

create table if not exists public.villa_images (
  id           uuid primary key default gen_random_uuid(),
  villa_id     uuid not null references public.villas(id) on delete cascade,
  storage_path text not null,        -- path in the 'villa-images' bucket
  caption      text,
  category     text,
  sort_order   int  default 0,
  created_at   timestamptz default now()
);
create index if not exists villa_images_villa_idx on public.villa_images(villa_id, sort_order);

create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  villa_id   uuid not null references public.villas(id) on delete cascade,
  name       text not null,
  text       text not null,
  sort_order int default 0
);
create index if not exists reviews_villa_idx on public.reviews(villa_id, sort_order);

create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  role       text default 'admin',
  created_at timestamptz default now()
);

-- ── Auto-create an admin profile for every new auth user ──
-- (Accounts are invite-only, so every signed-up user is an admin.)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'admin')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- ── Row Level Security ────────────────────────────────────
alter table public.villas       enable row level security;
alter table public.villa_images enable row level security;
alter table public.reviews      enable row level security;
alter table public.profiles     enable row level security;

-- Public can READ content
drop policy if exists "public read villas" on public.villas;
create policy "public read villas" on public.villas for select using (true);

drop policy if exists "public read villa_images" on public.villa_images;
create policy "public read villa_images" on public.villa_images for select using (true);

drop policy if exists "public read reviews" on public.reviews;
create policy "public read reviews" on public.reviews for select using (true);

-- Only admins can WRITE content
drop policy if exists "admin write villas" on public.villas;
create policy "admin write villas" on public.villas for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin write villa_images" on public.villa_images;
create policy "admin write villa_images" on public.villa_images for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin write reviews" on public.reviews;
create policy "admin write reviews" on public.reviews for all
  using (public.is_admin()) with check (public.is_admin());

-- Profiles: a user can read their own row; admins can read all
drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles for select
  using (id = auth.uid() or public.is_admin());

-- ── Storage bucket for images ─────────────────────────────
insert into storage.buckets (id, name, public)
values ('villa-images', 'villa-images', true)
on conflict (id) do nothing;

drop policy if exists "public read villa-images" on storage.objects;
create policy "public read villa-images" on storage.objects for select
  using (bucket_id = 'villa-images');

drop policy if exists "admin upload villa-images" on storage.objects;
create policy "admin upload villa-images" on storage.objects for insert to authenticated
  with check (bucket_id = 'villa-images' and public.is_admin());

drop policy if exists "admin update villa-images" on storage.objects;
create policy "admin update villa-images" on storage.objects for update to authenticated
  using (bucket_id = 'villa-images' and public.is_admin());

drop policy if exists "admin delete villa-images" on storage.objects;
create policy "admin delete villa-images" on storage.objects for delete to authenticated
  using (bucket_id = 'villa-images' and public.is_admin());
