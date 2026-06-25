// Dreamwall UI kit — User profile page
// Dark cinematic. Reuses Primitives (Icon, Button, Avatar, StarRating, ScoreRing,
// ContentBadge, scoreColor), NavBar, FilmCard, and AICDB_FILMS / AICDB_TYPES.

const PROFILE = {
  name: 'Guest',
  initials: 'G',
  joined: 'Not signed in',
  quote: '',
  avatar: ['#5a5e66', '#3a3d44'],
  watched: 0,
  lists: 0,
  avgRating: 0,
  hours: 0,
  reviews: 0,
  thisYear: 0,
  favGenre: '—',
  favGenreShare: 'No ratings yet',
};

// films keyed by id for convenience
function filmsById() {
  const m = {};
  window.AICDB_FILMS.forEach(f => { m[f.id] = f; });
  return m;
}

const LAST_RATED = [];

// the full rating history (built from the catalog) for the "See all" page.
// Deterministic pseudo user-scores + dates so the same titles always read the same.
function allRatedEntries() {
  const seeded = {};
  LAST_RATED.forEach(r => { seeded[r.id] = r; });
  const films = window.AICDB_FILMS || [];
  const out = [];
  let day = 0;
  films.forEach((f, i) => {
    if (seeded[f.id]) { out.push({ ...seeded[f.id], film: f }); return; }
    // derive a stable half-star score near the title's own AI score
    const base = Math.round((f.score / 2) * 2) / 2;
    const you = Math.max(1, Math.min(5, base + ((i % 3) - 1) * 0.5));
    day += 9 + (i % 4) * 5;
    const d = new Date(2026, 3, 28); d.setDate(d.getDate() - day);
    out.push({ id:f.id, you, date: d.toISOString().slice(0, 10), film: f });
  });
  // newest first
  return out.sort((a, b) => (a.date < b.date ? 1 : -1));
}

function fmtRatedDate(iso) {
  try {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
  } catch (e) { return iso; }
}

const FAVORITES = [];

// user-created lists (title + how many titles each holds)
const CREATED_LISTS = [];

const BADGES = [];

// ---- Section heading (centered or left) ----
function SectionHeading({ children, align = 'left', sub }) {
  return (
    <div style={{ textAlign: align, marginBottom: 22 }}>
      <h2 style={{ font:'var(--text-h2)', color:'var(--fg-0)', letterSpacing:'-0.01em' }}>{children}</h2>
      {sub && <p style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', margin:'6px 0 0' }}>{sub}</p>}
    </div>
  );
}

// ---- TOP: profile / watched / lists ----
function TopSection() {
  return (
    <div style={{ position:'relative', marginBottom:60 }}>
      {/* cinematic banner */}
      <div style={{ position:'relative', height:200, borderRadius:'var(--radius-xl)', overflow:'hidden',
        background:'linear-gradient(120deg, #2a1410 0%, #241a3a 50%, #10302d 120%)' }}>
        <div style={{ position:'absolute', inset:0,
          background:'radial-gradient(70% 120% at 18% 0%, rgba(216,90,48,0.28), transparent 55%),'
            +'radial-gradient(60% 120% at 82% 10%, rgba(78,205,196,0.20), transparent 55%)' }} />
        <div style={{ position:'absolute', inset:0, opacity:0.5,
          backgroundImage:'radial-gradient(rgba(245,243,239,0.05) 1px, transparent 1px)', backgroundSize:'5px 5px' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(10,10,10,0.05), var(--bg-0) 96%)' }} />
      </div>

      {/* overlapping content card */}
      <div className="aicdb-profile-top" style={{ position:'relative', margin:'-72px 20px 0', padding:'0 8px',
        display:'grid', gridTemplateColumns:'1.15fr 1fr 1fr', alignItems:'center' }}>

        {/* LEFT — photo + identity */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', padding:'0 28px' }}>
          <div style={{ width:128, height:128, borderRadius:'50%', flex:'none', position:'relative',
            background:`linear-gradient(135deg, ${PROFILE.avatar[0]}, ${PROFILE.avatar[1]})`,
            border:'4px solid var(--bg-0)', boxShadow:'var(--shadow-3)',
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ font:'600 56px/1 var(--font-display)', color:'rgba(255,255,255,0.92)' }}>{PROFILE.initials}</span>
            <div style={{ position:'absolute', inset:0, borderRadius:'50%',
              boxShadow:'inset 0 2px 18px rgba(255,255,255,0.25), inset 0 -10px 24px rgba(0,0,0,0.35)' }} />
          </div>
          <h1 style={{ font:'700 30px/1.1 var(--font-display)', letterSpacing:'-0.015em', color:'var(--fg-0)', margin:'18px 0 0' }}>{PROFILE.name}</h1>
          <div style={{ font:'var(--text-data-sm)', color:'var(--fg-2)', marginTop:8, display:'flex', alignItems:'center', gap:6 }}>
            <Icon name="clock" size={13} color="var(--fg-3)" />{PROFILE.joined}
          </div>
          {PROFILE.quote ? (
            <p style={{ font:'400 italic 15px/1.45 var(--font-display)', color:'var(--fg-1)', fontStyle:'italic',
              margin:'14px 0 0', maxWidth:260, borderLeft:'2px solid var(--coral-dim)', paddingLeft:12 }}>
              “{PROFILE.quote}”
            </p>
          ) : null}
        </div>

        {/* CENTER — watched stat */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', paddingTop:72,
          borderLeft:'1px solid var(--border-subtle)', borderRight:'1px solid var(--border-subtle)' }}>
          <div style={{ font:'700 72px/0.95 var(--font-mono)', color:'var(--fg-0)', letterSpacing:'-0.02em' }}>
            {PROFILE.watched.toLocaleString()}
          </div>
          <div className="overline" style={{ marginTop:12, color:'var(--fg-1)' }}>Titles watched</div>
        </div>

        {/* RIGHT — Following (top) + Created lists (below), stacked vertically */}
        <div style={{ display:'flex', flexDirection:'column', gap:14, paddingTop:36,
          width:'100%', maxWidth:240, marginLeft:'auto', marginRight:'auto' }}>
          <FollowingBox />
          <CreatedListsBox />
        </div>
      </div>
    </div>
  );
}

// ---- MIDDLE: last rated posters ----
function RatedPoster({ film, you }) {
  const [hover, setHover] = React.useState(false);
  const aspect = film.type === 'vertical' ? '9/16' : '2/3';
  return (
    <div style={{ width:164, flex:'none' }} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
      <div style={{ aspectRatio:aspect, borderRadius:'var(--radius-lg)', overflow:'hidden', position:'relative',
        background:`linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 150%)`, boxShadow:'var(--shadow-poster)',
        transition:'transform var(--dur-base) var(--ease-out), filter var(--dur-base) var(--ease-out)',
        transform: hover?'translateY(-3px) scale(1.015)':'none', filter: hover?'brightness(1.08)':'brightness(1)' }}>
        {/* always-visible content ribbon */}
        <div style={{ position:'absolute', top:9, left:9 }}><ContentRibbon film={film} size="sm" /></div>
        {/* always-visible stats overlay */}
        <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'26px 11px 11px',
          background:'linear-gradient(to top, rgba(0,0,0,0.9) 8%, rgba(0,0,0,0) 100%)',
          display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
          <ScoreLine film={film} size={19} countColor="rgba(255,255,255,0.7)" gap={4} />
          <div style={{ display:'flex', alignItems:'center', gap:4, background:'var(--coral)', padding:'5px 8px', borderRadius:'var(--radius-pill)', boxShadow:'var(--shadow-1)' }}>
            <Icon name="star" size={11} fill="#1a0d08" color="#1a0d08" />
            <span style={{ font:'700 12px/1 var(--font-mono)', color:'#1a0d08' }}>{you.toFixed(1)}</span>
          </div>
        </div>
      </div>
      <div style={{ font:'600 13.5px/1.25 var(--font-body)', color:'var(--fg-0)', marginTop:9 }}>{film.title}</div>
      <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:3 }}>
        <span style={{ font:'var(--text-data-sm)', color:'var(--fg-2)' }}>{film.year}</span>
        <span style={{ color:'var(--fg-3)' }}>·</span>
        <span style={{ font:'var(--text-data-sm)', color:'var(--fg-2)' }}>You rated {you.toFixed(1)}</span>
      </div>
    </div>
  );
}

