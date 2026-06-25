// Dreamwall — sample catalog data for the UI kit (fictional titles)
window.AICDB_TYPES = {
  movie:    { label: 'Movie',    color: 'var(--type-movie)',    ghost: 'var(--type-movie-ghost)',    text: 'var(--type-movie-text)',    icon: 'film' },
  series:   { label: 'Series',   color: 'var(--type-series)',   ghost: 'var(--type-series-ghost)',   text: 'var(--type-series-text)',   icon: 'tv' },
  short:    { label: 'Short',    color: 'var(--type-short)',    ghost: 'var(--type-short-ghost)',    text: 'var(--type-short-text)',    icon: 'clapperboard' },
  vertical: { label: 'Vertical', color: 'var(--type-vertical)', ghost: 'var(--type-vertical-ghost)', text: 'var(--type-vertical-text)', icon: 'smartphone' },
};

window.AICDB_FILMS = [];
// Films are added by admins through the admin panel. Catalog starts empty.

// Quick lookup by id
window.AICDB_FILM_BY_ID = Object.fromEntries(window.AICDB_FILMS.map(f => [f.id, f]));

// Watchlist store — DB-backed, owner-scoped via Supabase RLS.
// Synchronous reads (get/has) reflect the last-fetched DB state.
// toggle() does an optimistic local update then persists to the DB.
//
// KEY DESIGN: the store only reloads from the DB on genuine login/logout
// transitions — NOT on every auth _notify() call (which fires on profile
// updates too and would race with in-flight INSERTs to revert optimistic UI).
//
// STORAGE: reads/writes use the `list_items` table keyed by the user's system
// Watchlist list (resolved once via get_or_create_watchlist_list() RPC).
// The old `watchlist` table is kept intact for verification; it is no longer
// the source of truth.
window.AICDB_WATCHLIST = (function () {
  let ids           = [];    // content_id strings currently in the watchlist
  let loadPromise   = null;  // deduplicates concurrent load() calls; null when idle
  let pendingWrites = 0;     // number of in-flight INSERT/DELETE operations
  let lastUserId    = null;  // tracks which user's data is loaded (skip re-load for same user)
  let listId        = null;  // uuid of the user's system Watchlist list row
  const subs = new Set();

  function emit() { subs.forEach(fn => fn(ids)); }

  // Resolve (and cache) the system Watchlist list id for the current user.
  // Creates the list row on first call via the SECURITY DEFINER RPC.
  async function resolveListId(sb) {
    if (listId) return listId;
    const { data, error } = await sb.rpc('get_or_create_watchlist_list');
    if (error) throw new Error('[Watchlist] resolveListId: ' + error.message);
    listId = data;
    return listId;
  }

  // Load from DB. Deduplicates: concurrent calls share the same in-flight promise.
  // IMPORTANT: if writes are in flight we skip stamping ids — the optimistic local
  // state is more current than whatever the SELECT will return.
  function load() {
    if (loadPromise) return loadPromise;
    loadPromise = (async () => {
      try {
        const sb      = await window.AICDB_AUTH.getClient();
        const session = await window.AICDB_AUTH.getSession();
        if (!session) { ids = []; listId = null; lastUserId = null; emit(); return; }
        const uid = session.user.id;
        const lid = await resolveListId(sb);
        const { data, error } = await sb
          .from('list_items')
          .select('content_id')
          .eq('list_id', lid);
        if (error) { console.warn('[Watchlist] load error:', error.message, error.code); return; }
        // Only stamp ids when no writes are in flight. If a toggle() is pending
        // the optimistic local state is authoritative; overwriting it with a stale
        // SELECT is exactly the revert bug we're fixing.
        if (pendingWrites === 0) {
          ids = (data || []).map(r => r.content_id);
          lastUserId = uid;
          emit();
        } else {
          // Store the uid so the next write-free load won't re-fetch unnecessarily.
          lastUserId = uid;
        }
      } catch (e) {
        console.warn('[Watchlist] load exception:', e.message);
      } finally {
        loadPromise = null;
      }
    })();
    return loadPromise;
  }

  // Optimistic toggle: update local state immediately, then persist to DB.
  async function toggle(contentId) {
    const wasIn = ids.includes(contentId);

    // Optimistic update — renders immediately
    ids = wasIn ? ids.filter(x => x !== contentId) : [contentId, ...ids];
    emit();

    pendingWrites++;
    try {
      const sb      = await window.AICDB_AUTH.getClient();
      const session = await window.AICDB_AUTH.getSession();
      if (!session) throw new Error('Not signed in');
      const lid = await resolveListId(sb);

      let error;
      if (wasIn) {
        ({ error } = await sb
          .from('list_items')
          .delete()
          .eq('list_id',   lid)
          .eq('content_id', contentId));
      } else {
        ({ error } = await sb
          .from('list_items')
          .insert({ list_id: lid, content_id: contentId }));
        // 23505 = unique_violation: row already exists — optimistic state is correct
        if (error && error.code === '23505') error = null;
      }
      if (error) throw error;
      // Success — optimistic ids is already correct, nothing more to do.
    } catch (e) {
      console.warn('[Watchlist] toggle error:', e.message || JSON.stringify(e));
      // Roll back to pre-toggle state and re-fetch from DB to get truth
      ids = wasIn ? [contentId, ...ids] : ids.filter(x => x !== contentId);
      emit();
      loadPromise = null; // force a fresh load even if one was cached
      load();
    } finally {
      pendingWrites--;
    }
  }

  // Auth subscription: reload when the signed-in user changes (login / logout).
  // Guarded by lastUserId so repeated _notify() calls from auth.js (e.g. after a
  // profile save) do NOT trigger a re-load that races with in-flight writes.
  setTimeout(() => {
    if (!window.AICDB_AUTH || !window.AICDB_AUTH.subscribe) return;
    window.AICDB_AUTH.subscribe(async () => {
      try {
        const session = await window.AICDB_AUTH.getSession();
        const uid = session ? session.user.id : null;
        if (uid === lastUserId) return; // same user, nothing changed
        listId     = null;              // clear cached list id on user-change
        lastUserId = uid;               // update eagerly to block duplicate loads
        loadPromise = null;             // always do a fresh fetch on user-change
        load();
      } catch (e) { /* swallow — next subscribe call will retry */ }
    });
    load(); // initial load for a session already active on page load
  }, 0);

  return {
    get:       () => ids,
    has:       (id) => ids.includes(id),
    toggle,
    load,
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); },
  };
})();

