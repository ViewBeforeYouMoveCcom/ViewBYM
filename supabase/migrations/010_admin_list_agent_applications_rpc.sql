-- Let the admin console list agent applications through a checked RPC.
-- This avoids browser-side table RLS hiding rows from valid admins.

create or replace function public.admin_list_agent_applications()
returns setof public.agent_applications
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Unauthorized';
  end if;

  return query
    select *
    from public.agent_applications
    order by created_at desc;
end;
$$;

grant execute on function public.admin_list_agent_applications() to authenticated;
