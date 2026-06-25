// Dreamwall UI kit — app shell + simple client routing
function BrowseGrid({ title, films, onOpen, sub }) {
  return (
    <div className="aicdb-page" style={{ maxWidth:1180, margin:'0 auto', padding:'32px 28px 80px' }}>
      <div style={{ textAlign:'center', marginBottom:28 }}>
        <h1 style={{ font:'var(--text-h1)', color:'var(--fg-0)', letterSpacing:'-0.015em', marginBottom:8 }}>{title}</h1>
        <p style={{ font:'var(--text-body)', color:'var(--fg-2)' }}>{sub || `${films.length} ${films.length===1?'title':'titles'}`}</p>
      </div>
      {films.length ? (
        <div className="aicdb-film-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))', gap:22 }}>
          {films.map(f => <FilmCard key={f.id} film={f} onOpen={onOpen} width="auto" />)}
        </div>
      ) : (
        <div style={{ padding:'60px 0', textAlign:'center', font:'var(--text-body)', color:'var(--fg-2)' }}>
          {title.toLowerCase().includes('watchlist')
            ? 'Your watchlist is empty — hover any poster and tap + to add titles.'
            : 'No titles match — try another search.'}
        </div>
      )}
    </div>
  );
}

// ---- a single watchlist row: rating (left) + poster + meta, with persistent action buttons on the right ----
function WatchlistRow({ film, onOpen, onWatch, onRate }) {
  const [hover, setHover] = React.useState(false);
  const t = window.AICDB_TYPES[film.type];
  const aspect = film.type === 'vertical' ? '9/16' : '2/3';
  const actions = [
    { icon:'star',  label:'Rate',   color:'var(--coral-bright)', onClick:() => onRate && onRate(film) },
    { icon:'play',  label:'Watch',  color:'var(--teal-bright)',  onClick:() => onWatch && onWatch(film) },
    { icon:'trash', label:'Remove', color:'var(--score-low)',    onClick:() => window.AICDB_WATCHLIST.toggle(film.id) },
  ];
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 16px', background:'var(--bg-1)',
        border:'1px solid ' + (hover ? 'var(--border-default)' : 'var(--border-subtle)'), borderRadius:'var(--radius-lg)',
        transition:'border-color var(--dur-fast)' }}>
      {/* rating — the title's AI score, always shown on the left */}
      <div style={{ flex:'none', width:58, textAlign:'center' }}>
        <div style={{ display:'inline-flex', alignItems:'baseline', gap:2 }}>
          <span style={{ font:'700 24px/1 var(--font-mono)', color:scoreColor(film.score) }}>{film.score.toFixed(1)}</span>
        </div>
        <div className="overline" style={{ color:'var(--fg-3)', marginTop:6 }}>Score</div>
      </div>
      {/* divider */}
      <div style={{ flex:'none', alignSelf:'stretch', width:1, background:'var(--border-subtle)' }} />
      {/* poster */}
      <div onClick={() => onOpen(film)} style={{ width:54, flex:'none', aspectRatio:aspect, borderRadius:'var(--radius-md)', overflow:'hidden',
        cursor:'pointer', background:`linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 150%)`, boxShadow:'var(--shadow-1)' }} />
      {/* info */}
      <div onClick={() => onOpen(film)} style={{ flex:1, minWidth:0, cursor:'pointer' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
          <span style={{ font:'600 17px/1.2 var(--font-display)', color:'var(--fg-0)' }}>{film.title}</span>
          <span style={{ font:'600 9px/1 var(--font-body)', letterSpacing:'0.05em', textTransform:'uppercase',
            color:t.text, background:t.ghost, padding:'4px 8px', borderRadius:'var(--radius-pill)' }}>{t.label}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:9, marginTop:6, font:'var(--text-data-sm)', color:'var(--fg-2)' }}>
          <span>{film.year}</span><span style={{ color:'var(--fg-3)' }}>·</span>
          <span>{film.runtime}</span><span style={{ color:'var(--fg-3)' }}>·</span>
          <span>{film.creator}</span>
        </div>
      </div>
      {/* persistent action buttons — always visible on the right */}
      <div style={{ flex:'none', display:'flex', alignItems:'center', gap:7 }}>
        {actions.map(a => (
          <button key={a.label} onClick={(e) => { e.stopPropagation(); a.onClick(); }}
            style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'9px 13px', borderRadius:'var(--radius-md)',
              border:'1px solid var(--border-subtle)', cursor:'pointer', background:'var(--bg-2)', color:'var(--fg-1)',
              font:'600 12.5px/1 var(--font-body)', whiteSpace:'nowrap', transition:'all var(--dur-fast)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.color = a.color; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--fg-1)'; }}>
            <Icon name={a.icon} size={14} color="currentColor" fill={a.icon === 'play' ? 'currentColor' : 'none'} />
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function WatchlistView({ films, onOpen, onNav, onWatch }) {
  const [rateFilm, setRateFilm] = React.useState(null);
  return (
    <div style={{ maxWidth:860, margin:'0 auto', padding:'32px 28px 40px' }}>
      <div style={{ textAlign:'center', marginBottom:28 }}>
        <h1 style={{ font:'var(--text-h1)', color:'var(--fg-0)', letterSpacing:'-0.015em', marginBottom:8 }}>Your Watchlist</h1>
        <p style={{ font:'var(--text-body)', color:'var(--fg-2)' }}>{films.length} {films.length===1?'title':'titles'} saved to watch</p>
      </div>
      {films.length ? (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {films.map(f => <WatchlistRow key={f.id} film={f} onOpen={onOpen} onWatch={onWatch} onRate={setRateFilm} />)}
        </div>
      ) : (
        <EmptyState icon="bookmark-simple" accent="var(--teal)"
          title="Nothing here yet"
          sub="Start exploring and tap the bookmark on any poster to save it for later."
          actionLabel="Browse the catalog" onAction={() => onNav && onNav('Films')} />
      )}
      {rateFilm && (
        <RatingPanel film={rateFilm} onClose={() => setRateFilm(null)} onSubmit={() => setRateFilm(null)} />
      )}
    </div>
  );
}

// the signed-in user's own reviews (text only — score shown separately if they rated it)
const MY_REVIEWS = [];

function MyReviewRow({ r, onOpen }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div style={{ display:'flex', gap:16, padding:'18px', background:'var(--bg-1)', border:'1px solid var(--border-subtle)',
      borderRadius:'var(--radius-lg)' }}>
      <div onClick={() => onOpen(r.film)} style={{ width:54, flex:'none', aspectRatio:'2/3', borderRadius:'var(--radius-md)', overflow:'hidden',
        cursor:'pointer', background:`linear-gradient(150deg, ${r.film.g[0]}, ${r.film.g[1]} 150%)`, boxShadow:'var(--shadow-1)' }} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:7, flexWrap:'wrap' }}>
          <span onClick={() => onOpen(r.film)} style={{ font:'600 16px/1.2 var(--font-display)', color:'var(--fg-0)', cursor:'pointer' }}>{r.film.title}</span>
          <span style={{ font:'var(--text-data-sm)', color:'var(--fg-2)' }}>{r.film.year}</span>
          {r.score != null && (
            <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 9px', borderRadius:'var(--radius-pill)',
              background:'var(--coral-ghost)', border:'1px solid var(--border-accent)' }}>
              <Icon name="star" size={11} color="var(--coral-bright)" weight="fill" />
              <span style={{ font:'700 11px/1 var(--font-mono)', color:'var(--coral-bright)' }}>{r.score.toFixed(1)}</span>
              <span style={{ font:'500 9px/1 var(--font-mono)', color:'var(--fg-3)', letterSpacing:'0.04em' }}>YOUR SCORE</span>
            </span>
          )}
          <span style={{ font:'var(--text-data-sm)', color:'var(--fg-3)' }}>· {r.when}</span>
        </div>
        <p style={{ font:'var(--text-body)', color:'var(--fg-1)', margin:'0 0 12px' }}>{r.body}</p>
        <div style={{ display:'flex', gap:8 }}>
          <Button variant="ghost" size="sm" icon="pencil-simple">Edit</Button>
          <Button variant="ghost" size="sm" icon="trash">Delete</Button>
        </div>
      </div>
    </div>
  );
}

