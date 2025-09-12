# Shared Supabase Multi-Site Architecture

## Overview

This documentation covers the complete **multi-site authentication and authorization system** built on Supabase. The architecture supports multiple independent sites sharing a single Supabase instance while maintaining data isolation and site-specific features.

### Key Features
- **Single Authentication System**: Users authenticate once and can access multiple sites
- **Data Isolation**: Each site's data is isolated through RLS policies and schema separation
- **Automatic Site Membership**: Users are automatically enrolled when visiting new sites
- **Site-Specific Profiles**: Extended user data stored per site while maintaining shared identity
- **Domain-Based Routing**: Site identification through domain mapping

### Architecture Principles
- All authentication data remains in the shared `public` schema
- Site-specific business data can use separate schemas or prefixed tables
- RLS policies enforce data isolation at the database level
- Functions handle cross-site logic and membership management

## Site Naming Conventions

When creating new sites, follow these naming patterns to ensure consistency and maintainability:

### Schema Names
- **Format**: `site_[sitename]` (e.g., `site_regatta`, `site_analytics`, `site_marketplace`)
- **Rules**: 
  - Use lowercase with underscores for multi-word names
  - Keep names short but descriptive
  - No hyphens or special characters

### Site-Specific Profile Tables
- **Format**: `site_[sitename]_profiles` (e.g., `site_regatta_profiles`, `site_analytics_profiles`)
- **Required Fields**:
  - `id` (UUID, primary key)
  - `user_id` (UUID, foreign key to `auth.users(id)`)
  - `site_id` (UUID, foreign key to `public.sites(id)`)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)
- **Required Constraints**:
  - `UNIQUE(user_id, site_id)` - One profile per user per site
  - Foreign key constraints with `ON DELETE CASCADE`

### Table Naming in Site Schemas
- Use plural nouns (e.g., `regattas`, `races`, `transactions`)
- Use snake_case for multi-word names
- Prefix with purpose when needed (e.g., `regatta_registrations`, `race_results`)

### Function Naming
- **Format**: `[action]_[entity]_for_[context]` (e.g., `get_user_regatta_profile`, `update_user_credits`)
- **Prefixes**: `get`, `create`, `update`, `delete`, `ensure`, `migrate`
- Include site context when site-specific

### Domain Registration
Registered sites in the system:
- `regatta-rift.lovable.app` → `site_regatta`
- `web3analytics.lovable.app` → `site_web3analytics` 
- `openair.lovable.app` → `site_openair`
- `allyoucompany.com` → `site_allyou`
- `buena` → `site_buena`
- `morph.` → `site_morph`

## Multi-Domain Authentication Setup

### 1. Supabase Dashboard Configuration

#### Authentication URLs
In Supabase dashboard → **Authentication** → **URL Configuration**:

1. **Site URL**: Add each domain that will use authentication
   ```
   https://regatta-rift.lovable.app
   https://web3analytics.lovable.app
   https://openair.lovable.app
   https://allyoucompany.com
   ```

2. **Redirect URLs**: Include all callback URLs for each domain
   ```
   https://regatta-rift.lovable.app/auth/callback
   https://web3analytics.lovable.app/auth/callback
   https://openair.lovable.app/auth/callback
   https://allyoucompany.com/auth/callback
   ```

#### OAuth Provider Configuration
For each OAuth provider (Google, GitHub, etc.), register callback URLs:

**Example for Google OAuth**:
- Authorized redirect URIs in Google Console:
  ```
  https://amhlmmzmbjcxzpynnirx.supabase.co/auth/v1/callback
  https://regatta-rift.lovable.app/auth/v1/callback
  https://web3analytics.lovable.app/auth/v1/callback
  ```

**Example for GitHub OAuth**:
- Authorization callback URLs in GitHub App:
  ```
  https://amhlmmzmbjcxzpynnirx.supabase.co/auth/v1/callback
  https://regatta-rift.lovable.app/auth/v1/callback
  https://web3analytics.lovable.app/auth/v1/callback
  ```

### 2. Session Management

