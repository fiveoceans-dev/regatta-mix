-- Enable pg_cron extension for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create quick match generation function
CREATE OR REPLACE FUNCTION public.create_quick_match()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Insert a new quick match regatta every 10 minutes
  INSERT INTO public.regattas (
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

-- Schedule the function to run every 10 minutes
SELECT cron.schedule(
  'quick-match-generator',
  '*/10 * * * *',  -- Every 10 minutes
  $$SELECT public.create_quick_match();$$
);