// Dreamwall UI kit — Creator Studio management panel (creator-only).
// Add New Content button + Published / Drafts tabs with per-item actions.

function StudioTab({ label, count, active, onClick }) {
  return (
    <button onClick={onClick} style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'9px 4px', cursor:'pointer',
      background:'none', border:'none', font:'600 15px/1 var(--font-body)', color: active ? 'var(--fg-0)' : 'var(--fg-2)',
      borderBottomWidth:2, borderBottomStyle:'solid', borderBottomColor: active ? 'var(--coral)' : 'transparent',
      paddingBottom:12, transition:'color var(--dur-fast)' }}>
      {label}
      <span style={{ font:'600 11px/1 var(--font-mono)', padding:'3px 7px', borderRadius:'var(--radius-pill)',
        background: active ? 'var(--coral-ghost)' : 'var(--bg-3)', color: active ? 'var(--coral-bright)' : 'var(--fg-2)' }}>{count}</span>
    </button>
  );
}

function PosterThumb({ film }) {
  return (
    <div style={{ width:44, height:64, flex:'none', borderRadius:6, overflow:'hidden', boxShadow:'var(--shadow-1)',
      background: film ? `linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 160%)` : 'var(--bg-3)',
      display:'flex', alignItems:'center', justifyContent:'center' }}>
      {!film && <Icon name="image" size={16} color="var(--fg-3)" />}
    </div>
  );
}

function StudioBtn({ icon, children, danger, onClick }) {
  const [h, setH] = React.useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 13px', borderRadius:'var(--radius-md)', cursor:'pointer',
        font:'600 12.5px/1 var(--font-body)', transition:'all var(--dur-fast)',
        borderWidth:1, borderStyle:'solid',
        borderColor: danger ? (h ? 'rgba(229,72,77,0.55)' : 'var(--border-subtle)') : (h ? 'var(--border-strong)' : 'var(--border-subtle)'),
        background: h ? (danger ? 'rgba(229,72,77,0.1)' : 'var(--bg-2)') : 'transparent',
        color: danger ? 'var(--score-low)' : 'var(--fg-0)' }}>
      <Icon name={icon} size={14} color={danger ? 'var(--score-low)' : 'var(--fg-1)'} />{children}
    </button>
  );
}

