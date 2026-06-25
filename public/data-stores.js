// Dreamwall — secondary data stores (reviews, favorites, consistency, creator accounts)

// Creator accounts — DB-backed via Supabase RLS (creator_profiles).
window.AICDB_CREATOR_ACCOUNTS = (function () {
  let _rows = [];
  const subs = new Set();
  let loadPromise = null;
  let lastUserId = null;

  function emit() {
    subs.forEach(fn => { try { fn(_rows); } catch (e) {} });
  }

  async function getSessionUser(sb) {
    const session = await window.AICDB_AUTH.getSession();
    if (!session) return { session: null, userId: null };
    return { session, userId: session.user.id };
  }

  function normalizeRow(row) {
    if (!row) return row;
    return {
      ...row,
      name: row.display_name || '',
      showOnProfile: row.show_on_main_profile !== false,
      social: row.social_links || {},
      tools: Array.isArray(row.tools) ? row.tools : [],
      notes: row.notes || '',
      avatar: row.avatar || ['#d85a30', '#9d8df1'],
      avatarImg: row.avatar_url || null,
      banner: row.banner_url || null,
    };
  }

  function dataToDbFields(data) {
    const out = {};
    if ('handle' in data) out.handle = data.handle ?? null;
    if ('display_name' in data || 'name' in data) out.display_name = data.display_name ?? data.name ?? null;
    if ('bio' in data) out.bio = data.bio ?? null;
    if ('avatar_url' in data) out.avatar_url = data.avatar_url ?? null;
    else if ('avatarImg' in data) out.avatar_url = data.avatarImg ?? null;
    if ('banner_url' in data || 'banner' in data) out.banner_url = data.banner_url ?? data.banner ?? null;
    if ('location' in data) out.location = data.location ?? null;
    if ('tools' in data) out.tools = data.tools ?? null;
    if ('notes' in data) out.notes = data.notes ?? null;
    if ('show_on_main_profile' in data || 'showOnProfile' in data) {
      out.show_on_main_profile = data.show_on_main_profile ?? data.showOnProfile ?? true;
    }
    if ('social_links' in data || 'social' in data) out.social_links = data.social_links ?? data.social ?? null;
    return out;
  }

  async function load() {
    if (loadPromise) return loadPromise;
    loadPromise = (async () => {
      try {
        const sb = await window.AICDB_AUTH.getClient();
        const { session, userId } = await getSessionUser(sb);
        if (!session) {
          _rows = [];
          lastUserId = null;
          emit();
          return _rows;
        }
        const { data, error } = await sb
          .from('creator_profiles')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: true });
        if (error) {
          console.warn('[CreatorAccounts] load error:', error.message, error.code);
          return _rows;
        }
        _rows = (data || []).map(normalizeRow);
        lastUserId = userId;
        emit();
        return _rows;
      } catch (e) {
        console.warn('[CreatorAccounts] load exception:', e.message);
        return _rows;
      } finally {
        loadPromise = null;
      }
    })();
    return loadPromise;
  }

  async function add(data) {
    try {
      const sb = await window.AICDB_AUTH.getClient();
      const { session, userId } = await getSessionUser(sb);
      if (!session) return { data: null, error: { message: 'Not signed in' } };
      const fields = dataToDbFields(data);
      const { data: row, error } = await sb
        .from('creator_profiles')
        .insert({ user_id: userId, ...fields })
        .select()
        .single();
      if (error) {
        console.warn('[CreatorAccounts] add error:', error.message, error.code);
        return { data: null, error };
      }
      await load();
      return { data: normalizeRow(row), error: null };
    } catch (e) {
      console.warn('[CreatorAccounts] add exception:', e.message);
      return { data: null, error: { message: e.message } };
    }
  }

  async function update(id, patch) {
    try {
      const sb = await window.AICDB_AUTH.getClient();
      const { session } = await getSessionUser(sb);
      if (!session) return { data: null, error: { message: 'Not signed in' } };
      const fields = dataToDbFields(patch);
      if (!Object.keys(fields).length) return { data: byId(id), error: null };
      const { data: row, error } = await sb
        .from('creator_profiles')
        .update(fields)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        console.warn('[CreatorAccounts] update error:', error.message, error.code);
        return { data: null, error };
      }
      await load();
      return { data: normalizeRow(row), error: null };
    } catch (e) {
      console.warn('[CreatorAccounts] update exception:', e.message);
      return { data: null, error: { message: e.message } };
    }
  }

  async function remove(id) {
    try {
      const sb = await window.AICDB_AUTH.getClient();
      const { session } = await getSessionUser(sb);
      if (!session) return { data: null, error: { message: 'Not signed in' } };
      const { data, error } = await sb
        .from('creator_profiles')
        .delete()
        .eq('id', id)
        .select()
        .single();
      if (error) {
        console.warn('[CreatorAccounts] remove error:', error.message, error.code);
        return { data: null, error };
      }
      await load();
      return { data, error: null };
    } catch (e) {
      console.warn('[CreatorAccounts] remove exception:', e.message);
      return { data: null, error: { message: e.message } };
    }
  }

  function get() { return _rows; }
  function byId(id) { return _rows.find(a => a.id === id) || null; }
  function count() { return _rows.length; }
  function subscribe(fn) { subs.add(fn); }
  function unsubscribe(fn) { subs.delete(fn); }

  setTimeout(() => {
    if (!window.AICDB_AUTH || !window.AICDB_AUTH.subscribe) return;
    window.AICDB_AUTH.subscribe(async (loggedIn) => {
      try {
        const session = await window.AICDB_AUTH.getSession();
        const uid = session ? session.user.id : null;
        if (loggedIn) {
          loadPromise = null;
          lastUserId = uid;
          await load();
          return;
        }
        if (uid === lastUserId) return;
        lastUserId = uid;
        loadPromise = null;
        load();
      } catch (e) { /* swallow — next subscribe call will retry */ }
    });
    load();
  }, 0);

  return { load, get, byId, count, add, update, remove, subscribe, unsubscribe };
})();

