// Dreamwall UI kit — Films & Series browse pages.
// Cinematic featured hero banner + functional filter bar (genre, year,
// duration, score) + poster grid (highest rated first). Series cards show
// season count; series page gets a featured-series banner.

// ---- featured hero banner ----
function BrowseHero({ film, kicker, onOpen }) {
  const wlIds = useWatchlist();
  const inList = film && wlIds.includes(film.id);
  if (!film) return null;
  return (
    <div className="aicdb-hero" style={{ position:'relative', borderRadius:'var(--radius-xl)', overflow:'hidden', marginBottom:34,
      minHeight:360, background:'var(--bg-inset)' }}>
      {/* fading poster — featured content bleeds in from the right into the dark */}
      <div style={{ position:'absolute', top:0, right:0, bottom:0, width:'62%',
        background:`linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 165%)`,
        WebkitMaskImage:'linear-gradient(to left, rgba(0,0,0,1) 46%, rgba(0,0,0,0) 100%)',
        maskImage:'linear-gradient(to left, rgba(0,0,0,1) 46%, rgba(0,0,0,0) 100%)' }} />
      {/* soft vignette + bottom fade so the poster melts into the canvas */}
      <div style={{ position:'absolute', inset:0,
        background:'linear-gradient(90deg, var(--bg-inset) 8%, rgba(5,5,5,0.45) 44%, transparent 72%),'
          + 'linear-gradient(to top, var(--bg-inset) 2%, transparent 30%)' }} />
      <div style={{ position:'absolute', inset:0, opacity:0.4,
        backgroundImage:'radial-gradient(rgba(245,243,239,0.05) 1px, transparent 1px)', backgroundSize:'5px 5px' }} />
      <div className="aicdb-hero-body" style={{ position:'relative', padding:'48px 52px', maxWidth:560 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16, flexWrap:'wrap' }}>
          <span className="overline" style={{ color:'var(--coral-bright)' }}>{kicker}</span>
          <ContentBadge type={film.type} />
          <ContentRibbon film={film} size="sm" />
        </div>
        <h1 style={{ font:'700 46px/1.04 var(--font-display)', letterSpacing:'-0.015em', color:'var(--fg-0)', margin:'0 0 14px' }}>{film.title}</h1>
        <p style={{ font:'var(--text-body-lg)', color:'var(--fg-1)', margin:'0 0 22px', maxWidth:480 }}>{film.synopsis}</p>
        <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:26, flexWrap:'wrap' }}>
          <ScoreLine film={film} size={30} countColor="var(--fg-2)" />
          <span style={{ width:1, height:22, background:'var(--border-default)' }} />
          <span style={{ font:'var(--text-data)', color:'var(--fg-1)' }}>{film.year}</span>
          <span style={{ font:'var(--text-data)', color:'var(--fg-1)' }}>{film.seasons ? `${film.seasons} ${film.seasons===1?'season':'seasons'}` : film.runtime}</span>
          {(film.genres || []).length > 0 && (
            <span style={{ font:'var(--text-data)', color:'var(--fg-1)' }}>{film.genres.join(' · ')}</span>
          )}
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <Button variant="primary" icon="play" onClick={() => onOpen(film)}>View title</Button>
          <Button variant="secondary" icon={inList ? 'check' : 'plus'} onClick={() => { if (!window.AICDB_REQUIRE_AUTH('Sign in to build your watchlist.')) return; window.AICDB_WATCHLIST.toggle(film.id); }}>{inList ? 'On watchlist' : 'Watchlist'}</Button>
        </div>
      </div>
    </div>
  );
}

