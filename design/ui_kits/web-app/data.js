// Dreamwall — sample catalog data for the UI kit (fictional titles)
window.AICDB_TYPES = {
  movie:    { label: 'Movie',    color: 'var(--type-movie)',    ghost: 'var(--type-movie-ghost)',    text: 'var(--type-movie-text)',    icon: 'film' },
  series:   { label: 'Series',   color: 'var(--type-series)',   ghost: 'var(--type-series-ghost)',   text: 'var(--type-series-text)',   icon: 'tv' },
  short:    { label: 'Short',    color: 'var(--type-short)',    ghost: 'var(--type-short-ghost)',    text: 'var(--type-short-text)',    icon: 'clapperboard' },
  vertical: { label: 'Vertical', color: 'var(--type-vertical)', ghost: 'var(--type-vertical-ghost)', text: 'var(--type-vertical-text)', icon: 'smartphone' },
};

// Catalog is intentionally empty — the platform starts with no published
// titles, so every surface renders its empty state.
window.AICDB_FILMS = [];

// Watchlist store — shared across pages, persisted to localStorage.
window.AICDB_WATCHLIST = (function () {
  const KEY = 'aicdb_watchlist';
  let ids;
  try { ids = JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch (e) { ids = []; }
  const subs = new Set();
  function emit() {
    try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch (e) {}
    subs.forEach(fn => fn(ids));
  }
  return {
    get: () => ids,
    has: (id) => ids.includes(id),
    toggle: (id) => { ids = ids.includes(id) ? ids.filter(x => x !== id) : [id, ...ids]; emit(); },
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); },
  };
})();

// Creator accounts the (signed-in) user has created. Empty by default — the
// user starts with no creator account. Shared across pages via localStorage.
window.AICDB_CREATOR_ACCOUNTS = (function () {
  const KEY = 'aicdb_creator_accounts';
  let list;
  try { list = JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch (e) { list = []; }
  if (!Array.isArray(list)) list = [];
  const subs = new Set();
  function emit() {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
    subs.forEach(fn => fn(list));
  }
  return {
    get: () => list,
    count: () => list.length,
    byId: (id) => list.find(a => a.id === id) || null,
    add: (acct) => {
      const id = acct.id || ('ca-' + Date.now().toString(36));
      const rec = { id, showOnProfile: true, ...acct };
      list = [...list, rec];
      emit();
      return rec;
    },
    update: (id, patch) => { list = list.map(a => a.id === id ? { ...a, ...patch } : a); emit(); },
    remove: (id) => { list = list.filter(a => a.id !== id); emit(); },
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); },
  };
})();

// the signed-in user's main (viewer) account. No demo account exists by
// default — surfaces that show it guard for null.
window.AICDB_MAIN_ACCOUNT = null;

// Signed-in viewer stats. `loggedTitles` gates power-user features (e.g. the
// uniqueness/Sıradışılık rating, which needs 1000+ logged titles to access).
window.AICDB_VIEWER = { loggedTitles: 0 };
window.AICDB_UNIQUENESS_MIN_LOGGED = 1000;

