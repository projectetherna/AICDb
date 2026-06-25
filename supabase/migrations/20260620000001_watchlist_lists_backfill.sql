-- =============================================================================
-- Dreamwall — Watchlist → Lists migration  (step 2 of Lists feature)
--
-- 1. get_or_create_watchlist_list()
--      SECURITY DEFINER function that returns the system watchlist list id
--      for the calling user, creating it if it doesn't exist yet.
--      Idempotent under concurrency via ON CONFLICT on the partial unique index
--      (user_id, system_key) WHERE system_key IS NOT NULL.
--
-- 2. Backfill
--      For every row in the old watchlist table, ensure the user's system list
--      exists, then INSERT a matching list_items row with ON CONFLICT DO NOTHING.
--      Safe to re-run: all ops are idempotent.
-- =============================================================================


-- =============================================================================
-- 1. SECURITY DEFINER helper: get_or_create_watchlist_list()
-- =============================================================================
CREATE OR REPLACE FUNCTION public.get_or_create_watchlist_list()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_id uuid;
BEGIN
  -- Try to find the existing system watchlist list for this user.
  SELECT id INTO v_id
    FROM public.lists
   WHERE user_id    = auth.uid()
     AND system_key = 'watchlist'
  LIMIT 1;

  IF v_id IS NOT NULL THEN
    RETURN v_id;
  END IF;

  -- Not found — create it. ON CONFLICT handles the race between two concurrent
  -- first-time callers: the loser of the INSERT will find the row already there
  -- and return its id via the subsequent SELECT.
  INSERT INTO public.lists (user_id, name, is_system, system_key, visibility)
  VALUES (auth.uid(), 'Watchlist', true, 'watchlist', 'private')
  ON CONFLICT DO NOTHING;

  -- Now it definitely exists (either we inserted it or someone else did).
  SELECT id INTO v_id
    FROM public.lists
   WHERE user_id    = auth.uid()
     AND system_key = 'watchlist'
  LIMIT 1;

  RETURN v_id;
END;
$$;

-- Grant execute to authenticated users (anon does not have a watchlist).
GRANT EXECUTE ON FUNCTION public.get_or_create_watchlist_list() TO authenticated;


-- =============================================================================
-- 2. Backfill: watchlist → list_items
--
-- For every distinct user in the watchlist table we:
--   a) upsert their system Watchlist list (same logic as the function above but
--      running as a privileged migration so we can act on behalf of any user).
--   b) insert a list_items row for each content_id they have in watchlist,
--      skipping duplicates with ON CONFLICT DO NOTHING.
--
-- We use a CTE so this is a single idempotent statement.
-- =============================================================================
WITH
-- Step a: ensure each watchlist user has a system list row, return its id.
upserted_lists AS (
  INSERT INTO public.lists (user_id, name, is_system, system_key, visibility)
  SELECT DISTINCT
    w.user_id,
    'Watchlist',
    true,
    'watchlist',
    'private'
  FROM public.watchlist w
  ON CONFLICT DO NOTHING
  RETURNING id, user_id
),

-- Step b: merge with any lists that already existed before this migration.
all_lists AS (
  SELECT id, user_id FROM upserted_lists
  UNION ALL
  SELECT l.id, l.user_id
    FROM public.lists l
   WHERE l.system_key = 'watchlist'
     AND NOT EXISTS (SELECT 1 FROM upserted_lists u WHERE u.user_id = l.user_id)
),

-- Step c: insert list_items for every watchlist row.
inserted AS (
  INSERT INTO public.list_items (list_id, content_id, added_at)
  SELECT al.id, w.content_id, w.created_at
    FROM public.watchlist w
    JOIN all_lists al ON al.user_id = w.user_id
  ON CONFLICT (list_id, content_id) DO NOTHING
  RETURNING id
)

-- Report the count of newly inserted rows.
SELECT count(*) AS migrated_rows FROM inserted;
