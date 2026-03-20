-- ============================================================
-- VBYM Migration 003: Profiles, Viewing Requests, VR Pipeline
-- Run this against your Supabase project SQL editor.
-- ============================================================


-- ── profiles ─────────────────────────────────────────────
-- Stores buyer profile data and alert preferences.
-- A row is auto-created for each new auth.users signup via trigger.
-- Existing users: rows are created lazily via upsert in the settings page.
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  phone       text,
  -- Alert preferences as JSONB for flexibility.
  -- Keys: "new-properties", "price-changes", "status-updates"
  alert_prefs jsonb not null default '{"new-properties":true,"price-changes":true,"status-updates":false}',
  updated_at  timestamptz default now()
);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function set_updated_at();

alter table public.profiles enable row level security;

create policy "Profiles: users manage own" on public.profiles
  for all using (id = auth.uid())
  with check (id = auth.uid());

-- Admins can read all profiles
create policy "Profiles: admin read" on public.profiles
  for select using (public.is_admin());

-- Auto-create a profile row when a user signs up
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Drop and recreate in case it already exists with a different definition
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();


-- ── viewing_requests ──────────────────────────────────────
-- Buyer-submitted structured viewing requests.
-- Separate from free-form enquiries — carries date/time preferences.
create table if not exists public.viewing_requests (
  id             uuid default gen_random_uuid() primary key,
  property_id    uuid not null references public.properties(id) on delete cascade,
  agency_id      uuid not null references public.agencies(id) on delete cascade,
  name           text not null,
  email          text not null,
  phone          text,
  preferred_date date,
  preferred_time text check (preferred_time in ('morning', 'afternoon', 'evening', 'flexible')),
  notes          text,
  status         text not null default 'pending'
    check (status in ('pending', 'confirmed', 'declined', 'completed')),
  created_at     timestamptz default now()
);

alter table public.viewing_requests enable row level security;

-- Anyone (incl. anonymous) can submit for a published property
create policy "Viewing requests: public insert" on public.viewing_requests
  for insert with check (
    exists (
      select 1 from public.properties p
      where p.id = viewing_requests.property_id and p.status = 'published'
    )
  );

-- Agents: read requests for their agency
create policy "Viewing requests: agents read own" on public.viewing_requests
  for select using (
    exists (
      select 1 from public.agency_members m
      where m.agency_id = viewing_requests.agency_id and m.user_id = auth.uid()
    )
  );

-- Agents: update status (confirm / decline / complete)
create policy "Viewing requests: agents update own" on public.viewing_requests
  for update using (
    exists (
      select 1 from public.agency_members m
      where m.agency_id = viewing_requests.agency_id and m.user_id = auth.uid()
    )
  );

-- Admins: full access
create policy "Viewing requests: admin full" on public.viewing_requests
  for all using (public.is_admin());


-- ── Extend property_vr with VR pipeline columns ───────────
-- MVP: agents submit embed URLs or raw footage.
-- VBYM ops team processes and updates submission_status.
-- Future: automated pipeline updates these columns directly.

-- is_enabled: the code uses this column name (migration 001 used is_active — harmonise here)
alter table public.property_vr
  add column if not exists is_enabled boolean not null default true;

-- VR submission pipeline fields
alter table public.property_vr
  add column if not exists submission_status text not null default 'not_submitted'
    check (submission_status in ('not_submitted', 'queued', 'processing', 'ready', 'rejected')),
  add column if not exists submission_notes text,   -- VBYM ops feedback / rejection reason
  add column if not exists raw_footage_path text,   -- storage path if agent uploaded raw footage
  add column if not exists submitted_at timestamptz; -- when agent submitted


-- ── Extend properties with missing columns ────────────────
-- These columns are defined in migration 001 but may not exist
-- on databases that ran an earlier version of the schema.
alter table public.properties
  add column if not exists listing_type text not null default 'sale'
    check (listing_type in ('sale', 'rent')),
  add column if not exists price_qualifier text,
  add column if not exists features text[] default '{}';

-- ── saved_searches: add alert fields ─────────────────────
-- Enables per-search alert toggle (email sending not yet active).
alter table public.saved_searches
  add column if not exists alert_enabled boolean not null default false,
  add column if not exists last_alerted_at timestamptz;
