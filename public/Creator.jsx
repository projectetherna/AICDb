// Dreamwall UI kit — Creator Page (separate from the regular user Profile).
// Only users who have switched to a creator account get this page.
// Assembles: NavBar + centered cinematic hero + stat strip + Works grid +
// About section + (creator-only) Creator Studio management panel.
// Reuses CreatorParts.jsx, CreatorManage.jsx, Primitives, FilmCard, NavBar.

const DEFAULT_CREATOR_BANNER = 'https://zvvkejehuludrsabsesd.supabase.co/storage/v1/object/public/images/default/creator_banner.jpg.png';

// ---- the creator + their catalog ----
// No hand-authored default creator — a creator page only renders for a real
// (user-created) creator account; otherwise it shows an empty state.
const CREATOR = null;

// drafts in progress (creator-only studio) — none by default
const DRAFTS = [];

// ---- build a creator object from a stored (user-created) creator account ----
function creatorFromAccount(acct) {
  return {
    accountId: acct.id,
    name: acct.name || 'Untitled Creator',
    initials: (acct.name || 'C').replace(/[@]/g, '').trim().charAt(0).toUpperCase() || 'C',
    location: acct.location || 'Online',
    joined: 'Joined just now',
    avatar: acct.avatar || ['#d85a30', '#9d8df1'],
    avatarImg: acct.avatarImg || null,
    banner: acct.banner || DEFAULT_CREATOR_BANNER,
    followers: acct.followers || 0,
    verified: false,
    handle: acct.handle || '',
    showOnProfile: acct.showOnProfile !== false,
    manifesto: acct.bio || 'A brand-new creator. The first frame is still rendering.',
    social: acct.social || { youtube:'#', instagram:'#', x:'#', tiktok:'#', website:'#' },
    tools: (acct.tools && acct.tools.length) ? acct.tools : ['Add your tools in Edit This Page'],
    influences: (acct.influences && acct.influences.length) ? acct.influences : ['Add your influences'],
    notes: acct.notes || 'You haven’t written any notes yet. Hit “Edit This Page” to introduce yourself.',
    works: [],
    isOwn: true,
  };
}

// ---- compute stats from Supabase content rows ----
function computeCreatorContentStats(worksData) {
  const rows = worksData || [];
  const worksCount = rows.length;
  let totalRatings = 0;
  let weightedSum = 0;
  let weightTotal = 0;
  rows.forEach(row => {
    const raw = row.content_stats;
    const stats = Array.isArray(raw) ? raw[0] : raw;
    const count = stats?.rating_count || 0;
    const avg = stats?.rating_avg ? parseFloat(stats.rating_avg) : 0;
    totalRatings += count;
    if (avg > 0 && count > 0) {
      weightedSum += avg * count;
      weightTotal += count;
    }
  });
  const avgScore = weightTotal > 0 ? Math.round((weightedSum / weightTotal) * 10) / 10 : null;
  const worksList = rows.map(row => ({
    id: row.id,
    title: row.title,
    poster_url: row.poster_url,
    type: row.type,
  }));
  return { worksCount, totalRatings, avgScore, worksList };
}

// ---- build a creator object from a Supabase creator_profiles row ----
function creatorFromDbRow(row, stats = {}) {
  const { worksCount = 0, totalRatings = 0, avgScore = null, worksList = [] } = stats;
  return {
    id: row.id,
    accountId: row.id,
    user_id: row.user_id,
    name: row.display_name,
    initials: row.display_name.charAt(0).toUpperCase(),
    location: row.location || 'Online',
    joined: 'Member since ' + new Date(row.created_at).getFullYear(),
    avatar: ['var(--teal)', 'var(--coral)'],
    avatarImg: row.avatar_url || null,
    banner: row.banner_url || DEFAULT_CREATOR_BANNER,
    followers: 0,
    verified: false,
    handle: row.handle || '',
    showOnProfile: row.show_on_main_profile !== false,
    manifesto: row.bio || '',
    social: row.social_links || {},
    tools: row.tools ? (Array.isArray(row.tools) ? row.tools : row.tools.split(',').map(t => t.trim()).filter(Boolean)) : [],
    influences: [],
    notes: row.notes || '',
    works: [],
    worksCount,
    totalRatings,
    avgScore,
    worksList,
    isOwn: false,
  };
}

function filmsById() {
  const m = {};
  window.AICDB_FILMS.forEach(f => { m[f.id] = f; });
  return m;
}

