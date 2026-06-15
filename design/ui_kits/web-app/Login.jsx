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

function Field({ label, type='text', value, onChange, placeholder, trailing }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <label style={{ display:'block' }}>
      <span className="overline" style={{ display:'block', marginBottom:7, color:'var(--fg-2)' }}>{label}</span>
      <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--bg-3)', minWidth:0,
        border:'1px solid', borderColor: focus ? 'var(--border-accent)' : 'var(--border-default)',
        borderRadius:'var(--radius-md)', padding:'0 12px',
        boxShadow: focus ? 'var(--glow-coral)' : 'none', transition:'border-color var(--dur-fast), box-shadow var(--dur-fast)' }}>
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
          style={{ flex:1, minWidth:0, width:0, background:'none', border:'none', outline:'none', color:'var(--fg-0)',
            font:'var(--text-body)', padding:'12px 0' }} />
        {trailing}
      </div>
    </label>
  );
}

function PrimaryWideButton({ children, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{ width:'100%', padding:'13px 16px', marginTop:4,
        background: hover ? 'var(--coral-bright)' : 'var(--coral)', color:'var(--fg-on-accent)',
        border:'none', borderRadius:'var(--radius-md)', cursor:'pointer',
        font:'600 15px/1 var(--font-body)', letterSpacing:'0.01em',
        transition:'background var(--dur-fast) var(--ease-out)' }}>
      {children}
    </button>
  );
}

function Login() {
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);

  const socials = [
    { key:'google',    icon:<GoogleIcon size={18} />,    label:'Continue with Google' },
    { key:'facebook',  icon:<FacebookIcon size={18} />,  label:'Continue with Facebook' },
    { key:'instagram', icon:<InstagramIcon size={18} />, label:'Continue with Instagram' },
    { key:'x',         icon:<XIcon size={15} />,         label:'Continue with X' },
    { key:'tiktok',    icon:<TikTokIcon size={17} />,    label:'Continue with TikTok' },
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
          <img src={(window.__resources && window.__resources.aicdbMark) || "../../assets/aicdb-mark.png"}
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
          {socials.map(s => <SocialButton key={s.key} icon={s.icon} label={s.label} onClick={()=>{}} />)}
        </div>

        {/* divider */}
        <div style={{ display:'flex', alignItems:'center', gap:14, margin:'22px 0' }}>
          <div style={{ flex:1, height:1, background:'var(--border-default)' }} />
          <span className="overline" style={{ color:'var(--fg-3)' }}>or with email</span>
          <div style={{ flex:1, height:1, background:'var(--border-default)' }} />
        </div>

        {/* email + password */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <Field label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
          <Field label="Password" type={showPw?'text':'password'} value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••••"
            trailing={
              <button onClick={()=>setShowPw(v=>!v)} aria-label="Toggle password"
                style={{ background:'none', border:'none', cursor:'pointer', padding:4, display:'flex', color:'var(--fg-2)' }}>
                <Icon name={showPw?'eye':'eye'} size={17} />
              </button>
            } />
          <div style={{ textAlign:'right', marginTop:-4 }}>
            <a style={{ font:'500 12.5px/1 var(--font-body)', color:'var(--fg-1)', cursor:'pointer' }}>Forgot password?</a>
          </div>
          <PrimaryWideButton onClick={()=>{}}>Sign in</PrimaryWideButton>
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