// User-created lists store — DB-backed, owner-scoped via Supabase RLS.
// Manages non-system lists only (excludes the system watchlist row).
// Same subscribe/emit + optimistic update + rollback pattern as AICDB_WATCHLIST.
window.AICDB_LISTS = (function () {
  let lists         = [];
  let loadPromise   = null;
  let lastUserId    = null;
  const subs = new Set();

  function emit() { subs.forEach(fn => fn(lists)); }

  function normalizeRow(row) {
    const count = row.list_items?.[0]?.count ?? 0;
    const { list_items, ...rest } = row;
    return { ...rest, count, title: rest.name };
  }

  function load() {
    if (loadPromise) return loadPromise;
    loadPromise = (async () => {
      try {
        const sb      = await window.AICDB_AUTH.getClient();
        const session = await window.AICDB_AUTH.getSession();
        if (!session) { lists = []; lastUserId = null; emit(); return; }
        const uid = session.user.id;
        const { data, error } = await sb
          .from('lists')
          .select('*, list_items(count)')
          .eq('user_id', uid)
          .eq('is_system', false)
          .order('created_at', { ascending: false });
        if (error) { console.warn('[Lists] load error:', error.message, error.code); return; }
        lists = (data || []).map(normalizeRow);
        lastUserId = uid;
        emit();
      } catch (e) {
        console.warn('[Lists] load exception:', e.message);
      } finally {
        loadPromise = null;
      }
    })();
    return loadPromise;
  }

  async function create(name, visibility = 'public') {
    const trimmed = String(name || '').trim();
    if (!trimmed) return null;
    const tempId = 'temp-' + Date.now();
    const optimistic = {
      id: tempId, name: trimmed, title: trimmed, visibility,
      count: 0, is_system: false, created_at: new Date().toISOString(),
    };
    lists = [optimistic, ...lists];
    emit();
    try {
      const sb      = await window.AICDB_AUTH.getClient();
      const session = await window.AICDB_AUTH.getSession();
      if (!session) throw new Error('Not signed in');
      const { data, error } = await sb
        .from('lists')
        .insert({ user_id: session.user.id, name: trimmed, visibility, is_system: false })
        .select()
        .single();
      if (error) throw error;
      lists = lists.map(l => l.id === tempId
        ? normalizeRow({ ...data, list_items: [{ count: 0 }] })
        : l);
      emit();
      return lists.find(l => l.id === data.id);
    } catch (e) {
      console.warn('[Lists] create error:', e.message || JSON.stringify(e));
      lists = lists.filter(l => l.id !== tempId);
      emit();
      throw e;
    }
  }

  async function rename(id, name) {
    const trimmed = String(name || '').trim();
    if (!trimmed) return;
    const prev = lists.find(l => l.id === id);
    if (!prev) return;
    lists = lists.map(l => l.id === id ? { ...l, name: trimmed, title: trimmed } : l);
    emit();
    try {
      const sb = await window.AICDB_AUTH.getClient();
      const { error } = await sb.from('lists').update({ name: trimmed }).eq('id', id);
      if (error) throw error;
    } catch (e) {
      console.warn('[Lists] rename error:', e.message || JSON.stringify(e));
      lists = lists.map(l => l.id === id ? prev : l);
      emit();
    }
  }

  async function remove(id) {
    const prev = lists;
    lists = lists.filter(l => l.id !== id);
    emit();
    try {
      const sb = await window.AICDB_AUTH.getClient();
      const { error } = await sb.from('lists').delete().eq('id', id);
      if (error) throw error;
    } catch (e) {
      console.warn('[Lists] remove error:', e.message || JSON.stringify(e));
      lists = prev;
      emit();
    }
  }

  async function setVisibility(id, visibility) {
    console.log('VIS: setVisibility called', { id, requestedVisibility: visibility });
    const prev = lists.find(l => l.id === id);
    if (!prev) return;
    lists = lists.map(l => l.id === id ? { ...l, visibility } : l);
    emit();
    try {
      const sb = await window.AICDB_AUTH.getClient();
      const { data, error } = await sb.from('lists').update({ visibility }).eq('id', id);
      console.log('VIS: update result', { data, error });
      if (error) throw error;
    } catch (e) {
      console.log('VIS: rolled back', { error: e });
      console.warn('[Lists] setVisibility error:', e.message || JSON.stringify(e));
      lists = lists.map(l => l.id === id ? prev : l);
      emit();
    }
  }

  // Return ids of the user's non-system lists that contain contentId.
  async function getMembership(contentId) {
    try {
      const sb      = await window.AICDB_AUTH.getClient();
      const session = await window.AICDB_AUTH.getSession();
      if (!session) return [];
      let listIds = lists
        .filter(l => l.id && !String(l.id).startsWith('temp-'))
        .map(l => l.id);
      if (!listIds.length) {
        const { data: owned, error: ownedErr } = await sb
          .from('lists')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('is_system', false);
        if (ownedErr) { console.warn('[Lists] getMembership lists error:', ownedErr.message); return []; }
        listIds = (owned || []).map(r => r.id);
      }
      if (!listIds.length) return [];
      const { data, error } = await sb
        .from('list_items')
        .select('list_id')
        .eq('content_id', contentId)
        .in('list_id', listIds);
      if (error) { console.warn('[Lists] getMembership error:', error.message); return []; }
      return (data || []).map(r => r.list_id);
    } catch (e) {
      console.warn('[Lists] getMembership exception:', e.message);
      return [];
    }
  }

  // Add or remove contentId from a user list; updates that list's count optimistically.
  async function toggleItem(listId, contentId) {
    const target = lists.find(l => l.id === listId);
    if (!target) throw new Error('List not found');
    const prevCount = target.count;

    const sb      = await window.AICDB_AUTH.getClient();
    const session = await window.AICDB_AUTH.getSession();
    if (!session) throw new Error('Not signed in');

    const { data: existing, error: selErr } = await sb
      .from('list_items')
      .select('id')
      .eq('list_id', listId)
      .eq('content_id', contentId)
      .maybeSingle();
    if (selErr) throw selErr;
    const wasIn = !!existing;

    lists = lists.map(l => l.id === listId
      ? { ...l, count: wasIn ? Math.max(0, l.count - 1) : l.count + 1 }
      : l);
    emit();

    try {
      let error;
      if (wasIn) {
        ({ error } = await sb
          .from('list_items')
          .delete()
          .eq('list_id', listId)
          .eq('content_id', contentId));
      } else {
        ({ error } = await sb
          .from('list_items')
          .insert({ list_id: listId, content_id: contentId }));
        if (error && error.code === '23505') error = null;
      }
      if (error) throw error;
    } catch (e) {
      console.warn('[Lists] toggleItem error:', e.message || JSON.stringify(e));
      lists = lists.map(l => l.id === listId ? { ...l, count: prevCount } : l);
      emit();
      throw e;
    }
  }

  // Return content_ids for a list, ordered by added_at (newest first).
  async function getItems(listId) {
    try {
      const sb = await window.AICDB_AUTH.getClient();
      const { data, error } = await sb
        .from('list_items')
        .select('content_id')
        .eq('list_id', listId)
        .order('added_at', { ascending: false });
      if (error) { console.warn('[Lists] getItems error:', error.message); return []; }
      return (data || []).map(r => r.content_id);
    } catch (e) {
      console.warn('[Lists] getItems exception:', e.message);
      return [];
    }
  }

  async function recordView(listId) {
    try {
      const sb = await window.AICDB_AUTH.getClient();
      const session = await window.AICDB_AUTH.getSession();
      if (!session) return { error: 'Not signed in' };
      const userId = session.user.id;
      const { error } = await sb.from('list_views').insert({ list_id: listId, viewer_user_id: userId });
      if (error) {
        if (error.code === '23505') return { viewed: false };
        return { error };
      }
      return { viewed: true };
    } catch (e) {
      return { error: e.message };
    }
  }

  async function toggleFavorite(listId) {
    try {
      const sb = await window.AICDB_AUTH.getClient();
      const session = await window.AICDB_AUTH.getSession();
      if (!session) return { error: 'Not signed in' };
      const userId = session.user.id;
      const { data: existing } = await sb.from('list_favorites').select('list_id').eq('user_id', userId).eq('list_id', listId).maybeSingle();
      if (existing) {
        const { error } = await sb.from('list_favorites').delete().eq('user_id', userId).eq('list_id', listId);
        if (error) return { error };
        return { favorited: false };
      }
      const { error } = await sb.from('list_favorites').insert({ user_id: userId, list_id: listId });
      if (error) return { error };
      return { favorited: true };
    } catch (e) {
      return { error: e.message };
    }
  }

  async function loadFavoritedLists() {
    try {
      const sb = await window.AICDB_AUTH.getClient();
      const session = await window.AICDB_AUTH.getSession();
      if (!session) return [];
      const { data } = await sb.from('list_favorites')
        .select('list_id, lists(id, name, view_count, user_id)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      return (data || []).map(r => r.lists).filter(Boolean);
    } catch (e) {
      return [];
    }
  }

  setTimeout(() => {
    if (!window.AICDB_AUTH || !window.AICDB_AUTH.subscribe) return;
    window.AICDB_AUTH.subscribe(async () => {
      try {
        const session = await window.AICDB_AUTH.getSession();
        const uid = session ? session.user.id : null;
        if (uid === lastUserId) return;
        lastUserId = uid;
        loadPromise = null;
        load();
      } catch (e) { /* swallow — next subscribe call will retry */ }
    });
    load();
  }, 0);

  return {
    get:            () => lists,
    load,
    create,
    rename,
    remove,
    setVisibility,
    getMembership,
    toggleItem,
    getItems,
    recordView,
    toggleFavorite,
    loadFavoritedLists,
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); },
  };
})();