#### Cross-Domain Considerations
- **Session Isolation**: Sessions are isolated per origin (domain)
- **SSO Experience**: Users sign in separately on each domain but use same credentials
- **Cookie Scope**: Auth cookies are domain-specific for security
- **Shared Identity**: `auth.users` table is global across all sites

#### Client Implementation
```typescript
// src/integrations/supabase/supabaseSite.ts
import { createSiteClient } from '@/integrations/supabase/supabaseSite';

const supabase = createSiteClient(
  SUPABASE_URL, 
  SUPABASE_ANON_KEY,
  window.location.host // Automatically determines site schema
);
```

### 3. Email Templates and Branding

#### Single Template Challenge
Supabase uses one set of email templates for all sites. For site-specific branding:

1. **Custom Landing Page**: Direct magic links to a branded page
2. **URL Parameters**: Include site identifier in confirmation URLs
3. **Dynamic Styling**: Style confirmation pages based on `host` header

Example confirmation URL structure:
```
https://[site-domain]/auth/confirm?token=...&site=[site_id]
```

## Public Schema Tables

### 1. `profiles` Table

**Purpose**: Central user profile storage

**Schema Definition**:
```sql
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname CHARACTER VARYING NOT NULL,
  email CHARACTER VARYING NOT NULL,
  email_verified BOOLEAN DEFAULT false,
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
- `nickname`: Display name shown across applications  
- `email`: User's email address (synced from auth)
- `email_verified`: Email verification status
- `is_active`: Account status flag
- `bio`: User biography/description
- `country`: User's country code or name
- `timezone`: User's timezone preference
- `avatar_url`: Profile picture URL
- `created_at/updated_at`: Audit timestamps

**Note**: Site-specific data such as user skills, game statistics, virtual currency, etc. should be stored in site-specific tables or schemas, not in the shared profiles table.

**RLS Policies**:
- **SELECT**: All authenticated users can view all profiles
- **INSERT**: Users can only create their own profile
- **UPDATE**: Users can only update their own profile
- **DELETE**: Not allowed

### 2. `sites` Table

**Purpose**: Registry of websites using this authentication system

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
- `name`: Human-readable site name (e.g., "Regatta Rift")
- `domain`: Full domain name (e.g., "regatta-rift.lovable.app")
- `schema_name`: Database schema identifier (for multi-tenant setups)
- `active`: Whether the site is currently operational
- `created_at/updated_at`: Audit timestamps

**RLS Policies**:
- **SELECT**: Anyone can view active sites
- **INSERT/UPDATE/DELETE**: Admin only (no public policies)

### 3. `site_members` Table

**Purpose**: Manages user access for different sites

**Schema Definition**:
```sql
CREATE TABLE public.site_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
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
- `role`: User's role ('member', 'admin', 'moderator')
- `active`: Whether this membership is currently active
- `joined_at`: When the user first joined this site

**RLS Policies**:
- **SELECT**: Users can view their own memberships
- **INSERT**: Users can create their own memberships
- **UPDATE/DELETE**: Not allowed via API

## Database Functions

### 1. `user_in_site(site_schema text)`

**Purpose**: Check if authenticated user has access to a specific site

**Returns**: Boolean indicating site membership

**Implementation**:
```sql
CREATE OR REPLACE FUNCTION public.user_in_site(site_schema text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.site_members sm
        JOIN public.sites s ON s.id = sm.site_id
        WHERE s.schema_name = site_schema 
        AND sm.user_id = auth.uid()
        AND sm.active = true
        AND s.active = true
    );
END;
$$;
```

**Usage**:
```sql
SELECT user_in_site('site_regatta'); -- Returns true/false
```

### 2. `user_role_in_site(site_schema text)`

**Purpose**: Get user's role in a specific site

**Returns**: Text role ('member', 'admin', 'moderator', 'none')

**Implementation**:
```sql
CREATE OR REPLACE FUNCTION public.user_role_in_site(site_schema text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    user_role text;
BEGIN
    SELECT sm.role INTO user_role
    FROM public.site_members sm
    JOIN public.sites s ON s.id = sm.site_id
    WHERE s.schema_name = site_schema 
    AND sm.user_id = auth.uid()
    AND sm.active = true
    AND s.active = true;
    
    RETURN COALESCE(user_role, 'none');
END;
$$;
```

