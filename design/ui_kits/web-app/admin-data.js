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
  const viewers = [
    { id:'u-lena',   name:'Lena Reyes',     handle:'@lenar',        av:['#d85a30','#e5b23b'], joined:'2024-02-11', role:'viewer',  works:0, banned:false },
    { id:'u-marco',  name:'Marco Vidal',    handle:'@marcov',       av:['#9d8df1','#d85a30'], joined:'2024-04-03', role:'viewer',  works:0, banned:false },
    { id:'u-framek', name:'theframekeeper', handle:'@framekeeper',  av:['#4ecdc4','#6f9ceb'], joined:'2023-09-19', role:'viewer',  works:0, banned:false },
    { id:'u-ada',    name:'Ada Vance',      handle:'@adavance',     av:['#d85a30','#9d8df1'], joined:'2024-01-02', role:'admin',   works:0, banned:false },
    { id:'u-spam1',  name:'gen_spam_films', handle:'@genspam',      av:['#5a5e66','#3a3d44'], joined:'2025-05-28', role:'viewer',  works:0, banned:true,  banReason:'Spam submissions' },
    { id:'u-troll',  name:'rate_bomber',    handle:'@ratebomber',   av:['#7a3a3a','#3a1f1f'], joined:'2025-04-12', role:'viewer',  works:0, banned:true,  banReason:'Rating manipulation' },
    { id:'u-quiet',  name:'quiet_watcher',  handle:'@quietw',       av:['#3a8fb0','#1a2b33'], joined:'2025-02-08', role:'viewer',  works:0, banned:false },
    { id:'u-newby',  name:'first_frame',    handle:'@firstframe',   av:['#e5b23b','#4ecdc4'], joined:'2025-06-01', role:'viewer',  works:0, banned:false },
  ];
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
  const pending = [
    { id:'p-tidewalkers', title:'Tidewalkers',          creator:'Maya Okonkwo',        type:'movie',  g:['#0e2a2e','#2f8f8a'], date:'2026-06-02', status:'pending' },
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
  return [...pending, ...published, ...rejected];
})();

// ---- reports: content + comments ----
window.ADMIN_REPORTS = {
  content: [
    { id:'rc1', target:'Redshift (re-upload)', targetType:'Movie', by:'@framekeeper', reason:'Duplicate / re-upload of existing content', date:'2026-06-02', severity:'medium' },
    { id:'rc2', target:'Untitled (Celebrity)', targetType:'Movie', by:'@lenar',       reason:'Uses a real person’s likeness without consent', date:'2026-06-01', severity:'high' },
    { id:'rc3', target:'Minute of Static',     targetType:'Vertical', by:'@quietw',    reason:'Disturbing imagery, missing content warning', date:'2026-05-30', severity:'low' },
    { id:'rc4', target:'Null City',            targetType:'Movie', by:'@marcov',       reason:'Suspected AI-model license violation', date:'2026-05-29', severity:'medium' },
  ],
  comments: [
    { id:'rm1', target:'“This is the worst thing I’ve…”', targetType:'Review on Redshift', by:'@marcov',     reason:'Harassment toward the creator', date:'2026-06-02', severity:'high' },
    { id:'rm2', target:'“Rate this 1 star everyone, it…”', targetType:'Comment on Saltwater Gods', by:'@lenar', reason:'Organizing review-bombing', date:'2026-06-01', severity:'high' },
    { id:'rm3', target:'“dm me for free prompt packs”',   targetType:'Comment on Glass Orchard', by:'@quietw', reason:'Spam / self-promotion', date:'2026-05-31', severity:'low' },
  ],
};

// ---- bug reports submitted via the Feedback Flama (beta bug reporter) ----
window.ADMIN_BUG_REPORTS = [
  { id:'bg1', by:'@lenar',       page:'Film detail',   desc:'Star rating control jumps back to 0 after I submit a half-star score — the value doesn’t stick on reload.', image:true,  date:'2026-06-03' },
  { id:'bg2', by:'@marcov',      page:'Feed',          desc:'Upvote count flickers and briefly shows the downvote total when I click fast.', image:false, date:'2026-06-03' },
  { id:'bg3', by:'@framekeeper', page:'Add Content',   desc:'Poster upload preview is stretched on the 2:3 dropzone — looks squished until I refresh.', image:true,  date:'2026-06-02' },
  { id:'bg4', by:'@quietw',      page:'Profile',       desc:'Followed Creators cards overflow the container on a narrow window and clip the Following button.', image:true,  date:'2026-06-02' },
  { id:'bg5', by:'@firstframe',  page:'Watchlist',     desc:'Removing a title from the hover rail removes the wrong row sometimes.', image:false, date:'2026-06-01' },
  { id:'bg6', by:'@marcov',      page:'Creators',      desc:'Follow button on the featured creator stays on “Following” even after I unfollow and come back.', image:false, date:'2026-05-31' },
];

// ---- recent activity feed (dashboard) ----
window.ADMIN_ACTIVITY = [
  { kind:'register',  who:'first_frame',     detail:'created an account',                 time:'4m ago',  av:['#e5b23b','#4ecdc4'] },
  { kind:'submission',who:'Maya Okonkwo',    detail:'submitted “Tidewalkers” for review', time:'22m ago', av:['#d85a30','#9d8df1'] },
  { kind:'report',    who:'theframekeeper',  detail:'reported “Redshift (re-upload)”',     time:'38m ago', av:['#4ecdc4','#6f9ceb'] },
  { kind:'submission',who:'@nullframe',      detail:'submitted “The Long Way Down”',       time:'1h ago',  av:['#9d8df1','#d85a30'] },
  { kind:'register',  who:'quiet_watcher',   detail:'created an account',                  time:'2h ago',  av:['#3a8fb0','#1a2b33'] },
  { kind:'report',    who:'lenar',           detail:'reported a comment on “Saltwater Gods”', time:'3h ago', av:['#d85a30','#e5b23b'] },
  { kind:'submission',who:'Noor Farah',      detail:'submitted “Saltmarsh” for review',    time:'5h ago',  av:['#a04a8f','#e5b23b'] },
  { kind:'ban',       who:'rate_bomber',     detail:'was banned for rating manipulation',  time:'6h ago',  av:['#7a3a3a','#3a1f1f'] },
  { kind:'register',  who:'cinephile_22',    detail:'created an account',                  time:'8h ago',  av:['#6f9ceb','#9d8df1'] },
];

// ---- aggregate platform stats (dashboard cards) ----
window.ADMIN_STATS = {
  totalUsers: 128400,
  totalContent: window.AICDB_FILMS.length + 6,
  pendingReviews: window.ADMIN_SUBMISSIONS.filter(s => s.status === 'pending').length,
  activeToday: 18230,
  totalRatings: 1240000,
  reportedItems: window.ADMIN_REPORTS.content.length + window.ADMIN_REPORTS.comments.length,
};

// ---- time series for charts ----
window.ADMIN_SERIES = (function () {
  // 30 days of active users (with weekly rhythm) and new registrations
  const active = [], regs = [];
  let base = 14000;
  for (let i = 0; i < 30; i++) {
    const weekend = (i % 7 === 5 || i % 7 === 6) ? 1.18 : 1;
    const trend = 1 + i * 0.012;
    const noise = 0.92 + ((i * 37) % 17) / 100;
    active.push(Math.round(base * weekend * trend * noise));
    regs.push(Math.round(120 + i * 6 + ((i * 53) % 19) * 11 * (weekend > 1 ? 1.3 : 1)));
  }
  return { active, regs };
})();

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
