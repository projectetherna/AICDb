// Dreamwall UI kit — Feed page (the social hub).
// X/Facebook-inspired scrollable post stream from followed creators.
// Dynamic + alive: composer, post cards with embedded content (uploads,
// ratings, lists), interactive like/comment/repost counts, live sidebar.

function creatorById(id) { return window.AICDB_CREATORS.find(c => c.id === id); }

// ---- small verified seal (shared) ----
function Seal({ size = 15 }) {
  return <Icon name="seal-check" size={size} color="var(--teal-bright)" weight="fill" />;
}

// ---- compact follow pill (shared with Creators page) ----
function FollowPill({ id, size = 'md' }) {
  const [following, setFollowing] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const pad = size === 'sm' ? '7px 15px' : '9px 18px';
  const fs = size === 'sm' ? 12.5 : 13.5;
  return (
    <button onClick={(e) => { e.stopPropagation(); setFollowing(f => !f); }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display:'inline-flex', alignItems:'center', gap:7, padding:pad, borderRadius:'var(--radius-pill)', cursor:'pointer',
        font:`600 ${fs}px/1 var(--font-body)`, transition:'all var(--dur-fast)', borderWidth:1, borderStyle:'solid',
        background: following ? 'transparent' : (hover ? 'var(--fg-1)' : 'var(--fg-0)'),
        borderColor: following ? 'var(--border-strong)' : 'transparent',
        color: following ? 'var(--fg-1)' : 'var(--bg-0)' }}>
      {following ? 'Following' : 'Follow'}
    </button>
  );
}

// ---- post action button (comment) ----
function PostAction({ icon, count, color, activeColor, onToggle, toggled, fillWhenOn, wide }) {
  const [hover, setHover] = React.useState(false);
  const on = toggled;
  const c = on ? activeColor : (hover ? activeColor : 'var(--fg-2)');
  return (
    <button onClick={onToggle} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display:'inline-flex', alignItems:'center', gap:8, cursor:'pointer',
        padding: wide ? '7px 18px' : '6px 10px', borderRadius:'var(--radius-pill)', color:c,
        transition:'all var(--dur-fast)', font:'600 13px/1 var(--font-mono)',
        border:'1px solid ' + (on ? 'var(--border-accent)' : (hover ? 'var(--border-subtle)' : 'transparent')),
        background: on ? 'var(--teal-ghost)' : (hover ? 'var(--bg-2)' : 'transparent') }}>
      <Icon name={icon} size={17} color={c} fill={on && fillWhenOn ? 'currentColor' : 'none'} weight="bold" />
      {count != null && <span>{fmtCount(count)}</span>}
    </button>
  );
}

// ---- upvote / downvote group. Only the upvote count is visible (downvotes hidden). ----
function VoteGroup({ count, vote, onVote }) {
  const [hovUp, setHovUp] = React.useState(false);
  const [hovDn, setHovDn] = React.useState(false);
  const up = vote === 1, dn = vote === -1;
  const shown = count + (up ? 1 : 0);
  const upColor = up ? 'var(--coral-bright)' : (hovUp ? 'var(--coral-bright)' : 'var(--fg-2)');
  const dnColor = dn ? 'var(--fg-0)' : (hovDn ? 'var(--fg-0)' : 'var(--fg-2)');
  const cell = { display:'inline-flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer',
    padding:'7px 11px', transition:'color var(--dur-fast)', font:'700 13px/1 var(--font-mono)' };
  return (
    <div style={{ display:'inline-flex', alignItems:'center', borderRadius:'var(--radius-pill)',
      background:'var(--bg-2)', border:'1px solid ' + (up ? 'var(--border-accent)' : 'var(--border-subtle)'),
      transition:'border-color var(--dur-fast)' }}>
      <button onClick={() => onVote(up ? 0 : 1)} onMouseEnter={() => setHovUp(true)} onMouseLeave={() => setHovUp(false)}
        title="Upvote" style={{ ...cell, color:upColor, borderRadius:'var(--radius-pill) 0 0 var(--radius-pill)' }}>
        <Icon name="arrow-fat-up" size={16} color={upColor} fill={up ? 'currentColor' : 'none'} weight="bold" />
        <span>{fmtCount(shown)}</span>
      </button>
      <span style={{ width:1, height:18, background:'var(--border-subtle)', flex:'none' }} />
      <button onClick={() => onVote(dn ? 0 : -1)} onMouseEnter={() => setHovDn(true)} onMouseLeave={() => setHovDn(false)}
        title="Downvote" style={{ ...cell, color:dnColor, padding:'7px 12px', borderRadius:'0 var(--radius-pill) var(--radius-pill) 0' }}>
        <Icon name="arrow-fat-down" size={16} color={dnColor} fill={dn ? 'currentColor' : 'none'} weight="bold" />
      </button>
    </div>
  );
}

