-- Create site_regatta schema and move tables
CREATE SCHEMA IF NOT EXISTS site_regatta;

-- Update sites table with all the new sites
INSERT INTO public.sites (domain, schema_name, name, active) VALUES
  ('cyber.sailing', 'site_regatta', 'Regatta Rift', true),
  ('web3analytics.app', 'site_web3analytics', 'Web3 Analytics', true),
  ('openair.ventures', 'site_openair', 'OpenAir Ventures', true),
  ('allyou.tools', 'site_allyou', 'AllYou Tools', true),
  ('buena.tech', 'site_buena', 'Buena Tech', true),
  ('morph.studio', 'site_morph', 'Morph Studio', true)
ON CONFLICT (domain) DO UPDATE SET
  schema_name = EXCLUDED.schema_name,
  name = EXCLUDED.name,
  active = EXCLUDED.active;

-- Create all tables in site_regatta schema
CREATE TABLE IF NOT EXISTS site_regatta.achievements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title varchar NOT NULL,
  description text,
  category varchar NOT NULL,
  points integer DEFAULT 0,
  earned_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_regatta.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname varchar NOT NULL,
  email varchar NOT NULL,
  email_verified boolean DEFAULT false,
  avatar_url text,
  bio text,
  country varchar,
  timezone varchar DEFAULT 'UTC',
  rank user_rank DEFAULT 'novice',
  total_races integer DEFAULT 0,
  karma integer DEFAULT 100,
  credits integer DEFAULT 1000,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_regatta.boats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name varchar NOT NULL,
  class boat_class NOT NULL,
  hull_number varchar,
  price integer NOT NULL,
  rating integer NOT NULL,
  speed integer NOT NULL,
  handling integer NOT NULL,
  condition boat_condition DEFAULT 'good',
  owner_id uuid REFERENCES auth.users(id),
  seller_id uuid REFERENCES auth.users(id),
  year_built integer,
  last_maintenance_date date,
  maintenance_cost integer DEFAULT 0,
  insurance_expiry date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_regatta.crew (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name varchar NOT NULL,
  role crew_role NOT NULL,
  salary integer NOT NULL,
  rating integer NOT NULL,
  experience integer DEFAULT 0,
  specialty text,
  status crew_status DEFAULT 'available',
  owner_id uuid REFERENCES auth.users(id),
  seller_id uuid REFERENCES auth.users(id),
  contract_start_date date,
  contract_end_date date,
  performance_bonus integer DEFAULT 0,
  injury_recovery_days integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_regatta.parts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name varchar NOT NULL,
  category part_category NOT NULL,
  manufacturer varchar,
  model varchar,
  serial_number varchar,
  price integer NOT NULL,
  rating integer NOT NULL,
  performance integer NOT NULL,
  weight numeric,
  condition boat_condition DEFAULT 'good',
  owner_id uuid REFERENCES auth.users(id),
  seller_id uuid REFERENCES auth.users(id),
  compatible_classes boat_class[],
  warranty_months integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_regatta.regattas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name varchar NOT NULL,
  description text,
  location varchar NOT NULL,
  code varchar,
  class boat_class NOT NULL,
  max_players integer NOT NULL,
  current_players integer DEFAULT 0,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  registration_deadline timestamptz NOT NULL,
  latitude numeric,
  longitude numeric,
  prize_pool integer NOT NULL,
  entry_fee integer NOT NULL,
  status regatta_status DEFAULT 'upcoming',
  weather_condition weather_condition,
  wind_speed integer,
  wave_height numeric,
  organizer_id uuid REFERENCES auth.users(id),
  race_distance numeric,
  number_of_races integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_regatta.races (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name varchar,
  regatta_id uuid REFERENCES site_regatta.regattas(id),
  race_number integer NOT NULL,
  start_time timestamptz NOT NULL,
  status race_status DEFAULT 'not_started',
  wind_speed integer,
  wind_direction integer,
  weather_condition weather_condition,
  course_length numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_regatta.regatta_registrations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  regatta_id uuid REFERENCES site_regatta.regattas(id),
  user_id uuid REFERENCES auth.users(id),
  boat_id uuid REFERENCES site_regatta.boats(id),
  crew_ids uuid[],
  registration_date timestamptz DEFAULT now(),
  paid boolean DEFAULT false,
  final_position integer,
  total_points integer DEFAULT 0,
  prize_money integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_regatta.race_results (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  race_id uuid REFERENCES site_regatta.races(id),
  registration_id uuid REFERENCES site_regatta.regatta_registrations(id),
  position integer NOT NULL,
  finish_time timestamptz,
  points integer NOT NULL DEFAULT 0,
  dnf boolean DEFAULT false,
  dsq boolean DEFAULT false,
  penalty_points integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_regatta.protests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  race_id uuid REFERENCES site_regatta.races(id),
  protester_id uuid REFERENCES auth.users(id),
  protested_id uuid REFERENCES auth.users(id),
  incident_description text NOT NULL,
  rule_citation varchar,
  status protest_status DEFAULT 'submitted',
  jury_decision text,
  penalty_imposed text,
  submitted_at timestamptz DEFAULT now(),
  decision_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_regatta.transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id uuid REFERENCES auth.users(id),
  seller_id uuid REFERENCES auth.users(id),
  item_id uuid NOT NULL,
  item_type varchar NOT NULL,
  price integer NOT NULL,
  commission integer DEFAULT 0,
  status varchar DEFAULT 'pending',
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_regatta.user_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  theme varchar DEFAULT 'auto',
  language varchar DEFAULT 'en',
  graphics_quality varchar DEFAULT 'medium',
  audio_enabled boolean DEFAULT true,
  music_volume integer DEFAULT 50,
  sfx_volume integer DEFAULT 75,
  auto_save boolean DEFAULT true,
  notifications_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE site_regatta.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_regatta.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_regatta.boats ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_regatta.crew ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_regatta.parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_regatta.regattas ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_regatta.races ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_regatta.regatta_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_regatta.race_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_regatta.protests ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_regatta.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_regatta.user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for achievements
CREATE POLICY "Users can view all achievements" ON site_regatta.achievements FOR SELECT USING (true);
CREATE POLICY "Users can manage own achievements" ON site_regatta.achievements FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for profiles  
CREATE POLICY "Users can view all profiles" ON site_regatta.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON site_regatta.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON site_regatta.profiles FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for boats
CREATE POLICY "Anyone can view boats" ON site_regatta.boats FOR SELECT USING (true);
CREATE POLICY "Users can manage own boats" ON site_regatta.boats FOR ALL USING (auth.uid() = owner_id);

-- Create RLS policies for crew
CREATE POLICY "Anyone can view available crew" ON site_regatta.crew FOR SELECT USING (true);
CREATE POLICY "Users can manage own crew" ON site_regatta.crew FOR ALL USING (auth.uid() = owner_id);

-- Create RLS policies for parts
CREATE POLICY "Anyone can view parts" ON site_regatta.parts FOR SELECT USING (true);
CREATE POLICY "Users can manage own parts" ON site_regatta.parts FOR ALL USING (auth.uid() = owner_id);

-- Create RLS policies for regattas
CREATE POLICY "Anyone can view regattas" ON site_regatta.regattas FOR SELECT USING (true);
CREATE POLICY "Users can manage own regattas" ON site_regatta.regattas FOR ALL USING (auth.uid() = organizer_id);

-- Create RLS policies for races
CREATE POLICY "Anyone can view races" ON site_regatta.races FOR SELECT USING (true);
CREATE POLICY "Organizers can manage races" ON site_regatta.races FOR ALL USING (
  auth.uid() IN (
    SELECT organizer_id FROM site_regatta.regattas WHERE id = regatta_id
  )
);

-- Create RLS policies for regatta_registrations
CREATE POLICY "Users can view registrations for regattas they organize or part" ON site_regatta.regatta_registrations FOR SELECT USING (
  auth.uid() = user_id OR 
  auth.uid() IN (
    SELECT organizer_id FROM site_regatta.regattas WHERE id = regatta_id
  )
);
CREATE POLICY "Users can manage own registrations" ON site_regatta.regatta_registrations FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for race_results
CREATE POLICY "Anyone can view race results" ON site_regatta.race_results FOR SELECT USING (true);
CREATE POLICY "Organizers can manage race results" ON site_regatta.race_results FOR ALL USING (
  auth.uid() IN (
    SELECT r.organizer_id 
    FROM site_regatta.regattas r 
    JOIN site_regatta.races ra ON ra.regatta_id = r.id 
    WHERE ra.id = race_id
  )
);

-- Create RLS policies for protests
CREATE POLICY "Users can view protests they're involved in" ON site_regatta.protests FOR SELECT USING (
  auth.uid() = protester_id OR auth.uid() = protested_id
);
CREATE POLICY "Users can submit protests" ON site_regatta.protests FOR INSERT WITH CHECK (auth.uid() = protester_id);

-- Create RLS policies for transactions
CREATE POLICY "Users can view own transactions" ON site_regatta.transactions FOR SELECT USING (
  auth.uid() = buyer_id OR auth.uid() = seller_id
);
CREATE POLICY "Users can create transactions" ON site_regatta.transactions FOR INSERT WITH CHECK (
  auth.uid() = buyer_id OR auth.uid() = seller_id
);

-- Create RLS policies for user_settings
CREATE POLICY "Users can manage own settings" ON site_regatta.user_settings FOR ALL USING (auth.uid() = user_id);

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION site_regatta.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON site_regatta.profiles FOR EACH ROW EXECUTE FUNCTION site_regatta.update_updated_at_column();
CREATE TRIGGER update_boats_updated_at BEFORE UPDATE ON site_regatta.boats FOR EACH ROW EXECUTE FUNCTION site_regatta.update_updated_at_column();
CREATE TRIGGER update_crew_updated_at BEFORE UPDATE ON site_regatta.crew FOR EACH ROW EXECUTE FUNCTION site_regatta.update_updated_at_column();
CREATE TRIGGER update_parts_updated_at BEFORE UPDATE ON site_regatta.parts FOR EACH ROW EXECUTE FUNCTION site_regatta.update_updated_at_column();
CREATE TRIGGER update_regattas_updated_at BEFORE UPDATE ON site_regatta.regattas FOR EACH ROW EXECUTE FUNCTION site_regatta.update_updated_at_column();
CREATE TRIGGER update_races_updated_at BEFORE UPDATE ON site_regatta.races FOR EACH ROW EXECUTE FUNCTION site_regatta.update_updated_at_column();
CREATE TRIGGER update_registrations_updated_at BEFORE UPDATE ON site_regatta.regatta_registrations FOR EACH ROW EXECUTE FUNCTION site_regatta.update_updated_at_column();
CREATE TRIGGER update_protests_updated_at BEFORE UPDATE ON site_regatta.protests FOR EACH ROW EXECUTE FUNCTION site_regatta.update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON site_regatta.user_settings FOR EACH ROW EXECUTE FUNCTION site_regatta.update_updated_at_column();

-- Create handle_new_user function for site_regatta
CREATE OR REPLACE FUNCTION site_regatta.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO site_regatta.profiles (id, nickname, email, email_verified)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'nickname', 'Player' || substr(NEW.id::text, 1, 8)),
        NEW.email,
        NEW.email_confirmed_at IS NOT NULL
    );
    
    INSERT INTO site_regatta.user_settings (user_id)
    VALUES (NEW.id);
    
    -- Give welcome achievement
    INSERT INTO site_regatta.achievements (user_id, title, description, category, points)
    VALUES (NEW.id, 'Welcome Aboard', 'Welcome to the sailing world!', 'registration', 10);
    
    RETURN NEW;
END;
$$;

-- Create trigger for new users (will be enabled when auth is properly configured)
-- CREATE TRIGGER on_auth_user_created_regatta
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION site_regatta.handle_new_user();

-- Create player count update function
CREATE OR REPLACE FUNCTION site_regatta.update_regatta_player_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE site_regatta.regattas 
        SET current_players = current_players + 1 
        WHERE id = NEW.regatta_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE site_regatta.regattas 
        SET current_players = current_players - 1 
        WHERE id = OLD.regatta_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

-- Create trigger for player count
CREATE TRIGGER regatta_registration_count_trigger
    AFTER INSERT OR DELETE ON site_regatta.regatta_registrations
    FOR EACH ROW EXECUTE FUNCTION site_regatta.update_regatta_player_count();

-- Create quick match function for site_regatta
CREATE OR REPLACE FUNCTION site_regatta.create_quick_match()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO site_regatta.regattas (
    name,
    class,
    location,
    max_players,
    start_date,
    end_date,
    registration_deadline,
    prize_pool,
    entry_fee,
    status,
    wind_speed,
    wave_height,
    weather_condition,
    organizer_id
  ) VALUES (
    'Quick Match - ' || TO_CHAR(NOW(), 'HH24:MI DD/MM'),
    (ARRAY['j24', 'j70', 'laser'])[1 + FLOOR(RANDOM() * 3)]::boat_class,
    (ARRAY['Monaco, MC', 'Bermuda, BM', 'San Francisco, US', 'Auckland, NZ'])[1 + FLOOR(RANDOM() * 4)],
    (ARRAY[8, 12, 16, 20])[1 + FLOOR(RANDOM() * 4)],
    NOW() + INTERVAL '10 minutes',
    NOW() + INTERVAL '40 minutes',
    NOW() + INTERVAL '8 minutes',
    (ARRAY[1000, 1500, 2000])[1 + FLOOR(RANDOM() * 3)],
    50,
    'open'::regatta_status,
    8 + FLOOR(RANDOM() * 15),
    1 + RANDOM() * 3,
    (ARRAY['sunny', 'cloudy', 'windy'])[1 + FLOOR(RANDOM() * 3)]::weather_condition,
    '00000000-0000-0000-0000-000000000000'::uuid
  );
END;
$$;