-- ============================================================
-- VBYM Migration 022: Add room_title and caption to property_media
-- Run this against your Supabase project SQL editor.
--
-- Lets agents label each photo with the room it shows (e.g. "Kitchen",
-- "Master bedroom") and an optional caption. The public photo gallery
-- groups photos by room_title once it's populated; existing rows are
-- unaffected (both columns are nullable, no backfill required).
-- ============================================================

alter table public.property_media
  add column if not exists room_title text,
  add column if not exists caption text;
