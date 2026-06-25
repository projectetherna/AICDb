// Dreamwall UI kit — film/series detail page
function ReviewItem({ r, currentUserId, onReload }) {
  const [liked, setLiked] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(r.body);
  React.useEffect(() => { if (!editing) setDraft(r.body); }, [r.body, editing]);

  const isOwn = currentUserId && r.userId === currentUserId;

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
    <div style={{ display:'flex', gap:14, padding:'18px 0', borderBottom:'1px solid var(--border-subtle)' }}>
      <Avatar colors={r.av} size={38} />
      <div style={{ flex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
          <span
            onClick={() => { if (r.userId && window.AICDB_OPEN_USER_PROFILE) window.AICDB_OPEN_USER_PROFILE(r.userId); }}
            onMouseEnter={e => { if (r.userId) e.currentTarget.style.color = 'var(--teal-bright)'; }}
            onMouseLeave={e => { if (r.userId) e.currentTarget.style.color = 'var(--fg-0)'; }}
            style={{ font:'600 14px/1 var(--font-body)', color:'var(--fg-0)', cursor: r.userId ? 'pointer' : 'default' }}>{r.user}</span>
          {r.stars != null && <StarRating value={r.stars} size={14} />}
          <span style={{ font:'var(--text-data-sm)', color:'var(--fg-2)' }}>{r.when}</span>
        </div>
        {editing ? (
          <textarea value={draft} onChange={e => setDraft(e.target.value)}
            style={{ width:'100%', minHeight:72, resize:'vertical', background:'var(--bg-0)', color:'var(--fg-0)',
              border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', padding:'12px 14px',
              font:'var(--text-body)', outline:'none', marginBottom:10 }} />
        ) : (
          <p style={{ font:'var(--text-body)', color:'var(--fg-1)', margin:'0 0 10px' }}>{r.body}</p>
        )}
        <button onClick={()=>setLiked(!liked)} style={{ display:'inline-flex', alignItems:'center', gap:6,
          background:'none', border:'none', cursor:'pointer', padding:0,
          font:'500 12px/1 var(--font-body)', color: liked?'var(--coral)':'var(--fg-2)' }}>
          <Icon name="heart" size={15} fill={liked?'var(--coral)':'none'} color={liked?'var(--coral)':'currentColor'} />
          {r.likes + (liked?1:0)}
        </button>
        {isOwn && (
          <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:10, flexWrap:'wrap' }}>
            {visPill}
            {editing ? (
              <>
                <Button variant="ghost" size="sm" icon="check" onClick={save}>Save</Button>
                <Button variant="ghost" size="sm" onClick={() => { setDraft(r.body); setEditing(false); }}>Cancel</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" icon="pencil-simple" onClick={() => { setDraft(r.body); setEditing(true); }}>Edit</Button>
                <Button variant="ghost" size="sm" icon="trash" onClick={remove}>Delete</Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Left-column action button (consistent secondary style)
function SideButton({ icon, iconFill, children, onClick, primary }) {
  const [hover, setHover] = React.useState(false);
  const base = { width:'100%', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8,
    padding:'12px 16px', borderRadius:'var(--radius-md)', cursor:'pointer', font:'600 14px/1 var(--font-body)',
    transition:'all var(--dur-fast)' };
  const style = primary
    ? { ...base, border:'none', background: hover ? 'var(--coral-bright)' : 'var(--coral)', color:'var(--fg-on-accent)' }
    : { ...base, border:'1px solid var(--border-strong)', background: hover ? 'var(--bg-2)' : 'transparent', color:'var(--fg-0)' };
  return (
    <button onClick={onClick} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} style={style}>
      <Icon name={icon} size={16} fill={iconFill !== undefined ? iconFill : (primary && icon==='play' ? 'currentColor' : 'none')} color="currentColor" />
      {children}
    </button>
  );
}

function FilmDetail({ film, onBack, onWatch, onCreator, onOpen }) {
  const d = window.AICDB_DETAILS[film.id] || {};
  const t = window.AICDB_TYPES[film.type];
  const isSeries = film.type === 'series';

  // Community stats fetched live from content_stats
  const [communityAvg, setCommunityAvg] = React.useState(film.score || 0);
  const [ratingCount, setRatingCount] = React.useState(film.ratings || 0);

  // Current user's own rating dimensions
  const [userRating, setUserRating] = React.useState(null); // { visuals, sound, script, consistency, main }

  const [rateOpen, setRateOpen] = React.useState(false);
  const [reviewOpen, setReviewOpen] = React.useState(false);
  const [reviews, setReviews] = React.useState([]);
  const [reviewSort, setReviewSort] = React.useState('newest');
  const [feedback, setFeedback] = React.useState(null);
  const [currentUserId, setCurrentUserId] = React.useState(null);
  const [showFullDesc, setShowFullDesc] = React.useState(false);

  const formatReviewWhen = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const mapReviewRow = (row) => ({
    id: row.id,
    body: row.body,
    when: formatReviewWhen(row.created_at),
    createdAt: row.created_at,
    user: (row.profiles && row.profiles.display_name) || 'Anonymous',
    userId: row.user_id,
    is_public: row.is_public,
    av: ['#d85a30', '#9d8df1'],
    likes: 0,
  });

  const loadReviews = React.useCallback(async () => {
    const rows = await window.AICDB_REVIEWS.load(film.id);
    console.log('REVIEW_LOAD:', { data: rows, error: null });
    setReviews(rows.map(mapReviewRow));
  }, [film.id]);

  React.useEffect(() => { loadReviews(); }, [loadReviews]);

  React.useEffect(() => {
    window.AICDB_AUTH.getSession()
      .then(session => { setCurrentUserId(session ? session.user.id : null); })
      .catch(() => { setCurrentUserId(null); });
  }, []);

  // Fetch community stats + user's own rating on mount (and after each rating submit)
  const fetchData = React.useCallback(async () => {
    try {
      const sb = await window.AICDB_AUTH.getClient();

      // Community stats (no auth required — content_stats is public)
      const { data: stats } = await sb
        .from('content_stats')
        .select('rating_avg, rating_count')
        .eq('content_id', film.id)
        .maybeSingle();
      if (stats) {
        if (stats.rating_avg != null) setCommunityAvg(parseFloat(stats.rating_avg));
        if (stats.rating_count != null) setRatingCount(stats.rating_count);
      }

      // User's own rating (only if signed in)
      const session = await window.AICDB_AUTH.getSession();
      if (!session) return;
      const { data: myRating } = await sb
        .from('ratings')
        .select('visuals, sound_design, script, consistency, main_score')
        .eq('user_id', session.user.id)
        .eq('content_id', film.id)
        .is('episode_id', null)
        .maybeSingle();
      if (myRating) {
        setUserRating({
          visuals: myRating.visuals,
          sound: myRating.sound_design,
          script: myRating.script,
          consistency: myRating.consistency,
          main: myRating.main_score != null ? parseFloat(myRating.main_score) : null,
        });
      }
    } catch (e) {
      console.warn('[FilmDetail] fetchData error:', e.message);
    }
  }, [film.id]);

  React.useEffect(() => { fetchData(); }, [fetchData]);

  const handleRated = (avg) => {
    setRateOpen(false);
    const first = window.aicdbRecordRating ? window.aicdbRecordRating() : false;
    setFeedback({ score: avg, first });
    // Re-fetch to get updated community avg + user's own rating
    fetchData();
    if (window.AICDB_REVIEWS) {
      window.dispatchEvent(new CustomEvent('dreamwall:rated', { detail: avg }));
    }
  };

  const sortedReviews = reviewSort === 'liked'
    ? [...reviews].sort((a, b) => b.likes - a.likes)
    : [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const reviewSortBtn = (active) => ({
    padding:'6px 14px', borderRadius:999, border:'1px solid', font:'600 12px/1 var(--font-body)',
    cursor:'pointer', background:'transparent',
    borderColor: active ? 'var(--teal-bright)' : 'var(--border-subtle)',
    color: active ? 'var(--teal-bright)' : 'var(--fg-2)',
  });

  return (
    <div>
      {/* ---- Hero backdrop with quote overlay ---- */}
      <div style={{ position:'relative', height:360, background:`linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 170%)` }}>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(10,10,10,0.32) 0%, rgba(10,10,10,0.72) 62%, var(--bg-0) 100%)' }} />
        {/* quote — Times New Roman, overlaid on the fading image */}
        <div style={{ position:'absolute', inset:0 }}>
          <div style={{ maxWidth:1100, margin:'0 auto', height:'100%', padding:'0 28px', position:'relative' }}>
            <blockquote style={{ position:'absolute', right:28, bottom:120, maxWidth:560, margin:0, textAlign:'right',
              fontFamily:'"Times New Roman", Times, serif', fontStyle:'italic', fontWeight:400,
              fontSize:34, lineHeight:1.25, color:'rgba(245,243,239,0.92)', textShadow:'0 2px 20px rgba(0,0,0,0.7)' }}>
              <span style={{ fontSize:54, lineHeight:0, verticalAlign:'-0.35em', opacity:0.5, marginRight:4 }}>“</span>
              {d.quote || film.synopsis.split('.')[0] + '.'}
            </blockquote>
          </div>
        </div>
        <div style={{ position:'relative', maxWidth:1100, margin:'0 auto', padding:'20px 28px' }}>
          <button onClick={onBack} style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(0,0,0,0.4)',
            border:'1px solid var(--border-default)', borderRadius:'var(--radius-pill)', padding:'8px 14px',
            cursor:'pointer', color:'var(--fg-0)', font:'500 13px/1 var(--font-body)', backdropFilter:'blur(8px)' }}>
            <Icon name="chevron-left" size={16} /> Discover
          </button>
        </div>
      </div>

      {/* ---- Two-column header ---- */}
      <div className="aicdb-detail-header" style={{ maxWidth:1100, margin:'0 auto', padding:'0 28px', display:'flex', gap:36, marginTop:-90, position:'relative' }}>
        {/* Poster + actions */}
        <div className="aicdb-detail-poster" style={{ width:240, flex:'none' }}>
          <div style={{ aspectRatio: film.type==='vertical'?'9/16':'2/3', borderRadius:'var(--radius-lg)', overflow:'hidden',
            background:`linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 150%)`, boxShadow:'var(--shadow-poster)' }} />
          <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:16 }}>
            <SideButton icon="play" primary onClick={() => onWatch && onWatch(film)}>Watch</SideButton>
            <WatchlistSplit film={film} />
            <SideButton icon="star" iconFill={userRating ? 'currentColor' : 'none'} onClick={() => { if (!window.AICDB_REQUIRE_AUTH('Sign in to rate this title.')) return; setRateOpen(true); }}>{userRating ? `Rated ${userRating.main.toFixed(1)}` : 'Rate'}</SideButton>
            <ShareButton />
          </div>
        </div>

        {/* Info */}
        <div className="aicdb-detail-info" style={{ flex:1, paddingTop:104, minWidth:0 }}>
          <div style={{ display:'flex', gap:32, alignItems:'flex-start', flexWrap:'wrap' }}>
            <div style={{ flex:'1 1 360px', minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, flexWrap:'wrap' }}>
                <ContentBadge type={film.type} />
                <ContentRibbon film={film} size="sm" />
                {film.genres.map(g => (
                  <span key={g} style={{ font:'500 12px/1 var(--font-body)', color:'var(--fg-1)' }}>{g}</span>
                ))}
                <span style={{ display:'inline-flex', alignItems:'center', gap:5, font:'500 12px/1 var(--font-body)', color:'var(--teal-bright)' }}>
                  <Icon name="sparkles" size={13} color="var(--teal-bright)" />{film.technique}
                </span>
              </div>
              <h1 style={{ font:'var(--text-h1)', color:'var(--fg-0)', letterSpacing:'-0.015em', marginBottom:10 }}>{film.title}</h1>

              {/* meta + creator with link */}
              <div style={{ display:'flex', alignItems:'center', gap:14, font:'var(--text-data)', color:'var(--fg-1)', marginBottom:8, flexWrap:'wrap' }}>
                <span>{film.year}</span><span style={{ color:'var(--fg-3)' }}>·</span>
                <span style={{ display:'inline-flex', alignItems:'center', gap:5 }}><Icon name="clock" size={14} color="var(--fg-2)" />{film.runtime}</span>
                {isSeries && (<><span style={{ color:'var(--fg-3)' }}>·</span>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:5, color:'var(--teal-bright)' }}>
                    <Icon name="television-simple" size={14} color="var(--teal-bright)" />{d.seasons} {d.seasons===1?'season':'seasons'} · {d.episodes} episodes
                  </span></>)}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24, flexWrap:'wrap' }}>
                <span style={{ font:'var(--text-body)', color:'var(--fg-1)' }}>By <span style={{ color:'var(--fg-0)', fontWeight:600 }}>{film.creator}</span></span>
                <a onClick={() => onCreator && onCreator(film.creator)}
                  style={{ display:'inline-flex', alignItems:'center', gap:4, cursor:'pointer', color:'var(--teal)',
                    font:'600 13px/1 var(--font-body)' }}>
                  Go to Creator's Page <Icon name="arrow-right" size={13} color="var(--teal)" />
                </a>
              </div>

              {/* aggregate score + your score side by side */}
              <div style={{ maxWidth:420, marginBottom:20 }}>
                <DualScore communityAvg={communityAvg} ratingCount={ratingCount} userRating={userRating} />
              </div>

              <div style={{ maxWidth:620 }}>
                <div style={{ font:'var(--text-body-lg)', color:'var(--fg-1)', margin:0,
                  maxHeight: showFullDesc ? 'none' : 72, overflow: showFullDesc ? 'visible' : 'hidden',
                  transition:'maxHeight 0.3s ease' }}>
                  {film.synopsis}
                </div>
                {(film.synopsis || '').length > 200 && (
                  <button type="button" onClick={() => setShowFullDesc(v => !v)}
                    style={{ background:'none', border:'none', color:'var(--teal-bright)', font:'600 13px/1 var(--font-body)',
                      cursor:'pointer', padding:'4px 0', marginTop:4 }}>
                    {showFullDesc ? 'Show less ↑' : 'Show more ↓'}
                  </button>
                )}
              </div>
            </div>

            <div className="aicdb-detail-gauge" style={{ flex:'none', width:258, maxWidth:'100%' }}>
              <ConsistencyMeter film={film} />
            </div>
          </div>
        </div>
      </div>

      {/* ---- Stacked sections ---- */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 28px 90px' }}>
        <CreditsSection film={film} />
        <StatsSection film={film} />

        {/* Reviews */}
        <section style={{ marginTop:48 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18, gap:12, flexWrap:'wrap' }}>
            <h2 style={{ font:'var(--text-h2)', color:'var(--fg-0)' }}>Reviews</h2>
            <div style={{ display:'flex', gap:6 }}>
              <button type="button" style={reviewSortBtn(reviewSort === 'newest')} onClick={() => setReviewSort('newest')}>Newest</button>
              <button type="button" style={reviewSortBtn(reviewSort === 'liked')} onClick={() => setReviewSort('liked')}>Most liked</button>
            </div>
            <Button variant="secondary" icon="pencil" size="sm" onClick={() => { if (!window.AICDB_REQUIRE_AUTH('Sign in to write a review.')) return; setReviewOpen(true); }}>Add review</Button>
          </div>
          {reviewOpen && (
            <AddReviewBox contentId={film.id} onCancel={() => setReviewOpen(false)}
              onSuccess={() => { setReviewOpen(false); loadReviews(); }} />
          )}
          <div>{sortedReviews.map(r => <ReviewItem key={r.id} r={r} currentUserId={currentUserId} onReload={loadReviews} />)}</div>
        </section>

        <ProductionSection film={film} />

        <MoreLikeThis film={film} onOpen={onOpen} />
      </div>

      {rateOpen && (
        <RatingPanel film={{ ...film, score: communityAvg }} onClose={() => setRateOpen(false)}
          onSubmit={handleRated} />
      )}
      {feedback && (
        <RatingFeedback score={feedback.score} first={feedback.first} onClose={() => setFeedback(null)} />
      )}
    </div>
  );
}
Object.assign(window, { FilmDetail, ReviewItem, SideButton });