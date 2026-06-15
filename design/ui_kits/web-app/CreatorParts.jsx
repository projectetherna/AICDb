// Dreamwall UI kit — Creator page building blocks.
// Centered cinematic hero (banner + overlapping avatar), social row, follow,
// horizontal stat strip, and the About section (tools / influences / notes).

// ---- Verified Creator badge ----
function VerifiedBadge() {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:'var(--radius-pill)',
      background:'var(--teal-ghost)', color:'var(--teal-bright)', font:'600 12px/1 var(--font-body)', letterSpacing:'0.03em',
      borderWidth:1, borderStyle:'solid', borderColor:'rgba(78,205,196,0.35)' }}>
      <Icon name="seal-check" size={15} color="var(--teal-bright)" weight="fill" /> Verified Creator
    </span>
  );
}

// ---- social link button ----
function SocialLink({ icon, label, href }) {
  const [h, setH] = React.useState(false);
  return (
    <a href={href || '#'} title={label} onClick={e => { if (!href || href === '#') e.preventDefault(); }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ width:42, height:42, flex:'none', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
        background: h ? 'var(--bg-2)' : 'var(--bg-1)', borderWidth:1, borderStyle:'solid',
        borderColor: h ? 'var(--border-strong)' : 'var(--border-subtle)', transition:'all var(--dur-fast)' }}>
      <Icon name={icon} size={19} color={h ? 'var(--fg-0)' : 'var(--fg-1)'} weight="fill" />
    </a>
  );
}

// ---- follow button (toggles) ----
function FollowButton({ count }) {
  const [following, setFollowing] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const n = count + (following ? 1 : 0);
  const fmt = (v) => v >= 1000 ? (v / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(v);
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap:16 }}>
      <button onClick={() => setFollowing(f => !f)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'11px 22px', borderRadius:'var(--radius-pill)', cursor:'pointer',
          font:'600 14px/1 var(--font-body)', transition:'all var(--dur-fast)',
          borderWidth:1, borderStyle:'solid',
          background: following ? 'transparent' : (hover ? 'var(--coral-bright)' : 'var(--coral)'),
          borderColor: following ? 'var(--border-strong)' : 'transparent',
          color: following ? 'var(--fg-0)' : 'var(--fg-on-accent)' }}>
        <Icon name={following ? 'check' : 'plus'} size={16} color="currentColor" weight="bold" />
        {following ? 'Following' : 'Follow'}
      </button>
      <div style={{ display:'flex', alignItems:'baseline', gap:7 }}>
        <span style={{ font:'700 18px/1 var(--font-mono)', color:'var(--fg-0)' }}>{fmt(n)}</span>
        <span className="overline" style={{ color:'var(--fg-2)' }}>Followers</span>
      </div>
    </div>
  );
}

