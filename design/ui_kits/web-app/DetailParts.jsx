// Dreamwall UI kit — detail-page building blocks
// DualScore, WatchlistSplit, ShareButton, ExtraordinaryMeter,
// CreditsSection, StatsSection, ProductionSection, AddReviewBox.

// ---- aggregate score + personal score, side by side, different colors ----
function DualScore({ film, userScore }) {
  return (
    <div style={{ display:'flex', alignItems:'stretch', gap:0, background:'var(--bg-1)',
      border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)', overflow:'hidden' }}>
      <div style={{ flex:1, padding:'18px 24px', textAlign:'center' }}>
        <div className="overline" style={{ color:'var(--fg-2)', marginBottom:8 }}>Score</div>
        <div style={{ font:'700 44px/1 var(--font-mono)', color:scoreColor(film.score), letterSpacing:'-0.02em' }}>{film.score.toFixed(1)}</div>
      </div>
      <div style={{ width:1, background:'var(--border-subtle)' }} />
      <div style={{ flex:1, padding:'18px 24px', textAlign:'center' }}>
        <div className="overline" style={{ color:'var(--coral-bright)', marginBottom:8 }}>Your Score</div>
        <div style={{ font:'700 44px/1 var(--font-mono)', color: userScore ? 'var(--coral)' : 'var(--fg-3)', letterSpacing:'-0.02em' }}>
          {userScore ? userScore.toFixed(1) : '—'}
        </div>
      </div>
    </div>
  );
}

// ---- Joined watchlist button: main toggle + grey "+" dropdown ----
function WatchlistSplit({ film }) {
  const ids = useWatchlist();
  const inList = ids.includes(film.id);
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const [lists, setLists] = React.useState({ 'Favorites': false, 'Watch Later': false, 'Best of 2025': false });
  React.useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  const toggleList = (name) => setLists(s => ({ ...s, [name]: !s[name] }));

  return (
    <div ref={ref} style={{ position:'relative' }}>
      <div style={{ display:'flex', borderRadius:'var(--radius-md)', overflow:'hidden', boxShadow:'var(--shadow-1)' }}>
        <button onClick={() => { if (!window.AICDB_REQUIRE_AUTH('Sign in to build your watchlist.')) return; window.AICDB_WATCHLIST.toggle(film.id); }}
          style={{ flex:1, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8,
            padding:'12px 14px', border:'none', cursor:'pointer', font:'600 14px/1 var(--font-body)',
            background: inList ? 'var(--teal)' : 'var(--teal-ghost)', color: inList ? '#04201e' : 'var(--teal-bright)',
            transition:'background var(--dur-fast)' }}>
          <Icon name={inList ? 'check' : 'plus'} size={16} color={inList ? '#04201e' : 'var(--teal-bright)'} />
          {inList ? 'On your watchlist' : 'Add to watchlist'}
        </button>
        <button onClick={() => setOpen(o => !o)} title="Add to a list"
          style={{ width:'20%', minWidth:48, display:'flex', alignItems:'center', justifyContent:'center',
            border:'none', borderLeft:'1px solid rgba(0,0,0,0.35)', cursor:'pointer',
            background:'var(--bg-3)', color:'var(--fg-0)', transition:'background var(--dur-fast)' }}
          onMouseEnter={e=>e.currentTarget.style.background='#33322f'}
          onMouseLeave={e=>e.currentTarget.style.background='var(--bg-3)'}>
          <Icon name="plus" size={16} color="var(--fg-0)" weight="bold" />
        </button>
      </div>
      {open && (
        <div style={{ position:'absolute', top:'calc(100% + 8px)', left:0, right:0, zIndex:70, padding:6,
          background:'var(--bg-1)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-lg)',
          boxShadow:'var(--shadow-3)' }}>
          <div className="overline" style={{ padding:'6px 10px 8px', color:'var(--fg-2)' }}>Add to list</div>
          <ListRow name="Watchlist" checked={inList} onClick={() => { if (!window.AICDB_REQUIRE_AUTH('Sign in to build your watchlist.')) return; window.AICDB_WATCHLIST.toggle(film.id); }} />
          {Object.keys(lists).map(n => <ListRow key={n} name={n} checked={lists[n]} onClick={() => toggleList(n)} />)}
          <div style={{ height:1, background:'var(--border-subtle)', margin:'6px 4px' }} />
          <ListRow name="Create new list…" plus onClick={() => {}} />
        </div>
      )}
    </div>
  );
}

function ListRow({ name, checked, onClick, plus }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px', cursor:'pointer',
        borderRadius:'var(--radius-md)', background: hover ? 'var(--bg-2)' : 'transparent',
        font:'500 13.5px/1 var(--font-body)', color: plus ? 'var(--teal-bright)' : 'var(--fg-0)' }}>
      <Icon name={plus ? 'plus' : (checked ? 'check' : 'bookmark')} size={15}
        color={plus ? 'var(--teal-bright)' : (checked ? 'var(--teal)' : 'var(--fg-2)')}
        fill={checked && !plus ? 'var(--teal)' : 'none'} />
      {name}
    </div>
  );
}

