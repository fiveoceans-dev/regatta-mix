-- Fix missing foreign key constraints and add site registration
-- Add foreign key constraints to site_regatta_profiles
ALTER TABLE public.site_regatta_profiles 
ADD CONSTRAINT site_regatta_profiles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.site_regatta_profiles 
ADD CONSTRAINT site_regatta_profiles_site_id_fkey 
FOREIGN KEY (site_id) REFERENCES public.sites(id) ON DELETE CASCADE;

-- Add foreign key constraint to site_members
ALTER TABLE public.site_members 
ADD CONSTRAINT site_members_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.site_members 
ADD CONSTRAINT site_members_site_id_fkey 
FOREIGN KEY (site_id) REFERENCES public.sites(id) ON DELETE CASCADE;

-- Insert default sites for known domains
INSERT INTO public.sites (name, domain, schema_name) VALUES
  ('Regatta Rift', 'regatta-rift.lovable.app', 'site_regatta'),
  ('Web3 Analytics', 'web3analytics.lovable.app', 'site_web3analytics'),
  ('OpenAir', 'openair.lovable.app', 'site_openair'),
  ('AllYou Company', 'allyoucompany.com', 'site_allyou'),
  ('Buena', 'buena', 'site_buena'),
  ('Morph', 'morph.', 'site_morph')
ON CONFLICT (domain) DO NOTHING;

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