// Dreamwall UI kit — shared "system" surfaces:
// EmptyState, loading Skeletons, MoreLikeThis, SearchEmpty (no-results),
// NotFound (404), Footer + LanguageSelector.

// ============================================================
// Empty state — icon + headline + sub + action button
// ============================================================
function EmptyState({ icon, title, sub, actionLabel, onAction, accent = 'var(--coral)', compact }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center',
      padding: compact ? '48px 24px' : '80px 24px', maxWidth:440, margin:'0 auto' }}>
      <div style={{ width:88, height:88, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
        background:'var(--bg-1)', border:'1px solid var(--border-subtle)', marginBottom:24, position:'relative' }}>
        <div style={{ position:'absolute', inset:0, borderRadius:'50%',
          background:`radial-gradient(circle at 50% 35%, ${accent}22, transparent 70%)` }} />
        <Icon name={icon} size={36} color={accent} weight="fill" />
      </div>
      <h2 style={{ font:'600 24px/1.2 var(--font-display)', color:'var(--fg-0)', margin:'0 0 10px' }}>{title}</h2>
      <p style={{ font:'var(--text-body)', color:'var(--fg-2)', margin:'0 0 24px', maxWidth:360 }}>{sub}</p>
      {actionLabel && <Button variant="primary" onClick={onAction}>{actionLabel}</Button>}
    </div>
  );
}

// ============================================================
// Loading skeletons — poster-shaped grey placeholders, gentle shimmer
// ============================================================
const SKELETON_STYLE = `
@keyframes aicdbShimmer { 0% { background-position: -360px 0; } 100% { background-position: 360px 0; } }
.aicdb-skel { background: linear-gradient(100deg, var(--bg-1) 30%, var(--bg-2) 50%, var(--bg-1) 70%);
  background-size: 720px 100%; animation: aicdbShimmer 1.25s linear infinite; }
@media (prefers-reduced-motion: reduce) { .aicdb-skel { animation: none; } }
`;

function SkeletonCard({ vertical }) {
  return (
    <div>
      <div className="aicdb-skel" style={{ aspectRatio: vertical ? '9/16' : '2/3', borderRadius:'var(--radius-lg)' }} />
      <div className="aicdb-skel" style={{ height:13, width:'78%', borderRadius:6, marginTop:12 }} />
      <div className="aicdb-skel" style={{ height:11, width:'46%', borderRadius:6, marginTop:8 }} />
    </div>
  );
}

function SkeletonGrid({ count = 12, min = 176 }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:`repeat(auto-fill, minmax(${min}px, 1fr))`, gap:24 }}>
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

// ============================================================
// More like this — similar posters at the bottom of a detail page
// ============================================================
function MoreLikeThis({ film, onOpen }) {
  const similar = window.AICDB_SIMILAR(film, 6);
  if (!similar.length) return null;
  return (
    <section style={{ marginTop:48 }}>
      <h2 style={{ font:'var(--text-h2)', color:'var(--fg-0)', marginBottom:20 }}>More like this</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))', gap:20 }}>
        {similar.map(f => <FilmCard key={f.id} film={f} width="auto" onOpen={onOpen || (() => {})} />)}
      </div>
    </section>
  );
}

// ============================================================
// Search empty / Content not found — dark editorial empty state
// ============================================================
function SearchEmpty({ query, suggestion, onBrowse, onSuggest }) {
  return (
    <div style={{ maxWidth:1180, margin:'0 auto', padding:'60px 28px 90px' }}>
      <EmptyState icon="magnifying-glass" accent="var(--teal)"
        title={query ? `No results for “${query}”` : 'No results found'}
        sub="We couldn’t find any titles matching that. Check the spelling, try different keywords, or browse the catalog." />
      <div style={{ display:'flex', gap:12, justifyContent:'center', marginTop:-8, flexWrap:'wrap' }}>
        {suggestion && suggestion.toLowerCase() !== (query || '').toLowerCase() && (
          <button onClick={() => onSuggest && onSuggest(suggestion)}
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'11px 18px', borderRadius:'var(--radius-md)',
              cursor:'pointer', font:'600 14px/1 var(--font-body)', background:'var(--teal-ghost)',
              border:'1px solid rgba(78,205,196,0.4)', color:'var(--teal-bright)' }}>
            Did you mean <span style={{ textDecoration:'underline' }}>{suggestion}</span>?
          </button>
        )}
        <Button variant="secondary" icon="compass" onClick={onBrowse}>Browse the catalog</Button>
      </div>
    </div>
  );
}

