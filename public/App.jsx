// Dreamwall UI kit — app shell + simple client routing

// Top-level error boundary: catches any render crash and shows an inline
// message instead of leaving the entire page black.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error('[Dreamwall] Render error:', error, info.componentStack);
  }
  render() {
    if (this.state.error) {
      const msg = this.state.error && this.state.error.message ? this.state.error.message : String(this.state.error);
      return (
        <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
          background:'var(--bg-0)', padding:32 }}>
          <div style={{ maxWidth:480, width:'100%', background:'var(--bg-1)', border:'1px solid var(--border-default)',
            borderRadius:'var(--radius-lg)', padding:'32px 28px', boxShadow:'var(--shadow-3)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
              <span style={{ fontSize:22 }}>⚠️</span>
              <span style={{ font:'700 16px/1.2 var(--font-body)', color:'var(--fg-0)' }}>Something went wrong</span>
            </div>
            <p style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', marginBottom:20, wordBreak:'break-word' }}>{msg}</p>
            <button onClick={() => { this.setState({ error: null }); window.location.reload(); }}
              style={{ padding:'9px 18px', borderRadius:'var(--radius-md)', background:'var(--coral)',
                color:'var(--fg-on-accent)', border:'none', font:'600 14px/1 var(--font-body)', cursor:'pointer' }}>
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
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

function WatchlistView({ films, onOpen, onNav, onWatch, onOpenList }) {
  const [rateFilm, setRateFilm] = React.useState(null);
  const [tab, setTab] = React.useState('watchlist');
  const [savedLists, setSavedLists] = React.useState([]);
  const [savedLoading, setSavedLoading] = React.useState(false);
  const lists = useLists();
  React.useEffect(() => { window.AICDB_LISTS.load(); }, []);

  React.useEffect(() => {
    if (tab !== 'saved') return;
    let cancelled = false;
    (async () => {
      setSavedLoading(true);
      const data = await window.AICDB_LISTS.loadFavoritedLists();
      if (!cancelled) {
        setSavedLists(data || []);
        setSavedLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [tab]);

  const tabBtn = (active) => ({
    padding:'8px 20px', borderRadius:999, border:'1px solid', cursor:'pointer', font:'600 13px/1 var(--font-body)',
    borderColor: active ? 'var(--teal-bright)' : 'var(--border-subtle)',
    color: active ? 'var(--teal-bright)' : 'var(--fg-2)', background:'transparent',
  });

  return (
    <div style={{ maxWidth:860, margin:'0 auto', padding:'32px 28px 40px' }}>
      <div style={{ textAlign:'center', marginBottom:28 }}>
        <h1 style={{ font:'var(--text-h1)', color:'var(--fg-0)', letterSpacing:'-0.015em', marginBottom:8 }}>Your Watchlist</h1>
        <p style={{ font:'var(--text-body)', color:'var(--fg-2)' }}>{films.length} {films.length===1?'title':'titles'} saved to watch</p>
      </div>
      <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:24 }}>
        <button style={tabBtn(tab === 'watchlist')} onClick={() => setTab('watchlist')}>Watchlist</button>
        <button style={tabBtn(tab === 'lists')} onClick={() => setTab('lists')}>All lists</button>
        <button style={tabBtn(tab === 'saved')} onClick={() => setTab('saved')}>Saved lists</button>
      </div>
      {tab === 'watchlist' ? (
        films.length ? (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {films.map(f => <WatchlistRow key={f.id} film={f} onOpen={onOpen} onWatch={onWatch} onRate={setRateFilm} />)}
          </div>
        ) : (
          <EmptyState icon="bookmark-simple" accent="var(--teal)"
            title="Nothing here yet"
            sub="Start exploring and tap the bookmark on any poster to save it for later."
            actionLabel="Browse the catalog" onAction={() => onNav && onNav('Films')} />
        )
      ) : tab === 'lists' ? (
        lists.length ? (
          <div>
            {lists.map(list => (
              <div key={list.id} onClick={() => onOpenList && onOpenList(list.id)}
                style={{ display:'flex', alignItems:'center', gap:14, padding:14, borderRadius:'var(--radius-md)',
                  background:'var(--bg-0)', border:'1px solid var(--border-subtle)', cursor:'pointer', marginBottom:8 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}>
                <div style={{ width:42, height:42, background:'var(--teal-ghost)', borderRadius:'var(--radius-md)',
                  display:'flex', alignItems:'center', justifyContent:'center', flex:'none' }}>
                  <Icon name="list" size={19} color="var(--teal-bright)" />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', minWidth:0 }}>
                    <span style={{ font:'600 15px/1.2 var(--font-body)', color:'var(--fg-0)' }}>{list.title}</span>
                    {list.visibility === 'private' && (
                      <span style={{ display:'inline-flex', alignItems:'center', marginLeft:4, flex:'none' }}>
                        <Icon name="lock-simple" size={12} weight="fill" color="var(--fg-3)" />
                      </span>
                    )}
                  </div>
                  <div style={{ marginTop:5, font:'var(--text-data-sm)', color:'var(--fg-2)' }}>
                    {list.count} {list.count === 1 ? 'title' : 'titles'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color:'var(--fg-2)', textAlign:'center', padding:'32px' }}>You have no lists yet</div>
        )
      ) : savedLoading ? (
        <div style={{ color:'var(--fg-2)', textAlign:'center', padding:'32px' }}>Loading saved lists…</div>
      ) : savedLists.length ? (
        <div>
          {savedLists.map(list => (
            <div key={list.id} onClick={() => onOpenList && onOpenList(list.id)}
              style={{ display:'flex', alignItems:'center', gap:14, padding:14, borderRadius:'var(--radius-md)',
                background:'var(--bg-0)', border:'1px solid var(--border-subtle)', cursor:'pointer', marginBottom:8 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}>
              <div style={{ width:42, height:42, background:'var(--teal-ghost)', borderRadius:'var(--radius-md)',
                display:'flex', alignItems:'center', justifyContent:'center', flex:'none' }}>
                <Icon name="list" size={19} color="var(--teal-bright)" />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ font:'600 15px/1.2 var(--font-body)', color:'var(--fg-0)' }}>{list.name}</div>
                <div style={{ marginTop:5, font:'var(--text-data-sm)', color:'var(--fg-2)' }}>
                  {list.view_count || 0} views
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ color:'var(--fg-2)', textAlign:'center', padding:'32px' }}>You have no saved lists yet</div>
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

// ---- Map a Supabase content row to the shape the UI expects ----
function dbRowToFilm(row) {
  const typeMap = { film: 'movie', series: 'series', short: 'short', vertical: 'vertical' };
  const type = typeMap[row.type] || row.type;
  const credits = Array.isArray(row.credits) ? row.credits : [];
  const creator = credits.find(c => c.role === 'Creator' || c.role === 'Director');
  const durationMin = row.duration_minutes;
  const runtime = durationMin
    ? (durationMin >= 60 ? Math.floor(durationMin/60) + 'h ' + (durationMin%60 ? durationMin%60 + 'm' : '') : durationMin + 'm').trim()
    : null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    type,
    year: row.release_year || '',
    synopsis: row.synopsis || '',
    runtime: runtime || '',
    poster_url: row.poster_url || null,
    embed_code: row.embed_code || null,
    g: ['#1a1a2e', '#16213e'],
    score: row._score || 0,
    stars: row._stars || 0,
    ratings: row._ratings || 0,
    creator: creator ? creator.name : (row._creator || ''),
    credits,
    genres: [],   // tags fetched separately when needed (not in the base query)
    ai_tools: row.ai_tools || [],
    staffPick: false,
  };
}

function isPreviewUrl() {
  try { return new URLSearchParams(window.location.search).get('preview') === '1'; } catch (e) { return false; }
}

function App() {
  const [nav, setNav] = React.useState(() => {
    try {
      if (new URLSearchParams(window.location.search).get('user')) return 'Profile';
    } catch (e) {}
    const h = decodeURIComponent((window.location.hash || '').replace(/^#/, '')).trim();
    const allowed = ['Discover','Feed','Films','Series','Creators','What is Dreamwall','Profile','Watchlist','My Reviews','Preferences'];
    return allowed.includes(h) ? h : 'Discover';
  });
  const [viewedUserId, setViewedUserId] = React.useState(() => {
    try { return new URLSearchParams(window.location.search).get('user') || null; } catch (e) { return null; }
  });
  const [detail, setDetail] = React.useState(null);
  const [listDetailId, setListDetailId] = React.useState(null);
  const [watching, setWatching] = React.useState(null);
  const [query, setQuery] = React.useState(() => {
    try {
      const q = new URLSearchParams(window.location.search).get('q') || '';
      if (q) {
        // Strip ?q= from the URL immediately so a refresh doesn't re-seed the search.
        try {
          const clean = new URL(window.location.href);
          clean.searchParams.delete('q');
          history.replaceState(null, '', clean.toString());
        } catch (e) {}
      }
      return q;
    } catch (e) { return ''; }
  });
  // Shared catalog: fetched once at App level so Films/Series/Browse pages
  // always have data regardless of navigation order.  null = loading, [] = empty.
  // Discover also fetches independently for its two-view (trending/newest) toggle.
  const [catalogFilms, setCatalogFilms] = React.useState(null);
  React.useEffect(() => {
    let cancelled = false;
    window.AICDB_AUTH.getClient().then(async (sb) => {
      try {
        const { data, error } = await sb.from('homepage_trending').select('*');
        if (cancelled) return;
        if (error) throw error;
        const films = (data || []).map(row => dbRowToFilm({
          ...row,
          _score:   row.rating_avg   ? parseFloat(row.rating_avg)  : 0,
          _ratings: row.rating_count || 0,
        }));
        // Populate the global catalog so legacy lookups (AICDB_FILM_BY_ID etc.) work.
        window.AICDB_FILMS.length = 0;
        films.forEach(f => window.AICDB_FILMS.push(f));
        window.AICDB_FILM_BY_ID = Object.fromEntries(films.map(f => [f.id, f]));
        setCatalogFilms(films);
      } catch (e) {
        console.warn('[App] catalog fetch failed:', e.message);
        if (!cancelled) setCatalogFilms([]); // unblock pages even on error
      }
    }).catch(() => { if (!cancelled) setCatalogFilms([]); });
    return () => { cancelled = true; };
  }, []);

  const fetchPreviewFilm = React.useCallback(async (filmId) => {
    try {
      const sb = await window.AICDB_AUTH.getClient();
      const { data, error } = await sb.from('content').select('*').eq('id', filmId).single();
      if (error || !data) return;
      setDetail(dbRowToFilm(data));
      setListDetailId(null);
      setViewedUserId(null);
      window.scrollTo(0, 0);
    } catch (e) {
      console.warn('[App] preview fetch failed:', e.message);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // URL ↔ state helpers
  // ---------------------------------------------------------------------------

  // Build a URL string for a given (nav, filmId, listId) combination.
  const buildUrl = (navPage, filmId, listId, userId) => {
    try {
      const u = new URL(window.location.href);
      u.searchParams.delete('film');
      u.searchParams.delete('list');
      u.searchParams.delete('user');
      if (filmId) {
        u.searchParams.set('film', filmId);
        u.hash = '';
      } else if (listId) {
        u.searchParams.set('list', listId);
        u.hash = '';
      } else if (userId) {
        u.searchParams.set('user', userId);
        u.hash = encodeURIComponent('Profile');
      } else {
        u.hash = encodeURIComponent(navPage || 'Discover');
      }
      return u.toString();
    } catch(e) { return window.location.href; }
  };

  // Read the current URL and return { nav, filmId, listId, userId }.
  const readUrl = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const filmId = params.get('film') || null;
      const listId = params.get('list') || null;
      const userId = params.get('user') || null;
      const h = decodeURIComponent((window.location.hash || '').replace(/^#/, '')).trim();
      const allowed = ['Discover','Feed','Films','Series','Creators','What is Dreamwall','Profile','Watchlist','My Reviews','Preferences'];
      const navPage = userId ? 'Profile' : (allowed.includes(h) ? h : 'Discover');
      return { navPage, filmId, listId, userId };
    } catch(e) { return { navPage: 'Discover', filmId: null, listId: null, userId: null }; }
  };

  // Apply a URL state to React state, optionally looked up from a film catalog.
  const applyUrl = React.useCallback((navPage, filmId, listId, userId, catalog, push) => {
    const url = buildUrl(navPage, filmId, listId, userId);
    const state = { nav: navPage, filmId: filmId || null, listId: listId || null, userId: userId || null };
    if (push === 'replace') {
      try { history.replaceState(state, '', url); } catch(e) {}
    } else if (push) {
      try { history.pushState(state, '', url); } catch(e) {}
    }
    if (filmId && catalog) {
      const film = catalog.find(f => String(f.id) === String(filmId));
      if (film) {
        setDetail(film); setListDetailId(null); setViewedUserId(null); setNav(navPage); window.scrollTo(0, 0);
        return;
      }
      if (isPreviewUrl()) {
        fetchPreviewFilm(filmId);
        setListDetailId(null); setViewedUserId(null); setNav(navPage);
        return;
      }
    }
    if (listId) {
      setListDetailId(listId); setDetail(null); setViewedUserId(null); setNav(navPage); window.scrollTo(0, 0);
      return;
    }
    if (userId) {
      setDetail(null); setListDetailId(null); setViewedUserId(userId); setNav('Profile'); window.scrollTo(0, 0);
      return;
    }
    setDetail(null);
    setListDetailId(null);
    setViewedUserId(null);
    setNav(navPage);
  }, [fetchPreviewFilm]);

  // Stamp the initial history entry with structured state so popstate can read it back.
  // This runs once on mount (before catalog is ready); we replaceState so we don't
  // add an extra entry — the browser already has one entry for this page load.
  React.useEffect(() => {
    const { navPage, filmId, listId, userId } = readUrl();
    try { history.replaceState({ nav: navPage, filmId: filmId || null, listId: listId || null, userId: userId || null }, '', window.location.href); } catch(e) {}
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Restore from ?film= / ?list= / ?user= once catalog is ready (handles refresh + deep-links).
  React.useEffect(() => {
    if (catalogFilms === null) return;
    const { navPage, filmId, listId, userId } = readUrl();
    if (filmId) {
      const film = catalogFilms.find(f => String(f.id) === String(filmId));
      if (film) { setDetail(film); setListDetailId(null); setViewedUserId(null); window.scrollTo(0, 0); }
      else if (isPreviewUrl()) fetchPreviewFilm(filmId);
    } else if (listId) {
      setListDetailId(listId); setDetail(null); setViewedUserId(null); window.scrollTo(0, 0);
    } else if (userId) {
      setDetail(null); setListDetailId(null); setViewedUserId(userId); setNav('Profile'); window.scrollTo(0, 0);
    }
    try { history.replaceState({ nav: navPage, filmId: filmId || null, listId: listId || null, userId: userId || null }, '', window.location.href); } catch(e) {}
  }, [catalogFilms, fetchPreviewFilm]); // eslint-disable-line react-hooks/exhaustive-deps

  // popstate listener — fires when Back / Forward is pressed.
  React.useEffect(() => {
    const onPop = (e) => {
      const st = e.state || {};
      const navPage = st.nav || readUrl().navPage;
      const filmId  = st.filmId != null ? st.filmId : readUrl().filmId;
      const listId  = st.listId != null ? st.listId : readUrl().listId;
      const userId  = st.userId != null ? st.userId : readUrl().userId;
      const catalog = window.AICDB_FILMS || [];
      applyUrl(navPage, filmId, listId, userId, catalog, false);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [applyUrl]);

  const loggedIn = useAuth();
  const watchlist = useWatchlist();
  const films = catalogFilms ?? window.AICDB_FILMS;

  // login-only in-app views — signed-out visitors get bounced to the login page
  const GATED = ['Profile', 'Watchlist', 'Feed', 'My Reviews', 'Preferences'];
  const blocked = !loggedIn && GATED.includes(nav);
  React.useEffect(() => {
    if (blocked) {
      try { window.location.replace(window.AICDB_PAGE('login')); } catch (e) { window.location.href = window.AICDB_PAGE('login'); }
    }
  }, [blocked]);

  // Own profile: strip stale ?user= from the URL without changing app state.
  React.useEffect(() => {
    if (nav !== 'Profile' || viewedUserId) return;
    try {
      const u = new URL(window.location.href);
      if (!u.searchParams.has('user')) return;
      u.searchParams.delete('user');
      const st = history.state || {};
      history.replaceState(
        { nav: st.nav || 'Profile', filmId: st.filmId ?? null, listId: st.listId ?? null, userId: null },
        '',
        u.toString()
      );
    } catch (e) {}
  }, [nav, viewedUserId]);

  const open = (f) => {
    if (!f) { goNav('Films'); return; }
    setDetail(f); setListDetailId(null); setViewedUserId(null); setWatching(null); window.scrollTo(0, 0);
    try { history.pushState({ nav, filmId: f.id, listId: null, userId: null }, '', buildUrl(nav, f.id, null, null)); } catch(e) {}
  };
  const openList = (listId) => {
    setListDetailId(listId); setDetail(null); setViewedUserId(null); setWatching(null); window.scrollTo(0, 0);
    try { history.pushState({ nav, filmId: null, listId, userId: null }, '', buildUrl(nav, null, listId, null)); } catch(e) {}
  };
  const goNav = (n) => {
    setNav(n); setDetail(null); setListDetailId(null); setViewedUserId(null); setWatching(null); setQuery(''); window.scrollTo(0, 0);
    try { history.pushState({ nav: n, filmId: null, listId: null, userId: null }, '', buildUrl(n, null, null, null)); } catch(e) {}
  };
  const openUserProfile = React.useCallback((userId) => {
    setNav('Profile');
    setDetail(null);
    setListDetailId(null);
    setViewedUserId(userId);
    setWatching(null);
    window.scrollTo(0, 0);
    try { history.pushState({ nav: 'Profile', filmId: null, listId: null, userId }, '', buildUrl('Profile', null, null, userId)); } catch(e) {}
  }, []);
  React.useEffect(() => {
    window.AICDB_OPEN_USER_PROFILE = openUserProfile;
    return () => { delete window.AICDB_OPEN_USER_PROFILE; };
  }, [openUserProfile]);
  React.useEffect(() => {
    window.AICDB_OPEN_LIST = openList;
    return () => { delete window.AICDB_OPEN_LIST; };
  });
  const openResult = (f) => { setQuery(''); open(f); };
  const goCreator = (creator) => { window.location.href = 'creator.html?name=' + encodeURIComponent(creator); };

  let view, showFooter = true;
  if (blocked) {
    // redirecting to login — keep the dark logo splash up so gated content never flashes
    return <LoadingScreen />;
  } else if (watching) {
    return <Watching film={watching} onBack={()=>{ setWatching(null); window.scrollTo(0,0); }} />;
  } else if (listDetailId) {
    const closeList = () => history.back();
    view = <ListDetail listId={listDetailId} catalogFilms={films} onBack={closeList} backLabel="Back"
      onOpen={open} onWatch={(f)=>{ setWatching(f); window.scrollTo(0,0); }} />;
  } else if (detail) {
    // "← Discover" button: go back in browser history if we can, otherwise
    // synthesise a forward nav to the current nav section.
    const closeDetail = () => history.back();
    view = <FilmDetail film={detail} onBack={closeDetail} onWatch={(f)=>{ setWatching(f); window.scrollTo(0,0); }} onCreator={goCreator} onOpen={open} />;
  } else if (nav === 'Profile') {
    view = <Profile embedded onOpen={open} onOpenList={openList} viewedUserId={viewedUserId} />;
  } else if (nav === 'Watchlist') {
    const wl = watchlist.map(id => films.find(f => f.id === id)).filter(Boolean);
    view = <WatchlistView films={wl} onOpen={open} onNav={goNav} onWatch={(f)=>{ setWatching(f); window.scrollTo(0,0); }} onOpenList={openList} />;
  } else if (nav === 'My Reviews') {
    view = <MyReviewsView onOpen={open} onNav={goNav} />;
  } else if (nav === 'Preferences') {
    view = <Preferences />;
  } else if (nav === 'Discover') {
    view = <Discover onOpen={open} />;
  } else if (nav === 'Films') {
    view = <FilmsPage films={catalogFilms} onOpen={open} />;
  } else if (nav === 'Series') {
    view = <SeriesPage films={catalogFilms} onOpen={open} />;
  } else if (nav === 'Creators') {
    view = <CreatorsPage onCreator={goCreator} onOpen={open} />;
  } else if (nav === 'What is Dreamwall') {
    view = <WhatIs onNav={goNav} />;
  } else {
    view = <Feed onOpen={open} onCreator={goCreator} onNav={goNav} />;
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <NavBar active={(detail || listDetailId) ? '' : nav} onNav={goNav} query={query} onQuery={setQuery} onOpenResult={openResult} films={catalogFilms} />
      <div style={{ flex:1 }}>{view}</div>
      {showFooter && <Footer onNav={goNav} />}
      <AuthPromptHost />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
