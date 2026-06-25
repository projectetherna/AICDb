// Dreamwall UI kit — Login modal / popup (gate for logged-out actions)
// Reuses SocialButton, PrimaryWideButton, GoogleIcon… from Login.jsx + BrandIcons.jsx.

function LoginModal({ open, onClose, trigger }) {
  const [showEmail, setShowEmail] = React.useState(false);

  // reset to social view each time it reopens
  React.useEffect(() => { if (open) setShowEmail(false); }, [open]);

  // close on Escape
  React.useEffect(() => {
    if (!open) return;
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open) return null;

  const socials = [
    { key:'google', icon:<GoogleIcon size={18} />, label:'Continue with Google' },
  ];

  const headline = trigger === 'watchlist' ? 'Save to your watchlist' : 'Sign in to watch';
  const sub = trigger === 'watchlist'
    ? 'Create a free account to track films & series you want to watch.'
    : 'Sign in or create a free account to start watching.';

  return (
    <div onClick={onClose}
      style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center',
        padding:'24px', background:'rgba(5,5,5,0.72)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)',
        animation:'aicdbFade var(--dur-base) var(--ease-out)' }}>
      <div onClick={e => e.stopPropagation()}
        style={{ position:'relative', width:'100%', maxWidth:380, maxHeight:'90vh', overflowY:'auto',
          background:'var(--bg-1)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-xl)',
          boxShadow:'var(--shadow-3)', padding:'30px 30px 26px',
          animation:'aicdbPop var(--dur-base) var(--ease-out)' }}>

        {/* close */}
        <button onClick={onClose} aria-label="Close"
          style={{ position:'absolute', top:14, right:14, width:32, height:32, display:'flex', alignItems:'center',
            justifyContent:'center', background:'var(--bg-2)', border:'1px solid var(--border-subtle)',
            borderRadius:'var(--radius-pill)', cursor:'pointer', color:'var(--fg-1)' }}>
          <Icon name="x" size={16} />
        </button>

        {/* header */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', marginBottom:20 }}>
          <img src={(window.__resources && window.__resources.aicdbMark) || "/assets/aicdb-mark.png"}
            width="40" height="40" alt="" style={{ filter:'drop-shadow(0 3px 10px rgba(0,0,0,0.6))', marginBottom:12 }} />
          <h2 style={{ font:'600 20px/1.15 var(--font-display)', letterSpacing:'-0.01em', color:'var(--fg-0)', marginBottom:6 }}>{headline}</h2>
          <p style={{ font:'var(--text-body-sm)', color:'var(--fg-1)', margin:0, maxWidth:280 }}>{sub}</p>
        </div>

        {!showEmail ? (
          <React.Fragment>
            <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
              {socials.map(s => <SocialButton key={s.key} icon={s.icon} label={s.label} onClick={()=>{}} />)}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:14, margin:'18px 0' }}>
              <div style={{ flex:1, height:1, background:'var(--border-default)' }} />
              <span className="overline" style={{ color:'var(--fg-3)' }}>or</span>
              <div style={{ flex:1, height:1, background:'var(--border-default)' }} />
            </div>
            <PrimaryWideButton onClick={()=>setShowEmail(true)}>
              <span style={{ display:'inline-flex', alignItems:'center', gap:8, justifyContent:'center' }}>
                <Icon name="mail" size={16} /> Continue with email
              </span>
            </PrimaryWideButton>
          </React.Fragment>
        ) : (
          <ModalEmailForm onBack={()=>setShowEmail(false)} />
        )}

        {/* footer */}
        <p style={{ textAlign:'center', font:'var(--text-body-sm)', color:'var(--fg-1)', margin:'20px 0 0' }}>
          New to Dreamwall? <a href="signup.html" style={{ color:'var(--teal)', fontWeight:600, cursor:'pointer' }}>Sign up</a>
        </p>
      </div>
    </div>
  );
}

function ModalEmailForm({ onBack }) {
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);
  return (
    <div>
      <button onClick={onBack} style={{ display:'inline-flex', alignItems:'center', gap:5, background:'none',
        border:'none', cursor:'pointer', padding:0, marginBottom:12, color:'var(--fg-1)', font:'500 13px/1 var(--font-body)' }}>
        <Icon name="chevron-left" size={15} /> All options
      </button>
      <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
        <Field label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
        <Field label="Password" type={showPw?'text':'password'} value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••••"
          trailing={
            <button onClick={()=>setShowPw(v=>!v)} aria-label={showPw?'Hide password':'Show password'}
              style={{ background:'none', border:'none', cursor:'pointer', padding:4, display:'flex', color:'var(--fg-2)' }}>
              <Icon name={showPw?'eye-slash':'eye'} size={17} />
            </button>
          } />
        <PrimaryWideButton onClick={()=>{}}>Sign in</PrimaryWideButton>
      </div>
    </div>
  );
}
Object.assign(window, { LoginModal, ModalEmailForm });