// ---- a Works poster: title, year, score + type badge always visible ----
function WorkCard({ film, onOpen }) {
  const [hover, setHover] = React.useState(false);
  const aspect = film.type === 'vertical' ? '9/16' : '2/3';
  return (
    <div style={{ cursor:'pointer' }} onClick={() => onOpen && onOpen(film)}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div style={{ aspectRatio:aspect, borderRadius:'var(--radius-lg)', overflow:'hidden', position:'relative',
        boxShadow:'var(--shadow-poster)', background:`linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 150%)`,
        transition:'transform var(--dur-base) var(--ease-out), filter var(--dur-base) var(--ease-out)',
        transform: hover ? 'translateY(-3px) scale(1.015)' : 'none', filter: hover ? 'brightness(1.08)' : 'brightness(1)' }}>
        {/* ribbon + type badge — always visible, top-left */}
        <div style={{ position:'absolute', top:10, left:10, display:'flex', flexDirection:'column', gap:6, alignItems:'flex-start' }}>
          <ContentRibbon film={film} size="sm" />
          <ContentBadge type={film.type} solid size="sm" />
        </div>
        {/* protection scrim + score — always visible, bottom */}
        <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'28px 12px 11px',
          background:'linear-gradient(to top, rgba(5,5,5,0.85) 0%, rgba(5,5,5,0.35) 55%, transparent 100%)',
          display:'flex', alignItems:'baseline', gap:5 }}>
          <ScoreLine film={film} size={22} countColor="rgba(255,255,255,0.7)" />
        </div>
      </div>
      <div style={{ font:'600 14px/1.25 var(--font-body)', color:'var(--fg-0)', marginTop:10,
        whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{film.title}</div>
      <div style={{ font:'var(--text-data-sm)', color:'var(--fg-2)', marginTop:3 }}>
        {film.year} · {window.AICDB_TYPES[film.type].label}
      </div>
    </div>
  );
}

// ---- Works section: tab filter (All / Films / Series / Shorts) + grid ----
function WorksSection({ films, onOpen }) {
  const [tab, setTab] = React.useState('All');
  const tabs = [
    ['All', () => true],
    ['Films', f => f.type === 'movie'],
    ['Series', f => f.type === 'series'],
    ['Shorts', f => f.type === 'short'],
  ];
  const counts = {};
  tabs.forEach(([label, pred]) => { counts[label] = films.filter(pred).length; });
  const pred = tabs.find(t => t[0] === tab)[1];
  const shown = films.filter(pred).slice().sort((a, b) => b.score - a.score); // highest rated first

  return (
    <section style={{ marginBottom:64 }}>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:20, flexWrap:'wrap', marginBottom:22 }}>
        <h2 style={{ font:'var(--text-h2)', color:'var(--fg-0)', letterSpacing:'-0.01em' }}>Works</h2>
        <div style={{ display:'flex', gap:8 }}>
          {tabs.map(([label]) => {
            const on = tab === label;
            return (
              <button key={label} onClick={() => setTab(label)}
                style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'8px 15px', borderRadius:'var(--radius-pill)', cursor:'pointer',
                  font:'600 13px/1 var(--font-body)', transition:'all var(--dur-fast)',
                  borderWidth:1, borderStyle:'solid',
                  background: on ? 'var(--fg-0)' : 'transparent',
                  borderColor: on ? 'transparent' : 'var(--border-default)',
                  color: on ? 'var(--bg-0)' : 'var(--fg-1)' }}>
                {label}
                <span style={{ font:'600 11px/1 var(--font-mono)', color: on ? 'rgba(10,10,10,0.5)' : 'var(--fg-3)' }}>{counts[label]}</span>
              </button>
            );
          })}
        </div>
      </div>
      {shown.length ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(168px, 1fr))', gap:24 }}>
          {shown.map(f => <WorkCard key={f.id} film={f} onOpen={onOpen} />)}
        </div>
      ) : (
        <div style={{ padding:'60px 0', textAlign:'center', font:'var(--text-body)', color:'var(--fg-2)' }}>
          Nothing here yet — this creator hasn't released a {tab.toLowerCase().replace(/s$/, '')}.
        </div>
      )}
    </section>
  );
}

