// Dreamwall UI kit — Sign up flow (3 steps): choice → email form → verify
// Reuses SocialButton, Field, PrimaryWideButton from Login.jsx (loaded before this file).

function CardShell({ children }) {
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
      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:404,
        background:'rgba(21,21,20,0.82)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
        border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-xl)',
        boxShadow:'var(--shadow-3)', padding:'34px 36px 30px' }}>
        {children}
      </div>
    </div>
  );
}

function Stepper({ step }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:7, justifyContent:'center', marginBottom:22 }}>
      {[1,2,3].map(n => (
        <div key={n} style={{ height:4, width: n===step ? 26 : 18, borderRadius:2,
          background: n===step ? 'var(--coral)' : (n<step ? 'var(--coral-dim)' : 'var(--bg-3)'),
          transition:'width var(--dur-base) var(--ease-out), background-color var(--dur-base) var(--ease-out)' }} />
      ))}
    </div>
  );
}

function BackLink({ onClick }) {
  return (
    <button onClick={onClick} style={{ display:'inline-flex', alignItems:'center', gap:5, background:'none',
      border:'none', cursor:'pointer', padding:0, marginBottom:14, color:'var(--fg-1)',
      font:'500 13px/1 var(--font-body)' }}>
      <Icon name="chevron-left" size={15} /> Back
    </button>
  );
}

function Header({ title, sub }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', marginBottom:24 }}>
      <img src={(window.__resources && window.__resources.aicdbMark) || "../../assets/aicdb-mark.png"}
        width="48" height="48" alt="" style={{ filter:'drop-shadow(0 3px 10px rgba(0,0,0,0.6))', marginBottom:16 }} />
      <h1 style={{ font:'600 25px/1.12 var(--font-display)', letterSpacing:'-0.01em', color:'var(--fg-0)', marginBottom:8 }}>{title}</h1>
      <p style={{ font:'var(--text-body-sm)', color:'var(--fg-1)', margin:0, maxWidth:300 }}>{sub}</p>
    </div>
  );
}

// ---------- Step 1: choice ----------
function StepChoice({ onEmail }) {
  const socials = [
    { key:'google',    icon:<GoogleIcon size={18} />,    label:'Sign up with Google' },
    { key:'facebook',  icon:<FacebookIcon size={18} />,  label:'Sign up with Facebook' },
    { key:'instagram', icon:<InstagramIcon size={18} />, label:'Sign up with Instagram' },
    { key:'x',         icon:<XIcon size={15} />,         label:'Sign up with X' },
    { key:'tiktok',    icon:<TikTokIcon size={17} />,    label:'Sign up with TikTok' },
  ];
  return (
    <div>
      <Header title="Create your account" sub="Join Dreamwall to rate, review and track AI-generated films & series." />
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {socials.map(s => <SocialButton key={s.key} icon={s.icon} label={s.label} onClick={()=>{}} />)}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:14, margin:'22px 0' }}>
        <div style={{ flex:1, height:1, background:'var(--border-default)' }} />
        <span className="overline" style={{ color:'var(--fg-3)' }}>or</span>
        <div style={{ flex:1, height:1, background:'var(--border-default)' }} />
      </div>
      <PrimaryWideButton onClick={onEmail}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:8, justifyContent:'center' }}>
          <Icon name="message-square" size={16} /> Sign up with email
        </span>
      </PrimaryWideButton>
      <p style={{ textAlign:'center', font:'var(--text-body-sm)', color:'var(--fg-1)', margin:'22px 0 0' }}>
        Already have an account? <a href="login.html" style={{ color:'var(--teal)', fontWeight:600, cursor:'pointer' }}>Sign in</a>
      </p>
    </div>
  );
}

