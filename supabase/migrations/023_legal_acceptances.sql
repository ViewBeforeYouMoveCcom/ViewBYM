-- ============================================================
-- VBYM Migration 023: legal_acceptances table
-- Run this against your Supabase project SQL editor.
--
-- Records who accepted which legal document, at which version, and
-- when — evidence of acceptance for the Consumer Website Terms and
-- Agency Terms of Business (Docs 1 & 2). Written at consumer signup
-- and agent request-access; not backfilled for existing accounts,
-- since there's no record of what they actually saw or agreed to.
-- ============================================================

create table if not exists public.legal_acceptances (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  email text,
  document text not null
    check (document in ('consumer_terms', 'privacy_notice', 'agency_terms')),
  version text not null,
  accepted_at timestamptz not null default now()
);

create index if not exists legal_acceptances_user_id_idx on public.legal_acceptances(user_id);
create index if not exists legal_acceptances_email_idx on public.legal_acceptances(email);

alter table public.legal_acceptances enable row level security;

-- Anyone can record an acceptance (signup and pre-account agent applications)
create policy "Legal acceptances: public insert" on public.legal_acceptances
  for insert with check (true);

-- Users can read their own acceptance records
create policy "Legal acceptances: self read" on public.legal_acceptances
  for select using (auth.uid() = user_id);

-- Admins can read all acceptance records
create policy "Legal acceptances: admin read" on public.legal_acceptances
  for select using (public.is_admin());
