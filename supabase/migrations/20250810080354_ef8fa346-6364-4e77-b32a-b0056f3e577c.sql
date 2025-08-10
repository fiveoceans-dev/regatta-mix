-- Fix the search_path security issue for update_regatta_player_count function
CREATE OR REPLACE FUNCTION public.update_regatta_player_count()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';