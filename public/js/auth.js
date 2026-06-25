/**
 * AICDb browser auth — Supabase via CDN + /config.js from Worker.
 */
(function (global) {
  const GOOGLE_ICON =
    '<svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path fill="#4285F4" d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.21 1.18-.84 2.18-1.79 2.85v2.26h2.9c1.7-1.57 2.68-3.88 2.68-6.61z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33C2.45 15.98 5.48 18 9 18z"/><path fill="#FBBC05" d="M3.95 10.7c-.18-.54-.28-1.12-.28-1.7s.1-1.16.28-1.7V4.97H.96C.35 6.18 0 7.55 0 9s.35 2.82.96 4.03l3-2.33z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.27.57 2.79 1.04l2.05-2.05C13.47.89 11.43 0 9 0 5.48 0 2.45 2.02.96 4.97l3 2.33C4.66 5.19 6.65 3.58 9 3.58z"/></svg>';

  let clientPromise = null;

  function getConfig() {
    const cfg = global.__AICDB_CONFIG__;
    if (!cfg?.supabaseUrl || !cfg?.supabaseAnonKey) {
      throw new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in .dev.vars.');
    }
    return cfg;
  }

  function getClient() {
    if (!clientPromise) {
      clientPromise = (async () => {
        const { supabaseUrl, supabaseAnonKey } = getConfig();
        const { createClient } = global.supabase;
        return createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            flowType: 'pkce',
            detectSessionInUrl: true,
            persistSession: true,
            autoRefreshToken: true,
          },
        });
      })();
    }
    return clientPromise;
  }

  function redirectUrl(path) {
    return new URL(path, global.location.origin).href;
  }

  function showAlert(el, message, type) {
    if (!el) return;
    el.textContent = message;
    el.className = `auth-alert visible ${type}`;
  }

  function hideAlert(el) {
    if (!el) return;
    el.className = 'auth-alert';
    el.textContent = '';
  }

  function setLoading(form, loading) {
    form.querySelectorAll('button, input').forEach((node) => {
      node.disabled = loading;
    });
  }

  async function requireGuest() {
    const supabase = await getClient();
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      global.location.replace('/');
    }
  }

  async function handleOAuthCallback() {
    const supabase = await getClient();

    // Supabase automatically exchanges the PKCE code from the URL when the
    // client initialises (detectSessionInUrl: true). Calling exchangeCodeForSession
    // manually would consume the one-time code a second time and throw an error.
    // Instead, we wait for the built-in auto-exchange by listening for the
    // SIGNED_IN event; fall back to a getSession() poll if it fires quickly.
    const params = new URLSearchParams(global.location.search);
    const hasCode = !!params.get('code');

    if (hasCode) {
      // Wait up to 8 s for Supabase to fire SIGNED_IN after auto-exchanging the code.
      await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('Sign-in timed out. Try again.')), 8000);
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session) {
            clearTimeout(timer);
            subscription.unsubscribe();
            resolve();
          }
        });
        // Also check immediately in case the exchange already finished before
        // we attached the listener.
        supabase.auth.getSession().then(({ data }) => {
          if (data.session) {
            clearTimeout(timer);
            subscription.unsubscribe();
            resolve();
          }
        });
      });
    } else {
      // No code in URL — just confirm a session already exists (e.g. implicit flow).
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (!data.session) throw new Error('Sign-in could not be completed. Try again.');
    }

    global.location.replace('/');
  }

  async function signInWithGoogle() {
    const supabase = await getClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectUrl('/auth/callback.html') },
    });
    if (error) throw error;
  }

  async function signInWithPassword(email, password) {
    const supabase = await getClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    global.location.replace('/');
  }

  async function signUpWithPassword(email, password, userData) {
    const supabase = await getClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        ...(userData ? { data: userData } : {}),
        emailRedirectTo: redirectUrl('/auth/callback.html'),
      },
    });
    if (error) throw error;
    return data;
  }

  async function getSession() {
    const supabase = await getClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }

  async function signOut() {
    const supabase = await getClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    global.location.reload();
  }

  function wireGoogleButton(button, alertEl) {
    button.innerHTML = `${GOOGLE_ICON} Continue with Google`;
    button.addEventListener('click', async () => {
      hideAlert(alertEl);
      button.disabled = true;
      try {
        await signInWithGoogle();
      } catch (err) {
        showAlert(alertEl, err.message || 'Google sign-in failed.', 'error');
        button.disabled = false;
      }
    });
  }

  function wireLoginForm(form, alertEl) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAlert(alertEl);
      setLoading(form, true);
      const email = form.email.value.trim();
      const password = form.password.value;
      try {
        await signInWithPassword(email, password);
      } catch (err) {
        showAlert(alertEl, err.message || 'Could not sign in.', 'error');
        setLoading(form, false);
      }
    });
  }

  function wireSignupForm(form, alertEl) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAlert(alertEl);
      const password = form.password.value;
      const confirm = form.confirm.value;
      if (password !== confirm) {
        showAlert(alertEl, 'Passwords do not match.', 'error');
        return;
      }
      if (password.length < 8) {
        showAlert(alertEl, 'Password must be at least 8 characters.', 'error');
        return;
      }
      setLoading(form, true);
      const email = form.email.value.trim();
      try {
        const data = await signUpWithPassword(email, password);
        if (data.session) {
          global.location.replace('/');
          return;
        }
        showAlert(
          alertEl,
          'Account created. Check your email to confirm, then sign in.',
          'success',
        );
        setLoading(form, false);
      } catch (err) {
        showAlert(alertEl, err.message || 'Could not create account.', 'error');
        setLoading(form, false);
      }
    });
  }

  async function initHome() {
    const guestNav = document.getElementById('nav-guest');
    const userNav = document.getElementById('nav-user');
    const userLabel = document.getElementById('user-label');
    const signOutBtn = document.getElementById('btn-sign-out');

    try {
      const session = await getSession();
      if (session) {
        guestNav.hidden = true;
        userNav.hidden = false;
        const email = session.user.email ?? 'Member';
        userLabel.innerHTML = `Signed in as <strong>${email}</strong>`;
        signOutBtn?.addEventListener('click', () => signOut());
      } else {
        guestNav.hidden = false;
        userNav.hidden = true;
      }
    } catch {
      guestNav.hidden = false;
      userNav.hidden = true;
    }
  }

  // Synchronous auth state — kept in sync via onAuthStateChange so that
  // useAuth() can read it without awaiting a promise on every render.
  let _loggedIn = false;
  const _subscribers = new Set();

  function _notify() {
    _subscribers.forEach((fn) => fn(_loggedIn));
  }

  function _userColors(userId) {
    // Derive two deterministic accent colors from the user ID so every
    // user gets a unique avatar gradient without needing an image.
    const palettes = [
      ['#d85a30', '#9d8df1'], ['#e5484d', '#4ecdc4'], ['#3b82f6', '#f59e0b'],
      ['#10b981', '#8b5cf6'], ['#f97316', '#06b6d4'], ['#ec4899', '#14b8a6'],
    ];
    let hash = 0;
    for (let i = 0; i < (userId || '').length; i++) hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
    return palettes[hash % palettes.length];
  }

  function _applySessionToGlobals(session) {
    if (!session || !session.user) return;
    const u    = session.user;
    const meta = u.user_metadata || {};
    // Build a best-effort account from the JWT immediately so the UI is never blank.
    // Priority: Google full_name/name > display_name hint > email prefix.
    const rawName = meta.full_name || meta.name || meta.display_name
                  || (u.email || '').split('@')[0] || 'User';
    const name   = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const created = u.created_at ? new Date(u.created_at) : null;
    const joined  = created
      ? 'Joined ' + created.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : 'Member';
    global.AICDB_MAIN_ACCOUNT = { name, avatar: _userColors(u.id), joined };
    _notify();

    // Asynchronously upgrade with the profiles row (has the authoritative display_name
    // and avatar_url written by the DB trigger, which may be richer than the JWT).
    getClient().then((supabase) => {
      supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', u.id)
        .maybeSingle()
        .then(({ data }) => {
          if (!data) return;
          const profileName = data.display_name || name;
          const upgradedName = profileName.charAt(0).toUpperCase() + profileName.slice(1);
          global.AICDB_MAIN_ACCOUNT = {
            name:      upgradedName,
            avatar:    _userColors(u.id),
            avatarUrl: data.avatar_url || null,
            joined,
          };
          _notify();
        })
        .catch(() => {});
    });
  }

  // Initialise: resolve the current session once, then keep state live.
  getClient().then((supabase) => {
    supabase.auth.getSession().then(({ data }) => {
      _loggedIn = !!data.session;
      if (data.session) {
        _applySessionToGlobals(data.session);
      } else {
        global.AICDB_MAIN_ACCOUNT = null;
      }
      _notify();
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      _loggedIn = !!session;
      if (session) {
        _applySessionToGlobals(session);
      } else {
        global.AICDB_MAIN_ACCOUNT = null;
      }
      _notify();
    });
  });

  // Synchronous read — safe to call from React render / useState initialiser.
  function isLoggedIn() {
    return _loggedIn;
  }

  // Subscribe to auth changes. Returns an unsubscribe function (matches
  // the React.useEffect cleanup contract used by useAuth()).
  function subscribe(fn) {
    _subscribers.add(fn);
    return () => _subscribers.delete(fn);
  }

  // Update the signed-in user's profile row and refresh AICDB_MAIN_ACCOUNT.
  // fields: { display_name?, bio? }
  // Returns the saved row data on success, throws on error.
  async function updateProfile(fields) {
    const supabase = await getClient();
    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData?.session?.user?.id;
    if (!uid) throw new Error('Not signed in.');

    // ── Diagnostic logging — remove once the save path is confirmed stable ──
    const _dbg = (label, err) => {
      if (!err) return;
      console.error('[updateProfile] FAILED at:', label);
      console.error('[updateProfile] message:', err.message);
      console.error('[updateProfile] code:   ', err.code);
      console.error('[updateProfile] details:', err.details);
      console.error('[updateProfile] hint:   ', err.hint);
      console.error('[updateProfile] full:   ', err);
    };

    // Step 1: UPDATE without RETURNING.
    // Chaining .select().single() on an UPDATE causes PostgREST to run RETURNING
    // through the SELECT RLS policies. Keeping them separate is safer.
    console.debug('[updateProfile] step 1 — UPDATE, uid=', uid, 'fields=', Object.keys(fields));
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('id', uid);

    _dbg('UPDATE profiles', updateError);
    if (updateError) throw updateError;

    // Step 2: Re-fetch via a plain SELECT.
    // Use .maybeSingle() so we can give an actionable error if no row exists
    // (accounts created before the handle_new_user trigger was installed).
    console.debug('[updateProfile] step 2 — SELECT, uid=', uid);
    const { data, error } = await supabase
      .from('profiles')
      .select('display_name, bio, avatar_url, banner_url, quote, quote_from')
      .eq('id', uid)
      .maybeSingle();

    _dbg('SELECT profiles', error);
    if (error) throw error;
    console.debug('[updateProfile] step 2 result — data=', data);
    if (!data) throw new Error('Profile record not found. Please sign out and sign back in to repair your account.');

    // Treat any null fields from the DB as empty strings/null for safety.
    const row = {
      display_name: data.display_name || fields.display_name || '',
      bio:          data.bio          ?? fields.bio          ?? '',
      avatar_url:   data.avatar_url   ?? fields.avatar_url   ?? null,
      banner_url:   data.banner_url   ?? fields.banner_url   ?? null,
      quote:        data.quote        ?? fields.quote        ?? '',
      quote_from:   data.quote_from   ?? fields.quote_from   ?? '',
    };

    // Keep AICDB_MAIN_ACCOUNT in sync so NavBar picks up the new name/avatar.
    if (global.AICDB_MAIN_ACCOUNT) {
      const n = row.display_name
        ? row.display_name.charAt(0).toUpperCase() + row.display_name.slice(1)
        : global.AICDB_MAIN_ACCOUNT.name;
      global.AICDB_MAIN_ACCOUNT = {
        ...global.AICDB_MAIN_ACCOUNT,
        name:      n,
        avatarUrl: row.avatar_url || null,
      };
      _notify();
    }
    return row;
  }

  // ── Storage upload helper ─────────────────────────────────────────────────
  //
  // uploadImage({ file, path, bucket? })
  //   file   – a File / Blob object from an <input type="file"> or drag-drop
  //   path   – storage path RELATIVE to the user-id prefix, e.g. "avatar.jpg"
  //            the helper prepends the user's id automatically: {uid}/{path}
  //   bucket – defaults to 'images'
  //
  // Returns { publicUrl } on success, throws a descriptive Error on failure.
  //
  // Validation enforced client-side (server also enforces via bucket config):
  //   • Must be an image (MIME type starts with "image/")
  //   • Must be ≤ 5 MB
  //
  const UPLOAD_MAX_BYTES  = 5 * 1024 * 1024; // 5 MB
  const UPLOAD_BUCKET     = 'images';

  async function uploadImage({ file, path, bucket = UPLOAD_BUCKET }) {
    // ── Validation ──
    if (!file || !(file instanceof Blob)) {
      throw new Error('No file provided.');
    }
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed (JPEG, PNG, WebP, GIF, AVIF).');
    }
    if (file.size > UPLOAD_MAX_BYTES) {
      throw new Error(`File is too large. Maximum size is ${UPLOAD_MAX_BYTES / 1024 / 1024} MB.`);
    }

    // ── Auth ──
    const supabase = await getClient();
    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData?.session?.user?.id;
    if (!uid) throw new Error('You must be signed in to upload images.');

    // ── Build storage path: {uid}/{path} ──
    const storagePath = `${uid}/${path}`;

    // ── Upload (upsert = replace if exists) ──
    console.debug('[uploadImage] uploading to bucket=', bucket, 'path=', storagePath, 'type=', file.type, 'size=', file.size);
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('[uploadImage] FAILED — storage upload error:', uploadError);
      throw new Error(uploadError.message || 'Upload failed.');
    }

    // ── Resolve public URL ──
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(storagePath);

    console.debug('[uploadImage] publicUrl=', urlData?.publicUrl);
    if (!urlData?.publicUrl) throw new Error('Could not resolve public URL after upload.');

    // Append a cache-busting version stamp so that when the same path is
    // overwritten (upsert), the resulting URL is different from the previous
    // one.  Browsers and CDNs key their caches on the full URL, so a changed
    // query-string forces a fresh fetch even though the storage path is
    // identical.  The stamp is persisted into avatar_url / banner_url in the
    // profiles table, so it survives page reloads.
    const bust = Date.now();
    const publicUrl = urlData.publicUrl.split('?')[0] + '?v=' + bust;
    return { publicUrl };
  }

  global.AICDB_AUTH = {
    getClient,
    getSession,
    isLoggedIn,
    subscribe,
    signOut,
    signInWithPassword,
    signUpWithPassword,
    updateProfile,
    uploadImage,
    requireGuest,
    handleOAuthCallback,
    wireGoogleButton,
    wireLoginForm,
    wireSignupForm,
    initHome,
    showAlert,
    hideAlert,
  };
})(window);