// Per-title detail metadata — quotes, series counts, crew, production, "extraordinary" meter.
window.AICDB_DETAILS = {};
/* removed sample per-title detail metadata
const _AICDB_DETAILS_SAMPLE = {
  'synthetic-dreams': {
    quote: 'Every dream I sell is a door someone forgets to close.',
    extraordinary: 78, budget: '$2.4M', duration: '14 months', contributors: 38,
    models: ['Diffusion v6', 'VoxSynth 2', 'ToneField'],
    crew: [['Direction','Maya Okonkwo'],['Prompt Architect','Yuki Tanaka'],['Model Supervisor','Dapo Okafor'],['Sound Design','Lena Sørensen'],['Voice Synthesis','Atlas Voices'],['Edit & Compositing','Reva Mehta']],
  },
  'echoes-of-tomorrow': {
    seasons: 3, episodes: 24,
    quote: 'We keep almost meeting ourselves — and almost is its own kind of forever.',
    extraordinary: 91, budget: '$11.8M', duration: '2 years', contributors: 84,
    models: ['Hybrid-Render X', 'VoxSynth 3', 'MotionField Pro', 'NeRF-Live'],
    crew: [['Showrunner','The Vale Collective'],['Prompt Architect','Iris Calloway'],['Model Supervisor','Theo Vance'],['Sound Design','Marisol Reyes'],['Voice Cast','Live + Synth Ensemble'],['Continuity AI','Juno Park']],
  },
  'paper-suns': {
    quote: 'The light always touches the smallest things first.',
    extraordinary: 64, budget: '$180k', duration: '5 months', contributors: 9,
    models: ['FrameInterp 4', 'PaperGAN'],
    crew: [['Direction','Ito Render Lab'],['Animation Lead','Kenji Aoyama'],['Prompt Architect','Mira Sato'],['Sound Design','Field & Fold'],['Score','Hana Vermeer']],
  },
  'sixty-seconds-down': {
    quote: 'Sixty floors. One of us is not getting off.',
    extraordinary: 52, budget: '$45k', duration: '6 weeks', contributors: 5,
    models: ['Text-to-Video 3', 'VoxSynth 2'],
    crew: [['Direction','@nullframe'],['Prompt Architect','D. Reyes'],['Sound Design','Nullroom'],['Voice Synthesis','Atlas Voices']],
  },
  'the-long-render': {
    quote: 'A perfect frame costs you every imperfect year.',
    extraordinary: 83, budget: '$3.1M', duration: '4 years', contributors: 27,
    models: ['Diffusion v6', 'ToneField', 'GrainEngine'],
    crew: [['Direction','Bashir Halabi'],['Prompt Architect','Selin Aydın'],['Model Supervisor','M. Costa'],['Sound Design','Halabi Audio'],['Edit & Compositing','Noa Frank']],
  },
  'glass-orchard': {
    seasons: 1, episodes: 8,
    quote: 'The fruit grows faces because the orchard remembers.',
    extraordinary: 74, budget: '$6.4M', duration: '18 months', contributors: 52,
    models: ['Hybrid-Render X', 'VoxSynth 3', 'BotanyGAN'],
    crew: [['Showrunner','Noor Farah'],['Prompt Architect','Eli Brandt'],['Model Supervisor','S. Aziz'],['Sound Design','Orchard Foley'],['Voice Cast','Live Ensemble'],['Edit & Compositing','Dana Wu']],
  },
  'redshift': {
    quote: 'The star is running. So are we.',
    extraordinary: 47, budget: '$2.0M', duration: '11 months', contributors: 31,
    models: ['Diffusion v6', 'MotionField Pro'],
    crew: [['Direction','Cosmic Pixel Co.'],['Prompt Architect','V. Sokolov'],['Model Supervisor','R. Okonjo'],['Sound Design','Pixel Audio'],['Voice Synthesis','Atlas Voices']],
  },
  'minute-of-static-removed': {
    quote: '', extraordinary: 0, budget: '', duration: '', contributors: 0,
    models: ['Text-to-Video 3', 'GrainEngine'],
    crew: [['Direction','@deadair'],['Prompt Architect','K. Mraz'],['Sound Design','Dead Air Foley']],
  },
};
*/

// Derived community stats for a title (from its rating count).
window.AICDB_STAT = function (film) {
  const n = parseFloat(String(film.ratings)) * (String(film.ratings).includes('k') ? 1000 : 1);
  return { watched: n * 6.2, favorited: n * 0.42, watchlisted: n * 0.85, rated: n, completion: 0.78 + (film.score - 7) * 0.03 };
};

window.AICDB_REVIEWS = [];

// ============================================================
// Auth — logged-out by default. Persisted to localStorage so the
// signed-in state survives navigation between pages.
// ============================================================
window.AICDB_AUTH = (function () {
  const KEY = 'aicdb_logged_in';
  let on;
  try { on = JSON.parse(localStorage.getItem(KEY) || 'false'); } catch (e) { on = false; }
  const subs = new Set();
  function emit() {
    try { localStorage.setItem(KEY, JSON.stringify(on)); } catch (e) {}
    subs.forEach(fn => fn(on));
  }
  return {
    isLoggedIn: () => !!on,
    login: () => { on = true; emit(); },
    logout: () => { on = false; emit(); },
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); },
  };
})();

// Resolve a logical page key to a URL that works in BOTH the dev UI-kit
// (lowercase siblings) and the bundled root snapshots ("Dreamwall X.html").
window.AICDB_PAGE = (function () {
  const file = decodeURIComponent((location.pathname.split('/').pop() || ''));
  const isBundle = /^Dreamwall /.test(file);
  const kit = {
    home: 'index.html', login: 'login.html', signup: 'signup.html',
    profile: 'profile.html', watchlist: 'index.html#Watchlist', feed: 'index.html#Feed',
    mycontents: 'my-contents.html',
  };
  const root = {
    home: 'Dreamwall Web App.html', login: 'Dreamwall Login.html', signup: 'Dreamwall Sign Up.html',
    profile: 'Dreamwall Profile.html', watchlist: 'Dreamwall Web App.html#Watchlist', feed: 'Dreamwall Web App.html#Feed',
    mycontents: 'Dreamwall My Contents.html',
  };
  const map = isBundle ? root : kit;
  return (key) => map[key] || key;
})();

// Gate an interactive action behind auth. Returns true if signed in; otherwise
// fires 'aicdb:require-auth' (the AuthPromptHost shows the "Sign in to continue"
// popup) and returns false so callers can bail.
window.AICDB_REQUIRE_AUTH = function (message) {
  if (window.AICDB_AUTH.isLoggedIn()) return true;
  window.dispatchEvent(new CustomEvent('aicdb:require-auth', { detail: { message } }));
  return false;
};

// Hard guard for login-only standalone pages — redirects to login when signed out.
window.AICDB_GUARD = function () {
  if (window.AICDB_AUTH.isLoggedIn()) return true;
  try { location.replace(window.AICDB_PAGE('login')); } catch (e) { location.href = window.AICDB_PAGE('login'); }
  return false;
};
