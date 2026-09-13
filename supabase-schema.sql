-- Run this in your Supabase SQL editor

create table if not exists years (
  id uuid default gen_random_uuid() primary key,
  year integer not null unique,
  theme text,
  description text,
  created_at timestamptz default now()
);

create table if not exists photos (
  id uuid default gen_random_uuid() primary key,
  year_id uuid references years(id) on delete cascade not null,
  cloudinary_url text not null,
  public_id text not null,
  caption text,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists history (
  id uuid default gen_random_uuid() primary key,
  year integer not null unique,
  title text not null,
  story_text text not null,
  image_urls text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists user_roles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  role text not null check (role in ('super_admin', 'admin')),
  name text,
  created_at timestamptz default now()
);

-- Indexes
create index on photos (year_id);
create index on photos (created_at desc);

-- Row Level Security
alter table years enable row level security;
alter table photos enable row level security;
alter table history enable row level security;
alter table user_roles enable row level security;

-- Public can read everything
create policy "public_read_years" on years for select using (true);
create policy "public_read_photos" on photos for select using (true);
create policy "public_read_history" on history for select using (true);
create policy "users_read_own_role" on user_roles for select using (auth.uid() = user_id);

-- Authenticated admins can write
create policy "admin_write_years" on years for insert
  with check (exists (select 1 from user_roles where user_id = auth.uid()));

create policy "admin_update_years" on years for update
  using (exists (select 1 from user_roles where user_id = auth.uid()));

create policy "admin_write_photos" on photos for insert
  with check (exists (select 1 from user_roles where user_id = auth.uid()));

create policy "admin_delete_photos" on photos for delete
  using (exists (select 1 from user_roles where user_id = auth.uid()));

create policy "admin_write_history" on history for insert
  with check (exists (select 1 from user_roles where user_id = auth.uid()));

create policy "admin_update_history" on history for update
  using (exists (select 1 from user_roles where user_id = auth.uid()));

-- Only super_admin can manage user_roles.
-- security definer helper avoids infinite recursion (policy on user_roles querying user_roles).
create or replace function public.is_super_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from user_roles where user_id = auth.uid() and role = 'super_admin');
$$;
create policy "super_admin_manage_users" on user_roles for all
  using (is_super_admin()) with check (is_super_admin());