// ---- custom filter dropdown ----
function FilterSelect({ label, value, options, onChange }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  const active = value !== options[0];
  return (
    <div ref={ref} style={{ position:'relative' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ display:'inline-flex', alignItems:'center', gap:9, padding:'9px 14px', borderRadius:'var(--radius-pill)', cursor:'pointer',
          font:'600 13px/1 var(--font-body)', transition:'all var(--dur-fast)', borderWidth:1, borderStyle:'solid',
          background: active ? 'var(--coral-ghost)' : 'var(--bg-1)',
          borderColor: active ? 'var(--border-accent)' : 'var(--border-default)',
          color: active ? 'var(--coral-bright)' : 'var(--fg-1)' }}>
        <span style={{ color: active ? 'var(--coral-bright)' : 'var(--fg-2)' }}>{label}:</span>
        <span style={{ color: active ? 'var(--coral-bright)' : 'var(--fg-0)' }}>{value}</span>
        <Icon name={open ? 'caret-up' : 'caret-down'} size={12} color="currentColor" />
      </button>
      {open && (
        <div style={{ position:'absolute', top:'calc(100% + 6px)', left:0, zIndex:40, minWidth:160, padding:6,
          background:'var(--bg-1)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-lg)',
          boxShadow:'var(--shadow-3)', maxHeight:320, overflowY:'auto' }}>
          {options.map(opt => {
            const on = opt === value;
            return (
              <div key={opt} onClick={() => { onChange(opt); setOpen(false); }}
                style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, padding:'9px 11px', cursor:'pointer',
                  borderRadius:'var(--radius-md)', font:'500 13.5px/1 var(--font-body)', color: on ? 'var(--fg-0)' : 'var(--fg-1)',
                  background: on ? 'var(--bg-2)' : 'transparent' }}
                onMouseEnter={e => { if (!on) e.currentTarget.style.background = 'var(--bg-2)'; }}
                onMouseLeave={e => { if (!on) e.currentTarget.style.background = 'transparent'; }}>
                {opt}{on && <Icon name="check" size={14} color="var(--coral-bright)" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---- richer browse poster card (score always visible, season pill for series) ----
function BrowseCard({ film, onOpen }) {
  const [hover, setHover] = React.useState(false);
  const aspect = film.type === 'vertical' ? '9/16' : '2/3';
  return (
    <div style={{ cursor:'pointer' }} onClick={() => onOpen && onOpen(film)}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div style={{ aspectRatio:aspect, borderRadius:'var(--radius-lg)', overflow:'hidden', position:'relative',
        boxShadow:'var(--shadow-poster)', background:`linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 150%)`,
        transition:'transform var(--dur-base) var(--ease-out), filter var(--dur-base) var(--ease-out)',
        transform: hover ? 'translateY(-3px) scale(1.015)' : 'none', filter: hover ? 'brightness(1.08)' : 'brightness(1)' }}>
        {/* top-left: ribbon (if any) + type badge, stacked */}
        <div style={{ position:'absolute', top:10, left:10, display:'flex', flexDirection:'column', gap:6, alignItems:'flex-start' }}>
          <ContentRibbon film={film} size="sm" />
          <ContentBadge type={film.type} solid size="sm" />
        </div>
        {/* season pill (series) top-right, always visible — or watchlist on hover */}
        <div style={{ position:'absolute', top:10, right:10, display:'flex', alignItems:'center', gap:6 }}>
          {film.seasons != null && (
            <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 9px', borderRadius:'var(--radius-pill)',
              background:'rgba(10,10,10,0.6)', backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)',
              font:'600 11px/1 var(--font-mono)', color:'var(--teal-bright)' }}>
              <Icon name="stack" size={11} color="var(--teal-bright)" />{film.seasons} {film.seasons===1?'SEASON':'SEASONS'}
            </span>
          )}
          <div style={{ opacity: hover ? 1 : 0, transition:'opacity var(--dur-fast)' }}><WatchlistButton film={film} /></div>
        </div>
        {/* score scrim bottom */}
        <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'30px 12px 11px',
          background:'linear-gradient(to top, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.3) 60%, transparent 100%)',
          display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:8 }}>
          <ScoreLine film={film} size={23} countColor="rgba(255,255,255,0.7)" />
          {film.seasons == null && (
            <span style={{ display:'inline-flex', alignItems:'center', gap:4, font:'600 11px/1 var(--font-mono)', color:'rgba(255,255,255,0.82)' }}>
              <Icon name="clock" size={11} color="rgba(255,255,255,0.6)" />{formatDuration(film)}
            </span>
          )}
        </div>
      </div>
      <div style={{ font:'600 14px/1.25 var(--font-body)', color:'var(--fg-0)', marginTop:10,
        whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{film.title}</div>
      <div style={{ font:'var(--text-data-sm)', color:'var(--fg-2)', marginTop:3 }}>
        {film.year}{(film.genres || []).length > 0 ? ' · ' + film.genres[0] : ''}
      </div>
    </div>
  );
}

// ---- shared browse page (parameterized for Films vs Series) ----
function BrowsePage({ pool, kicker, durationOptions, durationMatch, onOpen }) {
  const [genre, setGenre] = React.useState('All genres');
  const [year, setYear] = React.useState('All years');
  const [duration, setDuration] = React.useState(durationOptions[0]);
  const [score, setScore] = React.useState('Any score');
  const [sort, setSort] = React.useState('Highest rated');
  // brief loading skeleton on mount + whenever filters change (simulated fetch)
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 620);
    return () => clearTimeout(t);
  }, [genre, year, duration, score, sort]);

  const genres = ['All genres', ...Array.from(new Set(pool.flatMap(f => f.genres || []))).sort()];
  const years = ['All years', ...Array.from(new Set(pool.map(f => f.year))).sort((a, b) => b - a).map(String)];
  const scores = ['Any score', '4.5+', '4.0+', '3.5+', '3.0+'];
  const sorts = ['Highest rated', 'Newest', 'Most rated'];

  const ratingNum = (f) => parseFloat(String(f.ratings)) * (String(f.ratings).includes('k') ? 1000 : 1);
  let shown = pool.filter(f => {
    if (genre !== 'All genres' && !(f.genres || []).includes(genre)) return false;
    if (year !== 'All years' && String(f.year) !== year) return false;
    if (score !== 'Any score' && f.score < parseFloat(score)) return false;
    if (duration !== durationOptions[0] && !durationMatch(f, duration)) return false;
    return true;
  });
  shown = shown.slice().sort((a, b) =>
    sort === 'Newest' ? b.year - a.year : sort === 'Most rated' ? ratingNum(b) - ratingNum(a) : b.score - a.score);

  const featured = pool.slice().sort((a, b) => b.score - a.score)[0];
  const reset = () => { setGenre('All genres'); setYear('All years'); setDuration(durationOptions[0]); setScore('Any score'); };
  const anyActive = genre !== 'All genres' || year !== 'All years' || duration !== durationOptions[0] || score !== 'Any score';

  return (
    <div className="aicdb-page" style={{ maxWidth:1180, margin:'0 auto', padding:'28px 28px 90px' }}>
      <BrowseHero film={featured} kicker={kicker} onOpen={onOpen} />

      {/* filter bar */}
      <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:26 }}>
        <FilterSelect label="Genre" value={genre} options={genres} onChange={setGenre} />
        <FilterSelect label="Year" value={year} options={years} onChange={setYear} />
        <FilterSelect label="Duration" value={duration} options={durationOptions} onChange={setDuration} />
        <FilterSelect label="Score" value={score} options={scores} onChange={setScore} />
        <div style={{ flex:1 }} />
        {anyActive && (
          <button onClick={reset} style={{ display:'inline-flex', alignItems:'center', gap:6, background:'none', border:'none',
            cursor:'pointer', font:'600 13px/1 var(--font-body)', color:'var(--fg-2)' }}>
            <Icon name="x" size={13} color="var(--fg-2)" /> Clear
          </button>
        )}
        <FilterSelect label="Sort" value={sort} options={sorts} onChange={setSort} />
      </div>

      <div style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', marginBottom:18 }}>
        {loading ? 'Loading titles…' : `${shown.length} ${shown.length === 1 ? 'title' : 'titles'}`}
      </div>

      {loading ? (
        <SkeletonGrid count={10} min={176} />
      ) : !pool.length ? (
        <EmptyState icon="film-slate" accent="var(--coral)" compact
          title="No titles yet"
          sub="Nothing has been published to the catalog yet. New releases will show up here." />
      ) : shown.length ? (
        <div className="aicdb-film-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(176px, 1fr))', gap:24 }}>
          {shown.map(f => <BrowseCard key={f.id} film={f} onOpen={onOpen} />)}
        </div>
      ) : (
        <EmptyState icon="funnel-x" accent="var(--teal)" compact
          title="No titles match these filters"
          sub="Try loosening a filter or two — there’s plenty more in the catalog."
          actionLabel="Clear filters" onAction={reset} />
      )}
    </div>
  );
}

