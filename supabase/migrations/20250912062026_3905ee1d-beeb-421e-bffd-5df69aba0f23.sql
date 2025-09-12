-- Add helper functions and migrate existing users
-- Create function to migrate existing users to site-specific profiles
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

-- Run the migration
SELECT public.migrate_existing_users_to_regatta_profiles();

-- Create helper function to get current site ID
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

-- Update credits for user (common operation)
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