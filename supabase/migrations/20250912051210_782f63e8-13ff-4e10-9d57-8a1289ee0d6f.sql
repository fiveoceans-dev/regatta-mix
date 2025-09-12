-- Create site_regatta schema and move all regatta-related tables
CREATE SCHEMA IF NOT EXISTS site_regatta;

-- Move tables from public to site_regatta schema
-- Note: We'll recreate tables in new schema with proper RLS policies

-- 1. Achievements table
CREATE TABLE site_regatta.achievements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title character varying NOT NULL,
    description text,
    category character varying NOT NULL,
    points integer DEFAULT 0,
    earned_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE site_regatta.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own achievements" ON site_regatta.achievements
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view all achievements" ON site_regatta.achievements
    FOR SELECT USING (true);

-- 2. Boats table
CREATE TABLE site_regatta.boats (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name character varying NOT NULL,
    class boat_class NOT NULL,
    price integer NOT NULL,
    rating integer NOT NULL,
    speed integer NOT NULL,
    handling integer NOT NULL,
    condition boat_condition DEFAULT 'good'::boat_condition,
    owner_id uuid,
    seller_id uuid,
    year_built integer,
    last_maintenance_date date,
    maintenance_cost integer DEFAULT 0,
    insurance_expiry date,
    hull_number character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE site_regatta.boats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view boats" ON site_regatta.boats
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own boats" ON site_regatta.boats
    FOR ALL USING (auth.uid() = owner_id);

-- 3. Parts table
CREATE TABLE site_regatta.parts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name character varying NOT NULL,
    category part_category NOT NULL,
    price integer NOT NULL,
    rating integer NOT NULL,
    performance integer NOT NULL,
    weight numeric,
    condition boat_condition DEFAULT 'good'::boat_condition,
    owner_id uuid,
    seller_id uuid,
    compatible_classes boat_class[],
    warranty_months integer DEFAULT 0,
    manufacturer character varying,
    model character varying,
    serial_number character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE site_regatta.parts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view parts" ON site_regatta.parts
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own parts" ON site_regatta.parts
    FOR ALL USING (auth.uid() = owner_id);

-- 4. Crew table
CREATE TABLE site_regatta.crew (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name character varying NOT NULL,
    role crew_role NOT NULL,
    salary integer NOT NULL,
    rating integer NOT NULL,
    experience integer DEFAULT 0,
    status crew_status DEFAULT 'available'::crew_status,
    owner_id uuid,
    seller_id uuid,
    contract_start_date date,
    contract_end_date date,
    performance_bonus integer DEFAULT 0,
    injury_recovery_days integer DEFAULT 0,
    specialty text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE site_regatta.crew ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available crew" ON site_regatta.crew
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own crew" ON site_regatta.crew
    FOR ALL USING (auth.uid() = owner_id);

-- 5. Regattas table
CREATE TABLE site_regatta.regattas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name character varying NOT NULL,
    description text,
    location character varying NOT NULL,
    class boat_class NOT NULL,
    max_players integer NOT NULL,
    current_players integer DEFAULT 0,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    registration_deadline timestamp with time zone NOT NULL,
    latitude numeric,
    longitude numeric,
    prize_pool integer NOT NULL,
    entry_fee integer NOT NULL,
    status regatta_status DEFAULT 'upcoming'::regatta_status,
    weather_condition weather_condition,
    wind_speed integer,
    wave_height numeric,
    race_distance numeric,
    number_of_races integer DEFAULT 1,
    organizer_id uuid,
    code character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE site_regatta.regattas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view regattas" ON site_regatta.regattas
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own regattas" ON site_regatta.regattas
    FOR ALL USING (auth.uid() = organizer_id);

-- 6. Regatta registrations table
CREATE TABLE site_regatta.regatta_registrations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    regatta_id uuid,
    user_id uuid,
    boat_id uuid,
    crew_ids uuid[],
    registration_date timestamp with time zone DEFAULT now(),
    paid boolean DEFAULT false,
    final_position integer,
    total_points integer DEFAULT 0,
    prize_money integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE site_regatta.regatta_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own registrations" ON site_regatta.regatta_registrations
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view registrations for regattas they organize or participate" ON site_regatta.regatta_registrations
    FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.uid() IN (
            SELECT organizer_id FROM site_regatta.regattas WHERE id = regatta_registrations.regatta_id
        )
    );

-- 7. Races table
CREATE TABLE site_regatta.races (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    regatta_id uuid,
    race_number integer NOT NULL,
    name character varying,
    start_time timestamp with time zone NOT NULL,
    status race_status DEFAULT 'not_started'::race_status,
    wind_speed integer,
    wind_direction integer,
    weather_condition weather_condition,
    course_length numeric,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE site_regatta.races ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view races" ON site_regatta.races
    FOR SELECT USING (true);

CREATE POLICY "Organizers can manage races" ON site_regatta.races
    FOR ALL USING (
        auth.uid() IN (
            SELECT organizer_id FROM site_regatta.regattas WHERE id = races.regatta_id
        )
    );

-- 8. Race results table
CREATE TABLE site_regatta.race_results (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    race_id uuid,
    registration_id uuid,
    position integer NOT NULL,
    finish_time timestamp with time zone,
    points integer DEFAULT 0,
    dnf boolean DEFAULT false,
    dsq boolean DEFAULT false,
    penalty_points integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE site_regatta.race_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view race results" ON site_regatta.race_results
    FOR SELECT USING (true);

CREATE POLICY "Organizers can manage race results" ON site_regatta.race_results
    FOR ALL USING (
        auth.uid() IN (
            SELECT r.organizer_id FROM site_regatta.regattas r
            JOIN site_regatta.races ra ON ra.regatta_id = r.id
            WHERE ra.id = race_results.race_id
        )
    );

-- 9. Protests table
CREATE TABLE site_regatta.protests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    race_id uuid,
    protester_id uuid,
    protested_id uuid,
    incident_description text NOT NULL,
    rule_citation character varying,
    status protest_status DEFAULT 'submitted'::protest_status,
    jury_decision text,
    penalty_imposed text,
    submitted_at timestamp with time zone DEFAULT now(),
    decision_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE site_regatta.protests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can submit protests" ON site_regatta.protests
    FOR INSERT WITH CHECK (auth.uid() = protester_id);

CREATE POLICY "Users can view protests they're involved in" ON site_regatta.protests
    FOR SELECT USING (auth.uid() = protester_id OR auth.uid() = protested_id);

-- 10. Transactions table
CREATE TABLE site_regatta.transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id uuid,
    seller_id uuid,
    item_id uuid NOT NULL,
    item_type character varying NOT NULL,
    price integer NOT NULL,
    commission integer DEFAULT 0,
    status character varying DEFAULT 'pending'::character varying,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE site_regatta.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create transactions" ON site_regatta.transactions
    FOR INSERT WITH CHECK (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can view own transactions" ON site_regatta.transactions
    FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- 11. User settings table
CREATE TABLE site_regatta.user_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid,
    theme character varying DEFAULT 'auto'::character varying,
    language character varying DEFAULT 'en'::character varying,
    graphics_quality character varying DEFAULT 'medium'::character varying,
    audio_enabled boolean DEFAULT true,
    music_volume integer DEFAULT 50,
    sfx_volume integer DEFAULT 75,
    auto_save boolean DEFAULT true,
    notifications_enabled boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE site_regatta.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own settings" ON site_regatta.user_settings
    FOR ALL USING (auth.uid() = user_id);

-- 12. Profiles table (keep in public for shared access)
-- Profiles will remain in public schema as they're shared across sites

-- Create functions for site_regatta schema
CREATE OR REPLACE FUNCTION site_regatta.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = site_regatta, public
AS $$
BEGIN
    -- Insert user settings for new user
    INSERT INTO site_regatta.user_settings (user_id)
    VALUES (NEW.id);
    
    -- Give welcome achievement
    INSERT INTO site_regatta.achievements (user_id, title, description, category, points)
    VALUES (NEW.id, 'Welcome Aboard', 'Welcome to the sailing world!', 'registration', 10);
    
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION site_regatta.update_regatta_player_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = site_regatta
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

CREATE OR REPLACE FUNCTION site_regatta.create_quick_match()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = site_regatta
AS $$
BEGIN
  -- Insert a new quick match regatta every 10 minutes
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
    '00000000-0000-0000-0000-000000000000'::uuid  -- System user
  );
END;
$$;

-- Create triggers for site_regatta
CREATE TRIGGER update_regatta_player_count_trigger
    AFTER INSERT OR DELETE ON site_regatta.regatta_registrations
    FOR EACH ROW EXECUTE FUNCTION site_regatta.update_regatta_player_count();

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION site_regatta.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = site_regatta
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_boats_updated_at
    BEFORE UPDATE ON site_regatta.boats
    FOR EACH ROW EXECUTE FUNCTION site_regatta.update_updated_at_column();

CREATE TRIGGER update_parts_updated_at
    BEFORE UPDATE ON site_regatta.parts
    FOR EACH ROW EXECUTE FUNCTION site_regatta.update_updated_at_column();

CREATE TRIGGER update_crew_updated_at
    BEFORE UPDATE ON site_regatta.crew
    FOR EACH ROW EXECUTE FUNCTION site_regatta.update_updated_at_column();

CREATE TRIGGER update_regattas_updated_at
    BEFORE UPDATE ON site_regatta.regattas
    FOR EACH ROW EXECUTE FUNCTION site_regatta.update_updated_at_column();

CREATE TRIGGER update_regatta_registrations_updated_at
    BEFORE UPDATE ON site_regatta.regatta_registrations
    FOR EACH ROW EXECUTE FUNCTION site_regatta.update_updated_at_column();

CREATE TRIGGER update_races_updated_at
    BEFORE UPDATE ON site_regatta.races
    FOR EACH ROW EXECUTE FUNCTION site_regatta.update_updated_at_column();

CREATE TRIGGER update_protests_updated_at
    BEFORE UPDATE ON site_regatta.protests
    FOR EACH ROW EXECUTE FUNCTION site_regatta.update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON site_regatta.user_settings
    FOR EACH ROW EXECUTE FUNCTION site_regatta.update_updated_at_column();