-- =============================================================================
-- Dreamwall — Drop legacy watchlist table (step 4 of Lists feature)
--
-- Safe to drop: stats re-pointed to list_items (step 3), store uses list_items
-- (step 2), no FK references from other tables, no live function queries
-- public.watchlist. RLS policies, indexes, and watchlist_refresh_stats trigger
-- drop automatically with the table.
-- =============================================================================

DROP TABLE public.watchlist;
