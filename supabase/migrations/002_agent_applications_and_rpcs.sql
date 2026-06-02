-- ============================================================
-- VBYM Migration 002 — agent_applications table + admin RPCs
-- Run after 001_mvp_schema.sql
-- ============================================================

-- ── agent_applications ───────────────────────────────────
-- Pre-registration interest form submitted by prospective agents.
-- Separate from the agencies table: this is the intake/vetting step.
create table if not exists public.agent_applications (
  id uuid default gen_random_uuid() primary key,
  agency_name text not null,
  branch_location text,
  contact_name text not null,
  contact_role text,
  business_email text not null,
  phone text,
  website text,
  status text not null default 'new'
    check (status in ('new', 'in_review', 'approved', 'rejected')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger agent_applications_updated_at
  before update on public.agent_applications
  for each row execute function set_updated_at();

alter table public.agent_applications enable row level security;

-- Anyone can submit an application (public intake form)
create policy "Agent applications: public insert" on public.agent_applications
  for insert with check (true);

-- Only admins can read and update applications
create policy "Agent applications: admin full" on public.agent_applications
  for all using (public.is_admin());


-- ── admin_approve_agency RPC ──────────────────────────────
-- Called by admin console when approving an agency.
-- Sets status to 'approved' and returns a simple confirmation token
-- (in a future phase, this can generate an actual onboarding invite token).
create or replace function public.admin_approve_agency(p_agency_id uuid)
returns text
language plpgsql
security definer
as $$
declare
  v_token text;
begin
  -- Only admins can call this
  if not public.is_admin() then
    raise exception 'Unauthorized';
  end if;

  update public.agencies as a
  set status = 'approved', updated_at = now()
  where a.id = p_agency_id;

  -- Generate a simple token for the admin to share with the agent
  -- TODO: In a future phase, this should create a proper invite record
  --       and send an email with a magic link for onboarding.
  v_token := 'vbym_' || replace(gen_random_uuid()::text, '-', '');

  return v_token;
end;
$$;


-- ── admin_suspend_agency RPC ──────────────────────────────
create or replace function public.admin_suspend_agency(p_agency_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  if not public.is_admin() then
    raise exception 'Unauthorized';
  end if;

  update public.agencies
  set status = 'suspended', updated_at = now()
  where id = p_agency_id;
end;
$$;


-- ── admin_reinstate_agency RPC ────────────────────────────
create or replace function public.admin_reinstate_agency(p_agency_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  if not public.is_admin() then
    raise exception 'Unauthorized';
  end if;

  update public.agencies
  set status = 'approved', updated_at = now()
  where id = p_agency_id;
end;
$$;


-- ── admin_reject_agency RPC ───────────────────────────────
create or replace function public.admin_reject_agency(p_agency_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  if not public.is_admin() then
    raise exception 'Unauthorized';
  end if;

  update public.agencies
  set status = 'rejected', updated_at = now()
  where id = p_agency_id;
end;
$$;


-- ── admin_update_application_status RPC ──────────────────
create or replace function public.admin_update_application_status(
  p_application_id uuid,
  p_status text,
  p_notes text default null
)
returns void
language plpgsql
security definer
as $$
begin
  if not public.is_admin() then
    raise exception 'Unauthorized';
  end if;

  update public.agent_applications
  set status = p_status,
      notes = coalesce(p_notes, notes),
      updated_at = now()
  where id = p_application_id;
end;
$$;
