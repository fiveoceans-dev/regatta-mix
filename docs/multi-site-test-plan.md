# Multi-site Membership & RLS Test Plan

Run the migrations in order before executing tests:

```bash
supabase migration up migrations/shared
supabase migration up migrations/site_cyber
supabase migration up migrations/site1
supabase migration up migrations/site2
```

## SQL snippets

```sql
-- assume user1 is member of site_cyber
drop role if exists user1; create role user1 nologin;
set local role user1;
select public.user_in_site('site_cyber'); -- expect true
select public.user_in_site('site1'); -- expect false
select public.user_in_site('site2'); -- expect false
```

```sql
-- CRUD checks
drop role if exists member; create role member nologin;
set local role member;
set local jwt.claims.sub = '<user-uuid>';
set search_path = site_cyber;
insert into projects(name) values ('test');
select * from site1.projects; -- should be denied
select * from site2.projects; -- should be denied
```

## Node test using supabase-js

```ts
import { createSiteClient } from '@/integrations/supabase/supabaseSite';
const cyber = createSiteClient(url, key, 'cyber.sailing');
await cyber.from('projects').insert({ name: 'demo' });
const site1 = createSiteClient(url, key, 'site1.example');
await site1.from('projects').select('*'); // returns rows for site1 only
const site2 = createSiteClient(url, key, 'site2.example');
await site2.from('projects').select('*'); // returns rows for site2 only
```

## Storage

```
-- attempt cross-site read/write should fail
```

## RPC

```sql
select * from public.rpc_list_projects(); -- with host header set; unknown host should raise exception
```