### 3. `ensure_membership_for_domain()`

**Purpose**: Automatically create site membership and initialize site-specific profiles when user visits a domain

**Implementation**:
```sql
CREATE OR REPLACE FUNCTION public.ensure_membership_for_domain()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    current_host text;
    site_record record;
BEGIN
    -- Get current host from request headers
    current_host := current_setting('request.headers', true)::json->>'host';
    
    -- Find the site for this domain
    SELECT * INTO site_record FROM public.sites WHERE domain = current_host AND active = true;
    
    -- If site exists and user is authenticated, ensure membership
    IF site_record.id IS NOT NULL AND auth.uid() IS NOT NULL THEN
        -- Create site membership
        INSERT INTO public.site_members (site_id, user_id, role)
        VALUES (site_record.id, auth.uid(), 'member')
        ON CONFLICT (site_id, user_id) DO NOTHING;
        
        -- Create regatta profile for regatta sites
        IF site_record.schema_name = 'site_regatta' THEN
            INSERT INTO public.site_regatta_profiles (user_id, site_id)
            VALUES (auth.uid(), site_record.id)
            ON CONFLICT (user_id, site_id) DO NOTHING;
        END IF;
    END IF;
END;
$$;
```

### 4. `get_current_site_id()`

**Purpose**: Get the current site ID based on request headers

**Returns**: UUID of the current site

**Implementation**:
```sql
CREATE OR REPLACE FUNCTION public.get_current_site_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    current_host text;
    site_id uuid;
BEGIN
    -- Get current host from request headers
    current_host := current_setting('request.headers', true)::json->>'host';
    
    -- Find the site for this domain
    SELECT id INTO site_id FROM public.sites WHERE domain = current_host AND active = true;
    
    -- Default to regatta site if not found
    IF site_id IS NULL THEN
        SELECT id INTO site_id FROM public.sites WHERE schema_name = 'site_regatta';
    END IF;
    
    RETURN site_id;
END;
$$;
```

### 5. `update_user_credits(credit_change integer)`

**Purpose**: Update user's credits in their site-specific profile

**Parameters**: 
- `credit_change`: Amount to add (positive) or subtract (negative)

**Implementation**:
```sql
CREATE OR REPLACE FUNCTION public.update_user_credits(credit_change integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    current_site_id uuid;
BEGIN
    current_site_id := public.get_current_site_id();
    
    UPDATE public.site_regatta_profiles 
    SET credits = GREATEST(0, credits + credit_change),
        updated_at = now()
    WHERE user_id = auth.uid() 
    AND site_id = current_site_id;
END;
$$;
```

### 6. `migrate_existing_users_to_regatta_profiles()`

**Purpose**: Migrate existing users to site-specific profiles (used during schema updates)

**Implementation**:
```sql
CREATE OR REPLACE FUNCTION public.migrate_existing_users_to_regatta_profiles()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    regatta_site_id uuid;
BEGIN
    -- Get the regatta site ID
    SELECT id INTO regatta_site_id FROM public.sites WHERE schema_name = 'site_regatta';
    
    -- Create regatta profiles for all existing users who don't have one
    INSERT INTO public.site_regatta_profiles (user_id, site_id, rank, total_races, karma, credits)
    SELECT 
        p.id,
        regatta_site_id,
        'novice',
        0,
        0,
        1000
    FROM public.profiles p
    WHERE NOT EXISTS (
        SELECT 1 FROM public.site_regatta_profiles srp 
        WHERE srp.user_id = p.id AND srp.site_id = regatta_site_id
    );
END;
$$;
```

### 7. `handle_new_user()`

**Purpose**: Initialize new user in the system

**Implementation**:
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Insert into profiles
    INSERT INTO public.profiles (id, nickname, email, email_verified)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'nickname', 'Player' || substr(NEW.id::text, 1, 8)),
        NEW.email,
        NEW.email_confirmed_at IS NOT NULL
    );
    
    RETURN NEW;
