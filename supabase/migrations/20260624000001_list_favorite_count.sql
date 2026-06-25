-- Add favorite_count to lists (mirrors view_count pattern for list_favorites).

ALTER TABLE public.lists
  ADD COLUMN IF NOT EXISTS favorite_count integer NOT NULL DEFAULT 0;

ALTER TABLE public.lists
  DROP CONSTRAINT IF EXISTS lists_favorite_count_nn;

ALTER TABLE public.lists
  ADD CONSTRAINT lists_favorite_count_nn CHECK (favorite_count >= 0);

CREATE OR REPLACE FUNCTION public.increment_list_favorite_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.lists
     SET favorite_count = favorite_count + 1
   WHERE id = NEW.list_id;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_list_favorite_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.lists
     SET favorite_count = GREATEST(favorite_count - 1, 0)
   WHERE id = OLD.list_id;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS list_favorites_increment_count ON public.list_favorites;
CREATE TRIGGER list_favorites_increment_count
  AFTER INSERT ON public.list_favorites
  FOR EACH ROW EXECUTE FUNCTION public.increment_list_favorite_count();

DROP TRIGGER IF EXISTS list_favorites_decrement_count ON public.list_favorites;
CREATE TRIGGER list_favorites_decrement_count
  AFTER DELETE ON public.list_favorites
  FOR EACH ROW EXECUTE FUNCTION public.decrement_list_favorite_count();

UPDATE public.lists l
   SET favorite_count = COALESCE((
     SELECT count(*)::integer FROM public.list_favorites f WHERE f.list_id = l.id
   ), 0);