// films prop: null = catalog still loading, [] = loaded but empty, [...] = ready.
function FilmsPage({ onOpen, films }) {
  if (films === null) {
    return (
      <div className="aicdb-page" style={{ maxWidth:1180, margin:'0 auto', padding:'28px 28px 90px' }}>
        <div className="aicdb-skel" style={{ borderRadius:'var(--radius-xl)', height:360, marginBottom:34 }} />
        <SkeletonGrid count={10} min={176} />
      </div>
    );
  }
  const pool = films.filter(f => f.type === 'movie' || f.type === 'short' || f.type === 'vertical');
  const mins = (f) => parseInt(String(f.runtime).replace(/[^0-9]/g, ''), 10) || 0;
  return (
    <BrowsePage pool={pool} kicker="Featured film" onOpen={onOpen}
      durationOptions={['Any length', 'Under 30 min', '30–90 min', '90–120 min', 'Over 2 hrs']}
      durationMatch={(f, d) => {
        const m = mins(f);
        return d === 'Under 30 min' ? m < 30 : d === '30–90 min' ? m >= 30 && m <= 90
          : d === '90–120 min' ? m > 90 && m <= 120 : d === 'Over 2 hrs' ? m > 120 : true;
      }} />
  );
}

function SeriesPage({ onOpen, films }) {
  if (films === null) {
    return (
      <div className="aicdb-page" style={{ maxWidth:1180, margin:'0 auto', padding:'28px 28px 90px' }}>
        <div className="aicdb-skel" style={{ borderRadius:'var(--radius-xl)', height:360, marginBottom:34 }} />
        <SkeletonGrid count={10} min={176} />
      </div>
    );
  }
  const pool = films.filter(f => f.type === 'series');
  return (
    <BrowsePage pool={pool} kicker="Featured series" onOpen={onOpen}
      durationOptions={['Any length', '1 season', '2 seasons', '3+ seasons']}
      durationMatch={(f, d) =>
        d === '1 season' ? f.seasons === 1 : d === '2 seasons' ? f.seasons === 2 : d === '3+ seasons' ? f.seasons >= 3 : true} />
  );
}

Object.assign(window, { BrowseHero, FilterSelect, BrowseCard, BrowsePage, FilmsPage, SeriesPage });
