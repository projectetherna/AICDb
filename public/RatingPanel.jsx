// Dreamwall UI kit — rating panel: Visuals / Sound Design / Script → averaged score.
function RatingSlider({ label, icon, value, onChange }) {
  const trackRef = React.useRef(null);
  const [drag, setDrag] = React.useState(false);
  const setFrom = (clientX) => {
    const r = trackRef.current.getBoundingClientRect();
    const v = Math.round(Math.max(0, Math.min(1, (clientX - r.left) / r.width)) * 20) / 2; // 0–10, 0.5 steps
    onChange(v);
  };
  React.useEffect(() => {
    if (!drag) return;
    const move = (e) => setFrom(e.clientX);
    const up = () => setDrag(false);
    window.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
  }, [drag]);
  const pct = (value / 10) * 100;
  return (
    <div style={{ marginBottom:22 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:9, font:'600 14px/1 var(--font-body)', color:'var(--fg-0)' }}>
          <Icon name={icon} size={16} color="var(--fg-1)" />{label}
        </span>
        <span style={{ font:'700 18px/1 var(--font-mono)', color: value ? 'var(--coral)' : 'var(--fg-3)' }}>{value.toFixed(1)}</span>
      </div>
      <div ref={trackRef} onMouseDown={(e) => { e.preventDefault(); setDrag(true); setFrom(e.clientX); }}
        style={{ position:'relative', height:8, borderRadius:'var(--radius-pill)', background:'var(--rating-track)', cursor:'pointer', touchAction:'none', userSelect:'none' }}>
        <div style={{ position:'absolute', inset:0, width:`${pct}%`, borderRadius:'var(--radius-pill)',
          background:'linear-gradient(90deg, var(--coral-dim), var(--coral))' }} />
        <div style={{ position:'absolute', top:'50%', left:`${pct}%`, width:18, height:18, borderRadius:'50%',
          background:'var(--coral)', border:'2px solid var(--bg-1)', boxShadow:'var(--shadow-2)', transform:'translate(-50%,-50%)' }} />
      </div>
    </div>
  );
}

function RatingPanel({ film, onClose, onSubmit }) {
  const [r, setR] = React.useState({ Visuals: 0, 'Sound Design': 0, Script: 0 });
  const vals = Object.values(r);
  const rated = vals.filter(v => v > 0).length;
  const avg = rated ? vals.reduce((a, b) => a + b, 0) / 3 : 0;
  const set = (k) => (v) => setR(s => ({ ...s, [k]: v }));

  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center',
      background:'rgba(5,5,5,0.72)', backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)', padding:24 }}>
      <div style={{ width:'100%', maxWidth:460, background:'var(--bg-1)',
        border:'1px solid var(--border-default)', borderRadius:'var(--radius-xl)', boxShadow:'var(--shadow-3)', overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', padding:'22px 24px 6px' }}>
          <div>
            <h3 style={{ font:'var(--text-h3)', color:'var(--fg-0)' }}>Rate this title</h3>
            <p style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', margin:'4px 0 0' }}>Your three scores average into one.</p>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}>
            <Icon name="x" size={20} color="var(--fg-2)" />
          </button>
        </div>

        <div style={{ padding:'18px 24px 4px' }}>
          <RatingSlider label="Visuals" icon="eye" value={r.Visuals} onChange={set('Visuals')} />
          <RatingSlider label="Sound Design" icon="music-notes" value={r['Sound Design']} onChange={set('Sound Design')} />
          <RatingSlider label="Script" icon="pencil" value={r.Script} onChange={set('Script')} />
        </div>

        {/* AI vs Your score side by side */}
        <div style={{ display:'flex', margin:'4px 24px 0', background:'var(--bg-0)', borderRadius:'var(--radius-lg)', border:'1px solid var(--border-subtle)', overflow:'hidden' }}>
          <div style={{ flex:1, padding:'14px 18px', textAlign:'center' }}>
            <div className="overline" style={{ color:'var(--fg-2)', marginBottom:6 }}>Score</div>
            <div style={{ font:'700 30px/1 var(--font-mono)', color:scoreColor(film.score) }}>{film.score.toFixed(1)}</div>
          </div>
          <div style={{ width:1, background:'var(--border-subtle)' }} />
          <div style={{ flex:1, padding:'14px 18px', textAlign:'center' }}>
            <div className="overline" style={{ color:'var(--coral-bright)', marginBottom:6 }}>Your Score</div>
            <div style={{ font:'700 30px/1 var(--font-mono)', color: avg ? 'var(--coral)' : 'var(--fg-3)' }}>{avg ? avg.toFixed(1) : '—'}</div>
          </div>
        </div>

        <div style={{ padding:'18px 24px 22px' }}>
          <button disabled={!rated} onClick={() => onSubmit(avg)}
            style={{ width:'100%', padding:'13px 16px', borderRadius:'var(--radius-md)', border:'none',
              cursor: rated ? 'pointer' : 'not-allowed', font:'600 15px/1 var(--font-body)',
              background: rated ? 'var(--coral)' : 'var(--bg-3)', color: rated ? 'var(--fg-on-accent)' : 'var(--fg-3)',
              transition:'background var(--dur-fast)' }}>
            {rated ? `Submit score · ${avg.toFixed(1)}` : 'Rate all three to submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { RatingPanel, RatingSlider });