END;
$$;
```

## Site-Specific Profile Extensions

For sites that need to store additional user-specific data beyond the basic `profiles` table, create site-specific profile extension tables in the shared `public` schema:

### Example: Regatta-Specific User Data

```sql
-- Create site-specific profile table (example: site_regatta_profiles)
CREATE TABLE public.site_regatta_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  rank TEXT DEFAULT 'novice',
  total_races INTEGER DEFAULT 0,
  karma INTEGER DEFAULT 0,
  credits INTEGER DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure one profile per user per site
  UNIQUE(user_id, site_id)
);

-- Enable RLS and create policies
ALTER TABLE public.site_regatta_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own site profiles" 
ON public.site_regatta_profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own site profiles" 
ON public.site_regatta_profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own site profiles" 
ON public.site_regatta_profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Helper function to get user's site-specific profile
CREATE OR REPLACE FUNCTION public.get_user_regatta_profile(site_schema text)
RETURNS TABLE (
  id uuid,
  rank text,
  total_races integer,
  karma integer,
  credits integer,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
) 
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
      srp.id,
      srp.rank,
      srp.total_races,
      srp.karma,
      srp.credits,
      srp.created_at,
      srp.updated_at
    FROM public.site_regatta_profiles srp
    JOIN public.sites s ON s.id = srp.site_id
    WHERE s.schema_name = site_schema 
    AND srp.user_id = auth.uid();
END;
$function$;

-- Helper function to initialize site profile for a user
CREATE OR REPLACE FUNCTION public.initialize_regatta_profile_for_site(target_site_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    profile_id uuid;
BEGIN
    INSERT INTO public.site_regatta_profiles (user_id, site_id)
    VALUES (auth.uid(), target_site_id)
    ON CONFLICT (user_id, site_id) DO NOTHING
    RETURNING id INTO profile_id;
    
    RETURN profile_id;
END;
$$;

-- Update ensure_membership_for_domain to initialize site profiles
CREATE OR REPLACE FUNCTION public.ensure_membership_for_domain()
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path TO 'public'
AS $function$
DECLARE
    current_host text;
    site_record record;
BEGIN
    current_host := current_setting('request.headers', true)::json->>'host';
    SELECT * INTO site_record FROM public.sites WHERE domain = current_host AND active = true;
    
    IF site_record.id IS NOT NULL AND auth.uid() IS NOT NULL THEN
        -- Create site membership
        INSERT INTO public.site_members (site_id, user_id, role)
        VALUES (site_record.id, auth.uid(), 'member')
        ON CONFLICT (site_id, user_id) DO NOTHING;
        
        -- Create regatta profile for regatta sites
        IF site_record.schema_name = 'site_regatta' THEN
            INSERT INTO public.site_regatta_profiles (user_id, site_id)
            VALUES (auth.uid(), site_record.id)
            ON CONFLICT (user_id, site_id) DO NOTHING;
        END IF;
        
        -- Add similar blocks for other site types:
        -- IF site_record.schema_name = 'site_marketplace' THEN
        --     INSERT INTO public.site_marketplace_profiles (user_id, site_id)
        --     VALUES (auth.uid(), site_record.id)
        --     ON CONFLICT (user_id, site_id) DO NOTHING;
        -- END IF;
    END IF;
END;
$function$;
```

## Client Integration

### 1. Site-Aware Supabase Client

The `createSiteClient` function automatically handles site-specific database operations:

```typescript
// src/integrations/supabase/supabaseSite.ts
import { createSiteClient } from '@/integrations/supabase/supabaseSite';

// Initialize client with automatic schema detection
const supabase = createSiteClient(
  process.env.SUPABASE_URL!, 
  process.env.SUPABASE_ANON_KEY!
);

// Automatically queries site_regatta.regattas on regatta domain
const { data: regattas } = await supabase.from('regattas').select('*');

// Access public schema tables explicitly when needed
const { data: profiles } = await supabase.publicFrom('profiles').select('*');
```

### 2. Site-Specific Profile Hook

Use the `useRegattaProfile` hook for accessing site-specific user data:

```typescript
// src/hooks/useRegattaProfile.tsx
import { useRegattaProfile } from '@/hooks/useRegattaProfile';

function UserDashboard() {
  const { profile, loading, error, updateCredits } = useRegattaProfile();
  
  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h1>Welcome, {profile?.rank} sailor!</h1>
      <p>Credits: {profile?.credits}</p>
      <p>Total Races: {profile?.total_races}</p>
      <button onClick={() => updateCredits(100)}>
        Add 100 Credits
      </button>
    </div>
  );
}
```

### 3. Authentication Integration

Ensure users are properly enrolled when they visit a site:

```typescript
// Call this after successful authentication
import { supabase } from '@/integrations/supabase/client';

