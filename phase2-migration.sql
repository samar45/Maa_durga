-- Run this in your Supabase SQL editor (after supabase-schema.sql and cover-photo-migration.sql)

-- 1. Fix infinite recursion in user_roles RLS.
--    A policy on user_roles cannot query user_roles; use a security-definer helper instead.
create or replace function public.is_super_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from user_roles where user_id = auth.uid() and role = 'super_admin');
$$;

drop policy if exists "super_admin_manage_users" on user_roles;
create policy "super_admin_manage_users" on user_roles for all
  using (is_super_admin()) with check (is_super_admin());

-- 2. Schedule: puja / aarti / meals, grouped by day
create table if not exists schedule (
  id uuid default gen_random_uuid() primary key,
  day_date date not null,
  day_label text,                                   -- e.g. "Saptami"
  kind text not null check (kind in ('puja', 'aarti', 'breakfast', 'lunch', 'dinner', 'other')),
  title text not null,                              -- e.g. "Sandhi Puja", "Bhog"
  start_time time,
  end_time time,
  details text,                                     -- menu items / notes
  created_at timestamptz default now()
);
create index on schedule (day_date, start_time);
alter table schedule enable row level security;
create policy "public_read_schedule" on schedule for select using (true);
create policy "admin_all_schedule" on schedule for all
  using (exists (select 1 from user_roles where user_id = auth.uid()))
  with check (exists (select 1 from user_roles where user_id = auth.uid()));

-- 3. Feedback from visitors
create table if not exists feedback (
  id uuid default gen_random_uuid() primary key,
  name text,
  message text not null check (char_length(message) between 1 and 1000),
  rating integer check (rating between 1 and 5),
  created_at timestamptz default now()
);
alter table feedback enable row level security;
create policy "anyone_insert_feedback" on feedback for insert with check (true);
create policy "admin_read_feedback" on feedback for select
  using (exists (select 1 from user_roles where user_id = auth.uid()));
create policy "admin_delete_feedback" on feedback for delete
  using (exists (select 1 from user_roles where user_id = auth.uid()));
