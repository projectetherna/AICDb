// Dreamwall — Rating panel: Visuals / Sound Design / Script / Consistency
// Main score (displayed) = avg(Visuals, Sound Design, Script) only.
// Consistency is a separate metric and is NOT included in the main score.
// Submit wires to a Supabase upsert on public.ratings.

function RatingSlider({ label, icon, value, onChange, accent }) {
  const trackRef = React.useRef(null);
  const [drag, setDrag] = React.useState(false);
  const setFrom = (clientX) => {
    const r = trackRef.current.getBoundingClientRect();
    const v = Math.round(Math.max(0, Math.min(1, (clientX - r.left) / r.width)) * 10) / 2; // 0–5, 0.5 steps
    onChange(v);
  };
  React.useEffect(() => {
    if (!drag) return;
    const move = (e) => setFrom(e.clientX);
    const up   = () => setDrag(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
  }, [drag]);
  const pct = (value / 5) * 100;
  const color = accent || 'var(--coral)';
  const dimColor = accent ? 'rgba(111,156,235,0.45)' : 'var(--coral-dim)';
  return (
    <div style={{ marginBottom:22 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:9, font:'600 14px/1 var(--font-body)', color:'var(--fg-0)' }}>
          <Icon name={icon} size={16} color="var(--fg-1)" />{label}
        </span>
        <span style={{ font:'700 18px/1 var(--font-mono)', color: value ? color : 'var(--fg-3)' }}>{value.toFixed(1)}</span>
      </div>
      <div ref={trackRef} onMouseDown={(e) => { e.preventDefault(); setDrag(true); setFrom(e.clientX); }}
        style={{ position:'relative', height:8, borderRadius:'var(--radius-pill)', background:'var(--rating-track)',
          cursor:'pointer', touchAction:'none', userSelect:'none' }}>
        <div style={{ position:'absolute', inset:0, width:`${pct}%`, borderRadius:'var(--radius-pill)',
          background:`linear-gradient(90deg, ${dimColor}, ${color})` }} />
        <div style={{ position:'absolute', top:'50%', left:`${pct}%`, width:18, height:18, borderRadius:'50%',
          background:color, border:'2px solid var(--bg-1)', boxShadow:'var(--shadow-2)', transform:'translate(-50%,-50%)' }} />
      </div>
    </div>
  );
}

function RatingPanel({ film, onClose, onSubmit }) {
  const [r, setR] = React.useState({ Visuals: 0, 'Sound Design': 0, Script: 0 });
  const [loading,    setLoading]   = React.useState(true);   // loading prior rating
  const [saving,     setSaving]    = React.useState(false);
  const [saveError,  setSaveError] = React.useState(null);
  const [isUpdate,   setIsUpdate]  = React.useState(false);  // true if a prior rating exists
  // existingRowId is kept in a ref — never needs to trigger a re-render, just
  // needs to be readable at submit time.
  const existingRowId = React.useRef(null);

  const set = (k) => (v) => setR(s => ({ ...s, [k]: v }));

  // Main score = avg of the 3 quality dimensions ONLY (not Consistency)
  const qualityVals = [r.Visuals, r['Sound Design'], r.Script];
  const qualityRated = qualityVals.filter(v => v > 0).length;
  const allQualitySet = qualityRated === 3;
  const avg = allQualitySet
    ? (r.Visuals + r['Sound Design'] + r.Script) / 3
    : (qualityRated > 0 ? qualityVals.reduce((a, b) => a + b, 0) / 3 : 0);

  // Load any existing rating for this user+content on open.
  // We fetch the row id too so the UPDATE path can target it precisely.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const sb      = await window.AICDB_AUTH.getClient();
        const session = await window.AICDB_AUTH.getSession();
        if (!session || cancelled) { setLoading(false); return; }
        const { data, error } = await sb
          .from('ratings')
          .select('id, visuals, sound_design, script, consistency')
          .eq('user_id',    session.user.id)
          .eq('content_id', film.id)
          .is('episode_id', null)
          .maybeSingle();
        if (cancelled) return;
        if (error) console.warn('[RatingPanel] load error:', error.message);
        if (data) {
          existingRowId.current = data.id;
          setIsUpdate(true);
          setR({
            Visuals:        data.visuals      ?? 0,
            'Sound Design': data.sound_design ?? 0,
            Script:         data.script       ?? 0,
          });
        }
      } catch (e) {
        if (!cancelled) console.warn('[RatingPanel] load failed:', e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [film.id]);

  const handleSubmit = async () => {
    if (!allQualitySet || saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      const sb      = await window.AICDB_AUTH.getClient();
      const session = await window.AICDB_AUTH.getSession();
      if (!session) throw new Error('Not signed in');

      const qualityPayload = {
        visuals:      r.Visuals,
        sound_design: r['Sound Design'],
        script:       r.Script,
        // originality is intentionally absent — never touched here so any
        // existing value set via ExtraordinaryMeter is preserved.
      };

      let error;
      if (existingRowId.current) {
        // UPDATE the existing row by id — no conflict resolution needed,
        // no partial-index ambiguity. RLS enforces owner-only writes.
        ({ error } = await sb
          .from('ratings')
          .update(qualityPayload)
          .eq('id', existingRowId.current));
      } else {
        // INSERT a fresh row. episode_id defaults to NULL (not in payload).
        ({ error } = await sb
          .from('ratings')
          .insert({
            user_id:    session.user.id,
            content_id: film.id,
            ...qualityPayload,
          }));
        // If insert succeeded, mark as update for any subsequent re-submit
        // within the same panel session by re-loading the row id.
        if (!error) {
          const { data: newRow } = await sb
            .from('ratings')
            .select('id')
            .eq('user_id',    session.user.id)
            .eq('content_id', film.id)
            .is('episode_id', null)
            .maybeSingle();
          if (newRow) { existingRowId.current = newRow.id; setIsUpdate(true); }
        }
      }

      if (error) throw error;
      onSubmit && onSubmit(avg);
    } catch (e) {
      setSaveError(e.message || 'Could not save rating.');
    } finally {
      setSaving(false);
    }
  };

  const canSubmit = allQualitySet && !saving && !loading;

  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center',
      background:'rgba(5,5,5,0.72)', backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)', padding:24 }}>
      <div style={{ width:'100%', maxWidth:460, background:'var(--bg-1)',
        border:'1px solid var(--border-default)', borderRadius:'var(--radius-xl)',
        boxShadow:'var(--shadow-3)', overflow:'hidden' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', padding:'22px 24px 6px' }}>
          <div>
            <h3 style={{ font:'var(--text-h3)', color:'var(--fg-0)', margin:0 }}>
              {loading ? 'Loading…' : isUpdate ? 'Update your rating' : 'Rate this title'}
            </h3>
            <p style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', margin:'5px 0 0' }}>
              Visuals · Sound · Script average into one score.
            </p>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', padding:4, marginTop:2 }}>
            <Icon name="x" size={20} color="var(--fg-2)" />
          </button>
        </div>

        {loading ? (
          <div style={{ padding:'32px 24px', textAlign:'center' }}>
            <div className="aicdb-skel" style={{ height:14, borderRadius:4, marginBottom:12 }} />
            <div className="aicdb-skel" style={{ height:14, borderRadius:4, marginBottom:12 }} />
            <div className="aicdb-skel" style={{ height:14, borderRadius:4 }} />
          </div>
        ) : (
          <>
            {/* Quality dimensions — these 3 form the main score */}
            <div style={{ padding:'18px 24px 0' }}>
              <RatingSlider label="Visuals"      icon="eye"         value={r.Visuals}         onChange={set('Visuals')} />
              <RatingSlider label="Sound Design" icon="music-notes" value={r['Sound Design']} onChange={set('Sound Design')} />
              <RatingSlider label="Script"       icon="pencil"      value={r.Script}          onChange={set('Script')} />
            </div>

            {/* Score preview: community vs your main score */}
            <div style={{ display:'flex', margin:'4px 24px 0', background:'var(--bg-0)',
              borderRadius:'var(--radius-lg)', border:'1px solid var(--border-subtle)', overflow:'hidden' }}>
              <div style={{ flex:1, padding:'14px 18px', textAlign:'center' }}>
                <div className="overline" style={{ color:'var(--fg-2)', marginBottom:6 }}>Score</div>
                <div style={{ font:'700 30px/1 var(--font-mono)', color:scoreColor(film.score) }}>
                  {film.score ? film.score.toFixed(1) : '—'}
                </div>
              </div>
              <div style={{ width:1, background:'var(--border-subtle)' }} />
              <div style={{ flex:1, padding:'14px 18px', textAlign:'center' }}>
                <div className="overline" style={{ color:'var(--coral-bright)', marginBottom:6 }}>Your Score</div>
                <div style={{ font:'700 30px/1 var(--font-mono)', color: avg ? 'var(--coral)' : 'var(--fg-3)' }}>
                  {avg ? avg.toFixed(1) : '—'}
                </div>
                {r.Consistency > 0 && (
                  <div style={{ font:'500 10px/1 var(--font-body)', color:'var(--info, #6f9ceb)',
                    marginTop:5, letterSpacing:'0.04em' }}>
                    +{r.Consistency.toFixed(1)} consistency
                  </div>
                )}
              </div>
            </div>

            {/* Error */}
            {saveError && (
              <div style={{ margin:'10px 24px 0', padding:'10px 14px', borderRadius:'var(--radius-md)',
                background:'rgba(216,90,48,0.1)', border:'1px solid rgba(216,90,48,0.3)',
                font:'var(--text-body-sm)', color:'var(--score-low)' }}>
                {saveError}
              </div>
            )}

            {/* Submit */}
            <div style={{ padding:'16px 24px 22px' }}>
              <button disabled={!canSubmit} onClick={handleSubmit}
                style={{ width:'100%', padding:'13px 16px', borderRadius:'var(--radius-md)', border:'none',
                  cursor: canSubmit ? 'pointer' : 'not-allowed', font:'600 15px/1 var(--font-body)',
                  background: canSubmit ? 'var(--coral)' : 'var(--bg-3)',
                  color:      canSubmit ? 'var(--fg-on-accent)' : 'var(--fg-3)',
                  transition:'background var(--dur-fast)' }}>
                {saving
                  ? 'Saving…'
                  : !allQualitySet
                  ? 'Rate Visuals, Sound & Script to submit'
                  : isUpdate
                  ? `Update score · ${avg.toFixed(1)}`
                  : `Submit score · ${avg.toFixed(1)}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { RatingPanel, RatingSlider });
