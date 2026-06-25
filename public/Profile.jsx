// Dreamwall UI kit — User profile page
// Dark cinematic. Reuses Primitives (Icon, Button, Avatar, StarRating, ScoreRing,
// ContentBadge, scoreColor), NavBar, FilmCard, and AICDB_FILMS / AICDB_TYPES.
const DEFAULT_PROFILE_BANNER = 'https://zvvkejehuludrsabsesd.supabase.co/storage/v1/object/public/images/default/defaultprofile_banner.jpg.png';
const PROFILE = {
  name: 'Guest',
  initials: 'G',
  joined: 'Not signed in',
  bio: '',
  quote: '',
  quotFrom: '',
  avatar: ['#5a5e66', '#3a3d44'],
  avatarUrl: null,
  bannerUrl: null,
  watched: 0,
  lists: 0,
  avgRating: 0,
  hours: 0,
  reviews: 0,
  thisYear: 0,
  favGenre: '—',
  favGenreShare: 'No ratings yet',
};
// Populate PROFILE from the active Supabase session + the profiles table row.
// The profiles row is authoritative for display_name, username, created_at, and avatar_url.
async function loadProfileFromSession(session) {
  if (!session || !session.user) return;
  const u     = session.user;
  const email = u.email || '';
  const meta  = u.user_metadata || {};

  // Optimistic fill from JWT while we wait for the DB row.
  const rawJwt  = meta.full_name || meta.name || meta.display_name || email.split('@')[0] || 'Member';
  const nameJwt = rawJwt.charAt(0).toUpperCase() + rawJwt.slice(1);
  PROFILE.name     = nameJwt;
  PROFILE.initials = nameJwt.charAt(0).toUpperCase();
  PROFILE.avatar   = window.AICDB_MAIN_ACCOUNT ? window.AICDB_MAIN_ACCOUNT.avatar : ['#d85a30', '#9d8df1'];

  // Use auth.users.created_at as a first-pass join date.
  const authCreated = u.created_at ? new Date(u.created_at) : null;
  PROFILE.joined = authCreated
    ? 'Joined ' + authCreated.toLocaleDateString('en-US', { month:'long', year:'numeric' })
    : 'Member';

  // Fetch the profiles row for the authoritative display_name and created_at.
  try {
    const sb = await window.AICDB_AUTH.getClient();
    const { data } = await sb
      .from('profiles')
      .select('display_name, created_at, bio, avatar_url, banner_url, quote, quote_from')
      .eq('id', u.id)
      .maybeSingle();

    if (data) {
      const profileName = data.display_name || nameJwt;
      PROFILE.name      = profileName.charAt(0).toUpperCase() + profileName.slice(1);
      PROFILE.initials  = PROFILE.name.charAt(0).toUpperCase();
      PROFILE.bio       = data.bio || '';
      PROFILE.avatarUrl = data.avatar_url || null;
      PROFILE.bannerUrl = data.banner_url || null;
      PROFILE.quote     = data.quote || '';
      PROFILE.quoteFrom = data.quote_from || '';

      // profiles.created_at is when the trigger ran — i.e. first ever sign-in.
      // Use it if it's a valid date; fall back to auth.users.created_at.
      const profileCreated = data.created_at ? new Date(data.created_at) : null;
      const joinDate = profileCreated || authCreated;
      PROFILE.joined = joinDate
        ? 'Joined ' + joinDate.toLocaleDateString('en-US', { month:'long', year:'numeric' })
        : 'Member';
    }
  } catch (_) {}
}

async function loadProfileFromUserId(userId) {
  PROFILE.avatar = window.AICDB_MAIN_ACCOUNT ? window.AICDB_MAIN_ACCOUNT.avatar : ['#d85a30', '#9d8df1'];
  try {
    const sb = await window.AICDB_AUTH.getClient();
    const { data } = await sb
      .from('profiles')
      .select('display_name, created_at, bio, avatar_url, banner_url, quote, quote_from')
      .eq('id', userId)
      .maybeSingle();

    if (data) {
      const profileName = data.display_name || 'Member';
      PROFILE.name      = profileName.charAt(0).toUpperCase() + profileName.slice(1);
      PROFILE.initials  = PROFILE.name.charAt(0).toUpperCase();
      PROFILE.bio       = data.bio || '';
      PROFILE.avatarUrl = data.avatar_url || null;
      PROFILE.bannerUrl = data.banner_url || null;
      PROFILE.quote     = data.quote || '';
      PROFILE.quoteFrom = data.quote_from || '';

      const profileCreated = data.created_at ? new Date(data.created_at) : null;
      PROFILE.joined = profileCreated
        ? 'Joined ' + profileCreated.toLocaleDateString('en-US', { month:'long', year:'numeric' })
        : 'Member';
    } else {
      PROFILE.name     = 'Unknown User';
      PROFILE.initials = 'U';
      PROFILE.bio      = '';
      PROFILE.avatarUrl = null;
      PROFILE.bannerUrl = null;
      PROFILE.quote    = '';
      PROFILE.quoteFrom = '';
      PROFILE.joined   = 'Member';
    }
  } catch (_) {
    PROFILE.name     = 'Unknown User';
    PROFILE.initials = 'U';
  }
}

