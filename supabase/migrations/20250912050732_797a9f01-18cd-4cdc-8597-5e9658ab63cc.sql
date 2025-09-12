-- Create sites table and site members table with specific data
CREATE TABLE IF NOT EXISTS public.sites (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    domain text NOT NULL UNIQUE,
    schema_name text NOT NULL UNIQUE,
    name text NOT NULL,
    active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on sites table
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

-- Create policy for sites - anyone can read active sites
CREATE POLICY "Anyone can view active sites" ON public.sites
    FOR SELECT USING (active = true);

-- Create site_members table for multi-site user management
CREATE TABLE IF NOT EXISTS public.site_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id uuid REFERENCES public.sites(id) ON DELETE CASCADE,
    user_id uuid NOT NULL,
    role text DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
    joined_at timestamp with time zone DEFAULT now(),
    active boolean DEFAULT true,
    UNIQUE(site_id, user_id)
);

-- Enable RLS on site_members table
ALTER TABLE public.site_members ENABLE ROW LEVEL SECURITY;

-- Create policy for site_members - users can view their own memberships
CREATE POLICY "Users can view own site memberships" ON public.site_members
    FOR SELECT USING (auth.uid() = user_id);

-- Create policy for site_members - users can insert their own memberships
CREATE POLICY "Users can join sites" ON public.site_members
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to check if user is member of a site
CREATE OR REPLACE FUNCTION public.user_in_site(site_schema text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Function to get user role in a site
CREATE OR REPLACE FUNCTION public.user_role_in_site(site_schema text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Function to ensure user has membership for current domain
CREATE OR REPLACE FUNCTION public.ensure_membership_for_domain()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Insert specific site data
INSERT INTO public.sites (domain, schema_name, name, active) VALUES
  ('regatta-rift.lovable.app', 'site_regatta', 'Regatta Rift', true),
  ('web3analytics.lovable.app', 'site_web3analytics', 'Web3 Analytics', true),
  ('openair.lovable.app', 'site_openair', 'OpenAir Ventures', true),
  ('allyoucompany.com', 'site_allyou', 'AllYou Tools', true),
  ('buena', 'site_buena', 'Buena Tech', true),
  ('morph.', 'site_morph', 'Morph Studio', true);