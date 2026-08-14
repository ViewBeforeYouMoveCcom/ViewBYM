-- ============================================================
-- VBYM Migration 021: Add "commercial" as a listing_type value
-- Run this against your Supabase project SQL editor.
--
-- The Add/Edit Listing forms now offer "Commercial" alongside
-- "For sale" / "To let" in the Listing type dropdown. The
-- properties.listing_type column previously only allowed
-- ('sale', 'rent') via a CHECK constraint (see migrations 001
-- and 003) — this widens it to also allow 'commercial'.
-- ============================================================

-- Drop whatever check constraint currently guards listing_type
-- (named automatically by Postgres, so look it up rather than
-- assuming a fixed name).
do $$
declare
  con record;
begin
  for con in
    select conname
    from pg_constraint
    where conrelid = 'public.properties'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%listing_type%'
  loop
    execute format('alter table public.properties drop constraint %I', con.conname);
  end loop;
end $$;

alter table public.properties
  add constraint properties_listing_type_check
  check (listing_type in ('sale', 'rent', 'commercial'));

