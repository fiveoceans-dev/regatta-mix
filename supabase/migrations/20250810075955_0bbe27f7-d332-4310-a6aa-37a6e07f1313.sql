-- Create enums for better data integrity
CREATE TYPE public.crew_role AS ENUM ('skipper', 'tactician', 'trimmer', 'grinder', 'bowman');
CREATE TYPE public.crew_status AS ENUM ('available', 'contracted', 'injured', 'retired');
CREATE TYPE public.boat_class AS ENUM ('j24', 'j70', 'laser', 'optimist', 'flying_dutchman');
CREATE TYPE public.boat_condition AS ENUM ('excellent', 'good', 'fair', 'poor', 'damaged');
CREATE TYPE public.part_category AS ENUM ('sail', 'mast', 'rudder', 'keel', 'rigging', 'electronics', 'safety');
CREATE TYPE public.regatta_status AS ENUM ('upcoming', 'registration_open', 'registration_closed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.protest_status AS ENUM ('submitted', 'under_review', 'dismissed', 'upheld');
CREATE TYPE public.weather_condition AS ENUM ('calm', 'light_breeze', 'moderate_breeze', 'strong_breeze', 'gale');
CREATE TYPE public.race_status AS ENUM ('not_started', 'in_progress', 'finished', 'abandoned');
CREATE TYPE public.user_rank AS ENUM ('novice', 'intermediate', 'advanced', 'expert', 'professional');

-- Profiles table (core user data)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nickname VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    rank public.user_rank DEFAULT 'novice',
    total_races INTEGER DEFAULT 0,
    karma INTEGER DEFAULT 100,
    credits INTEGER DEFAULT 1000,
    country VARCHAR(2), -- ISO country code
    timezone VARCHAR(50) DEFAULT 'UTC',
    avatar_url TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User settings
CREATE TABLE public.user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    audio_enabled BOOLEAN DEFAULT TRUE,
    music_volume INTEGER DEFAULT 50 CHECK (music_volume >= 0 AND music_volume <= 100),
    sfx_volume INTEGER DEFAULT 75 CHECK (sfx_volume >= 0 AND sfx_volume <= 100),
    graphics_quality VARCHAR(20) DEFAULT 'medium' CHECK (graphics_quality IN ('low', 'medium', 'high', 'ultra')),
    auto_save BOOLEAN DEFAULT TRUE,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    language VARCHAR(5) DEFAULT 'en',
    theme VARCHAR(10) DEFAULT 'auto' CHECK (theme IN ('light', 'dark', 'auto')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Crew marketplace
CREATE TABLE public.crew (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    role public.crew_role NOT NULL,
    salary INTEGER NOT NULL CHECK (salary > 0),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 100),
    experience INTEGER DEFAULT 0 CHECK (experience >= 0),
    specialty TEXT,
    status public.crew_status DEFAULT 'available',
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    contract_start_date DATE,
    contract_end_date DATE,
    performance_bonus INTEGER DEFAULT 0,
    injury_recovery_days INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Boats marketplace
CREATE TABLE public.boats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    class public.boat_class NOT NULL,
    price INTEGER NOT NULL CHECK (price > 0),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 100),
    speed INTEGER NOT NULL CHECK (speed >= 1 AND speed <= 100),
    handling INTEGER NOT NULL CHECK (handling >= 1 AND handling <= 100),
    condition public.boat_condition DEFAULT 'good',
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    year_built INTEGER,
    hull_number VARCHAR(50),
    last_maintenance_date DATE,
    maintenance_cost INTEGER DEFAULT 0,
    insurance_expiry DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Parts marketplace
CREATE TABLE public.parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    category public.part_category NOT NULL,
    price INTEGER NOT NULL CHECK (price > 0),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 100),
    performance INTEGER NOT NULL CHECK (performance >= 1 AND performance <= 100),
    weight DECIMAL(8,2) CHECK (weight > 0), -- in kg
    condition public.boat_condition DEFAULT 'good',
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    compatible_classes public.boat_class[],
    warranty_months INTEGER DEFAULT 0,
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Regattas/Events
CREATE TABLE public.regattas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    class public.boat_class NOT NULL,
    max_players INTEGER NOT NULL CHECK (max_players > 0),
    current_players INTEGER DEFAULT 0 CHECK (current_players >= 0),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    registration_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(200) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    prize_pool INTEGER NOT NULL CHECK (prize_pool >= 0),
    entry_fee INTEGER NOT NULL CHECK (entry_fee >= 0),
    status public.regatta_status DEFAULT 'upcoming',
    weather_condition public.weather_condition,
    wind_speed INTEGER, -- in knots
    wave_height DECIMAL(4,2), -- in meters
    organizer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    race_distance DECIMAL(8,2), -- in nautical miles
    number_of_races INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (end_date > start_date),
    CHECK (registration_deadline <= start_date)
);

