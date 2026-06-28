-- Drift waitlist table.
-- Run this in your Supabase dashboard: SQL Editor → New query → paste → Run.

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  vibe text,
  source text default 'website',
  created_at timestamptz not null default now()
);

-- Lock the table down: only the server (service side) and our controlled
-- insert policy can write. No one can read the list from the client.
alter table public.waitlist enable row level security;

-- Allow anonymous inserts (the public "Get Early Access" form) but nothing
-- else. The WITH CHECK validates email format and caps lengths at the DB
-- level so the open insert can't be abused with garbage payloads.
drop policy if exists "anon can join waitlist" on public.waitlist;
create policy "anon can join waitlist"
  on public.waitlist
  for insert
  to anon
  with check (
    email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and char_length(email) <= 254
    and (vibe is null or char_length(vibe) <= 40)
    and source = 'website'
  );

-- Helpful index for de-duping / lookups.
create index if not exists waitlist_email_idx on public.waitlist (email);
