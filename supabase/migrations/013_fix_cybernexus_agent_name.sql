-- Correct the stored display data for cybernexusesteam@gmail.com.
-- This removes the need for frontend hard-coded name overrides.

do $$
declare
  v_user_id uuid;
begin
  select id
    into v_user_id
  from auth.users
  where lower(email) = 'cybernexusesteam@gmail.com'
  limit 1;

  if v_user_id is null then
    raise notice 'No auth user found for cybernexusesteam@gmail.com';
    return;
  end if;

  update auth.users
  set raw_user_meta_data =
    coalesce(raw_user_meta_data, '{}'::jsonb) ||
    jsonb_build_object(
      'full_name', 'Mohammad Khan',
      'name', 'Mohammad Khan',
      'display_name', 'Mohammad Khan'
    )
  where id = v_user_id;

  insert into public.profiles (id, full_name)
  values (v_user_id, 'Mohammad Khan')
  on conflict (id) do update
    set full_name = excluded.full_name;

  update public.agencies as a
  set name = 'Mohammad Khan',
      email = coalesce(nullif(a.email, ''), 'cybernexusesteam@gmail.com'),
      updated_at = now()
  where exists (
    select 1
    from public.agency_members as m
    where m.agency_id = a.id
      and m.user_id = v_user_id
  );

  update public.agent_applications
  set contact_name = 'Mohammad Khan',
      agency_name = case
        when lower(agency_name) in ('hassan''s', 'hassans', 'kabeer')
          then 'Mohammad Khan'
        else agency_name
      end,
      updated_at = now()
  where lower(business_email) = 'cybernexusesteam@gmail.com';
end $$;
