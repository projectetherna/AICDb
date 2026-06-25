-- Migration: fix_watchlist_trigger_episode_id
--
-- PROBLEM:
--   trigger_refresh_content_stats() is a shared trigger function attached to
--   public.watchlist, public.ratings, and public.comments.
--   Its body unconditionally references NEW.episode_id (and OLD.episode_id) in
--   a COALESCE to resolve content_id for episode-level rows.
--
--   public.ratings  → has episode_id column  ✓
--   public.comments → has episode_id column  ✓
--   public.watchlist → has NO episode_id column  ✗
--
--   Because Postgres evaluates NEW.<field> at plan time (not conditionally),
--   every INSERT into watchlist immediately raises:
--     "record 'new' has no field 'episode_id'"
--   returning HTTP 400 and blocking ALL watchlist writes.
--
-- FIX:
--   Guard the episode_id sub-select behind a TG_TABLE_NAME check so it only
--   runs when the firing table actually carries an episode_id column.
--   The watchlist path already resolves v_content_id from NEW.content_id —
--   the episode_id branch is a no-op for watchlist and can be safely skipped.
--   Behavior on ratings and comments is completely unchanged.

CREATE OR REPLACE FUNCTION public.trigger_refresh_content_stats()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $$
declare
  v_content_id uuid;
begin
  -- Resolve content_id.
  -- For tables that carry episode_id (ratings, comments), fall through to the
  -- episodes→seasons lookup when content_id is NULL.
  -- For tables without episode_id (watchlist), skip that branch entirely.
  if TG_TABLE_NAME IN ('ratings', 'comments') then
    v_content_id := coalesce(
      new.content_id,
      old.content_id,
      (
        select s.content_id
        from   public.episodes e
        join   public.seasons  s on s.id = e.season_id
        where  e.id = coalesce(new.episode_id, old.episode_id)
      )
    );
  else
    -- watchlist (and any future content-level tables): content_id is direct
    v_content_id := coalesce(new.content_id, old.content_id);
  end if;

  if v_content_id is not null then
    perform public.refresh_content_stats(v_content_id);
  end if;

  return coalesce(new, old);
end;
$$;
