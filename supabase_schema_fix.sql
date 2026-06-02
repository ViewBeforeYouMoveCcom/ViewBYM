-- Fix agency_members table and policies

-- Create agency_members table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.agency_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(agency_id, user_id)
);

-- Enable RLS
ALTER TABLE public.agency_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own agency memberships" ON public.agency_members;
DROP POLICY IF EXISTS "Service role can manage all agency members" ON public.agency_members;
DROP POLICY IF EXISTS "Users can insert agency members" ON public.agency_members;

-- Policy: Users can view their own memberships
CREATE POLICY "Users can view their own agency memberships"
ON public.agency_members
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Service role full access (for admin operations)
CREATE POLICY "Service role can manage all agency members"
ON public.agency_members
FOR ALL
USING (auth.jwt()->>'role' = 'service_role');

-- Policy: Users can insert (for onboarding fallback)
CREATE POLICY "Users can insert agency members"
ON public.agency_members
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create or replace trigger function
CREATE OR REPLACE FUNCTION public.add_creator_as_agency_owner()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.agency_members (agency_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'owner')
  ON CONFLICT (agency_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any
DROP TRIGGER IF EXISTS on_agency_created ON public.agencies;

-- Create trigger
CREATE TRIGGER on_agency_created
AFTER INSERT ON public.agencies
FOR EACH ROW
EXECUTE FUNCTION public.add_creator_as_agency_owner();

-- Grant permissions
GRANT SELECT ON public.agency_members TO anon, authenticated;
GRANT INSERT ON public.agency_members TO authenticated;
GRANT ALL ON public.agency_members TO service_role;
