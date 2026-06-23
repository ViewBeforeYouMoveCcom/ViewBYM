-- Require buyers to be signed in before submitting property enquiries.

drop policy if exists "Enquiries: public insert" on public.enquiries;

create policy "Enquiries: authenticated users insert" on public.enquiries
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.properties p
      where p.id = enquiries.property_id
        and p.status = 'published'
    )
  );
