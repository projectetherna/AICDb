-- Rich profile fields: banner image, quote, quote attribution
-- All columns are nullable; existing rows are unaffected.

alter table public.profiles
  add column if not exists banner_url  text,
  add column if not exists quote       text,
  add column if not exists quote_from  text;

-- The existing RLS update policy already covers the entire row
-- ("using (auth.uid() = id)"), so no additional policy is needed.
-- Verify the existing policy name for reference:
-- SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND cmd = 'UPDATE';
