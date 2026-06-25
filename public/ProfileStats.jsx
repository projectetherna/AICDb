// Dreamwall — profile statistics, achievements, and badge loading

window.AICDB_BADGES = window.AICDB_BADGES || [];
window.AICDB_STREAK = window.AICDB_STREAK || 0;
let MOST_RATED_TYPE = null;
async function loadProfileStats(userId) {
  PROFILE.watched = 0;
  PROFILE.avgRating = 0;
  PROFILE.thisYear = 0;
  PROFILE.hours = 0;
  PROFILE.reviews = 0;
  PROFILE.favGenre = '—';
  PROFILE.favGenreShare = 'No ratings yet';

  window.AICDB_BADGES.length = 0;
  MOST_RATED_TYPE = null;
  window.AICDB_MOST_RATED_TYPE = null;

  if (!userId) return;

  const TIER_STYLES = {
    1: { color: 'var(--fg-1)', ghost: 'rgba(255,255,255,0.06)' },
    2: { color: 'var(--teal-bright)', ghost: 'var(--teal-ghost)' },
    3: { color: 'var(--warning)', ghost: 'rgba(255,200,0,0.12)' },
    4: { color: 'var(--coral-bright)', ghost: 'rgba(216,90,48,0.16)' },
  };
  const pushBadge = (tier, label, sub, icon) => {
    const style = TIER_STYLES[tier] || TIER_STYLES[1];
    window.AICDB_BADGES.push({ label, sub, icon, color: style.color, ghost: style.ghost, tier });
  };

  try {
    const sb = await window.AICDB_AUTH.getClient();

    const { data: ratings, error: ratingsErr } = await sb
      .from('ratings')
      .select('main_score, created_at, content_id')
      .eq('user_id', userId)
      .is('episode_id', null);

    if (ratingsErr) return;

    const rows = ratings || [];
    PROFILE.watched = rows.length;

    const scores = rows.map(r => parseFloat(r.main_score)).filter(n => !Number.isNaN(n));
    PROFILE.avgRating = scores.length
      ? Math.round((scores.reduce((sum, n) => sum + n, 0) / scores.length) * 10) / 10
      : 0;

    const currentYear = new Date().getFullYear();
    PROFILE.thisYear = rows.filter(r => r.created_at && new Date(r.created_at).getFullYear() === currentYear).length;

    const { data: reviewRows, error: reviewsErr } = await sb
      .from('reviews')
      .select('id')
      .eq('user_id', userId);
    if (!reviewsErr) PROFILE.reviews = (reviewRows || []).length;

    const contentIds = [...new Set(rows.map(r => r.content_id).filter(Boolean))];
    if (contentIds.length) {
      try {
        const { data: runtimeRows, error: runtimeErr } = await sb
          .from('content')
          .select('id, runtime_minutes')
          .in('id', contentIds);
        if (!runtimeErr && runtimeRows) {
          const minutesById = Object.fromEntries(runtimeRows.map(c => [c.id, c.runtime_minutes || 0]));
          const totalMinutes = contentIds.reduce((sum, id) => sum + (minutesById[id] || 0), 0);
          PROFILE.hours = Math.floor(totalMinutes / 60);
        } else {
          PROFILE.hours = 0;
        }
      } catch (_) {
        PROFILE.hours = 0;
      }

      try {
        const { data: genreRows, error: genreErr } = await sb
          .from('content')
          .select('id, genres')
          .in('id', contentIds)
          .not('genres', 'is', null);
        if (!genreErr && genreRows && genreRows.length) {
          const withGenres = genreRows.filter(c => Array.isArray(c.genres) && c.genres.length > 0);
          const highScoredIds = new Set(
            rows.filter(r => parseFloat(r.main_score) >= 3.5 && r.content_id).map(r => r.content_id)
          );
          const highScoredContent = withGenres.filter(c => highScoredIds.has(c.id));

          if (highScoredIds.size && highScoredContent.length) {
            const genreCounts = {};
            highScoredContent.forEach(c => {
              c.genres.forEach(g => {
                if (g) genreCounts[g] = (genreCounts[g] || 0) + 1;
              });
            });
            const entries = Object.entries(genreCounts);
            if (entries.length) {
              entries.sort((a, b) => b[1] - a[1]);
              const [topGenre] = entries[0];
              const titleCount = highScoredContent.filter(c => c.genres.includes(topGenre)).length;
              PROFILE.favGenre = topGenre.charAt(0).toUpperCase() + topGenre.slice(1);
              PROFILE.favGenreShare = Math.round((titleCount / highScoredIds.size) * 100) + '% of your top-rated titles';
            } else {
              PROFILE.favGenre = '—';
              PROFILE.favGenreShare = '';
            }
          } else {
            PROFILE.favGenre = '—';
            PROFILE.favGenreShare = '';
          }
        } else {
          PROFILE.favGenre = '—';
          PROFILE.favGenreShare = '';
        }
      } catch (_) {}

      try {
        const { data: typeRows, error: typeErr } = await sb
          .from('content')
          .select('type')
          .in('id', contentIds);
        if (!typeErr && typeRows && typeRows.length) {
          const typeCounts = {};
          typeRows.forEach(c => {
            if (c.type) typeCounts[c.type] = (typeCounts[c.type] || 0) + 1;
          });
          const entries = Object.entries(typeCounts);
          if (entries.length) {
            entries.sort((a, b) => b[1] - a[1]);
            MOST_RATED_TYPE = entries[0][0];
          }
        }
      } catch (_) {
        MOST_RATED_TYPE = null;
      }
      window.AICDB_MOST_RATED_TYPE = MOST_RATED_TYPE;
    }

    // —— Rating count badges ——
    if (PROFILE.watched >= 1) pushBadge(1, 'First Step', '1 title rated', 'star');
    if (PROFILE.watched >= 10) pushBadge(1, 'Critic in the Making', '10 titles rated', 'star-four');
    if (PROFILE.watched >= 50) pushBadge(2, 'Dedicated Viewer', '50 titles rated', 'medal');
    if (PROFILE.watched >= 100) pushBadge(2, 'Century Club', '100 titles rated', 'trophy');
    if (PROFILE.watched >= 500) pushBadge(3, 'Obsessive', '500 titles rated', 'crown-simple');
    if (PROFILE.watched >= 1000) pushBadge(3, 'The Archivist', '1000 titles rated', 'archive');
    if (PROFILE.watched >= 5000) pushBadge(4, 'Living Database', '5000 titles rated', 'database');

    // —— Review count badges ——
    if (PROFILE.reviews >= 1) pushBadge(1, 'First Take', '1 review written', 'chat-centered-text');
    if (PROFILE.reviews >= 10) pushBadge(2, 'Voice of the Community', '10 reviews written', 'chat-centered-dots');
    if (PROFILE.reviews >= 50) pushBadge(3, 'Prolific Critic', '50 reviews written', 'pen-nib');
    if (PROFILE.reviews >= 100) pushBadge(4, 'The Chronicler', '100 reviews written', 'notebook');

    // —— Silent Critic ——
    if (PROFILE.watched >= 50 && PROFILE.reviews === 0) {
      pushBadge(1, 'Silent Critic', '50+ ratings, not a single review', 'seal');
    }

    // —— Curator ——
    try {
      const { count, error } = await sb
        .from('lists')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_system', false);
      if (!error && count >= 5) {
        pushBadge(1, 'Curator', 'Created 5 or more lists', 'list-bullets');
      }
    } catch (_) {}

    // —— The Collector ——
    try {
      const { data: watchlist } = await sb
        .from('lists')
        .select('id')
        .eq('user_id', userId)
        .eq('system_key', 'watchlist')
        .maybeSingle();
      if (watchlist?.id) {
        const { count, error } = await sb
          .from('list_items')
          .select('id', { count: 'exact', head: true })
          .eq('list_id', watchlist.id);
        if (!error && count >= 50) {
          pushBadge(2, 'The Collector', '50+ titles on your watchlist', 'bookmark-simple');
        }
      }
    } catch (_) {}

    // —— Finding a Gem ——
    try {
      const { data: gemRow } = await sb
        .from('ratings')
        .select('id')
        .eq('user_id', userId)
        .eq('visuals', 5)
        .eq('sound_design', 5)
        .eq('script', 5)
        .is('episode_id', null)
        .limit(1)
        .maybeSingle();
      if (gemRow) pushBadge(3, 'Finding a Gem', 'Perfect score across all three dimensions', 'gem');
    } catch (_) {}

    // —— Night Owl ——
    try {
      const { data: nightRows } = await sb
        .from('ratings')
        .select('created_at')
        .eq('user_id', userId)
        .is('episode_id', null);
      const hasNightOwl = (nightRows || []).some(r => {
        if (!r.created_at) return false;
        const h = new Date(r.created_at).getUTCHours();
        return h >= 2 && h < 5;
      });
      if (hasNightOwl) pushBadge(2, 'Night Owl', 'Rated a title between 2 and 5 AM', 'moon');
    } catch (_) {}

    // —— Early Bird ——
    try {
      const { data: dawnRows } = await sb
        .from('ratings')
        .select('created_at')
        .eq('user_id', userId)
        .is('episode_id', null);
      const hasEarlyBird = (dawnRows || []).some(r => {
        if (!r.created_at) return false;
        const h = new Date(r.created_at).getUTCHours();
        return h >= 6 && h < 8;
      });
      if (hasEarlyBird) pushBadge(1, 'Early Bird', 'Rated a title at the crack of dawn', 'sun');
    } catch (_) {}

    // —— Binge Session ——
    try {
      const byDay = {};
      rows.forEach(r => {
        if (!r.created_at) return;
        const day = new Date(r.created_at).toISOString().slice(0, 10);
        byDay[day] = (byDay[day] || 0) + 1;
      });
      if (Object.values(byDay).some(n => n >= 5)) {
        pushBadge(2, 'Binge Session', 'Rated 5 titles in a single day', 'lightning');
      }
    } catch (_) {}

    // —— Marathon ——
    try {
      const times = rows
        .map(r => r.created_at ? new Date(r.created_at).getTime() : NaN)
        .filter(t => !Number.isNaN(t))
        .sort((a, b) => a - b);
      let hasMarathon = false;
      for (let i = 0; i < times.length && !hasMarathon; i++) {
        const windowEnd = times[i] + 60 * 60 * 1000;
        let count = 0;
        for (let j = i; j < times.length && times[j] <= windowEnd; j++) count += 1;
        if (count >= 10) hasMarathon = true;
      }
      if (hasMarathon) pushBadge(2, 'Marathon', 'Rated 10 titles within one hour', 'timer');
    } catch (_) {}

    // —— Polarizing Taste ——
    try {
      if (PROFILE.watched > 0 && scores.length) {
        const hi = Math.max(...scores);
        const lo = Math.min(...scores);
        if (hi >= 4.5 && lo <= 1.5) {
          pushBadge(2, 'Polarizing Taste', 'You love some and hate others', 'arrows-out-line-vertical');
        }
      }
    } catch (_) {}

    // —— Weekend Warrior ——
    try {
      const weekendByDay = {};
      rows.forEach(r => {
        if (!r.created_at) return;
        const d = new Date(r.created_at);
        const dow = d.getUTCDay();
        if (dow !== 0 && dow !== 6) return;
        const day = d.toISOString().slice(0, 10);
        weekendByDay[day] = (weekendByDay[day] || 0) + 1;
      });
      if (Object.values(weekendByDay).some(n => n >= 10)) {
        pushBadge(2, 'Weekend Warrior', 'Rated 10 titles in a single weekend day', 'calendar-blank');
      }
    } catch (_) {}

    // —— Storyteller ——
    try {
      const { data: longReviews } = await sb
        .from('reviews')
        .select('body')
        .eq('user_id', userId);
      const longCount = (longReviews || []).filter(r => (r.body || '').length >= 500).length;
      if (longCount >= 5) {
        pushBadge(3, 'Storyteller', 'Wrote 5 reviews over 500 characters', 'book-open');
      }
    } catch (_) {}

    // —— Contrarian ——
    try {
      if (PROFILE.avgRating > 0) {
        const { data: communityRows } = await sb
          .from('ratings')
          .select('main_score')
          .is('episode_id', null);
        const communityScores = (communityRows || [])
          .map(r => parseFloat(r.main_score))
          .filter(n => !Number.isNaN(n));
        if (communityScores.length) {
          const communityAvg = communityScores.reduce((sum, n) => sum + n, 0) / communityScores.length;
          if (Math.abs(PROFILE.avgRating - communityAvg) > 1.0) {
            pushBadge(2, 'Contrarian', 'Your taste runs against the grain', 'arrow-counter-clockwise');
          }
        }
      }
    } catch (_) {}

    // —— Day One ——
    try {
      const { data: userProfile } = await sb
        .from('profiles')
        .select('created_at')
        .eq('id', userId)
        .maybeSingle();
      const { data: earliestProfiles } = await sb
        .from('profiles')
        .select('created_at')
        .order('created_at', { ascending: true })
        .limit(1);
      const userJoined = userProfile?.created_at ? new Date(userProfile.created_at) : null;
      const platformStart = earliestProfiles?.[0]?.created_at ? new Date(earliestProfiles[0].created_at) : null;
      if (userJoined && platformStart) {
        const diffDays = (userJoined - platformStart) / (1000 * 60 * 60 * 24);
        if (diffDays <= 30) pushBadge(3, 'Day One', 'Here from the very beginning', 'rocket');
      }
    } catch (_) {}

    // —— First Blood ——
    try {
      const { data: firstRating } = await sb
        .from('ratings')
        .select('created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();
      const { data: earliestRatings } = await sb
        .from('ratings')
        .select('created_at')
        .order('created_at', { ascending: true })
        .limit(1);
      const userFirst = firstRating?.created_at ? new Date(firstRating.created_at) : null;
      const platformFirst = earliestRatings?.[0]?.created_at ? new Date(earliestRatings[0].created_at) : null;
      if (userFirst && platformFirst) {
        const diffDays = (userFirst - platformFirst) / (1000 * 60 * 60 * 24);
        if (diffDays <= 30) pushBadge(3, 'First Blood', 'Among the first to rate on Dreamwall', 'flag');
      }
    } catch (_) {}

    // —— Early Adopter ——
    try {
      const { data: userProfile } = await sb
        .from('profiles')
        .select('created_at')
        .eq('id', userId)
        .maybeSingle();
      if (userProfile?.created_at) {
        const { count, error } = await sb
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .lte('created_at', userProfile.created_at);
        if (!error && count <= 100) {
          pushBadge(4, 'Early Adopter', 'One of the first 100 members', 'crown');
        }
      }
    } catch (_) {}

    window.AICDB_BADGES.sort((a, b) => b.tier - a.tier);
  } catch (_) {}
}

// ---- LOWER: badges | favorites ----
function badgeTierGlow(ghost, tier) {
  if (!tier || tier < 2) return undefined;
  const alpha = { 2: 0.25, 3: 0.40, 4: 0.55 }[tier];
  const blur = { 2: 8, 3: 14, 4: 20 }[tier];
  const m = String(ghost).match(/rgba?\(([^)]+)\)/);
  if (!m) return undefined;
  const parts = m[1].split(',').map(s => s.trim());
  if (parts.length < 3) return undefined;
  return `0 0 ${blur}px rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
}

function BadgeItem({ b }) {
  const tier = b.tier || 1;
  const size = { 1: 44, 2: 50, 3: 58, 4: 66 }[tier] || 44;
  const borderW = { 1: 1, 2: 1.5, 3: 2, 4: 2 }[tier] || 1;
  const iconSize = { 1: 20, 2: 22, 3: 26, 4: 30 }[tier] || 20;
  const glow = badgeTierGlow(b.ghost, tier);
  return (
    <div style={{ display:'flex', flexDirection:'row', alignItems:'center', gap:10 }}>
      <div style={{ width:66, display:'flex', alignItems:'center', justifyContent:'center', flex:'none' }}>
        <div style={{ width:size, height:size, borderRadius:'50%', flex:'none', background:b.ghost,
          border:`${borderW}px solid ${b.color}`,
          boxShadow: glow,
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon name={b.icon} size={iconSize} color={b.color} weight="fill" />
        </div>
      </div>
      <div style={{ flex:1, minWidth:0, overflow:'hidden' }}>
        {tier === 4 && (
          <div className="overline" style={{ color:b.color, marginBottom:4, letterSpacing:'0.12em' }}>LEGENDARY</div>
        )}
        <div style={{ font:'600 13px/1.2 var(--font-body)', color:'var(--fg-0)' }}>{b.label}</div>
        <div style={{ font:'11px/1.35 var(--font-body)', color:'var(--fg-3)', marginTop:2 }}>{b.sub}</div>
      </div>
    </div>
  );
}

// ---- BOTTOM: statistics ----
function StatCard({ icon, color, value, unit, label }) {
  return (
    <div style={{ padding:'14px 16px', background:'var(--bg-1)', border:'1px solid var(--border-subtle)',
      borderRadius:'var(--radius-lg)', display:'flex', flexDirection:'column', justifyContent:'space-between', minHeight:90 }}>
      <Icon name={icon} size={16} color={color} weight="fill" />
      <div>
        <div style={{ display:'flex', alignItems:'baseline', gap:5 }}>
          <span style={{ font:'700 26px/1 var(--font-mono)', color:'var(--fg-0)', letterSpacing:'-0.02em' }}>{value}</span>
          {unit && <span style={{ font:'500 13px/1 var(--font-mono)', color:'var(--fg-2)' }}>{unit}</span>}
        </div>
        <div className="overline" style={{ marginTop:9, color:'var(--fg-1)' }}>{label}</div>
      </div>
    </div>
  );
}

function StatsAndAchievements({ isOwnProfile = true, favoriteCount = 0 }) {
  const [showAllBadges, setShowAllBadges] = React.useState(false);
  const visibleBadges = showAllBadges ? window.AICDB_BADGES : window.AICDB_BADGES.slice(0, 6);
  const MAX_LEFT = 7;
  const leftBadges = visibleBadges.slice(0, MAX_LEFT);
  const rightBadges = visibleBadges.slice(MAX_LEFT);

  return (
    <section style={{ display:'grid', gridTemplateColumns:'1.1fr 0.9fr', gap:24, marginBottom:32 }}>
      {/* Left — Statistics */}
      <div>
        <SectionHeading marginBottom={11} sub={isOwnProfile ? 'A look at your taste, by the numbers' : 'A look at their taste, by the numbers'}>Statistics</SectionHeading>

        <div style={{ position:'relative', borderRadius:'var(--radius-lg)', overflow:'hidden', minHeight:200,
          background:'linear-gradient(140deg, #241a3a 0%, #18233a 48%, #0f2e2b 105%)', boxShadow:'var(--shadow-2)', marginBottom:20 }}>
          <div style={{ position:'absolute', inset:0, opacity:0.55,
            backgroundImage:'linear-gradient(rgba(157,141,241,0.13) 1px, transparent 1px),'
              +'linear-gradient(90deg, rgba(78,205,196,0.10) 1px, transparent 1px)', backgroundSize:'30px 30px' }} />
          <div style={{ position:'absolute', inset:0,
            background:'radial-gradient(75% 60% at 72% 18%, rgba(124,111,224,0.40), transparent 62%),'
              +'radial-gradient(60% 50% at 12% 92%, rgba(78,205,196,0.28), transparent 60%)' }} />
          <div style={{ position:'absolute', left:-40, top:-40, width:200, height:200, borderRadius:'50%',
            border:'1px solid rgba(157,141,241,0.35)' }} />
          <div style={{ position:'absolute', left:-10, top:-10, width:140, height:140, borderRadius:'50%',
            border:'1px solid rgba(78,205,196,0.30)' }} />
          <div style={{ position:'relative', height:'100%', padding:'18px 20px', display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
            <span className="overline" style={{ color:'var(--type-vertical)' }}>Favorite genre</span>
            <div style={{ font:'700 36px/1 var(--font-display)', letterSpacing:'-0.015em', color:'var(--fg-0)', margin:'10px 0 8px' }}>{PROFILE.favGenre}</div>
            <p style={{ font:'var(--text-body)', color:'var(--fg-1)', margin:0, maxWidth:300 }}>{PROFILE.favGenreShare}</p>
            {window.AICDB_MOST_RATED_TYPE != null && (
              <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:10 }}>
                <Icon name={
                  window.AICDB_MOST_RATED_TYPE === 'film' ? 'film-slate'
                  : window.AICDB_MOST_RATED_TYPE === 'series' ? 'monitor-play'
                  : window.AICDB_MOST_RATED_TYPE === 'short' ? 'film-strip'
                  : 'play-circle'
                } size={13} color="var(--fg-3)" />
                <span style={{ font:'var(--text-data-sm)', color:'var(--fg-3)' }}>
                  Mostly watches {window.AICDB_MOST_RATED_TYPE.charAt(0).toUpperCase() + window.AICDB_MOST_RATED_TYPE.slice(1)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div style={{ padding:'14px 18px', background:'var(--bg-1)', marginBottom:20,
          border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)',
          display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div className="overline" style={{ color:'var(--fg-1)', marginBottom:10 }}>Average rating given</div>
            <StarRating value={PROFILE.avgRating} size={18} />
          </div>
          <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
            <span style={{ font:'700 32px/1 var(--font-mono)', color:'var(--coral)', letterSpacing:'-0.02em' }}>{PROFILE.avgRating.toFixed(1)}</span>
            <span style={{ font:'500 15px/1 var(--font-mono)', color:'var(--fg-3)' }}>/5</span>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:20 }}>
          <StatCard icon="chat-centered-text" color="var(--type-vertical)" value={PROFILE.reviews} label="Reviews written" />
          <StatCard icon="film-slate" color="var(--coral)" value={PROFILE.thisYear} label="Titles this year" />
        </div>
      </div>

      {/* Right — Achievements */}
      <div>
        <SectionHeading marginBottom={11} sub="Milestones you've unlocked">Achievements</SectionHeading>
        {window.AICDB_BADGES.length ? (
          <>
            <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
              <div style={{ flex:1, display:'flex', flexDirection:'column', gap:12 }}>
                {leftBadges.map(b => <BadgeItem key={b.label} b={b} />)}
              </div>
              <div style={{ flex:1, display:'flex', flexDirection:'column', gap:12 }}>
                {rightBadges.map(b => <BadgeItem key={b.label} b={b} />)}
              </div>
            </div>
            {window.AICDB_BADGES.length > 6 && (
              <button type="button" onClick={() => setShowAllBadges(v => !v)}
                style={{ display:'block', margin:'12px auto 0', background:'none', border:'none',
                  color:'var(--teal-bright)', font:'600 13px/1 var(--font-body)', cursor:'pointer', padding:'4px 8px' }}>
                {showAllBadges ? 'Show less' : `See all ${window.AICDB_BADGES.length} badges`}
              </button>
            )}
          </>
        ) : (
          <EmptyState icon="medal" accent="var(--coral)" compact
            title="No achievements yet"
            sub="Rate titles and write reviews to start earning badges." />
        )}
      </div>
    </section>
  );
}
Object.assign(window, { loadProfileStats, badgeTierGlow, BadgeItem, StatCard, StatsAndAchievements });