// ---- Share button — copies the page link ----
function ShareButton() {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    const url = window.location.href;
    const done = () => { setCopied(true); setTimeout(() => setCopied(false), 1800); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(done);
    } else {
      const ta = document.createElement('textarea'); ta.value = url; document.body.appendChild(ta);
      ta.select(); try { document.execCommand('copy'); } catch (e) {} document.body.removeChild(ta); done();
    }
  };
  return (
    <button onClick={copy}
      style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8, width:'100%',
        padding:'11px 16px', borderRadius:'var(--radius-md)', cursor:'pointer',
        background:'transparent', border:'1px solid ' + (copied ? 'var(--border-accent)' : 'var(--border-strong)'),
        color: copied ? 'var(--coral-bright)' : 'var(--fg-0)', font:'600 14px/1 var(--font-body)',
        transition:'all var(--dur-fast)' }}>
      <Icon name={copied ? 'check' : 'share-2'} size={16} color={copied ? 'var(--coral-bright)' : 'currentColor'} />
      {copied ? 'Link copied!' : 'Share'}
    </button>
  );
}

// ---- Ordinary ⟷ Extraordinary (Sıradışılık / uniqueness) meter ----
// The arc shows the community uniqueness level. The signed-in user's own pick is
// drawn as a small blue inverted triangle sitting on top of the arc. Submitting a
// score happens through a small popup opened from the button by the heading.
// Power-user feature: only visible to viewers who've logged 1000+ titles.
function ExtraordinaryMeter({ film }) {
  const community = (window.AICDB_DETAILS[film.id] || {}).extraordinary || 60;
  const minLogged = window.AICDB_UNIQUENESS_MIN_LOGGED || 1000;
  const logged = (window.AICDB_VIEWER || {}).loggedTitles || 0;
  const eligible = logged >= minLogged;

  const [user, setUser] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState(community);

  // hooks must run unconditionally — bail out after them
  if (!eligible) return null;

  const BLUE = 'var(--info)';
  const BLUE_GHOST = 'rgba(111,156,235,0.16)';

  // geometry (viewBox 220 x 132)
  const CX = 110, CY = 112, R = 86;
  const pointForPct = (p) => {
    const theta = (1 - p / 100) * Math.PI; // 0% → π (left), 100% → 0 (right)
    return { x: CX + R * Math.cos(theta), y: CY - R * Math.sin(theta) };
  };
  const arcTo = (p) => { const { x, y } = pointForPct(p); return `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${x} ${y}`; };

  // small blue inverted triangle anchored just outside the arc, pointing in at the arc
  const triFor = (p) => {
    const theta = (1 - p / 100) * Math.PI;
    const rr = R + 15;
    const ax = CX + rr * Math.cos(theta);
    const ay = CY - rr * Math.sin(theta);
    const rot = Math.atan2(CY - ay, CX - ax) * 180 / Math.PI - 90;
    return { ax, ay, rot };
  };

  const openPopup = () => { if (!window.AICDB_REQUIRE_AUTH('Sign in to rate this title’s uniqueness.')) return; setDraft(user != null ? user : community); setOpen(true); };
  const submit = () => { setUser(draft); setOpen(false); };

  const tri = user != null ? triFor(user) : null;

  return (
    <div style={{ position:'relative', padding:'18px 20px 16px', background:'var(--bg-1)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, marginBottom:6 }}>
        <h3 style={{ font:'600 15px/1.2 var(--font-display)', color:'var(--fg-0)', margin:0 }}>How unconventional?</h3>
        {/* small button → submit-your-score popup */}
        <button onClick={openPopup} title="Rate uniqueness"
          style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 11px', cursor:'pointer',
            borderRadius:'var(--radius-pill)', border:'1px solid ' + (open ? BLUE : 'rgba(111,156,235,0.4)'),
            background: open ? BLUE : BLUE_GHOST, color: open ? '#0b1426' : BLUE,
            font:'600 12px/1 var(--font-body)', transition:'all var(--dur-fast)' }}>
          <Icon name={user != null ? 'pencil-simple' : 'plus'} size={12} color={open ? '#0b1426' : BLUE} weight="bold" />
          {user != null ? 'Edit' : 'Rate'}
        </button>
      </div>

      <svg viewBox="0 0 220 132" width="100%" style={{ display:'block', overflow:'visible' }}>
        <defs>
          <linearGradient id={`gauge-${film.id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--bg-3)" />
            <stop offset="55%" stopColor="var(--coral-dim)" />
            <stop offset="100%" stopColor="var(--coral)" />
          </linearGradient>
        </defs>
        {/* track */}
        <path d={arcTo(100)} fill="none" stroke="var(--bg-3)" strokeWidth="12" strokeLinecap="round" />
        {/* tick marks every 10% */}
        {Array.from({ length: 11 }).map((_, i) => {
          const a = (1 - i / 10) * Math.PI;
          const x1 = CX + (R - 9) * Math.cos(a), y1 = CY - (R - 9) * Math.sin(a);
          const x2 = CX + (R - 3) * Math.cos(a), y2 = CY - (R - 3) * Math.sin(a);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--bg-0)" strokeWidth={i % 5 === 0 ? 2 : 1.2} opacity="0.8" />;
        })}
        {/* uniqueness level fill (community) */}
        <path d={arcTo(community)} fill="none" stroke={`url(#gauge-${film.id})`} strokeWidth="12" strokeLinecap="round" />
        {/* user's own selection — small blue inverted triangle on top of the arc */}
        {tri && (
          <polygon points="0,8 -6.5,-4 6.5,-4" fill={BLUE} stroke="var(--bg-1)" strokeWidth="1.5"
            transform={`translate(${tri.ax} ${tri.ay}) rotate(${tri.rot})`} />
        )}
      </svg>

      {/* readout */}
      <div style={{ textAlign:'center', marginTop:-4 }}>
        <span style={{ font:'700 30px/1 var(--font-mono)', color:'var(--coral)' }}>{community}</span>
        <span style={{ font:'500 14px/1 var(--font-mono)', color:'var(--fg-2)' }}>%</span>
        <div style={{ font:'var(--text-data-sm)', color:'var(--fg-3)', marginTop:4 }}>Community level</div>
        {user != null && (
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, marginTop:8, padding:'4px 10px',
            borderRadius:'var(--radius-pill)', background:BLUE_GHOST, border:'1px solid rgba(111,156,235,0.35)' }}>
            <span style={{ width:0, height:0, borderLeft:'5px solid transparent', borderRight:'5px solid transparent', borderTop:`7px solid ${BLUE}` }} />
            <span style={{ font:'600 12px/1 var(--font-body)', color:BLUE }}>Your take · {user}%</span>
          </div>
        )}
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10 }}>
        <span className="overline" style={{ color:'var(--fg-2)' }}>Ordinary</span>
        <span className="overline" style={{ color:'var(--coral-bright)' }}>Extraordinary</span>
      </div>

      {/* submit-your-score popup */}
      {open && <UniquenessPopup draft={draft} setDraft={setDraft} onSubmit={submit} onClose={() => setOpen(false)} hasPrev={user != null} blue={BLUE} />}
    </div>
  );
}

