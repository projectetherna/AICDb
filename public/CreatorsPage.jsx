// Dreamwall UI kit — Creators page.
// Featured "Creator of the week" hero + grid of creator cards
// (photo, name, follower count, total works, avg score, Follow).
// Reuses FollowPill + Seal from Feed.jsx.

// ---- a single stat cell for cards ----
function MiniStat({ value, label, color }) {
  return (
    <div style={{ textAlign:'center', flex:1 }}>
      <div style={{ font:'700 18px/1 var(--font-mono)', color: color || 'var(--fg-0)', letterSpacing:'-0.01em' }}>{value}</div>
      <div className="overline" style={{ color:'var(--fg-2)', marginTop:6 }}>{label}</div>
    </div>
  );
}

// ---- featured creator of the week ----
function FeaturedCreator({ creator, onCreator, onOpen }) {
  const st = window.AICDB_CREATOR_STATS(creator);
  const topWorks = st.films.slice().sort((a, b) => b.score - a.score).slice(0, 5);
  return (
    <div style={{ position:'relative', borderRadius:'var(--radius-xl)', overflow:'hidden', marginBottom:44,
      background:`linear-gradient(120deg, ${creator.av[0]}22, ${creator.av[1]}18 140%), var(--bg-1)`,
      borderWidth:1, borderStyle:'solid', borderColor:'var(--border-subtle)' }}>
      <div style={{ position:'absolute', inset:0, opacity:0.4,
        backgroundImage:'radial-gradient(rgba(245,243,239,0.05) 1px, transparent 1px)', backgroundSize:'5px 5px' }} />
      <div style={{ position:'relative', display:'flex', gap:34, padding:'40px 44px', flexWrap:'wrap', alignItems:'center' }}>
        {/* identity */}
        <div onClick={() => onCreator && onCreator(creator.name)} style={{ flex:'none', cursor:'pointer', position:'relative' }}>
          <div style={{ width:128, height:128, borderRadius:'50%',
            background:`linear-gradient(135deg, ${creator.av[0]}, ${creator.av[1]})`,
            borderWidth:3, borderStyle:'solid', borderColor:'var(--bg-0)', boxShadow:'var(--shadow-3)' }} />
        </div>
        <div style={{ flex:'1 1 320px', minWidth:0 }}>
          <div className="overline" style={{ color:'var(--coral-bright)', marginBottom:12, display:'inline-flex', alignItems:'center', gap:8 }}>
            <Icon name="trophy" size={13} color="var(--coral-bright)" weight="fill" /> Creator of the week
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10, flexWrap:'wrap' }}>
            <h1 style={{ font:'700 38px/1.04 var(--font-display)', letterSpacing:'-0.015em', color:'var(--fg-0)', margin:0 }}>{creator.name}</h1>
            {creator.verified && <Seal size={22} />}
          </div>
          <p style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:18, lineHeight:1.5, color:'var(--fg-1)', margin:'0 0 22px', maxWidth:540 }}>
            “{creator.tagline}”
          </p>
          <div style={{ display:'flex', alignItems:'center', gap:26, flexWrap:'wrap' }}>
            <FollowPill id={creator.id} />
            <div style={{ display:'flex', alignItems:'center', gap:22 }}>
              <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                <span style={{ font:'700 18px/1 var(--font-mono)', color:'var(--fg-0)' }}>{fmtCount(creator.followers)}</span>
                <span className="overline" style={{ color:'var(--fg-2)' }}>Followers</span>
              </div>
              <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                <span style={{ font:'700 18px/1 var(--font-mono)', color:'var(--fg-0)' }}>{st.works}</span>
                <span className="overline" style={{ color:'var(--fg-2)' }}>Works</span>
              </div>
              <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                <span style={{ font:'700 18px/1 var(--font-mono)', color:scoreColor(st.avg) }}>{st.avg.toFixed(1)}</span>
                <span className="overline" style={{ color:'var(--fg-2)' }}>Avg score</span>
              </div>
            </div>
          </div>
        </div>
        {/* top works poster strip */}
        <div style={{ flex:'none', display:'flex', gap:10 }}>
          {topWorks.map(f => (
            <div key={f.id} onClick={() => onOpen && onOpen(f)} title={f.title}
              style={{ width:78, aspectRatio:'2/3', borderRadius:'var(--radius-md)', overflow:'hidden', cursor:'pointer',
                background:`linear-gradient(150deg, ${f.g[0]}, ${f.g[1]} 150%)`, boxShadow:'var(--shadow-2)', position:'relative' }}>
              <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'16px 6px 5px',
                background:'linear-gradient(to top, rgba(5,5,5,0.85), transparent)',
                font:'700 12px/1 var(--font-mono)', color:scoreColor(f.score), textAlign:'center' }}>{f.score.toFixed(1)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- creator card for the grid ----
function CreatorCard({ creator, onCreator, onOpen }) {
  const [hover, setHover] = React.useState(false);
  const [worksOpen, setWorksOpen] = React.useState(false);
  const st = window.AICDB_CREATOR_STATS(creator);
  const top = st.films.slice().sort((a, b) => b.score - a.score).slice(0, 3);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ background:'var(--bg-1)', borderRadius:'var(--radius-lg)', overflow:'hidden',
        borderWidth:1, borderStyle:'solid', borderColor: hover ? 'var(--border-default)' : 'var(--border-subtle)',
        transition:'border-color var(--dur-fast), transform var(--dur-base)', transform: hover ? 'translateY(-3px)' : 'none' }}>
      {/* poster strip banner */}
      <div style={{ height:84, display:'flex', gap:2, position:'relative', background:'var(--bg-inset)' }}>
        {top.map(f => (
          <div key={f.id} onClick={() => onOpen && onOpen(f)} style={{ flex:1, cursor:'pointer',
            background:`linear-gradient(150deg, ${f.g[0]}, ${f.g[1]} 160%)` }} />
        ))}
        {!top.length && <div style={{ flex:1, background:`linear-gradient(120deg, ${creator.av[0]}33, ${creator.av[1]}22)` }} />}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, transparent 30%, var(--bg-1) 100%)' }} />
        {/* compact Follow — top-right corner of the card */}
        <div style={{ position:'absolute', top:12, right:12, zIndex:2 }}>
          <CornerFollow id={creator.id} />
        </div>
      </div>

      <div style={{ padding:'0 22px 22px', marginTop:-32, position:'relative' }}>
        <div onClick={() => onCreator && onCreator(creator.name)} style={{ cursor:'pointer', display:'inline-block' }}>
          <div style={{ width:64, height:64, borderRadius:'50%',
            background:`linear-gradient(135deg, ${creator.av[0]}, ${creator.av[1]})`,
            borderWidth:3, borderStyle:'solid', borderColor:'var(--bg-1)', boxShadow:'var(--shadow-2)' }} />
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:7, marginTop:12 }}>
          <span onClick={() => onCreator && onCreator(creator.name)}
            style={{ font:'600 18px/1.2 var(--font-display)', color:'var(--fg-0)', cursor:'pointer',
              whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{creator.name}</span>
          {creator.verified && <Seal size={15} />}
        </div>
        <div style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', marginTop:3 }}>{creator.handle} · {creator.location}</div>
        <p style={{ font:'var(--text-body-sm)', color:'var(--fg-1)', margin:'12px 0 0', minHeight:38,
          display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{creator.tagline}</p>

        <div style={{ display:'flex', gap:4, margin:'18px 0', padding:'14px 0', borderTop:'1px solid var(--border-subtle)', borderBottom:'1px solid var(--border-subtle)' }}>
          <MiniStat value={fmtCount(creator.followers)} label="Followers" />
          <div style={{ width:1, background:'var(--border-subtle)' }} />
          <MiniStat value={st.works} label="Works" />
          <div style={{ width:1, background:'var(--border-subtle)' }} />
          <MiniStat value={st.avg.toFixed(1)} label="Avg score" color={scoreColor(st.avg)} />
        </div>

        {/* main card action — Works (opens a modal of this creator's catalog) */}
        <button onClick={() => setWorksOpen(true)}
          style={{ width:'100%', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8, padding:'11px 0',
            borderRadius:'var(--radius-md)', cursor:'pointer', font:'600 14px/1 var(--font-body)', transition:'all var(--dur-fast)',
            border:'1px solid var(--border-strong)', background:'transparent', color:'var(--fg-0)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-2)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
          <Icon name="film-slate" size={16} color="currentColor" weight="fill" />
          Works <span style={{ font:'600 13px/1 var(--font-mono)', color:'var(--fg-2)' }}>{st.works}</span>
        </button>
      </div>
      {worksOpen && <CreatorWorksModal creator={creator} films={st.films} onClose={() => setWorksOpen(false)}
        onCreator={onCreator} onOpen={onOpen} />}
    </div>
  );
}

// compact follow pill that lives in a card corner
function CornerFollow({ id }) {
  const [following, setFollowing] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={(e) => { e.stopPropagation(); setFollowing(f => !f); }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'6px 12px', borderRadius:'var(--radius-pill)', cursor:'pointer',
        font:'600 12px/1 var(--font-body)', transition:'all var(--dur-fast)', borderWidth:1, borderStyle:'solid',
        boxShadow:'var(--shadow-1)',
        background: following ? 'var(--bg-2)' : (hover ? 'var(--coral-bright)' : 'var(--coral)'),
        borderColor: following ? 'var(--border-strong)' : 'transparent',
        color: following ? 'var(--fg-0)' : 'var(--fg-on-accent)' }}>
      <Icon name={following ? 'check' : 'plus'} size={13} color="currentColor" weight="bold" />
      {following ? 'Following' : 'Follow'}
    </button>
  );
}

// modal of a creator's works + a jump to their full page
function CreatorWorksModal({ creator, films, onClose, onCreator, onOpen }) {
  React.useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  const sorted = films.slice().sort((a, b) => b.score - a.score);

  return (
    <div onClick={onClose}
      style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24,
        background:'rgba(5,5,5,0.74)', backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)' }}>
      <style>{`@keyframes aicdbWorksIn{from{transform:translateY(14px) scale(0.985)}to{transform:none}}`}</style>
      <div onClick={e => e.stopPropagation()}
        style={{ position:'relative', width:'100%', maxWidth:620, maxHeight:'84vh', display:'flex', flexDirection:'column',
          background:'var(--bg-1)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-xl)',
          boxShadow:'var(--shadow-3)', overflow:'hidden', animation:'aicdbWorksIn 0.34s var(--ease-out) both' }}>

        {/* header */}
        <div style={{ display:'flex', alignItems:'center', gap:14, padding:'22px 24px 18px', borderBottom:'1px solid var(--border-subtle)' }}>
          <div style={{ width:46, height:46, borderRadius:'50%', flex:'none',
            background:`linear-gradient(135deg, ${creator.av[0]}, ${creator.av[1]})`, boxShadow:'var(--shadow-1)' }} />
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
              <h2 style={{ font:'600 20px/1.2 var(--font-display)', color:'var(--fg-0)', margin:0 }}>{creator.name}</h2>
              {creator.verified && <Seal size={15} />}
            </div>
            <p style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', margin:'5px 0 0' }}>
              {sorted.length} {sorted.length === 1 ? 'work' : 'works'} on Dreamwall
            </p>
          </div>
          <button onClick={onClose} style={{ display:'flex', padding:8, borderRadius:'50%', flex:'none', cursor:'pointer',
            background:'var(--bg-2)', border:'1px solid var(--border-default)' }}>
            <Icon name="x" size={15} color="var(--fg-1)" />
          </button>
        </div>

        {/* works list */}
        <div style={{ overflowY:'auto', padding:'14px 16px', display:'flex', flexDirection:'column', gap:8 }}>
          {sorted.length ? sorted.map(f => {
            const t = window.AICDB_TYPES[f.type];
            const aspect = f.type === 'vertical' ? '9/16' : '2/3';
            return (
              <div key={f.id} onClick={() => onOpen && onOpen(f)}
                style={{ display:'flex', alignItems:'center', gap:14, padding:'10px 12px', cursor:'pointer',
                  borderRadius:'var(--radius-md)', border:'1px solid var(--border-subtle)', background:'var(--bg-0)',
                  transition:'border-color var(--dur-fast)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}>
                <div style={{ width:42, flex:'none', aspectRatio:aspect, borderRadius:'var(--radius-sm)', overflow:'hidden',
                  background:`linear-gradient(150deg, ${f.g[0]}, ${f.g[1]} 150%)`, boxShadow:'var(--shadow-1)' }} />
                <div style={{ minWidth:0, flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:9, flexWrap:'wrap' }}>
                    <span style={{ font:'600 15px/1.2 var(--font-display)', color:'var(--fg-0)' }}>{f.title}</span>
                    <span style={{ font:'600 8.5px/1 var(--font-body)', letterSpacing:'0.05em', textTransform:'uppercase',
                      color:t.text, background:t.ghost, padding:'3px 7px', borderRadius:'var(--radius-pill)' }}>{t.label}</span>
                  </div>
                  <div style={{ font:'var(--text-data-sm)', color:'var(--fg-2)', marginTop:4 }}>{f.year} · {f.runtime}</div>
                </div>
                <div style={{ flex:'none', font:'700 17px/1 var(--font-mono)', color:scoreColor(f.score) }}>{f.score.toFixed(1)}</div>
              </div>
            );
          }) : (
            <div style={{ padding:'40px 0', textAlign:'center', font:'var(--text-body)', color:'var(--fg-2)' }}>
              No works published yet.
            </div>
          )}
        </div>

        {/* footer — go to creator's page */}
        <div style={{ padding:'16px 20px', borderTop:'1px solid var(--border-subtle)', background:'var(--bg-0)' }}>
          <a href={'creator.html?name=' + encodeURIComponent(creator.name)}
            onClick={(e) => { if (onCreator) { e.preventDefault(); onClose(); onCreator(creator.name); } }}
            style={{ width:'100%', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8, padding:'12px 0',
              borderRadius:'var(--radius-md)', cursor:'pointer', textDecoration:'none', font:'600 14px/1 var(--font-body)',
              background:'var(--coral)', color:'var(--fg-on-accent)', transition:'background var(--dur-fast)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--coral-bright)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--coral)'; }}>
            Go to creator’s page <Icon name="arrow-right" size={15} color="currentColor" />
          </a>
        </div>
      </div>
    </div>
  );
}

// full-width follow button used in cards
function FullWidthFollow({ id }) {
  const [following, setFollowing] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={() => setFollowing(f => !f)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ width:'100%', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8, padding:'11px 0',
        borderRadius:'var(--radius-md)', cursor:'pointer', font:'600 14px/1 var(--font-body)', transition:'all var(--dur-fast)',
        borderWidth:1, borderStyle:'solid',
        background: following ? 'transparent' : (hover ? 'var(--coral-bright)' : 'var(--coral)'),
        borderColor: following ? 'var(--border-strong)' : 'transparent',
        color: following ? 'var(--fg-0)' : 'var(--fg-on-accent)' }}>
      <Icon name={following ? 'check' : 'plus'} size={16} color="currentColor" />
      {following ? 'Following' : 'Follow'}
    </button>
  );
}

function CreatorsPage({ onCreator, onOpen }) {
  const all = window.AICDB_CREATORS;
  const featured = all.slice().sort((a, b) => b.followers - a.followers)[0];
  const rest = all.filter(c => c.id !== featured.id);
  return (
    <div style={{ maxWidth:1180, margin:'0 auto', padding:'28px 28px 90px' }}>
      <FeaturedCreator creator={featured} onCreator={onCreator} onOpen={onOpen} />
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:22 }}>
        <h2 style={{ font:'var(--text-h2)', color:'var(--fg-0)', letterSpacing:'-0.01em' }}>All creators</h2>
        <span style={{ font:'var(--text-body-sm)', color:'var(--fg-2)' }}>{all.length} verified &amp; rising</span>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(290px, 1fr))', gap:22 }}>
        {rest.map(c => <CreatorCard key={c.id} creator={c} onCreator={onCreator} onOpen={onOpen} />)}
      </div>
    </div>
  );
}

Object.assign(window, { CreatorsPage, FeaturedCreator, CreatorCard, MiniStat, FullWidthFollow, CornerFollow, CreatorWorksModal });
