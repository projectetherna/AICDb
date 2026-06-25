// Dreamwall — Discover / home screen (live DB, quality-ranked)
// Sections restored to design spec. Every section always renders its heading;
// empty states appear inside sections when no items match, never silently hidden.

function Hero({ film, onOpen }) {
  const wlIds = useWatchlist();
  const inList = film && wlIds.includes(film.id);
  if (!film || !film.g) return null;
  return (
    <div className="aicdb-hero" style={{ position:'relative', borderRadius:'var(--radius-xl)', overflow:'hidden', marginBottom:44,
      minHeight:340, background:'var(--bg-inset)' }}>
      <div style={{ position:'absolute', top:0, left:0, bottom:0, width:'64%',
        background:`linear-gradient(120deg, ${film.g[0]}, ${film.g[1]} 160%)`,
        WebkitMaskImage:'linear-gradient(to right, rgba(0,0,0,1) 46%, rgba(0,0,0,0) 100%)',
        maskImage:'linear-gradient(to right, rgba(0,0,0,1) 46%, rgba(0,0,0,0) 100%)' }} />
      <div style={{ position:'absolute', inset:0,
        background:'linear-gradient(90deg, rgba(5,5,5,0.35) 0%, rgba(5,5,5,0.55) 46%, var(--bg-inset) 78%),'
          + 'linear-gradient(to top, var(--bg-inset) 2%, transparent 32%)' }} />
      <div style={{ position:'absolute', inset:0, opacity:0.4,
        backgroundImage:'radial-gradient(rgba(245,243,239,0.05) 1px, transparent 1px)', backgroundSize:'5px 5px' }} />
      <div className="aicdb-hero-body aicdb-hero-body--right" style={{ position:'relative', padding:'44px 48px', maxWidth:540, marginLeft:'auto', display:'flex', flexDirection:'column', alignItems:'flex-end', textAlign:'right' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
          <span className="overline" style={{ color:'var(--coral-bright)' }}>Featured this week</span>
          <ContentBadge type={film.type} />
          <ContentRibbon film={film} size="sm" />
        </div>
        <h1 style={{ font:'var(--text-display)', letterSpacing:'-0.015em', color:'var(--fg-0)', marginBottom:14 }}>{film.title}</h1>
        <p style={{ font:'var(--text-body-lg)', color:'var(--fg-1)', marginBottom:22, maxWidth:460 }}>{film.synopsis}</p>
        <div style={{ display:'flex', alignItems:'center', gap:18, marginBottom:26 }}>
          <ScoreLine film={film} size={28} countColor="var(--fg-2)" />
          <span style={{ font:'var(--text-data)', color:'var(--fg-1)' }}>{film.year}{film.runtime ? ' · ' + film.runtime : ''}</span>
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <Button variant="primary" icon="play" onClick={() => onOpen(film)}>View title</Button>
          <Button variant="secondary" icon={inList ? 'check' : 'plus'} onClick={() => { if (!window.AICDB_REQUIRE_AUTH('Sign in to build your watchlist.')) return; window.AICDB_WATCHLIST.toggle(film.id); }}>{inList ? 'On watchlist' : 'Watchlist'}</Button>
        </div>
      </div>
    </div>
  );
}

// Map a homepage_trending / homepage_newest DB row to the UI film shape.
function _viewRowToFilm(row) {
  const typeMap = { film: 'movie', series: 'series', short: 'short', vertical: 'vertical' };
  const type = typeMap[row.type] || row.type;
  const credits = (row.credits && typeof row.credits === 'object' && !Array.isArray(row.credits))
    ? Object.entries(row.credits).map(([role, name]) => ({ role, name }))
    : (Array.isArray(row.credits) ? row.credits : []);
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
    score: row.rating_avg ? parseFloat(row.rating_avg) : 0,
    ratings: row.rating_count || 0,
    creator: creator ? creator.name : '',
    credits,
    genres: [],
    ai_tools: row.ai_tools || [],
    staffPick: false,
  };
}

// Loading skeleton
function DiscoverSkeleton() {
  return (
    <div className="aicdb-page" style={{ maxWidth:1180, margin:'0 auto', padding:'32px 28px 80px' }}>
      <div className="aicdb-skel" style={{ borderRadius:'var(--radius-xl)', height:340, marginBottom:44 }} />
      {[0,1,2].map(i => (
        <section key={i} style={{ marginBottom:48 }}>
          <div style={{ textAlign:'center', marginBottom:20 }}>
            <div className="aicdb-skel" style={{ height:22, width:160, borderRadius:6, margin:'0 auto 8px' }} />
          </div>
          <div className="aicdb-film-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))', gap:20 }}>
            {[0,1,2,3,4,5].map(j => (
              <div key={j}>
                <div className="aicdb-skel" style={{ aspectRatio:'2/3', borderRadius:'var(--radius-lg)', marginBottom:9 }} />
                <div className="aicdb-skel" style={{ height:14, borderRadius:4, marginBottom:5 }} />
                <div className="aicdb-skel" style={{ height:11, width:'60%', borderRadius:4 }} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

// Pill toggle bar used for view switch and Top Quality type filter
function PillToggle({ options, value, onChange }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
      {options.map(({ key, label }) => (
        <button key={key} onClick={() => onChange(key)}
          style={{ padding:'6px 16px', borderRadius:'var(--radius-pill)', border:'1px solid',
            cursor:'pointer', font:'600 12px/1 var(--font-body)',
            transition:'all var(--dur-fast)',
            borderColor: value === key ? 'var(--coral)' : 'var(--border-subtle)',
            background:  value === key ? 'var(--coral-ghost)' : 'transparent',
            color:       value === key ? 'var(--coral-bright)' : 'var(--fg-2)' }}>
          {label}
        </button>
      ))}
    </div>
  );
}

// Section wrapper — always renders heading + optional subtitle + controls row,
// then either the film grid or an inline empty state.
function SectionShell({ title, sub, controls, children, empty }) {
  return (
    <section style={{ marginBottom:52 }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between',
        flexWrap:'wrap', gap:10, marginBottom:20 }}>
        <div>
          <h2 style={{ font:'700 20px/1.2 var(--font-display)', color:'var(--fg-0)',
            letterSpacing:'-0.01em', margin:0 }}>{title}</h2>
          {sub && <p style={{ font:'var(--text-body-sm)', color:'var(--fg-3)', margin:'5px 0 0' }}>{sub}</p>}
        </div>
        {controls && <div style={{ flex:'none' }}>{controls}</div>}
      </div>
      {children}
    </section>
  );
}

// Inline empty state used when a section has no matching items
function SectionEmpty({ message }) {
  return (
    <div style={{ padding:'28px 20px', borderRadius:'var(--radius-lg)',
      border:'1px dashed var(--border-subtle)', textAlign:'center',
      background:'var(--bg-inset)' }}>
      <p style={{ font:'var(--text-body-sm)', color:'var(--fg-3)', margin:0 }}>{message}</p>
    </div>
  );
}

// Top Quality section with its own type filter state
function TopQualitySection({ films, onOpen }) {
  const [filter, setFilter] = React.useState('all');
  const typeOpts = [
    { key:'all',    label:'All' },
    { key:'movie',  label:'Films' },
    { key:'series', label:'Series' },
    { key:'short',  label:'Shorts' },
  ];
  const rated = [...films].filter(f => f.score > 0).sort((a, b) => b.score - a.score);
  const filtered = filter === 'all' ? rated : rated.filter(f => {
    if (filter === 'short') return f.type === 'short' || f.type === 'vertical';
    return f.type === filter;
  });
  const shown = filtered.slice(0, 6);

  return (
    <SectionShell
      title="Top Quality"
      sub="Highest-rated titles by combined score"
      controls={<PillToggle options={typeOpts} value={filter} onChange={setFilter} />}
    >
      {shown.length
        ? <FilmRow films={shown} onOpen={onOpen} />
        : <SectionEmpty message={
            filter === 'all'
              ? 'Rate titles to start building the quality rankings.'
              : `No ${typeOpts.find(o => o.key === filter).label.toLowerCase()} have been rated yet.`
          } />
      }
    </SectionShell>
  );
}

function Discover({ onOpen }) {
  const [trendingFilms, setTrendingFilms] = React.useState(null); // null = loading
  const [newestFilms,   setNewestFilms]   = React.useState(null);
  const [error, setError]     = React.useState(null);
  const [view,  setView]      = React.useState('quality'); // 'quality' | 'newest'
  // Random shuffle is seeded once on mount so re-renders don't re-shuffle
  const [randomFilms, setRandomFilms] = React.useState([]);

  React.useEffect(() => {
    let cancelled = false;
    window.AICDB_AUTH.getClient().then(async (sb) => {
      try {
        const [trendRes, newestRes] = await Promise.all([
          sb.from('homepage_trending').select('*'),
          sb.from('homepage_newest').select('*'),
        ]);
        if (cancelled) return;
        if (trendRes.error)  throw trendRes.error;
        if (newestRes.error) throw newestRes.error;

        const trending = (trendRes.data  || []).map(_viewRowToFilm);
        const newest   = (newestRes.data || []).map(_viewRowToFilm);

        setTrendingFilms(trending);
        setNewestFilms(newest);
        // Seed the random order once on mount
        setRandomFilms([...trending].sort(() => Math.random() - 0.5));

        // Keep the global catalog in sync for other pages
        const merged = [...trending];
        const seenIds = new Set(trending.map(f => f.id));
        newest.forEach(f => { if (!seenIds.has(f.id)) merged.push(f); });
        window.AICDB_FILMS.length = 0;
        merged.forEach(f => window.AICDB_FILMS.push(f));
        window.AICDB_FILM_BY_ID = Object.fromEntries(merged.map(f => [f.id, f]));
      } catch (e) {
        if (!cancelled) setError(e.message || 'Could not load content.');
      }
    }).catch(e => { if (!cancelled) setError(e.message || 'Could not connect.'); });
    return () => { cancelled = true; };
  }, []);

  if (trendingFilms === null && !error) return <DiscoverSkeleton />;

  if (error) {
    return (
      <div style={{ maxWidth:1180, margin:'0 auto', padding:'32px 28px 80px' }}>
        <EmptyState icon="warning" accent="var(--score-low)"
          title="Couldn't load the homepage"
          sub={error}
          actionLabel="Retry" onAction={() => window.location.reload()} />
      </div>
    );
  }

  const qualityFilms = trendingFilms || [];
  const hero = qualityFilms[0] || null;

  // ---- Newest view ----
  if (view === 'newest') {
    const newest = newestFilms || [];
    return (
      <div className="aicdb-page" style={{ maxWidth:1180, margin:'0 auto', padding:'32px 28px 80px' }}>
        {hero && <Hero film={hero} onOpen={onOpen} />}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:36 }}>
          <PillToggle
            options={[{ key:'quality', label:'Top Quality' }, { key:'newest', label:'Newest' }]}
            value={view} onChange={setView} />
        </div>
        <SectionShell title="Just Published" sub="Most recently released titles">
          {newest.length
            ? <FilmRow films={newest.slice(0, 12)} onOpen={onOpen} />
            : <SectionEmpty message="No titles published yet." />}
        </SectionShell>
      </div>
    );
  }

  // ---- Quality (default) view ----
  const films = qualityFilms;
  const byRatingCount = [...films].sort((a, b) => b.ratings - a.ratings);
  const byYear        = [...films].sort((a, b) => (b.year || 0) - (a.year || 0));
  const seriesFilms   = films.filter(f => f.type === 'series');
  const shortFilms    = films.filter(f => f.type === 'short' || f.type === 'vertical');

  return (
    <div className="aicdb-page" style={{ maxWidth:1180, margin:'0 auto', padding:'32px 28px 80px' }}>
      {hero && <Hero film={hero} onOpen={onOpen} />}

      {/* View toggle */}
      <div style={{ display:'flex', justifyContent:'center', marginBottom:36 }}>
        <PillToggle
          options={[{ key:'quality', label:'Top Quality' }, { key:'newest', label:'Newest' }]}
          value={view} onChange={setView} />
      </div>

      {/* 1. Recommended — placeholder, real engine comes later */}
      <SectionShell title="Recommended" sub="Personalised for you">
        <SectionEmpty message="Rate titles and your personalized recommendations will appear here." />
      </SectionShell>

      {/* 2. Top Quality — score desc, with type filter */}
      <TopQualitySection films={films} onOpen={onOpen} />

      {/* 3. Trending — most-rated / highest activity */}
      <SectionShell title="Trending" sub="Most-rated titles right now">
        {byRatingCount.filter(f => f.ratings > 0).length
          ? <FilmRow films={byRatingCount.filter(f => f.ratings > 0).slice(0, 6)} onOpen={onOpen} />
          : <SectionEmpty message="Rating activity will surface here once titles have been rated." />}
      </SectionShell>

      {/* 4. New — release year desc */}
      <SectionShell title="New" sub="Recently released">
        {byYear.length
          ? <FilmRow films={byYear.slice(0, 6)} onOpen={onOpen} />
          : <SectionEmpty message="No titles in the catalog yet." />}
      </SectionShell>

      {/* 5. Serial Lover — series only */}
      <SectionShell title="Serial Lover" sub="For the binge-watchers">
        {seriesFilms.length
          ? <FilmRow films={seriesFilms.slice(0, 6)} onOpen={onOpen} />
          : <SectionEmpty message="No series published yet — check back soon." />}
      </SectionShell>

      {/* 6. Shorts */}
      <SectionShell title="Shorts">
        {shortFilms.length
          ? <FilmRow films={shortFilms.slice(0, 6)} onOpen={onOpen} />
          : <SectionEmpty message="No shorts or vertical films published yet." />}
      </SectionShell>

      {/* 7. Random — shuffled once on mount */}
      <SectionShell title="Random" sub="Roll the dice">
        {randomFilms.length
          ? <FilmRow films={randomFilms.slice(0, 6)} onOpen={onOpen} />
          : <SectionEmpty message="Nothing to shuffle yet." />}
      </SectionShell>
    </div>
  );
}

Object.assign(window, { Discover, Hero });