// ---------- Step 2: email form ----------
function StepForm({ onBack, onSubmit }) {
  const [f, setF] = React.useState({ first:'', last:'', email:'', pw:'', pw2:'' });
  const [showPw, setShowPw] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const set = k => e => { const v = e.target.value; setF(s => ({ ...s, [k]: v })); setErrors(er => (er[k] ? { ...er, [k]: undefined } : er)); };
  const pwOk = f.pw.length >= 8;
  const match = f.pw2.length > 0 && f.pw === f.pw2;
  const mismatch = f.pw2.length > 0 && f.pw !== f.pw2;

  const validate = () => {
    const e = {};
    if (!f.first.trim()) e.first = 'First name is required.';
    if (!f.last.trim()) e.last = 'Last name is required.';
    const em = f.email.trim().toLowerCase();
    if (!em) e.email = 'Email is required.';
    else if (!window.AICDB_EMAIL_RE.test(em)) e.email = 'Enter a valid email address.';
    else if ((window.AICDB_REGISTERED_EMAILS || []).includes(em)) e.email = 'That email is already registered. Try signing in instead.';
    if (!f.pw) e.pw = 'Password is required.';
    else if (!pwOk) e.pw = 'Password must be at least 8 characters.';
    if (!f.pw2) e.pw2 = 'Please confirm your password.';
    else if (f.pw !== f.pw2) e.pw2 = 'Passwords don’t match.';
    setErrors(e);
    return Object.keys(e).filter(k => e[k]).length === 0;
  };
  const submit = () => { if (validate()) onSubmit(f.email); };

  return (
    <div>
      <BackLink onClick={onBack} />
      <Header title="Sign up with email" sub="Fill in your details to create your Dreamwall account." />
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <div style={{ display:'flex', gap:12 }}>
          <div style={{ flex:1, minWidth:0 }}><Field label="First name" value={f.first} error={errors.first} onChange={set('first')} placeholder="Ada" /></div>
          <div style={{ flex:1, minWidth:0 }}><Field label="Last name" value={f.last} error={errors.last} onChange={set('last')} placeholder="Lovelace" /></div>
        </div>
        <Field label="Email" type="email" value={f.email} error={errors.email} onChange={set('email')} placeholder="you@example.com" />
        <div>
          <Field label="Password" type={showPw?'text':'password'} value={f.pw} error={errors.pw} onChange={set('pw')} placeholder="••••••••"
            trailing={
              <button onClick={()=>setShowPw(v=>!v)} aria-label={showPw?'Hide password':'Show password'}
                style={{ background:'none', border:'none', cursor:'pointer', padding:4, display:'flex', color:'var(--fg-2)' }}>
                <Icon name={showPw?'eye-slash':'eye'} size={17} />
              </button>
            } />
          {!errors.pw && (
            <p style={{ font:'var(--text-caption)', color: f.pw.length===0 ? 'var(--fg-3)' : (pwOk ? 'var(--teal)' : 'var(--fg-2)'), margin:'8px 2px 0' }}>
              {f.pw.length===0 ? 'At least 8 characters.' : (pwOk ? '✓ Strong enough.' : 'At least 8 characters.')}
            </p>
          )}
        </div>
        <div>
          <Field label="Confirm password" type={showPw?'text':'password'} value={f.pw2} error={errors.pw2} onChange={set('pw2')} placeholder="••••••••" />
          {!errors.pw2 && mismatch && <p style={{ font:'var(--text-caption)', color:'var(--danger)', margin:'8px 2px 0' }}>Passwords don’t match.</p>}
          {!errors.pw2 && match && <p style={{ font:'var(--text-caption)', color:'var(--teal)', margin:'8px 2px 0' }}>✓ Passwords match.</p>}
        </div>
        <PrimaryWideButton onClick={submit}>Create account</PrimaryWideButton>
      </div>
      <p style={{ textAlign:'center', font:'var(--text-caption)', color:'var(--fg-2)', margin:'16px 4px 0', lineHeight:1.5 }}>
        By creating an account you agree to our <a style={{ color:'var(--fg-1)', textDecoration:'underline', cursor:'pointer' }}>Terms</a> and <a style={{ color:'var(--fg-1)', textDecoration:'underline', cursor:'pointer' }}>Privacy Policy</a>.
      </p>
    </div>
  );
}

