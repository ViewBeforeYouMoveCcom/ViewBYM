-- Migration 006: Add coordinates to properties for map search
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS latitude  DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

CREATE INDEX IF NOT EXISTS idx_properties_coordinates
  ON public.properties (latitude, longitude)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
