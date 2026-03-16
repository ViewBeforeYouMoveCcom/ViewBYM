-- ============================================================
-- VBYM MVP Schema Migration
-- Run this against your Supabase project SQL editor.
-- ============================================================

-- ── Helper: updated_at trigger ────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── is_admin() helper used by admin portal RLS ────────────
-- Add a row to admin_users to grant access.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

create or replace function public.is_admin()
returns boolean language plpgsql security definer as $$
begin
  return exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
end;
$$;

-- ── agencies ────────────────────────────────────────────
create table if not exists public.agencies (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  website text,
  phone text,
  email text,
  status text not null default 'pending'
    check (status in ('pending', 'in_review', 'approved', 'rejected', 'suspended')),
  internal_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger agencies_updated_at
  before update on public.agencies
  for each row execute function set_updated_at();

-- ── agency_members ───────────────────────────────────────
create table if not exists public.agency_members (
  id uuid default gen_random_uuid() primary key,
  agency_id uuid not null references public.agencies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'member')),
  created_at timestamptz default now(),
  unique(agency_id, user_id)
);

-- ── properties ───────────────────────────────────────────
create table if not exists public.properties (
  id uuid default gen_random_uuid() primary key,
  agency_id uuid not null references public.agencies(id) on delete cascade,
  title text,
  address text not null,
  city text,
  postcode text,

  -- Price
  price_pence bigint,
  price_display text,
  price_qualifier text,

  -- Property details
  bedrooms integer,
  bathrooms integer,
  area_sqft integer,
  property_type text not null default 'apartment',
  listing_type text not null default 'sale' check (listing_type in ('sale', 'rent')),
  tenure text,
  description text,
  features text[] default '{}',

  -- Market/portal display status (shown to buyers)
  market_status text not null default 'New'
    check (market_status in ('New', 'Under offer', 'Sold STC', 'Let agreed')),

  -- Workflow status (draft → published → archived)
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),

  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger properties_updated_at
  before update on public.properties
  for each row execute function set_updated_at();

-- Auto-set published_at when status changes to published
create or replace function set_published_at()
returns trigger language plpgsql as $$
begin
  if new.status = 'published' and old.status != 'published' then
    new.published_at = now();
  end if;
  return new;
end;
$$;

create trigger properties_set_published_at
  before update on public.properties
  for each row execute function set_published_at();

-- ── property_media ───────────────────────────────────────
-- Stores photos, floorplans, documents for a property.
-- Files live in the 'property-media' Supabase storage bucket.
create table if not exists public.property_media (
  id uuid default gen_random_uuid() primary key,
  property_id uuid not null references public.properties(id) on delete cascade,
  type text not null check (type in ('photo', 'floorplan', 'document')),
  storage_path text not null,
  public_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz default now()
);

-- ── property_vr ──────────────────────────────────────────
-- Stores VR tour source for a property.
-- MVP: agent supplies an embed URL from Matterport/Kuula/Custom.
--
-- TODO (Future VR Pipeline): Add fields:
--   processing_status text  — 'pending' | 'processing' | 'ready' | 'failed'
--   vbym_hosted_url text    — VBYM-hosted controlled delivery URL
--   delivery_signed boolean — whether signed URL delivery is used
--   access_tier text        — 'public' | 'buyer_only' | 'verified_buyer'
--   content_hash text       — integrity check for uploaded content
-- These will plug into the controlled VR distribution system.
create table if not exists public.property_vr (
  id uuid default gen_random_uuid() primary key,
  property_id uuid not null references public.properties(id) on delete cascade,
  provider text,  -- 'matterport' | 'kuula' | 'custom'
  embed_url text, -- share/embed URL from the VR provider
  iframe_html text, -- optional raw iframe HTML (fallback)
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(property_id)  -- one VR record per property for now
);

create trigger property_vr_updated_at
  before update on public.property_vr
  for each row execute function set_updated_at();

-- ── enquiries ────────────────────────────────────────────
create table if not exists public.enquiries (
  id uuid default gen_random_uuid() primary key,
  property_id uuid not null references public.properties(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  message text not null,
  is_handled boolean not null default false,
  created_at timestamptz default now()
);

-- ── saved_properties ─────────────────────────────────────
create table if not exists public.saved_properties (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, property_id)
);

-- ── saved_searches ───────────────────────────────────────
-- Stores buyer-saved search filter criteria.
-- TODO (Alerts): Add alert_enabled boolean + last_alerted_at to support
--   future email alert pipeline without schema changes.
create table if not exists public.saved_searches (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  label text,   -- optional user-friendly name
  filters jsonb not null default '{}',  -- stored filter criteria
  -- TODO: alert_enabled boolean default false,
  -- TODO: last_alerted_at timestamptz,
  created_at timestamptz default now()
);


-- ================================================================
-- ROW LEVEL SECURITY POLICIES
-- ================================================================

alter table public.admin_users enable row level security;
alter table public.agencies enable row level security;
alter table public.agency_members enable row level security;
alter table public.properties enable row level security;
alter table public.property_media enable row level security;
alter table public.property_vr enable row level security;
alter table public.enquiries enable row level security;
alter table public.saved_properties enable row level security;
alter table public.saved_searches enable row level security;

-- admin_users: admins can read; only superuser inserts (managed manually)
create policy "Admin users readable by admins" on public.admin_users
  for select using (public.is_admin());

-- ── agencies ──────────────────────────────────────────────
-- Public: read all (needed for browse page agent info)
create policy "Agencies: public read" on public.agencies
  for select using (true);