// ---- a single row in the Last Rated vertical list ----
function LastRatedRow({ entry, onOpen }) {
  const [hover, setHover] = React.useState(false);
  const film = entry.film;
  const t = window.AICDB_TYPES[film.type];
  const aspect = film.type === 'vertical' ? '9/16' : '2/3';
  return (
    <div onClick={() => onOpen && onOpen(film)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display:'flex', alignItems:'center', gap:14, padding:'10px 12px', borderRadius:'var(--radius-md)', cursor:'pointer',
        background: hover ? 'var(--bg-2)' : 'transparent', border:'1px solid ' + (hover ? 'var(--border-subtle)' : 'transparent'),
        transition:'background var(--dur-fast), border-color var(--dur-fast)' }}>
      <div style={{ width:42, flex:'none', aspectRatio:aspect, borderRadius:'var(--radius-sm)', overflow:'hidden',
        background:`linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 150%)`, boxShadow:'var(--shadow-1)' }} />
      <div style={{ minWidth:0, flex:1 }}>
        <div style={{ font:'600 15px/1.25 var(--font-body)', color:'var(--fg-0)',
          whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{film.title}</div>
        <div style={{ display:'flex', alignItems:'center', gap:7, marginTop:4, font:'var(--text-data-sm)', color:'var(--fg-2)' }}>
          <span>{film.year}</span><span style={{ color:'var(--fg-3)' }}>·</span>
          <span style={{ color:t.text }}>{t.label}</span>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:5, flex:'none', background:'var(--coral)', padding:'5px 9px',
        borderRadius:'var(--radius-pill)' }}>
        <Icon name="star" size={11} fill="#1a0d08" color="#1a0d08" />
        <span style={{ font:'700 12px/1 var(--font-mono)', color:'#1a0d08' }}>{entry.you.toFixed(1)}</span>
      </div>
    </div>
  );
}

