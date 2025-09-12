# Supabase Multi-Site Architecture Documentation

## Overview

This Supabase project implements a multi-site architecture that allows multiple websites/applications to share a common authentication system while maintaining separate data schemas for each site. This enables centralized user management with site-specific content and functionality.

## Architecture Components

### 1. Shared Public Schema

The `public` schema contains tables that are shared across all sites:

#### `profiles` Table
- **Purpose**: Extended user profile information shared across all sites
- **Fields**:
  - `id` (UUID, Primary Key) - References `auth.users.id`
  - `nickname` (VARCHAR, Required) - User's display name
  - `email` (VARCHAR, Required) - User's email address
  - `email_verified` (BOOLEAN) - Email verification status
  - `rank` (ENUM: user_rank) - User's skill level
  - `total_races` (INTEGER) - Total races completed across all sites
  - `karma` (INTEGER) - Community reputation score
  - `credits` (INTEGER) - Virtual currency balance
  - `is_active` (BOOLEAN) - Account status
  - `bio` (TEXT) - User biography
  - `country` (VARCHAR) - User's country
  - `timezone` (VARCHAR) - User's timezone
  - `avatar_url` (TEXT) - Profile picture URL
  - `created_at` (TIMESTAMP) - Account creation date
  - `updated_at` (TIMESTAMP) - Last profile update

#### `sites` Table
- **Purpose**: Registry of all sites in the multi-site system
- **Fields**:
  - `id` (UUID, Primary Key) - Unique site identifier
  - `name` (TEXT, Required) - Human-readable site name
  - `domain` (TEXT, Required, Unique) - Site's domain name
  - `schema_name` (TEXT, Required) - Database schema name for this site
  - `active` (BOOLEAN) - Whether the site is active
  - `created_at` (TIMESTAMP) - Site creation date
  - `updated_at` (TIMESTAMP) - Last site update

#### `site_members` Table
- **Purpose**: Tracks which users have access to which sites
- **Fields**:
  - `id` (UUID, Primary Key) - Unique membership record
  - `user_id` (UUID, Required) - References `auth.users.id`
  - `site_id` (UUID, References sites.id) - Site the user belongs to
  - `role` (TEXT) - User's role on this site (default: 'member')
  - `active` (BOOLEAN) - Whether membership is active
  - `joined_at` (TIMESTAMP) - When user joined this site

### 2. Site-Specific Schemas

Each site has its own schema (e.g., `site_regatta`, `site_web3analytics`) containing site-specific tables:

#### Regatta Site Schema (`site_regatta`)

##### `regattas` Table
- **Purpose**: Sailing competitions and events
- **Fields**:
  - `id` (UUID, Primary Key)
  - `name` (TEXT, Required) - Regatta name
  - `description` (TEXT) - Event description
  - `organizer_id` (UUID) - References public.profiles.id
  - `start_date` (TIMESTAMP) - Event start time
  - `end_date` (TIMESTAMP) - Event end time
  - `location` (TEXT) - Event location
  - `class` (ENUM: boat_class) - Boat class for the regatta
  - `max_players` (INTEGER) - Maximum participants
  - `current_players` (INTEGER) - Current participant count
  - `prize_pool` (INTEGER) - Prize money/points
  - `entry_fee` (INTEGER) - Cost to join
  - `status` (ENUM: regatta_status) - Current status
  - `weather_condition` (ENUM: weather_condition) - Weather conditions
  - `wind_speed` (INTEGER) - Wind speed in knots
  - `wave_height` (INTEGER) - Wave height in feet
  - `code` (TEXT) - Private regatta access code
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

##### `regatta_registrations` Table
- **Purpose**: Tracks user registrations for regattas
- **Fields**:
  - `id` (UUID, Primary Key)
  - `regatta_id` (UUID, References regattas.id)
  - `user_id` (UUID) - References public.profiles.id
  - `boat_id` (UUID) - References boats.id
  - `registration_date` (TIMESTAMP)
  - `final_position` (INTEGER) - Final race position
  - `prize_money` (INTEGER) - Prize money earned
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