const ensureUserMembership = async () => {
  const { error } = await supabase.rpc('ensure_membership_for_domain');
  if (error) console.error('Failed to ensure membership:', error);
};
```

## Testing Multi-Site Setup

### SQL Testing Scripts

**Test Site Membership**:
```sql
-- Test user membership in different sites
SELECT public.user_in_site('site_regatta'); -- Should return true for regatta users
SELECT public.user_in_site('site_analytics'); -- Should return false for regatta-only users
```

**Test Role Assignment**:
```sql
-- Check user roles across sites
SELECT public.user_role_in_site('site_regatta'); -- Returns 'member', 'admin', or 'none'
```

**Test Data Isolation**:
```sql
-- Verify RLS policies prevent cross-site data access
SET search_path = site_regatta;
SELECT * FROM regattas; -- Should only show regatta site data

SET search_path = site_analytics; 
SELECT * FROM dashboards; -- Should only show analytics site data
```

### Client Testing

**Test Site-Specific Queries**:
```typescript
// Test automatic schema routing
const regattaClient = createSiteClient(url, key, 'regatta-rift.lovable.app');
const analyticsClient = createSiteClient(url, key, 'web3analytics.lovable.app');

// These should access different data sets
const regattaData = await regattaClient.from('regattas').select('*');
const analyticsData = await analyticsClient.from('dashboards').select('*');
```

**Test Profile System**:
```typescript
// Verify site-specific profiles are created and isolated
const { data: regattaProfile } = await supabase.rpc('get_user_regatta_profile', { 
  site_schema: 'site_regatta' 
});

const { data: analyticsProfile } = await supabase.rpc('get_user_analytics_profile', { 
  site_schema: 'site_analytics' 
});
```

## Implementation Checklist

### New Site Setup
1. **Register Domain**: Add entry to `public.sites` table
2. **Update Host Map**: Add domain mapping in `supabaseSite.ts`
3. **Create Site Schema**: If using separate schemas for business data
4. **Site Profile Table**: Create `site_[name]_profiles` table if needed
5. **Update Functions**: Modify `ensure_membership_for_domain` for new site type
6. **Authentication URLs**: Add domain to Supabase dashboard
7. **OAuth Callbacks**: Register callback URLs with providers
8. **Test Integration**: Verify authentication and data isolation

### Site Profile Table Template
```sql
-- Template for creating new site profile tables
CREATE TABLE public.site_[SITENAME]_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  
  -- Site-specific fields here
  [custom_field1] TEXT,
  [custom_field2] INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, site_id)
);

-- Enable RLS
ALTER TABLE public.site_[SITENAME]_profiles ENABLE ROW LEVEL SECURITY;

