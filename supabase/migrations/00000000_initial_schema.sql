-- =============================================================================
-- Dreamwall — Initial Schema (authoritative snapshot)
-- Exported from live Supabase project zvvkejehuludrsabsesd on 2026-06-18
--
-- This file captures the complete public schema as it exists on the live
-- database.  It is idempotent (uses IF NOT EXISTS / OR REPLACE / ON CONFLICT)
-- so it can be applied to a brand-new Supabase project to reproduce the full
-- schema from scratch.
--
-- Sections (in dependency order):
--   1. Extensions
--   2. Enum types
--   3. Helper functions (needed by constraints / triggers)
--   4. Tables
--   5. Unique indexes (beyond primary keys)
--   6. Plain indexes
--   7. Trigger functions
--   8. Triggers (public schema tables + auth.users)
--   9. Views
--  10. Storage bucket
-- =============================================================================


-- =============================================================================
-- 1. Extensions
-- =============================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- uuid_generate_v4() (Supabase default)


-- =============================================================================
-- 2. Enum types
-- =============================================================================
DO $$ BEGIN
  CREATE TYPE public.content_type AS ENUM ('film', 'series');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.content_status AS ENUM ('draft', 'pending', 'published', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- =============================================================================
-- 3. Helper functions (used by CHECK constraints and triggers)
-- =============================================================================

-- is_half_step_rating: validates that a rating is 0.0–5.0 in 0.5 increments
CREATE OR REPLACE FUNCTION public.is_half_step_rating(value numeric)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT value >= 0 AND value <= 5 AND (value * 2) = trunc(value * 2);
$$;


-- =============================================================================
-- 4. Tables (in FK dependency order)
-- =============================================================================

-- ── profiles ──────────────────────────────────────────────────────────────────
-- One row per auth.users entry, created by the handle_new_user trigger.
CREATE TABLE IF NOT EXISTS public.profiles (
  id           uuid        NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username     text        NOT NULL,
  display_name text,
  avatar_url   text,
  bio          text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  is_admin     boolean     NOT NULL DEFAULT false,
  banner_url   text,
  quote        text,
  quote_from   text,

  CONSTRAINT profiles_username_length  CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT profiles_username_format  CHECK (username ~ '^[a-zA-Z0-9_]+$')
);

-- ── content ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.content (
  id               uuid           NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  type             content_type   NOT NULL,
  status           content_status NOT NULL DEFAULT 'pending',
  slug             text           NOT NULL,
  title            text           NOT NULL,
  synopsis         text,
  poster_url       text,
  release_year     smallint,
  duration_minutes integer,
  language         text,
  country          text,
  external_url     text,
  embed_code       text,
  ai_tools         text[]         DEFAULT '{}',
  credits          jsonb          DEFAULT '{}',
  submitted_by     uuid           NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  published_at     timestamptz,
  created_at       timestamptz    NOT NULL DEFAULT now(),
  updated_at       timestamptz    NOT NULL DEFAULT now(),

  CONSTRAINT content_slug_format              CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT content_title_length             CHECK (char_length(title) >= 1 AND char_length(title) <= 300),
  CONSTRAINT content_release_year_range       CHECK (release_year IS NULL OR (release_year >= 1900 AND release_year <= 2100)),
  CONSTRAINT content_duration_positive        CHECK (duration_minutes IS NULL OR duration_minutes > 0),
  CONSTRAINT content_film_has_playback_when_published CHECK (
    type <> 'film' OR status <> 'published'
    OR external_url IS NOT NULL
    OR NULLIF(TRIM(embed_code), '') IS NOT NULL
  )
);

-- ── tags ──────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tags (
  id         uuid        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  slug       text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT tags_name_length  CHECK (char_length(name) >= 1 AND char_length(name) <= 50),
  CONSTRAINT tags_slug_format  CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

-- ── content_tags ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.content_tags (
  content_id uuid NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  tag_id     uuid NOT NULL REFERENCES public.tags(id)    ON DELETE CASCADE,

  PRIMARY KEY (content_id, tag_id)
);

-- ── seasons ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.seasons (
  id            uuid        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id    uuid        NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  season_number integer     NOT NULL,
  title         text,
  synopsis      text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT seasons_number_positive CHECK (season_number > 0),
  UNIQUE (content_id, season_number)
);

-- ── episodes ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.episodes (
  id             uuid        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id      uuid        NOT NULL REFERENCES public.seasons(id) ON DELETE CASCADE,
  episode_number integer     NOT NULL,
  title          text        NOT NULL,
  synopsis       text,
  duration_minutes integer,
  external_url   text,
  embed_code     text,
  air_date       date,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT episodes_number_positive  CHECK (episode_number > 0),
  CONSTRAINT episodes_title_length     CHECK (char_length(title) >= 1 AND char_length(title) <= 300),
  CONSTRAINT episodes_duration_positive CHECK (duration_minutes IS NULL OR duration_minutes > 0),
  CONSTRAINT episodes_has_playback     CHECK (
    external_url IS NOT NULL OR NULLIF(TRIM(embed_code), '') IS NOT NULL
  ),
  UNIQUE (season_id, episode_number)
);

-- ── ratings ───────────────────────────────────────────────────────────────────
-- Three dimensions (visuals, sound_design, script) each 0.0–5.0 in 0.5 steps.
-- main_score is a generated column: average of the three.
CREATE TABLE IF NOT EXISTS public.ratings (
  id           uuid        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_id   uuid        NOT NULL REFERENCES public.content(id)  ON DELETE CASCADE,
  episode_id   uuid        REFERENCES public.episodes(id)          ON DELETE CASCADE,
  visuals      numeric(2,1) NOT NULL,
  sound_design numeric(2,1) NOT NULL,
  script       numeric(2,1) NOT NULL,
  main_score   numeric(3,2) GENERATED ALWAYS AS (
    ROUND(((visuals + sound_design + script) / 3.0), 2)
  ) STORED,
  review       text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT ratings_visuals_half_step  CHECK (is_half_step_rating(visuals)),
  CONSTRAINT ratings_sound_half_step    CHECK (is_half_step_rating(sound_design)),
  CONSTRAINT ratings_script_half_step   CHECK (is_half_step_rating(script)),
  CONSTRAINT ratings_review_length      CHECK (review IS NULL OR char_length(review) <= 10000)
);

-- ── comments ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.comments (
  id         uuid        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_id uuid        NOT NULL REFERENCES public.content(id)  ON DELETE CASCADE,
  episode_id uuid        REFERENCES public.episodes(id)          ON DELETE CASCADE,
  parent_id  uuid        REFERENCES public.comments(id)          ON DELETE CASCADE,
  body       text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT comments_body_length CHECK (char_length(body) >= 1 AND char_length(body) <= 10000)
);

-- ── watchlist ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.watchlist (
  user_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_id uuid        NOT NULL REFERENCES public.content(id)  ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (user_id, content_id)
);

-- ── content_stats ─────────────────────────────────────────────────────────────
-- Maintained by triggers via refresh_content_stats().  One row per content item.
CREATE TABLE IF NOT EXISTS public.content_stats (
  content_id        uuid           NOT NULL PRIMARY KEY REFERENCES public.content(id) ON DELETE CASCADE,
  rating_count      integer        NOT NULL DEFAULT 0,
  rating_avg        numeric(3,2),
  comment_count     integer        NOT NULL DEFAULT 0,
  watchlist_count   integer        NOT NULL DEFAULT 0,
  engagement_score  numeric(12,4)  NOT NULL DEFAULT 0,
  last_activity_at  timestamptz,
  updated_at        timestamptz    NOT NULL DEFAULT now()
);


-- =============================================================================
-- 5. Additional unique indexes (not already covered by PRIMARY KEY / UNIQUE constraint)
-- =============================================================================

-- Profiles: case-insensitive unique username
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_lower_idx
  ON public.profiles (lower(username));

-- Content: unique slug
CREATE UNIQUE INDEX IF NOT EXISTS content_slug_idx
  ON public.content (slug);

-- Tags: case-insensitive unique name + slug
CREATE UNIQUE INDEX IF NOT EXISTS tags_name_lower_idx ON public.tags (lower(name));
CREATE UNIQUE INDEX IF NOT EXISTS tags_slug_idx        ON public.tags (slug);

-- Ratings: one film rating per user (where episode_id IS NULL)
CREATE UNIQUE INDEX IF NOT EXISTS ratings_user_content_idx
  ON public.ratings (user_id, content_id) WHERE episode_id IS NULL;

-- Ratings: one episode rating per user
CREATE UNIQUE INDEX IF NOT EXISTS ratings_user_episode_idx
  ON public.ratings (user_id, episode_id) WHERE episode_id IS NOT NULL;


-- =============================================================================
-- 6. Plain performance indexes
-- =============================================================================

CREATE INDEX IF NOT EXISTS content_type_status_idx
  ON public.content (type, status);
CREATE INDEX IF NOT EXISTS content_submitted_by_idx
  ON public.content (submitted_by);
CREATE INDEX IF NOT EXISTS content_published_at_idx
  ON public.content (published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS content_created_at_idx
  ON public.content (created_at DESC);

CREATE INDEX IF NOT EXISTS content_tags_tag_id_idx
  ON public.content_tags (tag_id);

CREATE INDEX IF NOT EXISTS seasons_content_id_idx
  ON public.seasons (content_id);

CREATE INDEX IF NOT EXISTS episodes_season_id_idx
  ON public.episodes (season_id);

CREATE INDEX IF NOT EXISTS ratings_content_id_idx
  ON public.ratings (content_id);
CREATE INDEX IF NOT EXISTS ratings_episode_id_idx
  ON public.ratings (episode_id);
CREATE INDEX IF NOT EXISTS ratings_main_score_idx
  ON public.ratings (main_score DESC);

CREATE INDEX IF NOT EXISTS comments_user_id_idx
  ON public.comments (user_id);
CREATE INDEX IF NOT EXISTS comments_content_id_idx
  ON public.comments (content_id, created_at DESC);
CREATE INDEX IF NOT EXISTS comments_episode_id_idx
  ON public.comments (episode_id, created_at DESC);
CREATE INDEX IF NOT EXISTS comments_parent_id_idx
  ON public.comments (parent_id);

CREATE INDEX IF NOT EXISTS watchlist_content_id_idx
  ON public.watchlist (content_id);

CREATE INDEX IF NOT EXISTS content_stats_engagement_idx
  ON public.content_stats (engagement_score DESC);
CREATE INDEX IF NOT EXISTS content_stats_last_activity_idx
  ON public.content_stats (last_activity_at DESC NULLS LAST);


-- =============================================================================
-- 7. Trigger functions
-- =============================================================================

-- ── set_updated_at ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- ── refresh_content_stats ─────────────────────────────────────────────────────
-- Recomputes all aggregate stats for a given content_id and upserts into
-- content_stats.  Called by trigger_refresh_content_stats on ratings/comments/
-- watchlist changes.
CREATE OR REPLACE FUNCTION public.refresh_content_stats(p_content_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_rating_count    integer;
  v_rating_avg      numeric(3,2);
  v_comment_count   integer;
  v_watchlist_count integer;
  v_last_activity   timestamptz;
  v_engagement      numeric(12,4);
  v_days_since_activity numeric;
BEGIN
  SELECT count(*), round(avg(r.main_score)::numeric, 2)
    INTO v_rating_count, v_rating_avg
    FROM public.ratings r
   WHERE r.content_id = p_content_id AND r.episode_id IS NULL;

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
    (content_id, rating_count, rating_avg, comment_count, watchlist_count,
     engagement_score, last_activity_at, updated_at)
  VALUES
    (p_content_id, COALESCE(v_rating_count, 0), v_rating_avg,
     COALESCE(v_comment_count, 0), COALESCE(v_watchlist_count, 0),
     COALESCE(v_engagement, 0), v_last_activity, now())
  ON CONFLICT (content_id) DO UPDATE
    SET rating_count     = EXCLUDED.rating_count,
        rating_avg       = EXCLUDED.rating_avg,
        comment_count    = EXCLUDED.comment_count,
        watchlist_count  = EXCLUDED.watchlist_count,
        engagement_score = EXCLUDED.engagement_score,
        last_activity_at = EXCLUDED.last_activity_at,
        updated_at       = EXCLUDED.updated_at;
END;
$$;

-- ── trigger_refresh_content_stats ─────────────────────────────────────────────
-- Row-level trigger wrapper: resolves content_id (even for episode rows) and
-- calls refresh_content_stats.
CREATE OR REPLACE FUNCTION public.trigger_refresh_content_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_content_id uuid;
BEGIN
  v_content_id := COALESCE(
    NEW.content_id,
    OLD.content_id,
    (SELECT s.content_id
       FROM public.episodes e
       JOIN public.seasons  s ON s.id = e.season_id
      WHERE e.id = COALESCE(NEW.episode_id, OLD.episode_id))
  );
  IF v_content_id IS NOT NULL THEN
    PERFORM public.refresh_content_stats(v_content_id);
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- ── init_content_stats_on_publish ─────────────────────────────────────────────
-- On first publish (INSERT with status=published OR status change to published),
-- sets published_at and initialises content_stats.
CREATE OR REPLACE FUNCTION public.init_content_stats_on_publish()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.status = 'published' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'published') THEN
    IF NEW.published_at IS NULL THEN NEW.published_at := now(); END IF;
    PERFORM public.refresh_content_stats(NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

-- ── enforce_series_playback_fields ────────────────────────────────────────────
-- Series rows must not have embed_code / external_url; playback lives on episodes.
CREATE OR REPLACE FUNCTION public.enforce_series_playback_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  IF NEW.type = 'series' AND (
       NEW.external_url IS NOT NULL OR
       NULLIF(TRIM(NEW.embed_code), '') IS NOT NULL
     ) THEN
    RAISE EXCEPTION 'Series use seasons/episodes for playback; leave external_url and embed_code null on content';
  END IF;
  RETURN NEW;
END;
$$;

-- ── validate_rating_episode ───────────────────────────────────────────────────
-- Ensures an episode_id in a rating belongs to the correct content and that the
-- content is a series.
CREATE OR REPLACE FUNCTION public.validate_rating_episode()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  episode_content_id uuid;
  content_row        public.content;
BEGIN
  SELECT c.* INTO content_row FROM public.content c WHERE c.id = NEW.content_id;
  IF content_row IS NULL THEN RAISE EXCEPTION 'Content not found'; END IF;
  IF NEW.episode_id IS NULL THEN RETURN NEW; END IF;

  SELECT s.content_id INTO episode_content_id
    FROM public.episodes e
    JOIN public.seasons  s ON s.id = e.season_id
   WHERE e.id = NEW.episode_id;

  IF episode_content_id IS NULL THEN RAISE EXCEPTION 'Episode not found'; END IF;
  IF episode_content_id <> NEW.content_id THEN
    RAISE EXCEPTION 'Episode does not belong to this content';
  END IF;
  IF content_row.type <> 'series' THEN
    RAISE EXCEPTION 'Episode ratings are only for series';
  END IF;
  RETURN NEW;
END;
$$;

-- ── handle_new_user ───────────────────────────────────────────────────────────
-- Fires on auth.users INSERT.  Creates the matching profiles row, deriving
-- username and display_name from user_metadata (supports Google / email flows).
-- SECURITY DEFINER so it can write to public.profiles as a privileged caller.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  base_username      text;
  candidate          text;
  suffix             integer := 0;
  meta               jsonb;
  computed_full_name text;
BEGIN
  meta := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);

  -- Build full_name from first+last if full_name/name not already present
  computed_full_name := COALESCE(
    NULLIF(TRIM(meta ->> 'full_name'),   ''),
    NULLIF(TRIM(meta ->> 'name'),        ''),
    NULLIF(TRIM(
      CONCAT_WS(' ',
        NULLIF(TRIM(meta ->> 'first_name'), ''),
        NULLIF(TRIM(meta ->> 'last_name'),  '')
      )
    ), ''),
    NULLIF(TRIM(meta ->> 'display_name'), '')
  );

  -- Derive username from provided hint or email prefix; sanitise to [a-zA-Z0-9_]
  base_username := lower(regexp_replace(
    COALESCE(meta ->> 'username', split_part(NEW.email, '@', 1)),
    '[^a-zA-Z0-9_]', '', 'g'
  ));
  IF base_username IS NULL OR char_length(base_username) < 3 THEN
    base_username := 'user';
  END IF;
  base_username := left(base_username, 26);

  -- Find a unique username (simple numeric suffix)
  candidate := base_username;
  WHILE EXISTS (
    SELECT 1 FROM public.profiles p WHERE lower(p.username) = lower(candidate)
  ) LOOP
    suffix    := suffix + 1;
    candidate := base_username || suffix::text;
  END LOOP;

  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    candidate,
    COALESCE(computed_full_name, candidate),
    COALESCE(
      NULLIF(TRIM(meta ->> 'avatar_url'), ''),
      NULLIF(TRIM(meta ->> 'picture'),    '')
    )
  );
  RETURN NEW;
END;
$$;

-- ── is_admin ──────────────────────────────────────────────────────────────────
-- Convenience SQL function used in RLS policies.
-- SECURITY DEFINER to avoid RLS recursion on profiles.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;


-- =============================================================================
-- 8. Triggers
-- =============================================================================

-- ── updated_at triggers ───────────────────────────────────────────────────────
CREATE OR REPLACE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER content_set_updated_at
  BEFORE UPDATE ON public.content
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER seasons_set_updated_at
  BEFORE UPDATE ON public.seasons
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER episodes_set_updated_at
  BEFORE UPDATE ON public.episodes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER ratings_set_updated_at
  BEFORE UPDATE ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER comments_set_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── content business-logic triggers ──────────────────────────────────────────
CREATE OR REPLACE TRIGGER content_enforce_series_playback
  BEFORE INSERT OR UPDATE ON public.content
  FOR EACH ROW EXECUTE FUNCTION public.enforce_series_playback_fields();

CREATE OR REPLACE TRIGGER content_init_stats_on_publish
  AFTER INSERT OR UPDATE ON public.content
  FOR EACH ROW EXECUTE FUNCTION public.init_content_stats_on_publish();

-- ── stats refresh triggers ────────────────────────────────────────────────────
CREATE OR REPLACE TRIGGER ratings_refresh_stats
  AFTER INSERT OR UPDATE OR DELETE ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION public.trigger_refresh_content_stats();

CREATE OR REPLACE TRIGGER comments_refresh_stats
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.trigger_refresh_content_stats();

CREATE OR REPLACE TRIGGER watchlist_refresh_stats
  AFTER INSERT OR DELETE ON public.watchlist
  FOR EACH ROW EXECUTE FUNCTION public.trigger_refresh_content_stats();

-- ── ratings validation trigger ────────────────────────────────────────────────
CREATE OR REPLACE TRIGGER ratings_validate_episode
  BEFORE INSERT OR UPDATE ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION public.validate_rating_episode();

-- ── auth trigger (fires in auth schema) ──────────────────────────────────────
-- Creates a profiles row whenever a new auth.users row is inserted.
-- NOTE: this trigger lives in the auth schema; Supabase manages that schema,
-- so this statement will succeed only if executed with sufficient privileges
-- (service-role or Supabase dashboard).
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- =============================================================================
-- 9. Views  (security_invoker = true so RLS is respected by the caller)
-- =============================================================================

CREATE OR REPLACE VIEW public.homepage_newest
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
  ORDER BY c.published_at DESC NULLS LAST, c.created_at DESC;

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
  JOIN public.content_stats cs ON cs.content_id = c.id
  WHERE c.status = 'published'
  ORDER BY cs.engagement_score DESC, c.published_at DESC NULLS LAST;


-- =============================================================================
-- 10. Storage bucket
-- =============================================================================
-- Creates the 'images' bucket if it doesn't already exist.
-- File size limit: 5 MB.  Allowed types: JPEG, PNG, WebP, GIF, AVIF.
-- The bucket is public (objects readable without auth); write access is
-- controlled by RLS policies in 00000001_rls_policies.sql.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880,
  ARRAY['image/jpeg','image/png','image/webp','image/gif','image/avif']
)
ON CONFLICT (id) DO UPDATE
  SET public             = EXCLUDED.public,
      file_size_limit    = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;
