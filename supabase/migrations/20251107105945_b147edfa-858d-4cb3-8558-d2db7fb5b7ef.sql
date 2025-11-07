-- Enable required extension for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Common updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL PRIMARY KEY,
  nickname TEXT,
  email TEXT,
  bio TEXT,
  avatar_url TEXT,
  country TEXT,
  timezone TEXT,
  credits INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- SITE REGATTA PROFILES
CREATE TABLE IF NOT EXISTS public.site_regatta_profiles (
  user_id UUID NOT NULL PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  rank TEXT NOT NULL DEFAULT 'novice',
  total_races INTEGER NOT NULL DEFAULT 0,
  karma INTEGER NOT NULL DEFAULT 0,
  credits INTEGER NOT NULL DEFAULT 1000,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_regatta_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read regatta profiles"
ON public.site_regatta_profiles FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own regatta profile"
ON public.site_regatta_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own regatta profile"
ON public.site_regatta_profiles FOR UPDATE
USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS trg_site_regatta_profiles_updated_at ON public.site_regatta_profiles;
CREATE TRIGGER trg_site_regatta_profiles_updated_at
BEFORE UPDATE ON public.site_regatta_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- REGATTAS
CREATE TABLE IF NOT EXISTS public.regattas (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  class TEXT NOT NULL CHECK (class IN ('j24','j70','laser','ac75','tp52')),
  location TEXT,
  max_players INTEGER NOT NULL,
  current_players INTEGER NOT NULL DEFAULT 0,
  prize_pool INTEGER NOT NULL DEFAULT 0,
  entry_fee INTEGER NOT NULL DEFAULT 0,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  registration_deadline TIMESTAMPTZ,
  wind_speed INTEGER,
  wave_height NUMERIC,
  weather_condition TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming','registration_open','ongoing','completed','cancelled')),
  code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.regattas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view regattas"
ON public.regattas FOR SELECT
USING (true);

CREATE POLICY "Organizers can insert their own regattas"
ON public.regattas FOR INSERT
WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update their own regattas"
ON public.regattas FOR UPDATE
USING (auth.uid() = organizer_id);

DROP TRIGGER IF EXISTS trg_regattas_updated_at ON public.regattas;
CREATE TRIGGER trg_regattas_updated_at
BEFORE UPDATE ON public.regattas
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- REGATTA REGISTRATIONS
CREATE TABLE IF NOT EXISTS public.regatta_registrations (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  regatta_id UUID NOT NULL REFERENCES public.regattas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  registration_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  final_position INTEGER,
  prize_money INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (regatta_id, user_id)
);
ALTER TABLE public.regatta_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own registrations"
ON public.regatta_registrations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own registrations"
ON public.regatta_registrations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own registrations"
ON public.regatta_registrations FOR UPDATE
USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS trg_regatta_registrations_updated_at ON public.regatta_registrations;
CREATE TRIGGER trg_regatta_registrations_updated_at
BEFORE UPDATE ON public.regatta_registrations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements"
ON public.achievements FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
ON public.achievements FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- BOATS
CREATE TABLE IF NOT EXISTS public.boats (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  class TEXT,
  price INTEGER,
  rating INTEGER,
  speed INTEGER,
  handling INTEGER,
  condition TEXT,
  owner_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.boats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view boats"
ON public.boats FOR SELECT
USING (true);

CREATE POLICY "Auth users can insert boats"
ON public.boats FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Owners can update their boats"
ON public.boats FOR UPDATE
USING (auth.uid() = owner_id);

DROP TRIGGER IF EXISTS trg_boats_updated_at ON public.boats;
CREATE TRIGGER trg_boats_updated_at
BEFORE UPDATE ON public.boats
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CREW
CREATE TABLE IF NOT EXISTS public.crew (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  salary INTEGER,
  rating INTEGER,
  experience INTEGER,
  status TEXT DEFAULT 'available',
  owner_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.crew ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view crew"
ON public.crew FOR SELECT
USING (true);

CREATE POLICY "Auth users can insert crew"
ON public.crew FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Owners can update their crew"
ON public.crew FOR UPDATE
USING (auth.uid() = owner_id);

DROP TRIGGER IF EXISTS trg_crew_updated_at ON public.crew;
CREATE TRIGGER trg_crew_updated_at
BEFORE UPDATE ON public.crew
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- PARTS
CREATE TABLE IF NOT EXISTS public.parts (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  price INTEGER,
  rating INTEGER,
  performance INTEGER,
  condition TEXT,
  owner_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view parts"
ON public.parts FOR SELECT
USING (true);

CREATE POLICY "Auth users can insert parts"
ON public.parts FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Owners can update their parts"
ON public.parts FOR UPDATE
USING (auth.uid() = owner_id);

DROP TRIGGER IF EXISTS trg_parts_updated_at ON public.parts;
CREATE TRIGGER trg_parts_updated_at
BEFORE UPDATE ON public.parts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- PROTESTS
CREATE TABLE IF NOT EXISTS public.protests (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  protester_id UUID NOT NULL,
  incident_description TEXT NOT NULL,
  rule_citation TEXT,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted','pending','resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.protests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view protests"
ON public.protests FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own protests"
ON public.protests FOR INSERT
WITH CHECK (auth.uid() = protester_id);

CREATE POLICY "Users can update their own protests"
ON public.protests FOR UPDATE
USING (auth.uid() = protester_id);

DROP TRIGGER IF EXISTS trg_protests_updated_at ON public.protests;
CREATE TRIGGER trg_protests_updated_at
BEFORE UPDATE ON public.protests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- USER SETTINGS
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id UUID NOT NULL PRIMARY KEY,
  sfx_volume INTEGER NOT NULL DEFAULT 75,
  music_volume INTEGER NOT NULL DEFAULT 50,
  audio_enabled BOOLEAN NOT NULL DEFAULT true,
  graphics_quality TEXT NOT NULL DEFAULT 'medium',
  notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  auto_save BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own settings"
ON public.user_settings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
ON public.user_settings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
ON public.user_settings FOR UPDATE
USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS trg_user_settings_updated_at ON public.user_settings;
CREATE TRIGGER trg_user_settings_updated_at
BEFORE UPDATE ON public.user_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- FUNCTIONS
-- Create or get regatta profile for current user
CREATE OR REPLACE FUNCTION public.get_user_regatta_profile(site_schema TEXT DEFAULT 'public')
RETURNS TABLE (
  id UUID,
  rank TEXT,
  total_races INTEGER,
  karma INTEGER,
  credits INTEGER,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
DECLARE
  uid UUID := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RETURN;
  END IF;

  -- Ensure a profile row exists for the user
  INSERT INTO public.profiles (id)
  VALUES (uid)
  ON CONFLICT (id) DO NOTHING;

  -- Ensure a regatta profile exists with defaults
  INSERT INTO public.site_regatta_profiles (user_id)
  VALUES (uid)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN QUERY
  SELECT
    p.id,
    srp.rank,
    srp.total_races,
    srp.karma,
    srp.credits,
    srp.created_at,
    srp.updated_at
  FROM public.profiles p
  JOIN public.site_regatta_profiles srp ON srp.user_id = p.id
  WHERE p.id = uid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update credits for the current user (both site profile and public profile)
CREATE OR REPLACE FUNCTION public.update_user_credits(credit_change INTEGER)
RETURNS VOID AS $$
DECLARE
  uid UUID := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RETURN;
  END IF;

  -- Ensure base rows exist
  INSERT INTO public.profiles (id)
  VALUES (uid)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.site_regatta_profiles (user_id)
  VALUES (uid)
  ON CONFLICT (user_id) DO NOTHING;

  -- Update regatta profile credits
  UPDATE public.site_regatta_profiles
  SET credits = GREATEST(0, credits + credit_change)
  WHERE user_id = uid;

  -- Mirror credits in public.profiles for UI convenience
  UPDATE public.profiles
  SET credits = GREATEST(0, COALESCE(credits, 0) + credit_change)
  WHERE id = uid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
