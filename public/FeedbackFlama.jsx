// Dreamwall UI kit — "Feedback Flama"
// A small teal pennant pinned to the top-left corner of every page. Hovering
// shows a tooltip ("Report a problem on this page"); clicking opens a beta
// bug-report modal (description + optional screenshot + golden-badge reward).
// Self-mounting: include once after Primitives.jsx and it injects itself.

const FLAMA_STYLE = `
@keyframes aicdbBannerSway { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2.4deg); } }
@keyframes aicdbFlamaIn   { from { opacity:0; transform: translateY(14px) scale(0.97); } to { opacity:1; transform:none; } }
@keyframes aicdbFlamaBack { from { opacity:0; } to { opacity:1; } }
.aicdb-flama-banner { transform-origin: 50% 4px; transition: filter var(--dur-fast); }
.aicdb-flama-pole:hover .aicdb-flama-banner { animation: aicdbBannerSway 1.5s var(--ease-in-out) infinite; filter: drop-shadow(0 6px 10px rgba(0,0,0,0.5)); }
@media (prefers-reduced-motion: reduce) { .aicdb-flama-banner { animation: none !important; } }
`;

// the heraldic banner mark — a deep-blue velvet gonfalon with ornate gold trim and
// a central "!", suspended by a cord so it hangs below the logo.
function HeraldBanner() {
  return (
    <svg className="aicdb-flama-banner" width="21" height="30" viewBox="0 0 56 80" aria-hidden="true"
      style={{ display:'block', overflow:'visible', opacity:0.5, filter:'saturate(0.85) brightness(0.96) drop-shadow(0 3px 5px rgba(0,0,0,0.4))' }}>
      <defs>
        {/* velvet body — vertical sheen, deep royal blue */}
        <linearGradient id="aicdbVelvet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2c3f7e" />
          <stop offset="32%" stopColor="#1b2c61" />
          <stop offset="100%" stopColor="#0e1840" />
        </linearGradient>
        {/* soft directional sheen across the nap of the velvet */}
        <radialGradient id="aicdbSheen" cx="36%" cy="24%" r="72%">
          <stop offset="0%" stopColor="#5066a8" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#2a3a72" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#0e1840" stopOpacity="0" />
        </radialGradient>
        {/* warm gold/brown embroidery trim */}
        <linearGradient id="aicdbGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f7e6a8" />
          <stop offset="34%" stopColor="#d3a24c" />
          <stop offset="70%" stopColor="#9c6a2c" />
          <stop offset="100%" stopColor="#6f4618" />
        </linearGradient>
        <radialGradient id="aicdbStud" cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#fbeeb6" />
          <stop offset="60%" stopColor="#cf9a3d" />
          <stop offset="100%" stopColor="#7d5018" />
        </radialGradient>
        {/* velvet fabric grain */}
        <filter id="aicdbWeave" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9 0.45" numOctaves="2" seed="7" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" />
        </filter>
        <clipPath id="aicdbBannerClip">
          <path d="M6 10 L50 10 L50 56 L28 72 L6 56 Z" />
        </clipPath>
      </defs>

      {/* suspension cord + ring (it hangs from here, up toward the logo) */}
      <line x1="28" y1="2" x2="28" y2="11" stroke="url(#aicdbGold)" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="28" cy="4" r="3" fill="none" stroke="url(#aicdbGold)" strokeWidth="1.6" />

      {/* velvet body */}
      <path d="M6 10 L50 10 L50 56 L28 72 L6 56 Z" fill="url(#aicdbVelvet)" />
      <path d="M6 10 L50 10 L50 56 L28 72 L6 56 Z" fill="url(#aicdbSheen)" />
      {/* woven grain, clipped to the banner */}
      <g clipPath="url(#aicdbBannerClip)">
        <rect x="0" y="0" width="56" height="80" filter="url(#aicdbWeave)" opacity="0.22" />
        {/* soft nap sheen sweeping across the pile */}
        <rect x="6" y="10" width="44" height="20" fill="#7187c9" opacity="0.12" />
        {/* faint vertical fold highlights */}
        <rect x="15" y="10" width="1" height="58" fill="#6479bd" opacity="0.12" />
        <rect x="40" y="10" width="1" height="58" fill="#6479bd" opacity="0.12" />
        <rect x="27" y="10" width="1.4" height="60" fill="#0a1230" opacity="0.18" />
      </g>

      {/* ornate trim — outer band + inner embroidery line, both following the point */}
      <path d="M6 10 L50 10 L50 56 L28 72 L6 56 Z" fill="none" stroke="url(#aicdbGold)" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M9.5 13.5 L46.5 13.5 L46.5 54.4 L28 67.5 L9.5 54.4 Z" fill="none" stroke="url(#aicdbGold)" strokeWidth="1" strokeOpacity="0.8" strokeLinejoin="round" />

      {/* corner & point studs (embossed gold beads) */}
      <circle cx="6" cy="10" r="2.6" fill="url(#aicdbStud)" />
      <circle cx="50" cy="10" r="2.6" fill="url(#aicdbStud)" />
      <circle cx="28" cy="72" r="2.4" fill="url(#aicdbStud)" />

      {/* the heraldic "!" — embossed cream over a dark cut */}
      <text x="28.8" y="46" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="700" fontSize="34"
        fill="#0c1430" opacity="0.55">!</text>
      <text x="28" y="45.2" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="700" fontSize="34"
        fill="#f4e7c0">!</text>
    </svg>
  );
}

// current page label, derived from the document title ("Dreamwall — Profile" -> "Profile")
function aicdbPageName() {
  const t = (document.title || '').replace(/^Dreamwall\s*[—–-]\s*/i, '').trim();
  return t || 'this page';
}

// minimal optional-screenshot dropzone (no external deps)
function FlamaShot({ value, onChange }) {
  const ref = React.useRef(null);
  const [hover, setHover] = React.useState(false);
  const pick = (file) => { if (!file) return; const r = new FileReader(); r.onload = () => onChange(r.result); r.readAsDataURL(file); };
  return (
    <div onClick={() => ref.current && ref.current.click()}
      onDragOver={e => { e.preventDefault(); setHover(true); }} onDragLeave={() => setHover(false)}
      onDrop={e => { e.preventDefault(); setHover(false); pick(e.dataTransfer.files[0]); }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ position:'relative', display:'flex', alignItems:'center', gap:12, padding:'13px 15px', cursor:'pointer',
        borderRadius:'var(--radius-md)', borderWidth:1, borderStyle:'dashed',
        borderColor: hover ? 'var(--border-accent)' : 'var(--border-strong)',
        background: value ? 'var(--bg-inset)' : 'var(--bg-0)', transition:'border-color var(--dur-fast)' }}>
      {value ? (
        <>
          <img src={value} alt="" style={{ width:46, height:46, objectFit:'cover', borderRadius:'var(--radius-sm)', flex:'none' }} />
          <span style={{ flex:1, font:'var(--text-body-sm)', color:'var(--fg-1)' }}>Screenshot attached</span>
          <button onClick={e => { e.stopPropagation(); onChange(null); }}
            style={{ display:'flex', padding:6, borderRadius:'50%', cursor:'pointer', background:'var(--bg-2)', border:'1px solid var(--border-default)' }}>
            <Icon name="x" size={13} color="var(--fg-1)" />
          </button>
        </>
      ) : (
        <>
          <Icon name="image" size={19} color={hover ? 'var(--teal-bright)' : 'var(--fg-2)'} />
          <div style={{ flex:1 }}>
            <div style={{ font:'600 13px/1.2 var(--font-body)', color:'var(--fg-1)' }}>Add a screenshot</div>
            <div style={{ font:'var(--text-data-sm)', color:'var(--fg-3)', marginTop:3, letterSpacing:'0.03em' }}>Optional · drag or click to upload</div>
          </div>
        </>
      )}
      <input ref={ref} type="file" accept="image/*" style={{ display:'none' }} onChange={e => pick(e.target.files[0])} />
    </div>
  );
}

