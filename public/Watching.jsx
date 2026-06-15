// Dreamwall UI kit — Watching page (mock player) opened from the detail page's Watch button.
function Watching({ film, onBack }) {
  const d = window.AICDB_DETAILS[film.id] || {};
  const isSeries = film.type === 'series';
  const [playing, setPlaying] = React.useState(true);
  const [progress, setProgress] = React.useState(0.18);
  const [ep, setEp] = React.useState(1);
  const episodes = isSeries ? Array.from({ length: Math.min(d.episodes || 8, 8) }, (_, i) => i + 1) : [];

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-inset)' }}>
      {/* top bar */}
      <div style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 28px', borderBottom:'1px solid var(--border-subtle)' }}>
        <button onClick={onBack} style={{ display:'inline-flex', alignItems:'center', gap:6, background:'var(--bg-2)',
          border:'1px solid var(--border-default)', borderRadius:'var(--radius-pill)', padding:'8px 14px',
          cursor:'pointer', color:'var(--fg-0)', font:'500 13px/1 var(--font-body)' }}>
          <Icon name="chevron-left" size={16} /> Back to title
        </button>
        <div style={{ font:'600 14px/1 var(--font-body)', color:'var(--fg-1)' }}>
          Now watching · <span style={{ color:'var(--fg-0)' }}>{film.title}</span>{isSeries ? ` · S1·E${ep}` : ''}
        </div>
      </div>

      <div style={{ maxWidth:1180, margin:'0 auto', padding:'28px' }}>
        {/* player */}
        <div style={{ position:'relative', aspectRatio:'16/9', borderRadius:'var(--radius-xl)', overflow:'hidden',
          background:`linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 170%)`, boxShadow:'var(--shadow-3)' }}>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(60% 60% at 50% 45%, transparent, rgba(0,0,0,0.55))' }} />
          {/* center play/pause */}
          <button onClick={() => setPlaying(p => !p)} style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
            width:78, height:78, borderRadius:'50%', cursor:'pointer', border:'1px solid rgba(255,255,255,0.4)',
            background:'rgba(10,10,10,0.4)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon name={playing ? 'pause' : 'play'} size={32} color="#fff" weight="fill" />
          </button>
          {/* controls */}
          <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'40px 24px 18px',
            background:'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}>
            <div onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setProgress(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))); }}
              style={{ position:'relative', height:6, borderRadius:'var(--radius-pill)', background:'rgba(255,255,255,0.25)', cursor:'pointer', marginBottom:14 }}>
              <div style={{ position:'absolute', inset:0, width:`${progress*100}%`, borderRadius:'var(--radius-pill)', background:'var(--coral)' }} />
              <div style={{ position:'absolute', top:'50%', left:`${progress*100}%`, width:14, height:14, borderRadius:'50%', background:'var(--coral)', transform:'translate(-50%,-50%)' }} />
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:18 }}>
              <Icon name={playing ? 'pause' : 'play'} size={20} color="#fff" weight="fill" style={{ cursor:'pointer' }} />
              <Icon name="speaker-high" size={20} color="rgba(255,255,255,0.85)" />
              <span style={{ font:'500 12px/1 var(--font-mono)', color:'rgba(255,255,255,0.85)' }}>
                {fmtTime(progress, film)} / {totalTime(film)}
              </span>
              <div style={{ flex:1 }} />
              <Icon name="gear" size={20} color="rgba(255,255,255,0.85)" />
              <Icon name="corners-out" size={20} color="rgba(255,255,255,0.85)" />
            </div>
          </div>
        </div>

        {/* title row */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:24, marginTop:24 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <ContentBadge type={film.type} />
              {isSeries && <span style={{ font:'var(--text-data-sm)', color:'var(--fg-1)' }}>Season 1 · Episode {ep}</span>}
            </div>
            <h1 style={{ font:'var(--text-h2)', color:'var(--fg-0)' }}>{film.title}</h1>
            <p style={{ font:'var(--text-body)', color:'var(--fg-1)', maxWidth:620, marginTop:10 }}>{film.synopsis}</p>
          </div>
          <div style={{ flex:'none', textAlign:'center', padding:'14px 20px', background:'var(--bg-1)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)' }}>
            <div style={{ font:'700 30px/1 var(--font-mono)', color:scoreColor(film.score) }}>{film.score.toFixed(1)}</div>
            <div className="overline" style={{ color:'var(--fg-2)', marginTop:6 }}>Score</div>
          </div>
        </div>

        {/* episodes */}
        {isSeries && (
          <section style={{ marginTop:36 }}>
            <h3 style={{ font:'var(--text-h3)', color:'var(--fg-0)', marginBottom:16 }}>Episodes</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:14 }}>
              {episodes.map(n => (
                <div key={n} onClick={() => setEp(n)} style={{ display:'flex', gap:12, padding:10, cursor:'pointer',
                  borderRadius:'var(--radius-lg)', background: n===ep ? 'var(--bg-2)' : 'var(--bg-1)',
                  border:'1px solid ' + (n===ep ? 'var(--border-accent)' : 'var(--border-subtle)') }}>
                  <div style={{ width:72, height:44, flex:'none', borderRadius:6, position:'relative', overflow:'hidden',
                    background:`linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 160%)` }}>
                    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Icon name="play" size={16} color="rgba(255,255,255,0.9)" weight="fill" />
                    </div>
                  </div>
                  <div style={{ minWidth:0 }}>
                    <div style={{ font:'600 13px/1.2 var(--font-body)', color:'var(--fg-0)' }}>Episode {n}</div>
                    <div style={{ font:'var(--text-data-sm)', color:'var(--fg-2)', marginTop:4 }}>{38 + n*2}m</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function totalTime(film) {
  if (film.type === 'series') return '44:00';
  const m = parseInt(String(film.runtime).replace(/[^0-9]/g, ''), 10) || 100;
  return `${Math.floor(m/60)}:${String(m%60).padStart(2,'0')}:00`.replace(/^0:/, '');
}
function fmtTime(progress, film) {
  const m = film.type === 'series' ? 44 : (parseInt(String(film.runtime).replace(/[^0-9]/g, ''), 10) || 100);
  const cur = Math.round(m * 60 * progress);
  const hh = Math.floor(cur/3600), mm = Math.floor((cur%3600)/60), ss = cur%60;
  return (hh ? hh+':' : '') + String(mm).padStart(hh?2:1,'0') + ':' + String(ss).padStart(2,'0');
}

Object.assign(window, { Watching });