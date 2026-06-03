-- Fix public agent request submissions.
-- The request-access form inserts into agent_applications before an admin approves it.

alter table public.agent_applications enable row level security;

grant insert on public.agent_applications to anon, authenticated;
grant select, update on public.agent_applications to authenticated;

drop policy if exists "Agent applications: public insert" on public.agent_applications;
create policy "Agent applications: public insert" on public.agent_applications
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Agent applications: admin full" on public.agent_applications;
create policy "Agent applications: admin full" on public.agent_applications
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