(async () => {
  try {
    const session = await window.AICDB_AUTH.getSession();
    if (session) await window.AICDB_CREATOR_ACCOUNTS.load();
  } catch (e) {}
})();

// Reviews store — DB-backed via Supabase RLS.
window.AICDB_REVIEWS = (function () {
  const LOAD_SELECT = 'id, body, is_public, created_at, user_id, profiles(display_name)';
  const USER_LOAD_SELECT = 'id, body, is_public, created_at, user_id, content_id, content(title, poster_url)';

  async function getSessionUser(sb) {
    const session = await window.AICDB_AUTH.getSession();
    if (!session) return { session: null, userId: null };
    return { session, userId: session.user.id };
  }

  async function load(contentId) {
    try {
      const sb = await window.AICDB_AUTH.getClient();
      const { data, error } = await sb
        .from('reviews')
        .select(LOAD_SELECT)
        .eq('content_id', contentId)
        .order('created_at', { ascending: false });
      if (error) { console.warn('[Reviews] load error:', error.message, error.code); return []; }
      return data || [];
    } catch (e) {
      console.warn('[Reviews] load exception:', e.message);
      return [];
    }
  }

  async function submit(contentId, body) {
    const trimmed = String(body || '').trim();
    if (!trimmed) return { data: null, error: { message: 'Review cannot be empty' } };
    try {
      const sb = await window.AICDB_AUTH.getClient();
      const { session, userId } = await getSessionUser(sb);
      if (!session) return { data: null, error: { message: 'Not signed in' } };
      const { data: authData } = await sb.auth.getUser();
      console.log('REVIEW_SUBMIT_START:', { contentId, userId: authData?.user?.id ?? null });
      const { data, error } = await sb
        .from('reviews')
        .insert({ user_id: userId, content_id: contentId, body: trimmed, is_public: true })
        .select(LOAD_SELECT)
        .single();
      console.log('REVIEW_SUBMIT_RESULT:', { data, error });
      if (error) { console.warn('[Reviews] submit error:', error.message, error.code); }
      return { data, error };
    } catch (e) {
      console.warn('[Reviews] submit exception:', e.message);
      return { data: null, error: { message: e.message } };
    }
  }

  async function update(reviewId, body) {
    const trimmed = String(body || '').trim();
    if (!trimmed) return { data: null, error: { message: 'Review cannot be empty' } };
    try {
      const sb = await window.AICDB_AUTH.getClient();
      const { session, userId } = await getSessionUser(sb);
      if (!session) return { data: null, error: { message: 'Not signed in' } };
      const { data, error } = await sb
        .from('reviews')
        .update({ body: trimmed })
        .eq('id', reviewId)
        .eq('user_id', userId)
        .select(LOAD_SELECT)
        .single();
      if (error) { console.warn('[Reviews] update error:', error.message, error.code); }
      return { data, error };
    } catch (e) {
      console.warn('[Reviews] update exception:', e.message);
      return { data: null, error: { message: e.message } };
    }
  }

  async function remove(reviewId) {
    try {
      const sb = await window.AICDB_AUTH.getClient();
      const { session, userId } = await getSessionUser(sb);
      if (!session) return { data: null, error: { message: 'Not signed in' } };
      const { data, error } = await sb
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', userId)
        .select('id')
        .single();
      if (error) { console.warn('[Reviews] remove error:', error.message, error.code); }
      return { data, error };
    } catch (e) {
      console.warn('[Reviews] remove exception:', e.message);
      return { data: null, error: { message: e.message } };
    }
  }

  async function togglePublic(reviewId, isPublic) {
    try {
      const sb = await window.AICDB_AUTH.getClient();
      const { session, userId } = await getSessionUser(sb);
      if (!session) return { data: null, error: { message: 'Not signed in' } };
      const { data, error } = await sb
        .from('reviews')
        .update({ is_public: !!isPublic })
        .eq('id', reviewId)
        .eq('user_id', userId)
        .select(LOAD_SELECT)
        .single();
      if (error) { console.warn('[Reviews] togglePublic error:', error.message, error.code); }
      return { data, error };
    } catch (e) {
      console.warn('[Reviews] togglePublic exception:', e.message);
      return { data: null, error: { message: e.message } };
    }
  }

  async function loadForUser(userId) {
    try {
      const sb = await window.AICDB_AUTH.getClient();
      const { data, error } = await sb
        .from('reviews')
        .select(USER_LOAD_SELECT)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) { console.warn('[Reviews] loadForUser error:', error.message, error.code); return []; }
      return data || [];
    } catch (e) {
      console.warn('[Reviews] loadForUser exception:', e.message);
      return [];
    }
  }

  return { load, submit, update, remove, togglePublic, loadForUser };
})();

