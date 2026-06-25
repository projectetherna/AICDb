-- =============================================================================
-- Add consistency_avg to content_stats and update refresh_content_stats()
--
-- Changes:
--   1. content_stats: ADD consistency_avg numeric(2,1) nullable
--   2. refresh_content_stats(): also compute round(avg(consistency),1)
--      over ratings where episode_id IS NULL and consistency > 0.
--      NULL when no non-zero consistency ratings exist.
-- =============================================================================

ALTER TABLE public.content_stats
  ADD COLUMN IF NOT EXISTS consistency_avg numeric(2,1) DEFAULT NULL;


-- =============================================================================
-- Update refresh_content_stats() to also compute consistency_avg
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
  v_consistency_avg   numeric(2,1);
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

  -- Consistency average (only from rows where consistency > 0 was submitted)
  SELECT round(avg(r.consistency)::numeric, 1)
    INTO v_consistency_avg
    FROM public.ratings r
   WHERE r.content_id = p_content_id
     AND r.episode_id IS NULL
     AND r.consistency > 0;

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
    (content_id, rating_count, rating_avg, originality_avg, consistency_avg,
     comment_count, watchlist_count, engagement_score, last_activity_at, updated_at)
  VALUES
    (p_content_id, COALESCE(v_rating_count, 0), v_rating_avg, v_originality_avg,
     v_consistency_avg, COALESCE(v_comment_count, 0), COALESCE(v_watchlist_count, 0),
     COALESCE(v_engagement, 0), v_last_activity, now())
  ON CONFLICT (content_id) DO UPDATE
    SET rating_count      = EXCLUDED.rating_count,
        rating_avg        = EXCLUDED.rating_avg,
        originality_avg   = EXCLUDED.originality_avg,
        consistency_avg   = EXCLUDED.consistency_avg,
        comment_count     = EXCLUDED.comment_count,
        watchlist_count   = EXCLUDED.watchlist_count,
        engagement_score  = EXCLUDED.engagement_score,
        last_activity_at  = EXCLUDED.last_activity_at,
        updated_at        = EXCLUDED.updated_at;
END;
$$;