async function loadLastRated(userId) {
  LAST_RATED.length = 0;
  if (!userId) return;
  try {
    const sb = await window.AICDB_AUTH.getClient();
    const { data: rows, error } = await sb
      .from('ratings')
      .select('content_id, main_score, created_at')
      .eq('user_id', userId)
      .is('episode_id', null)
      .order('created_at', { ascending: false })
      .limit(5);
    if (error || !rows) return;
    const byId = filmsById();
    rows.forEach(row => {
      if (!row.content_id || !byId[row.content_id]) return;
      LAST_RATED.push({
        id: row.content_id,
        score: row.main_score,
        you: parseFloat(row.main_score),
        date: row.created_at,
      });
    });
  } catch (_) {}
}

function filmsById() {
  const m = {};
  window.AICDB_FILMS.forEach(f => { m[f.id] = f; });
  return m;
}

const LAST_RATED = [];

function fmtRatedDate(iso) {
  try {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
  } catch (e) { return iso; }
}
// ---- Section heading (centered or left) ----
function SectionHeading({ children, align = 'left', sub, marginBottom = 22 }) {
  return (
    <div style={{ textAlign: align, marginBottom }}>
      <h2 style={{ font:'var(--text-h2)', color:'var(--fg-0)', letterSpacing:'-0.01em' }}>{children}</h2>
      {sub && <p style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', margin:'6px 0 0' }}>{sub}</p>}
    </div>
  );
}

// ---- TOP: profile / watched / lists ----
function TopSection({ onEdit, onOpenList, isOwnProfile = true, creatorAccounts = [], viewedUserId }) {
  const [creatorMenuOpen, setCreatorMenuOpen] = React.useState(false);
  const creatorMenuRef = React.useRef(null);
  const [following, setFollowing] = React.useState(() => window.AICDB_FOLLOWS?.isFollowing('user', viewedUserId) || false);
  const [followHover, setFollowHover] = React.useState(false);

  React.useEffect(() => window.AICDB_FOLLOWS?.subscribe(() => setFollowing(window.AICDB_FOLLOWS.isFollowing('user', viewedUserId))), [viewedUserId]);

  React.useEffect(() => {
    if (!creatorMenuOpen) return;
    const h = (e) => {
      if (creatorMenuRef.current && !creatorMenuRef.current.contains(e.target)) {
        setCreatorMenuOpen(false);
      }
    };
    window.addEventListener('mousedown', h);
    return () => window.removeEventListener('mousedown', h);
  }, [creatorMenuOpen]);

  return (
    <div style={{ position:'relative', minHeight:400, marginBottom:60 }}>
      {/* cinematic banner — absolutely positioned so it takes no flow height.
          Height 400px extends it as a background layer behind the content card;
          the content card sits on top via z-index without any vertical shift. */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:400,
        borderRadius:'var(--radius-xl)', overflow:'hidden', zIndex:0,
        background: (PROFILE.bannerUrl || DEFAULT_PROFILE_BANNER)
          ? `url(${PROFILE.bannerUrl || DEFAULT_PROFILE_BANNER}) center/cover no-repeat`
          : 'linear-gradient(120deg, #2a1410 0%, #241a3a 50%, #10302d 120%)' }}>
        {PROFILE.bannerUrl ? (
          <img src={PROFILE.bannerUrl} alt=""
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
        ) : null}
        {/* YouTube-style fade to background at the bottom — always present */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(10,10,10,0.05), var(--bg-0) 96%)' }} />
      </div>

      {/* overlapping content card — sits on top of the banner via z-index.
          The 200px spacer gives the card its original top offset (matching the
          old in-flow banner height) so nothing shifts vertically. */}
      <div style={{ height:200 }} />
      <div className="aicdb-profile-top" style={{ position:'relative', margin:'-72px 20px 0', padding:'0 8px',
        zIndex:1, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', alignItems:'center' }}>

        {/* LEFT — photo + identity */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', padding:'0 28px' }}>
          {/* Avatar: real photo or gradient + initials fallback */}
          <div style={{ width:128, height:128, borderRadius:'50%', flex:'none', position:'relative',
            background: PROFILE.avatarUrl ? 'transparent' : `linear-gradient(135deg, ${PROFILE.avatar[0]}, ${PROFILE.avatar[1]})`,
            border:'4px solid var(--bg-0)', boxShadow:'var(--shadow-3)',
            display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
            {PROFILE.avatarUrl ? (
              <img src={PROFILE.avatarUrl} alt={PROFILE.name}
                style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} />
            ) : (
              <>
                <span style={{ font:'600 56px/1 var(--font-display)', color:'rgba(255,255,255,0.92)' }}>{PROFILE.initials}</span>
                <div style={{ position:'absolute', inset:0, borderRadius:'50%',
                  boxShadow:'inset 0 2px 18px rgba(255,255,255,0.25), inset 0 -10px 24px rgba(0,0,0,0.35)' }} />
              </>
            )}
          </div>
          <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginTop:18 }}>
            <h1 style={{ font:'700 30px/1.1 var(--font-display)', letterSpacing:'-0.015em', color:'var(--fg-0)', margin:0, flex:1, minWidth:0 }}>{PROFILE.name}</h1>
            {isOwnProfile && window.AICDB_AUTH && window.AICDB_AUTH.isLoggedIn() && onEdit && (
              <button onClick={onEdit} title="Edit profile"
                style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'7px 12px', flex:'none',
                  borderRadius:'var(--radius-md)', background:'var(--bg-2)', border:'1px solid var(--border-default)',
                  color:'var(--fg-1)', font:'600 12.5px/1 var(--font-body)', cursor:'pointer',
                  transition:'all var(--dur-fast)', marginTop:4 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.color = 'var(--fg-0)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--fg-1)'; }}>
                <Icon name="pencil-simple" size={13} color="currentColor" /> Edit
              </button>
            )}
          </div>
          {!isOwnProfile && viewedUserId && window.AICDB_AUTH && window.AICDB_AUTH.isLoggedIn() && (
            <button
              onClick={() => {
                if (!window.AICDB_REQUIRE_AUTH('Sign in to follow users.')) return;
                window.AICDB_FOLLOWS.toggle('user', viewedUserId);
              }}
              onMouseEnter={() => setFollowHover(true)}
              onMouseLeave={() => setFollowHover(false)}
              style={{
                marginTop:12, padding:'8px 16px', borderRadius:'var(--radius-pill)', cursor:'pointer',
                font:'600 13px/1 var(--font-body)', transition:'all var(--dur-fast)',
                background: following ? 'transparent' : 'var(--teal-ghost)',
                color: following ? (followHover ? 'var(--score-low)' : 'var(--fg-2)') : 'var(--teal-bright)',
                border:'1px solid ' + (following ? (followHover ? 'var(--score-low)' : 'var(--border-default)') : 'var(--teal-bright)'),
              }}>
              {following ? (followHover ? 'Unfollow' : 'Following') : 'Follow'}
            </button>
          )}
          <div style={{ font:'var(--text-data-sm)', color:'var(--fg-2)', marginTop:8, display:'flex', alignItems:'center', gap:6 }}>
            <Icon name="clock" size={13} color="var(--fg-3)" />{PROFILE.joined}
          </div>
          {PROFILE.bio ? (
            <p style={{ font:'var(--text-body-sm)', color:'var(--fg-1)', margin:'10px 0 0', maxWidth:260, lineHeight:1.55 }}>
              {PROFILE.bio}
            </p>
          ) : null}
          {PROFILE.quote ? (
            <div style={{ margin:'14px 0 0', maxWidth:260, borderLeft:'2px solid var(--coral-dim)', paddingLeft:12 }}>
              <p style={{ font:'400 italic 15px/1.45 var(--font-display)', color:'var(--fg-1)', fontStyle:'italic', margin:0 }}>
                "{PROFILE.quote}"
              </p>
              {PROFILE.quoteFrom ? (
                <p style={{ font:'500 13px/1 var(--font-body)', color:'var(--fg-2)', margin:'7px 0 0' }}>
                  — {PROFILE.quoteFrom}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* CENTER — watched stat */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', paddingTop:72,
          borderLeft:'1px solid transparent', borderRight:'1px solid transparent' }}>
          <div style={{ font:'700 72px/0.95 var(--font-mono)', color:'var(--fg-0)', letterSpacing:'-0.02em' }}>
            {PROFILE.watched.toLocaleString()}
          </div>
          <div className="overline" style={{ marginTop:12, color:'var(--fg-1)' }}>Watched</div>
        </div>

        {/* RIGHT — Also creating as + Following / Created lists */}
        <div style={{ display:'flex', flexDirection:'column', gap:12, paddingTop:72, width:'100%' }}>
          {creatorAccounts.length > 0 && (
            <div ref={creatorMenuRef} style={{ position:'relative', width:'100%' }}>
              <button type="button" onClick={() => setCreatorMenuOpen(o => !o)}
                style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px',
                  borderRadius:'var(--radius-md)', border:'1px solid var(--border-subtle)', background:'var(--bg-1)',
                  cursor:'pointer', width:'100%', font:'600 12px/1 var(--font-body)', color:'var(--fg-2)' }}>
                <span style={{ display:'inline-flex', alignItems:'center', gap:6, minWidth:0 }}>
                  <Icon name="mask-happy" size={13} color="var(--fg-3)" />
                  Also creating as
                  {creatorAccounts.slice(0, 3).map(a => (
                    <span key={a.id} style={{ width:18, height:18, borderRadius:'50%', flex:'none',
                      background: a.avatar ? 'linear-gradient(135deg, ' + a.avatar[0] + ', ' + a.avatar[1] + ')' : 'var(--bg-3)',
                      display:'inline-flex', alignItems:'center', justifyContent:'center',
                      font:'600 9px/1 var(--font-display)', color:'rgba(255,255,255,0.92)' }}>
                      {(a.name || 'C').charAt(0).toUpperCase()}
                    </span>
                  ))}
                </span>
                <Icon name={creatorMenuOpen ? 'chevron-down' : 'chevron-right'} size={13} color="var(--fg-3)" />
              </button>
              {creatorMenuOpen && (
                <div style={{ position:'absolute', top:'100%', left:0, right:0, marginTop:6, zIndex:50,
                  background:'var(--bg-1)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-lg)',
                  padding:8, minWidth:200, boxShadow:'var(--shadow-2)' }}>
                  {creatorAccounts.map(a => (
                    <div key={a.id}
                      onClick={() => { window.location.href = 'creator.html?account=' + encodeURIComponent(a.id); }}
                      style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', borderRadius:'var(--radius-md)', cursor:'pointer' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-2)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                      <div style={{ width:28, height:28, borderRadius:'50%', flex:'none',
                        background: a.avatar ? `linear-gradient(135deg, ${a.avatar[0]}, ${a.avatar[1]})` : 'var(--bg-3)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        font:'600 11px/1 var(--font-display)', color:'rgba(255,255,255,0.92)' }}>
                        {(a.name || 'C').charAt(0).toUpperCase()}
                      </div>
                      <div style={{ minWidth:0 }}>
                        <div style={{ font:'600 13px/1.2 var(--font-body)', color:'var(--fg-0)' }}>{a.name}</div>
                        {a.handle ? (
                          <div style={{ font:'var(--text-data-sm)', fontSize:11, color:'var(--fg-2)', marginTop:3 }}>{a.handle}</div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div style={{ display:'flex', flexDirection:'row', gap:10 }}>
            <div style={{ flex:1, minWidth:0 }}><FollowingBox isOwnProfile={isOwnProfile} viewedUserId={viewedUserId} /></div>
            <div style={{ flex:1, minWidth:0 }}><CreatedListsBox onOpenList={onOpenList} isOwnProfile={isOwnProfile} viewedUserId={viewedUserId} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
// ---- Followed Creators — profile cards for creators the user follows ----

function FollowedSeal({ size = 14 }) {
  return <Icon name="seal-check" size={size} color="var(--teal-bright)" weight="fill" />;
}

// ============================================================
// Following: compact box (top-right) + management modal
// Privacy is now a single list-wide setting (Public / Private) controlled
// from one button in the modal's top-right corner. When Private, the public
// box shows only a lock + "Followed" — no names or details to others.
// ============================================================

// list-wide privacy state, persisted as a single boolean.
function useFollowVisibility() {
  const KEY = 'aicdb_follow_private';
  const [isPrivate, setIsPrivate] = React.useState(() => {
    try { const s = localStorage.getItem(KEY); if (s != null) return JSON.parse(s); } catch (e) {}
    return false;
  });
  React.useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(isPrivate)); } catch (e) {} }, [isPrivate]);
  return [isPrivate, setIsPrivate];
}

function resolveFollowDisplay(follow) {
  const id = follow.target_id;
  if (follow.target_type === 'creator') {
    const found = (window.AICDB_CREATORS || []).find(c => c.id === id);
    if (found) return { type: 'creator', creator: found };
  }
  const letter = String(id || '?').charAt(0).toUpperCase();
  return { type: 'placeholder', id, letter };
}

function followsToCreatorRows(follows) {
  return follows.map(f => {
    if (f.target_type === 'creator') {
      const c = (window.AICDB_CREATORS || []).find(x => x.id === f.target_id);
      if (c) return c;
    }
    const letter = String(f.target_id || '?').charAt(0).toUpperCase();
    return {
      id: f.target_id,
      name: letter,
      handle: '',
      verified: false,
      av: ['#5a5e66', '#3a3d44'],
    };
  });
}

// overlapping avatar disc — gradient for public, lock for private
function FollowDisc({ creator, isPrivate, size = 30, idx = 0 }) {
  const common = { width:size, height:size, borderRadius:'50%', flex:'none', position:'relative',
    border:'2px solid var(--bg-1)', marginLeft: idx === 0 ? 0 : -10, boxShadow:'var(--shadow-1)' };
  if (isPrivate) {
    return (
      <div title="Followed — private" style={{ ...common, background:'var(--bg-3)',
        display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Icon name="lock-simple" size={Math.round(size*0.46)} color="var(--fg-2)" weight="fill" />
      </div>
    );
  }
  return <div title={creator.name} style={{ ...common,
    background:`linear-gradient(135deg, ${creator.av[0]}, ${creator.av[1]})` }} />;
}

function FollowingBox({ isOwnProfile = true, viewedUserId }) {
  const [open, setOpen] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const [isPrivate, setIsPrivate] = useFollowVisibility();
  const [follows, setFollows] = React.useState(() =>
    isOwnProfile ? (window.AICDB_FOLLOWS?.get() || []) : []);

  React.useEffect(() => {
    if (!isOwnProfile) return;
    window.AICDB_FOLLOWS?.load();
    return window.AICDB_FOLLOWS?.subscribe(setFollows);
  }, [isOwnProfile]);

  React.useEffect(() => {
    if (isOwnProfile || !viewedUserId) return;
    (async () => {
      const sb = await window.AICDB_AUTH.getClient();
      const { data } = await sb.from('follows').select('*').eq('follower_user_id', viewedUserId);
      setFollows(data || []);
    })();
  }, [isOwnProfile, viewedUserId]);

  const total = follows.length;
  const followed = followsToCreatorRows(follows);

  const boxStyle = { position:'relative', padding:'14px 16px', height:'100%', background: hover && isOwnProfile ? 'var(--bg-2)' : 'var(--bg-1)',
    border:'1px solid', borderColor: hover && isOwnProfile ? 'var(--border-accent)' : 'var(--border-default)',
    borderRadius:'var(--radius-lg)', cursor: isOwnProfile ? 'pointer' : 'default',
    transform: hover && isOwnProfile ? 'translateY(-2px)' : 'none',
    transition:'border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), transform var(--dur-base) var(--ease-out)' };

  const inner = (
    <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', height:'100%' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ font:'700 28px/0.9 var(--font-mono)', color:'var(--coral)' }}>{total}</span>
        <Icon name="users" size={16} color="var(--coral-dim)" weight="fill" />
      </div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:12 }}>
        <span className="overline" style={{ color:'var(--fg-1)' }}>Following</span>
      </div>
    </div>
  );

  if (!isOwnProfile) {
    return <div style={boxStyle}>{inner}</div>;
  }

  return (
    <>
      <div role="button" tabIndex={0} onClick={() => setOpen(true)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(true); } }}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={boxStyle}>
        {inner}
      </div>
      {open && <FollowingModal followed={followed} isPrivate={isPrivate} setIsPrivate={setIsPrivate} onClose={() => setOpen(false)} />}
    </>
  );
}

function FollowingModal({ followed, isPrivate, setIsPrivate, onClose }) {
  React.useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div onClick={onClose}
      style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24,
        background:'rgba(5,5,5,0.74)', backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)' }}>
      <style>{`@keyframes aicdbModalIn{from{transform:translateY(14px) scale(0.985)}to{transform:none}}`}</style>
      <div onClick={e => e.stopPropagation()}
        style={{ position:'relative', width:'100%', maxWidth:480, maxHeight:'82vh', display:'flex', flexDirection:'column',
          background:'var(--bg-1)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-xl)',
          boxShadow:'var(--shadow-3)', overflow:'hidden', animation:'aicdbModalIn 0.34s var(--ease-out) both' }}>

        {/* header — title (left) · privacy button + close (top-right) */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, padding:'24px 26px 18px',
          borderBottom:'1px solid var(--border-subtle)' }}>
          <div>
            <h2 style={{ font:'600 22px/1.2 var(--font-display)', color:'var(--fg-0)', margin:0 }}>Following</h2>
            <p style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', margin:'7px 0 0' }}>
              {followed.length} creators · list is {isPrivate ? 'hidden from others' : 'visible to others'}
            </p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10, flex:'none' }}>
            <ListPrivacyButton isPrivate={isPrivate} onToggle={() => setIsPrivate(p => !p)} />
            <button onClick={onClose} style={{ display:'flex', padding:8, borderRadius:'50%', flex:'none', cursor:'pointer',
              background:'var(--bg-2)', border:'1px solid var(--border-default)' }}>
              <Icon name="x" size={15} color="var(--fg-1)" />
            </button>
          </div>
        </div>

        {/* list */}
        <div style={{ overflowY:'auto', padding:'8px 14px 14px' }}>
          {followed.map(c => (
            <div key={c.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 12px' }}>
              <div style={{ position:'relative', flex:'none' }}>
                <div style={{ width:46, height:46, borderRadius:'50%',
                  background:`linear-gradient(135deg, ${c.av[0]}, ${c.av[1]})`,
                  filter: isPrivate ? 'grayscale(0.5) brightness(0.7)' : 'none',
                  boxShadow:'var(--shadow-1)' }} />
                {isPrivate && (
                  <div style={{ position:'absolute', right:-3, bottom:-3, width:20, height:20, borderRadius:'50%',
                    background:'var(--bg-2)', border:'1px solid var(--border-default)',
                    display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon name="lock-simple" size={11} color="var(--fg-1)" weight="fill" />
                  </div>
                )}
              </div>
              <div style={{ minWidth:0, flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ font:'600 15px/1.2 var(--font-body)', color:'var(--fg-0)',
                    whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.name}</span>
                  {c.verified && <FollowedSeal size={13} />}
                </div>
                <div style={{ font:'var(--text-data-sm)', color:'var(--fg-2)', marginTop:3 }}>{c.handle}</div>
              </div>
              <FollowingButton />
            </div>
          ))}
        </div>

        {/* footer note */}
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 26px', borderTop:'1px solid var(--border-subtle)',
          background:'var(--bg-0)' }}>
          <Icon name={isPrivate ? 'lock-simple' : 'eye'} size={15} color="var(--fg-2)" weight={isPrivate ? 'fill' : 'regular'} />
          <span style={{ font:'var(--text-body-sm)', color:'var(--fg-2)' }}>
            {isPrivate
              ? 'Your whole Following list is private — others see only a lock, no names or details.'
              : 'Your Following list is public — anyone can see who you follow.'}
          </span>
        </div>
      </div>
    </div>
  );
}

function FollowingButton() {
  const [following, setFollowing] = React.useState(true);
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={() => setFollowing(f => !f)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', gap:7, padding:'9px 0', width:'100%',
        borderRadius:'var(--radius-md)', cursor:'pointer', font:'600 13px/1 var(--font-body)', transition:'all var(--dur-fast)',
        borderWidth:1, borderStyle:'solid',
        background: following ? 'transparent' : (hover ? 'var(--coral-bright)' : 'var(--coral)'),
        borderColor: following ? 'var(--border-strong)' : 'transparent',
        color: following ? (hover ? 'var(--score-low)' : 'var(--fg-1)') : 'var(--fg-on-accent)' }}>
      <Icon name={following ? (hover ? 'x' : 'check') : 'plus'} size={14} color="currentColor" weight="bold" />
      {following ? (hover ? 'Unfollow' : 'Following') : 'Follow'}
    </button>
  );
}