-- Regatta registrations
CREATE TABLE public.regatta_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    regatta_id UUID REFERENCES public.regattas(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    boat_id UUID REFERENCES public.boats(id) ON DELETE CASCADE,
    crew_ids UUID[], -- Array of crew member IDs
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paid BOOLEAN DEFAULT FALSE,
    final_position INTEGER,
    total_points INTEGER DEFAULT 0,
    prize_money INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(regatta_id, user_id)
);

-- Individual races within regattas
CREATE TABLE public.races (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    regatta_id UUID REFERENCES public.regattas(id) ON DELETE CASCADE,
    race_number INTEGER NOT NULL,
    name VARCHAR(200),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status public.race_status DEFAULT 'not_started',
    wind_speed INTEGER, -- in knots
    wind_direction INTEGER, -- in degrees (0-360)
    weather_condition public.weather_condition,
    course_length DECIMAL(8,2), -- in nautical miles
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(regatta_id, race_number)
);

-- Race results
CREATE TABLE public.race_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    race_id UUID REFERENCES public.races(id) ON DELETE CASCADE,
    registration_id UUID REFERENCES public.regatta_registrations(id) ON DELETE CASCADE,
    position INTEGER NOT NULL CHECK (position > 0),
    finish_time TIMESTAMP WITH TIME ZONE,
    points INTEGER NOT NULL DEFAULT 0,
    dnf BOOLEAN DEFAULT FALSE, -- Did Not Finish
    dsq BOOLEAN DEFAULT FALSE, -- Disqualified
    penalty_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(race_id, registration_id),
    UNIQUE(race_id, position) -- Ensure no duplicate positions per race
);

-- Protests system
CREATE TABLE public.protests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    race_id UUID REFERENCES public.races(id) ON DELETE CASCADE,
    protester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    protested_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    incident_description TEXT NOT NULL,
    rule_citation VARCHAR(50),
    status public.protest_status DEFAULT 'submitted',
    jury_decision TEXT,
    penalty_imposed TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    decision_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketplace transactions
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('crew', 'boat', 'part')),
    item_id UUID NOT NULL,
    price INTEGER NOT NULL CHECK (price > 0),
    commission INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements
CREATE TABLE public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    points INTEGER DEFAULT 0,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crew ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regattas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regatta_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.races ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.race_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_settings
CREATE POLICY "Users can manage own settings" ON public.user_settings FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for crew
CREATE POLICY "Anyone can view available crew" ON public.crew FOR SELECT USING (true);
CREATE POLICY "Users can manage own crew" ON public.crew FOR ALL USING (auth.uid() = owner_id);

-- RLS Policies for boats
CREATE POLICY "Anyone can view boats" ON public.boats FOR SELECT USING (true);
CREATE POLICY "Users can manage own boats" ON public.boats FOR ALL USING (auth.uid() = owner_id);

-- RLS Policies for parts
CREATE POLICY "Anyone can view parts" ON public.parts FOR SELECT USING (true);
CREATE POLICY "Users can manage own parts" ON public.parts FOR ALL USING (auth.uid() = owner_id);

-- RLS Policies for regattas
CREATE POLICY "Anyone can view regattas" ON public.regattas FOR SELECT USING (true);
CREATE POLICY "Users can manage own regattas" ON public.regattas FOR ALL USING (auth.uid() = organizer_id);

