-- Run this in your Supabase SQL editor
alter table years add column if not exists cover_photo_id uuid references photos(id) on delete set null;