// ---- share — styled as an active, clickable pill ----
function PostShareButton({ count }) {
  const [hover, setHover] = React.useState(false);
  const [done, setDone] = React.useState(false);
  return (
    <button onClick={() => { setDone(true); setTimeout(() => setDone(false), 1600); }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display:'inline-flex', alignItems:'center', gap:6, cursor:'pointer', padding:'5px 11px',
        borderRadius:'var(--radius-pill)', font:'600 12px/1 var(--font-body)', transition:'all var(--dur-fast)',
        border:'1px solid ' + (done ? 'transparent' : 'rgba(78,205,196,0.4)'),
        background: done ? 'var(--teal)' : (hover ? 'rgba(78,205,196,0.22)' : 'var(--teal-ghost)'),
        color: done ? '#04201e' : 'var(--teal-bright)' }}>
      <Icon name={done ? 'check' : 'share-network'} size={14} color="currentColor" weight={done ? 'bold' : 'fill'} />
      {done ? 'Shared' : 'Share'}
    </button>
  );
}

// ---- embedded: new upload (horizontal poster + meta) ----
function EmbeddedUpload({ film, onOpen }) {
  const [hover, setHover] = React.useState(false);
  const aspect = film.type === 'vertical' ? '9/16' : '2/3';
  return (
    <div onClick={(e) => { e.stopPropagation(); onOpen && onOpen(film); }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display:'flex', gap:14, padding:12, marginTop:13, cursor:'pointer',
        background:'var(--bg-2)', borderRadius:'var(--radius-lg)', borderWidth:1, borderStyle:'solid',
        borderColor: hover ? 'var(--border-default)' : 'var(--border-subtle)', transition:'border-color var(--dur-fast)' }}>
      <div style={{ width:74, flex:'none', aspectRatio:aspect, borderRadius:'var(--radius-md)', overflow:'hidden',
        background:`linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 150%)`, boxShadow:'var(--shadow-1)' }} />
      <div style={{ minWidth:0, flex:1, display:'flex', flexDirection:'column', justifyContent:'center' }}>
        <div className="overline" style={{ color:'var(--teal-bright)', marginBottom:8 }}>New release</div>
        <div style={{ font:'600 17px/1.2 var(--font-display)', color:'var(--fg-0)' }}>{film.title}</div>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:9 }}>
          <ContentBadge type={film.type} solid size="sm" />
          <ScoreLine film={film} size={15} countColor="var(--fg-2)" />
          <span style={{ font:'var(--text-data-sm)', color:'var(--fg-2)' }}>{film.year}</span>
        </div>
      </div>
    </div>
  );
}

// ---- embedded: rating given ----
function EmbeddedRating({ film, stars, onOpen }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onClick={(e) => { e.stopPropagation(); onOpen && onOpen(film); }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display:'flex', alignItems:'center', gap:14, padding:12, marginTop:13, cursor:'pointer',
        background:'var(--bg-2)', borderRadius:'var(--radius-lg)', borderWidth:1, borderStyle:'solid',
        borderColor: hover ? 'var(--border-default)' : 'var(--border-subtle)', transition:'border-color var(--dur-fast)' }}>
      <div style={{ width:48, height:68, flex:'none', borderRadius:'var(--radius-md)', overflow:'hidden',
        background:`linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 150%)`, boxShadow:'var(--shadow-1)' }} />
      <div style={{ minWidth:0, flex:1 }}>
        <div style={{ font:'600 15px/1.2 var(--font-display)', color:'var(--fg-0)', marginBottom:8 }}>{film.title}</div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <StarRating value={stars} size={15} />
          <span style={{ font:'700 13px/1 var(--font-mono)', color:'var(--coral-bright)' }}>{stars.toFixed(1)}</span>
        </div>
      </div>
      <div style={{ textAlign:'right', flex:'none' }}>
        <div style={{ font:'700 22px/1 var(--font-mono)', color:scoreColor(film.score) }}>{film.score.toFixed(1)}</div>
        <div className="overline" style={{ color:'var(--fg-2)', marginTop:5 }}>Score</div>
      </div>
    </div>
  );
}