function PublishedRow({ film, stat }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 18px', borderRadius:'var(--radius-md)',
      background:'var(--bg-0)', borderWidth:1, borderStyle:'solid', borderColor:'var(--border-subtle)' }}>
      <PosterThumb film={film} />
      <div style={{ flex:'1 1 200px', minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <span style={{ font:'600 15px/1.2 var(--font-body)', color:'var(--fg-0)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{film.title}</span>
          <ContentBadge type={film.type} size="sm" />
        </div>
        <div style={{ font:'var(--text-data-sm)', color:'var(--fg-2)', marginTop:5 }}>{film.year} · Published</div>
      </div>
      <div style={{ display:'flex', gap:30, flex:'none' }}>
        <StudioMetric icon="eye"  value={fmtCount(stat.watched)} label="Views" />
        <StudioMetric icon="star" value={fmtCount(stat.rated)}   label="Ratings" />
        <StudioMetric value={film.score.toFixed(1)} label="Score" score={film.score} />
      </div>
      <StudioBtn icon="pencil">Edit</StudioBtn>
    </div>
  );
}

function StudioMetric({ icon, value, label, score }) {
  return (
    <div style={{ textAlign:'right', minWidth:58 }}>
      <div style={{ font:'700 17px/1 var(--font-mono)', color: score != null ? scoreColor(score) : 'var(--fg-0)' }}>{value}</div>
      <div className="overline" style={{ color:'var(--fg-2)', marginTop:5 }}>{label}</div>
    </div>
  );
}

function DraftRow({ draft }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 18px', borderRadius:'var(--radius-md)',
      background:'var(--bg-0)', borderWidth:1, borderStyle:'solid', borderColor:'var(--border-subtle)' }}>
      <PosterThumb film={null} />
      <div style={{ flex:'1 1 220px', minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <span style={{ font:'600 15px/1.2 var(--font-body)', color:'var(--fg-0)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{draft.title}</span>
          <span style={{ font:'600 10px/1 var(--font-body)', letterSpacing:'0.05em', textTransform:'uppercase', color:'var(--type-short)',
            background:'rgba(229,178,59,0.16)', padding:'4px 8px', borderRadius:'var(--radius-pill)' }}>Draft</span>
        </div>
        <div style={{ font:'var(--text-data-sm)', color:'var(--fg-2)', marginTop:5 }}>Edited {draft.edited}</div>
      </div>
      {/* completion */}
      <div style={{ flex:'none', width:150 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:7 }}>
          <span className="overline" style={{ color:'var(--fg-2)' }}>Complete</span>
          <span style={{ font:'700 12px/1 var(--font-mono)', color:'var(--fg-1)' }}>{draft.pct}%</span>
        </div>
        <div style={{ height:6, borderRadius:'var(--radius-pill)', background:'var(--rating-track)', overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${draft.pct}%`, borderRadius:'var(--radius-pill)',
            background: draft.pct >= 66 ? 'var(--teal)' : draft.pct >= 33 ? 'var(--type-short)' : 'var(--coral)' }} />
        </div>
      </div>
      <div style={{ display:'flex', gap:8, flex:'none' }}>
        <StudioBtn icon="pencil">Edit</StudioBtn>
        <StudioBtn icon="trash" danger>Delete</StudioBtn>
      </div>
    </div>
  );
}

function ManagePanel({ published, drafts }) {
  const [tab, setTab] = React.useState('Published');
  return (
    <section style={{ marginBottom:64, padding:'26px 28px', borderRadius:'var(--radius-xl)',
      background:'linear-gradient(180deg, rgba(216,90,48,0.05), transparent 40%), var(--bg-1)',
      borderWidth:1, borderStyle:'solid', borderColor:'var(--border-default)' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:20, flexWrap:'wrap', marginBottom:6 }}>
        <div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:9, marginBottom:7 }}>
            <Icon name="sliders" size={18} color="var(--coral)" />
            <h2 style={{ font:'var(--text-h3)', color:'var(--fg-0)' }}>Creator Studio</h2>
            <span style={{ font:'600 10px/1 var(--font-body)', letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--fg-2)',
              background:'var(--bg-3)', padding:'4px 8px', borderRadius:'var(--radius-pill)' }}>Only you</span>
          </div>
          <p style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', margin:0 }}>Manage everything you've made and what's still cooking.</p>
        </div>
        <a href="add-content.html" style={{ display:'inline-flex', alignItems:'center', gap:9, padding:'13px 22px', borderRadius:'var(--radius-md)',
          background:'var(--coral)', color:'var(--fg-on-accent)', font:'600 14px/1 var(--font-body)', textDecoration:'none', boxShadow:'var(--shadow-1)' }}
          onMouseEnter={e=>e.currentTarget.style.background='var(--coral-bright)'} onMouseLeave={e=>e.currentTarget.style.background='var(--coral)'}>
          <Icon name="plus" size={16} color="var(--fg-on-accent)" weight="bold" /> Add New Content
        </a>
      </div>

      <div style={{ display:'flex', gap:26, marginTop:20, marginBottom:20,
        borderBottomWidth:1, borderBottomStyle:'solid', borderBottomColor:'var(--border-subtle)' }}>
        <StudioTab label="Published" count={published.length} active={tab==='Published'} onClick={() => setTab('Published')} />
        <StudioTab label="Drafts" count={drafts.length} active={tab==='Drafts'} onClick={() => setTab('Drafts')} />
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {tab === 'Published'
          ? published.map(p => <PublishedRow key={p.film.id} film={p.film} stat={p.stat} />)
          : drafts.map((d, i) => <DraftRow key={i} draft={d} />)}
      </div>
    </section>
  );
}

Object.assign(window, { ManagePanel, PublishedRow, DraftRow, StudioTab, StudioBtn, StudioMetric, PosterThumb });
