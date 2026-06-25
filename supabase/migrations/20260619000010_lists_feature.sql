-- =============================================================================
-- Dreamwall — Lists feature: schema + RLS + view_count trigger
-- Migration: 20260619000010_lists_feature
--
-- Conventions matched from existing schema:
--   user_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE
--   content_id uuid NOT NULL REFERENCES public.content(id) ON DELETE CASCADE
--   RLS: direct auth.uid() comparisons; EXISTS into other tables where needed.
--   Trigger functions: SECURITY DEFINER SET search_path = ''
--   NO recursive policies (no policy on lists queries lists itself).
-- =============================================================================


-- =============================================================================
-- 1. Tables
-- =============================================================================

-- ── lists ─────────────────────────────────────────────────────────────────────
-- A user-created (or system) ordered collection of content.
-- is_system=true rows are managed by the app (e.g. the watchlist list).
-- system_key is a stable machine name for system lists (e.g. 'watchlist').
CREATE TABLE IF NOT EXISTS public.lists (
  id          uuid        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name        text        NOT NULL,
  is_system   boolean     NOT NULL DEFAULT false,
  system_key  text,
  visibility  text        NOT NULL DEFAULT 'public',
  view_count  integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT lists_name_length     CHECK (char_length(name) >= 1 AND char_length(name) <= 200),
  CONSTRAINT lists_visibility_enum CHECK (visibility IN ('public', 'private')),
  CONSTRAINT lists_view_count_nn   CHECK (view_count >= 0)
);

-- Partial unique index: each user may have at most one list per system_key.
CREATE UNIQUE INDEX IF NOT EXISTS lists_user_system_key_idx
  ON public.lists (user_id, system_key)
  WHERE system_key IS NOT NULL;

-- Performance indexes.
CREATE INDEX IF NOT EXISTS lists_user_id_idx
  ON public.lists (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS lists_visibility_idx
  ON public.lists (visibility)
  WHERE visibility = 'public';


-- ── list_items ────────────────────────────────────────────────────────────────
-- Each row is one content item inside a list.
CREATE TABLE IF NOT EXISTS public.list_items (
  id          uuid        NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id     uuid        NOT NULL REFERENCES public.lists(id)   ON DELETE CASCADE,
  content_id  uuid        NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  added_at    timestamptz NOT NULL DEFAULT now(),

  UNIQUE (list_id, content_id)
);

CREATE INDEX IF NOT EXISTS list_items_list_id_idx
  ON public.list_items (list_id, added_at DESC);

CREATE INDEX IF NOT EXISTS list_items_content_id_idx
  ON public.list_items (content_id);


-- ── list_favorites ────────────────────────────────────────────────────────────
-- A user saving/bookmarking someone else's (or their own) list.
CREATE TABLE IF NOT EXISTS public.list_favorites (
  user_id    uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  list_id    uuid        NOT NULL REFERENCES public.lists(id)    ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (user_id, list_id)
);

CREATE INDEX IF NOT EXISTS list_favorites_list_id_idx
  ON public.list_favorites (list_id);


-- ── list_views ────────────────────────────────────────────────────────────────
-- One row per (list, viewer) — de-duplicated "unique view" record.
-- An AFTER INSERT trigger increments lists.view_count.
CREATE TABLE IF NOT EXISTS public.list_views (
  list_id         uuid        NOT NULL REFERENCES public.lists(id) ON DELETE CASCADE,
  viewer_user_id  uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  first_viewed_at timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (list_id, viewer_user_id)
);

CREATE INDEX IF NOT EXISTS list_views_list_id_idx
  ON public.list_views (list_id);


-- =============================================================================
-- 2. Trigger: increment lists.view_count on each new unique view
-- =============================================================================

CREATE OR REPLACE FUNCTION public.increment_list_view_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.lists
     SET view_count = view_count + 1
   WHERE id = NEW.list_id;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER list_views_increment_count
  AFTER INSERT ON public.list_views
  FOR EACH ROW EXECUTE FUNCTION public.increment_list_view_count();


-- =============================================================================
-- 3. Enable RLS on all four tables
-- =============================================================================

ALTER TABLE public.lists          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.list_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.list_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.list_views     ENABLE ROW LEVEL SECURITY;


-- =============================================================================
-- 4. RLS Policies — public.lists
-- =============================================================================
-- NOTE: No policy here queries lists itself — that would cause recursive RLS.
-- All checks are direct column comparisons on the protected row.

DROP POLICY IF EXISTS "lists_select"  ON public.lists;
DROP POLICY IF EXISTS "lists_insert"  ON public.lists;
DROP POLICY IF EXISTS "lists_update"  ON public.lists;
DROP POLICY IF EXISTS "lists_delete"  ON public.lists;

-- Anyone can read public lists; owners can read their own private ones.
CREATE POLICY "lists_select"
  ON public.lists FOR SELECT
  USING (visibility = 'public' OR user_id = auth.uid());

-- Users can only insert lists they own.
CREATE POLICY "lists_insert"
  ON public.lists FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can only update their own lists.
CREATE POLICY "lists_update"
  ON public.lists FOR UPDATE
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own non-system lists only.
CREATE POLICY "lists_delete"
  ON public.lists FOR DELETE
  USING (user_id = auth.uid() AND is_system = false);


-- =============================================================================
-- 5. RLS Policies — public.list_items
-- =============================================================================
-- EXISTS into lists (a different table) — no recursion risk.

DROP POLICY IF EXISTS "list_items_select"  ON public.list_items;
DROP POLICY IF EXISTS "list_items_insert"  ON public.list_items;
DROP POLICY IF EXISTS "list_items_delete"  ON public.list_items;

-- Items in a public list are readable by everyone; items in a private list
-- are readable only by the list owner.
CREATE POLICY "list_items_select"
  ON public.list_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.lists l
       WHERE l.id = list_items.list_id
         AND (l.visibility = 'public' OR l.user_id = auth.uid())
    )
  );

