-- Drop old tables from public schema after migration
DROP TABLE IF EXISTS public.achievements CASCADE;
DROP TABLE IF EXISTS public.parts CASCADE; 
DROP TABLE IF EXISTS public.regatta_registrations CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.boats CASCADE;
DROP TABLE IF EXISTS public.protests CASCADE;
DROP TABLE IF EXISTS public.regattas CASCADE;
DROP TABLE IF EXISTS public.user_settings CASCADE;
DROP TABLE IF EXISTS public.race_results CASCADE;
DROP TABLE IF EXISTS public.crew CASCADE;
DROP TABLE IF EXISTS public.races CASCADE;

-- Drop old functions from public schema
DROP FUNCTION IF EXISTS public.create_quick_match() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.update_regatta_player_count() CASCADE;

-- Update public.handle_new_user to work with new schema structure
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Insert into profiles (remains in public schema)
    INSERT INTO public.profiles (id, nickname, email, email_verified)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'nickname', 'Player' || substr(NEW.id::text, 1, 8)),
        NEW.email,
        NEW.email_confirmed_at IS NOT NULL
    );
    
    -- Ensure membership for site_regatta for this user
    INSERT INTO public.site_members (site_id, user_id, role)
    SELECT s.id, NEW.id, 'member'
    FROM public.sites s 
    WHERE s.schema_name = 'site_regatta' AND s.active = true
    ON CONFLICT (site_id, user_id) DO NOTHING;
    
    -- Insert user settings into site_regatta schema
    INSERT INTO site_regatta.user_settings (user_id)
    VALUES (NEW.id);
    
    -- Give welcome achievement in site_regatta schema
    INSERT INTO site_regatta.achievements (user_id, title, description, category, points)
    VALUES (NEW.id, 'Welcome Aboard', 'Welcome to the sailing world!', 'registration', 10);
    
    RETURN NEW;
END;
$$;

-- Create trigger for new users (if not exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();