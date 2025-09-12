# Shared Supabase Architecture Documentation

## Overview

This documentation covers the **shared public schema** used for user authentication, profiles, and site management. All tables are in the public schema and accessible across different sites through a centralized authentication system.

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
- `nickname`: Display name shown across applications
- `email`: User's email address (synced from auth)
- `email_verified`: Email verification status
- `rank`: User skill level (novice, amateur, pro, expert)
- `total_races`: Total number of races completed
- `karma`: Community reputation score (0-1000)
- `credits`: Virtual currency balance
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

**Purpose**: Automatically create site membership when user visits a domain

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
        INSERT INTO public.site_members (site_id, user_id, role)
        VALUES (site_record.id, auth.uid(), 'member')
        ON CONFLICT (site_id, user_id) DO NOTHING;
    END IF;
END;
$$;
```

### 4. `handle_new_user()`

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

// Get user profile
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single();

// Update user profile
const { error } = await supabase
  .from('profiles')
  .update({ nickname: 'New Name' })
  .eq('id', user.id);

// Check site membership
const { data: membership } = await supabase
  .from('site_members')
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
```

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