-- Agents: update their own agency
create policy "Agencies: members can update own" on public.agencies
  for update using (
    exists (
      select 1 from public.agency_members
      where agency_id = agencies.id and user_id = auth.uid()
    )
  );

-- Insert: authenticated users can create agencies (onboarding)
create policy "Agencies: auth users can create" on public.agencies
  for insert with check (auth.uid() is not null);

-- Admins: full access
create policy "Agencies: admin full access" on public.agencies
  for all using (public.is_admin());

-- ── agency_members ────────────────────────────────────────
create policy "Agency members: read own" on public.agency_members
  for select using (user_id = auth.uid() or public.is_admin());

create policy "Agency members: insert own" on public.agency_members
  for insert with check (user_id = auth.uid());

create policy "Agency members: admin full" on public.agency_members
  for all using (public.is_admin());

-- ── properties ────────────────────────────────────────────
-- Buyers: read published only
create policy "Properties: public read published" on public.properties
  for select using (status = 'published');

-- Agents: read all in their agency (including draft)
create policy "Properties: agents read own agency" on public.properties
  for select using (
    exists (
      select 1 from public.agency_members
      where agency_id = properties.agency_id and user_id = auth.uid()
    )
  );

-- Agents: insert into their agency
create policy "Properties: agents insert" on public.properties
  for insert with check (
    exists (
      select 1 from public.agency_members
      where agency_id = properties.agency_id and user_id = auth.uid()
    )
  );

-- Agents: update their agency's properties
create policy "Properties: agents update own" on public.properties
  for update using (
    exists (
      select 1 from public.agency_members
      where agency_id = properties.agency_id and user_id = auth.uid()
    )
  );

-- Admins: full access
create policy "Properties: admin full" on public.properties
  for all using (public.is_admin());

-- ── property_media ────────────────────────────────────────
-- Public: read media for published properties
create policy "Property media: public read" on public.property_media
  for select using (
    exists (
      select 1 from public.properties p
      where p.id = property_media.property_id and p.status = 'published'
    )
  );

-- Agents: read their property media (draft too)
create policy "Property media: agents read own" on public.property_media
  for select using (
    exists (
      select 1 from public.properties p
      join public.agency_members m on m.agency_id = p.agency_id
      where p.id = property_media.property_id and m.user_id = auth.uid()
    )
  );

-- Agents: insert/update/delete their property media
create policy "Property media: agents manage" on public.property_media
  for all using (
    exists (
      select 1 from public.properties p
      join public.agency_members m on m.agency_id = p.agency_id
      where p.id = property_media.property_id and m.user_id = auth.uid()
    )
  );

-- ── property_vr ───────────────────────────────────────────
create policy "Property VR: public read" on public.property_vr
  for select using (
    exists (
      select 1 from public.properties p
      where p.id = property_vr.property_id and p.status = 'published'
    )
  );

create policy "Property VR: agents read own" on public.property_vr
  for select using (
    exists (
      select 1 from public.properties p
      join public.agency_members m on m.agency_id = p.agency_id
      where p.id = property_vr.property_id and m.user_id = auth.uid()
    )
  );

create policy "Property VR: agents manage" on public.property_vr
  for all using (
    exists (
      select 1 from public.properties p
      join public.agency_members m on m.agency_id = p.agency_id
      where p.id = property_vr.property_id and m.user_id = auth.uid()
    )
  );

-- ── enquiries ─────────────────────────────────────────────
-- Anyone (incl. anonymous) can submit an enquiry for a published property
create policy "Enquiries: public insert" on public.enquiries
  for insert with check (
    exists (
      select 1 from public.properties p
      where p.id = enquiries.property_id and p.status = 'published'
    )
  );

-- Agents: read enquiries for their agency's properties
create policy "Enquiries: agents read own" on public.enquiries
  for select using (
    exists (
      select 1 from public.properties p
      join public.agency_members m on m.agency_id = p.agency_id
      where p.id = enquiries.property_id and m.user_id = auth.uid()
    )
  );

-- Agents: update (mark handled) their enquiries
create policy "Enquiries: agents update own" on public.enquiries
  for update using (
    exists (
      select 1 from public.properties p
      join public.agency_members m on m.agency_id = p.agency_id
      where p.id = enquiries.property_id and m.user_id = auth.uid()
    )
  );

-- Admins: full access
create policy "Enquiries: admin full" on public.enquiries
  for all using (public.is_admin());

-- ── saved_properties ──────────────────────────────────────
create policy "Saved properties: users manage own" on public.saved_properties
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ── saved_searches ────────────────────────────────────────
create policy "Saved searches: users manage own" on public.saved_searches
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid());


-- ================================================================
-- STORAGE BUCKETS
-- ================================================================
-- Run in Supabase Storage tab or via the Supabase dashboard:
--
-- 1. Create bucket: property-media
--    - Public: true (so public_url works for displaying images)
--    - File size limit: 10 MB
--    - Allowed MIME types: image/jpeg, image/png, image/webp, image/gif,
--                          application/pdf
--
-- Storage RLS (add in Supabase dashboard → Storage → Policies):
--
-- SELECT policy on property-media bucket:
--   (bucket_id = 'property-media')  -- public reads since bucket is public
--
-- INSERT policy on property-media bucket:
--   auth.uid() is not null  -- any authenticated user can upload
--   (agent-level restrictions are enforced at the app layer)
--
-- DELETE policy on property-media bucket:
--   auth.uid() is not null  -- agents delete via app layer with ownership checks
-- ================================================================