-- RLS Policies for regatta_registrations
CREATE POLICY "Users can view registrations for regattas they organize or participate in" ON public.regatta_registrations FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() IN (SELECT organizer_id FROM public.regattas WHERE id = regatta_id)
);
CREATE POLICY "Users can manage own registrations" ON public.regatta_registrations FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for races
CREATE POLICY "Anyone can view races" ON public.races FOR SELECT USING (true);
CREATE POLICY "Organizers can manage races" ON public.races FOR ALL USING (
    auth.uid() IN (SELECT organizer_id FROM public.regattas WHERE id = regatta_id)
);

-- RLS Policies for race_results
CREATE POLICY "Anyone can view race results" ON public.race_results FOR SELECT USING (true);
CREATE POLICY "Organizers can manage race results" ON public.race_results FOR ALL USING (
    auth.uid() IN (
        SELECT r.organizer_id 
        FROM public.regattas r 
        JOIN public.races ra ON ra.regatta_id = r.id 
        WHERE ra.id = race_id
    )
);

-- RLS Policies for protests
CREATE POLICY "Users can view protests they're involved in" ON public.protests FOR SELECT USING (
    auth.uid() = protester_id OR auth.uid() = protested_id
);
CREATE POLICY "Users can submit protests" ON public.protests FOR INSERT WITH CHECK (auth.uid() = protester_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (
    auth.uid() = buyer_id OR auth.uid() = seller_id
);
CREATE POLICY "Users can create transactions" ON public.transactions FOR INSERT WITH CHECK (
    auth.uid() = buyer_id OR auth.uid() = seller_id
);

-- RLS Policies for achievements
CREATE POLICY "Users can view all achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Users can manage own achievements" ON public.achievements FOR ALL USING (auth.uid() = user_id);

-- Create update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_crew_updated_at BEFORE UPDATE ON public.crew FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_boats_updated_at BEFORE UPDATE ON public.boats FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_parts_updated_at BEFORE UPDATE ON public.parts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_regattas_updated_at BEFORE UPDATE ON public.regattas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_regatta_registrations_updated_at BEFORE UPDATE ON public.regatta_registrations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_races_updated_at BEFORE UPDATE ON public.races FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_protests_updated_at BEFORE UPDATE ON public.protests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id, nickname, email, email_verified)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'nickname', 'Player' || substr(NEW.id::text, 1, 8)),
        NEW.email,
        NEW.email_confirmed_at IS NOT NULL
    );
    
    INSERT INTO public.user_settings (user_id)
    VALUES (NEW.id);
    
    -- Give welcome achievement
    INSERT INTO public.achievements (user_id, title, description, category, points)
    VALUES (NEW.id, 'Welcome Aboard', 'Welcome to the sailing world!', 'registration', 10);
    
    RETURN NEW;
END;
$$;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update regatta player count
CREATE OR REPLACE FUNCTION public.update_regatta_player_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.regattas 
        SET current_players = current_players + 1 
        WHERE id = NEW.regatta_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.regattas 
        SET current_players = current_players - 1 
        WHERE id = OLD.regatta_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

-- Trigger to automatically update player count
CREATE TRIGGER update_regatta_player_count_trigger
    AFTER INSERT OR DELETE ON public.regatta_registrations
    FOR EACH ROW EXECUTE FUNCTION public.update_regatta_player_count();

-- Create indexes for better performance
CREATE INDEX idx_profiles_nickname ON public.profiles(nickname);
CREATE INDEX idx_profiles_rank ON public.profiles(rank);
CREATE INDEX idx_crew_role_status ON public.crew(role, status);
CREATE INDEX idx_boats_class_condition ON public.boats(class, condition);
CREATE INDEX idx_parts_category_condition ON public.parts(category, condition);
CREATE INDEX idx_regattas_status_start_date ON public.regattas(status, start_date);
CREATE INDEX idx_regattas_class ON public.regattas(class);
CREATE INDEX idx_regatta_registrations_regatta_user ON public.regatta_registrations(regatta_id, user_id);
CREATE INDEX idx_races_regatta_status ON public.races(regatta_id, status);
CREATE INDEX idx_race_results_race_position ON public.race_results(race_id, position);
CREATE INDEX idx_transactions_buyer_seller ON public.transactions(buyer_id, seller_id);
CREATE INDEX idx_achievements_user_category ON public.achievements(user_id, category);