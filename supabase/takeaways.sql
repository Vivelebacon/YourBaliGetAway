-- ============================================================
-- Our Bali Takeaways: blog + community (applied 2026-07-06)
-- Reference copy of the live migration (takeaways_community_v1 +
-- takeaways_gate_joel_picks). Safe to re-run.
--
-- Key security change: new signups now become role 'member'
-- (previously every signup became 'admin' under the invite-only
-- model). The two existing admin profiles are untouched.
-- ============================================================

-- 1) Profiles: member fields + safe signup trigger
alter table public.profiles add column if not exists display_name text;
alter table public.profiles add column if not exists newsletter_opt_in boolean default false;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, role, display_name, newsletter_opt_in)
  values (
    new.id,
    new.email,
    'member',
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'newsletter_opt_in')::boolean, false)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop policy if exists "insert own profile" on public.profiles;
create policy "insert own profile" on public.profiles for insert
  with check (id = auth.uid());
drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid() and role = 'member');

-- 2) Blog articles (CMS-managed by Joel at /admin/takeaways)
create table if not exists public.takeaway_articles (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  excerpt      text,
  category     text not null default 'explore',
  cover_url    text,
  body         text,
  joel_picks   text,
  members_only boolean default false,
  featured     boolean default false,
  published    boolean default false,
  sort_order   int default 0,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);
create index if not exists takeaway_articles_pub_idx on public.takeaway_articles(published, sort_order);

-- 3) Community recommendations
create table if not exists public.takeaway_recs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  author_name text not null,
  category    text not null default 'explore',
  title       text not null,
  body        text not null,
  place_name  text,
  area        text,
  status      text not null default 'approved',
  likes_count int not null default 0,
  created_at  timestamptz default now()
);
create index if not exists takeaway_recs_feed_idx on public.takeaway_recs(status, created_at desc);

create table if not exists public.takeaway_rec_likes (
  rec_id     uuid not null references public.takeaway_recs(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (rec_id, user_id)
);

create table if not exists public.takeaway_rec_comments (
  id          uuid primary key default gen_random_uuid(),
  rec_id      uuid not null references public.takeaway_recs(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  author_name text not null,
  body        text not null,
  created_at  timestamptz default now()
);
create index if not exists takeaway_rec_comments_idx on public.takeaway_rec_comments(rec_id, created_at);

create or replace function public.sync_rec_likes_count()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.takeaway_recs r
    set likes_count = (select count(*) from public.takeaway_rec_likes l where l.rec_id = coalesce(new.rec_id, old.rec_id))
    where r.id = coalesce(new.rec_id, old.rec_id);
  return null;
end;
$$;
drop trigger if exists rec_likes_sync on public.takeaway_rec_likes;
create trigger rec_likes_sync
  after insert or delete on public.takeaway_rec_likes
  for each row execute function public.sync_rec_likes_count();

-- 4) Row Level Security
alter table public.takeaway_articles     enable row level security;
alter table public.takeaway_recs         enable row level security;
alter table public.takeaway_rec_likes    enable row level security;
alter table public.takeaway_rec_comments enable row level security;

drop policy if exists "public read published articles" on public.takeaway_articles;
create policy "public read published articles" on public.takeaway_articles for select
  using (published = true or public.is_admin());
drop policy if exists "admin write articles" on public.takeaway_articles;
create policy "admin write articles" on public.takeaway_articles for all
  using (public.is_admin()) with check (public.is_admin());

-- Community is members-only: only authenticated members (and admins) can read
-- recs/comments/likes. The `to authenticated` clause denies the anon role.
drop policy if exists "read approved recs" on public.takeaway_recs;
create policy "read approved recs" on public.takeaway_recs for select to authenticated
  using (status = 'approved' or user_id = auth.uid() or public.is_admin());
drop policy if exists "members insert own recs" on public.takeaway_recs;
create policy "members insert own recs" on public.takeaway_recs for insert to authenticated
  with check (user_id = auth.uid() and status = 'approved');
drop policy if exists "authors update own recs" on public.takeaway_recs;
create policy "authors update own recs" on public.takeaway_recs for update to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());
drop policy if exists "authors delete own recs" on public.takeaway_recs;
create policy "authors delete own recs" on public.takeaway_recs for delete to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "read likes" on public.takeaway_rec_likes;
create policy "read likes" on public.takeaway_rec_likes for select to authenticated using (true);
drop policy if exists "members like" on public.takeaway_rec_likes;
create policy "members like" on public.takeaway_rec_likes for insert to authenticated
  with check (user_id = auth.uid());
drop policy if exists "members unlike" on public.takeaway_rec_likes;
create policy "members unlike" on public.takeaway_rec_likes for delete to authenticated
  using (user_id = auth.uid());

drop policy if exists "read comments" on public.takeaway_rec_comments;
create policy "read comments" on public.takeaway_rec_comments for select to authenticated using (true);
drop policy if exists "members comment" on public.takeaway_rec_comments;
create policy "members comment" on public.takeaway_rec_comments for insert to authenticated
  with check (user_id = auth.uid());
drop policy if exists "authors delete own comments" on public.takeaway_rec_comments;
create policy "authors delete own comments" on public.takeaway_rec_comments for delete to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- 4b) Newsletter drafts + sent history, composed by Joel in the CMS.
create table if not exists public.newsletters (
  id              uuid primary key default gen_random_uuid(),
  subject         text not null,
  body            text not null default '',
  status          text not null default 'draft',   -- 'draft' | 'sent'
  recipient_count int  not null default 0,
  sent_at         timestamptz,
  created_by      uuid references auth.users(id) on delete set null,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
create index if not exists newsletters_recent_idx on public.newsletters(created_at desc);
alter table public.newsletters enable row level security;
drop policy if exists "admin all newsletters" on public.newsletters;
create policy "admin all newsletters" on public.newsletters for all
  using (public.is_admin()) with check (public.is_admin());

-- 5) Members-only column: anon API callers can never read joel_picks.
revoke select (joel_picks) on public.takeaway_articles from anon;

-- Public boolean flag: does a gated picks block exist (without leaking it)?
alter table public.takeaway_articles
  add column if not exists has_picks boolean generated always as (joel_picks is not null and length(joel_picks) > 0) stored;