// ---- centered cinematic hero ----
function CreatorHero({ creator, manage, onToggleManage }) {
  return (
    <div style={{ position:'relative', marginBottom:140 }}>
      {/* banner — tall, dramatic, full-bleed upload area */}
      <div style={{ position:'relative', height:380, borderRadius:'var(--radius-xl)', overflow:'hidden',
        background: creator.banner
          ? `url(${creator.banner}) center/cover`
          : 'linear-gradient(125deg, #2a1410 0%, #241a3a 52%, #10302d 120%)' }}>
        {!creator.banner && (
          <>
            <div style={{ position:'absolute', inset:0,
              background:'radial-gradient(60% 120% at 22% 0%, rgba(216,90,48,0.30), transparent 55%),'
                + 'radial-gradient(55% 120% at 80% 8%, rgba(78,205,196,0.20), transparent 55%)' }} />
            <div style={{ position:'absolute', inset:0, opacity:0.5,
              backgroundImage:'radial-gradient(rgba(245,243,239,0.05) 1px, transparent 1px)', backgroundSize:'5px 5px' }} />
          </>
        )}
        {/* bottom protection scrim into canvas */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(10,10,10,0.05) 40%, rgba(10,10,10,0.55) 80%, var(--bg-0) 100%)' }} />

        {/* upload affordance (creator only) */}
        {manage && (
          <div style={{ position:'absolute', top:16, left:16, display:'inline-flex', alignItems:'center', gap:8,
            padding:'9px 14px', background:'rgba(10,10,10,0.5)', backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)',
            borderRadius:'var(--radius-pill)', borderWidth:1, borderStyle:'solid', borderColor:'var(--border-default)',
            font:'600 12.5px/1 var(--font-body)', color:'var(--fg-0)', cursor:'pointer' }}>
            <Icon name="image" size={15} color="var(--fg-1)" /> Change cover photo
          </div>
        )}

        {/* view-mode toggle */}
        <div style={{ position:'absolute', top:16, right:16, display:'flex', gap:3, padding:3, borderRadius:'var(--radius-pill)',
          background:'rgba(10,10,10,0.5)', backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)',
          borderWidth:1, borderStyle:'solid', borderColor:'var(--border-default)' }}>
          {[['public','Public view'], ['manage','You (creator)']].map(([v, lbl]) => {
            const on = manage === (v === 'manage');
            return (
              <button key={v} onClick={() => onToggleManage(v === 'manage')}
                style={{ padding:'7px 13px', borderRadius:'var(--radius-pill)', border:'none', cursor:'pointer',
                  font:'600 12.5px/1 var(--font-body)', transition:'all var(--dur-fast)',
                  background: on ? 'var(--fg-0)' : 'transparent', color: on ? 'var(--bg-0)' : 'var(--fg-1)' }}>{lbl}</button>
            );
          })}
        </div>
      </div>

      {/* CENTERED overlapping identity block */}
      <div style={{ position:'absolute', left:0, right:0, bottom:-128, display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'0 24px' }}>
        {/* avatar — centered, overlapping bottom of banner */}
        <div style={{ width:148, height:148, borderRadius:'50%', flex:'none', position:'relative',
          background: creator.avatarImg ? `url(${creator.avatarImg}) center/cover` : `linear-gradient(135deg, ${creator.avatar[0]}, ${creator.avatar[1]})`,
          borderWidth:4, borderStyle:'solid', borderColor:'var(--bg-0)', boxShadow:'var(--shadow-3)',
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          {!creator.avatarImg && <span style={{ font:'600 64px/1 var(--font-display)', color:'rgba(255,255,255,0.92)' }}>{creator.initials}</span>}
          <div style={{ position:'absolute', inset:0, borderRadius:'50%',
            boxShadow:'inset 0 2px 18px rgba(255,255,255,0.22), inset 0 -12px 26px rgba(0,0,0,0.35)' }} />
        </div>

        {/* name + verified */}
        <div style={{ display:'flex', alignItems:'center', gap:14, margin:'18px 0 0', flexWrap:'wrap', justifyContent:'center' }}>
          <h1 style={{ font:'700 38px/1.05 var(--font-display)', letterSpacing:'-0.015em', color:'var(--fg-0)', margin:0 }}>{creator.name}</h1>
          {creator.verified !== false && <VerifiedBadge />}
        </div>
        <div style={{ font:'var(--text-data-sm)', color:'var(--fg-2)', marginTop:10, display:'inline-flex', alignItems:'center', gap:7 }}>
          <Icon name="map-pin" size={13} color="var(--fg-3)" />{creator.location}
          <span style={{ color:'var(--fg-3)' }}>·</span>{creator.joined}
        </div>

        {/* manifesto — creator's own voice */}
        <p style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontWeight:400, fontSize:19, lineHeight:1.5,
          color:'var(--fg-1)', maxWidth:600, margin:'20px 0 0' }}>
          “{creator.manifesto}”
        </p>

        {/* follow / edit + social */}
        <div style={{ display:'flex', alignItems:'center', gap:24, margin:'26px 0 0', flexWrap:'wrap', justifyContent:'center' }}>
          {manage ? (
            <button onClick={() => { window.location.href = 'creator-setup.html' + (creator.accountId ? '?edit=' + encodeURIComponent(creator.accountId) : ''); }}
              style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'11px 22px', borderRadius:'var(--radius-pill)', cursor:'pointer',
              font:'600 14px/1 var(--font-body)', background:'transparent', color:'var(--fg-0)',
              borderWidth:1, borderStyle:'solid', borderColor:'var(--border-strong)' }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--border-accent)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border-strong)'; }}>
              <Icon name="pencil" size={15} color="var(--fg-1)" /> Edit This Page
            </button>
          ) : (
            <FollowButton count={creator.followers} />
          )}
          <div style={{ display:'flex', gap:10 }}>
            <SocialLink icon="youtube-logo" label="YouTube" href={creator.social.youtube} />
            <SocialLink icon="instagram-logo" label="Instagram" href={creator.social.instagram} />
            <SocialLink icon="x-logo" label="X" href={creator.social.x} />
            <SocialLink icon="tiktok-logo" label="TikTok" href={creator.social.tiktok} />
            <SocialLink icon="globe" label="Website" href={creator.social.website} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- horizontal stat strip ----
