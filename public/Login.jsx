// Dreamwall UI kit — Login / sign-in screen
function SocialButton({ icon, label, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{ display:'flex', alignItems:'center', gap:12, width:'100%', padding:'12px 16px',
        background: hover ? 'var(--bg-2)' : 'var(--bg-1)', color:'var(--fg-0)',
        border:'1px solid', borderColor: hover ? 'var(--border-strong)' : 'var(--border-default)',
        borderRadius:'var(--radius-md)', cursor:'pointer', font:'500 14px/1 var(--font-body)',
        transition:'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)' }}>
      <span style={{ width:20, display:'flex', justifyContent:'center' }}>{icon}</span>
      <span style={{ flex:1, textAlign:'left' }}>{label}</span>
    </button>
  );
}

function Field({ label, type='text', value, onChange, placeholder, trailing, error, onBlur, onKeyDown }) {
  const [focus, setFocus] = React.useState(false);
  const borderColor = error ? 'var(--danger)' : (focus ? 'var(--border-accent)' : 'var(--border-default)');
  return (
    <label style={{ display:'block' }}>
      <span className="overline" style={{ display:'block', marginBottom:7, color: error ? 'var(--danger)' : 'var(--fg-2)' }}>{label}</span>
      <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--bg-3)', minWidth:0,
        border:'1px solid', borderColor,
        borderRadius:'var(--radius-md)', padding:'0 12px',
        boxShadow: error ? 'none' : (focus ? 'var(--glow-coral)' : 'none'), transition:'border-color var(--dur-fast), box-shadow var(--dur-fast)' }}>
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={()=>setFocus(true)} onBlur={(e)=>{ setFocus(false); onBlur && onBlur(e); }}
          onKeyDown={onKeyDown}
          style={{ flex:1, minWidth:0, width:0, background:'none', border:'none', outline:'none', color:'var(--fg-0)',
            font:'var(--text-body)', padding:'12px 0' }} />
        {trailing}
      </div>
      {error && (
        <p style={{ display:'flex', alignItems:'center', gap:6, font:'var(--text-caption)', color:'var(--danger)', margin:'7px 2px 0' }}>
          <Icon name="warning-circle" size={13} color="var(--danger)" weight="fill" />{error}
        </p>
      )}
    </label>
  );
}

function PrimaryWideButton({ children, onClick, disabled }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={disabled ? undefined : onClick} disabled={!!disabled}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{ width:'100%', padding:'13px 16px', marginTop:4,
        background: disabled ? 'var(--bg-3)' : (hover ? 'var(--coral-bright)' : 'var(--coral)'),
        color: disabled ? 'var(--fg-3)' : 'var(--fg-on-accent)',
        border:'none', borderRadius:'var(--radius-md)', cursor: disabled ? 'default' : 'pointer',
        font:'600 15px/1 var(--font-body)', letterSpacing:'0.01em',
        transition:'background var(--dur-fast) var(--ease-out)' }}>
      {children}
    </button>
  );
}

// shared email-format check + a small set of "already registered" addresses
// so the signup flow can demonstrate the duplicate-email error.
// Stricter email regex: no leading/trailing dot in local part, no leading hyphen
// in domain labels, TLD must be 2+ alpha chars, exactly one @.
window.AICDB_EMAIL_RE = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-][a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]*(?<!\.)@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
window.AICDB_REGISTERED_EMAILS = ['ada@dreamwall.io', 'you@example.com', 'taken@dreamwall.io'];

