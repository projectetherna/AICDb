// Dreamwall — full ratings history page

// Returns only the titles the user has actually rated (currently none until real rating data is wired).
function allRatedEntries() {
  const byId = filmsById();
  return LAST_RATED.map(r => ({ ...r, film: byId[r.id] })).filter(r => r.film)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
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
        <p style={{ font:'var(--text-body)', color:'var(--fg-2)' }}>{rows.length} {rows.length === 1 ? 'title' : 'titles'} you've scored</p>
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

Object.assign(window, { AllRatingsPage });
