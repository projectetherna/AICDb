-- =============================================================================
-- Dreamwall — Row Level Security Policies (authoritative snapshot)
-- Exported from live Supabase project zvvkejehuludrsabsesd on 2026-06-18
--
-- Applies after 00000000_initial_schema.sql (tables must already exist).
-- All tables in public schema have RLS enabled.  Policies are dropped and
-- recreated idempotently so this file can be re-run safely.
--
-- Tables covered:
--   public.profiles, public.content, public.content_stats, public.content_tags,
--   public.seasons, public.episodes, public.ratings, public.comments,
--   public.watchlist, public.tags
--   storage.objects  (bucket: images)
-- =============================================================================


-- =============================================================================
-- Enable RLS on all public tables
-- =============================================================================
ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_tags  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasons       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags          ENABLE ROW LEVEL SECURITY;


-- =============================================================================
-- public.profiles
-- =============================================================================
DROP POLICY IF EXISTS "Profiles are viewable by everyone"  ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile"        ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile"        ON public.profiles;
DROP POLICY IF EXISTS "profiles_read"                       ON public.profiles;

-- Anyone (including anon) can read any profile.
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- A user can insert their own profile row (also used by handle_new_user trigger
-- which runs as SECURITY DEFINER, but having the policy keeps things consistent).
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- A user can update only their own profile.
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING  (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admin-scoped read (allows admin to see own profile even if first policy
-- somehow wouldn't; belt-and-suspenders).
CREATE POLICY "profiles_read"
  ON public.profiles FOR SELECT
  USING ((auth.uid() = id) OR public.is_admin());


-- =============================================================================
-- public.content
-- =============================================================================
DROP POLICY IF EXISTS "Published content is public"             ON public.content;
DROP POLICY IF EXISTS "Authenticated users can submit content"  ON public.content;
DROP POLICY IF EXISTS "Submitters can update own content"       ON public.content;
DROP POLICY IF EXISTS "Submitters can delete own draft content" ON public.content;
DROP POLICY IF EXISTS "content_admin_insert"                    ON public.content;
DROP POLICY IF EXISTS "content_admin_update"                    ON public.content;
DROP POLICY IF EXISTS "content_admin_delete"                    ON public.content;

-- Public (published) content is readable by everyone; submitters can also read
-- their own unpublished drafts/pending/rejected submissions.
CREATE POLICY "Published content is public"
  ON public.content FOR SELECT
  USING (
    status = 'published' OR submitted_by = auth.uid()
  );

-- Authenticated users may submit new content (draft or pending only).
CREATE POLICY "Authenticated users can submit content"
  ON public.content FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND submitted_by = auth.uid()
    AND status = ANY (ARRAY['draft'::content_status, 'pending'::content_status])
  );

-- Submitters can update their own content (status transitions enforced by admin
-- policies; RLS does not block status changes for own content — business logic
-- in the app / admin panel is responsible for limiting which transitions are
-- allowed for non-admins).
CREATE POLICY "Submitters can update own content"
  ON public.content FOR UPDATE
  USING  (submitted_by = auth.uid())
  WITH CHECK (submitted_by = auth.uid());

-- Submitters can delete their own drafts only.
CREATE POLICY "Submitters can delete own draft content"
  ON public.content FOR DELETE
  USING (submitted_by = auth.uid() AND status = 'draft');

-- Admins: full INSERT / UPDATE / DELETE regardless of submitted_by or status.
CREATE POLICY "content_admin_insert"
  ON public.content FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "content_admin_update"
  ON public.content FOR UPDATE
  USING  (public.is_admin());

CREATE POLICY "content_admin_delete"
  ON public.content FOR DELETE
  USING  (public.is_admin());


-- =============================================================================
-- public.content_stats
-- =============================================================================
DROP POLICY IF EXISTS "Content stats are public" ON public.content_stats;

-- Stats are read-only for everyone; writes come only from SECURITY DEFINER
-- functions (refresh_content_stats) which bypass RLS.
CREATE POLICY "Content stats are public"
  ON public.content_stats FOR SELECT
  USING (true);


-- =============================================================================
-- public.content_tags
-- =============================================================================
DROP POLICY IF EXISTS "Content tags are readable by everyone"   ON public.content_tags;
DROP POLICY IF EXISTS "Submitters can manage tags on own content" ON public.content_tags;

CREATE POLICY "Content tags are readable by everyone"
  ON public.content_tags FOR SELECT
  USING (true);

-- Submitters can add/update/delete tags on their own content.
CREATE POLICY "Submitters can manage tags on own content"
  ON public.content_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.content c
       WHERE c.id = content_tags.content_id
         AND c.submitted_by = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.content c
       WHERE c.id = content_tags.content_id
         AND c.submitted_by = auth.uid()
    )
  );


-- =============================================================================
-- public.seasons
-- =============================================================================
DROP POLICY IF EXISTS "Seasons visible with content"          ON public.seasons;
DROP POLICY IF EXISTS "Series owners can manage seasons"      ON public.seasons;