function Login() {
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);
  const [remember, setRemember] = React.useState(true);
  const [errors, setErrors] = React.useState({});
  const clear = (k) => setErrors(e => (e[k] ? { ...e, [k]: undefined } : e));

  const validate = () => {
    const e = {};
    const em = email.trim();
    if (!em) e.email = 'Email is required.';
    else if (!window.AICDB_EMAIL_RE.test(em)) e.email = 'Enter a valid email address.';
    if (!pw) e.pw = 'Password is required.';
    else if (pw.length < 8) e.pw = 'Password must be at least 8 characters.';
    setErrors(e);
    return Object.keys(e).filter(k => e[k]).length === 0;
  };
  const [submitError, setSubmitError] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const submit = async () => {
    if (!validate()) return;
    setSubmitError('');
    setSubmitting(true);
    try {
      if (window.AICDB_LOGIN_EMAIL) {
        await window.AICDB_LOGIN_EMAIL(email.trim(), pw);
      } else {
        await AICDB_AUTH.signInWithPassword(email.trim(), pw);
      }
    } catch (err) {
      setSubmitError(err.message || 'Could not sign in. Please try again.');
      setSubmitting(false);
    }
  };

  const socials = [
    { key:'google', icon:<GoogleIcon size={18} />, label:'Continue with Google',
      onClick: () => { window.AICDB_LOGIN_GOOGLE && window.AICDB_LOGIN_GOOGLE(setSubmitError); } },
  ];

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      padding:'48px 20px', position:'relative', overflow:'hidden' }}>
      {/* cinematic backdrop */}
      <div style={{ position:'absolute', inset:0, zIndex:0,
        background:'radial-gradient(120% 90% at 18% 8%, rgba(216,90,48,0.16) 0%, rgba(216,90,48,0) 42%),'
          +'radial-gradient(110% 80% at 88% 92%, rgba(78,205,196,0.13) 0%, rgba(78,205,196,0) 46%),'
          +'radial-gradient(80% 60% at 70% 18%, rgba(157,141,241,0.10) 0%, rgba(157,141,241,0) 50%)' }} />
      <div style={{ position:'absolute', inset:0, zIndex:0, opacity:0.5,
        backgroundImage:'radial-gradient(rgba(245,243,239,0.035) 1px, transparent 1px)', backgroundSize:'4px 4px' }} />

      {/* card */}
      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:404,
        background:'rgba(21,21,20,0.82)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
        border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-xl)',
        boxShadow:'var(--shadow-3)', padding:'38px 36px 30px' }}>

        {/* logo + heading */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', marginBottom:28 }}>
          <img src={(window.__resources && window.__resources.aicdbMark) || "/assets/aicdb-mark.png"}
            width="52" height="52" alt="" style={{ filter:'drop-shadow(0 3px 10px rgba(0,0,0,0.6))', marginBottom:18 }} />
          <h1 style={{ font:'600 27px/1.1 var(--font-display)', letterSpacing:'-0.01em', color:'var(--fg-0)', marginBottom:8 }}>
            Sign in to Dreamwall
          </h1>
          <p style={{ font:'var(--text-body-sm)', color:'var(--fg-1)', margin:0, maxWidth:280 }}>
            Rate and track the best AI-generated films &amp; series.
          </p>
        </div>

        {/* social buttons */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {socials.map(s => <SocialButton key={s.key} icon={s.icon} label={s.label} onClick={s.onClick} />)}
        </div>

        {/* divider */}
        <div style={{ display:'flex', alignItems:'center', gap:14, margin:'22px 0' }}>
          <div style={{ flex:1, height:1, background:'var(--border-default)' }} />
          <span className="overline" style={{ color:'var(--fg-3)' }}>or with email</span>
          <div style={{ flex:1, height:1, background:'var(--border-default)' }} />
        </div>

        {/* email + password */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <Field label="Email" type="email" value={email} error={errors.email}
            onChange={e=>{ setEmail(e.target.value); clear('email'); }} placeholder="you@example.com"
            onKeyDown={e=>{ if (e.key==='Enter') submit(); }}
            onBlur={() => {
              const em = email.trim();
              if (em && !window.AICDB_EMAIL_RE.test(em))
                setErrors(er => ({ ...er, email: 'Enter a valid email address.' }));
            }} />
          <Field label="Password" type={showPw?'text':'password'} value={pw} error={errors.pw}
            onChange={e=>{ setPw(e.target.value); clear('pw'); }} placeholder="••••••••"
            onKeyDown={e=>{ if (e.key==='Enter') submit(); }}
            trailing={
              <button onClick={()=>setShowPw(v=>!v)} aria-label={showPw?'Hide password':'Show password'}
                style={{ background:'none', border:'none', cursor:'pointer', padding:4, display:'flex', color:'var(--fg-2)' }}>
                <Icon name={showPw?'eye-slash':'eye'} size={17} />
              </button>
            } />
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, marginTop:-2 }}>
            <label style={{ display:'inline-flex', alignItems:'center', gap:9, cursor:'pointer', userSelect:'none' }}>
              <span onClick={()=>setRemember(v=>!v)} style={{ width:18, height:18, flex:'none', borderRadius:5,
                display:'inline-flex', alignItems:'center', justifyContent:'center',
                border:'1px solid ' + (remember ? 'var(--coral)' : 'var(--border-strong)'),
                background: remember ? 'var(--coral)' : 'transparent', transition:'all var(--dur-fast)' }}>
                {remember && <Icon name="check" size={12} color="var(--fg-on-accent)" weight="bold" />}
              </span>
              <span style={{ font:'500 12.5px/1 var(--font-body)', color:'var(--fg-1)' }}>Remember me</span>
            </label>
            <a style={{ font:'500 12.5px/1 var(--font-body)', color:'var(--fg-1)', cursor:'pointer' }}>Forgot password?</a>
          </div>
          {submitError && <p style={{ font:'var(--text-body-sm)', color:'var(--danger)', margin:'0 2px' }}>{submitError}</p>}
          <PrimaryWideButton onClick={submit} disabled={submitting}>{submitting ? 'Signing in\u2026' : 'Sign in'}</PrimaryWideButton>
        </div>

        {/* sign up */}
        <p style={{ textAlign:'center', font:'var(--text-body-sm)', color:'var(--fg-1)', margin:'24px 0 0' }}>
          New to Dreamwall? <a href="signup.html" style={{ color:'var(--teal)', fontWeight:600, cursor:'pointer' }}>Create an account</a>
        </p>
      </div>
    </div>
  );
}
Object.assign(window, { Login, SocialButton, Field });
