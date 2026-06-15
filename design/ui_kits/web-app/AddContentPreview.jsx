// Dreamwall UI kit — Add Content live preview panel.
// Mirrors the title-page header + content card in real time as the form fills in.

function PreviewPosterPlaceholder({ color }) {
  return (
    <div style={{ position:'absolute', inset:0,
      background:`repeating-linear-gradient(135deg, ${color}22 0 10px, transparent 10px 20px), linear-gradient(150deg, var(--bg-2), var(--bg-3))`,
      display:'flex', alignItems:'center', justifyContent:'center' }}>
      <span style={{ font:'500 10px/1.4 var(--font-mono)', color:'var(--fg-3)', letterSpacing:'0.08em', textAlign:'center' }}>POSTER<br/>2 : 3</span>
    </div>
  );
}

function LivePreview({ form }) {
  const t = window.AICDB_TYPES[form.type] || window.AICDB_TYPES.movie;
  const g0 = '#1a1714';
  const title = form.title.trim() || 'Untitled';
  const year = form.year.trim() || '—';
  const motto = form.motto.trim();
  const heroBg = form.heroImage
    ? `url(${form.heroImage}) center/cover`
    : `linear-gradient(150deg, ${g0}, ${t.color} 180%)`;
  const posterBg = form.poster ? `url(${form.poster}) center/cover` : null;

  return (
    <aside className="ac-preview" style={{ position:'sticky', top:88, alignSelf:'start' }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
        <span style={{ width:7, height:7, borderRadius:'50%', background:'var(--coral)' }} />
        <span className="overline" style={{ color:'var(--fg-1)' }}>Live preview</span>
      </div>

      {/* ---- Title-page header mock ---- */}
      <div style={{ borderRadius:'var(--radius-lg)', overflow:'hidden', background:'var(--bg-1)',
        borderWidth:1, borderStyle:'solid', borderColor:'var(--border-subtle)', boxShadow:'var(--shadow-2)' }}>
        <div style={{ position:'relative', height:158, background: heroBg }}>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(10,10,10,0.18) 0%, rgba(10,10,10,0.55) 55%, rgba(21,21,20,0.96) 100%)' }} />
          {motto && (
            <blockquote style={{ position:'absolute', right:16, left:16, bottom:60, margin:0, textAlign:'right',
              fontFamily:'"Times New Roman", Times, serif', fontStyle:'italic', fontWeight:400, fontSize:16, lineHeight:1.3,
              color:'rgba(245,243,239,0.94)', textShadow:'0 2px 14px rgba(0,0,0,0.75)' }}>
              <span style={{ fontSize:26, lineHeight:0, verticalAlign:'-0.3em', opacity:0.5, marginRight:2 }}>“</span>{motto}
            </blockquote>
          )}
          <div style={{ position:'absolute', left:16, right:16, bottom:14 }}>
            <ContentBadge type={form.type} size="sm" />
            <div style={{ font:'700 21px/1.12 var(--font-display)', color:'var(--fg-0)', letterSpacing:'-0.01em', marginTop:9,
              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{title}</div>
          </div>
        </div>
        <div style={{ padding:'13px 16px', display:'flex', alignItems:'center', gap:9, flexWrap:'wrap',
          font:'var(--text-data-sm)', color:'var(--fg-1)' }}>
          <span>{year}</span>
          <span style={{ color:'var(--fg-3)' }}>·</span>
          {form.type === 'series'
            ? <span style={{ color:'var(--teal-bright)' }}>{form.seasons || '—'} {(form.seasons==='1')?'season':'seasons'} · {form.episodes || '—'} eps</span>
            : <span>{form.duration.trim() || '—'}</span>}
          {form.genres.slice(0, 2).map(gn => (<><span style={{ color:'var(--fg-3)' }}>·</span><span key={gn}>{gn}</span></>))}
        </div>
      </div>

      {/* ---- Content card mock ---- */}
      <div style={{ marginTop:22 }}>
        <div className="overline" style={{ color:'var(--fg-2)', marginBottom:12 }}>Card in the grid</div>
        <div style={{ width:152 }}>
          <div style={{ aspectRatio:'2/3', borderRadius:'var(--radius-lg)', overflow:'hidden', position:'relative',
            boxShadow:'var(--shadow-poster)', background: posterBg || 'transparent' }}>
            {!posterBg && <PreviewPosterPlaceholder color={t.color} />}
            <div style={{ position:'absolute', top:9, left:9 }}><ContentBadge type={form.type} solid size="sm" /></div>
            <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'22px 10px 10px',
              background:'linear-gradient(to top, rgba(0,0,0,0.82), transparent)' }}>
              <span style={{ display:'inline-flex', alignItems:'center', gap:5, font:'600 10px/1 var(--font-mono)',
                letterSpacing:'0.05em', color:'rgba(255,255,255,0.82)', textTransform:'uppercase' }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--fg-2)' }} />Not yet rated
              </span>
            </div>
          </div>
          <div style={{ font:'600 13.5px/1.25 var(--font-body)', color:'var(--fg-0)', marginTop:9,
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{title}</div>
          <div style={{ font:'var(--text-data-sm)', color:'var(--fg-2)', marginTop:3 }}>{year}</div>
        </div>
      </div>

      <p style={{ font:'var(--text-body-sm)', color:'var(--fg-3)', margin:'22px 0 0', maxWidth:300 }}>
        This is how your title will appear across Dreamwall. Posters use a 2:3 ratio; the hero photo runs full-bleed behind the motto.
      </p>
    </aside>
  );
}

Object.assign(window, { LivePreview, PreviewPosterPlaceholder });
