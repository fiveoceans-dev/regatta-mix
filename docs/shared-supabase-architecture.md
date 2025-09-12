# Shared Supabase Architecture Documentation

## Overview

This documentation covers the **shared public schema** used across all sites in the multi-site Supabase architecture. The public schema contains global tables for authentication, user profiles, and site management that are accessible to all websites.

## Public Schema Tables

### 1. `profiles` Table

**Purpose**: Central user profile storage shared across all sites

**Schema Definition**:
```sql
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname CHARACTER VARYING NOT NULL,
  email CHARACTER VARYING NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  rank user_rank DEFAULT 'novice'::user_rank,
  total_races INTEGER DEFAULT 0,
  karma INTEGER DEFAULT 100,
  credits INTEGER DEFAULT 1000,
  is_active BOOLEAN DEFAULT true,
  bio TEXT,
  country CHARACTER VARYING,
  timezone CHARACTER VARYING DEFAULT 'UTC',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Field Details**:
- `id`: References `auth.users.id` - Primary identifier
- `nickname`: Display name shown across all sites
- `email`: User's email address (synced from auth)
- `email_verified`: Email verification status
- `rank`: User skill level (novice, amateur, pro, expert)
- `total_races`: Aggregate race count across all sites
- `karma`: Community reputation score (0-1000)
- `credits`: Virtual currency balance usable across sites
- `is_active`: Account status flag
- `bio`: User biography/description
- `country`: User's country code or name
- `timezone`: User's timezone preference
- `avatar_url`: Profile picture URL
- `created_at/updated_at`: Audit timestamps

**RLS Policies**:
- **SELECT**: All authenticated users can view all profiles
- **INSERT**: Users can only create their own profile
- **UPDATE**: Users can only update their own profile
- **DELETE**: Not allowed

### 2. `sites` Table

**Purpose**: Registry of all websites in the multi-site system

**Schema Definition**:
```sql
CREATE TABLE public.sites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT NOT NULL UNIQUE,
  schema_name TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Field Details**:
- `id`: Unique site identifier
- `name`: Human-readable site name (e.g., \"Regatta Rift\")
- `domain`: Full domain name (e.g., \"regatta-rift.lovable.app\")
- `schema_name`: Database schema prefix (e.g., \"site_regatta\")
- `active`: Whether the site is currently operational
- `created_at/updated_at`: Audit timestamps

**RLS Policies**:
- **SELECT**: Anyone can view active sites
- **INSERT/UPDATE/DELETE**: Admin only (no public policies)

### 3. `site_members` Table

**Purpose**: Manages user access and roles for each site

**Schema Definition**:
```sql
CREATE TABLE public.site_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  site_id UUID REFERENCES public.sites(id),
  role TEXT DEFAULT 'member',
  active BOOLEAN DEFAULT true,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, site_id)
);
```

**Field Details**:
- `id`: Unique membership record identifier
- `user_id`: References the authenticated user
- `site_id`: References the site from `public.sites`
- `role`: User's role on this site ('member', 'admin', 'moderator')
- `active`: Whether this membership is currently active
- `joined_at`: When the user first joined this site

**RLS Policies**:
- **SELECT**: Users can view their own memberships
- **INSERT**: Users can create their own memberships
- **UPDATE/DELETE**: Not allowed via API

## Shared Database Functions

### 1. `user_in_site(site_schema text)`

**Purpose**: Check if authenticated user has access to a specific site

**Returns**: Boolean indicating site membership

**Usage**:
```sql
SELECT user_in_site('site_regatta'); -- Returns true/false
```

### 2. `user_role_in_site(site_schema text)`

**Purpose**: Get user's role in a specific site

**Returns**: Text role ('member', 'admin', 'moderator', 'none')

**Usage**:
```sql
SELECT user_role_in_site('site_regatta'); -- Returns user's role
```

### 3. `ensure_membership_for_domain()`

**Purpose**: Automatically create site membership when user visits a domain

**Usage**: Called automatically by authentication hooks

### 4. `handle_new_user()`

**Purpose**: Initialize new user across the system

**Actions**:
- Creates profile in `public.profiles`
- Creates default site membership
- Initializes site-specific user settings
- Awards welcome achievements

## Authentication Integration

### User Registration Flow

1. User signs up via Supabase Auth
2. `handle_new_user()` trigger fires
3. Profile created in `public.profiles`
4. Default site membership created
5. Site-specific initialization occurs

### Domain-Based Access

Users automatically gain access to sites based on domain:
- Authentication is global (shared `auth.users`)
- Site membership is created on first visit
- RLS policies enforce data isolation per site

## Client Integration

### Standard Public Schema Access

```typescript
import { supabase } from '@/integrations/supabase/client';

// Access shared tables
const { data: profiles } = await supabase.from('profiles').select('*');
const { data: sites } = await supabase.from('sites').select('*');
const { data: memberships } = await supabase.from('site_members').select('*');
```

### Site-Specific Schema Access

```typescript
// Access site-specific tables (automatically routed by domain)
const { data: regattas } = await supabase.site.regattas().select('*');
const { data: boats } = await supabase.site.boats().select('*');
```

## Adding New Sites

### Step-by-Step Integration

1. **Register the site**:
```sql
INSERT INTO public.sites (name, domain, schema_name) 
VALUES ('New Site', 'newsite.com', 'site_newsite');
```

2. **Create schema and tables**:
```sql
CREATE SCHEMA site_newsite;
-- Create site-specific tables in this schema
```

3. **Update client configuration**:
```typescript
// In supabase/client.ts
function getCurrentSchema(): string {
  const host = window.location.host;
  if (host === 'newsite.com') return 'site_newsite';
  // ... existing mappings
  return 'site_regatta'; // default
}
```

4. **Configure authentication**:
- Add domain to Supabase Auth allowed URLs
- Add OAuth redirect URLs for the domain

### Required Site-Specific Tables

Every new site should implement these core tables:
- `user_settings` - User preferences for this site
- Other tables specific to the site's functionality

## Security Best Practices

### Row Level Security (RLS)

All public tables have RLS enabled with appropriate policies:

```sql
-- Example policy structure
CREATE POLICY \"policy_name\" ON public.table_name
  FOR operation TO authenticated
  USING (condition) 
  WITH CHECK (condition);
```

### Data Isolation

- Users can only access their own data
- Site membership is verified for all operations
- Helper functions use `SECURITY DEFINER` for safe elevated access

### Authentication Requirements

- All operations require authenticated users
- Anonymous access limited to viewing active sites only
- Site-specific data requires valid site membership

## Maintenance Guidelines

### Regular Tasks

1. **Monitor site membership integrity**
2. **Clean up inactive memberships**
3. **Audit RLS policy effectiveness**
4. **Performance monitoring across schemas**

### Backup Considerations

- Public schema affects all sites - handle migrations carefully
- Test all sites after public schema changes
- Consider downtime coordination across sites

## Troubleshooting

### Common Issues

1. **User can't access site**: Check `site_members` table
2. **Authentication problems**: Verify domain in Auth settings
3. **RLS blocking data**: Review policy conditions
4. **Schema routing errors**: Check domain mapping in client

### Debug Queries

```sql
-- Check user's site memberships
SELECT s.name, s.domain, sm.role, sm.active 
FROM site_members sm 
JOIN sites s ON s.id = sm.site_id 
WHERE sm.user_id = auth.uid();

-- Verify site registration
SELECT * FROM sites WHERE active = true;

-- Check user profile
SELECT * FROM profiles WHERE id = auth.uid();
```
