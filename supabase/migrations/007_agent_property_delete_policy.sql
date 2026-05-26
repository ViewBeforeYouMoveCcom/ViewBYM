-- Migration 007: Allow agents to delete listings owned by their agency.

create policy "Properties: agents delete own"
  on public.properties
  for delete
  using (
    exists (
      select 1
      from public.agency_members
      where agency_id = properties.agency_id
        and user_id = auth.uid()
    )
  );