// ---- embedded: list created (row of mini posters) ----
function EmbeddedList({ title, films, onOpen }) {
  return (
    <div style={{ marginTop:13, padding:14, background:'var(--bg-2)', borderRadius:'var(--radius-lg)',
      borderWidth:1, borderStyle:'solid', borderColor:'var(--border-subtle)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
        <Icon name="list" size={15} color="var(--coral-bright)" />
        <span style={{ font:'600 14px/1 var(--font-body)', color:'var(--fg-0)' }}>{title}</span>
        <span style={{ font:'var(--text-data-sm)', color:'var(--fg-2)' }}>· {films.length} titles</span>
      </div>
      <div style={{ display:'flex', gap:10 }}>
        {films.map(f => (
          <div key={f.id} onClick={(e) => { e.stopPropagation(); onOpen && onOpen(f); }}
            title={f.title}
            style={{ flex:1, aspectRatio:'2/3', borderRadius:'var(--radius-md)', overflow:'hidden', cursor:'pointer',
              background:`linear-gradient(150deg, ${f.g[0]}, ${f.g[1]} 150%)`, boxShadow:'var(--shadow-1)',
              position:'relative' }}>
            <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'14px 6px 5px',
              background:'linear-gradient(to top, rgba(5,5,5,0.85), transparent)',
              font:'700 11px/1 var(--font-mono)', color:scoreColor(f.score), textAlign:'center' }}>{f.score.toFixed(1)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- expandable comment thread (revealed when the comment button is clicked) ----
const FEED_COMMENTERS = [
  { name:'Viewer',        handle:'',            av:['#5a5e66','#3a3d44'] },
  { name:'Viewer',        handle:'',            av:['#4ecdc4','#6f9ceb'] },
  { name:'Viewer',        handle:'',            av:['#e8a13b','#d85a30'] },
  { name:'Viewer',        handle:'',            av:['#9d8df1','#4ecdc4'] },
];
const FEED_COMMENT_TEXT = [
  'This looks unreal — the lighting in the second act especially.',
  'Been waiting for this drop. Queued immediately.',
  'Okay the color grade is doing something different here. Love it.',
  'How long was the render pipeline on this one?',
];

function CommentThread({ post }) {
  const seed = (post.comments || 3);
  const n = Math.max(2, Math.min(3, seed % 3 + 2));
  const comments = Array.from({ length: n }, (_, i) => ({
    who: FEED_COMMENTERS[(seed + i) % FEED_COMMENTERS.length],
    text: FEED_COMMENT_TEXT[(seed + i) % FEED_COMMENT_TEXT.length],
    time: ['2h', '1h', '34m', '12m'][(seed + i) % 4],
    likes: ((seed * (i + 2)) % 24),
  }));
  const [draft, setDraft] = React.useState('');
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{ marginTop:13, paddingTop:14, borderTop:'1px solid var(--border-subtle)',
      animation:'aicdbCommentsIn 0.28s var(--ease-out) both' }}>
      <style>{`@keyframes aicdbCommentsIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}`}</style>
      {/* composer row */}
      <div style={{ display:'flex', gap:11, alignItems:'flex-start', marginBottom:6 }}>
        <Avatar size={32} colors={['#d85a30','#9d8df1']} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'flex-end', gap:8,
            background:'var(--bg-2)', border:'1px solid ' + (focus ? 'var(--border-accent)' : 'var(--border-subtle)'),
            borderRadius:'var(--radius-lg)', padding:'8px 8px 8px 14px', transition:'border-color var(--dur-fast)' }}>
            <input value={draft} onChange={e => setDraft(e.target.value)}
              onFocus={() => { if (!window.AICDB_REQUIRE_AUTH('Sign in to join the conversation.')) { document.activeElement && document.activeElement.blur(); return; } setFocus(true); }} onBlur={() => setFocus(false)}
              placeholder="Add a comment…"
              style={{ flex:1, background:'none', border:'none', outline:'none', color:'var(--fg-0)',
                font:'var(--text-body-sm)' }} />
            <button onClick={() => { if (!window.AICDB_REQUIRE_AUTH('Sign in to join the conversation.')) return; setDraft(''); }} disabled={!draft.trim()}
              style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:30, height:30, flex:'none',
                borderRadius:'50%', border:'none', cursor: draft.trim() ? 'pointer' : 'default',
                background: draft.trim() ? 'var(--coral)' : 'var(--bg-3)', transition:'background var(--dur-fast)' }}>
              <Icon name="paper-plane-tilt" size={14} color={draft.trim() ? 'var(--fg-on-accent)' : 'var(--fg-3)'} weight="fill" />
            </button>
          </div>
        </div>
      </div>
      {/* existing comments */}
      <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
        {comments.map((cm, i) => (
          <div key={i} style={{ display:'flex', gap:11, alignItems:'flex-start', padding:'9px 0' }}>
            <Avatar size={32} colors={cm.who.av} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ background:'var(--bg-2)', borderRadius:'var(--radius-lg)', padding:'9px 13px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ font:'600 13px/1.2 var(--font-body)', color:'var(--fg-0)' }}>{cm.who.name}</span>
                  <span style={{ font:'var(--text-data-sm)', color:'var(--fg-3)' }}>{cm.who.handle}</span>
                </div>
                <p style={{ font:'var(--text-body-sm)', color:'var(--fg-1)', margin:'4px 0 0' }}>{cm.text}</p>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:16, padding:'6px 13px 0' }}>
                <span style={{ font:'var(--text-data-sm)', color:'var(--fg-3)' }}>{cm.time}</span>
                <button style={{ background:'none', border:'none', cursor:'pointer', padding:0,
                  font:'600 12px/1 var(--font-body)', color:'var(--fg-2)' }}>Like</button>
                <button style={{ background:'none', border:'none', cursor:'pointer', padding:0,
                  font:'600 12px/1 var(--font-body)', color:'var(--fg-2)' }}>Reply</button>
                {cm.likes > 0 && (
                  <span style={{ display:'inline-flex', alignItems:'center', gap:4, font:'var(--text-data-sm)', color:'var(--fg-3)' }}>
                    <Icon name="arrow-fat-up" size={12} color="var(--coral-bright)" weight="fill" />{cm.likes}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- a single post ----
function PostCard({ post, onOpen, onCreator }) {
  const c = creatorById(post.creator);
  const film = post.film ? window.AICDB_FILM_BY_ID[post.film] : null;
  const listFilms = post.listFilms ? post.listFilms.map(id => window.AICDB_FILM_BY_ID[id]).filter(Boolean) : [];
  const mentioned = post.mention ? window.AICDB_FILM_BY_ID[post.mention] : null;
  const [vote, setVote] = React.useState(0);
  const [showComments, setShowComments] = React.useState(false);
  const verb = { upload:'released a new title', rating:'rated a title', list:'created a list', text:null }[post.kind];

  return (
    <article style={{ padding:'20px 22px', borderBottom:'1px solid var(--border-subtle)',
      transition:'background var(--dur-fast)' }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.012)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <div style={{ display:'flex', gap:14 }}>
        <div onClick={() => onCreator && onCreator(c.name)} style={{ cursor:'pointer', flex:'none' }}>
          <Avatar size={46} colors={c.av} />
        </div>
        <div style={{ minWidth:0, flex:1 }}>
          {/* header */}
          <div style={{ display:'flex', alignItems:'center', gap:7, flexWrap:'wrap' }}>
            <span onClick={() => onCreator && onCreator(c.name)}
              style={{ font:'600 15px/1.2 var(--font-body)', color:'var(--fg-0)', cursor:'pointer' }}>{c.name}</span>
            {c.verified && <Seal size={15} />}
            <span style={{ font:'var(--text-body-sm)', color:'var(--fg-2)' }}>{c.handle}</span>
            <span style={{ color:'var(--fg-3)' }}>·</span>
            <span style={{ font:'var(--text-body-sm)', color:'var(--fg-2)' }}>{post.time}</span>
            {verb && (
              <span style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', display:'inline-flex', alignItems:'center', gap:6, marginLeft:2 }}>
                <span style={{ color:'var(--fg-3)' }}>·</span>{verb}
              </span>
            )}
          </div>
          {/* body */}
          <p style={{ font:'var(--text-body-lg)', color:'var(--fg-0)', margin:'9px 0 0', whiteSpace:'pre-line' }}
            dangerouslySetInnerHTML={{ __html: post.text }} />
          {/* embedded content */}
          {post.kind === 'upload' && film && <EmbeddedUpload film={film} onOpen={onOpen} />}
          {post.kind === 'rating' && film && <EmbeddedRating film={film} stars={post.stars} onOpen={onOpen} />}
          {post.kind === 'list' && <EmbeddedList title={post.listTitle} films={listFilms} onOpen={onOpen} />}
          {/* mentioned content (Released New Title card) */}
          {mentioned && <EmbeddedUpload film={mentioned} onOpen={onOpen} />}
          {/* actions */}
          <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:13 }}>
            <VoteGroup count={post.likes} vote={vote} onVote={setVote} />
            <PostAction icon="message-square" count={post.comments} activeColor="var(--teal-bright)" wide
              toggled={showComments} onToggle={() => setShowComments(s => !s)} />
            <PostShareButton count={post.reposts} />
          </div>
          {showComments && <CommentThread post={post} />}
        </div>
      </div>
    </article>
  );
}

// ---- composer: identities the signed-in user can post as ----
const POST_AS = [
  { id:'you',  name:'You', handle:'', av:['#5a5e66','#3a3d44'], role:'Personal' },
];

// identity (creator account) selector at the top of the composer
function IdentitySelect({ value, onChange }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  return (
    <div ref={ref} style={{ position:'relative', display:'inline-block' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ display:'inline-flex', alignItems:'center', gap:9, padding:'6px 11px 6px 7px', cursor:'pointer',
          borderRadius:'var(--radius-pill)', background:'var(--bg-2)', border:'1px solid var(--border-subtle)',
          transition:'border-color var(--dur-fast)' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}>
        <Avatar size={24} colors={value.av} />
        <span style={{ font:'600 13px/1 var(--font-body)', color:'var(--fg-0)' }}>{value.name}</span>
        {value.role === 'Creator' && (
          <span style={{ font:'600 9px/1 var(--font-body)', letterSpacing:'0.05em', textTransform:'uppercase', color:'var(--coral-bright)',
            background:'var(--coral-ghost)', padding:'3px 6px', borderRadius:'var(--radius-pill)' }}>Creator</span>
        )}
        <Icon name={open ? 'caret-up' : 'caret-down'} size={11} color="var(--fg-3)" />
      </button>
      {open && (
        <div style={{ position:'absolute', top:'calc(100% + 6px)', left:0, zIndex:40, minWidth:236, padding:6,
          background:'var(--bg-1)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-lg)', boxShadow:'var(--shadow-3)' }}>
          <div className="overline" style={{ color:'var(--fg-3)', padding:'6px 10px 8px' }}>Post as</div>
          {POST_AS.map(p => {
            const on = p.id === value.id;
            return (
              <div key={p.id} onClick={() => { onChange(p); setOpen(false); }}
                style={{ display:'flex', alignItems:'center', gap:11, padding:'9px 10px', cursor:'pointer', borderRadius:'var(--radius-md)',
                  background: on ? 'var(--bg-2)' : 'transparent' }}
                onMouseEnter={e => { if (!on) e.currentTarget.style.background = 'var(--bg-2)'; }}
                onMouseLeave={e => { if (!on) e.currentTarget.style.background = 'transparent'; }}>
                <Avatar size={32} colors={p.av} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ font:'600 13.5px/1.2 var(--font-body)', color:'var(--fg-0)' }}>{p.name}</span>
                    {p.role === 'Creator' && <Icon name="seal-check" size={13} color="var(--teal-bright)" weight="fill" />}
                  </div>
                  <div style={{ font:'var(--text-data-sm)', color:'var(--fg-2)', marginTop:2 }}>{p.role} · {p.handle}</div>
                </div>
                {on && <Icon name="check" size={15} color="var(--teal-bright)" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// inline "mention content" search — find & attach a title
function MentionSearch({ onPick, onClose }) {
  const [q, setQ] = React.useState('');
  const ref = React.useRef(null);
  React.useEffect(() => { const i = ref.current && ref.current.querySelector('input'); i && i.focus(); }, []);
  const ql = q.trim().toLowerCase();
  const results = ql ? window.AICDB_FILMS.filter(f =>
    f.title.toLowerCase().includes(ql) || f.creator.toLowerCase().includes(ql)).slice(0, 5) : [];
  return (
    <div ref={ref} style={{ marginTop:12, background:'var(--bg-2)', borderRadius:'var(--radius-lg)',
      border:'1px solid var(--border-default)', overflow:'hidden' }}>
      <div style={{ display:'flex', alignItems:'center', gap:9, padding:'10px 13px', borderBottom: results.length ? '1px solid var(--border-subtle)' : 'none' }}>
        <Icon name="magnifying-glass" size={15} color="var(--fg-2)" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Mention a title — search the catalog…"
          style={{ flex:1, background:'none', border:'none', outline:'none', color:'var(--fg-0)', font:'var(--text-body-sm)' }} />
        <button onClick={onClose} style={{ display:'flex', padding:4, background:'none', border:'none', cursor:'pointer' }}>
          <Icon name="x" size={14} color="var(--fg-2)" />
        </button>
      </div>
      {results.length > 0 && (
        <div style={{ padding:6 }}>
          {results.map(f => (
            <div key={f.id} onClick={() => onPick(f)}
              style={{ display:'flex', alignItems:'center', gap:11, padding:'7px 8px', cursor:'pointer', borderRadius:'var(--radius-md)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ width:30, height:44, flex:'none', borderRadius:5, overflow:'hidden',
                background:`linear-gradient(150deg, ${f.g[0]}, ${f.g[1]} 150%)` }} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ font:'600 13px/1.2 var(--font-body)', color:'var(--fg-0)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{f.title}</div>
                <div style={{ font:'var(--text-data-sm)', color:'var(--fg-2)', marginTop:2 }}>{f.year} · {f.creator}</div>
              </div>
              <Icon name="plus" size={15} color="var(--teal-bright)" weight="bold" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// composer toolbar icon button
function ComposerTool({ icon, label, active, onClick }) {
  const [hover, setHover] = React.useState(false);
  const on = active || hover;
  return (
    <button onClick={onClick} title={label}
      style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'7px 11px', borderRadius:'var(--radius-pill)',
        cursor:'pointer', border:'1px solid ' + (active ? 'rgba(78,205,196,0.4)' : 'transparent'),
        background: active ? 'var(--teal-ghost)' : (hover ? 'var(--bg-2)' : 'transparent'),
        color: on ? 'var(--teal-bright)' : 'var(--fg-2)', transition:'all var(--dur-fast)', font:'600 12.5px/1 var(--font-body)' }}>
      <Icon name={icon} size={17} color="currentColor" weight="bold" />
      <span>{label}</span>
    </button>
  );
}

// ---- composer (creator-account version) ----
function Composer() {
  const [identity, setIdentity] = React.useState(POST_AS[0]);
  const [val, setVal] = React.useState('');
  const [mentionOpen, setMentionOpen] = React.useState(false);
  const [mention, setMention] = React.useState(null);
  const [photo, setPhoto] = React.useState(false);
  const [poll, setPoll] = React.useState(null); // null | string[]

  const togglePoll = () => setPoll(p => p ? null : ['', '']);
  const setOpt = (i, v) => setPoll(p => p.map((o, j) => j === i ? v : o));
  const addOpt = () => setPoll(p => p.length < 4 ? [...p, ''] : p);

  return (
    <div style={{ padding:'18px 22px 20px', borderBottom:'1px solid var(--border-subtle)' }}>
      {/* creator account selector */}
      <div style={{ marginBottom:14 }}><IdentitySelect value={identity} onChange={setIdentity} /></div>

      <div style={{ display:'flex', gap:14 }}>
        <Avatar size={46} colors={identity.av} />
        <div style={{ flex:1, minWidth:0 }}>
          <textarea value={val} onChange={e => setVal(e.target.value)} rows={2}
            placeholder="Share an update, a render, a hot take…"
            style={{ width:'100%', resize:'none', background:'none', border:'none', outline:'none',
              color:'var(--fg-0)', font:'var(--text-body-lg)', paddingTop:8 }} />

          {/* attached photo */}
          {photo && (
            <div style={{ position:'relative', marginTop:10, height:150, borderRadius:'var(--radius-lg)', overflow:'hidden',
              background:'repeating-linear-gradient(135deg, var(--bg-2), var(--bg-2) 11px, var(--bg-3) 11px, var(--bg-3) 22px)',
              border:'1px solid var(--border-subtle)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ font:'var(--text-data-sm)', color:'var(--fg-3)', letterSpacing:'0.04em' }}>photo / render</span>
              <button onClick={() => setPhoto(false)} style={{ position:'absolute', top:9, right:9, display:'flex', padding:6, borderRadius:'50%',
                cursor:'pointer', background:'rgba(10,10,10,0.62)', border:'1px solid var(--border-default)' }}>
                <Icon name="x" size={13} color="#fff" /></button>
            </div>
          )}

          {/* poll builder */}
          {poll && (
            <div style={{ marginTop:12, padding:14, background:'var(--bg-2)', borderRadius:'var(--radius-lg)', border:'1px solid var(--border-subtle)' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                <span className="overline" style={{ color:'var(--teal-bright)' }}>Poll</span>
                <button onClick={togglePoll} style={{ display:'flex', padding:3, background:'none', border:'none', cursor:'pointer' }}>
                  <Icon name="x" size={14} color="var(--fg-2)" /></button>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {poll.map((o, i) => (
                  <input key={i} value={o} onChange={e => setOpt(i, e.target.value)} placeholder={`Option ${i + 1}`}
                    style={{ width:'100%', background:'var(--bg-0)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)',
                      padding:'9px 12px', color:'var(--fg-0)', font:'var(--text-body-sm)', outline:'none' }} />
                ))}
              </div>
              {poll.length < 4 && (
                <button onClick={addOpt} style={{ display:'inline-flex', alignItems:'center', gap:6, marginTop:10, padding:'6px 10px',
                  background:'none', border:'none', cursor:'pointer', color:'var(--teal-bright)', font:'600 12.5px/1 var(--font-body)' }}>
                  <Icon name="plus" size={13} color="var(--teal-bright)" weight="bold" /> Add option
                </button>
              )}
            </div>
          )}

          {/* mention search / attached title (Released New Title card) */}
          {mentionOpen && !mention && <MentionSearch onPick={(f) => { setMention(f); setMentionOpen(false); }} onClose={() => setMentionOpen(false)} />}
          {mention && (
            <div style={{ position:'relative' }}>
              <EmbeddedUpload film={mention} onOpen={() => {}} />
              <button onClick={() => setMention(null)} style={{ position:'absolute', top:20, right:9, display:'flex', padding:6, borderRadius:'50%',
                cursor:'pointer', background:'var(--bg-3)', border:'1px solid var(--border-default)' }}>
                <Icon name="x" size={13} color="var(--fg-1)" /></button>
            </div>
          )}

          {/* toolbar */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:12, gap:10, flexWrap:'wrap' }}>
            <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginLeft:-4 }}>
              <ComposerTool icon="image" label="Photo" active={photo} onClick={() => setPhoto(p => !p)} />
              <ComposerTool icon="chart-bar" label="Poll" active={!!poll} onClick={togglePoll} />
              <ComposerTool icon="at" label="Mention content" active={mentionOpen || !!mention}
                onClick={() => { if (mention) { setMention(null); } else { setMentionOpen(o => !o); } }} />
            </div>
            <Button variant="primary" size="sm" onClick={() => { window.AICDB_REQUIRE_AUTH('Sign in to post to the community.'); }}>Post</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- comment-only state: shown to users without a creator account ----
function ComposerLocked({ onNav }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:15, padding:'18px 22px', borderBottom:'1px solid var(--border-subtle)',
      background:'var(--bg-1)' }}>
      <div style={{ width:42, height:42, flex:'none', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
        background:'var(--bg-3)', border:'1px solid var(--border-subtle)' }}>
        <Icon name="lock-simple" size={19} color="var(--fg-2)" weight="fill" />
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ font:'600 14.5px/1.3 var(--font-body)', color:'var(--fg-0)' }}>Posting is for creator accounts</div>
        <div style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', marginTop:3 }}>
          You can upvote and comment on everything below. Create a creator account to share your own updates and releases.
        </div>
      </div>
      <a href="creator-setup.html" style={{ flex:'none', display:'inline-flex', alignItems:'center', gap:7, padding:'9px 16px',
        borderRadius:'var(--radius-pill)', background:'var(--coral)', color:'var(--fg-on-accent)', textDecoration:'none',
        font:'600 13px/1 var(--font-body)' }}>
        <Icon name="plus-circle" size={15} color="var(--fg-on-accent)" weight="fill" /> Create creator account
      </a>
    </div>
  );
}

// ---- right sidebar: who to follow + trending ----
function FeedSidebar({ onCreator, onOpen }) {
  const suggested = window.AICDB_CREATORS.slice(2, 6);
  const trending = [...window.AICDB_FILMS].sort((a, b) => b.score - a.score).slice(0, 4);
  return (
    <aside className="aicdb-feed-sidebar" style={{ width:300, flex:'none', position:'sticky', top:78, alignSelf:'flex-start',
      display:'flex', flexDirection:'column', gap:18 }}>
      <div style={{ background:'var(--bg-1)', borderRadius:'var(--radius-lg)', borderWidth:1, borderStyle:'solid',
        borderColor:'var(--border-subtle)', padding:'6px 0' }}>
        <div style={{ font:'600 16px/1 var(--font-display)', color:'var(--fg-0)', padding:'14px 18px 10px' }}>Who to follow</div>
        {suggested.length ? suggested.map(c => (
          <div key={c.id} style={{ display:'flex', alignItems:'center', gap:11, padding:'10px 18px' }}>
            <div onClick={() => onCreator && onCreator(c.name)} style={{ cursor:'pointer', flex:'none' }}>
              <Avatar size={40} colors={c.av} />
            </div>
            <div style={{ minWidth:0, flex:1 }}>
              <div onClick={() => onCreator && onCreator(c.name)} style={{ display:'flex', alignItems:'center', gap:5, cursor:'pointer' }}>
                <span style={{ font:'600 13.5px/1.2 var(--font-body)', color:'var(--fg-0)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.name}</span>
                {c.verified && <Seal size={13} />}
              </div>
              <div style={{ font:'var(--text-data-sm)', color:'var(--fg-2)', marginTop:2 }}>{fmtCount(c.followers)} followers</div>
            </div>
            <FollowPill id={c.id} size="sm" />
          </div>
        )) : (
          <div style={{ padding:'4px 18px 16px', font:'var(--text-body-sm)', color:'var(--fg-3)' }}>No suggestions yet — check back as creators join.</div>
        )}
      </div>

      <div style={{ background:'var(--bg-1)', borderRadius:'var(--radius-lg)', borderWidth:1, borderStyle:'solid',
        borderColor:'var(--border-subtle)', padding:'6px 0' }}>
        <div style={{ font:'600 16px/1 var(--font-display)', color:'var(--fg-0)', padding:'14px 18px 10px' }}>Trending now</div>
        {trending.length ? trending.map((f, i) => (
          <div key={f.id} onClick={() => onOpen && onOpen(f)}
            style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 18px', cursor:'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <span style={{ font:'700 16px/1 var(--font-mono)', color:'var(--fg-3)', width:18, flex:'none' }}>{i + 1}</span>
            <div style={{ width:34, height:48, flex:'none', borderRadius:6, overflow:'hidden',
              background:`linear-gradient(150deg, ${f.g[0]}, ${f.g[1]} 150%)` }} />
            <div style={{ minWidth:0, flex:1 }}>
              <div style={{ font:'600 13.5px/1.2 var(--font-body)', color:'var(--fg-0)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{f.title}</div>
              <div style={{ font:'var(--text-data-sm)', color:'var(--fg-2)', marginTop:2 }}>{f.creator}</div>
            </div>
            <span style={{ font:'700 14px/1 var(--font-mono)', color:scoreColor(f.score), flex:'none' }}>{f.score.toFixed(1)}</span>
          </div>
        )) : (
          <div style={{ padding:'4px 18px 16px', font:'var(--text-body-sm)', color:'var(--fg-3)' }}>Nothing trending yet.</div>
        )}
      </div>
    </aside>
  );
}

function Feed({ onOpen, onCreator, onNav }) {
  const posts = window.AICDB_FEED || [];
  const [creatorMode, setCreatorMode] = React.useState(true);
  const hasPosts = posts.length > 0;
  return (
    <div style={{ maxWidth:1000, margin:'0 auto', padding:'0 24px', display:'flex', gap:32, alignItems:'flex-start' }}>
      {/* main column */}
      <div style={{ flex:1, minWidth:0, borderLeft:'1px solid var(--border-subtle)', borderRight:'1px solid var(--border-subtle)' }}>
        <div style={{ position:'sticky', top:57, zIndex:20, padding:'16px 22px', background:'var(--bg-glass)',
          backdropFilter:'blur(14px)', WebkitBackdropFilter:'blur(14px)', borderBottom:'1px solid var(--border-subtle)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, flexWrap:'wrap' }}>
            <h1 style={{ font:'600 24px/1 var(--font-display)', color:'var(--fg-0)' }}>Feed</h1>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ font:'var(--text-data-sm)', color:'var(--fg-3)', letterSpacing:'0.03em' }}>VIEW AS</span>
              <div style={{ display:'inline-flex', padding:3, gap:2, background:'var(--bg-2)', borderRadius:'var(--radius-pill)',
                border:'1px solid var(--border-subtle)' }}>
                {[['Creator', true], ['Viewer', false]].map(([lbl, val]) => {
                  const on = creatorMode === val;
                  return (
                    <button key={lbl} onClick={() => setCreatorMode(val)}
                      style={{ padding:'5px 13px', borderRadius:'var(--radius-pill)', border:'none', cursor:'pointer',
                        font:'600 12px/1 var(--font-body)', transition:'all var(--dur-fast)',
                        background: on ? 'var(--bg-3)' : 'transparent', color: on ? 'var(--fg-0)' : 'var(--fg-2)' }}>{lbl}</button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        {creatorMode ? <Composer /> : <ComposerLocked onNav={onNav} />}
        {hasPosts ? (
          <>
            {posts.map(p => <PostCard key={p.id} post={p} onOpen={onOpen} onCreator={onCreator} />)}
            <div style={{ padding:'30px 0', textAlign:'center', font:'var(--text-body-sm)', color:'var(--fg-2)' }}>
              You're all caught up. Follow more creators to see more.
            </div>
          </>
        ) : (
          <EmptyState icon="users-three" accent="var(--teal)"
            title="You’re not following anyone yet"
            sub="When you follow creators, their releases, ratings, and updates will stream in right here."
            actionLabel="Discover creators" onAction={() => onNav && onNav('Creators')} />
        )}
      </div>
      <FeedSidebar onCreator={onCreator} onOpen={onOpen} />
    </div>
  );
}

Object.assign(window, { Feed, PostCard, Composer, ComposerLocked, FeedSidebar, FollowPill, Seal, creatorById,
  VoteGroup, PostShareButton, PostAction, CommentThread, IdentitySelect, MentionSearch, ComposerTool });