-- Standard RLS policies
CREATE POLICY "Users can view their own site profiles" 
ON public.site_[SITENAME]_profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own site profiles" 
ON public.site_[SITENAME]_profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own site profiles" 
ON public.site_[SITENAME]_profiles FOR UPDATE 
USING (auth.uid() = user_id);
```

## Security Considerations

### Data Isolation
- **RLS Enforcement**: All site-specific tables must have RLS enabled
- **Function Security**: Use `SECURITY DEFINER` for admin functions
- **Schema Separation**: Consider separate schemas for sensitive business logic
- **Cross-Site Prevention**: Verify policies prevent unauthorized data access

### Authentication Security  
- **Domain Validation**: Ensure only registered domains can access the system
- **Session Management**: Implement proper session timeout and rotation
- **OAuth Security**: Validate all OAuth provider configurations
- **CSRF Protection**: Implement CSRF tokens for state-changing operations

## Troubleshooting

### Common Issues

1. **User Not Found in Site**: 
   - Check if `ensure_membership_for_domain()` was called
   - Verify site is registered in `public.sites`
   - Confirm domain mapping in `HOST_MAP`

2. **Data Access Denied**:
   - Verify RLS policies are correctly configured  
   - Check user authentication status
   - Confirm site membership exists

3. **OAuth Callback Errors**:
   - Verify callback URLs in provider settings
   - Check Supabase URL configuration
   - Confirm domain is added to allowed URLs

4. **Cross-Site Data Leakage**:
   - Review RLS policies on all tables
   - Test with different user accounts
   - Verify schema-specific queries work correctly

### Debug Commands

```sql
-- Check current user and site context
SELECT auth.uid(), current_setting('request.headers', true)::json->>'host';

-- Verify site memberships
SELECT sm.*, s.name, s.domain 
FROM site_members sm 
JOIN sites s ON s.id = sm.site_id 
WHERE sm.user_id = auth.uid();

-- Test RLS policies
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM site_regatta_profiles;
```

## Recent Changes

### December 2024 Updates
- Enhanced multi-domain authentication documentation
- Added comprehensive testing procedures  
- Improved client integration examples
- Standardized naming conventions for all components
- Added troubleshooting section and debug commands
- Consolidated documentation from separate auth and testing files
    END IF;
END;
$function$;
```

### Pattern for New Sites

When adding a new site that needs site-specific user data:

1. **Register the site in `public.sites`**:
```sql
INSERT INTO public.sites (name, domain, schema_name) VALUES
('Your Site Name', 'yoursite.com', 'site_yoursite');
```

2. **Create site-specific profile table**: `public.site_{name}_profiles`
```sql
CREATE TABLE public.site_yoursite_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  -- Add your site-specific fields here
  credits INTEGER DEFAULT 1000,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, site_id)
);
```

3. **Enable RLS with proper policies**:
```sql
ALTER TABLE public.site_yoursite_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own site profiles" 
ON public.site_yoursite_profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own site profiles" 
ON public.site_yoursite_profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own site profiles" 
ON public.site_yoursite_profiles FOR UPDATE 
USING (auth.uid() = user_id);
```

4. **Create helper functions**: For getting/updating site-specific data
```sql
CREATE OR REPLACE FUNCTION public.get_user_yoursite_profile(site_schema text)
RETURNS TABLE (
  id uuid,
  credits integer,
  level integer,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
) 
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
    RETURN QUERY
    SELECT 
      syp.id,
      syp.credits,
      syp.level,
      syp.created_at,
      syp.updated_at
    FROM public.site_yoursite_profiles syp
    JOIN public.sites s ON s.id = syp.site_id
    WHERE s.schema_name = site_schema 
    AND syp.user_id = auth.uid();
END;
$$;
```

5. **Update `ensure_membership_for_domain`**: To auto-create profiles for new users
```sql
-- Add this block to the existing function
IF site_record.schema_name = 'site_yoursite' THEN
    INSERT INTO public.site_yoursite_profiles (user_id, site_id)
    VALUES (auth.uid(), site_record.id)
    ON CONFLICT (user_id, site_id) DO NOTHING;
END IF;
```

6. **Add timestamp triggers** (optional):
```sql
CREATE TRIGGER update_site_yoursite_profiles_updated_at
BEFORE UPDATE ON public.site_yoursite_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
```

This pattern keeps shared authentication in `public.profiles` while allowing each site to have its own user-specific data structure with proper foreign key constraints and data integrity.

## Authentication Integration

### User Registration Flow

1. User signs up via Supabase Auth
2. `handle_new_user()` trigger fires
3. Profile created in `public.profiles`
4. Site membership can be created on first visit or manually

### Authentication Setup

```typescript
// Configure Supabase Auth
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'YOUR_SUPABASE_URL', 
  'YOUR_SUPABASE_ANON_KEY',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
```

## Client Integration

### Basic Usage