function CreatorStatStrip({ items }) {
  return (
    <div style={{ display:'flex', flexWrap:'wrap', background:'var(--bg-1)', borderRadius:'var(--radius-lg)', overflow:'hidden',
      borderWidth:1, borderStyle:'solid', borderColor:'var(--border-subtle)', marginBottom:64 }}>
      {items.map((it, i) => (
        <React.Fragment key={it.label}>
          {i > 0 && <div style={{ width:1, alignSelf:'stretch', background:'var(--border-subtle)' }} />}
          <div style={{ flex:'1 1 160px', padding:'24px 18px', textAlign:'center' }}>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:11 }}><Icon name={it.icon} size={18} color={it.color} weight="fill" /></div>
            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'center', gap:4 }}>
              <span style={{ font:'700 30px/1 var(--font-mono)', color: it.scoreColor || 'var(--fg-0)', letterSpacing:'-0.02em' }}>{it.value}</span>
              {it.unit && <span style={{ font:'500 13px/1 var(--font-mono)', color:'var(--fg-2)' }}>{it.unit}</span>}
            </div>
            <div className="overline" style={{ marginTop:9, color:'var(--fg-2)' }}>{it.label}</div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

// ---- About: tools / influences / notes ----
function ToolChip({ name }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'10px 14px', borderRadius:'var(--radius-md)',
      background:'var(--bg-2)', borderWidth:1, borderStyle:'solid', borderColor:'var(--border-default)',
      font:'600 13px/1 var(--font-body)', color:'var(--fg-0)' }}>
      <Icon name="sparkles" size={14} color="var(--teal-bright)" />{name}
    </span>
  );
}

function AboutSection({ creator }) {
  return (
    <section style={{ marginBottom:64 }}>
      <h2 style={{ font:'var(--text-h2)', color:'var(--fg-0)', letterSpacing:'-0.01em', marginBottom:24 }}>About</h2>
      <div className="aicdb-about-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
        <div style={{ padding:'24px 26px', background:'var(--bg-1)', borderRadius:'var(--radius-lg)', borderWidth:1, borderStyle:'solid', borderColor:'var(--border-subtle)' }}>
          <div className="overline" style={{ color:'var(--teal-bright)', marginBottom:16 }}>Tools &amp; Stack</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
            {creator.tools.map(t => <ToolChip key={t} name={t} />)}
          </div>
        </div>
        <div style={{ padding:'24px 26px', background:'var(--bg-1)', borderRadius:'var(--radius-lg)', borderWidth:1, borderStyle:'solid', borderColor:'var(--border-subtle)' }}>
          <div className="overline" style={{ color:'var(--coral-bright)', marginBottom:16 }}>Influences</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:9 }}>
            {creator.influences.map(inf => (
              <span key={inf} style={{ padding:'8px 13px', borderRadius:'var(--radius-pill)', background:'var(--coral-ghost)',
                color:'var(--coral-bright)', font:'600 13px/1 var(--font-body)' }}>{inf}</span>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding:'26px 28px', background:'var(--bg-1)', borderRadius:'var(--radius-lg)', borderWidth:1, borderStyle:'solid', borderColor:'var(--border-subtle)' }}>
        <div className="overline" style={{ color:'var(--fg-2)', marginBottom:14 }}>Notes from the creator</div>
        <p style={{ font:'var(--text-body-lg)', color:'var(--fg-1)', margin:0, maxWidth:760, whiteSpace:'pre-line' }}>{creator.notes}</p>
      </div>
    </section>
  );
}

Object.assign(window, { VerifiedBadge, SocialLink, FollowButton, CreatorHero, CreatorStatStrip, ToolChip, AboutSection });
