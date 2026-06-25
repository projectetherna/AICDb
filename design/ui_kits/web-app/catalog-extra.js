// Dreamwall — extended catalog + creators registry + social feed data.
// Loaded AFTER data.js. Expands AICDB_FILMS so the dedicated Films/Series
// browse pages feel full, and adds AICDB_CREATORS + AICDB_FEED.

// ---- season counts on the two existing series ----
(function () {
  const seasons = { 'echoes-of-tomorrow': 3, 'glass-orchard': 1 };
  window.AICDB_FILMS.forEach(f => { if (seasons[f.id]) f.seasons = seasons[f.id]; });
})();

// ---- additional titles ----
// (sample catalog removed — platform starts with no published titles)
/* removed sample titles
window.AICDB_FILMS.push(
  // movies
  { id:'saltwater-gods', title:'Saltwater Gods', type:'movie', year:2025, runtime:'141 min', score:9.0, stars:5, ratings:'33.4k',
    g:['#0e2a2e','#2f8f8a'], genres:['Fantasy','Drama'], technique:'Diffusion', creator:'Maya Okonkwo',
    synopsis:'A drowned pantheon wakes beneath a fishing town, and the only person who can hear them is the girl who stopped believing.' },
  { id:'the-cartographer', title:'The Cartographer', type:'movie', year:2025, runtime:'134 min', score:8.9, stars:4.5, ratings:'21.7k',
    g:['#13212e','#2f6f8f'], genres:['Adventure','Fantasy'], technique:'Hybrid Live-Action', creator:'Nova Pictures',
    synopsis:'A mapmaker is hired to chart a country that rearranges itself every night — and falls in love with a road that no longer exists.' },
  { id:'mother-tongue', title:'Mother Tongue', type:'movie', year:2024, runtime:'96 min', score:8.5, stars:4.5, ratings:'14.2k',
    g:['#2c1a2e','#a04a8f'], genres:['Drama'], technique:'Diffusion', creator:'Noor Farah',
    synopsis:'Three generations of women speak a private language no model can translate — until one tries.' },
  { id:'vapor-trail', title:'Vapor Trail', type:'movie', year:2025, runtime:'108 min', score:7.7, stars:4, ratings:'8.9k',
    g:['#1a2b33','#3a8fb0'], genres:['Sci-Fi','Drama'], technique:'Text-to-Video', creator:'Selma Reyes',
    synopsis:'A test pilot keeps outliving her own flights. Quiet science fiction about loud, unfinished feelings.' },
  { id:'eclipse-theory', title:'Eclipse Theory', type:'movie', year:2023, runtime:'119 min', score:6.9, stars:3.5, ratings:'7.1k',
    g:['#2a2412','#b08a2f'], genres:['Thriller','Sci-Fi'], technique:'Diffusion', creator:'Cosmic Pixel Co.',
    synopsis:'During a 7-minute eclipse, every clock on Earth runs backwards — and a detective gets exactly that long to prevent a murder.' },
  // series
  { id:'the-quiet-sequence', title:'The Quiet Sequence', type:'series', year:2025, runtime:'4 seasons', seasons:4, score:8.6, stars:4.5, ratings:'40.2k',
    g:['#10302d','#3fae9f'], genres:['Drama'], technique:'Hybrid Live-Action', creator:'The Vale Collective',
    synopsis:'A monastery of sound engineers records the last quiet places on Earth before they vanish. Four seasons, almost no dialogue.' },
  { id:'nightvale-frequencies', title:'Nightvale Frequencies', type:'series', year:2024, runtime:'2 seasons', seasons:2, score:8.2, stars:4, ratings:'17.5k',
    g:['#1e1530','#6b5bd0'], genres:['Mystery','Horror'], technique:'Diffusion', creator:'Theo Vance',
    synopsis:'A pirate radio host broadcasts to a town that may not exist. Every caller knows something they shouldn\u2019t.' },
  { id:'hollow-sun', title:'Hollow Sun', type:'series', year:2025, runtime:'2 seasons', seasons:2, score:7.4, stars:3.5, ratings:'11.0k',
    g:['#2e1a14','#c0653a'], genres:['Western','Sci-Fi'], technique:'Diffusion', creator:'Bashir Halabi',
    synopsis:'A frontier town orbits a dying star. The sheriff is the only one who remembers it used to give light.' },
  { id:'margin-of-error', title:'Margin of Error', type:'series', year:2024, runtime:'1 season', seasons:1, score:7.8, stars:4, ratings:'9.3k',
    g:['#1c2433','#4a73b0'], genres:['Comedy','Drama'], technique:'Text-to-Video', creator:'Selma Reyes',
    synopsis:'The world\u2019s worst quality-assurance team tests reality itself. Every bug they find rewrites a life.' },
  // shorts
  { id:'tin-halo', title:'Tin Halo', type:'short', year:2025, runtime:'8 min', score:8.1, stars:4, ratings:'5.4k',
    g:['#2b2512','#d0a93a'], genres:['Animation','Drama'], technique:'Frame Interp.', creator:'Ito Render Lab',
    synopsis:'A scrapyard angel earns its wings one rusted feather at a time. Eight minutes, no dialogue, all light.' },
  { id:'bottle-episode', title:'Bottle Episode', type:'short', year:2024, runtime:'14 min', score:7.0, stars:3.5, ratings:'3.8k',
    g:['#241a1a','#9a5a5a'], genres:['Drama'], technique:'Text-to-Video', creator:'@nullframe',
    synopsis:'Two strangers, one stalled subway car, fourteen real-time minutes. Shot vertical, built for the scroll.' },
);
*/

