-- Migration 005: Platform-hosted VR
-- Adds video_path column to store VR storage object key (not a public URL).
-- VR files are stored in a SEPARATE private bucket called "property-vr".
-- property-media stays PUBLIC (photos, walkthrough videos, floor plans all use public URLs).
-- Signed URLs for VR are generated server-side on demand via /api/vr/[propertyId].

ALTER TABLE public.property_vr
  ADD COLUMN IF NOT EXISTS video_path text;

-- Backfill: extract path from existing video_url values if present.
-- Old format stored full URL; new format stores just the object key.
UPDATE public.property_vr
SET video_path = substring(video_url FROM 'property-vr/(.+)$')
WHERE video_url IS NOT NULL
  AND video_path IS NULL;

-- Comment on embed_url and iframe_html to mark as deprecated (not dropped to avoid data loss).
COMMENT ON COLUMN public.property_vr.embed_url   IS 'DEPRECATED — use video_path + signed URL pipeline';
COMMENT ON COLUMN public.property_vr.iframe_html IS 'DEPRECATED — use video_path + signed URL pipeline';

-- IMPORTANT: In Supabase dashboard → Storage, create TWO buckets:
--
--   1. "property-media"  → PUBLIC  (photos, walkthrough videos, floor plans)
--      - Public bucket, getPublicUrl() works fine for these.
--
--   2. "property-vr"     → PRIVATE (processed 360° VR files only)
--      - Private bucket, no public URL.
--      - All access via /api/vr/[propertyId] which generates a 2-hour signed URL.
--
--   The existing "vr-footage" bucket (raw agent uploads) can remain private too.