// small popup anchored to the meter card for submitting a uniqueness score
function UniquenessPopup({ draft, setDraft, onSubmit, onClose, hasPrev, blue }) {
  React.useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <>
      {/* click-catcher */}
      <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:40 }} />
      <div style={{ position:'absolute', top:54, right:14, zIndex:41, width:236, padding:'16px 16px 14px',
        background:'var(--bg-2)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-lg)',
        boxShadow:'var(--shadow-3)', animation:'aicdbUniqPop 0.18s var(--ease-out) both' }}>
        <style>{`@keyframes aicdbUniqPop{from{transform:translateY(-6px)}to{transform:none}}`}</style>
        <div style={{ font:'600 13px/1.2 var(--font-body)', color:'var(--fg-0)', marginBottom:3 }}>Your uniqueness score</div>
        <div style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', marginBottom:14 }}>How unconventional is this title?</div>

        <div style={{ display:'flex', alignItems:'baseline', justifyContent:'center', gap:2, marginBottom:8 }}>
          <span style={{ font:'700 32px/1 var(--font-mono)', color:blue }}>{draft}</span>
          <span style={{ font:'500 15px/1 var(--font-mono)', color:'var(--fg-2)' }}>%</span>
        </div>
        <input type="range" min="0" max="100" value={draft} onChange={e => setDraft(Number(e.target.value))}
          style={{ width:'100%', accentColor:blue, cursor:'pointer' }} />
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
          <span className="overline" style={{ color:'var(--fg-3)' }}>Ordinary</span>
          <span className="overline" style={{ color:'var(--fg-3)' }}>Extraordinary</span>
        </div>

        <div style={{ display:'flex', gap:8, marginTop:14 }}>
          <button onClick={onClose} style={{ flex:'none', padding:'9px 13px', cursor:'pointer', borderRadius:'var(--radius-md)',
            background:'transparent', border:'1px solid var(--border-default)', color:'var(--fg-1)', font:'600 13px/1 var(--font-body)' }}>Cancel</button>
          <button onClick={onSubmit} style={{ flex:1, padding:'9px 13px', cursor:'pointer', borderRadius:'var(--radius-md)',
            background:blue, border:'1px solid transparent', color:'#0b1426', font:'600 13px/1 var(--font-body)' }}>
            {hasPrev ? 'Update score' : 'Submit score'}
          </button>
        </div>
      </div>
    </>
  );
}