function LastRated({ onOpen, onSeeAll }) {
  const byId = filmsById();
  const rated = LAST_RATED.map(r => ({ ...r, film: byId[r.id] })).filter(r => r.film).slice(0, 5);
  const favFilms = FAVORITES.map(id => byId[id]).filter(Boolean);

  return (
    <section className="aicdb-profile-rated" style={{ marginBottom:64, display:'grid', gridTemplateColumns:'1fr 1.15fr', gap:48 }}>
      {/* LEFT — Last Rated as a vertical list (5) + See all */}
      <div style={{ borderRight:'1px solid var(--border-subtle)', paddingRight:48 }}>
        <h3 style={{ font:'var(--text-h3)', color:'var(--fg-0)', marginBottom:6 }}>Last Rated</h3>
        <p style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', margin:'0 0 16px' }}>The titles you most recently scored</p>
        {rated.length ? (
          <>
            <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
              {rated.map(r => <LastRatedRow key={r.id} entry={r} onOpen={onOpen} />)}
            </div>
            <button onClick={() => onSeeAll && onSeeAll()}
              style={{ display:'inline-flex', alignItems:'center', gap:6, marginTop:14, padding:'8px 14px', cursor:'pointer',
                borderRadius:'var(--radius-pill)', background:'var(--bg-2)', border:'1px solid var(--border-default)',
                color:'var(--fg-1)', font:'600 12.5px/1 var(--font-body)', transition:'all var(--dur-fast)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.color = 'var(--coral)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--fg-1)'; }}>
              See all ratings <Icon name="arrow-right" size={13} color="currentColor" />
            </button>
          </>
        ) : (
          <EmptyState icon="star" accent="var(--coral)" compact
            title="You haven’t rated anything yet"
            sub="Score a few titles and they’ll show up here — your taste, on the record."
            actionLabel="Browse the catalog" onAction={() => onOpen && onOpen(null)} />
        )}
      </div>

      {/* RIGHT — Favorites, the 5-poster layout displayed horizontally */}
      <div>
        <h3 style={{ font:'var(--text-h3)', color:'var(--fg-0)', marginBottom:6 }}>Favorites</h3>
        <p style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', margin:'0 0 16px' }}>The five you’d save from the fire</p>
        {favFilms.length ? (
          <div style={{ display:'flex', gap:16, overflowX:'auto', paddingBottom:8, scrollbarWidth:'thin' }}>
            {favFilms.map(f => (
              <div key={f.id} style={{ width:128, flex:'none' }}>
                <FilmCard film={f} width="auto" onOpen={onOpen || (()=>{})} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon="heart" accent="var(--teal)" compact
            title="No favorites yet"
            sub="Mark the titles you love and the five you’d save from the fire will live here." />
        )}
      </div>
    </section>
  );
}

// ---- full page: every rating, with type + sort filters ----
function AllRatingsPage({ onBack, onOpen }) {
  const all = React.useMemo(() => allRatedEntries(), []);
  const [type, setType] = React.useState('all');
  const [sort, setSort] = React.useState('recent');

  const types = [
    { id:'all', label:'All' },
    { id:'movie', label:'Movies' },
    { id:'series', label:'Series' },
    { id:'short', label:'Shorts' },
    { id:'vertical', label:'Vertical' },
  ];
  const sorts = [
    { id:'recent',  label:'Most recent' },
    { id:'oldest',  label:'Oldest' },
    { id:'highest', label:'Highest rated' },
    { id:'lowest',  label:'Lowest rated' },
    { id:'title',   label:'Title A–Z' },
  ];

  let rows = all.filter(r => type === 'all' || r.film.type === type);
  rows = rows.slice().sort((a, b) => {
    if (sort === 'recent')  return a.date < b.date ? 1 : -1;
    if (sort === 'oldest')  return a.date > b.date ? 1 : -1;
    if (sort === 'highest') return b.you - a.you || (a.date < b.date ? 1 : -1);
    if (sort === 'lowest')  return a.you - b.you || (a.date < b.date ? 1 : -1);
    if (sort === 'title')   return a.film.title.localeCompare(b.film.title);
    return 0;
  });

  return (
    <div style={{ maxWidth:860, margin:'0 auto', padding:'28px 28px 90px' }}>
      {/* back + heading */}
      <button onClick={onBack}
        style={{ display:'inline-flex', alignItems:'center', gap:7, marginBottom:18, padding:'8px 14px', cursor:'pointer',
          borderRadius:'var(--radius-pill)', background:'var(--bg-1)', border:'1px solid var(--border-default)',
          color:'var(--fg-1)', font:'600 13px/1 var(--font-body)', transition:'all var(--dur-fast)' }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--fg-0)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--fg-1)'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}>
        <Icon name="caret-left" size={14} color="currentColor" /> Back to profile
      </button>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ font:'var(--text-h1)', color:'var(--fg-0)', letterSpacing:'-0.015em', marginBottom:8 }}>All ratings</h1>
        <p style={{ font:'var(--text-body)', color:'var(--fg-2)' }}>{rows.length} {rows.length === 1 ? 'title' : 'titles'} you’ve scored</p>
      </div>

      {/* filters */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap', marginBottom:20 }}>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {types.map(o => {
            const on = type === o.id;
            return (
              <button key={o.id} onClick={() => setType(o.id)}
                style={{ padding:'8px 14px', cursor:'pointer', borderRadius:'var(--radius-pill)', font:'600 12.5px/1 var(--font-body)',
                  border:'1px solid ' + (on ? 'transparent' : 'var(--border-default)'),
                  background: on ? 'var(--coral)' : 'var(--bg-1)', color: on ? 'var(--fg-on-accent)' : 'var(--fg-1)',
                  transition:'all var(--dur-fast)' }}>{o.label}</button>
            );
          })}
        </div>
        <label style={{ display:'inline-flex', alignItems:'center', gap:9, font:'var(--text-body-sm)', color:'var(--fg-2)' }}>
          <Icon name="funnel" size={14} color="var(--fg-2)" weight="fill" />
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ font:'600 13px/1 var(--font-body)', color:'var(--fg-0)', background:'var(--bg-1)',
              border:'1px solid var(--border-default)', borderRadius:'var(--radius-md)', padding:'9px 12px', cursor:'pointer', outline:'none' }}>
            {sorts.map(s => <option key={s.id} value={s.id} style={{ background:'var(--bg-1)' }}>{s.label}</option>)}
          </select>
        </label>
      </div>

      {/* rows */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {rows.map(r => {
          const film = r.film; const t = window.AICDB_TYPES[film.type];
          const aspect = film.type === 'vertical' ? '9/16' : '2/3';
          return (
            <div key={r.id} onClick={() => onOpen && onOpen(film)}
              style={{ display:'flex', alignItems:'center', gap:16, padding:'12px 16px', cursor:'pointer',
                background:'var(--bg-1)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)',
                transition:'border-color var(--dur-fast)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}>
              <div style={{ width:46, flex:'none', aspectRatio:aspect, borderRadius:'var(--radius-md)', overflow:'hidden',
                background:`linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 150%)`, boxShadow:'var(--shadow-1)' }} />
              <div style={{ minWidth:0, flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
                  <span style={{ font:'600 16px/1.2 var(--font-display)', color:'var(--fg-0)' }}>{film.title}</span>
                  <span style={{ font:'600 9px/1 var(--font-body)', letterSpacing:'0.05em', textTransform:'uppercase',
                    color:t.text, background:t.ghost, padding:'4px 8px', borderRadius:'var(--radius-pill)' }}>{t.label}</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:5, font:'var(--text-data-sm)', color:'var(--fg-2)' }}>
                  <span>{film.year}</span><span style={{ color:'var(--fg-3)' }}>·</span>
                  <span>Rated {fmtRatedDate(r.date)}</span>
                </div>
              </div>
              <StarRating value={r.you} size={15} />
              <div style={{ flex:'none', display:'flex', alignItems:'center', gap:5, background:'var(--coral)', padding:'5px 9px',
                borderRadius:'var(--radius-pill)' }}>
                <Icon name="star" size={11} fill="#1a0d08" color="#1a0d08" />
                <span style={{ font:'700 12px/1 var(--font-mono)', color:'#1a0d08' }}>{r.you.toFixed(1)}</span>
              </div>
              <div style={{ flex:'none', width:42, textAlign:'right' }}>
                <div style={{ font:'700 18px/1 var(--font-mono)', color:scoreColor(film.score) }}>{film.score.toFixed(1)}</div>
                <div className="overline" style={{ color:'var(--fg-3)', marginTop:4 }}>AI</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- LOWER: badges | favorites ----
function BadgeItem({ b }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:14 }}>
      <div style={{ width:54, height:54, borderRadius:'50%', flex:'none', background:b.ghost,
        border:`1px solid ${b.color}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Icon name={b.icon} size={24} color={b.color} weight="fill" />
      </div>
      <div>
        <div style={{ font:'600 15px/1.2 var(--font-body)', color:'var(--fg-0)' }}>{b.label}</div>
        <div style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', marginTop:3 }}>{b.sub}</div>
      </div>
    </div>
  );
}

function LowerSection() {
  return (
    <section style={{ marginBottom:64 }}>
      <h3 style={{ font:'var(--text-h3)', color:'var(--fg-0)', marginBottom:24, textAlign:'center' }}>Achievements</h3>
      {BADGES.length ? (
        <div style={{ maxWidth:680, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', rowGap:24, columnGap:40 }}>
          {BADGES.map(b => <BadgeItem key={b.label} b={b} />)}
        </div>
      ) : (
        <EmptyState icon="medal" accent="var(--coral)" compact
          title="No achievements yet"
          sub="Rate titles, write reviews, and keep a streak going to start earning badges." />
      )}
    </section>
  );
}

// ---- BOTTOM: statistics ----
function StatCard({ icon, color, value, unit, label }) {
  return (
    <div style={{ padding:'20px 22px', background:'var(--bg-1)', border:'1px solid var(--border-subtle)',
      borderRadius:'var(--radius-lg)', display:'flex', flexDirection:'column', justifyContent:'space-between', minHeight:128 }}>
      <Icon name={icon} size={20} color={color} weight="fill" />
      <div>
        <div style={{ display:'flex', alignItems:'baseline', gap:5 }}>
          <span style={{ font:'700 34px/1 var(--font-mono)', color:'var(--fg-0)', letterSpacing:'-0.02em' }}>{value}</span>
          {unit && <span style={{ font:'500 13px/1 var(--font-mono)', color:'var(--fg-2)' }}>{unit}</span>}
        </div>
        <div className="overline" style={{ marginTop:9, color:'var(--fg-1)' }}>{label}</div>
      </div>
    </div>
  );
}

function BottomSection() {
  return (
    <section style={{ marginBottom:30 }}>
      <SectionHeading align="center" sub="A look at your taste, by the numbers">Statistics</SectionHeading>
      <div className="aicdb-profile-bottom" style={{ display:'grid', gridTemplateColumns:'1.25fr 1fr', gap:20 }}>

        {/* Favorite genre — generated visual */}
        <div style={{ position:'relative', borderRadius:'var(--radius-lg)', overflow:'hidden', minHeight:280,
          background:'linear-gradient(140deg, #241a3a 0%, #18233a 48%, #0f2e2b 105%)', boxShadow:'var(--shadow-2)' }}>
          {/* grid + glow “sci-fi” treatment */}
          <div style={{ position:'absolute', inset:0, opacity:0.55,
            backgroundImage:'linear-gradient(rgba(157,141,241,0.13) 1px, transparent 1px),'
              +'linear-gradient(90deg, rgba(78,205,196,0.10) 1px, transparent 1px)', backgroundSize:'30px 30px' }} />
          <div style={{ position:'absolute', inset:0,
            background:'radial-gradient(75% 60% at 72% 18%, rgba(124,111,224,0.40), transparent 62%),'
              +'radial-gradient(60% 50% at 12% 92%, rgba(78,205,196,0.28), transparent 60%)' }} />
          <div style={{ position:'absolute', left:-40, top:-40, width:200, height:200, borderRadius:'50%',
            border:'1px solid rgba(157,141,241,0.35)' }} />
          <div style={{ position:'absolute', left:-10, top:-10, width:140, height:140, borderRadius:'50%',
            border:'1px solid rgba(78,205,196,0.30)' }} />
          <div style={{ position:'relative', height:'100%', padding:'26px 28px', display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
            <span className="overline" style={{ color:'var(--type-vertical)' }}>Favorite genre</span>
            <div style={{ font:'700 52px/1 var(--font-display)', letterSpacing:'-0.015em', color:'var(--fg-0)', margin:'10px 0 8px' }}>{PROFILE.favGenre}</div>
            <p style={{ font:'var(--text-body)', color:'var(--fg-1)', margin:0, maxWidth:300 }}>{PROFILE.favGenreShare}</p>
          </div>
        </div>

        {/* Stat cards grid */}
        <div className="aicdb-stat-cards" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
          {/* Average rating — full-width feature within grid */}
          <div style={{ gridColumn:'1 / -1', padding:'20px 24px', background:'var(--bg-1)',
            border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)',
            display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div className="overline" style={{ color:'var(--fg-1)', marginBottom:10 }}>Average rating given</div>
              <StarRating value={PROFILE.avgRating} size={22} />
            </div>
            <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
              <span style={{ font:'700 44px/1 var(--font-mono)', color:'var(--coral)', letterSpacing:'-0.02em' }}>{PROFILE.avgRating.toFixed(1)}</span>
              <span style={{ font:'500 15px/1 var(--font-mono)', color:'var(--fg-3)' }}>/5</span>
            </div>
          </div>
          <StatCard icon="clock"         color="var(--teal)"          value={PROFILE.hours.toLocaleString()} unit="hrs" label="Hours watched" />
          <StatCard icon="chat-centered-text" color="var(--type-vertical)" value={PROFILE.reviews}    label="Reviews written" />
        </div>
      </div>

      {/* secondary stat strip */}
      <div className="aicdb-stat-strip" style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:20, marginTop:20 }}>
        <StatCard icon="film-slate" color="var(--coral)"        value={PROFILE.thisYear} label="Titles this year" />
        <StatCard icon="fire"       color="var(--type-short)"   value="0" unit="days" label="Current streak" />
        <StatCard icon="heart"      color="var(--coral)"        value={FAVORITES.length} label="Favorites" />
        <StatCard icon="trophy"     color="var(--teal)"         value="—" label="Reviewer rank" />
      </div>
    </section>
  );
}

// ---- Followed Creators — profile cards for creators the user follows ----
const FOLLOWED_CREATOR_IDS = [];

function FollowedSeal({ size = 14 }) {
  return <Icon name="seal-check" size={size} color="var(--teal-bright)" weight="fill" />;
}

// ============================================================
// Following: compact box (top-right) + management modal
// Privacy is now a single list-wide setting (Public / Private) controlled
// from one button in the modal's top-right corner. When Private, the public
// box shows only a lock + "Followed" — no names or details to others.
// ============================================================

// list-wide privacy state, persisted as a single boolean.
function useFollowVisibility() {
  const KEY = 'aicdb_follow_private';
  const [isPrivate, setIsPrivate] = React.useState(() => {
    try { const s = localStorage.getItem(KEY); if (s != null) return JSON.parse(s); } catch (e) {}
    return false;
  });
  React.useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(isPrivate)); } catch (e) {} }, [isPrivate]);
  return [isPrivate, setIsPrivate];
}

function followedList() {
  const byId = {};
  (window.AICDB_CREATORS || []).forEach(c => { byId[c.id] = c; });
  return FOLLOWED_CREATOR_IDS.map(id => byId[id]).filter(Boolean);
}

// overlapping avatar disc — gradient for public, lock for private
function FollowDisc({ creator, isPrivate, size = 30, idx = 0 }) {
  const common = { width:size, height:size, borderRadius:'50%', flex:'none', position:'relative',
    border:'2px solid var(--bg-1)', marginLeft: idx === 0 ? 0 : -10, boxShadow:'var(--shadow-1)' };
  if (isPrivate) {
    return (
      <div title="Followed — private" style={{ ...common, background:'var(--bg-3)',
        display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Icon name="lock-simple" size={Math.round(size*0.46)} color="var(--fg-2)" weight="fill" />
      </div>
    );
  }
  return <div title={creator.name} style={{ ...common,
    background:`linear-gradient(135deg, ${creator.av[0]}, ${creator.av[1]})` }} />;
}

function FollowingBox() {
  const [open, setOpen] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const [isPrivate, setIsPrivate] = useFollowVisibility();
  const followed = followedList();
  const total = followed.length;
  const allPrivate = isPrivate;
  const shown = followed.slice(0, 5);
  const overflow = total - shown.length;

  return (
    <>
      <div role="button" tabIndex={0} onClick={() => setOpen(true)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(true); } }}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{ position:'relative', padding:'20px 22px', background: hover ? 'var(--bg-2)' : 'var(--bg-1)',
          border:'1px solid', borderColor: hover ? 'var(--border-accent)' : 'var(--border-default)',
          borderRadius:'var(--radius-lg)', cursor:'pointer',
          transform: hover ? 'translateY(-2px)' : 'none',
          transition:'border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), transform var(--dur-base) var(--ease-out)' }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:10 }}>
          <span style={{ font:'700 48px/0.9 var(--font-mono)', color:'var(--coral)' }}>{total}</span>
          <Icon name="users" size={20} color="var(--coral-dim)" weight="fill" />
        </div>

        {/* avatar strip (or lock + "Followed" when the list is private) */}
        {allPrivate ? (
          <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:16 }}>
            <div style={{ width:30, height:30, borderRadius:'50%', flex:'none', background:'var(--bg-3)',
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon name="lock-simple" size={15} color="var(--fg-2)" weight="fill" />
            </div>
            <span style={{ font:'600 13px/1 var(--font-body)', color:'var(--fg-1)' }}>Followed</span>
          </div>
        ) : (
          <div style={{ display:'flex', alignItems:'center', marginTop:16 }}>
            {shown.map((c, i) => <FollowDisc key={c.id} creator={c} isPrivate={false} idx={i} />)}
            {overflow > 0 && (
              <div style={{ width:30, height:30, borderRadius:'50%', flex:'none', marginLeft:-10,
                background:'var(--bg-3)', border:'2px solid var(--bg-1)', display:'flex', alignItems:'center', justifyContent:'center',
                font:'600 11px/1 var(--font-mono)', color:'var(--fg-1)' }}>+{overflow}</div>
            )}
          </div>
        )}

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:14 }}>
          <span className="overline" style={{ color:'var(--fg-1)' }}>Following</span>
          <span style={{ display:'inline-flex', alignItems:'center', gap:4, font:'600 12px/1 var(--font-body)', color:'var(--coral)' }}>
            Manage <Icon name="chevron-right" size={13} color="var(--coral)" />
          </span>
        </div>
      </div>
      {open && <FollowingModal followed={followed} isPrivate={isPrivate} setIsPrivate={setIsPrivate} onClose={() => setOpen(false)} />}
    </>
  );
}

// the "Created lists" box — opens a management modal (view / edit / delete / new)
function CreatedListsBox() {
  const [hover, setHover] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [lists, setLists] = React.useState(CREATED_LISTS);

  const onDelete = (id) => setLists(ls => ls.filter(l => l.id !== id));
  const onRename = (id, title) => setLists(ls => ls.map(l => l.id === id ? { ...l, title } : l));
  const onNew = (title) => setLists(ls => [{ id:'l' + Date.now(), title, count:0, note:'A fresh, empty list' }, ...ls]);

  return (
    <>
      <div role="button" tabIndex={0} onClick={() => setOpen(true)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(true); } }}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{ position:'relative', padding:'20px 22px', background: hover ? 'var(--bg-2)' : 'var(--bg-1)',
          border:'1px solid', borderColor: hover ? 'var(--border-accent)' : 'var(--border-default)',
          borderRadius:'var(--radius-lg)', cursor:'pointer', transform: hover ? 'translateY(-2px)' : 'none',
          transition:'border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), transform var(--dur-base) var(--ease-out)' }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:10 }}>
          <span style={{ font:'700 48px/0.9 var(--font-mono)', color:'var(--teal)' }}>{lists.length}</span>
          <Icon name="list" size={20} color="var(--teal-dim)" />
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:14 }}>
          <span className="overline" style={{ color:'var(--fg-1)' }}>Created lists</span>
          <span style={{ display:'inline-flex', alignItems:'center', gap:4, font:'600 12px/1 var(--font-body)', color:'var(--teal)' }}>
            View <Icon name="chevron-right" size={13} color="var(--teal)" />
          </span>
        </div>
      </div>
      {open && <CreatedListsModal lists={lists} onClose={() => setOpen(false)}
        onDelete={onDelete} onRename={onRename} onNew={onNew} />}
    </>
  );
}

// a single editable row inside the Created-lists modal
function CreatedListRow({ list, onDelete, onRename }) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(list.title);
  const inputRef = React.useRef(null);
  React.useEffect(() => { if (editing && inputRef.current) inputRef.current.select(); }, [editing]);

  const commit = () => { const t = draft.trim(); if (t) onRename(list.id, t); else setDraft(list.title); setEditing(false); };

  return (
    <div style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 14px', borderRadius:'var(--radius-md)',
      background:'var(--bg-0)', border:'1px solid var(--border-subtle)' }}>
      <div style={{ width:42, height:42, flex:'none', borderRadius:'var(--radius-md)', background:'var(--teal-ghost)',
        display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Icon name="list" size={19} color="var(--teal-bright)" />
      </div>
      <div style={{ minWidth:0, flex:1 }}>
        {editing ? (
          <input ref={inputRef} value={draft} autoFocus
            onChange={e => setDraft(e.target.value)} onBlur={commit}
            onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(list.title); setEditing(false); } }}
            style={{ width:'100%', font:'600 15px/1.2 var(--font-body)', color:'var(--fg-0)', background:'var(--bg-3)',
              border:'1px solid var(--border-accent)', borderRadius:'var(--radius-sm)', padding:'6px 9px', outline:'none' }} />
        ) : (
          <div style={{ font:'600 15px/1.2 var(--font-body)', color:'var(--fg-0)',
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{list.title}</div>
        )}
        <div style={{ display:'flex', alignItems:'center', gap:7, marginTop:5, font:'var(--text-data-sm)', color:'var(--fg-2)' }}>
          <span>{list.count} {list.count === 1 ? 'title' : 'titles'}</span>
          {list.note && (<><span style={{ color:'var(--fg-3)' }}>·</span>
            <span style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{list.note}</span></>)}
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:7, flex:'none' }}>
        <button onClick={() => editing ? commit() : setEditing(true)}
          style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 12px', borderRadius:'var(--radius-md)', cursor:'pointer',
            background:'var(--bg-2)', border:'1px solid var(--border-subtle)', color:'var(--fg-1)', font:'600 12.5px/1 var(--font-body)',
            transition:'all var(--dur-fast)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal-bright)'; e.currentTarget.style.color = 'var(--teal-bright)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--fg-1)'; }}>
          <Icon name="pencil-simple" size={14} color="currentColor" /> {editing ? 'Save' : 'Edit'}
        </button>
        <button onClick={() => onDelete(list.id)}
          style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 12px', borderRadius:'var(--radius-md)', cursor:'pointer',
            background:'var(--bg-2)', border:'1px solid var(--border-subtle)', color:'var(--fg-1)', font:'600 12.5px/1 var(--font-body)',
            transition:'all var(--dur-fast)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--score-low)'; e.currentTarget.style.color = 'var(--score-low)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--fg-1)'; }}>
          <Icon name="trash" size={14} color="currentColor" /> Delete
        </button>
      </div>
    </div>
  );
}

function CreatedListsModal({ lists, onClose, onDelete, onRename, onNew }) {
  const [creating, setCreating] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const newRef = React.useRef(null);
  React.useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  React.useEffect(() => { if (creating && newRef.current) newRef.current.focus(); }, [creating]);

  const commitNew = () => { const t = draft.trim(); if (t) { onNew(t); setDraft(''); setCreating(false); } };

  return (
    <div onClick={onClose}
      style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24,
        background:'rgba(5,5,5,0.74)', backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)' }}>
      <style>{`@keyframes aicdbModalIn{from{transform:translateY(14px) scale(0.985)}to{transform:none}}`}</style>
      <div onClick={e => e.stopPropagation()}
        style={{ position:'relative', width:'100%', maxWidth:560, maxHeight:'84vh', display:'flex', flexDirection:'column',
          background:'var(--bg-1)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-xl)',
          boxShadow:'var(--shadow-3)', overflow:'hidden', animation:'aicdbModalIn 0.34s var(--ease-out) both' }}>

        {/* header — title + New list (top-right) + close */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, padding:'24px 26px 18px',
          borderBottom:'1px solid var(--border-subtle)' }}>
          <div>
            <h2 style={{ font:'600 22px/1.2 var(--font-display)', color:'var(--fg-0)', margin:0 }}>Created lists</h2>
            <p style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', margin:'7px 0 0' }}>
              {lists.length} {lists.length === 1 ? 'list' : 'lists'} · curate your own corners of the catalog
            </p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10, flex:'none' }}>
            <button onClick={() => setCreating(c => !c)}
              style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'9px 14px', borderRadius:'var(--radius-md)', cursor:'pointer',
                background:'var(--coral)', border:'1px solid transparent', color:'var(--fg-on-accent)', font:'600 13px/1 var(--font-body)',
                transition:'all var(--dur-fast)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--coral-bright)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--coral)'; }}>
              <Icon name="plus" size={14} color="currentColor" weight="bold" /> New list
            </button>
            <button onClick={onClose} style={{ display:'flex', padding:8, borderRadius:'50%', flex:'none', cursor:'pointer',
              background:'var(--bg-2)', border:'1px solid var(--border-default)' }}>
              <Icon name="x" size={15} color="var(--fg-1)" />
            </button>
          </div>
        </div>

        {/* new-list composer (revealed by the button) */}
        {creating && (
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 26px', borderBottom:'1px solid var(--border-subtle)',
            background:'var(--bg-0)' }}>
            <input ref={newRef} value={draft} placeholder="Name your new list…"
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') commitNew(); if (e.key === 'Escape') { setDraft(''); setCreating(false); } }}
              style={{ flex:1, font:'var(--text-body)', color:'var(--fg-0)', background:'var(--bg-3)',
                border:'1px solid var(--border-default)', borderRadius:'var(--radius-md)', padding:'10px 12px', outline:'none' }} />
            <button onClick={commitNew}
              style={{ padding:'10px 16px', borderRadius:'var(--radius-md)', cursor:'pointer', background:'var(--coral)',
                border:'1px solid transparent', color:'var(--fg-on-accent)', font:'600 13px/1 var(--font-body)' }}>Create</button>
          </div>
        )}

        {/* list rows */}
        <div style={{ overflowY:'auto', padding:'14px 18px 18px', display:'flex', flexDirection:'column', gap:10 }}>
          {lists.length ? lists.map(l => (
            <CreatedListRow key={l.id} list={l} onDelete={onDelete} onRename={onRename} />
          )) : (
            <div style={{ padding:'48px 0', textAlign:'center', font:'var(--text-body)', color:'var(--fg-2)' }}>
              No lists yet — hit <b style={{ color:'var(--fg-1)' }}>New list</b> to start one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// single small list-wide privacy button (lives in the modal's top-right corner)
function ListPrivacyButton({ isPrivate, onToggle }) {
  const [hover, setHover] = React.useState(false);
  const accent = isPrivate ? 'var(--fg-1)' : 'var(--teal-bright)';
  return (
    <button onClick={onToggle} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      title={isPrivate ? 'Following list is private — tap to make public' : 'Following list is public — tap to make private'}
      style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'8px 13px', flex:'none', cursor:'pointer',
        borderRadius:'var(--radius-pill)', border:'1px solid', borderColor: hover ? 'var(--border-strong)' : 'var(--border-default)',
        background: hover ? 'var(--bg-2)' : 'var(--bg-0)', font:'600 12px/1 var(--font-body)', color: accent,
        transition:'all var(--dur-fast)' }}>
      <Icon name={isPrivate ? 'lock-simple' : 'eye'} size={13} color={accent} weight={isPrivate ? 'fill' : 'regular'} />
      {isPrivate ? 'Private' : 'Public'}
    </button>
  );
}

function FollowingModal({ followed, isPrivate, setIsPrivate, onClose }) {
  React.useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div onClick={onClose}
      style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24,
        background:'rgba(5,5,5,0.74)', backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)' }}>
      <style>{`@keyframes aicdbModalIn{from{transform:translateY(14px) scale(0.985)}to{transform:none}}`}</style>
      <div onClick={e => e.stopPropagation()}
        style={{ position:'relative', width:'100%', maxWidth:480, maxHeight:'82vh', display:'flex', flexDirection:'column',
          background:'var(--bg-1)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-xl)',
          boxShadow:'var(--shadow-3)', overflow:'hidden', animation:'aicdbModalIn 0.34s var(--ease-out) both' }}>

        {/* header — title (left) · privacy button + close (top-right) */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, padding:'24px 26px 18px',
          borderBottom:'1px solid var(--border-subtle)' }}>
          <div>
            <h2 style={{ font:'600 22px/1.2 var(--font-display)', color:'var(--fg-0)', margin:0 }}>Following</h2>
            <p style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', margin:'7px 0 0' }}>
              {followed.length} creators · list is {isPrivate ? 'hidden from others' : 'visible to others'}
            </p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10, flex:'none' }}>
            <ListPrivacyButton isPrivate={isPrivate} onToggle={() => setIsPrivate(p => !p)} />
            <button onClick={onClose} style={{ display:'flex', padding:8, borderRadius:'50%', flex:'none', cursor:'pointer',
              background:'var(--bg-2)', border:'1px solid var(--border-default)' }}>
              <Icon name="x" size={15} color="var(--fg-1)" />
            </button>
          </div>
        </div>

        {/* list */}
        <div style={{ overflowY:'auto', padding:'8px 14px 14px' }}>
          {followed.map(c => (
            <div key={c.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 12px' }}>
              <div style={{ position:'relative', flex:'none' }}>
                <div style={{ width:46, height:46, borderRadius:'50%',
                  background:`linear-gradient(135deg, ${c.av[0]}, ${c.av[1]})`,
                  filter: isPrivate ? 'grayscale(0.5) brightness(0.7)' : 'none',
                  boxShadow:'var(--shadow-1)' }} />
                {isPrivate && (
                  <div style={{ position:'absolute', right:-3, bottom:-3, width:20, height:20, borderRadius:'50%',
                    background:'var(--bg-2)', border:'1px solid var(--border-default)',
                    display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon name="lock-simple" size={11} color="var(--fg-1)" weight="fill" />
                  </div>
                )}
              </div>
              <div style={{ minWidth:0, flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ font:'600 15px/1.2 var(--font-body)', color:'var(--fg-0)',
                    whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.name}</span>
                  {c.verified && <FollowedSeal size={13} />}
                </div>
                <div style={{ font:'var(--text-data-sm)', color:'var(--fg-2)', marginTop:3 }}>{c.handle}</div>
              </div>
              <FollowingButton />
            </div>
          ))}
        </div>

        {/* footer note */}
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 26px', borderTop:'1px solid var(--border-subtle)',
          background:'var(--bg-0)' }}>
          <Icon name={isPrivate ? 'lock-simple' : 'eye'} size={15} color="var(--fg-2)" weight={isPrivate ? 'fill' : 'regular'} />
          <span style={{ font:'var(--text-body-sm)', color:'var(--fg-2)' }}>
            {isPrivate
              ? 'Your whole Following list is private — others see only a lock, no names or details.'
              : 'Your Following list is public — anyone can see who you follow.'}
          </span>
        </div>
      </div>
    </div>
  );
}

function FollowingButton() {
  const [following, setFollowing] = React.useState(true);
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={() => setFollowing(f => !f)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', gap:7, padding:'9px 0', width:'100%',
        borderRadius:'var(--radius-md)', cursor:'pointer', font:'600 13px/1 var(--font-body)', transition:'all var(--dur-fast)',
        borderWidth:1, borderStyle:'solid',
        background: following ? 'transparent' : (hover ? 'var(--coral-bright)' : 'var(--coral)'),
        borderColor: following ? 'var(--border-strong)' : 'transparent',
        color: following ? (hover ? 'var(--score-low)' : 'var(--fg-1)') : 'var(--fg-on-accent)' }}>
      <Icon name={following ? (hover ? 'x' : 'check') : 'plus'} size={14} color="currentColor" weight="bold" />
      {following ? (hover ? 'Unfollow' : 'Following') : 'Follow'}
    </button>
  );
}

function FollowedCreatorCard({ creator }) {
  const [hover, setHover] = React.useState(false);
  const st = window.AICDB_CREATOR_STATS ? window.AICDB_CREATOR_STATS(creator) : { works: 0, avg: 0 };
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ background:'var(--bg-1)', borderRadius:'var(--radius-lg)', padding:'20px 20px 18px',
        borderWidth:1, borderStyle:'solid', borderColor: hover ? 'var(--border-default)' : 'var(--border-subtle)',
        transition:'border-color var(--dur-fast), transform var(--dur-base)', transform: hover ? 'translateY(-3px)' : 'none' }}>
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
        <a href={'creator.html?name=' + encodeURIComponent(creator.name)} style={{ flex:'none' }}>
          <div style={{ width:54, height:54, borderRadius:'50%',
            background:`linear-gradient(135deg, ${creator.av[0]}, ${creator.av[1]})`, boxShadow:'var(--shadow-1)' }} />
        </a>
        <div style={{ minWidth:0, flex:1 }}>
          <a href={'creator.html?name=' + encodeURIComponent(creator.name)}
            style={{ display:'flex', alignItems:'center', gap:6, textDecoration:'none' }}>
            <span style={{ font:'600 16px/1.2 var(--font-display)', color:'var(--fg-0)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{creator.name}</span>
            {creator.verified && <FollowedSeal size={14} />}
          </a>
          <div style={{ font:'var(--text-data-sm)', color:'var(--fg-2)', marginTop:3 }}>{creator.handle}</div>
        </div>
      </div>
      <div style={{ display:'flex', gap:4, marginBottom:16, padding:'12px 0', borderTop:'1px solid var(--border-subtle)', borderBottom:'1px solid var(--border-subtle)' }}>
        {[
          [fmtCount(creator.followers), 'Followers', 'var(--fg-0)'],
          [st.works, 'Works', 'var(--fg-0)'],
          [st.avg ? st.avg.toFixed(1) : '—', 'Avg score', scoreColor(st.avg)],
        ].map(([v, l, col], i) => (
          <React.Fragment key={l}>
            {i > 0 && <div style={{ width:1, background:'var(--border-subtle)' }} />}
            <div style={{ flex:1, textAlign:'center' }}>
              <div style={{ font:'700 16px/1 var(--font-mono)', color:col }}>{v}</div>
              <div className="overline" style={{ color:'var(--fg-2)', marginTop:6 }}>{l}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <FollowingButton />
    </div>
  );
}

function FollowedCreators() {
  const byId = {};
  (window.AICDB_CREATORS || []).forEach(c => { byId[c.id] = c; });
  const followed = FOLLOWED_CREATOR_IDS.map(id => byId[id]).filter(Boolean);
  if (!followed.length) return null;
  return (
    <section style={{ marginBottom:64 }}>
      <SectionHeading align="center" sub={`${followed.length} creators you follow`}>Followed Creators</SectionHeading>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(248px, 1fr))', gap:18 }}>
        {followed.map(c => <FollowedCreatorCard key={c.id} creator={c} />)}
      </div>
    </section>
  );
}

// ---- linked creator accounts shown on the main profile (toggle-controlled) ----
function LinkedCreatorAccounts() {
  const accounts = useCreatorAccounts().filter(a => a.showOnProfile);
  if (!accounts.length) return null;
  return (
    <section style={{ marginBottom:56 }}>
      <SectionHeading align="center" sub="Creator accounts connected to this profile">Also creating as</SectionHeading>
      <div style={{ display:'flex', gap:16, flexWrap:'wrap', justifyContent:'center' }}>
        {accounts.map(a => (
          <a key={a.id} href={'creator.html?account=' + encodeURIComponent(a.id)}
            style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 20px 14px 14px', textDecoration:'none',
              background:'var(--bg-1)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-pill)',
              transition:'border-color var(--dur-fast), background var(--dur-fast)' }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--border-accent)'; e.currentTarget.style.background='var(--bg-2)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border-default)'; e.currentTarget.style.background='var(--bg-1)'; }}>
            <div style={{ width:46, height:46, borderRadius:'50%', flex:'none',
              background: a.avatar ? `linear-gradient(135deg, ${a.avatar[0]}, ${a.avatar[1]})` : 'var(--bg-3)',
              display:'flex', alignItems:'center', justifyContent:'center', font:'600 18px/1 var(--font-display)', color:'rgba(255,255,255,0.92)' }}>
              {(a.name || 'C').charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                <span style={{ font:'600 15px/1.2 var(--font-body)', color:'var(--fg-0)' }}>{a.name}</span>
                <span style={{ font:'600 9px/1 var(--font-body)', letterSpacing:'0.05em', textTransform:'uppercase', color:'var(--coral-bright)',
                  background:'var(--coral-ghost)', padding:'3px 7px', borderRadius:'var(--radius-pill)' }}>Creator</span>
              </div>
              <div style={{ font:'var(--text-data-sm)', color:'var(--fg-2)', marginTop:4 }}>{a.handle || ''}</div>
            </div>
            <Icon name="arrow-right" size={15} color="var(--fg-3)" />
          </a>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// Reviews — the user's submitted written reviews (bottom of profile)
// ============================================================
const PROFILE_REVIEWS = [
  { id:'echoes-of-tomorrow', you:5,   date:'2026-05-31', likes:142,
    body:"Still the bar. The third act rewires how you think about memory on a second watch — I keep finding new seams in the edit." },
  { id:'glass-orchard', you:4, date:'2026-05-22', likes:64,
    body:"Quiet, patient, and gorgeously lit. Not for everyone, but if you let it breathe it gets under your skin. The glass-fruit reveal is one for the year-end lists." },
  { id:'the-long-render', you:3.5, date:'2026-05-14', likes:38,
    body:"Technically dazzling and emotionally cold — on purpose, I think. I wanted a little more heart underneath the obsession, but the final frame nearly earns the whole decade." },
  { id:'paper-suns', you:4.5, date:'2026-04-30', likes:91,
    body:"Eleven wordless minutes that say more than most features. The folded-paper dawn sequence is the most beautiful thing I've seen out of a frame-interpolation pipeline." },
];

function ProfileReviewRow({ r, onOpen }) {
  const film = r.film;
  const t = window.AICDB_TYPES[film.type];
  return (
    <div style={{ display:'flex', gap:16, padding:'18px 20px', background:'var(--bg-1)', border:'1px solid var(--border-subtle)',
      borderRadius:'var(--radius-lg)' }}>
      <div onClick={() => onOpen && onOpen(film)} style={{ width:58, flex:'none', aspectRatio:'2/3', borderRadius:'var(--radius-md)', overflow:'hidden',
        cursor:'pointer', background:`linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 150%)`, boxShadow:'var(--shadow-1)' }} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8, flexWrap:'wrap' }}>
          <span onClick={() => onOpen && onOpen(film)} style={{ font:'600 17px/1.2 var(--font-display)', color:'var(--fg-0)', cursor:'pointer' }}>{film.title}</span>
          <span style={{ font:'600 9px/1 var(--font-body)', letterSpacing:'0.05em', textTransform:'uppercase',
            color:t.text, background:t.ghost, padding:'4px 8px', borderRadius:'var(--radius-pill)' }}>{t.label}</span>
          <StarRating value={r.you} size={14} />
          <span style={{ font:'var(--text-data-sm)', color:'var(--fg-3)' }}>· {fmtRatedDate(r.date)}</span>
        </div>
        <p style={{ font:'var(--text-body)', color:'var(--fg-1)', margin:'0 0 12px' }}>{r.body}</p>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:6, font:'var(--text-data-sm)', color:'var(--fg-2)', marginRight:6 }}>
            <Icon name="heart" size={14} color="var(--fg-3)" /> {r.likes}
          </span>
          <Button variant="ghost" size="sm" icon="pencil-simple">Edit</Button>
          <Button variant="ghost" size="sm" icon="trash">Delete</Button>
        </div>
      </div>
    </div>
  );
}

function ProfileReviews({ onOpen }) {
  const byId = filmsById();
  const rows = PROFILE_REVIEWS.map(r => ({ ...r, film: byId[r.id] })).filter(r => r.film);
  if (!rows.length) return null;
  return (
    <section style={{ marginBottom:20 }}>
      <SectionHeading align="center" sub={`${PROFILE.reviews} reviews written · your most recent takes`}>Reviews</SectionHeading>
      <div style={{ maxWidth:820, margin:'0 auto', display:'flex', flexDirection:'column', gap:12 }}>
        {rows.map(r => <ProfileReviewRow key={r.id} r={r} onOpen={onOpen} />)}
      </div>
    </section>
  );
}

// ---- Page ----
function Profile({ embedded = false, onOpen }) {
  const [showAllRatings, setShowAllRatings] = React.useState(false);

  if (showAllRatings) {
    return (
      <div style={{ minHeight: embedded ? 'auto' : '100vh' }}>
        {!embedded && <NavBar active="" />}
        <AllRatingsPage onBack={() => { setShowAllRatings(false); window.scrollTo(0,0); }} onOpen={onOpen} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: embedded ? 'auto' : '100vh' }}>
      {!embedded && <NavBar active="" />}
      <div className="aicdb-page" style={{ maxWidth:1100, margin:'0 auto', padding:'28px 28px 90px' }}>
        <TopSection />
        <LinkedCreatorAccounts />
        <LastRated onOpen={onOpen} onSeeAll={() => { setShowAllRatings(true); window.scrollTo(0,0); }} />
        <LowerSection />
        <BottomSection />
        <ProfileReviews onOpen={onOpen} />
      </div>
    </div>
  );
}

Object.assign(window, { Profile });
