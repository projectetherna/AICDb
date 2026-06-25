// Dreamwall UI kit — minimal YTS-style film card.
// Poster only by default; title + year below; dark overlay on hover reveals
// score + type badge, plus duration and an add-to-watchlist button.
function WatchlistButton({ film, size = 30 }) {
  const ids = useWatchlist();
  const inList = ids.includes(film.id);
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); if (!window.AICDB_REQUIRE_AUTH('Sign in to build your watchlist.')) return; window.AICDB_WATCHLIST.toggle(film.id); }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      title={inList ? 'In watchlist' : 'Add to watchlist'}
      style={{ width: size, height: size, flex: 'none', borderRadius: '50%', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid ' + (inList ? 'transparent' : 'rgba(255,255,255,0.5)'),
        background: inList ? 'var(--coral)' : (hover ? 'rgba(255,255,255,0.18)' : 'rgba(10,10,10,0.45)'),
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        transition: 'all var(--dur-fast) var(--ease-out)' }}>
      <Icon name={inList ? 'check' : 'plus'} size={size * 0.5} color={inList ? '#1a0d08' : '#fff'} />
    </button>
  );
}

function FilmCard({ film, onOpen, width = 150 }) {
  const [hover, setHover] = React.useState(false);
  const t = window.AICDB_TYPES[film.type];
  const aspect = film.type === 'vertical' ? '9/16' : '2/3';
  const g = film.g || ['#1a1a2e', '#16213e'];
  return (
    <div style={{ width, cursor:'pointer' }} onClick={()=> onOpen && onOpen(film)}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
      <div style={{ aspectRatio:aspect, borderRadius:'var(--radius-lg)', overflow:'hidden', position:'relative',
        boxShadow:'var(--shadow-poster)', background:`linear-gradient(150deg, ${g[0]}, ${g[1]} 150%)`,
        transition:'transform var(--dur-base) var(--ease-out), filter var(--dur-base) var(--ease-out)',
        transform: hover?'translateY(-3px) scale(1.015)':'none', filter: hover?'brightness(1.08)':'brightness(1)' }}>
        {/* poster image if available */}
        {film.poster_url && (
          <img src={film.poster_url} alt={film.title}
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
        )}
        {/* always-visible content ribbon */}
        <div style={{ position:'absolute', top:9, left:9, zIndex:2 }}><ContentRibbon film={film} size="sm" /></div>
        <div style={{ position:'absolute', inset:0, opacity:hover?1:0, transition:'opacity var(--dur-base) var(--ease-out)',
          background:'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.12) 55%, rgba(0,0,0,0.4) 100%)',
          display:'flex', flexDirection:'column', justifyContent:'space-between', padding:11 }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'flex-end' }}>
            <WatchlistButton film={film} />
          </div>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:8 }}>
            <ScoreLine film={film} size={22} countColor="rgba(255,255,255,0.7)" />
            <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'4px 8px', borderRadius:'var(--radius-pill)',
              background:'rgba(10,10,10,0.55)', backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)',
              font:'600 11px/1 var(--font-mono)', color:'rgba(255,255,255,0.92)' }}>
              <Icon name="clock" size={11} color="rgba(255,255,255,0.7)" />{formatDuration(film)}
            </span>
          </div>
        </div>
      </div>
      <div style={{ font:'600 13.5px/1.25 var(--font-body)', color:'var(--fg-0)', marginTop:9 }}>{film.title}</div>
      <div style={{ font:'var(--text-data-sm)', color:'var(--fg-2)', marginTop:2 }}>{film.year}</div>
    </div>
  );
}

function FilmRow({ title, sub, films, onOpen }) {
  return (
    <section style={{ marginBottom:48 }}>
      <div style={{ textAlign:'center', marginBottom:20 }}>
        <h2 style={{ font:'var(--text-h3)', color:'var(--fg-0)', letterSpacing:'-0.005em' }}>{title}</h2>
        {sub && <p style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', margin:'5px 0 0' }}>{sub}</p>}
      </div>
      <div className="aicdb-film-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))', gap:20 }}>
        {films.map((f, i) => <FilmCard key={f.id + '-' + i} film={f} onOpen={onOpen} width="auto" />)}
      </div>
    </section>
  );
}
Object.assign(window, { FilmCard, FilmRow, WatchlistButton });
