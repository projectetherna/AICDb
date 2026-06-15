alter view public.homepage_trending set (security_invoker = on);
alter view public.homepage_newest set (security_invoker = on);

revoke all on function public.refresh_content_stats(uuid) from public, anon, authenticated;
revoke all on function public.trigger_refresh_content_stats() from public, anon, authenticated;
revoke all on function public.init_content_stats_on_publish() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;

alter function public.enforce_series_playback_fields() set search_path = public;
alter function public.is_half_step_rating(numeric) set search_path = public;
alter function public.validate_rating_episode() set search_path = public;
alter function public.set_updated_at() set search_path = public;
