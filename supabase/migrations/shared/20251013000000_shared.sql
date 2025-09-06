-- Shared multi-site setup migration
-- Global directory and helpers

-- Create sites table
create table if not exists public.sites (
    id uuid primary key default gen_random_uuid(),
    schema_name text unique not null,
    domain text unique not null,
    name text,
    created_at timestamptz default now()
);

-- Roles for site members
create type if not exists public.site_role as enum ('owner','admin','member','viewer');

-- Site members table
create table if not exists public.site_members (
    site_id uuid references public.sites(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade,
    role public.site_role default 'member',
    primary key (site_id, user_id)
);
create index if not exists site_members_user_id_idx on public.site_members(user_id);
create index if not exists site_members_site_id_idx on public.site_members(site_id);

-- Helper to check membership
create or replace function public.user_in_site(schema_name text)
returns boolean language sql stable as $$
  select exists (
    select 1
    from public.sites s
    join public.site_members m on m.site_id = s.id
    where s.schema_name = user_in_site.schema_name
      and m.user_id = auth.uid()
  );
$$;

-- Helper to fetch role in schema
create or replace function public.user_role_in_schema(schema_name text)
returns text language sql stable as $$
  select m.role::text
  from public.sites s
  join public.site_members m on m.site_id = s.id
  where s.schema_name = user_role_in_schema.schema_name
    and m.user_id = auth.uid()
  limit 1;
$$;

-- Seed sites
insert into public.sites (schema_name, domain, name)
values
  ('site_cyber','cyber.sailing','cybersailing')
on conflict (schema_name) do nothing;

-- Procedure to initialize a site schema
create or replace procedure public.init_site_schema(target_schema text)
language plpgsql as $$
begin
  execute format('create table if not exists %I.projects (
      id uuid primary key default gen_random_uuid(),
      name text not null,
      created_at timestamptz default now()
  );', target_schema);

  execute format('create table if not exists %I.articles (
      id uuid primary key default gen_random_uuid(),
      title text not null,
      body text,
      status text check (status in (''draft'',''published'')) default ''draft'',
      author_id uuid,
      published_at timestamptz
  );', target_schema);

  execute format('create table if not exists %I.settings (
      key text primary key,
      value jsonb not null,
      updated_at timestamptz default now()
  );', target_schema);

  -- enable RLS
  execute format('alter table %I.projects enable row level security;', target_schema);
  execute format('alter table %I.articles enable row level security;', target_schema);
  execute format('alter table %I.settings enable row level security;', target_schema);

  -- indexes
  execute format('create index if not exists %I_projects_name_idx on %I.projects(name);', target_schema, target_schema);
  execute format('create index if not exists %I_articles_status_pub_idx on %I.articles(status, published_at);', target_schema, target_schema);

  -- policies for projects
  execute format('create policy if not exists "viewer-select" on %I.projects for select using (public.user_role_in_schema(current_schema()) in (''viewer'',''member'',''admin'',''owner''));', target_schema);
  execute format('create policy if not exists "member-insert" on %I.projects for insert with check (public.user_role_in_schema(current_schema()) in (''member'',''admin'',''owner''));', target_schema);
  execute format('create policy if not exists "admin-update" on %I.projects for update using (public.user_role_in_schema(current_schema()) in (''admin'',''owner'')) with check (public.user_role_in_schema(current_schema()) in (''admin'',''owner''));', target_schema);
  execute format('create policy if not exists "owner-delete" on %I.projects for delete using (public.user_role_in_schema(current_schema()) = ''owner'');', target_schema);

  -- policies for articles
  execute format('create policy if not exists "viewer-select" on %I.articles for select using (public.user_role_in_schema(current_schema()) in (''viewer'',''member'',''admin'',''owner''));', target_schema);
  execute format('create policy if not exists "member-insert" on %I.articles for insert with check (public.user_role_in_schema(current_schema()) in (''member'',''admin'',''owner''));', target_schema);
  execute format('create policy if not exists "admin-update" on %I.articles for update using (public.user_role_in_schema(current_schema()) in (''admin'',''owner'')) with check (public.user_role_in_schema(current_schema()) in (''admin'',''owner''));', target_schema);
  execute format('create policy if not exists "owner-delete" on %I.articles for delete using (public.user_role_in_schema(current_schema()) = ''owner'');', target_schema);

  -- policies for settings
  execute format('create policy if not exists "viewer-select" on %I.settings for select using (public.user_role_in_schema(current_schema()) in (''viewer'',''member'',''admin'',''owner''));', target_schema);
  execute format('create policy if not exists "admin-upsert" on %I.settings for all using (public.user_role_in_schema(current_schema()) in (''admin'',''owner'')) with check (public.user_role_in_schema(current_schema()) in (''admin'',''owner''));', target_schema);
end;
$$;

-- Enable storage RLS
alter table if exists storage.objects enable row level security;

-- Variant A: bucket-per-site
-- create policy "site bucket read" on storage.objects for select using (public.user_in_site(bucket_id));
-- create policy "site bucket write" on storage.objects for insert with check (public.user_in_site(bucket_id));
-- create policy "site bucket update" on storage.objects for update using (public.user_in_site(bucket_id));
-- create policy "site bucket delete" on storage.objects for delete using (public.user_in_site(bucket_id));

-- Variant B: folder-per-site
-- create policy "site folder read" on storage.objects for select using (public.user_in_site(split_part(name,'/' ,1)));
-- create policy "site folder write" on storage.objects for insert with check (public.user_in_site(split_part(name,'/' ,1)));
-- create policy "site folder update" on storage.objects for update using (public.user_in_site(split_part(name,'/' ,1)));
-- create policy "site folder delete" on storage.objects for delete using (public.user_in_site(split_part(name,'/' ,1)));

-- PostgREST helper to resolve schema from host
create or replace function public.schema_from_host()
returns text language plpgsql stable security definer as $$
declare
  host text := current_setting('request.header.host', true);
  result text;
begin
  select schema_name into result from public.sites where domain = host;
  if result is null then
    raise exception 'unknown domain %', host;
  end if;
  return result;
end;
$$;

-- Ensure membership for current domain
create or replace function public.ensure_membership_for_domain()
returns void language plpgsql security definer as $$
declare
  host text := current_setting('request.header.host', true);
  site_rec record;
begin
  select id into site_rec from public.sites where domain = host;
  if site_rec.id is null then
    raise exception 'unknown domain %', host;
  end if;
  insert into public.site_members(site_id, user_id, role)
  values (site_rec.id, auth.uid(), 'member')
  on conflict (site_id, user_id) do nothing;
end;
$$;

-- Optional table for per-site email uniqueness
create table if not exists public.site_identities (
  user_id uuid references auth.users(id) on delete cascade,
  site_id uuid references public.sites(id) on delete cascade,
  email text not null,
  unique(site_id, email)
);
