-- =============================================================================
-- Dreamwall — Default user lists seeding
--
-- New users receive two non-system lists via handle_new_user().
-- Existing profiles are backfilled once (idempotent).
-- =============================================================================


-- ── seed_default_user_lists ───────────────────────────────────────────────────
-- Inserts "My Recommendations" and "Might Watch" for p_user_id when missing.
CREATE OR REPLACE FUNCTION public.seed_default_user_lists(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.lists (user_id, name, is_system, visibility)
  SELECT p_user_id, v.name, false, 'public'
  FROM (VALUES ('My Recommendations'), ('Might Watch')) AS v(name)
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.lists l
    WHERE l.user_id = p_user_id
      AND l.name = v.name
  );
END;
$$;

REVOKE ALL ON FUNCTION public.seed_default_user_lists(uuid) FROM PUBLIC, anon, authenticated;


-- ── handle_new_user ───────────────────────────────────────────────────────────
-- Extended: after creating the profiles row, seed default user lists.
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

  base_username := lower(regexp_replace(
    COALESCE(meta ->> 'username', split_part(NEW.email, '@', 1)),
    '[^a-zA-Z0-9_]', '', 'g'
  ));
  IF base_username IS NULL OR char_length(base_username) < 3 THEN
    base_username := 'user';
  END IF;
  base_username := left(base_username, 26);

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

  PERFORM public.seed_default_user_lists(NEW.id);

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;


-- ── One-time backfill for existing profiles ───────────────────────────────────
WITH candidates AS (
  SELECT p.id AS user_id, v.name
  FROM public.profiles p
  CROSS JOIN (VALUES ('My Recommendations'), ('Might Watch')) AS v(name)
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.lists l
    WHERE l.user_id = p.id
      AND l.name = v.name
  )
),
inserted AS (
  INSERT INTO public.lists (user_id, name, is_system, visibility)
  SELECT user_id, name, false, 'public'
  FROM candidates
  RETURNING user_id
)
SELECT count(DISTINCT user_id) AS backfilled_users,
       count(*)                AS lists_inserted
FROM inserted;
