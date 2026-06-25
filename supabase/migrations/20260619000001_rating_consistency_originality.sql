-- =============================================================================
-- Rating system: add consistency + originality dimensions
--
-- Changes:
--   1. ratings table
--      - ADD consistency  numeric(2,1) NOT NULL DEFAULT 0, is_half_step_rating check
--      - ADD originality  smallint     DEFAULT NULL,       0–100 range check
--      - Rebuild main_score GENERATED column (identical formula avg(v,s,sc)/3 —
--        explicitly excluding consistency and originality)
--      - ADD validate_originality BEFORE trigger: 1000-rating gate
--
--   2. content_stats table
--      - ADD originality_avg numeric(5,1) nullable
--      - Update refresh_content_stats() to compute it
-- =============================================================================


-- =============================================================================
-- 1. ratings — new columns
-- =============================================================================

ALTER TABLE public.ratings
  ADD COLUMN IF NOT EXISTS consistency numeric(2,1) NOT NULL DEFAULT 0;

ALTER TABLE public.ratings
  ADD COLUMN IF NOT EXISTS originality smallint DEFAULT NULL;

-- CHECK constraints (idempotent-safe via DO block)
DO $$ BEGIN
  ALTER TABLE public.ratings
    ADD CONSTRAINT ratings_consistency_half_step CHECK (public.is_half_step_rating(consistency));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.ratings
    ADD CONSTRAINT ratings_originality_range
      CHECK (originality IS NULL OR (originality >= 0 AND originality <= 100));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- =============================================================================
-- 1b. Rebuild main_score GENERATED column
--
-- GENERATED ALWAYS AS columns cannot be altered in place; must be dropped and
-- re-added.  The formula is intentionally identical to the original:
--   ROUND((visuals + sound_design + script) / 3.0, 2)
-- This round-trip documents and enforces that consistency and originality are
-- permanently excluded from the main quality score.
-- =============================================================================

-- Drop the index that depends on main_score first
DROP INDEX IF EXISTS public.ratings_main_score_idx;

-- Drop and re-add the generated column
ALTER TABLE public.ratings DROP COLUMN IF EXISTS main_score;

ALTER TABLE public.ratings
  ADD COLUMN main_score numeric(3,2)
    GENERATED ALWAYS AS (ROUND((visuals + sound_design + script) / 3.0, 2)) STORED;

-- Recreate the index
CREATE INDEX IF NOT EXISTS ratings_main_score_idx
  ON public.ratings (main_score DESC);


-- =============================================================================
-- 1c. validate_originality trigger
--
-- Enforces that a user must have rated at least 1000 distinct content items
-- (episode_id IS NULL = content-level ratings) before they can set originality
-- on any content.  Fires BEFORE INSERT OR UPDATE so the write is blocked before
-- it reaches the table.
--
-- Note: visuals/sound_design/script remain NOT NULL, so an originality-only row
-- is impossible; originality can only ever appear alongside a quality rating.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.validate_originality()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  v_count integer;
BEGIN
  -- Only enforce when the caller is trying to set an originality value
  IF NEW.originality IS NULL THEN
    RETURN NEW;
  END IF;

  -- Count this user's content-level ratings.
  -- For INSERT: the new row is not yet stored, so a count of 1000 existing rows
  --             means this would be their 1001st — still gate at >= 1000.
  -- For UPDATE: the row already exists and is included in the count, so the
  --             same threshold of 1000 applies.
  SELECT count(*)
    INTO v_count
    FROM public.ratings
   WHERE user_id = NEW.user_id
     AND episode_id IS NULL;

  IF v_count < 1000 THEN
    RAISE EXCEPTION 'originality_gate: user must have rated at least 1000 titles (currently %)', v_count;
  END IF;

  RETURN NEW;
END;
$$;

-- Drop old version if it exists, then create fresh
DROP TRIGGER IF EXISTS ratings_validate_originality ON public.ratings;

