-- ============================================================
-- VBYM Migration 020: Track agency approval timestamp
-- Run this against your Supabase project SQL editor.
--
-- Adds approved_at so the agent dashboard can show the
-- "Approved Founding Member" welcome banner only for the first
-- 3 days after approval, instead of forever.
-- ============================================================

alter table public.agencies
  add column if not exists approved_at timestamptz;

-- Stamp approved_at whenever status transitions to 'approved'
-- (covers both admin-approving a pending agency and invite
-- signups that insert the row already approved).
create or replace function public.set_agency_approved_at()
returns trigger language plpgsql as $$
begin
  if new.status = 'approved' and (old is null or old.status is distinct from 'approved') then
    new.approved_at = now();
  end if;
  return new;
end;
$$;

drop trigger if exists agencies_set_approved_at_insert on public.agencies;
create trigger agencies_set_approved_at_insert
  before insert on public.agencies
  for each row execute function public.set_agency_approved_at();

drop trigger if exists agencies_set_approved_at_update on public.agencies;
create trigger agencies_set_approved_at_update
  before update on public.agencies
  for each row execute function public.set_agency_approved_at();

-- Backfill existing approved agencies (best available proxy: updated_at).
update public.agencies
set approved_at = updated_at
where status = 'approved' and approved_at is null;
