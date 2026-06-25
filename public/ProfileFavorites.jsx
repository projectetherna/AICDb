// Dreamwall — profile favorites and last-rated section

const FAVORITE_SLOT_COUNT = 5;

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

function LastRated({ onOpen, onSeeAll, isOwnProfile = true, profileUserId, onFavoriteCount }) {
  const byId = filmsById();
  const rated = LAST_RATED.map(r => ({ ...r, film: byId[r.id] })).filter(r => r.film).slice(0, 5);
  const [favorites, setFavorites] = React.useState([]);
  const [pickerSlot, setPickerSlot] = React.useState(null);
  const [pickerSearch, setPickerSearch] = React.useState('');

  const reloadFavorites = React.useCallback(async () => {
    if (!profileUserId || !window.AICDB_PROFILE_FAVORITES) {
      setFavorites([]);
      onFavoriteCount && onFavoriteCount(0);
      return;
    }
    const rows = await window.AICDB_PROFILE_FAVORITES.load(profileUserId);
    setFavorites(rows);
    onFavoriteCount && onFavoriteCount(rows.length);
  }, [profileUserId, onFavoriteCount]);

  React.useEffect(() => { reloadFavorites(); }, [reloadFavorites]);

  const favoriteSlots = React.useMemo(() => {
    const byPos = {};
    favorites.forEach(row => { byPos[row.position] = row.content_id; });
    return Array.from({ length: FAVORITE_SLOT_COUNT }, (_, i) => {
      const position = i + 1;
      const contentId = byPos[position] || null;
      return { position, contentId, film: contentId ? byId[contentId] : null };
    });
  }, [favorites, byId]);

  const filledCount = favorites.length;

  const pickedContentIds = React.useMemo(
    () => new Set(favoriteSlots.map(s => s.contentId).filter(Boolean)),
    [favoriteSlots]
  );

  const pickerResults = React.useMemo(() => {
    const q = pickerSearch.trim().toLowerCase();
    if (!q) return [];
    return window.AICDB_FILMS.filter(f =>
      !pickedContentIds.has(f.id) && String(f.title || '').toLowerCase().includes(q)
    );
  }, [pickerSearch, pickedContentIds]);

  const handleRemoveFavorite = async (position) => {
    await window.AICDB_PROFILE_FAVORITES.remove(position);
    reloadFavorites();
  };

  const handlePickFilm = async (film) => {
    if (pickerSlot == null) return;
    await window.AICDB_PROFILE_FAVORITES.add(film.id, pickerSlot);
    setPickerSlot(null);
    setPickerSearch('');
    reloadFavorites();
  };

  const closePicker = () => {
    setPickerSlot(null);
    setPickerSearch('');
  };

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
            {isOwnProfile && (
            <button onClick={() => onSeeAll && onSeeAll()}
              style={{ display:'inline-flex', alignItems:'center', gap:6, marginTop:14, padding:'8px 14px', cursor:'pointer',
                borderRadius:'var(--radius-pill)', background:'var(--bg-2)', border:'1px solid var(--border-default)',
                color:'var(--fg-1)', font:'600 12.5px/1 var(--font-body)', transition:'all var(--dur-fast)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.color = 'var(--coral)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--fg-1)'; }}>
              See all ratings <Icon name="arrow-right" size={13} color="currentColor" />
            </button>
            )}
          </>
        ) : (
          <EmptyState icon="star" accent="var(--coral)" compact
            title="You haven't rated anything yet"
            sub="Score a few titles and they'll show up here — your taste, on the record."
            actionLabel="Browse the catalog" onAction={() => onOpen && onOpen(null)} />
        )}
      </div>

      {/* RIGHT — Favorites, five fixed slots */}
      <div>
        <h3 style={{ font:'var(--text-h3)', color:'var(--fg-0)', marginBottom:6 }}>Favorites</h3>
        {isOwnProfile && (
          <p style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', margin:'0 0 16px' }}>The five you'd save from the fire</p>
        )}
        <div style={{ display:'flex', gap:16, overflowX:'auto', paddingBottom:8, scrollbarWidth:'thin' }}>
          {favoriteSlots.map(slot => (
            slot.film ? (
              <div key={slot.position} style={{ width:128, flex:'none', position:'relative' }}>
                <FilmCard film={slot.film} width="auto" onOpen={onOpen || (()=>{})} />
                {isOwnProfile && (
                  <button type="button" aria-label="Remove from favorites"
                    onClick={(e) => { e.stopPropagation(); handleRemoveFavorite(slot.position); }}
                    style={{ position:'absolute', top:4, right:4, width:22, height:22, borderRadius:999,
                      background:'rgba(0,0,0,0.6)', border:'none', cursor:'pointer',
                      display:'flex', alignItems:'center', justifyContent:'center', padding:0 }}>
                    <Icon name="x" size={12} color="#fff" />
                  </button>
                )}
              </div>
            ) : (
              <div key={slot.position}
                onClick={() => isOwnProfile && setPickerSlot(slot.position)}
                style={{ width:128, flex:'none', aspectRatio:'2/3', borderRadius:'var(--radius-lg)',
                  border:'1px dashed var(--border-default)', background:'var(--bg-1)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  cursor: isOwnProfile ? 'pointer' : 'default' }}>
                {isOwnProfile
                  ? <Icon name="plus" size={20} color="var(--fg-3)" />
                  : <Icon name="heart" size={22} color="var(--fg-3)" />}
              </div>
            )
          ))}
        </div>
        {!filledCount && (
          <p style={{ font:'var(--text-body-sm)', color:'var(--fg-3)', margin:'12px 0 0' }}>
            {isOwnProfile
              ? "Mark the titles you love and the five you'd save from the fire will live here."
              : 'No favorites picked yet.'}
          </p>
        )}
      </div>

      {pickerSlot != null && (
        <div style={{ position:'fixed', inset:0, zIndex:300, background:'rgba(0,0,0,0.7)',
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'var(--bg-1)', borderRadius:'var(--radius-lg)', padding:24,
            width:480, maxWidth:'90vw', maxHeight:'70vh', display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
              <span style={{ font:'600 16px/1 var(--font-body)', color:'var(--fg-0)' }}>Add to Favorites</span>
              <button type="button" onClick={closePicker} aria-label="Close"
                style={{ display:'flex', padding:8, borderRadius:'50%', cursor:'pointer',
                  background:'var(--bg-2)', border:'1px solid var(--border-default)' }}>
                <Icon name="x" size={15} color="var(--fg-1)" />
              </button>
            </div>
            <input type="text" placeholder="Search titles..." value={pickerSearch}
              onChange={e => setPickerSearch(e.target.value)}
              style={{ background:'var(--bg-0)', border:'1px solid var(--border-subtle)',
                borderRadius:'var(--radius-md)', padding:'10px 14px', font:'var(--text-body)',
                color:'var(--fg-0)', width:'100%', outline:'none', boxSizing:'border-box' }} />
            <div style={{ overflowY:'auto', flex:1, minHeight:0 }}>
              {pickerSearch.trim() && !pickerResults.length ? (
                <p style={{ color:'var(--fg-3)', textAlign:'center', padding:20, margin:0 }}>No titles found</p>
              ) : (
                pickerResults.map(film => (
                  <div key={film.id} onClick={() => handlePickFilm(film)}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px',
                      cursor:'pointer', borderRadius:'var(--radius-md)' }}>
                    <div style={{ width:36, flex:'none', aspectRatio:'2/3', borderRadius:'var(--radius-sm)',
                      background:`linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 150%)` }} />
                    <span style={{ font:'500 14px/1.3 var(--font-body)', color:'var(--fg-0)' }}>{film.title}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

Object.assign(window, { LastRatedRow, LastRated });

