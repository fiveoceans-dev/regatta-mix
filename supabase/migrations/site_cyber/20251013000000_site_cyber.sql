-- Schema setup for site_cyber and migration of existing data
create schema if not exists site_cyber;
call public.init_site_schema('site_cyber');
drop procedure if exists public.init_site_schema;

-- Migrate existing enums and tables to site_cyber schema
create or replace procedure public.move_existing_to_site_cyber()
language plpgsql as $$
begin
  -- move enums
  perform 1;
  begin execute 'alter type public.crew_role set schema site_cyber'; exception when undefined_object then null; end;
  begin execute 'alter type public.crew_status set schema site_cyber'; exception when undefined_object then null; end;
  begin execute 'alter type public.boat_class set schema site_cyber'; exception when undefined_object then null; end;
  begin execute 'alter type public.boat_condition set schema site_cyber'; exception when undefined_object then null; end;
  begin execute 'alter type public.part_category set schema site_cyber'; exception when undefined_object then null; end;
  begin execute 'alter type public.regatta_status set schema site_cyber'; exception when undefined_object then null; end;
  begin execute 'alter type public.protest_status set schema site_cyber'; exception when undefined_object then null; end;
  begin execute 'alter type public.weather_condition set schema site_cyber'; exception when undefined_object then null; end;
  begin execute 'alter type public.race_status set schema site_cyber'; exception when undefined_object then null; end;
  begin execute 'alter type public.user_rank set schema site_cyber'; exception when undefined_object then null; end;

  -- move tables
  begin execute 'alter table public.profiles set schema site_cyber'; exception when undefined_table then null; end;
  begin execute 'alter table public.user_settings set schema site_cyber'; exception when undefined_table then null; end;
  begin execute 'alter table public.crew set schema site_cyber'; exception when undefined_table then null; end;
  begin execute 'alter table public.boats set schema site_cyber'; exception when undefined_table then null; end;
  begin execute 'alter table public.parts set schema site_cyber'; exception when undefined_table then null; end;
  begin execute 'alter table public.regattas set schema site_cyber'; exception when undefined_table then null; end;
  begin execute 'alter table public.regatta_registrations set schema site_cyber'; exception when undefined_table then null; end;
  begin execute 'alter table public.races set schema site_cyber'; exception when undefined_table then null; end;
  begin execute 'alter table public.race_results set schema site_cyber'; exception when undefined_table then null; end;
  begin execute 'alter table public.protests set schema site_cyber'; exception when undefined_table then null; end;
  begin execute 'alter table public.transactions set schema site_cyber'; exception when undefined_table then null; end;
  begin execute 'alter table public.achievements set schema site_cyber'; exception when undefined_table then null; end;
end;
$$;

call public.move_existing_to_site_cyber();
drop procedure if exists public.move_existing_to_site_cyber;

-- Update user registration function to new schema
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into site_cyber.profiles (id, nickname, email, email_verified)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nickname', 'Player' || substr(new.id::text,1,8)),
    new.email,
    new.email_confirmed_at is not null
  );

  insert into site_cyber.user_settings (user_id)
  values (new.id);

  insert into site_cyber.achievements (user_id, title, description, category, points)
  values (new.id, 'Welcome Aboard', 'Welcome to the sailing world!', 'registration', 10);

  return new;
end;
$$;

create or replace function public.update_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Recreate triggers pointing to new schema tables
create trigger if not exists update_profiles_updated_at
  before update on site_cyber.profiles
  for each row execute function public.update_updated_at_column();

create trigger if not exists update_user_settings_updated_at
  before update on site_cyber.user_settings
  for each row execute function public.update_updated_at_column();

-- membership trigger for regatta player count
create or replace function site_cyber.update_regatta_player_count()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    update site_cyber.regattas set current_players = current_players + 1 where id = new.regatta_id;
    return new;
  elsif tg_op = 'DELETE' then
    update site_cyber.regattas set current_players = current_players - 1 where id = old.regatta_id;
    return old;
  end if;
  return null;
end;
$$;

create trigger if not exists update_regatta_player_count_trigger
  after insert or delete on site_cyber.regatta_registrations
  for each row execute function site_cyber.update_regatta_player_count();

-- Auth trigger
create or replace function public.rpc_list_projects()
returns setof site_cyber.projects
language plpgsql security definer as $$
declare
  target_schema text := public.schema_from_host();
  query text;
begin
  query := format('select * from %I.projects', target_schema);
  return query execute query;
end;
$$;
comment on function public.rpc_list_projects is 'returns rows from <schema>.projects based on Host header';

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
