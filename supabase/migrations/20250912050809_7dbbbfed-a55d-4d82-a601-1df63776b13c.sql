-- Fix security warnings by adding proper search_path to functions
CREATE OR REPLACE FUNCTION public.user_in_site(site_schema text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.user_role_in_site(site_schema text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.ensure_membership_for_domain()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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