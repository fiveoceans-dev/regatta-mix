-- Remove site-specific fields from profiles table
-- Keep only general account information in public.profiles

ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS rank,
DROP COLUMN IF EXISTS total_races, 
DROP COLUMN IF EXISTS karma,
DROP COLUMN IF EXISTS credits;

-- Update handle_new_user function to only create basic profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Insert basic profile information only
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