// ---------- Step 3: verify ----------
function CodeInput({ value, onChange }) {
  const refs = React.useRef([]);
  const digits = value.padEnd(6, ' ').split('').slice(0, 6);
  const handle = (i, v) => {
    const ch = v.replace(/\D/g, '').slice(-1);
    const arr = value.padEnd(6, ' ').split('');
    arr[i] = ch || ' ';
    onChange(arr.join('').replace(/ /g, ' ').trimEnd().replace(/ /g, ''));
    if (ch && refs.current[i+1]) refs.current[i+1].focus();
  };
  const keyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i].trim() && refs.current[i-1]) refs.current[i-1].focus();
  };
  return (
    <div style={{ display:'flex', gap:9, justifyContent:'center' }}>
      {digits.map((d, i) => {
        const filled = d.trim().length > 0;
        return (
          <input key={i} ref={el => refs.current[i] = el} value={d.trim()} inputMode="numeric" maxLength={1}
            onChange={e => handle(i, e.target.value)} onKeyDown={e => keyDown(i, e)}
            style={{ width:46, height:56, textAlign:'center', borderRadius:'var(--radius-md)',
              background:'var(--bg-3)', border:'1px solid', borderColor: filled ? 'var(--border-accent)' : 'var(--border-default)',
              color:'var(--fg-0)', font:'600 24px/1 var(--font-mono)', outline:'none',
              transition:'border-color var(--dur-fast)' }} />
        );
      })}
    </div>
  );
}

function StepVerify({ email, onBack }) {
  const [code, setCode] = React.useState('');
  const [secs, setSecs] = React.useState(30);
  React.useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);
  const done = code.length === 6;

  return (
    <div>
      <BackLink onClick={onBack} />
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', marginBottom:24 }}>
        <div style={{ width:60, height:60, borderRadius:'var(--radius-pill)', background:'var(--coral-ghost)',
          display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
          <Icon name="mail" size={26} color="var(--coral-bright)" />
        </div>
        <h1 style={{ font:'600 25px/1.12 var(--font-display)', letterSpacing:'-0.01em', color:'var(--fg-0)', marginBottom:8 }}>Check your inbox</h1>
        <p style={{ font:'var(--text-body-sm)', color:'var(--fg-1)', margin:0, maxWidth:310 }}>
          We sent a 6-digit code to <span style={{ color:'var(--fg-0)', fontWeight:600 }}>{email || 'your email'}</span>. Enter it below to verify your account.
        </p>
      </div>

      <CodeInput value={code} onChange={setCode} />

      <div style={{ marginTop:22 }}>
        <PrimaryWideButton onClick={()=>{}}>{done ? 'Verify & continue' : 'Enter 6-digit code'}</PrimaryWideButton>
      </div>

      <p style={{ textAlign:'center', font:'var(--text-body-sm)', color:'var(--fg-1)', margin:'20px 0 0' }}>
        Didn’t get the code?{' '}
        {secs > 0
          ? <span style={{ color:'var(--fg-3)' }}>Resend in {secs}s</span>
          : <a onClick={()=>setSecs(30)} style={{ color:'var(--teal)', fontWeight:600, cursor:'pointer' }}>Resend code</a>}
      </p>
    </div>
  );
}

// ---------- Flow controller ----------
function Signup() {
  const [step, setStep] = React.useState(1);
  const [email, setEmail] = React.useState('');
  return (
    <CardShell>
      <Stepper step={step} />
      {step === 1 && <StepChoice onEmail={()=>setStep(2)} />}
      {step === 2 && <StepForm onBack={()=>setStep(1)} onSubmit={(e)=>{ setEmail(e); setStep(3); }} />}
      {step === 3 && <StepVerify email={email} onBack={()=>setStep(2)} />}
    </CardShell>
  );
}
Object.assign(window, { Signup });
