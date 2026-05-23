-- ============================================================
-- VBYM Seed: Showcase Agency + 9 Properties
-- Run this in your Supabase SQL editor.
-- Safe to run multiple times (uses INSERT ... ON CONFLICT DO NOTHING).
-- ============================================================

-- ── 1. Add missing columns (idempotent) ─────────────────────
alter table public.properties
  add column if not exists featured boolean not null default false,
  add column if not exists area_sqft integer;

alter table public.agencies
  add column if not exists plan text not null default 'free'
    check (plan in ('free', 'paid'));

-- ── 2. Showcase agency ───────────────────────────────────────
insert into public.agencies (id, name, website, phone, email, status, plan)
values (
  '00000000-0000-0000-0000-000000000001',
  'VBYM Showcase',
  'https://vbym.co.uk',
  '020 7946 0000',
  'showcase@vbym.co.uk',
  'approved',
  'paid'
)
on conflict (id) do update set
  name    = excluded.name,
  status  = excluded.status,
  plan    = excluded.plan;

-- ── 3. Properties ────────────────────────────────────────────

-- 3a. Knightsbridge Penthouse
insert into public.properties (
  id, agency_id, title, address_line1, city, postcode,
  price, bedrooms, bathrooms, area_sqft, property_type,
  listing_type, tenure, description, features, market_status, featured, status
) values (
  '00000000-0000-0000-0000-000000000101',
  '00000000-0000-0000-0000-000000000001',
  'Knightsbridge Penthouse',
  '14 Beauchamp Place',
  'London',
  'SW3 1NQ',
  4250000,
  4, 3, 3200,
  'penthouse',
  'sale',
  'Leasehold',
  'A spectacular four-bedroom penthouse in the heart of Knightsbridge. Floor-to-ceiling windows frame breathtaking views of the London skyline. The principal suite features a walk-in wardrobe and a marble en-suite bathroom. A private roof terrace completes this extraordinary residence.',
  ARRAY['Private roof terrace','Panoramic London views','Marble bathrooms','Concierge service','Underground parking','24-hour security'],
  'available',
  true,
  'published'
) on conflict (id) do nothing;

-- 3b. Chelsea Family Home
insert into public.properties (
  id, agency_id, title, address_line1, city, postcode,
  price, bedrooms, bathrooms, area_sqft, property_type,
  listing_type, tenure, description, features, market_status, featured, status
) values (
  '00000000-0000-0000-0000-000000000102',
  '00000000-0000-0000-0000-000000000001',
  'Chelsea Family Home',
  '6 Radnor Walk',
  'London',
  'SW3 4BP',
  2850000,
  5, 4, 2800,
  'terraced',
  'sale',
  'Freehold',
  'An exceptional five-bedroom Victorian terraced house situated on one of Chelsea''s most desirable streets. Beautifully refurbished throughout, retaining original period features whilst incorporating the finest contemporary finishes. South-facing garden, double-height kitchen extension.',
  ARRAY['South-facing garden','Original period features','Double-height kitchen','Principal suite with dressing room','Off-street parking','Recently refurbished'],
  'available',
  true,
  'published'
) on conflict (id) do nothing;

-- 3c. Notting Hill Mews
insert into public.properties (
  id, agency_id, title, address_line1, city, postcode,
  price, bedrooms, bathrooms, area_sqft, property_type,
  listing_type, tenure, description, features, market_status, featured, status
) values (
  '00000000-0000-0000-0000-000000000103',
  '00000000-0000-0000-0000-000000000001',
  'Notting Hill Mews House',
  '3 Elgin Mews',
  'London',
  'W11 2RX',
  1650000,
  3, 2, 1450,
  'mews',
  'sale',
  'Freehold',
  'A beautifully converted three-bedroom mews house tucked away in a quiet cobbled street moments from Portobello Road. The open-plan ground floor flows out to a sun-drenched courtyard. The master bedroom occupies the entire first floor with vaulted ceilings and exposed brickwork.',
  ARRAY['Private courtyard','Vaulted ceilings','Exposed brick','Quiet mews location','Recently converted','Moments from Portobello Road'],
  'available',
  true,
  'published'
) on conflict (id) do nothing;

