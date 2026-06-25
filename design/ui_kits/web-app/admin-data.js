// Dreamwall — Admin Panel mock data. Loaded after data.js + catalog-extra.js.
// Synthesizes users, activity, reports, content submissions, and time-series
// for the admin charts. All fictional.

// ---- platform-wide users (creators come from AICDB_CREATORS + a few viewers) ----
window.ADMIN_USERS = (function () {
  const creatorUsers = (window.AICDB_CREATORS || []).map((c, i) => ({
    id: 'u-' + c.id,
    name: c.name,
    handle: c.handle,
    email: c.handle.replace('@', '') + '@aicdb.io',
    av: c.av,
    joined: ['2023-02-14', '2023-06-01', '2023-08-22', '2024-01-09', '2024-03-30', '2024-05-18', '2024-07-02', '2023-11-11', '2024-09-14', '2024-10-01', '2025-01-20'][i % 11],
    role: 'creator',
    verified: c.verified,
    works: (window.AICDB_CREATOR_STATS ? window.AICDB_CREATOR_STATS(c).works : 0),
    banned: false,
  }));
  const viewers = [];
  /* removed sample viewer/admin accounts
  const _viewers_sample = [
    { id:'u-lena',   name:'Lena Reyes',     handle:'@lenar',        av:['#d85a30','#e5b23b'], joined:'2024-02-11', role:'viewer',  works:0, banned:false },
    { id:'u-marco',  name:'Marco Vidal',    handle:'@marcov',       av:['#9d8df1','#d85a30'], joined:'2024-04-03', role:'viewer',  works:0, banned:false },
    { id:'u-framek', name:'theframekeeper', handle:'@framekeeper',  av:['#4ecdc4','#6f9ceb'], joined:'2023-09-19', role:'viewer',  works:0, banned:false },
    { id:'u-ada',    name:'Ada Vance',      handle:'@adavance',     av:['#d85a30','#9d8df1'], joined:'2024-01-02', role:'admin',   works:0, banned:false },
    { id:'u-spam1',  name:'gen_spam_films', handle:'@genspam',      av:['#5a5e66','#3a3d44'], joined:'2025-05-28', role:'viewer',  works:0, banned:true,  banReason:'Spam submissions' },
    { id:'u-troll',  name:'rate_bomber',    handle:'@ratebomber',   av:['#7a3a3a','#3a1f1f'], joined:'2025-04-12', role:'viewer',  works:0, banned:true,  banReason:'Rating manipulation' },
    { id:'u-quiet',  name:'quiet_watcher',  handle:'@quietw',       av:['#3a8fb0','#1a2b33'], joined:'2025-02-08', role:'viewer',  works:0, banned:false },
    { id:'u-newby',  name:'first_frame',    handle:'@firstframe',   av:['#e5b23b','#4ecdc4'], joined:'2025-06-01', role:'viewer',  works:0, banned:false },
  ];
  */
  viewers.forEach(v => { if (!v.email) v.email = v.handle.replace('@', '') + '@gmail.com'; });
  return [...creatorUsers, ...viewers];
})();

window.ADMIN_USER_EMAILS = {};

// ---- content submissions queue (pending / published / rejected) ----
window.ADMIN_SUBMISSIONS = (function () {
  // published = the live catalog
  const published = (window.AICDB_FILMS || []).map(f => ({
    id: f.id, title: f.title, creator: f.creator, type: f.type, g: f.g,
    score: f.score, ratings: f.ratings, status: 'published',
    date: (f.year || 2024) + '-0' + (1 + (f.title.length % 9)) + '-1' + (f.title.length % 9),
  }));
  // pending = brand-new submissions awaiting review (no score yet)
  const pending = [];
  // rejected = bounced submissions, with a reason
  const rejected = [];
  /* removed sample pending/rejected submissions
  const _pending_sample = [
    { id:'p-grainstudy7', title:'Grain Study #7',        creator:'Maya Okonkwo',        type:'short',  g:['#2b2512','#d0a93a'], date:'2026-06-01', status:'pending' },
    { id:'p-thelongway',  title:'The Long Way Down',     creator:'@nullframe',          type:'vertical',g:['#241a3a','#9d8df1'], date:'2026-05-31', status:'pending' },
    { id:'p-saltmarsh',   title:'Saltmarsh',             creator:'Noor Farah',          type:'series', g:['#10302d','#3fae9f'], date:'2026-05-30', status:'pending' },
    { id:'p-emberlight',  title:'Emberlight',            creator:'Bashir Halabi',       type:'movie',  g:['#2e1a14','#c0653a'], date:'2026-05-29', status:'pending' },
    { id:'p-nullcity',    title:'Null City',             creator:'Cosmic Pixel Co.',    type:'movie',  g:['#1a2b33','#3a8fb0'], date:'2026-05-28', status:'pending' },
  ];
  // rejected = bounced submissions, with a reason
  const rejected = [
    { id:'r-deepfake1',  title:'Untitled (Celebrity)',  creator:'@genspam',   type:'movie', g:['#3a3d44','#5a5e66'], date:'2026-05-22', status:'rejected', reason:'Unauthorized likeness of a real person' },
    { id:'r-lowq',       title:'test test test',        creator:'@firstframe',type:'short', g:['#262624','#3a3a38'], date:'2026-05-20', status:'rejected', reason:'Low-effort / placeholder content' },
    { id:'r-dup',        title:'Redshift (re-upload)',  creator:'@ratebomber',type:'movie', g:['#341512','#e5484d'], date:'2026-05-18', status:'rejected', reason:'Duplicate of existing title' },
  ];
  */
  return [...pending, ...published, ...rejected];
})();

// ---- reports: content + comments ----
window.ADMIN_REPORTS = {
  content: [],
  comments: [],
};

// ---- bug reports submitted via the Feedback Flama (beta bug reporter) ----
window.ADMIN_BUG_REPORTS = [];

// ---- recent activity feed (dashboard) ----
window.ADMIN_ACTIVITY = [];

// ---- aggregate platform stats (dashboard cards) ----
window.ADMIN_STATS = {
  totalUsers: window.ADMIN_USERS.length,
  totalContent: window.AICDB_FILMS.length,
  pendingReviews: window.ADMIN_SUBMISSIONS.filter(s => s.status === 'pending').length,
  activeToday: 0,
  totalRatings: 0,
  reportedItems: window.ADMIN_REPORTS.content.length + window.ADMIN_REPORTS.comments.length,
};

// ---- time series for charts (flat/empty — no activity yet) ----
window.ADMIN_SERIES = { active: new Array(30).fill(0), regs: new Array(30).fill(0) };

// ---- leaderboards ----
window.ADMIN_LEADERS = (function () {
  const byViews = [...window.AICDB_FILMS]
    .map(f => ({ film: f, views: Math.round(window.AICDB_STAT(f).watched) }))
    .sort((a, b) => b.views - a.views).slice(0, 6);
  const byRatings = [...window.AICDB_FILMS]
    .map(f => ({ film: f, rated: Math.round(window.AICDB_STAT(f).rated) }))
    .sort((a, b) => b.rated - a.rated).slice(0, 6);
  const topCreators = [...(window.AICDB_CREATORS || [])]
    .sort((a, b) => b.followers - a.followers).slice(0, 6);
  return { byViews, byRatings, topCreators };
})();
