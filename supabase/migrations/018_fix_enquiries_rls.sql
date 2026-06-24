-- Fix RLS policy to allow service role to insert enquiries with user_id

-- Drop existing policies
DROP POLICY IF EXISTS "Enquiries: authenticated users insert" ON public.enquiries;
DROP POLICY IF EXISTS "Enquiries: buyers read own" ON public.enquiries;

-- Allow authenticated users to insert their own enquiries
CREATE POLICY "Enquiries: users insert own" ON public.enquiries
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow service role to insert (for API route)
CREATE POLICY "Enquiries: service role insert" ON public.enquiries
  FOR INSERT 
  TO service_role
  WITH CHECK (true);

-- Allow buyers to read their own enquiries
CREATE POLICY "Enquiries: users read own" ON public.enquiries
  FOR SELECT 
  USING (auth.uid() = user_id);