// ============================================================
// 404 — cinematic "this frame doesn't exist yet"
// ============================================================
function NotFound({ onHome }) {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      textAlign:'center', padding:'40px 24px', position:'relative', overflow:'hidden' }}>
      {/* cinematic backdrop */}
      <div style={{ position:'absolute', inset:0, zIndex:0,
        background:'radial-gradient(110% 80% at 20% 8%, rgba(216,90,48,0.16), transparent 46%),'
          + 'radial-gradient(100% 80% at 84% 94%, rgba(78,205,196,0.12), transparent 48%)' }} />
      <div style={{ position:'absolute', inset:0, zIndex:0, opacity:0.5,
        backgroundImage:'radial-gradient(rgba(245,243,239,0.04) 1px, transparent 1px)', backgroundSize:'5px 5px' }} />

      {/* empty film-frame illustration */}
      <div style={{ position:'relative', zIndex:1, marginBottom:34 }}>
        <div style={{ position:'relative', width:172, height:116, borderRadius:'var(--radius-md)',
          border:'2px dashed var(--border-strong)', display:'flex', alignItems:'center', justifyContent:'center',
          background:'linear-gradient(135deg, rgba(216,90,48,0.06), rgba(78,205,196,0.05))' }}>
          {/* film perforations */}
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:14, display:'flex', flexDirection:'column',
            justifyContent:'space-around', alignItems:'center', borderRight:'1px solid var(--border-subtle)' }}>
            {[0,1,2,3].map(i => <span key={i} style={{ width:6, height:6, borderRadius:1.5, background:'var(--bg-3)' }} />)}
          </div>
          <div style={{ position:'absolute', right:0, top:0, bottom:0, width:14, display:'flex', flexDirection:'column',
            justifyContent:'space-around', alignItems:'center', borderLeft:'1px solid var(--border-subtle)' }}>
            {[0,1,2,3].map(i => <span key={i} style={{ width:6, height:6, borderRadius:1.5, background:'var(--bg-3)' }} />)}
          </div>
          <Icon name="film-slate" size={40} color="var(--fg-3)" />
        </div>
      </div>

      <div style={{ position:'relative', zIndex:1 }}>
        <div style={{ font:'700 14px/1 var(--font-mono)', color:'var(--coral-bright)', letterSpacing:'0.18em', marginBottom:18 }}>ERROR 404</div>
        <h1 style={{ font:'700 clamp(36px, 6vw, 60px)/1.05 var(--font-display)', letterSpacing:'-0.02em', color:'var(--fg-0)', margin:'0 auto 18px', maxWidth:640 }}>
          This frame doesn’t exist yet.
        </h1>
        <p style={{ font:'var(--text-body-lg)', color:'var(--fg-2)', margin:'0 auto 32px', maxWidth:440 }}>
          The title you’re looking for was never rendered — or it drifted off into latent space. Let’s get you back to something real.
        </p>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <Button variant="primary" icon="house" onClick={onHome}>Back to homepage</Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Language selector — EN default (groundwork)
