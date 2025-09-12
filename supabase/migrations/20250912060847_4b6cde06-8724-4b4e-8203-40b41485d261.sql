-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create site_regatta_profiles table for regatta-specific user data
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

-- Enable Row Level Security
ALTER TABLE public.site_regatta_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for site_regatta_profiles
CREATE POLICY "Users can view their own site profiles" 
ON public.site_regatta_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own site profiles" 
ON public.site_regatta_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own site profiles" 
ON public.site_regatta_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to get user's regatta profile for current site
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
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

-- Create function to initialize regatta profile for new users
CREATE OR REPLACE FUNCTION public.initialize_regatta_profile_for_site(target_site_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    profile_id uuid;
BEGIN
    INSERT INTO public.site_regatta_profiles (user_id, site_id)
    VALUES (auth.uid(), target_site_id)
    ON CONFLICT (user_id, site_id) DO NOTHING
    RETURNING id INTO profile_id;
    
    RETURN profile_id;
END;
$function$;

-- Update the ensure_membership_for_domain function to also create regatta profile
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
$function$;

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_site_regatta_profiles_updated_at
BEFORE UPDATE ON public.site_regatta_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();