##### `boats` Table
- **Purpose**: User-owned sailing boats
- **Fields**:
  - `id` (UUID, Primary Key)
  - `owner_id` (UUID) - References public.profiles.id
  - `name` (TEXT, Required) - Boat name
  - `class` (ENUM: boat_class) - Boat class/type
  - `condition` (ENUM: boat_condition) - Boat condition
  - `rating` (INTEGER) - Performance rating
  - `speed` (INTEGER) - Speed attribute
  - `handling` (INTEGER) - Handling attribute
  - `price` (INTEGER) - Purchase/sale price
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

##### `crew` Table
- **Purpose**: Crew members available for hire
- **Fields**:
  - `id` (UUID, Primary Key)
  - `owner_id` (UUID) - References public.profiles.id
  - `name` (TEXT, Required) - Crew member name
  - `role` (ENUM: crew_role) - Crew position
  - `rating` (INTEGER) - Skill rating
  - `experience` (INTEGER) - Years of experience
  - `salary` (INTEGER) - Cost to hire
  - `status` (ENUM: crew_status) - Availability status
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

##### `parts` Table
- **Purpose**: Boat parts and equipment
- **Fields**:
  - `id` (UUID, Primary Key)
  - `owner_id` (UUID) - References public.profiles.id
  - `name` (TEXT, Required) - Part name
  - `category` (ENUM: part_category) - Part type
  - `condition` (ENUM: boat_condition) - Part condition
  - `performance` (INTEGER) - Performance boost
  - `rating` (INTEGER) - Quality rating
  - `price` (INTEGER) - Purchase/sale price
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

##### `races` Table
- **Purpose**: Individual races within regattas
- **Fields**:
  - `id` (UUID, Primary Key)
  - `regatta_id` (UUID, References regattas.id)
  - `race_number` (INTEGER) - Race sequence number
  - `start_time` (TIMESTAMP)
  - `end_time` (TIMESTAMP)
  - `weather_condition` (ENUM: weather_condition)
  - `wind_speed` (INTEGER)
  - `wave_height` (INTEGER)
  - `status` (ENUM: race_status)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

##### `race_results` Table
- **Purpose**: Individual race results
- **Fields**:
  - `id` (UUID, Primary Key)
  - `race_id` (UUID, References races.id)
  - `user_id` (UUID) - References public.profiles.id
  - `position` (INTEGER) - Finishing position
  - `time` (INTERVAL) - Race completion time
  - `points` (INTEGER) - Points earned
  - `penalties` (INTEGER) - Penalty points
  - `created_at` (TIMESTAMP)

##### `protests` Table
- **Purpose**: Rule violation reports
- **Fields**:
  - `id` (UUID, Primary Key)
  - `race_id` (UUID, References races.id)
  - `protester_id` (UUID) - References public.profiles.id
  - `protested_id` (UUID) - References public.profiles.id
  - `incident_description` (TEXT)
  - `rule_citation` (TEXT)
  - `status` (ENUM: protest_status)
  - `resolution` (TEXT)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

##### `achievements` Table
- **Purpose**: User achievements and milestones
- **Fields**:
  - `id` (UUID, Primary Key)
  - `user_id` (UUID) - References public.profiles.id
  - `title` (TEXT, Required) - Achievement title
  - `description` (TEXT) - Achievement description
  - `category` (TEXT) - Achievement category
  - `points` (INTEGER) - Points awarded
  - `earned_at` (TIMESTAMP) - When achievement was earned
  - `created_at` (TIMESTAMP)

##### `transactions` Table
- **Purpose**: Credit/currency transactions
- **Fields**:
  - `id` (UUID, Primary Key)
  - `user_id` (UUID) - References public.profiles.id
  - `amount` (INTEGER) - Transaction amount
  - `type` (TEXT) - Transaction type
  - `description` (TEXT) - Transaction description
  - `created_at` (TIMESTAMP)