// ---- Credits / crew ----
function CreditItem({ role, name }) {
  const initials = name.replace('@','').split(/[\s.]+/).filter(Boolean).slice(0,2).map(w => w[0]).join('').toUpperCase();
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
      <div style={{ width:40, height:40, flex:'none', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
        background:'var(--bg-3)', border:'1px solid var(--border-subtle)', font:'600 14px/1 var(--font-body)', color:'var(--fg-1)' }}>{initials}</div>
      <div style={{ minWidth:0 }}>
        <div className="overline" style={{ color:'var(--fg-2)', marginBottom:3 }}>{role}</div>
        <div style={{ font:'600 14px/1.2 var(--font-body)', color:'var(--fg-0)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{name}</div>
      </div>
    </div>
  );
}

function CreditsSection({ film }) {
  const crew = (window.AICDB_DETAILS[film.id] || {}).crew || [];
  return (
    <section style={{ marginTop:48 }}>
      <h2 style={{ font:'var(--text-h2)', color:'var(--fg-0)', marginBottom:20 }}>Credits</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(230px, 1fr))', gap:20 }}>
        {crew.map(([role, name]) => <CreditItem key={role} role={role} name={name} />)}
      </div>
    </section>
  );
}

// ---- Statistics ----
function StatBlock({ icon, color, value, label }) {
  return (
    <div style={{ padding:'18px 20px', background:'var(--bg-1)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)' }}>
      <Icon name={icon} size={18} color={color} weight="fill" />
      <div style={{ font:'700 26px/1 var(--font-mono)', color:'var(--fg-0)', letterSpacing:'-0.02em', margin:'12px 0 6px' }}>{value}</div>
      <div className="overline" style={{ color:'var(--fg-2)' }}>{label}</div>
    </div>
  );
}