```typescript
import { supabase } from '@/integrations/supabase/client';
import { useRegattaProfile } from '@/hooks/useRegattaProfile';

// Get user profile (general info only)
const { data: profile } = await supabase
  .publicFrom('profiles')
  .select('nickname, email, bio, avatar_url')
  .eq('id', user.id)
  .single();

// Update user profile (general info only)
const { error } = await supabase
  .publicFrom('profiles')
  .update({ 
    nickname: 'New Name',
    bio: 'Updated bio',
    country: 'US'
  })
  .eq('id', user.id);

// Get site-specific profile data using custom hook
const { profile: regattaProfile, updateCredits } = useRegattaProfile();

// Update user credits using helper function
await updateCredits(-100); // Deduct 100 credits

// Get site-specific data using RPC functions
const { data: regattaProfile } = await supabase.rpc('get_user_regatta_profile', {
  site_schema: 'site_regatta'
});

// Check site membership
const { data: membership } = await supabase
  .publicFrom('site_members')
  .select('role')
  .eq('user_id', user.id)
  .eq('site_id', siteId)
  .single();
```

### Authentication Helpers

```typescript
// Check if user is authenticated
const { data: { user } } = await supabase.auth.getUser();

// Sign up new user
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: {
    emailRedirectTo: `${window.location.origin}/`
  }
});

// Sign in user
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// Sign out user
const { error } = await supabase.auth.signOut();
```

## Security Configuration

### Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

```sql
-- Example: Users can only update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles
FOR UPDATE 
TO authenticated
USING (auth.uid() = id);
```

### Authentication Requirements

- All operations require authenticated users
- Anonymous access limited to viewing active sites only
- Use helper functions for complex permission checks

## Integration Checklist

### For New Applications

1. **Set up authentication**:
   - Configure Supabase Auth with your domain
   - Add OAuth providers if needed
   - Set up email templates

2. **Register your site**:
```sql
INSERT INTO public.sites (name, domain, schema_name) 
VALUES ('Your App', 'yourapp.com', 'site_yourapp');
```

3. **Configure client**:
   - Import Supabase client
   - Set up authentication state management
   - Handle user profile creation/updates

4. **Test integration**:
   - User registration/login
   - Profile management
   - Site membership verification

### Required Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Troubleshooting

### Common Issues

1. **User can't access site**: Check `site_members` table for membership
2. **Authentication problems**: Verify domain in Auth settings
3. **RLS blocking data**: Review policy conditions and user authentication
4. **Profile creation fails**: Check `handle_new_user()` trigger

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

-- Check site-specific regatta profile
SELECT * FROM site_regatta_profiles WHERE user_id = auth.uid();

-- View all registered sites and their schemas
SELECT name, domain, schema_name, active FROM sites ORDER BY name;

-- Check foreign key constraints
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
    AND tc.table_name IN ('site_members', 'site_regatta_profiles');
```

## Recent Changes (Latest PR)

### Database Improvements
- **Added Foreign Key Constraints**: All site-related tables now have proper foreign key constraints with `ON DELETE CASCADE`
- **Site Registration**: Pre-populated `public.sites` table with known domains
- **Data Migration**: Created migration function to move existing users to site-specific profiles
- **Helper Functions**: Added `get_current_site_id()`, `update_user_credits()`, and `migrate_existing_users_to_regatta_profiles()`

### Client Integration Updates  
- **New Hook**: `useRegattaProfile()` for managing site-specific profile data
- **Updated Components**: Account page, leaderboard, and create regatta dialog now use site-specific profiles
- **Credits System**: Fully functional credits system with proper validation and updates

### Architecture Refinements
- **Consistent Naming**: All functions and tables follow the documented naming conventions
- **Data Integrity**: Foreign key constraints ensure referential integrity
- **Site Isolation**: Proper data separation between different sites
- **Migration Support**: Functions to migrate existing data to new schema structure

## Maintenance

### Regular Tasks

1. Monitor authentication metrics
2. Clean up inactive user accounts
3. Audit RLS policy effectiveness
4. Update authentication providers as needed

### Backup Strategy

- Regular backups of public schema
- Test restoration procedures
- Monitor authentication logs for security issues