// the signed-in user's main (viewer) account — populated by auth.js once the
// session resolves; null until then so components never show stale mock data.
window.AICDB_MAIN_ACCOUNT = null;

// Signed-in viewer stats. `loggedTitles` gates power-user features (e.g. the
// uniqueness/Sıradışılık rating, which needs 1000+ logged titles to access).
window.AICDB_VIEWER = { loggedTitles: 1240 };
window.AICDB_UNIQUENESS_MIN_LOGGED = 1000;

// Per-title detail metadata — populated dynamically when content is added via admin panel.
window.AICDB_DETAILS = {};

// Derived community stats for a title (from its rating count).
window.AICDB_STAT = function (film) {
  const n = parseFloat(String(film.ratings)) * (String(film.ratings).includes('k') ? 1000 : 1);
  return { watched: n * 6.2, favorited: n * 0.42, watchlisted: n * 0.85, rated: n, completion: 0.78 + (film.score - 3.5) * 0.06 };
};

// Page URL map — used by NavBar, AuthPrompt, and App to navigate to auth pages.
window.AICDB_PAGE = (function () {
  const MAP = {
    login:   '/login.html',
    signup:  '/signup.html',
    profile: '/profile.html',
    admin:   '/admin.html',
    creator: '/creator.html',
  };
  return function (key) {
    return MAP[key] || ('/' + key + '.html');
  };
})();

// Dispatch a require-auth event so AuthPromptHost shows the sign-in modal.
// Returns false when the user is not logged in (caller should bail out).
window.AICDB_REQUIRE_AUTH = function (message) {
  if (window.AICDB_AUTH && window.AICDB_AUTH.isLoggedIn()) return true;
  window.dispatchEvent(new CustomEvent('aicdb:require-auth', { detail: { message } }));
  return false;
};
