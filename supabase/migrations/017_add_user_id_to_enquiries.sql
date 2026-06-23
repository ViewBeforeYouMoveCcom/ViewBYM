-- Add user_id to enquiries table to track which buyer submitted each enquiry
-- This enables authenticated-only enquiries and allows buyers to view their own enquiries

-- Add user_id column (nullable at first for existing rows)
ALTER TABLE public.enquiries 
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_enquiries_user_id ON public.enquiries(user_id);

-- Update the RLS policy to require authentication and auto-set user_id
DROP POLICY IF EXISTS "Enquiries: authenticated users insert" ON public.enquiries;

CREATE POLICY "Enquiries: authenticated users insert" ON public.enquiries
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    -- Must be logged in
    auth.uid() = user_id
    AND
    -- Property must be published
    EXISTS (
      SELECT 1 FROM public.properties p
      WHERE p.id = enquiries.property_id AND p.status = 'published'
    )
  );

-- Allow buyers to read their own enquiries
CREATE POLICY "Enquiries: buyers read own" ON public.enquiries
  FOR SELECT 
  USING (user_id = auth.uid());

-- Existing agent policies remain unchanged (they can read enquiries for their properties)
