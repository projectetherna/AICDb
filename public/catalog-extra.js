// Dreamwall — extended catalog + creators registry + social feed data.
// Loaded AFTER data.js. Expands AICDB_FILMS so the dedicated Films/Series
// browse pages feel full, and adds AICDB_CREATORS + AICDB_FEED.


// ---- creators registry ----
window.AICDB_CREATORS = [];

window.AICDB_CREATOR_BY_NAME = {};
window.AICDB_CREATORS.forEach(c => { window.AICDB_CREATOR_BY_NAME[c.name] = c; });

// derived per-creator stats from the catalog
window.AICDB_CREATOR_STATS = function (creator) {
  const works = window.AICDB_FILMS.filter(f => f.creator === creator.name);
  const avg = works.length ? works.reduce((s, f) => s + f.score, 0) / works.length : 0;
  return { works: works.length, avg, films: works };
};

// ---- social feed: posts from creators (newest first) ----
window.AICDB_FEED = [];

window.AICDB_FILM_BY_ID = {};
window.AICDB_FILMS.forEach(f => { window.AICDB_FILM_BY_ID[f.id] = f; });

// ---- editorial "Staff Pick" flags (hand-picked) ----
['echoes-of-tomorrow', 'saltwater-gods', 'mother-tongue'].forEach(id => {
  if (window.AICDB_FILM_BY_ID[id]) window.AICDB_FILM_BY_ID[id].staffPick = true;
});

// numeric rating count from a film's "24.1k" style string
window.AICDB_RATING_NUM = function (film) {
  const s = String(film.ratings);
  return parseFloat(s) * (s.includes('M') ? 1e6 : s.includes('k') ? 1e3 : 1);
};

// content ribbon: 'staff' (editorially picked) or 'gem' (auto: low-view + high-rated)
window.AICDB_RIBBON = function (film) {
  if (film.staffPick) return 'staff';
  if (window.AICDB_RATING_NUM(film) < 9000 && film.score >= 4.0) return 'gem';
  return null;
};

// similar titles for "More like this": shared genre/type, then by score, excluding self
window.AICDB_SIMILAR = function (film, n) {
  const overlap = (f) => f.genres.filter(g => film.genres.includes(g)).length;
  return window.AICDB_FILMS
    .filter(f => f.id !== film.id)
    .map(f => ({ f, s: overlap(f) * 10 + (f.type === film.type ? 4 : 0) + f.score }))
    .sort((a, b) => b.s - a.s)
    .slice(0, n || 6)
    .map(x => x.f);
};

// footer / settings link groundwork — full supported-language registry
window.AICDB_LANGUAGES = [
  { code:'EN', name:'English',              native:'English' },
  { code:'TR', name:'Turkish',              native:'T\u00fcrk\u00e7e' },
  { code:'ES', name:'Spanish',              native:'Espa\u00f1ol' },
  { code:'FR', name:'French',               native:'Fran\u00e7ais' },
  { code:'DE', name:'German',               native:'Deutsch' },
  { code:'PT', name:'Portuguese',           native:'Portugu\u00eas' },
  { code:'AR', name:'Arabic',               native:'\u0627\u0644\u0639\u0631\u0628\u064a\u0629' },
  { code:'HI', name:'Hindi',                native:'\u0939\u093f\u0928\u094d\u0926\u0940' },
  { code:'JA', name:'Japanese',             native:'\u65e5\u672c\u8a9e' },
  { code:'KO', name:'Korean',               native:'\ud55c\uad6d\uc5b4' },
  { code:'ZH', name:'Chinese (Simplified)', native:'\u7b80\u4f53\u4e2d\u6587' },
  { code:'RU', name:'Russian',              native:'\u0420\u0443\u0441\u0441\u043a\u0438\u0439' },
  { code:'IT', name:'Italian',              native:'Italiano' },
  { code:'NL', name:'Dutch',                native:'Nederlands' },
  { code:'PL', name:'Polish',               native:'Polski' },
  { code:'SV', name:'Swedish',              native:'Svenska' },
  { code:'NO', name:'Norwegian',            native:'Norsk' },
  { code:'DA', name:'Danish',               native:'Dansk' },
  { code:'FI', name:'Finnish',              native:'Suomi' },
  { code:'EL', name:'Greek',                native:'\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac' },
  { code:'HE', name:'Hebrew',               native:'\u05e2\u05d1\u05e8\u05d9\u05ea' },
  { code:'ID', name:'Indonesian',           native:'Bahasa Indonesia' },
  { code:'MS', name:'Malay',                native:'Bahasa Melayu' },
  { code:'TH', name:'Thai',                 native:'\u0e44\u0e17\u0e22' },
  { code:'VI', name:'Vietnamese',           native:'Ti\u1ebfng Vi\u1ec7t' },
  { code:'UK', name:'Ukrainian',            native:'\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430' },
];
// short code list (kept for back-compat with existing selectors)
window.AICDB_LANGS = window.AICDB_LANGUAGES.map(l => l.code);
window.AICDB_LANG_BY_CODE = {};
window.AICDB_LANGUAGES.forEach(l => { window.AICDB_LANG_BY_CODE[l.code] = l; });
