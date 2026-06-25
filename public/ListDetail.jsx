// Dreamwall — list detail view + shared watchlist-style row

function WatchlistRow({ film, onOpen, onWatch, onRate, onRemove }) {
  const [hover, setHover] = React.useState(false);
  const t = window.AICDB_TYPES[film.type];
  const aspect = film.type === 'vertical' ? '9/16' : '2/3';
  const actions = [
    { icon:'star',  label:'Rate',   color:'var(--coral-bright)', onClick:() => onRate && onRate(film) },
    { icon:'play',  label:'Watch',  color:'var(--teal-bright)',  onClick:() => onWatch && onWatch(film) },
    { icon:'trash', label:'Remove', color:'var(--score-low)',
      onClick:() => (onRemove ? onRemove(film) : window.AICDB_WATCHLIST.toggle(film.id)) },
  ];
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 16px', background:'var(--bg-1)',
        border:'1px solid ' + (hover ? 'var(--border-default)' : 'var(--border-subtle)'), borderRadius:'var(--radius-lg)',
        transition:'border-color var(--dur-fast)' }}>
      <div style={{ flex:'none', width:58, textAlign:'center' }}>
        <div style={{ display:'inline-flex', alignItems:'baseline', gap:2 }}>
          <span style={{ font:'700 24px/1 var(--font-mono)', color:scoreColor(film.score) }}>{film.score.toFixed(1)}</span>
        </div>
        <div className="overline" style={{ color:'var(--fg-3)', marginTop:6 }}>Score</div>
      </div>
      <div style={{ flex:'none', alignSelf:'stretch', width:1, background:'var(--border-subtle)' }} />
      <div onClick={() => onOpen && onOpen(film)} style={{ width:54, flex:'none', aspectRatio:aspect, borderRadius:'var(--radius-md)', overflow:'hidden',
        cursor:'pointer', background:`linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 150%)`, boxShadow:'var(--shadow-1)' }} />
      <div onClick={() => onOpen && onOpen(film)} style={{ flex:1, minWidth:0, cursor:'pointer' }}>
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

