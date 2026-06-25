// Dreamwall UI kit — Creators page.
// Featured "Creator of the week" hero + grid of creator cards
// (photo, name, follower count, total works, avg score, Follow).
// Reuses FollowPill + Seal from Feed.jsx.

function useCreators() {
  const [creators, setCreators] = React.useState([]);
  React.useEffect(() => {
    (async () => {
      try {
        const sb = await window.AICDB_AUTH.getClient();
        const { data } = await sb
          .from('creator_profiles')
          .select('id, user_id, handle, display_name, bio, avatar_url, banner_url, location, social_links, show_on_main_profile, created_at')
          .order('created_at', { ascending: false });
        if (data) {
          const statsByCreator = {};
          data.forEach(c => {
            statsByCreator[c.id] = { worksCount: 0, avgScore: 0, totalRatings: 0, weightedSum: 0, weightTotal: 0 };
          });
          if (data.length) {
            const { data: statsData } = await sb
              .from('content')
              .select('id, creator_id, content_stats(rating_avg, rating_count)')
              .eq('status', 'published')
              .in('creator_id', data.map(c => c.id));
            (statsData || []).forEach(row => {
              const bucket = statsByCreator[row.creator_id];
              if (!bucket) return;
              bucket.worksCount += 1;
              const raw = row.content_stats;
              const stats = Array.isArray(raw) ? raw[0] : raw;
              const count = stats?.rating_count || 0;
              const avg = stats?.rating_avg ? parseFloat(stats.rating_avg) : 0;
              bucket.totalRatings += count;
              if (avg > 0 && count > 0) {
                bucket.weightedSum += avg * count;
                bucket.weightTotal += count;
              }
            });
          }
          const enriched = data.map(c => {
            const b = statsByCreator[c.id];
            const avgScore = b.weightTotal > 0 ? Math.round((b.weightedSum / b.weightTotal) * 10) / 10 : 0;
            return { ...c, worksCount: b.worksCount, avgScore, totalRatings: b.totalRatings };
          });
          setCreators(enriched);
          window.AICDB_CREATOR_BY_NAME = {};
          data.forEach(c => {
            window.AICDB_CREATOR_BY_NAME[c.display_name] = {
              id: c.id,
              name: c.display_name,
              handle: c.handle ? '@' + c.handle : '',
              location: c.location || '',
              tagline: c.bio || '',
              followers: 0,
              verified: false,
              av: ['var(--teal)', 'var(--coral)'],
            };
          });
        }
      } catch (e) {}
    })();
  }, []);
  return creators;
}

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
        <div onClick={() => onCreator && onCreator(creator.name)} style={{ flex:'1 1 320px', minWidth:0, cursor: onCreator ? 'pointer' : 'default' }}>
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
          <div style={{ display:'flex', alignItems:'center', gap:26, flexWrap:'wrap' }} onClick={e => e.stopPropagation()}>
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
  const worksCount = creator.worksCount || 0;
  const avgScore = creator.avgScore || 0;
  return (
    <div onClick={() => onCreator && onCreator(creator.name)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ background:'var(--bg-1)', borderRadius:'var(--radius-lg)', overflow:'hidden', cursor:'pointer',
        borderWidth:1, borderStyle:'solid', borderColor: hover ? 'var(--border-default)' : 'var(--border-subtle)',
        transition:'border-color var(--dur-fast), transform var(--dur-base)', transform: hover ? 'translateY(-3px)' : 'none' }}>
      {/* gradient banner */}
      <div style={{ height:84, position:'relative', background:`linear-gradient(120deg, ${creator.av[0]}, ${creator.av[1]} 160%)` }}>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, transparent 30%, var(--bg-1) 100%)' }} />
        {/* compact Follow — top-right corner of the card */}
        <div onClick={e => e.stopPropagation()} style={{ position:'absolute', top:12, right:12, zIndex:2 }}>
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
          <MiniStat value={worksCount} label="Works" />
          <div style={{ width:1, background:'var(--border-subtle)' }} />
          <MiniStat value={avgScore.toFixed(1)} label="Avg score" color={scoreColor(avgScore)} />
        </div>
      </div>
    </div>
  );
}

// compact follow pill that lives in a card corner
function CornerFollow({ id }) {
  const [following, setFollowing] = React.useState(() => window.AICDB_FOLLOWS?.isFollowing('creator', id) || false);
  const [hover, setHover] = React.useState(false);

  React.useEffect(() => window.AICDB_FOLLOWS?.subscribe(() => setFollowing(window.AICDB_FOLLOWS.isFollowing('creator', id))), [id]);

  return (
    <button onClick={(e) => {
      e.stopPropagation();
      if (!window.AICDB_REQUIRE_AUTH('Sign in to follow creators.')) return;
      window.AICDB_FOLLOWS.toggle('creator', id);
    }}
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
  const all = useCreators();
  const mapped = all.map(c => ({
    id: c.id,
    name: c.display_name,
    handle: c.handle ? '@' + c.handle : '',
    location: c.location || '',
    tagline: c.bio || '',
    followers: 0,
    verified: false,
    av: ['var(--teal)', 'var(--coral)'],
    avatar_url: c.avatar_url || null,
    banner_url: c.banner_url || null,
    worksCount: c.worksCount || 0,
    avgScore: c.avgScore || 0,
    totalRatings: c.totalRatings || 0,
  }));
  if (!mapped.length) {
    return (
      <div style={{ maxWidth:1180, margin:'0 auto', padding:'48px 28px 90px' }}>
        <EmptyState icon="users-three" accent="var(--coral)"
          title="No creators yet"
          sub="No one has set up a creator account on Dreamwall yet. Be the first to publish your work."
          actionLabel="Create a creator account" onAction={() => { window.location.href = 'Dreamwall%20Add%20Creator%20Account.html'; }} />
      </div>
    );
  }
  const featured = mapped[0];
  return (
    <div style={{ maxWidth:1180, margin:'0 auto', padding:'28px 28px 90px' }}>
      <FeaturedCreator creator={featured} onCreator={onCreator} onOpen={onOpen} />
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:22 }}>
        <h2 style={{ font:'var(--text-h2)', color:'var(--fg-0)', letterSpacing:'-0.01em' }}>All creators</h2>
        <span style={{ font:'var(--text-body-sm)', color:'var(--fg-2)' }}>{mapped.length} verified &amp; rising</span>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(290px, 1fr))', gap:22 }}>
        {mapped.map(c => <CreatorCard key={c.id} creator={c} onCreator={onCreator} onOpen={onOpen} />)}
      </div>
    </div>
  );
}

Object.assign(window, { CreatorsPage, FeaturedCreator, CreatorCard, MiniStat, FullWidthFollow, CornerFollow });