-- 3d. Shoreditch Warehouse Apartment
insert into public.properties (
  id, agency_id, title, address_line1, city, postcode,
  price, bedrooms, bathrooms, area_sqft, property_type,
  listing_type, tenure, description, features, market_status, featured, status
) values (
  '00000000-0000-0000-0000-000000000104',
  '00000000-0000-0000-0000-000000000001',
  'Shoreditch Warehouse Apartment',
  '45 Curtain Road',
  'London',
  'EC2A 3PT',
  875000,
  2, 2, 1100,
  'apartment',
  'sale',
  'Leasehold',
  'A stunning two-bedroom warehouse conversion in the heart of Shoreditch. Exposed steel beams, polished concrete floors, and 14-foot ceilings create an extraordinary sense of space. The open-plan living area features floor-to-ceiling factory windows flooding the space with natural light.',
  ARRAY['Exposed steel beams','14-foot ceilings','Factory windows','Polished concrete floors','Bike storage','Private balcony'],
  'available',
  false,
  'published'
) on conflict (id) do nothing;

-- 3e. Brighton Seafront Flat
insert into public.properties (
  id, agency_id, title, address_line1, city, postcode,
  price, bedrooms, bathrooms, area_sqft, property_type,
  listing_type, tenure, description, features, market_status, featured, status
) values (
  '00000000-0000-0000-0000-000000000105',
  '00000000-0000-0000-0000-000000000001',
  'Brighton Seafront Apartment',
  '22 Marine Parade',
  'Brighton',
  'BN2 1TL',
  650000,
  2, 1, 850,
  'apartment',
  'sale',
  'Leasehold',
  'A spectacular two-bedroom seafront apartment with uninterrupted views across the English Channel. The open-plan living and dining area opens onto a generous balcony perfectly positioned to catch the sea breeze. Fully refurbished to a high specification with Silestone worktops and underfloor heating throughout.',
  ARRAY['Sea views','Private balcony','Underfloor heating','Silestone worktops','Lift access','Moments from The Lanes'],
  'available',
  false,
  'published'
) on conflict (id) do nothing;

-- 3f. Manchester City Centre Loft
insert into public.properties (
  id, agency_id, title, address_line1, city, postcode,
  price, bedrooms, bathrooms, area_sqft, property_type,
  listing_type, tenure, description, features, market_status, featured, status
) values (
  '00000000-0000-0000-0000-000000000106',
  '00000000-0000-0000-0000-000000000001',
  'Manchester City Centre Loft',
  '12 Princess Street',
  'Manchester',
  'M2 4NZ',
  425000,
  2, 2, 950,
  'apartment',
  'sale',
  'Leasehold',
  'A dramatic double-height loft apartment set within a converted Victorian warehouse in Manchester''s creative quarter. The mezzanine bedroom overlooks the generous living space below. Floor-to-ceiling windows, exposed brickwork, and a designer kitchen make this a truly unique home.',
  ARRAY['Double-height ceilings','Mezzanine bedroom','Exposed Victorian brickwork','Designer kitchen','Rooftop terrace access','City centre location'],
  'available',
  false,
  'published'
) on conflict (id) do nothing;

-- 3g. Edinburgh New Town Flat (To Let)
insert into public.properties (
  id, agency_id, title, address_line1, city, postcode,
  price, bedrooms, bathrooms, area_sqft, property_type,
  listing_type, tenure, description, features, market_status, featured, status
) values (
  '00000000-0000-0000-0000-000000000107',
  '00000000-0000-0000-0000-000000000001',
  'Edinburgh New Town Flat',
  '8 Heriot Row',
  'Edinburgh',
  'EH3 6HR',
  3200,
  3, 2, 1400,
  'flat',
  'rent',
  NULL,
  'A magnificent three-bedroom Georgian flat on one of Edinburgh''s most prestigious New Town addresses. The flat sits on the first floor of a Category A listed building and retains spectacular original features including ornate cornicing, shuttered sash windows, and a working fireplace.',
  ARRAY['Category A listed building','Original cornicing','Working fireplace','Sash windows','Private garden access','Moments from Stockbridge'],
  'available',
  false,
  'published'
) on conflict (id) do nothing;