CREATE TRIGGER ratings_validate_originality
  BEFORE INSERT OR UPDATE ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION public.validate_originality();


-- =============================================================================
-- 2. content_stats — add originality_avg
-- =============================================================================

ALTER TABLE public.content_stats
  ADD COLUMN IF NOT EXISTS originality_avg numeric(5,1) DEFAULT NULL;


-- =============================================================================
-- 2b. Update refresh_content_stats() to also compute originality_avg
-- =============================================================================

CREATE OR REPLACE FUNCTION public.refresh_content_stats(p_content_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_rating_count      integer;
  v_rating_avg        numeric(3,2);
  v_originality_avg   numeric(5,1);
  v_comment_count     integer;
  v_watchlist_count   integer;
  v_last_activity     timestamptz;
  v_engagement        numeric(12,4);
  v_days_since_activity numeric;
BEGIN
  -- Quality rating stats (content-level rows only)
  SELECT count(*), round(avg(r.main_score)::numeric, 2)
    INTO v_rating_count, v_rating_avg
    FROM public.ratings r
   WHERE r.content_id = p_content_id AND r.episode_id IS NULL;

  -- Originality average (only from rows where originality has been set)
  SELECT round(avg(r.originality)::numeric, 1)
    INTO v_originality_avg
    FROM public.ratings r
   WHERE r.content_id = p_content_id
     AND r.episode_id IS NULL
     AND r.originality IS NOT NULL;

  SELECT count(*) INTO v_comment_count
    FROM public.comments c WHERE c.content_id = p_content_id;

  SELECT count(*) INTO v_watchlist_count
    FROM public.watchlist w WHERE w.content_id = p_content_id;

  SELECT GREATEST(
    COALESCE((SELECT max(r.updated_at) FROM public.ratings  r WHERE r.content_id = p_content_id), '-infinity'::timestamptz),
    COALESCE((SELECT max(c.created_at) FROM public.comments c WHERE c.content_id = p_content_id), '-infinity'::timestamptz),
    COALESCE((SELECT max(w.created_at) FROM public.watchlist w WHERE w.content_id = p_content_id), '-infinity'::timestamptz)
  ) INTO v_last_activity;

  IF v_last_activity = '-infinity'::timestamptz THEN v_last_activity := NULL; END IF;

  v_days_since_activity := CASE
    WHEN v_last_activity IS NULL THEN 365
    ELSE GREATEST(0, EXTRACT(EPOCH FROM (now() - v_last_activity)) / 86400.0)
  END;

  v_engagement := (
    (COALESCE(v_rating_count,  0) * 3.0)
  + (COALESCE(v_comment_count, 0) * 2.0)
  + (COALESCE(v_watchlist_count, 0) * 1.0)
  + (COALESCE(v_rating_avg, 0) * COALESCE(v_rating_count, 0) * 0.5)
  ) / (1.0 + (v_days_since_activity / 14.0));

  INSERT INTO public.content_stats
    (content_id, rating_count, rating_avg, originality_avg, comment_count,
     watchlist_count, engagement_score, last_activity_at, updated_at)
  VALUES
    (p_content_id, COALESCE(v_rating_count, 0), v_rating_avg, v_originality_avg,
     COALESCE(v_comment_count, 0), COALESCE(v_watchlist_count, 0),
     COALESCE(v_engagement, 0), v_last_activity, now())
  ON CONFLICT (content_id) DO UPDATE
    SET rating_count      = EXCLUDED.rating_count,
        rating_avg        = EXCLUDED.rating_avg,
        originality_avg   = EXCLUDED.originality_avg,
        comment_count     = EXCLUDED.comment_count,
        watchlist_count   = EXCLUDED.watchlist_count,
        engagement_score  = EXCLUDED.engagement_score,
        last_activity_at  = EXCLUDED.last_activity_at,
        updated_at        = EXCLUDED.updated_at;
END;
$$;