function FollowedCreatorCard({ creator }) {
  const [hover, setHover] = React.useState(false);
  const st = window.AICDB_CREATOR_STATS ? window.AICDB_CREATOR_STATS(creator) : { works: 0, avg: 0 };
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ background:'var(--bg-1)', borderRadius:'var(--radius-lg)', padding:'20px 20px 18px',
        borderWidth:1, borderStyle:'solid', borderColor: hover ? 'var(--border-default)' : 'var(--border-subtle)',
        transition:'border-color var(--dur-fast), transform var(--dur-base)', transform: hover ? 'translateY(-3px)' : 'none' }}>
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
        <a href={'creator.html?name=' + encodeURIComponent(creator.name)} style={{ flex:'none' }}>
          <div style={{ width:54, height:54, borderRadius:'50%',
            background:`linear-gradient(135deg, ${creator.av[0]}, ${creator.av[1]})`, boxShadow:'var(--shadow-1)' }} />
        </a>
        <div style={{ minWidth:0, flex:1 }}>
          <a href={'creator.html?name=' + encodeURIComponent(creator.name)}
            style={{ display:'flex', alignItems:'center', gap:6, textDecoration:'none' }}>
            <span style={{ font:'600 16px/1.2 var(--font-display)', color:'var(--fg-0)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{creator.name}</span>
            {creator.verified && <FollowedSeal size={14} />}
          </a>
          <div style={{ font:'var(--text-data-sm)', color:'var(--fg-2)', marginTop:3 }}>{creator.handle}</div>
        </div>
      </div>
      <div style={{ display:'flex', gap:4, marginBottom:16, padding:'12px 0', borderTop:'1px solid var(--border-subtle)', borderBottom:'1px solid var(--border-subtle)' }}>
        {[
          [fmtCount(creator.followers), 'Followers', 'var(--fg-0)'],
          [st.works, 'Works', 'var(--fg-0)'],
          [st.avg ? st.avg.toFixed(1) : '—', 'Avg score', scoreColor(st.avg)],
        ].map(([v, l, col], i) => (
          <React.Fragment key={l}>
            {i > 0 && <div style={{ width:1, background:'var(--border-subtle)' }} />}
            <div style={{ flex:1, textAlign:'center' }}>
              <div style={{ font:'700 16px/1 var(--font-mono)', color:col }}>{v}</div>
              <div className="overline" style={{ color:'var(--fg-2)', marginTop:6 }}>{l}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <FollowingButton />
    </div>
  );
}

function FollowedCreators() {
  const byId = {};
  (window.AICDB_CREATORS || []).forEach(c => { byId[c.id] = c; });
  const followed = [];
  if (!followed.length) return null;
  return (
    <section style={{ marginBottom:64 }}>
      <SectionHeading align="center" sub={`${followed.length} creators you follow`}>Followed Creators</SectionHeading>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(248px, 1fr))', gap:18 }}>
        {followed.map(c => <FollowedCreatorCard key={c.id} creator={c} />)}
      </div>
    </section>
  );
}

// ---- Page ----
function Profile({ embedded = false, onOpen, onOpenList, viewedUserId }) {
  const isOwnProfile = !viewedUserId;
  const allCreatorAccounts = useCreatorAccounts();
  const creatorAccounts = isOwnProfile ? allCreatorAccounts.filter(a => a.showOnProfile) : [];
  const [profileUserId, setProfileUserId] = React.useState(viewedUserId || null);
  const [favoriteCount, setFavoriteCount] = React.useState(0);
  const [showAllRatings, setShowAllRatings] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);
  const [activeListId, setActiveListId] = React.useState(() => {
    if (embedded) return null;
    try { return new URLSearchParams(window.location.search).get('list') || null; } catch (e) { return null; }
  });
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => {
    if (viewedUserId) {
      loadProfileFromUserId(viewedUserId).then(async () => {
        await loadProfileStats(viewedUserId);
        await loadLastRated(viewedUserId);
        forceUpdate();
      });
      return;
    }
    if (!window.AICDB_AUTH) return;
    window.AICDB_AUTH.getSession().then(async session => {
      await loadProfileFromSession(session);
      const resolvedUserId = session?.user?.id;
      if (resolvedUserId) {
        await loadProfileStats(resolvedUserId);
        await loadLastRated(resolvedUserId);
      }
      forceUpdate();
    }).catch(() => {});
  }, [viewedUserId]);

  React.useEffect(() => {
    if (viewedUserId) return;
    const onRated = async () => {
      if (!window.AICDB_AUTH) return;
      try {
        const session = await window.AICDB_AUTH.getSession();
        const uid = session?.user?.id;
        if (!uid) return;
        await loadProfileStats(uid);
        await loadLastRated(uid);
        forceUpdate();
      } catch (e) {}
    };
    window.addEventListener('dreamwall:rated', onRated);
    return () => window.removeEventListener('dreamwall:rated', onRated);
  }, [viewedUserId]);

  React.useEffect(() => {
    if (viewedUserId) {
      setProfileUserId(viewedUserId);
      return;
    }
    if (!window.AICDB_AUTH) { setProfileUserId(null); return; }
    window.AICDB_AUTH.getSession().then(session => {
      setProfileUserId(session?.user?.id || null);
    }).catch(() => setProfileUserId(null));
  }, [viewedUserId]);

  React.useEffect(() => {
    if (embedded) return;
    const onPop = () => {
      const listId = (history.state && history.state.listId)
        || new URLSearchParams(window.location.search).get('list')
        || null;
      setActiveListId(listId);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [embedded]);

  const handleOpenList = (listId) => {
    if (embedded && onOpenList) { onOpenList(listId); return; }
    setActiveListId(listId);
    window.scrollTo(0, 0);
    try {
      const u = new URL(window.location.href);
      u.searchParams.set('list', listId);
      history.pushState({ listId }, '', u.toString());
    } catch (e) {}
  };

  const closeList = () => { history.back(); };

  // When rendered standalone (profile.html), all NavBar interactions bridge to the SPA.
  // Nav links  â†’ index.html#PageName
  // Search typing â†’ local state only (no catalog on standalone, dropdown stays empty)
  // Search Enter  â†’ index.html?q=term  (SPA reads ?q= on load and pre-seeds search)
  // Result pick   â†’ index.html?film=id (SPA opens the film detail once catalog loads)
  const [standaloneQuery, setStandaloneQuery] = React.useState('');
  const standaloneNav        = embedded ? null : (n) => { window.location.href = 'index.html#' + encodeURIComponent(n); };
  const standaloneOnQuery    = embedded ? null : (term) => { setStandaloneQuery(term); };
  const standaloneOnSearch   = embedded ? null : (term) => { if (term) window.location.href = 'index.html?q=' + encodeURIComponent(term); };
  const standaloneOpenResult = embedded ? null : (film) => { window.location.href = 'index.html?film=' + encodeURIComponent(film.id); };

  if (activeListId && !embedded) {
    return (
      <div style={{ minHeight: '100vh' }}>
        {!embedded && <NavBar active="Profile" onNav={standaloneNav} query={standaloneQuery} onQuery={standaloneOnQuery} onSearch={standaloneOnSearch} onOpenResult={standaloneOpenResult} />}
        <ListDetail listId={activeListId} onBack={closeList} backLabel="Back to profile"
          onOpen={standaloneOpenResult} onWatch={(film) => { window.location.href = 'index.html?film=' + encodeURIComponent(film.id); }} />
      </div>
    );
  }

  if (showAllRatings) {
    return (
      <div style={{ minHeight: embedded ? 'auto' : '100vh' }}>
        {!embedded && <NavBar active="" onNav={standaloneNav} query={standaloneQuery} onQuery={standaloneOnQuery} onSearch={standaloneOnSearch} onOpenResult={standaloneOpenResult} />}
        <AllRatingsPage onBack={() => { setShowAllRatings(false); window.scrollTo(0,0); }} onOpen={onOpen} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: embedded ? 'auto' : '100vh' }}>
      {!embedded && <NavBar active="Profile" onNav={standaloneNav} query={standaloneQuery} onQuery={standaloneOnQuery} onSearch={standaloneOnSearch} onOpenResult={standaloneOpenResult} />}
      <div className="aicdb-page" style={{ maxWidth:1100, margin:'0 auto', padding:'28px 28px 90px' }}>
        <TopSection onEdit={isOwnProfile ? () => setShowEdit(true) : undefined} onOpenList={handleOpenList} isOwnProfile={isOwnProfile} creatorAccounts={creatorAccounts} viewedUserId={viewedUserId} />
        <LastRated onOpen={onOpen} onSeeAll={() => { setShowAllRatings(true); window.scrollTo(0,0); }}
          isOwnProfile={isOwnProfile} profileUserId={profileUserId} onFavoriteCount={setFavoriteCount} />
        <StatsAndAchievements isOwnProfile={isOwnProfile} favoriteCount={favoriteCount} />
        <ProfileReviews onOpen={onOpen} viewedUserId={viewedUserId} isOwnProfile={isOwnProfile} />
      </div>
      {showEdit && isOwnProfile && (
        <EditProfilePanel
          onClose={() => setShowEdit(false)}
          onSaved={() => forceUpdate()}
        />
      )}
    </div>
  );
}

Object.assign(window, { Profile, PROFILE, loadProfileFromSession, loadProfileFromUserId, SectionHeading, filmsById, fmtRatedDate });