function ListDetail({ listId, catalogFilms, onBack, onOpen, onWatch, backLabel = 'Back' }) {
  const [status, setStatus] = React.useState('loading');
  const [listMeta, setListMeta] = React.useState(null);
  const [contentIds, setContentIds] = React.useState([]);
  const [localCatalog, setLocalCatalog] = React.useState(null);
  const [rateFilm, setRateFilm] = React.useState(null);
  const [isFavorited, setIsFavorited] = React.useState(false);
  const [currentUserId, setCurrentUserId] = React.useState(null);

  React.useEffect(() => {
    if (!listId) return;
    const key = 'list_view_' + listId;
    const cooldownMs = 15 * 60 * 1000;
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const ts = parseInt(stored, 10);
        if (!isNaN(ts) && Date.now() - ts < cooldownMs) return;
      }
    } catch (e) {}
    (async () => {
      await window.AICDB_LISTS.recordView(listId);
      try { localStorage.setItem(key, String(Date.now())); } catch (e) {}
    })();
  }, [listId]);

  React.useEffect(() => {
    window.AICDB_AUTH?.getSession().then(s => { if (s) setCurrentUserId(s.user.id); });
  }, []);

  React.useEffect(() => {
    if (!listId || !currentUserId) return;
    (async () => {
      try {
        const sb = await window.AICDB_AUTH.getClient();
        const { data } = await sb.from('list_favorites').select('list_id').eq('user_id', currentUserId).eq('list_id', listId).maybeSingle();
        setIsFavorited(!!data);
      } catch (e) {}
    })();
  }, [listId, currentUserId]);

  const films = catalogFilms ?? localCatalog ?? window.AICDB_FILMS;

  React.useEffect(() => {
    if (catalogFilms !== null && catalogFilms !== undefined) return;
    if (window.AICDB_FILMS.length) return;
    let cancelled = false;
    window.AICDB_AUTH.getClient().then(async (sb) => {
      try {
        const { data, error } = await sb.from('homepage_trending').select('*');
        if (cancelled) return;
        if (error) throw error;
        const rows = (data || []).map(row => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          type: ({ film: 'movie', series: 'series', short: 'short', vertical: 'vertical' })[row.type] || row.type,
          year: row.release_year || '',
          runtime: row.duration_minutes
            ? (row.duration_minutes >= 60
              ? Math.floor(row.duration_minutes / 60) + 'h ' + (row.duration_minutes % 60 ? row.duration_minutes % 60 + 'm' : '')
              : row.duration_minutes + 'm').trim()
            : '',
          poster_url: row.poster_url || null,
          g: ['#1a1a2e', '#16213e'],
          score: row.rating_avg ? parseFloat(row.rating_avg) : 0,
          ratings: row.rating_count || 0,
          creator: '',
        }));
        window.AICDB_FILMS.length = 0;
        rows.forEach(f => window.AICDB_FILMS.push(f));
        window.AICDB_FILM_BY_ID = Object.fromEntries(rows.map(f => [f.id, f]));
        setLocalCatalog(rows);
      } catch (e) {
        if (!cancelled) setLocalCatalog([]);
      }
    }).catch(() => { if (!cancelled) setLocalCatalog([]); });
    return () => { cancelled = true; };
  }, [catalogFilms]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setStatus('loading');
      try {
        const sb = await window.AICDB_AUTH.getClient();
        const { data, error } = await sb
          .from('lists')
          .select('id, name, visibility, user_id, view_count, favorite_count, is_system, created_at')
          .eq('id', listId)
          .maybeSingle();
        if (cancelled) return;
        if (error || !data) { setStatus('unavailable'); return; }
        let owner = null;
        try {
          const { data: profile, error: profileErr } = await sb
            .from('profiles')
            .select('username, display_name')
            .eq('id', data.user_id)
            .maybeSingle();
          if (!profileErr && profile) {
            owner = profile.display_name || profile.username || null;
          }
        } catch (_) { /* owner is optional — never block list load */ }
        const ids = await window.AICDB_LISTS.getItems(listId);
        if (cancelled) return;
        setListMeta({
          id: data.id,
          title: data.name,
          visibility: data.visibility,
          user_id: data.user_id,
          owner,
          count: ids.length,
          view_count: data.view_count || 0,
          favorite_count: data.favorite_count || 0,
        });
        setContentIds(ids);
        setStatus('ready');
      } catch (e) {
        if (!cancelled) setStatus('unavailable');
      }
    })();
    return () => { cancelled = true; };
  }, [listId]);

  const resolved = contentIds
    .map(id => films.find(f => String(f.id) === String(id)))
    .filter(Boolean);

  const handleRemove = async (film) => {
    const prev = contentIds;
    setContentIds(ids => ids.filter(id => String(id) !== String(film.id)));
    if (listMeta) setListMeta(m => ({ ...m, count: Math.max(0, m.count - 1) }));
    try {
      await window.AICDB_LISTS.toggleItem(listId, film.id);
    } catch (e) {
      setContentIds(prev);
      if (listMeta) setListMeta(m => ({ ...m, count: m.count + 1 }));
    }
  };

  const visAccent = listMeta && listMeta.visibility === 'private' ? 'var(--fg-1)' : 'var(--teal-bright)';

  return (
    <div style={{ maxWidth:860, margin:'0 auto', padding:'28px 28px 90px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
        <button onClick={onBack}
          style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'8px 14px', cursor:'pointer',
            borderRadius:'var(--radius-pill)', background:'var(--bg-1)', border:'1px solid var(--border-default)',
            color:'var(--fg-1)', font:'600 13px/1 var(--font-body)', transition:'all var(--dur-fast)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--fg-0)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--fg-1)'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}>
          <Icon name="caret-left" size={14} color="currentColor" /> {backLabel}
        </button>
        {status === 'ready' && listMeta && currentUserId && listMeta.user_id !== currentUserId && (
          <button onClick={async () => {
            if (!window.AICDB_REQUIRE_AUTH('Sign in to save lists.')) return;
            const { favorited, error } = await window.AICDB_LISTS.toggleFavorite(listId);
            if (!error) {
              setIsFavorited(!!favorited);
              setListMeta(m => m ? { ...m, favorite_count: Math.max(0, (m.favorite_count || 0) + (favorited ? 1 : -1)) } : m);
            }
          }} style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'8px 14px', cursor:'pointer',
            borderRadius:'var(--radius-pill)', background:'var(--bg-1)', border:'1px solid var(--border-default)',
            color: isFavorited ? 'var(--teal-bright)' : 'var(--fg-1)', font:'600 13px/1 var(--font-body)', transition:'all var(--dur-fast)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--fg-0)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = isFavorited ? 'var(--teal-bright)' : 'var(--fg-1)'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}>
            {isFavorited ? '✓ Saved' : 'Save list'}
          </button>
        )}
      </div>

      {status === 'loading' && (
        <div style={{ padding:'48px 0', textAlign:'center', font:'var(--text-body)', color:'var(--fg-2)' }}>Loading list…</div>
      )}

      {status === 'unavailable' && (
        <EmptyState icon="lock-simple" accent="var(--fg-2)"
          title="This list isn’t available"
          sub="It may be private, removed, or you don’t have access to view it." />
      )}

      {status === 'ready' && listMeta && (
        <>
          <div style={{ textAlign:'center', marginBottom:28 }}>
            <h1 style={{ font:'var(--text-h1)', color:'var(--fg-0)', letterSpacing:'-0.015em', marginBottom:8 }}>{listMeta.title}</h1>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, flexWrap:'wrap' }}>
              <p style={{ font:'var(--text-body)', color:'var(--fg-2)', margin:0 }}>
                {listMeta.count} {listMeta.count === 1 ? 'title' : 'titles'}
              </p>
              <span style={{ color:'var(--fg-3)' }}>·</span>
              <span style={{ display:'inline-flex', alignItems:'center', gap:6, font:'var(--text-body-sm)', color:'var(--fg-2)' }}>
                <Icon name="eye" size={14} color="var(--fg-3)" />
                <span>{listMeta.view_count || 0}</span>
              </span>
              <span style={{ color:'var(--fg-3)' }}>·</span>
              <span style={{ display:'inline-flex', alignItems:'center', gap:6, font:'var(--text-body-sm)', color:'var(--fg-2)' }}>
                <Icon name="heart" size={14} color="var(--fg-3)" />
                <span>{listMeta.favorite_count || 0}</span>
              </span>
              <span style={{ color:'var(--fg-3)' }}>·</span>
              <span style={{ display:'inline-flex', alignItems:'center', gap:6, font:'600 12px/1 var(--font-body)', color:visAccent }}>
                <Icon name={listMeta.visibility === 'private' ? 'lock-simple' : 'eye'} size={13} color={visAccent}
                  weight={listMeta.visibility === 'private' ? 'fill' : 'regular'} />
                {listMeta.visibility === 'private' ? 'Private' : 'Public'}
              </span>
              {listMeta.owner && (<>
                <span style={{ color:'var(--fg-3)' }}>·</span>
                <span style={{ font:'var(--text-body-sm)', color:'var(--fg-2)' }}>{listMeta.owner}</span>
              </>)}
            </div>
          </div>

          {resolved.length ? (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {resolved.map(f => (
                <WatchlistRow key={f.id} film={f} onOpen={onOpen} onWatch={onWatch} onRate={setRateFilm}
                  onRemove={handleRemove} />
              ))}
            </div>
          ) : (
            <EmptyState icon="list" accent="var(--teal)"
              title="This list is empty"
              sub="Add titles from any film page using the + menu next to the watchlist button." />
          )}
        </>
      )}

      {rateFilm && (
        <RatingPanel film={rateFilm} onClose={() => setRateFilm(null)} onSubmit={() => setRateFilm(null)} />
      )}
    </div>
  );
}

Object.assign(window, { WatchlistRow, ListDetail });
