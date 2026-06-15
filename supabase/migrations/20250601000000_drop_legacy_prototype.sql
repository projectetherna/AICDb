-- Remove early prototype tables (contents/ratings/watchlist v0)
drop table if exists public.watchlist cascade;
drop table if exists public.ratings cascade;
drop table if exists public.contents cascade;