##### `user_settings` Table
- **Purpose**: User preferences for this site
- **Fields**:
  - `id` (UUID, Primary Key)
  - `user_id` (UUID) - References public.profiles.id
  - `notifications_enabled` (BOOLEAN)
  - `audio_enabled` (BOOLEAN)
  - `music_volume` (INTEGER)
  - `sfx_volume` (INTEGER)
  - `graphics_quality` (TEXT)
  - `auto_save` (BOOLEAN)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

## Row Level Security (RLS) Policies

All tables have RLS enabled with appropriate policies:

### Public Schema Policies
- **profiles**: Users can view all profiles, update/insert their own
- **sites**: Anyone can view active sites
- **site_members**: Users can view/insert their own memberships

### Site Schema Policies
All site-specific tables implement user-based access control:
- Users can only access their own records
- Some tables allow viewing other users' public data
- Site membership is verified through helper functions

## Database Functions

### Shared Functions (Public Schema)

#### `ensure_membership_for_domain()`
- Automatically creates site membership when users authenticate
- Called by authentication triggers

#### `user_in_site(site_schema text)`
- Returns boolean indicating if authenticated user belongs to specified site
- Used by RLS policies for access control

#### `user_role_in_site(site_schema text)`
- Returns user's role in specified site
- Used for role-based permissions

#### `handle_new_user()`
- Trigger function that runs when new users register
- Creates profile record and initial site membership
- Adds welcome achievement and default settings

### Site-Specific Functions

#### `update_regatta_player_count()`
- Maintains accurate player counts for regattas
- Triggered on regatta registration changes

#### `create_quick_match()`
- Generates automatic quick-match regattas
- Called periodically to ensure availability

## Client Integration

### Supabase Client Configuration

The client is configured to automatically route queries to the correct schema based on the current domain:

```typescript
// Public schema access
supabase.from('profiles')        // Always goes to public.profiles
supabase.from('sites')          // Always goes to public.sites
supabase.from('site_members')   // Always goes to public.site_members

// Site-specific schema access
supabase.site.from('regattas')  // Goes to site_regatta.regattas (domain-based)
supabase.site.from('boats')     // Goes to site_regatta.boats (domain-based)
```

### Domain Mapping

The client automatically determines the correct schema based on the current domain:

```typescript
const HOST_MAP = {
  'regatta-rift.lovable.app': 'site_regatta',
  'web3analytics.lovable.app': 'site_web3analytics',
  'openair.lovable.app': 'site_openair',
  // ... additional domains
}
```

## Authentication Flow

1. User authenticates through Supabase Auth (shared across all sites)
2. `handle_new_user()` trigger creates profile and initial site membership
3. `ensure_membership_for_domain()` verifies/creates membership for current site
4. RLS policies enforce data access based on site membership
5. Client automatically routes queries to correct schema

## Adding New Sites

To add a new site to the multi-site system:

1. **Create site schema**: Run migration to create new schema (e.g., `site_newsite`)
2. **Create site-specific tables**: Copy table structure from existing site schema
3. **Register site**: Insert record into `public.sites` table
4. **Update client mapping**: Add domain mapping in `supabaseSite.ts`
5. **Configure authentication**: Add domain to Supabase Auth settings
6. **Deploy**: Update application configuration for new domain

## Security Considerations

- All tables use RLS for data isolation
- Site membership is verified before data access
- Authentication is centralized but data is isolated
- Helper functions use `SECURITY DEFINER` for elevated access
- Regular security audits recommended for policy effectiveness

## Backup and Maintenance

- Shared schema (public) affects all sites - handle with care
- Site-specific schemas can be backed up/restored independently
- Monitor site membership integrity
- Regular cleanup of inactive sites and memberships
- Performance monitoring across schemas recommended