// Profile favorites — five fixed slots per user (public.profile_favorites).
window.AICDB_PROFILE_FAVORITES = (function () {
  async function getSessionUser(sb) {
    const session = await window.AICDB_AUTH.getSession();
    if (!session) return { session: null, userId: null };
    return { session, userId: session.user.id };
  }

  async function load(userId) {
    if (!userId) return [];
    try {
      const sb = await window.AICDB_AUTH.getClient();
      const { data, error } = await sb
        .from('profile_favorites')
        .select('position, content_id')
        .eq('user_id', userId)
        .order('position', { ascending: true });
      if (error) { console.warn('[ProfileFavorites] load error:', error.message, error.code); return []; }
      return (data || []).map(row => ({
        position: row.position,
        content_id: row.content_id,
      }));
    } catch (e) {
      console.warn('[ProfileFavorites] load exception:', e.message);
      return [];
    }
  }

  async function add(contentId, position) {
    try {
      const sb = await window.AICDB_AUTH.getClient();
      const { session, userId } = await getSessionUser(sb);
      if (!session) return { data: null, error: { message: 'Not signed in' } };
      const { data, error } = await sb
        .from('profile_favorites')
        .upsert(
          { user_id: userId, content_id: contentId, position },
          { onConflict: 'user_id,position' }
        )
        .select('position, content_id')
        .single();
      if (error) { console.warn('[ProfileFavorites] add error:', error.message, error.code); }
      return { data, error };
    } catch (e) {
      console.warn('[ProfileFavorites] add exception:', e.message);
      return { data: null, error: { message: e.message } };
    }
  }

  async function remove(position) {
    try {
      const sb = await window.AICDB_AUTH.getClient();
      const { session, userId } = await getSessionUser(sb);
      if (!session) return { data: null, error: { message: 'Not signed in' } };
      const { data, error } = await sb
        .from('profile_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('position', position)
        .select('position, content_id')
        .maybeSingle();
      if (error) { console.warn('[ProfileFavorites] remove error:', error.message, error.code); }
      return { data, error };
    } catch (e) {
      console.warn('[ProfileFavorites] remove exception:', e.message);
      return { data: null, error: { message: e.message } };
    }
  }

  async function move(fromPosition, toPosition) {
    if (fromPosition === toPosition) return { error: null };
    try {
      const sb = await window.AICDB_AUTH.getClient();
      const { session, userId } = await getSessionUser(sb);
      if (!session) return { error: { message: 'Not signed in' } };

      const { data: rows, error: loadErr } = await sb
        .from('profile_favorites')
        .select('position, content_id')
        .eq('user_id', userId)
        .in('position', [fromPosition, toPosition]);
      if (loadErr) { console.warn('[ProfileFavorites] move load error:', loadErr.message); return { error: loadErr }; }

      const fromRow = (rows || []).find(r => r.position === fromPosition);
      const toRow = (rows || []).find(r => r.position === toPosition);
      if (!fromRow) return { error: { message: 'Source slot is empty' } };

      if (!toRow) {
        const { error } = await sb
          .from('profile_favorites')
          .update({ position: toPosition })
          .eq('user_id', userId)
          .eq('position', fromPosition);
        if (error) { console.warn('[ProfileFavorites] move error:', error.message, error.code); }
        return { error };
      }

      const { error: e1 } = await sb
        .from('profile_favorites')
        .update({ content_id: toRow.content_id })
        .eq('user_id', userId)
        .eq('position', fromPosition);
      if (e1) { console.warn('[ProfileFavorites] move error (step 1):', e1.message, e1.code); return { error: e1 }; }

      const { error: e2 } = await sb
        .from('profile_favorites')
        .update({ content_id: fromRow.content_id })
        .eq('user_id', userId)
        .eq('position', toPosition);
      if (e2) { console.warn('[ProfileFavorites] move error (step 2):', e2.message, e2.code); }
      return { error: e2 };
    } catch (e) {
      console.warn('[ProfileFavorites] move exception:', e.message);
      return { error: { message: e.message } };
    }
  }

  return { load, add, remove, move };
})();

// Consistency ratings store — separate from main quality ratings (public.ratings).
window.AICDB_CONSISTENCY = (function () {
  async function load(contentId) {
    try {
      const sb = await window.AICDB_AUTH.getClient();
      const session = await window.AICDB_AUTH.getSession();
      const userId = session ? session.user.id : null;
      const { data, error } = await sb
        .from('consistency_ratings')
        .select('user_id, score')
        .eq('content_id', contentId);
      if (error) {
        console.warn('[Consistency] load error:', error.message, error.code);
        return { userScore: null, communityAvg: null };
      }
      const rows = data || [];
      let userScore = null;
      if (userId) {
        const mine = rows.find(r => r.user_id === userId);
        userScore = mine != null ? parseFloat(mine.score) : null;
      }
      const communityAvg = rows.length
        ? Math.round((rows.reduce((sum, r) => sum + parseFloat(r.score), 0) / rows.length) * 10) / 10
        : null;
      return { userScore, communityAvg };
    } catch (e) {
      console.warn('[Consistency] load exception:', e.message);
      return { userScore: null, communityAvg: null };
    }
  }

  async function submit(contentId, score) {
    try {
      const sb = await window.AICDB_AUTH.getClient();
      const session = await window.AICDB_AUTH.getSession();
      if (!session) return { data: null, error: { message: 'Not signed in' } };
      const { data, error } = await sb
        .from('consistency_ratings')
        .upsert(
          { user_id: session.user.id, content_id: contentId, score },
          { onConflict: 'user_id,content_id' }
        )
        .select()
        .single();
      if (error) console.warn('[Consistency] submit error:', error.message, error.code);
      return { data, error };
    } catch (e) {
      console.warn('[Consistency] submit exception:', e.message);
      return { data: null, error: { message: e.message } };
    }
  }

  return { load, submit };
})();

window.AICDB_FOLLOWS = (() => {
  let _rows = []; // { id, follower_user_id, target_type, target_id, created_at }
  const emit = (fn) => fn(_rows);
  const _subs = [];
  const notify = () => _subs.forEach(fn => fn(_rows));

  return {
    async load() {
      try {
        const sb = await window.AICDB_AUTH.getClient();
        const session = await window.AICDB_AUTH.getSession();
        if (!session) { _rows = []; notify(); return; }
        const { data } = await sb.from('follows').select('*').eq('follower_user_id', session.user.id);
        _rows = data || [];
        notify();
      } catch (e) {}
    },
    get() { return _rows; },
    isFollowing(targetType, targetId) {
      return _rows.some(r => r.target_type === targetType && r.target_id === targetId);
    },
    async follow(targetType, targetId) {
      try {
        const sb = await window.AICDB_AUTH.getClient();
        const session = await window.AICDB_AUTH.getSession();
        if (!session) return { error: 'Not signed in' };
        const { error } = await sb.from('follows').insert({ follower_user_id: session.user.id, target_type: targetType, target_id: targetId });
        if (!error) await this.load();
        return { error };
      } catch (e) { return { error: e.message }; }
    },
    async unfollow(targetType, targetId) {
      try {
        const sb = await window.AICDB_AUTH.getClient();
        const session = await window.AICDB_AUTH.getSession();
        if (!session) return { error: 'Not signed in' };
        const { error } = await sb.from('follows').delete().eq('follower_user_id', session.user.id).eq('target_type', targetType).eq('target_id', targetId);
        if (!error) await this.load();
        return { error };
      } catch (e) { return { error: e.message }; }
    },
    async toggle(targetType, targetId) {
      if (this.isFollowing(targetType, targetId)) return this.unfollow(targetType, targetId);
      return this.follow(targetType, targetId);
    },
    subscribe(fn) { _subs.push(fn); return () => { const i = _subs.indexOf(fn); if (i > -1) _subs.splice(i, 1); }; }
  };
})();

window.AICDB_POSTS = (() => {
  return {
    async loadFeed(limit = 30) {
      try {
        const sb = await window.AICDB_AUTH.getClient();
        const session = await window.AICDB_AUTH.getSession();
        if (!session) return [];
        const follows = window.AICDB_FOLLOWS.get();
        const followedUserIds = follows.filter(f => f.target_type === 'user').map(f => f.target_id);
        const followedCreatorIds = follows.filter(f => f.target_type === 'creator').map(f => f.target_id);
        followedUserIds.push(session.user.id);

        const select = 'id, text, image_url, linked_content_id, list_id, created_at, user_id, creator_profile_id, profiles!user_id(display_name, avatar_url), creator_profiles(display_name, handle)';

        const queries = [
          sb.from('posts').select(select).in('user_id', followedUserIds).is('creator_profile_id', null).order('created_at', { ascending: false }).limit(limit),
          sb.from('posts').select(select).eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(limit),
        ];
        if (followedCreatorIds.length > 0) {
          queries.push(
            sb.from('posts').select(select).in('creator_profile_id', followedCreatorIds).order('created_at', { ascending: false }).limit(limit)
          );
        }

        const batches = await Promise.all(queries.map(q => q.then(({ data }) => data || [])));
        const seen = new Set();
        const merged = [];
        for (const batch of batches) {
          for (const post of batch) {
            if (!seen.has(post.id)) {
              seen.add(post.id);
              merged.push(post);
            }
          }
        }
        merged.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return merged.slice(0, limit);
      } catch (e) { return []; }
    },
    async submit(text, options = {}) {
      try {
        const sb = await window.AICDB_AUTH.getClient();
        const session = await window.AICDB_AUTH.getSession();
        if (!session) return { error: 'Not signed in' };
        const row = {
          user_id: session.user.id,
          text: text.trim(),
          creator_profile_id: options.creatorProfileId || null,
          image_url: options.imageUrl || null,
          linked_content_id: options.linkedContentId || null,
          list_id: options.listId || null,
        };
        const { data, error } = await sb.from('posts').insert(row).select('id').single();
        return { data, error };
      } catch (e) { return { error: e.message }; }
    },
    async remove(postId) {
      try {
        const sb = await window.AICDB_AUTH.getClient();
        const { error } = await sb.from('posts').delete().eq('id', postId);
        return { error };
      } catch (e) { return { error: e.message }; }
    },
    async toggleLike(postId) {
      try {
        const sb = await window.AICDB_AUTH.getClient();
        const session = await window.AICDB_AUTH.getSession();
        if (!session) return { error: 'Not signed in' };
        const { data: existing } = await sb.from('post_likes').select('post_id').eq('user_id', session.user.id).eq('post_id', postId).maybeSingle();
        if (existing) {
          const { error } = await sb.from('post_likes').delete().eq('user_id', session.user.id).eq('post_id', postId);
          return { liked: false, error };
        } else {
          const { error } = await sb.from('post_likes').insert({ user_id: session.user.id, post_id: postId });
          return { liked: true, error };
        }
      } catch (e) { return { error: e.message }; }
    },
    async getLikeCount(postId) {
      try {
        const sb = await window.AICDB_AUTH.getClient();
        const { count } = await sb.from('post_likes').select('*', { count: 'exact', head: true }).eq('post_id', postId);
        return count || 0;
      } catch (e) { return 0; }
    },
    async toggleSave(postId) {
      try {
        const sb = await window.AICDB_AUTH.getClient();
        const session = await window.AICDB_AUTH.getSession();
        if (!session) return { error: 'Not signed in' };
        const { data: existing } = await sb.from('post_saves').select('post_id').eq('user_id', session.user.id).eq('post_id', postId).maybeSingle();
        if (existing) {
          await sb.from('post_saves').delete().eq('user_id', session.user.id).eq('post_id', postId);
          return { saved: false };
        } else {
          await sb.from('post_saves').insert({ user_id: session.user.id, post_id: postId });
          return { saved: true };
        }
      } catch(e) { return { error: e.message }; }
    },
    async loadSavedPosts() {
      try {
        const sb = await window.AICDB_AUTH.getClient();
        const session = await window.AICDB_AUTH.getSession();
        if (!session) return [];
        const { data } = await sb.from('post_saves')
          .select('post_id, posts(id, text, image_url, linked_content_id, list_id, created_at, user_id, creator_profile_id, profiles!user_id(display_name, avatar_url), creator_profiles(display_name, handle))')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
        return (data || []).map(r => r.posts).filter(Boolean);
      } catch(e) { return []; }
    }
  };
})();

window.AICDB_AUTH.subscribe(async (loggedIn) => {
  if (loggedIn) await window.AICDB_FOLLOWS.load();
  else { /* clear follows */ }
});

(async () => {
  try {
    const session = await window.AICDB_AUTH.getSession();
    if (session) await window.AICDB_FOLLOWS.load();
  } catch (e) {}
})();