// ---- creators registry. `name` matches film.creator strings so works/score derive at runtime ----
window.AICDB_CREATORS = [];
/* removed sample creators registry
const _AICDB_CREATORS_SAMPLE = [
  { id:'vale',     name:'The Vale Collective', handle:'@thevale',     av:['#4ecdc4','#6f9ceb'], followers:92400, verified:true,
    location:'Remote', tagline:'A six-person studio building generation-spanning epics in latent space.' },
  { id:'maya',     name:'Maya Okonkwo',        handle:'@mayaokonkwo', av:['#d85a30','#9d8df1'], followers:48200, verified:true,
    location:'Lagos \u00b7 Berlin', tagline:"I don't generate films \u2014 I haunt them into existence." },
  { id:'nova',     name:'Nova Pictures',       handle:'@novapictures',av:['#2f6f8f','#4ecdc4'], followers:54800, verified:true,
    location:'Reykjav\u00edk', tagline:"Maps to places that don't exist yet." },
  { id:'theo',     name:'Theo Vance',          handle:'@theovance',   av:['#6b5bd0','#9d8df1'], followers:38900, verified:true,
    location:'Manchester', tagline:"Frequencies you can't unhear." },
  { id:'noor',     name:'Noor Farah',          handle:'@noorfarah',   av:['#a04a8f','#e5b23b'], followers:31800, verified:true,
    location:'Amman', tagline:'Botanist turned showrunner. I grow stories the way orchards grow fruit.' },
  { id:'bashir',   name:'Bashir Halabi',       handle:'@bashirhalabi',av:['#c44a2a','#e5b23b'], followers:27600, verified:true,
    location:'Beirut', tagline:'One perfect frame at a time. Patience is my render farm.' },
  { id:'ito',      name:'Ito Render Lab',      handle:'@itorenderlab',av:['#e5b23b','#4ecdc4'], followers:22300, verified:true,
    location:'Kyoto', tagline:'Wordless miniatures. The light touches the smallest things first.' },
  { id:'nullframe', name:'@nullframe',         handle:'@nullframe',   av:['#9d8df1','#d85a30'], followers:64100, verified:false,
    location:'Online', tagline:'Built for the scroll. Sixty floors, one minute, no mercy.' },
  { id:'cosmic',   name:'Cosmic Pixel Co.',    handle:'@cosmicpixel', av:['#e5484d','#6f9ceb'], followers:18900, verified:false,
    location:'Austin', tagline:'Genre-fluid pixel pushers. We chase stars that run away.' },
  { id:'selma',    name:'Selma Reyes',         handle:'@selmareyes',  av:['#3a8fb0','#1a2b33'], followers:12700, verified:false,
    location:'Lisbon', tagline:'Quiet sci-fi about loud feelings.' },
  { id:'deadair',  name:'@deadair',            handle:'@deadair',     av:['#7c6fe0','#1e1a36'], followers:15200, verified:false,
    location:'Unknown', tagline:'At 3:33 the static learns your face.' },
];
*/

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
/* removed sample social feed
const _AICDB_FEED_SAMPLE = [
  { id:'p1', creator:'maya', time:'2h', kind:'upload', film:'saltwater-gods',
    text:'Three years in latent space. <b>Saltwater Gods</b> is finally live. Go drown in it. \u{1F30A}',
    likes:1240, comments:89, reposts:142 },
  { id:'p2', creator:'vale', time:'5h', kind:'text',
    text:'Season 4 of The Quiet Sequence wrapped today. We\u2019re exhausted and we already miss it. Thank you to everyone who rated S3 \u2014 your notes literally shaped the finale.',
    likes:980, comments:64, reposts:51 },
  { id:'p3', creator:'noor', time:'8h', kind:'rating', film:'the-cartographer', stars:4.5,
    text:'Nova Pictures did something extraordinary here. The map sequence alone is worth your whole evening.',
    likes:412, comments:23, reposts:18 },
  { id:'p4', creator:'bashir', time:'11h', kind:'text', mention:'the-long-render',
    text:'Unpopular opinion: a high score was never the goal. A single frame someone still remembers ten years from now \u2014 that\u2019s the whole job.',
    likes:1510, comments:203, reposts:188 },
  { id:'p5', creator:'theo', time:'14h', kind:'list', listTitle:'Late Night Static',
    listFilms:['minute-of-static','nightvale-frequencies','hollow-sun','sixty-seconds-down'],
    text:'A playlist for 3am. Don\u2019t say I didn\u2019t warn you.',
    likes:523, comments:37, reposts:44 },
  { id:'p6', creator:'nullframe', time:'18h', kind:'upload', film:'bottle-episode',
    text:'new drop. 14 minutes this time. i\u2019m growing.',
    likes:660, comments:41, reposts:30 },
  { id:'p7', creator:'ito', time:'1d', kind:'upload', film:'tin-halo',
    text:'Tin Halo \u2014 8 minutes, no dialogue, all light. Headphones on, lights off.',
    likes:388, comments:19, reposts:22 },
  { id:'p8', creator:'maya', time:'1d', kind:'rating', film:'echoes-of-tomorrow', stars:5,
    text:'Rewatched the entire thing the night before my own premiere. Still the bar. Forever the bar. @thevale',
    likes:734, comments:52, reposts:61 },
  { id:'p9', creator:'nova', time:'2d', kind:'text',
    text:'Prepping something big for next quarter. If you\u2019ve trained a coastline model you\u2019re proud of, my inbox is open. No coastlines too small.',
    likes:295, comments:28, reposts:12 },
];
*/

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
  if (window.AICDB_RATING_NUM(film) < 9000 && film.score >= 8.0) return 'gem';
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
