-- Backfill profile rows for auth.users accounts that pre-date the
-- on_auth_user_created trigger. Without a profiles row, updateProfile()
-- silently UPDATEs 0 rows and the subsequent SELECT returns nothing,
-- causing .maybeSingle() to return null and breaking the save flow.

INSERT INTO public.profiles (id, username, display_name, avatar_url)
SELECT
  au.id,
  (
    WITH base AS (
      SELECT lower(regexp_replace(split_part(au.email, '@', 1), '[^a-zA-Z0-9_]', '', 'g')) AS b
    ),
    safe_base AS (
      SELECT CASE WHEN length(b) < 3 THEN 'user' ELSE left(b, 26) END AS b FROM base
    ),
    numbered AS (
      SELECT b || CASE n WHEN 0 THEN '' ELSE n::text END AS candidate, n
      FROM safe_base, generate_series(0, 99) AS n
    )
    SELECT candidate FROM numbered
    WHERE NOT EXISTS (
      SELECT 1 FROM public.profiles p WHERE lower(p.username) = lower(candidate)
    )
    ORDER BY n LIMIT 1
  ),
  coalesce(
    nullif(trim(au.raw_user_meta_data->>'full_name'), ''),
    nullif(trim(au.raw_user_meta_data->>'name'), ''),
    split_part(au.email, '@', 1)
  ),
  nullif(trim(coalesce(
    au.raw_user_meta_data->>'avatar_url',
    au.raw_user_meta_data->>'picture',
    ''
  )), '')
FROM auth.users au
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = au.id);