function BugReportModal({ onClose }) {
  const [desc, setDesc] = React.useState('');
  const [shot, setShot] = React.useState(null);
  const [sent, setSent] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const page = aicdbPageName();

  return (
    <div onClick={onClose}
      style={{ position:'fixed', inset:0, zIndex:2147483000, display:'flex', alignItems:'center', justifyContent:'center', padding:24,
        background:'rgba(5,5,5,0.74)', backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)',
        animation:'aicdbFlamaBack 0.22s var(--ease-out) both' }}>
      <div onClick={e => e.stopPropagation()}
        style={{ position:'relative', width:'100%', maxWidth:468, background:'var(--bg-1)', border:'1px solid var(--border-default)',
          borderRadius:'var(--radius-xl)', boxShadow:'var(--shadow-3)', overflow:'hidden',
          animation:'aicdbFlamaIn 0.4s var(--ease-out) both' }}>

        {/* close */}
        <button onClick={onClose} style={{ position:'absolute', top:16, right:16, zIndex:2, display:'flex', padding:8, borderRadius:'50%',
          cursor:'pointer', background:'var(--bg-2)', border:'1px solid var(--border-default)' }}>
          <Icon name="x" size={15} color="var(--fg-1)" />
        </button>

        {sent ? (
          <div style={{ padding:'44px 34px 38px', textAlign:'center' }}>
            <div style={{ width:74, height:74, margin:'0 auto 22px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
              background:'var(--teal-ghost)', border:'1px solid rgba(78,205,196,0.4)' }}>
              <Icon name="flag-pennant" size={34} color="var(--teal-bright)" weight="fill" />
            </div>
            <h2 style={{ font:'600 24px/1.2 var(--font-display)', color:'var(--fg-0)', margin:'0 0 10px' }}>Report sent</h2>
            <p style={{ font:'var(--text-body)', color:'var(--fg-2)', margin:'0 0 24px', maxWidth:340, marginInline:'auto' }}>
              Thanks for helping us debug Dreamwall. If we confirm it, a golden Bug Hunter badge lands on your profile.
            </p>
            <button onClick={onClose} style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'11px 22px', cursor:'pointer',
              borderRadius:'var(--radius-md)', border:'none', background:'var(--coral)', color:'var(--fg-on-accent)', font:'600 14px/1 var(--font-body)' }}>
              Done
            </button>
          </div>
        ) : (
          <div style={{ padding:'26px 26px 24px' }}>
            {/* beta message */}
            <div style={{ display:'flex', gap:12, padding:'13px 15px', marginBottom:22, borderRadius:'var(--radius-md)',
              background:'var(--teal-ghost)', border:'1px solid rgba(78,205,196,0.32)' }}>
              <Icon name="flask" size={18} color="var(--teal-bright)" weight="fill" style={{ marginTop:1 }} />
              <div style={{ font:'var(--text-body-sm)', color:'var(--fg-1)' }}>
                <b style={{ color:'var(--teal-bright)', fontWeight:600 }}>Dreamwall is in beta.</b> Spotted something broken or off?
                Tell us what happened and we'll get it fixed.
              </div>
            </div>

            <h2 style={{ font:'600 22px/1.2 var(--font-display)', color:'var(--fg-0)', margin:'0 0 6px' }}>Report a problem</h2>
            <div style={{ display:'inline-flex', alignItems:'center', gap:7, marginBottom:18, padding:'5px 11px', borderRadius:'var(--radius-pill)',
              background:'var(--bg-2)', border:'1px solid var(--border-subtle)' }}>
              <Icon name="map-pin" size={12} color="var(--fg-2)" weight="fill" />
              <span style={{ font:'var(--text-data-sm)', color:'var(--fg-2)' }}>Reporting from</span>
              <span style={{ font:'600 12px/1 var(--font-body)', color:'var(--fg-0)' }}>{page}</span>
            </div>

            <label style={{ font:'600 13px/1 var(--font-body)', color:'var(--fg-0)', display:'block', marginBottom:8 }}>What went wrong?</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4}
              onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
              placeholder="Describe the bug — what you did, what you expected, what happened instead."
              style={{ width:'100%', resize:'vertical', minHeight:96, lineHeight:1.55, background:'var(--bg-0)', color:'var(--fg-0)',
                borderWidth:1, borderStyle:'solid', borderColor: focus ? 'var(--border-accent)' : 'var(--border-subtle)',
                boxShadow: focus ? 'var(--glow-coral)' : 'none', borderRadius:'var(--radius-md)', padding:'11px 14px',
                font:'var(--text-body)', outline:'none', transition:'border-color var(--dur-fast), box-shadow var(--dur-fast)' }} />

            <div style={{ marginTop:14 }}>
              <FlamaShot value={shot} onChange={setShot} />
            </div>

            <button onClick={() => setSent(true)} disabled={!desc.trim()}
              style={{ width:'100%', marginTop:18, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8, padding:'13px 0',
                borderRadius:'var(--radius-md)', border:'none', cursor: desc.trim() ? 'pointer' : 'not-allowed',
                font:'600 14px/1 var(--font-body)', transition:'background var(--dur-fast)',
                background: desc.trim() ? 'var(--coral)' : 'var(--bg-3)', color: desc.trim() ? 'var(--fg-on-accent)' : 'var(--fg-3)' }}>
              <Icon name="paper-plane-tilt" size={16} color={desc.trim() ? 'var(--fg-on-accent)' : 'var(--fg-3)'} weight="fill" /> Send report
            </button>

            {/* golden badge reward */}
            <div style={{ display:'flex', alignItems:'center', gap:13, marginTop:20, paddingTop:18, borderTop:'1px solid var(--border-subtle)' }}>
              <div style={{ width:42, height:42, flex:'none', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                background:'radial-gradient(circle at 38% 30%, #f6d579, #d99a23 70%, #a9711a)',
                boxShadow:'0 2px 10px rgba(217,154,35,0.45), inset 0 1px 3px rgba(255,255,255,0.45)' }}>
                <Icon name="medal" size={22} color="#3a2a06" weight="fill" />
              </div>
              <div style={{ font:'var(--text-body-sm)', color:'var(--fg-2)' }}>
                <b style={{ color:'#e5b23b', fontWeight:600 }}>Bug Hunter badge.</b> Every confirmed report earns a golden badge that shows on your profile.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FeedbackFlama() {
  const [open, setOpen] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  return (
    <>
      <style>{FLAMA_STYLE}</style>
      <div style={{ position:'fixed', top:45, left:33, zIndex:2147482000 }}>
        <button className="aicdb-flama-pole" onClick={() => setOpen(true)}
          onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
          aria-label="Report a problem on this page"
          style={{ display:'block', padding:0, cursor:'pointer', background:'none', border:'none' }}>
          <HeraldBanner />
        </button>
        {/* tooltip */}
        <div style={{ position:'absolute', top:11, left:30, whiteSpace:'nowrap', pointerEvents:'none',
          padding:'6px 11px', borderRadius:'var(--radius-md)', background:'var(--bg-2)', border:'1px solid var(--border-default)',
          boxShadow:'var(--shadow-2)', font:'500 12px/1 var(--font-body)', color:'var(--fg-0)',
          opacity: hover ? 1 : 0, transform: hover ? 'translateX(0)' : 'translateX(-4px)',
          transition:'opacity var(--dur-fast), transform var(--dur-fast)' }}>
          Report a problem on this page
        </div>
      </div>
      {open && <BugReportModal onClose={() => setOpen(false)} />}
    </>
  );
}

Object.assign(window, { FeedbackFlama, BugReportModal, HeraldBanner });

// ---- self-mount ----
(function mountFlama() {
  function go() {
    if (document.getElementById('aicdb-flama-root')) return;
    const el = document.createElement('div');
    el.id = 'aicdb-flama-root';
    document.body.appendChild(el);
    ReactDOM.createRoot(el).render(<FeedbackFlama />);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go);
  else go();
})();
