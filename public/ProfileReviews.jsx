// Dreamwall — profile reviews section

// ============================================================
// Reviews — the user's submitted written reviews (bottom of profile)
// ============================================================

function ProfileReviewRow({ r, onOpen, onReload, isOwnProfile = true }) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(r.body);
  React.useEffect(() => { if (!editing) setDraft(r.body); }, [r.body, editing]);

  const film = r.film;
  const t = window.AICDB_TYPES[film.type];

  const save = async () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    await window.AICDB_REVIEWS.update(r.id, trimmed);
    setEditing(false);
    onReload && onReload();
  };

  const remove = async () => {
    await window.AICDB_REVIEWS.remove(r.id);
    onReload && onReload();
  };

  const togglePublic = async () => {
    await window.AICDB_REVIEWS.togglePublic(r.id, !r.is_public);
    onReload && onReload();
  };

  const visPill = (
    <button type="button" onClick={togglePublic}
      style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:999,
        border:'1px solid var(--border-subtle)', background:'transparent', cursor:'pointer',
        font:'600 12px/1 var(--font-body)', color:'var(--fg-2)' }}>
      <Icon name={r.is_public ? 'eye' : 'lock-simple'} size={12} color="currentColor" weight={r.is_public ? 'regular' : 'fill'} />
      {r.is_public ? 'Public' : 'Private'}
    </button>
  );

  return (
    <div style={{ display:'flex', gap:16, padding:'18px 20px', background:'var(--bg-1)', border:'1px solid var(--border-subtle)',
      borderRadius:'var(--radius-lg)' }}>
      <div onClick={() => onOpen && onOpen(film)} style={{ width:58, flex:'none', aspectRatio:'2/3', borderRadius:'var(--radius-md)', overflow:'hidden',
        cursor:'pointer', background:`linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 150%)`, boxShadow:'var(--shadow-1)' }} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8, flexWrap:'wrap' }}>
          <span onClick={() => onOpen && onOpen(film)} style={{ font:'600 17px/1.2 var(--font-display)', color:'var(--fg-0)', cursor:'pointer' }}>{film.title}</span>
          <span style={{ font:'600 9px/1 var(--font-body)', letterSpacing:'0.05em', textTransform:'uppercase',
            color:t.text, background:t.ghost, padding:'4px 8px', borderRadius:'var(--radius-pill)' }}>{t.label}</span>
          {r.you != null && <StarRating value={r.you} size={14} />}
          <span style={{ font:'var(--text-data-sm)', color:'var(--fg-3)' }}>· {fmtRatedDate(r.date)}</span>
        </div>
        {editing ? (
          <textarea value={draft} onChange={e => setDraft(e.target.value)}
            style={{ width:'100%', minHeight:72, resize:'vertical', background:'var(--bg-0)', color:'var(--fg-0)',
              border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', padding:'12px 14px',
              font:'var(--text-body)', outline:'none', marginBottom:12 }} />
        ) : (
          <p style={{ font:'var(--text-body)', color:'var(--fg-1)', margin:'0 0 12px' }}>{r.body}</p>
        )}
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:6, font:'var(--text-data-sm)', color:'var(--fg-2)', marginRight:6 }}>
            <Icon name="heart" size={14} color="var(--fg-3)" /> {r.likes}
          </span>
          {isOwnProfile && (editing ? (
            <>
              {visPill}
              <Button variant="ghost" size="sm" icon="check" onClick={save}>Save</Button>
              <Button variant="ghost" size="sm" onClick={() => { setDraft(r.body); setEditing(false); }}>Cancel</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" icon="pencil-simple" onClick={() => { setDraft(r.body); setEditing(true); }}>Edit</Button>
              <Button variant="ghost" size="sm" icon="trash" onClick={remove}>Delete</Button>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileReviews({ onOpen, viewedUserId, isOwnProfile = true }) {
  const [rows, setRows] = React.useState([]);

  const loadReviews = React.useCallback(async () => {
    try {
      let uid = viewedUserId;
      if (!uid) {
        const session = await window.AICDB_AUTH.getSession();
        if (!session) { setRows([]); return; }
        uid = session.user.id;
      }
      const data = await window.AICDB_REVIEWS.loadForUser(uid);
      const byId = filmsById();
      const mapped = data.map(row => {
        const film = byId[row.content_id] || (row.content ? {
          id: row.content_id,
          title: row.content.title || 'Unknown title',
          type: 'movie',
          g: ['#1a1a2e', '#16213e'],
        } : null);
        return {
          id: row.id,
          content_id: row.content_id,
          body: row.body,
          date: row.created_at,
          is_public: row.is_public,
          you: null,
          likes: 0,
          film,
        };
      }).filter(r => r.film);
      setRows(mapped);
    } catch (e) {
      console.warn('[ProfileReviews] load error:', e.message);
      setRows([]);
    }
  }, [viewedUserId]);

  React.useEffect(() => { loadReviews(); }, [loadReviews]);

  return (
    <section style={{ marginBottom:20 }}>
      <SectionHeading align="center" sub="Your written takes on what you've watched">Reviews</SectionHeading>
      {rows.length ? (
        <div style={{ maxWidth:820, margin:'0 auto', display:'flex', flexDirection:'column', gap:12 }}>
          {rows.map(r => <ProfileReviewRow key={r.id} r={r} onOpen={onOpen} onReload={loadReviews} isOwnProfile={isOwnProfile} />)}
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center',
          padding:'24px 24px 32px', maxWidth:440, margin:'0 auto' }}>
          <Icon name="chat-centered-text" size={22} color="var(--teal-dim)" weight="fill" />
          <p style={{ font:'500 14px/1.4 var(--font-body)', color:'var(--fg-3)', margin:'10px 0 0' }}>
            No reviews yet — write your first take after rating a title.
          </p>
        </div>
      )}
    </section>
  );
}

Object.assign(window, { ProfileReviewRow, ProfileReviews });

