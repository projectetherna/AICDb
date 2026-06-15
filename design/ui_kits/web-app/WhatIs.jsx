// Dreamwall UI kit — "What is Dreamwall" manifesto page.
// Minimal, editorial, scroll-revealed. Reads like a mission statement,
// not a marketing page: what it is, why it exists, how ratings work, how to join.

// ---- scroll/mount reveal wrapper.
// Resting state is VISIBLE; a one-shot CSS entrance animates UP from hidden.
// This guarantees content is never stuck invisible (animation only sweetens it),
// and is disabled under prefers-reduced-motion via the stylesheet below.
function Reveal({ children, delay = 0, as = 'div', style }) {
  const Tag = as;
  return (
    <Tag className="wi-reveal" style={{ ...style, animationDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

// ---- numbered section block ----
function ManifestoSection({ num, kicker, title, children, accent = 'var(--coral-bright)' }) {
  return (
    <section style={{ padding:'88px 0', borderTop:'1px solid var(--border-subtle)' }}>
      <div style={{ display:'grid', gridTemplateColumns:'minmax(0,180px) minmax(0,1fr)', gap:'48px', alignItems:'start' }}>
        <Reveal style={{ position:'sticky', top:120 }}>
          <div style={{ font:'700 15px/1 var(--font-mono)', color:accent, marginBottom:14 }}>{num}</div>
          <div className="overline" style={{ color:'var(--fg-2)' }}>{kicker}</div>
        </Reveal>
        <div>
          <Reveal>
            <h2 style={{ font:'600 38px/1.16 var(--font-display)', letterSpacing:'-0.015em', color:'var(--fg-0)', margin:'0 0 28px', maxWidth:680 }}>{title}</h2>
          </Reveal>
          <Reveal delay={80}>{children}</Reveal>
        </div>
      </div>
    </section>
  );
}

function Lead({ children }) {
  return <p style={{ font:'400 20px/1.62 var(--font-body)', color:'var(--fg-1)', margin:'0 0 22px', maxWidth:640 }}>{children}</p>;
}

// ---- how ratings work: visual of users → score ----
function RatingDiagram() {
  const avatars = [['#d85a30','#9d8df1'],['#4ecdc4','#6f9ceb'],['#a04a8f','#e5b23b'],['#3a8fb0','#1a2b33'],['#e5b23b','#4ecdc4'],['#7c6fe0','#1e1a36']];
  return (
    <div style={{ display:'flex', alignItems:'center', gap:30, flexWrap:'wrap', marginTop:34,
      padding:'30px 34px', background:'var(--bg-1)', borderRadius:'var(--radius-xl)', borderWidth:1, borderStyle:'solid', borderColor:'var(--border-subtle)' }}>
      <div style={{ flex:'1 1 240px' }}>
        <div className="overline" style={{ color:'var(--fg-2)', marginBottom:14 }}>Thousands of real viewers</div>
        <div style={{ display:'flex', alignItems:'center' }}>
          {avatars.map((a, i) => (
            <div key={i} style={{ width:40, height:40, borderRadius:'50%', marginLeft: i ? -12 : 0,
              background:`linear-gradient(135deg, ${a[0]}, ${a[1]})`, borderWidth:2, borderStyle:'solid', borderColor:'var(--bg-1)' }} />
          ))}
          <div style={{ width:40, height:40, borderRadius:'50%', marginLeft:-12, background:'var(--bg-3)',
            borderWidth:2, borderStyle:'solid', borderColor:'var(--bg-1)', display:'flex', alignItems:'center', justifyContent:'center',
            font:'600 12px/1 var(--font-mono)', color:'var(--fg-1)' }}>+24k</div>
        </div>
        <div style={{ marginTop:16 }}><StarRating value={4.5} size={20} /></div>
      </div>
      <Icon name="caret-right" size={26} color="var(--fg-3)" />
      <div style={{ flex:'none', textAlign:'center' }}>
        <ScoreRing score={8.7} size={104} />
        <div style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', marginTop:12, maxWidth:160 }}>One honest score, averaged from every rating.</div>
      </div>
    </div>
  );
}

function WhatIs({ onNav }) {
  return (
    <div style={{ maxWidth:1040, margin:'0 auto', padding:'0 28px 40px' }}>
      {/* hero */}
      <section style={{ padding:'120px 0 96px', textAlign:'center' }}>
        <Reveal>
          <div className="overline" style={{ color:'var(--teal-bright)', marginBottom:26, letterSpacing:'0.16em' }}>The Dreamwall Manifesto</div>
        </Reveal>
        <Reveal delay={90}>
          <h1 style={{ font:'700 clamp(44px, 7vw, 82px)/1.04 var(--font-display)', letterSpacing:'-0.025em', color:'var(--fg-0)', margin:'0 auto', maxWidth:880 }}>
            A home for films that were <span style={{ fontStyle:'italic', color:'var(--coral-bright)' }}>dreamed</span> into being.
          </h1>
        </Reveal>
        <Reveal delay={180}>
          <p style={{ font:'400 21px/1.6 var(--font-body)', color:'var(--fg-1)', margin:'30px auto 0', maxWidth:600 }}>
            Dreamwall is where AI-generated film and series are watched, rated, and taken seriously — by the people who actually watch them.
          </p>
        </Reveal>
        <Reveal delay={260}>
          <div style={{ display:'flex', gap:13, justifyContent:'center', marginTop:40 }}>
            <Button variant="primary" size="lg" onClick={() => onNav && onNav('Feed')}>Enter the feed</Button>
            <Button variant="secondary" size="lg" onClick={() => onNav && onNav('Creators')}>Meet the creators</Button>
          </div>
        </Reveal>
      </section>

      <ManifestoSection num="01" kicker="What it is" title="A taste-driven home for a brand-new artform.">
        <Lead>A generation of filmmakers is working in latent space — diffusion, text-to-video, hybrid live-action. Their work was scattered across feeds that were never built to hold it.</Lead>
        <Lead>Dreamwall gathers it in one place: a catalog you can browse, score, and argue about. Films, series, shorts, verticals — catalogued like the real cinema it is, with the people behind every render credited up front.</Lead>
      </ManifestoSection>

      <ManifestoSection num="02" kicker="Why it exists" title="Because “AI-generated” was never an insult." accent="var(--teal-bright)">
        <Lead>The tools changed. The instinct didn't. A great frame is still a great frame, whether it was shot on film or grown from a prompt at 3am.</Lead>
        <Lead>We built Dreamwall to give this work a serious place to live — somewhere a short made by one person on a laptop sits beside a studio's four-season epic, and both get judged on the only thing that matters: did it move you?</Lead>
      </ManifestoSection>

      <ManifestoSection num="03" kicker="How ratings work" title="Every score is earned, not generated.">
        <Lead>This is the part people get wrong, so we'll be blunt: <b style={{ color:'var(--fg-0)' }}>there is no AI scoring system here.</b> Nothing on this platform is judged by a machine.</Lead>
        <Lead>Every title's score is the plain average of ratings from real viewers — people who watched it and reached for the stars. More ratings, more honest the number. That's the whole mechanism. No black box.</Lead>
        <RatingDiagram />
      </ManifestoSection>

      <ManifestoSection num="04" kicker="How to join" title="Watch. Rate. Or pick up the tools and make something." accent="var(--teal-bright)">
        <Lead>Anyone can join free, build a watchlist, and start rating. Follow the creators whose taste you trust and let the feed bring their next release to you.</Lead>
        <Lead>Made something yourself? Switch to a creator account, publish your work, and put it in front of an audience that's actually looking for it.</Lead>
        <div style={{ display:'flex', gap:13, flexWrap:'wrap', marginTop:30 }}>
          <Button variant="primary" size="lg" onClick={() => onNav && onNav('Feed')}>Create a free account</Button>
          <Button variant="ghost" size="lg" onClick={() => onNav && onNav('Films')}>Browse the catalog</Button>
        </div>
      </ManifestoSection>

      {/* closing line */}
      <section style={{ padding:'96px 0 120px', textAlign:'center', borderTop:'1px solid var(--border-subtle)' }}>
        <Reveal>
          <p style={{ font:'400 italic 30px/1.4 var(--font-display)', fontStyle:'italic', color:'var(--fg-1)', margin:'0 auto', maxWidth:680 }}>
            “The tools are new. The reason we make films is as old as firelight.”
          </p>
          <div style={{ marginTop:24, display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
            <Logo size={18} />
          </div>
        </Reveal>
      </section>
    </div>
  );
}

Object.assign(window, { WhatIs, Reveal, ManifestoSection, RatingDiagram });
