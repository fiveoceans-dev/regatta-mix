# Supabase

This directory holds the multi-site Supabase project used by SailingNet.
It assumes a shared auth schema and one schema per site. Users authenticate
once but gain access to a site only after registering for that domain, which
creates a membership row in the shared `site_members` table.

## Layout
- `config.toml` – project configuration.
- `functions/` – edge functions. Shared helpers live in `functions/_shared/`.
- `migrations/`
  - `shared/` – global tables, membership helpers, and RLS policies.
  - `site_cyber/` – schema and tables for the current site.
  - `site1/`, `site2/`, ... – placeholder folders for additional sites.

## Adding a new site
1. Create `migrations/<site_id>/` with SQL files for the new schema.
2. Insert the new domain and schema into `public.sites` via the shared migration.
3. Run migrations sequentially:
   ```sh
   supabase migration up --schema shared
   supabase migration up --schema site_cyber
   supabase migration up --schema <site_id>
   ```
4. Deploy edge functions as needed:
   ```sh
   npx supabase functions deploy <function-name>
   ```
