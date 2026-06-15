// Dreamwall — sample catalog data for the UI kit (fictional titles)
window.AICDB_TYPES = {
  movie:    { label: 'Movie',    color: 'var(--type-movie)',    ghost: 'var(--type-movie-ghost)',    text: 'var(--type-movie-text)',    icon: 'film' },
  series:   { label: 'Series',   color: 'var(--type-series)',   ghost: 'var(--type-series-ghost)',   text: 'var(--type-series-text)',   icon: 'tv' },
  short:    { label: 'Short',    color: 'var(--type-short)',    ghost: 'var(--type-short-ghost)',    text: 'var(--type-short-text)',    icon: 'clapperboard' },
  vertical: { label: 'Vertical', color: 'var(--type-vertical)', ghost: 'var(--type-vertical-ghost)', text: 'var(--type-vertical-text)', icon: 'smartphone' },
};

window.AICDB_FILMS = [
  { id:'synthetic-dreams', title:'Synthetic Dreams', type:'movie', year:2025, runtime:'142 min', score:8.7, stars:4.5, ratings:'24.1k',
    g:['#3a2118','#d85a30'], genres:['Sci-Fi','Neo-Noir'], technique:'Diffusion',
    creator:'Maya Okonkwo', synopsis:'A memory-broker in a rain-slicked megacity discovers the dreams she sells are bleeding into a shared reality no one can switch off.' },
  { id:'echoes-of-tomorrow', title:'Echoes of Tomorrow', type:'series', year:2024, runtime:'3 seasons', score:9.1, stars:5, ratings:'58.3k',
    g:['#10302d','#4ecdc4'], genres:['Sci-Fi','Drama'], technique:'Hybrid Live-Action',
    creator:'The Vale Collective', synopsis:'Across three timelines, a family keeps almost meeting itself. An aching, generation-spanning epic rendered entirely in latent space.' },
  { id:'paper-suns', title:'Paper Suns', type:'short', year:2025, runtime:'11 min', score:7.9, stars:4, ratings:'6.2k',
    g:['#332a12','#e5b23b'], genres:['Animation'], technique:'Frame Interp.',
    creator:'Ito Render Lab', synopsis:'A folded-paper world unfurls at dawn. A wordless miniature about the things light touches first.' },
  { id:'sixty-seconds-down', title:'Sixty Seconds Down', type:'vertical', year:2025, runtime:'1 min', score:7.2, stars:3.5, ratings:'12.8k',
    g:['#241a3a','#9d8df1'], genres:['Thriller'], technique:'Text-to-Video',
    creator:'@nullframe', synopsis:'An elevator. A stranger. Sixty floors. Shot for the phone, built for the scroll.' },
  { id:'the-long-render', title:'The Long Render', type:'movie', year:2024, runtime:'128 min', score:8.3, stars:4, ratings:'19.4k',
    g:['#2a1410','#c44a2a'], genres:['Drama'], technique:'Diffusion',
    creator:'Bashir Halabi', synopsis:'A reclusive director spends a decade generating a single perfect frame — and loses everyone who waited for it.' },
  { id:'glass-orchard', title:'Glass Orchard', type:'series', year:2025, runtime:'1 season', score:8.8, stars:4.5, ratings:'31.0k',
    g:['#0f2e2b','#3aa9a1'], genres:['Mystery','Drama'], technique:'Hybrid Live-Action',
    creator:'Noor Farah', synopsis:'In a town where the trees grow glass fruit, a botanist investigates why the harvest has started showing faces.' },
  { id:'redshift', title:'Redshift', type:'movie', year:2025, runtime:'117 min', score:6.4, stars:3, ratings:'9.7k',
    g:['#341512','#e5484d'], genres:['Sci-Fi','Action'], technique:'Diffusion',
    creator:'Cosmic Pixel Co.', synopsis:'A salvage crew chases a derelict generation-ship toward a star that is moving away faster than light should allow.' },
  { id:'minute-of-static', title:'Minute of Static', type:'vertical', year:2024, runtime:'1 min', score:7.6, stars:4, ratings:'15.2k',
    g:['#1e1a36','#7c6fe0'], genres:['Horror'], technique:'Text-to-Video',
    creator:'@deadair', synopsis:'Every night at 3:33 the channel cuts to static — and something on the other side is learning to look back.' },
];

// Watchlist store — shared across pages, persisted to localStorage.
window.AICDB_WATCHLIST = (function () {
  const KEY = 'aicdb_watchlist';
  let ids;
  try { ids = JSON.parse(localStorage.getItem(KEY) || '["glass-orchard","redshift"]'); }
  catch (e) { ids = ['glass-orchard', 'redshift']; }
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

// the signed-in user's main (viewer) account — shown atop the creator-setup page
window.AICDB_MAIN_ACCOUNT = { name: 'Ada Vance', handle: '@adavance', avatar: ['#d85a30', '#9d8df1'], joined: 'Joined March 2024' };

// Signed-in viewer stats. `loggedTitles` gates power-user features (e.g. the
// uniqueness/Sıradışılık rating, which needs 1000+ logged titles to access).
window.AICDB_VIEWER = { loggedTitles: 1240 };
window.AICDB_UNIQUENESS_MIN_LOGGED = 1000;

// Per-title detail metadata — quotes, series counts, crew, production, "extraordinary" meter.
window.AICDB_DETAILS = {
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
  'minute-of-static': {
    quote: 'At 3:33 the static learns your face.',
    extraordinary: 69, budget: '$30k', duration: '4 weeks', contributors: 4,
    models: ['Text-to-Video 3', 'GrainEngine'],
    crew: [['Direction','@deadair'],['Prompt Architect','K. Mraz'],['Sound Design','Dead Air Foley']],
  },
};

// Derived community stats for a title (from its rating count).
window.AICDB_STAT = function (film) {
  const n = parseFloat(String(film.ratings)) * (String(film.ratings).includes('k') ? 1000 : 1);
  return { watched: n * 6.2, favorited: n * 0.42, watchlisted: n * 0.85, rated: n, completion: 0.78 + (film.score - 7) * 0.03 };
};

window.AICDB_REVIEWS = [
  { user:'Lena R.', av:['#d85a30','#e5b23b'], stars:5, when:'2 days ago', likes:142, body:"The diffusion grain isn't a limitation here — it's the whole point. Every frame looks like a half-remembered dream. Stunning." },
  { user:'theframekeeper', av:['#4ecdc4','#6f9ceb'], stars:4, when:'1 week ago', likes:88, body:"Ambitious to a fault. The middle act loses the plot in its own latent space, but that final render is worth the price of admission." },
  { user:'Marco V.', av:['#9d8df1','#d85a30'], stars:4.5, when:'2 weeks ago', likes:54, body:"Proof that 'AI-generated' and 'has a soul' aren't mutually exclusive. I've rewatched the rooftop sequence five times." },
];
