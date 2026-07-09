-- ============================================================
-- VBYM Migration 019: Backfill missing profile name/email
-- Run this against your Supabase project SQL editor.
--
-- Root cause of admin panel showing "No name" for invited agents:
-- handle_new_user() only inserted `id` into public.profiles, ignoring
-- the full_name (and email) already available at signup time. This
-- backfills existing rows and hardens the trigger so future signups
-- (invite, direct, OAuth) populate full_name/email.
-- ============================================================

-- Harden the trigger to copy full_name/email from signup data.
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'display_name'
    )
  )
  on conflict (id) do update
    set email = coalesce(public.profiles.email, excluded.email),
        full_name = coalesce(public.profiles.full_name, excluded.full_name);
  return new;
end;
$$;

-- Backfill existing profiles that are missing a name/email.
update public.profiles as p
set full_name = coalesce(p.full_name, nullif(btrim(coalesce(
      u.raw_user_meta_data->>'full_name',
      u.raw_user_meta_data->>'name',
      u.raw_user_meta_data->>'display_name'
    )), '')),
    email = coalesce(p.email, u.email)
from auth.users as u
where p.id = u.id
  and (
    p.full_name is null or btrim(p.full_name) = ''
    or p.email is null or btrim(p.email) = ''
  );