function StatsSection({ film }) {
  const s = window.AICDB_STAT(film);
  return (
    <section style={{ marginTop:48 }}>
      <h2 style={{ font:'var(--text-h2)', color:'var(--fg-0)', marginBottom:20 }}>Statistics</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))', gap:16 }}>
        <StatBlock icon="eye"       color="var(--teal)"        value={fmtCount(s.watched)}     label="Watched" />
        <StatBlock icon="heart"     color="var(--coral)"       value={fmtCount(s.favorited)}   label="Favorited" />
        <StatBlock icon="bookmark"  color="var(--type-vertical)" value={fmtCount(s.watchlisted)} label="Watchlisted" />
        <StatBlock icon="star"      color="var(--warning)"     value={fmtCount(s.rated)}       label="Ratings" />
        <StatBlock icon="gauge"     color="var(--teal-bright)" value={Math.round(s.completion*100)+'%'} label="Avg completion" />
      </div>
    </section>
  );
}

// ---- Production info ----
function SpecRow({ label, children, last }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:20, padding:'14px 0',
      borderBottom: last ? 'none' : '1px solid var(--border-subtle)' }}>
      <div className="overline" style={{ color:'var(--fg-2)', width:150, flex:'none', paddingTop:3 }}>{label}</div>
      <div style={{ flex:1, font:'var(--text-body)', color:'var(--fg-0)' }}>{children}</div>
    </div>
  );
}

function ProductionSection({ film }) {
  const d = window.AICDB_DETAILS[film.id] || {};
  return (
    <section style={{ marginTop:48 }}>
      <h2 style={{ font:'var(--text-h2)', color:'var(--fg-0)', marginBottom:8 }}>Production</h2>
      <div style={{ padding:'6px 22px', background:'var(--bg-1)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)' }}>
        <SpecRow label="AI Models">
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {(d.models || []).map(m => (
              <span key={m} style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 11px', borderRadius:'var(--radius-pill)',
                background:'var(--teal-ghost)', color:'var(--teal-bright)', font:'600 12px/1 var(--font-mono)' }}>
                <Icon name="sparkles" size={12} color="var(--teal-bright)" />{m}
              </span>
            ))}
          </div>
        </SpecRow>
        <SpecRow label="Technique"><span style={{ color:'var(--fg-1)' }}>{film.technique}</span></SpecRow>
        <SpecRow label="Budget"><span style={{ font:'600 var(--font-mono)' }}>{d.budget || '—'}</span></SpecRow>
        <SpecRow label="Production time"><span style={{ color:'var(--fg-1)' }}>{d.duration || '—'}</span></SpecRow>
        <SpecRow label="Contributors" last><span style={{ color:'var(--fg-1)' }}>{d.contributors || '—'} people &amp; pipelines</span></SpecRow>
      </div>
    </section>
  );
}

// ---- Inline add-review composer (text only — rating is done separately) ----
function AddReviewBox({ onPost, onCancel }) {
  const [body, setBody] = React.useState('');
  return (
    <div style={{ padding:'18px 20px', background:'var(--bg-1)', border:'1px solid var(--border-default)',
      borderRadius:'var(--radius-lg)', marginBottom:18 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
        <span style={{ font:'600 14px/1 var(--font-body)', color:'var(--fg-0)' }}>Your review</span>
        <span style={{ font:'var(--text-body-sm)', color:'var(--fg-3)' }}>· rate this title separately to give it a score</span>
      </div>
      <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="What did you make of it?"
        style={{ width:'100%', minHeight:84, resize:'vertical', background:'var(--bg-0)', color:'var(--fg-0)',
          border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', padding:'12px 14px',
          font:'var(--text-body)', outline:'none' }} />
      <div style={{ display:'flex', justifyContent:'flex-end', gap:10, marginTop:12 }}>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" icon="check" onClick={() => { if (body.trim()) onPost({ user:'You', av:['#d85a30','#9d8df1'], when:'just now', likes:0, body: body.trim() }); }}>Post review</Button>
      </div>
    </div>
  );
}

Object.assign(window, { DualScore, WatchlistSplit, ShareButton, ExtraordinaryMeter, UniquenessPopup, CreditsSection, StatsSection, ProductionSection, AddReviewBox });