// ---- humorous empty state: no creator account yet ----
function NoCreatorContent({ onApp, searchQ, onQuery, onSearch, onOpenResult }) {
  return (
    <div style={{ minHeight:'100vh' }}>
      <NavBar active="" onNav={onApp} query={searchQ||''} onQuery={onQuery} onSearch={onSearch} onOpenResult={onOpenResult} />
      <div style={{ maxWidth:620, margin:'0 auto', padding:'80px 28px 90px', textAlign:'center' }}>
        <div style={{ width:104, height:104, margin:'0 auto 28px', borderRadius:'50%', position:'relative',
          display:'flex', alignItems:'center', justifyContent:'center',
          background:'var(--bg-1)', border:'1px solid var(--border-subtle)' }}>
          <div style={{ position:'absolute', inset:0, borderRadius:'50%',
            background:'radial-gradient(circle at 50% 35%, rgba(216,90,48,0.22), transparent 70%)' }} />
          <Icon name="ghost" size={46} color="var(--coral-bright)" weight="fill" />
        </div>
        <h1 style={{ font:'700 clamp(30px,5vw,42px)/1.08 var(--font-display)', letterSpacing:'-0.015em', color:'var(--fg-0)', margin:'0 0 16px' }}>
          A stunning body of work.<br />Truly. Nothing.
        </h1>
        <p style={{ font:'var(--text-body-lg)', color:'var(--fg-1)', margin:'0 auto 10px', maxWidth:460 }}>
          We searched everywhere — under the render queue, behind the GPU, in the latent space.
          You haven’t published a single frame.
        </p>
        <p style={{ font:'var(--text-body)', color:'var(--fg-2)', margin:'0 auto 32px', maxWidth:460 }}>
          That’s because <b style={{ color:'var(--fg-1)' }}>My Contents</b> lives on a <b style={{ color:'var(--fg-1)' }}>creator account</b> —
          a separate identity you publish and get rated under. You don’t have one yet. Want to fix that?
        </p>
        <a href="creator-setup.html" style={{ display:'inline-flex', alignItems:'center', gap:9, padding:'14px 26px', borderRadius:'var(--radius-md)',
          background:'var(--coral)', color:'var(--fg-on-accent)', font:'600 15px/1 var(--font-body)', textDecoration:'none', boxShadow:'var(--shadow-1)' }}
          onMouseEnter={e=>e.currentTarget.style.background='var(--coral-bright)'} onMouseLeave={e=>e.currentTarget.style.background='var(--coral)'}>
          <Icon name="plus" size={16} color="var(--fg-on-accent)" weight="bold" /> Create a creator account
        </a>
        <div style={{ marginTop:18 }}>
          <a onClick={() => onApp && onApp('')} style={{ cursor:'pointer', font:'500 13px/1 var(--font-body)', color:'var(--fg-3)' }}>
            ← Maybe later, back to browsing
          </a>
        </div>
      </div>
    </div>
  );
}

