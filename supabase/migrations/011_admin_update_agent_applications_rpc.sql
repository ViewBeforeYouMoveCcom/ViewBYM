-- Let the admin console update agent applications through checked RPCs.
-- Direct browser updates can be blocked by table RLS/grants.

create or replace function public.admin_set_agent_application_status(
  p_application_id uuid,
  p_status text,
  p_notes text default null
)
returns public.agent_applications
language plpgsql
security definer
set search_path = public
as $$
declare
  v_application public.agent_applications;
begin
  if not public.is_admin() then
    raise exception 'Unauthorized';
  end if;

  update public.agent_applications
  set status = p_status,
      notes = p_notes
  where id = p_application_id
  returning * into v_application;

  return v_application;
end;
$$;

create or replace function public.admin_set_agent_application_notes(
  p_application_id uuid,
  p_notes text
)
returns public.agent_applications
language plpgsql
security definer
set search_path = public
as $$
declare
  v_application public.agent_applications;
begin
  if not public.is_admin() then
    raise exception 'Unauthorized';
  end if;

  update public.agent_applications
  set notes = p_notes
  where id = p_application_id
  returning * into v_application;

  return v_application;
end;
$$;

grant execute on function public.admin_set_agent_application_status(uuid, text, text) to authenticated;
grant execute on function public.admin_set_agent_application_notes(uuid, text) to authenticated;