// ============================================================
function LanguageSelector({ compact }) {
  const [open, setOpen] = React.useState(false);
  const [lang, setLang] = React.useState('EN');
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  return (
    <div ref={ref} style={{ position:'relative' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 13px', borderRadius:'var(--radius-md)',
          cursor:'pointer', background:'var(--bg-1)', border:'1px solid var(--border-default)', color:'var(--fg-1)',
          font:'600 13px/1 var(--font-body)', transition:'border-color var(--dur-fast)' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}>
        <Icon name="globe" size={15} color="var(--fg-2)" />
        {lang}
        <Icon name={open ? 'caret-up' : 'caret-down'} size={11} color="var(--fg-3)" />
      </button>
      {open && (
        <div style={{ position:'absolute', bottom:'calc(100% + 8px)', left:0, zIndex:60, minWidth:200, maxHeight:320, overflowY:'auto', padding:6,
          background:'var(--bg-1)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-lg)', boxShadow:'var(--shadow-3)' }}>
          {(window.AICDB_LANGUAGES || []).map(l => {
            const on = l.code === lang;
            return (
              <div key={l.code} onClick={() => { setLang(l.code); setOpen(false); }}
                style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, padding:'9px 11px', cursor:'pointer',
                  borderRadius:'var(--radius-md)', font:'500 13.5px/1 var(--font-body)', color: on ? 'var(--fg-0)' : 'var(--fg-1)',
                  background: on ? 'var(--bg-2)' : 'transparent' }}
                onMouseEnter={e => { if (!on) e.currentTarget.style.background = 'var(--bg-2)'; }}
                onMouseLeave={e => { if (!on) e.currentTarget.style.background = 'transparent'; }}>
                <span>{l.name} <span style={{ color:'var(--fg-3)', font:'500 12px/1 var(--font-mono)' }}>{l.code}</span></span>
                {on && <Icon name="check" size={14} color="var(--teal-bright)" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Footer — minimal: language selector + About / Guidelines / Contact
// ============================================================
function Footer({ onNav }) {
  const links = ['About', 'Content Guidelines', 'Contact', 'Admin Panel'];
  return (
    <footer style={{ borderTop:'1px solid var(--border-subtle)', marginTop:40, padding:'34px 28px 44px' }}>
      <div style={{ maxWidth:1180, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between',
        gap:24, flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:22, flexWrap:'wrap' }}>
          <Logo size={16} onClick={() => onNav && onNav('Feed')} />
          <nav style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
            {links.map(l => {
              const admin = l === 'Admin Panel';
              return (
                <a key={l} href={admin ? 'admin.html' : '#'}
                  onClick={(e) => { if (!admin) e.preventDefault(); }}
                  style={{ font:'500 13px/1 var(--font-body)', color:'var(--fg-2)', cursor:'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--fg-0)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--fg-2)'}>{l}</a>
              );
            })}
          </nav>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:18 }}>
          <span style={{ font:'var(--text-caption)', color:'var(--fg-3)' }}>© 2025 Dreamwall</span>
        </div>
      </div>
    </footer>
  );
}

// simple Levenshtein for "did you mean" suggestions
function aicdbEditDistance(a, b) {
  a = a.toLowerCase(); b = b.toLowerCase();
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
    dp[i][j] = Math.min(dp[i-1][j] + 1, dp[i][j-1] + 1, dp[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1));
  return dp[m][n];
}

// best fuzzy title/creator suggestion for a query (or null)
function aicdbSuggest(query) {
  const q = (query || '').trim().toLowerCase();
  if (q.length < 2) return null;
  const cands = [];
  window.AICDB_FILMS.forEach(f => { cands.push(f.title); cands.push(f.creator); });
  let best = null, bestD = Infinity;
  cands.forEach(c => {
    const words = c.toLowerCase().split(/\s+/);
    const d = Math.min(aicdbEditDistance(q, c), ...words.map(w => aicdbEditDistance(q, w)));
    if (d < bestD) { bestD = d; best = c; }
  });
  // only suggest if reasonably close
  return bestD > 0 && bestD <= Math.max(2, Math.floor(q.length * 0.45)) ? best : null;
}

// ============================================================
// Email confirmation — "Check your inbox" after signup
// ============================================================
function EmailConfirm({ email = 'you@example.com', onHome }) {
  const [resent, setResent] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);
  React.useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);
  const resend = () => { if (seconds > 0) return; setResent(true); setSeconds(30); };
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      textAlign:'center', padding:'40px 24px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, zIndex:0,
        background:'radial-gradient(100% 70% at 50% 0%, rgba(78,205,196,0.12), transparent 52%)' }} />
      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:420 }}>
        {/* envelope illustration */}
        <div style={{ width:96, height:96, margin:'0 auto 30px', borderRadius:'50%', position:'relative',
          display:'flex', alignItems:'center', justifyContent:'center',
          background:'var(--bg-1)', border:'1px solid var(--border-subtle)' }}>
          <div style={{ position:'absolute', inset:0, borderRadius:'50%',
            background:'radial-gradient(circle at 50% 35%, rgba(78,205,196,0.2), transparent 70%)' }} />
          <Icon name="envelope-simple-open" size={42} color="var(--teal-bright)" weight="fill" />
          <span style={{ position:'absolute', top:14, right:18, width:14, height:14, borderRadius:'50%',
            background:'var(--coral)', border:'2px solid var(--bg-0)' }} />
        </div>
        <h1 style={{ font:'700 32px/1.1 var(--font-display)', letterSpacing:'-0.015em', color:'var(--fg-0)', margin:'0 0 14px' }}>Check your inbox</h1>
        <p style={{ font:'var(--text-body-lg)', color:'var(--fg-2)', margin:'0 0 6px' }}>We sent a confirmation link to</p>
        <p style={{ font:'600 16px/1.4 var(--font-body)', color:'var(--fg-0)', margin:'0 0 28px' }}>{email}</p>
        <p style={{ font:'var(--text-body)', color:'var(--fg-2)', margin:'0 0 28px', maxWidth:360, marginInline:'auto' }}>
          Click the link in that email to verify your account and start rating. It may take a minute to arrive — check spam, just in case.
        </p>
        <div style={{ display:'flex', flexDirection:'column', gap:12, alignItems:'center' }}>
          <Button variant="primary" icon="envelope" onClick={() => {}}>Open email app</Button>
          <button onClick={resend} disabled={seconds > 0}
            style={{ background:'none', border:'none', cursor: seconds > 0 ? 'default' : 'pointer',
              font:'500 14px/1 var(--font-body)', color: seconds > 0 ? 'var(--fg-3)' : 'var(--teal-bright)' }}>
            {seconds > 0 ? `Resend code in ${seconds}s` : (resent ? 'Code sent again — resend' : 'Didn’t get it? Resend code')}
          </button>
        </div>
        <div style={{ marginTop:34, paddingTop:22, borderTop:'1px solid var(--border-subtle)' }}>
          <a onClick={onHome} style={{ cursor:'pointer', font:'500 13px/1 var(--font-body)', color:'var(--fg-2)' }}>← Back to homepage</a>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { EmptyState, SkeletonCard, SkeletonGrid, SKELETON_STYLE, MoreLikeThis,
  SearchEmpty, NotFound, LanguageSelector, Footer, EmailConfirm, aicdbSuggest, aicdbEditDistance });