-- 3h. Bristol Clifton Victorian Villa
insert into public.properties (
  id, agency_id, title, address_line1, city, postcode,
  price, bedrooms, bathrooms, area_sqft, property_type,
  listing_type, tenure, description, features, market_status, featured, status
) values (
  '00000000-0000-0000-0000-000000000108',
  '00000000-0000-0000-0000-000000000001',
  'Clifton Victorian Villa',
  '19 Pembroke Road',
  'Bristol',
  'BS8 3BB',
  1250000,
  5, 3, 2600,
  'detached',
  'sale',
  'Freehold',
  'A substantial five-bedroom Victorian detached villa in Bristol''s most sought-after suburb. Extensively renovated to an exacting standard, combining original architectural grandeur with a bold contemporary interior. The rear garden extends to over 100ft and enjoys a sunny south-easterly aspect.',
  ARRAY['100ft south-facing garden','Original Victorian features','Contemporary renovation','Double garage','Clifton Village location','Five en-suite bedrooms'],
  'available',
  false,
  'published'
) on conflict (id) do nothing;

-- 3i. Leeds Riverside Apartment (To Let)
insert into public.properties (
  id, agency_id, title, address_line1, city, postcode,
  price, bedrooms, bathrooms, area_sqft, property_type,
  listing_type, tenure, description, features, market_status, featured, status
) values (
  '00000000-0000-0000-0000-000000000109',
  '00000000-0000-0000-0000-000000000001',
  'Leeds Riverside Apartment',
  '5 Wharf Approach',
  'Leeds',
  'LS1 4GL',
  1450,
  1, 1, 580,
  'apartment',
  'rent',
  NULL,
  'A stylish one-bedroom apartment on Leeds'' vibrant South Bank, overlooking the River Aire. High specification throughout with Smeg appliances, rainfall shower, and engineered oak flooring. Steps from the Royal Armouries and Leeds Dock''s restaurants, bars, and cycling routes.',
  ARRAY['River views','Smeg appliances','Engineered oak flooring','Rainfall shower','Secure entry','Cycle storage'],
  'available',
  false,
  'published'
) on conflict (id) do nothing;

-- ── 4. Property media (cover images) ────────────────────────

insert into public.property_media (property_id, public_url, sort_order)
values
  ('00000000-0000-0000-0000-000000000101', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80&auto=format&fit=crop', 0),
  ('00000000-0000-0000-0000-000000000101', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80&auto=format&fit=crop', 1),
  ('00000000-0000-0000-0000-000000000102', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80&auto=format&fit=crop', 0),
  ('00000000-0000-0000-0000-000000000102', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80&auto=format&fit=crop', 1),
  ('00000000-0000-0000-0000-000000000103', 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=900&q=80&auto=format&fit=crop', 0),
  ('00000000-0000-0000-0000-000000000103', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80&auto=format&fit=crop', 1),
  ('00000000-0000-0000-0000-000000000104', 'https://images.unsplash.com/photo-1505873242700-f289a29e1724?w=900&q=80&auto=format&fit=crop', 0),
  ('00000000-0000-0000-0000-000000000104', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=80&auto=format&fit=crop', 1),
  ('00000000-0000-0000-0000-000000000105', 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=900&q=80&auto=format&fit=crop', 0),
  ('00000000-0000-0000-0000-000000000105', 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=900&q=80&auto=format&fit=crop', 1),
  ('00000000-0000-0000-0000-000000000106', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80&auto=format&fit=crop', 0),
  ('00000000-0000-0000-0000-000000000106', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80&auto=format&fit=crop', 1),
  ('00000000-0000-0000-0000-000000000107', 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=900&q=80&auto=format&fit=crop', 0),
  ('00000000-0000-0000-0000-000000000107', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80&auto=format&fit=crop', 1),
  ('00000000-0000-0000-0000-000000000108', 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=900&q=80&auto=format&fit=crop', 0),
  ('00000000-0000-0000-0000-000000000108', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80&auto=format&fit=crop', 1),
  ('00000000-0000-0000-0000-000000000109', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=80&auto=format&fit=crop', 0),
  ('00000000-0000-0000-0000-000000000109', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=80&auto=format&fit=crop', 1)
on conflict do nothing;
