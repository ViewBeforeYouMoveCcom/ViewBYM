-- Let signed-in agents check their own latest application status by account email.

create or replace function public.agent_my_application_status()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
  v_status text;
begin
  v_email := lower(coalesce(auth.jwt() ->> 'email', ''));

  if auth.uid() is null or v_email = '' then
    return null;
  end if;

  select status
    into v_status
  from public.agent_applications
  where lower(business_email) = v_email
  order by created_at desc
  limit 1;

  return v_status;
end;
$$;

grant execute on function public.agent_my_application_status() to authenticated;