-- Seasons are visible when the parent content is published or owned by the user.
CREATE POLICY "Seasons visible with content"
  ON public.seasons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.content c
       WHERE c.id = seasons.content_id
         AND (c.status = 'published' OR c.submitted_by = auth.uid())
    )
  );

-- Series owners can create/update/delete seasons on their own series content.
CREATE POLICY "Series owners can manage seasons"
  ON public.seasons FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.content c
       WHERE c.id = seasons.content_id
         AND c.submitted_by = auth.uid()
         AND c.type = 'series'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.content c
       WHERE c.id = seasons.content_id
         AND c.submitted_by = auth.uid()
         AND c.type = 'series'
    )
  );


-- =============================================================================
-- public.episodes
-- =============================================================================
DROP POLICY IF EXISTS "Episodes visible with content"       ON public.episodes;
DROP POLICY IF EXISTS "Series owners can manage episodes"   ON public.episodes;

-- Episodes are visible when their parent series content is published or owned.
CREATE POLICY "Episodes visible with content"
  ON public.episodes FOR SELECT
  USING (
    EXISTS (
      SELECT 1
        FROM public.seasons s
        JOIN public.content c ON c.id = s.content_id
       WHERE s.id = episodes.season_id
         AND (c.status = 'published' OR c.submitted_by = auth.uid())
    )
  );

-- Series owners manage episodes on their own series.
CREATE POLICY "Series owners can manage episodes"
  ON public.episodes FOR ALL
  USING (
    EXISTS (
      SELECT 1
        FROM public.seasons s
        JOIN public.content c ON c.id = s.content_id
       WHERE s.id = episodes.season_id
         AND c.submitted_by = auth.uid()
         AND c.type = 'series'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
        FROM public.seasons s
        JOIN public.content c ON c.id = s.content_id
       WHERE s.id = episodes.season_id
         AND c.submitted_by = auth.uid()
         AND c.type = 'series'
    )
  );


-- =============================================================================
-- public.ratings
-- =============================================================================
DROP POLICY IF EXISTS "Ratings are public"        ON public.ratings;
DROP POLICY IF EXISTS "Users manage own ratings"  ON public.ratings;
DROP POLICY IF EXISTS "Users update own ratings"  ON public.ratings;
DROP POLICY IF EXISTS "Users delete own ratings"  ON public.ratings;

-- All ratings are publicly readable (drives recommendation engine).
CREATE POLICY "Ratings are public"
  ON public.ratings FOR SELECT
  USING (true);

-- Authenticated users can insert their own ratings.
CREATE POLICY "Users manage own ratings"
  ON public.ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own ratings.
CREATE POLICY "Users update own ratings"
  ON public.ratings FOR UPDATE
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own ratings.
CREATE POLICY "Users delete own ratings"
  ON public.ratings FOR DELETE
  USING (auth.uid() = user_id);


-- =============================================================================
-- public.comments
-- =============================================================================
DROP POLICY IF EXISTS "Comments are public"              ON public.comments;
DROP POLICY IF EXISTS "Authenticated users can comment"  ON public.comments;
DROP POLICY IF EXISTS "Users update own comments"        ON public.comments;
DROP POLICY IF EXISTS "Users delete own comments"        ON public.comments;

CREATE POLICY "Comments are public"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can comment"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own comments"
  ON public.comments FOR UPDATE
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id);


-- =============================================================================
-- public.watchlist
-- =============================================================================
DROP POLICY IF EXISTS "Watchlist select own" ON public.watchlist;
DROP POLICY IF EXISTS "Watchlist insert own" ON public.watchlist;
DROP POLICY IF EXISTS "Watchlist delete own" ON public.watchlist;

-- Users can only see and manage their own watchlist entries.
CREATE POLICY "Watchlist select own"
  ON public.watchlist FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Watchlist insert own"
  ON public.watchlist FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Watchlist delete own"
  ON public.watchlist FOR DELETE
  USING (auth.uid() = user_id);


-- =============================================================================
-- public.tags
-- =============================================================================
DROP POLICY IF EXISTS "Tags are readable by everyone"       ON public.tags;
DROP POLICY IF EXISTS "Authenticated users can create tags" ON public.tags;

CREATE POLICY "Tags are readable by everyone"
  ON public.tags FOR SELECT
  USING (true);

-- Any authenticated user may create tags (admins normalise duplicates).
CREATE POLICY "Authenticated users can create tags"
  ON public.tags FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);


-- =============================================================================
-- storage.objects  (bucket: images)
-- =============================================================================
DROP POLICY IF EXISTS "images_public_read"   ON storage.objects;
DROP POLICY IF EXISTS "images_auth_insert"   ON storage.objects;
DROP POLICY IF EXISTS "images_auth_update"   ON storage.objects;
DROP POLICY IF EXISTS "images_auth_delete"   ON storage.objects;

-- Anyone can read images (bucket is public).
CREATE POLICY "images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

-- Authenticated users can upload to their own folder only: {uid}/...
-- (storage.foldername(name))[1] returns the first path component.
CREATE POLICY "images_auth_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Upsert (replace) requires UPDATE as well as INSERT.
CREATE POLICY "images_auth_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can delete their own uploaded files.
CREATE POLICY "images_auth_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
