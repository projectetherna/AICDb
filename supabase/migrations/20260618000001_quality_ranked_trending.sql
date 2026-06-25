-- =============================================================================
-- Fix homepage_trending: rank by quality (rating_avg DESC) not engagement.
--
-- The original view ordered by cs.engagement_score which is a weighted sum of
-- rating_count + comment_count + watchlist_count + time-decay — an activity /
-- popularity signal, not a quality signal.  Dreamwall's product decision is
-- quality-first discovery: the default homepage ranking must be the multi-
-- dimensional rating average (rating_avg), not raw interaction counts.
--
-- New ranking: rating_avg DESC NULLS LAST (titles with the highest average
-- score surface first), then published_at DESC as a tiebreaker so the newest
-- equally-rated title wins.  Titles with no ratings yet appear at the bottom
-- ordered by published_at so fresh content is still discoverable.
-- =============================================================================

CREATE OR REPLACE VIEW public.homepage_trending
  WITH (security_invoker = true)
AS
  SELECT
    c.id, c.type, c.status, c.slug, c.title, c.synopsis, c.poster_url,
    c.release_year, c.duration_minutes, c.language, c.country,
    c.external_url, c.embed_code, c.ai_tools, c.credits,
    c.submitted_by, c.published_at, c.created_at, c.updated_at,
    cs.rating_count, cs.rating_avg, cs.comment_count,
    cs.watchlist_count, cs.engagement_score, cs.last_activity_at
  FROM public.content c
  LEFT JOIN public.content_stats cs ON cs.content_id = c.id
  WHERE c.status = 'published'
  ORDER BY
    cs.rating_avg   DESC NULLS LAST,
    c.published_at  DESC NULLS LAST,
    c.created_at    DESC;