// ---- the page ----
function CreatorPage() {
  const accounts = useCreatorAccounts();
  const wantsManage = typeof window !== 'undefined' && (
    /[?&]manage=1/.test(window.location.search) ||
    /my-contents\.html/.test(window.location.pathname)
  );
  const [manage, setManage] = React.useState(wantsManage);
  const [showEdit, setShowEdit] = React.useState(false);
  const [creator, setCreator] = React.useState(undefined);
  const [isOwner, setIsOwner] = React.useState(false);

  let params = {};
  try { params = new URLSearchParams(window.location.search); } catch (e) {}
  const accountId = params.get && params.get('account');
  const name = params.get && params.get('name');
  const isMyContents = wantsManage && !name && !accountId;

  React.useEffect(() => {
    (async () => {
      if (isMyContents) {
        await window.AICDB_CREATOR_ACCOUNTS.load();
        const acct = window.AICDB_CREATOR_ACCOUNTS.get()[0];
        setCreator(acct ? creatorFromAccount(acct) : null);
        setIsOwner(true);
        return;
      }
      if (accountId && window.AICDB_CREATOR_ACCOUNTS) {
        await window.AICDB_CREATOR_ACCOUNTS.load();
        const acct = window.AICDB_CREATOR_ACCOUNTS.byId(accountId);
        setCreator(acct ? creatorFromAccount(acct) : null);
        setIsOwner(true);
        return;
      }
      if (name) {
        try {
          const sb = await window.AICDB_AUTH.getClient();
          const { data } = await sb
            .from('creator_profiles')
            .select('*')
            .eq('display_name', name)
            .maybeSingle();
          if (data) {
            const { data: worksData } = await sb
              .from('content')
              .select('id, title, poster_url, type, content_stats(rating_avg, rating_count)')
              .eq('creator_id', data.id)
              .eq('status', 'published');
            setCreator(creatorFromDbRow(data, computeCreatorContentStats(worksData)));
            const session = await window.AICDB_AUTH.getSession();
            setIsOwner(!!session && session.user.id === data.user_id);
            return;
          }
        } catch (e) {}
      }
      setCreator(null);
      setIsOwner(false);
    })();
  }, [accountId, name, isMyContents]);

  const open = (f) => { window.location.href = 'index.html'; };
  const goApp = (label) => { window.location.href = 'index.html' + (label ? '#' + encodeURIComponent(label) : ''); };
  const [searchQ, setSearchQ] = React.useState('');
  const goSearch = (term) => { if (term) window.location.href = 'index.html?q=' + encodeURIComponent(term); };
  const goFilm   = (film)  => { window.location.href = 'index.html?film=' + encodeURIComponent(film.id); };

  if (creator === undefined) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ font:'var(--text-body)', color:'var(--fg-2)' }}>Loading...</div>
      </div>
    );
  }

  // My Contents with no creator account → humorous empty state
  if (isMyContents && accounts.length === 0) {
    return <NoCreatorContent onApp={goApp} searchQ={searchQ} onQuery={setSearchQ} onSearch={goSearch} onOpenResult={goFilm} />;
  }

  // No real creator to show (e.g. the page was opened without a valid creator)
  if (!creator) {
    return (
      <div style={{ minHeight:'100vh' }}>
        <NavBar active="" onNav={goApp} query={searchQ} onQuery={setSearchQ} onSearch={goSearch} onOpenResult={goFilm} />
        <div style={{ maxWidth:560, margin:'0 auto', padding:'90px 28px', textAlign:'center' }}>
          <div style={{ width:96, height:96, margin:'0 auto 24px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
            background:'var(--bg-1)', border:'1px solid var(--border-subtle)' }}>
            <Icon name="user" size={40} color="var(--fg-3)" />
          </div>
          <h1 style={{ font:'700 clamp(26px,4vw,34px)/1.1 var(--font-display)', letterSpacing:'-0.015em', color:'var(--fg-0)', margin:'0 0 14px' }}>
            No creator to show
          </h1>
          <p style={{ font:'var(--text-body-lg)', color:'var(--fg-2)', margin:'0 auto 28px', maxWidth:420 }}>
            There’s no creator account here yet. When creators publish to Dreamwall, their pages will appear here.
          </p>
          <a onClick={() => goApp('')} style={{ display:'inline-flex', alignItems:'center', gap:9, padding:'13px 24px', borderRadius:'var(--radius-md)',
            background:'var(--coral)', color:'var(--fg-on-accent)', font:'600 15px/1 var(--font-body)', textDecoration:'none', cursor:'pointer' }}>
            <Icon name="arrow-left" size={16} color="var(--fg-on-accent)" /> Back to browsing
          </a>
        </div>
      </div>
    );
  }

  const drafts = creator === CREATOR ? DRAFTS : [];
  const byId = filmsById();
  const typeMap = { film: 'movie', series: 'series', short: 'short', vertical: 'vertical' };
  const worksFromList = (creator.worksList || []).map(w => {
    const cat = byId[w.id];
    if (cat) return cat;
    return {
      id: w.id,
      title: w.title,
      poster_url: w.poster_url,
      type: typeMap[w.type] || w.type,
      g: ['#1a1a2e', '#16213e'],
      score: 0,
      ratings: 0,
      year: '',
    };
  });
  const works = creator.works.length
    ? creator.works.map(id => byId[id]).filter(Boolean)
    : worksFromList;

  const totalViews = works.reduce((sum, f) => sum + window.AICDB_STAT(f).watched, 0);

  // published rows for the studio panel
  const published = works.map(f => ({ film:f, stat: window.AICDB_STAT(f) }));

  return (
    <div style={{ minHeight:'100vh' }}>
      <NavBar active="" onNav={goApp} query={searchQ} onQuery={setSearchQ} onSearch={goSearch} onOpenResult={goFilm} />
      <div style={{ maxWidth:1180, margin:'0 auto', padding:'28px 28px 96px' }}>
        <CreatorHero creator={creator} isOwner={isOwner} manage={manage} onEditClick={setShowEdit} />
        <CreatorStatStrip creator={creator} totalViews={fmtCount(totalViews)} />
        {manage && <ManagePanel published={published} drafts={drafts} />}
        <WorksSection films={works} onOpen={open} />
        {(creator.tools.length > 0 || creator.influences.length > 0 || creator.notes) && (
          <AboutSection creator={creator} />
        )}
      </div>
      {showEdit && isOwner && (
        <CreatorEditPanel
          creator={creator}
          onClose={() => setShowEdit(false)}
          onSaved={() => { setShowEdit(false); window.location.reload(); }}
        />
      )}
    </div>
  );
}

Object.assign(window, { CreatorPage, NoCreatorContent, WorksSection, WorkCard, CREATOR, DRAFTS });