-- Only the list owner may add items.
CREATE POLICY "list_items_insert"
  ON public.list_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.lists l
       WHERE l.id = list_items.list_id
         AND l.user_id = auth.uid()
    )
  );

-- Only the list owner may remove items.
CREATE POLICY "list_items_delete"
  ON public.list_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.lists l
       WHERE l.id = list_items.list_id
         AND l.user_id = auth.uid()
    )
  );


-- =============================================================================
-- 6. RLS Policies — public.list_favorites
-- =============================================================================

DROP POLICY IF EXISTS "list_favorites_select"  ON public.list_favorites;
DROP POLICY IF EXISTS "list_favorites_insert"  ON public.list_favorites;
DROP POLICY IF EXISTS "list_favorites_delete"  ON public.list_favorites;

-- Users can only see their own favorites.
CREATE POLICY "list_favorites_select"
  ON public.list_favorites FOR SELECT
  USING (user_id = auth.uid());

-- Users can favorite a list that is public OR that they own.
CREATE POLICY "list_favorites_insert"
  ON public.list_favorites FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.lists l
       WHERE l.id = list_favorites.list_id
         AND (l.visibility = 'public' OR l.user_id = auth.uid())
    )
  );

-- Users can remove only their own favorites.
CREATE POLICY "list_favorites_delete"
  ON public.list_favorites FOR DELETE
  USING (user_id = auth.uid());


-- =============================================================================
-- 7. RLS Policies — public.list_views
-- =============================================================================

DROP POLICY IF EXISTS "list_views_insert"  ON public.list_views;
DROP POLICY IF EXISTS "list_views_select"  ON public.list_views;

-- A user may record their own view of a list that is public or owned by them.
CREATE POLICY "list_views_insert"
  ON public.list_views FOR INSERT
  WITH CHECK (
    viewer_user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.lists l
       WHERE l.id = list_views.list_id
         AND (l.visibility = 'public' OR l.user_id = auth.uid())
    )
  );

-- Only the list owner can query who has viewed their list.
CREATE POLICY "list_views_select"
  ON public.list_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.lists l
       WHERE l.id = list_views.list_id
         AND l.user_id = auth.uid()
    )
  );
