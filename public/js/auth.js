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
    const params = new URLSearchParams(global.location.search);
    const code = params.get('code');

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
    }

    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (!data.session) {
      throw new Error('Sign-in could not be completed. Try again.');
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

  async function signUpWithPassword(email, password) {
    const supabase = await getClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl('/auth/callback.html') },
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

  global.AICDB_AUTH = {
    getClient,
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
