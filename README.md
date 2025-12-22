# Regatta Rift


     \
     - \
     |   \
     |---- \
     |  KOR  \
     |---------\
      \           \
       \-------------\
        \-------------\
         \_____________\     
         __________\____\_______
         \                 /
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Virtual sailing racing platform.

## Development

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

## Supabase Setup

Regatta Rift uses a multi-site Supabase project with a shared auth schema and
one schema per site. The current site is `site_cyber`; future sites are referred
to as `site1`, `site2`, and so on. Authentication is global across all sites,
but membership is per site—users must register separately for each domain to
gain access.

1. Copy `.env.example` to `.env` and fill in:

   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. Start the local stack:

   ```sh
   supabase start
   ```

3. Apply migrations in order:

   ```sh
   supabase migration up --env local --schema shared
   supabase migration up --env local --schema site_cyber
   # Add new sites sequentially, e.g.
   # supabase migration up --env local --schema site1
   ```

Edge functions live under `supabase/functions/`. See `supabase/README.md` for
details on directory structure and adding a new site.

## Technologies

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
