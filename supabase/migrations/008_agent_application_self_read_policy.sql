-- Allow signed-in agents to read their own application status.
-- The agent portal uses this to route approved applicants into onboarding.

drop policy if exists "Agent applications: self read" on public.agent_applications;

create policy "Agent applications: self read" on public.agent_applications
  for select
  using (
    auth.role() = 'authenticated'
    and lower(business_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