function MyReviewsView({ onOpen, onNav }) {
  const byId = window.AICDB_FILM_BY_ID;
  const rows = MY_REVIEWS.map(r => ({ ...r, film: byId[r.id] })).filter(r => r.film);
  return (
    <div style={{ maxWidth:820, margin:'0 auto', padding:'32px 28px 40px' }}>
      <div style={{ marginBottom:26 }}>
        <h1 style={{ font:'var(--text-h1)', color:'var(--fg-0)', letterSpacing:'-0.015em', marginBottom:8 }}>My Reviews</h1>
        <p style={{ font:'var(--text-body)', color:'var(--fg-2)' }}>{rows.length} {rows.length===1?'review':'reviews'} written · ratings are tracked separately</p>
      </div>
      {rows.length ? (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {rows.map(r => <MyReviewRow key={r.id} r={r} onOpen={onOpen} />)}
        </div>
      ) : (
        <EmptyState icon="chat-text" accent="var(--coral)"
          title="You haven’t written any reviews"
          sub="Share your take on a title and it’ll show up here."
          actionLabel="Browse the catalog" onAction={() => onNav && onNav('Films')} />
      )}
    </div>
  );
}

function App() {
  const [nav, setNav] = React.useState(() => {
    const h = decodeURIComponent((window.location.hash || '').replace(/^#/, '')).trim();
    const allowed = ['Discover','Feed','Films','Series','Creators','What is Dreamwall','Profile','Watchlist','My Reviews','Preferences'];
    // Landing always opens on Discover; deep links to other in-app views still resolve.
    return allowed.includes(h) ? h : 'Discover';
  });
  const [detail, setDetail] = React.useState(null);
  const [watching, setWatching] = React.useState(null);
  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => { const t = setTimeout(() => setLoading(false), 900); return () => clearTimeout(t); }, []);
  const loggedIn = useAuth();
  const films = window.AICDB_FILMS;
  const watchlist = useWatchlist();

  // login-only in-app views — signed-out visitors get bounced to the login page
  const GATED = ['Profile', 'Watchlist', 'Feed', 'My Reviews', 'Preferences'];
  const blocked = !loggedIn && GATED.includes(nav);
  React.useEffect(() => {
    if (!loading && blocked) {
      try { window.location.replace(window.AICDB_PAGE('login')); } catch (e) { window.location.href = window.AICDB_PAGE('login'); }
    }
  }, [loading, blocked]);

  const open = (f) => { if (!f) { goNav('Films'); return; } setDetail(f); setWatching(null); window.scrollTo(0,0); };
  const goNav = (n) => { setNav(n); setDetail(null); setWatching(null); setQuery(''); window.scrollTo(0,0); try { history.replaceState(null, '', '#' + encodeURIComponent(n)); } catch(e){} };
  const openResult = (f) => { setQuery(''); open(f); };
  const goCreator = (creator) => { window.location.href = 'creator.html?name=' + encodeURIComponent(creator); };

  let view, showFooter = true;
  if (loading) {
    return <LoadingScreen />;
  } else if (blocked) {
    // redirecting to login — keep the dark logo splash up so gated content never flashes
    return <LoadingScreen />;
  } else if (watching) {
    return <Watching film={watching} onBack={()=>{ setWatching(null); window.scrollTo(0,0); }} />;
  } else if (detail) {
    view = <FilmDetail film={detail} onBack={()=>setDetail(null)} onWatch={(f)=>{ setWatching(f); window.scrollTo(0,0); }} onCreator={goCreator} onOpen={open} />;
  } else if (nav === 'Profile') {
    view = <Profile embedded onOpen={open} />;
  } else if (nav === 'Watchlist') {
    const wl = watchlist.map(id => films.find(f => f.id === id)).filter(Boolean);
    view = <WatchlistView films={wl} onOpen={open} onNav={goNav} onWatch={(f)=>{ setWatching(f); window.scrollTo(0,0); }} />;
  } else if (nav === 'My Reviews') {
    view = <MyReviewsView onOpen={open} onNav={goNav} />;
  } else if (nav === 'Preferences') {
    view = <Preferences />;
  } else if (nav === 'Discover') {
    view = <Discover onOpen={open} />;
  } else if (nav === 'Films') {
    view = <FilmsPage onOpen={open} />;
  } else if (nav === 'Series') {
    view = <SeriesPage onOpen={open} />;
  } else if (nav === 'Creators') {
    view = <CreatorsPage onCreator={goCreator} onOpen={open} />;
  } else if (nav === 'What is Dreamwall') {
    view = <WhatIs onNav={goNav} />;
  } else {
    view = <Feed onOpen={open} onCreator={goCreator} onNav={goNav} />;
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <NavBar active={detail?'':nav} onNav={goNav} query={query} onQuery={setQuery} onOpenResult={openResult} />
      <div style={{ flex:1 }}>{view}</div>
      {showFooter && <Footer onNav={goNav} />}
      <AuthPromptHost />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
