// Dreamwall UI kit — Preferences page.
// Language, Appearance (theme), Notifications, Privacy. Fully interactive,
// persisted to localStorage. Reuses Primitives (Icon) + design tokens.

// ---- persisted settings store ----
const PREFS_KEY = 'aicdb_prefs';
function loadPrefs() {
  const defaults = {
    lang: 'EN', theme: 'Cyberpunk',
    notif: { releases: true, replies: true, digest: false, milestones: true },
    privacy: { visibility: 'Public', showWatchlist: true, showActivity: true, showOnline: false },
  };
  try {
    const saved = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
    // migrate legacy theme names
    if (saved.theme === 'Dark') saved.theme = 'Cyberpunk';
    if (saved.theme === 'Light') saved.theme = 'Solarpunk';
    return { ...defaults, ...saved,
      notif: { ...defaults.notif, ...(saved.notif || {}) },
      privacy: { ...defaults.privacy, ...(saved.privacy || {}) } };
  } catch (e) { return defaults; }
}
function savePrefs(p) { try { localStorage.setItem(PREFS_KEY, JSON.stringify(p)); } catch (e) {} }

// ---- pill toggle switch ----
function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} role="switch" aria-checked={on}
      style={{ width:46, height:26, flex:'none', borderRadius:'var(--radius-pill)', border:'none', cursor:'pointer',
        padding:3, display:'flex', alignItems:'center',
        background: on ? 'var(--teal)' : 'var(--bg-3)',
        justifyContent: on ? 'flex-end' : 'flex-start',
        transition:'background var(--dur-base) var(--ease-out)' }}>
      <span style={{ width:20, height:20, borderRadius:'50%', background: on ? '#04201e' : 'var(--fg-2)',
        boxShadow:'var(--shadow-1)', transition:'background var(--dur-base)' }} />
    </button>
  );
}

// ---- segmented control (theme / visibility) ----
function Segmented({ options, value, onChange }) {
  return (
    <div style={{ display:'inline-flex', gap:3, padding:3, borderRadius:'var(--radius-pill)',
      background:'var(--bg-0)', border:'1px solid var(--border-subtle)' }}>
      {options.map(opt => {
        const on = value === opt.value;
        return (
          <button key={opt.value} onClick={() => onChange(opt.value)}
            style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'8px 16px', borderRadius:'var(--radius-pill)',
              border:'none', cursor:'pointer', font:'600 13px/1 var(--font-body)', transition:'all var(--dur-fast)',
              background: on ? 'var(--fg-0)' : 'transparent', color: on ? 'var(--bg-0)' : 'var(--fg-1)' }}>
            {opt.icon && <Icon name={opt.icon} size={15} color={on ? 'var(--bg-0)' : 'var(--fg-2)'} />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ---- a single settings row inside a card ----
function PrefRow({ title, desc, children, last }) {
  return (
    <div className="aicdb-pref-row" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:24, padding:'18px 0',
      borderBottom: last ? 'none' : '1px solid var(--border-subtle)' }}>
      <div style={{ minWidth:0 }}>
        <div style={{ font:'600 14.5px/1.3 var(--font-body)', color:'var(--fg-0)' }}>{title}</div>
        {desc && <div style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', marginTop:4 }}>{desc}</div>}
      </div>
      <div style={{ flex:'none' }}>{children}</div>
    </div>
  );
}

// ---- section: overline heading + card ----
function PrefSection({ icon, title, sub, children }) {
  return (
    <section style={{ marginBottom:36 }}>
      <div style={{ display:'flex', alignItems:'center', gap:11, marginBottom:14 }}>
        <div style={{ width:34, height:34, borderRadius:'var(--radius-md)', flex:'none', display:'flex', alignItems:'center', justifyContent:'center',
          background:'var(--bg-2)', border:'1px solid var(--border-subtle)' }}>
          <Icon name={icon} size={17} color="var(--coral-bright)" weight="fill" />
        </div>
        <div>
          <h2 style={{ font:'600 19px/1.1 var(--font-display)', color:'var(--fg-0)', margin:0 }}>{title}</h2>
          {sub && <div style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', marginTop:3 }}>{sub}</div>}
        </div>
      </div>
      <div style={{ padding:'4px 22px', background:'var(--bg-1)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)' }}>
        {children}
      </div>
    </section>
  );
}

// ---- searchable language picker (26 languages) ----
function LanguagePicker({ value, onChange }) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState('');
  const ref = React.useRef(null);
  const langs = window.AICDB_LANGUAGES || [];
  const current = window.AICDB_LANG_BY_CODE ? window.AICDB_LANG_BY_CODE[value] : null;
  React.useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setQ(''); } };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  const ql = q.trim().toLowerCase();
  const shown = ql ? langs.filter(l => l.name.toLowerCase().includes(ql) || l.native.toLowerCase().includes(ql) || l.code.toLowerCase().includes(ql)) : langs;
  return (
    <div ref={ref} style={{ position:'relative', width:280 }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, padding:'11px 14px',
          borderRadius:'var(--radius-md)', cursor:'pointer', background:'var(--bg-0)',
          border:'1px solid ' + (open ? 'var(--border-accent)' : 'var(--border-default)'), color:'var(--fg-0)',
          font:'600 14px/1 var(--font-body)', transition:'border-color var(--dur-fast)' }}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:9 }}>
          <Icon name="globe" size={16} color="var(--fg-2)" />
          {current ? current.name : value}
          {current && <span style={{ font:'500 12px/1 var(--font-mono)', color:'var(--fg-3)' }}>{current.code}</span>}
        </span>
        <Icon name={open ? 'caret-up' : 'caret-down'} size={12} color="var(--fg-3)" />
      </button>
      {open && (
        <div style={{ position:'absolute', top:'calc(100% + 8px)', left:0, right:0, zIndex:70,
          background:'var(--bg-1)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-lg)', boxShadow:'var(--shadow-3)', overflow:'hidden' }}>
          <div style={{ padding:8, borderBottom:'1px solid var(--border-subtle)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 11px', background:'var(--bg-0)',
              border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)' }}>
              <Icon name="magnifying-glass" size={14} color="var(--fg-3)" />
              <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search languages…"
                style={{ flex:1, background:'none', border:'none', outline:'none', color:'var(--fg-0)', font:'var(--text-body-sm)' }} />
            </div>
          </div>
          <div style={{ maxHeight:280, overflowY:'auto', padding:6 }}>
            {shown.length ? shown.map(l => {
              const on = l.code === value;
              return (
                <div key={l.code} onClick={() => { onChange(l.code); setOpen(false); setQ(''); }}
                  style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, padding:'10px 11px', cursor:'pointer',
                    borderRadius:'var(--radius-md)', background: on ? 'var(--bg-2)' : 'transparent' }}
                  onMouseEnter={e => { if (!on) e.currentTarget.style.background = 'var(--bg-2)'; }}
                  onMouseLeave={e => { if (!on) e.currentTarget.style.background = 'transparent'; }}>
                  <span style={{ minWidth:0 }}>
                    <span style={{ font:'600 13.5px/1.2 var(--font-body)', color:'var(--fg-0)' }}>{l.name}</span>
                    <span style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', marginLeft:8 }}>{l.native}</span>
                  </span>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:9, flex:'none' }}>
                    <span style={{ font:'500 11px/1 var(--font-mono)', color:'var(--fg-3)' }}>{l.code}</span>
                    {on && <Icon name="check" size={14} color="var(--teal-bright)" />}
                  </span>
                </div>
              );
            }) : (
              <div style={{ padding:'18px 12px', textAlign:'center', font:'var(--text-body-sm)', color:'var(--fg-2)' }}>No languages match “{q}”.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---- password strength checker ----
function pwStrength(pw) {
  if (!pw) return { score: 0, label: '', color: 'var(--border-subtle)' };
  let s = 0;
  if (pw.length >= 8)  s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return { score: s, label: 'Weak',   color: 'var(--score-low)' };
  if (s <= 3) return { score: s, label: 'Fair',   color: '#e5b23b' };
  if (s <= 4) return { score: s, label: 'Good',   color: 'var(--teal-bright)' };
  return { score: s, label: 'Strong', color: 'var(--score-high)' };
}

function PasswordStrengthBar({ password }) {
  const { score, label, color } = pwStrength(password);
  if (!password) return null;
  const pct = Math.min(100, Math.round((score / 5) * 100));
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ height: 4, borderRadius: 2, background: 'var(--bg-3)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2,
          transition: 'width var(--dur-base), background var(--dur-base)' }} />
      </div>
      <div style={{ font: '500 12px/1.2 var(--font-body)', color, marginTop: 5 }}>{label}</div>
    </div>
  );
}

// ---- password input with show/hide toggle ----
function PasswordInput({ value, onChange, placeholder, id }) {
  const [show, setShow] = React.useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="new-password"
        style={{
          width: '100%', padding: '10px 40px 10px 13px', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-default)', background: 'var(--bg-0)', color: 'var(--fg-0)',
          font: 'var(--text-body-sm)', outline: 'none', boxSizing: 'border-box',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--border-accent)'}
        onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        style={{
          position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1,
        }}
        tabIndex={-1}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        <Icon name={show ? 'eye-slash' : 'eye'} size={16} color="var(--fg-3)" />
      </button>
    </div>
  );
}

// ---- Account section component ----
function AccountSection() {
  const [account, setAccount] = React.useState(window.AICDB_MAIN_ACCOUNT || null);
  const [email, setEmail] = React.useState('');
  const [loadingAccount, setLoadingAccount] = React.useState(true);

  // Password change state
  const [newPw, setNewPw] = React.useState('');
  const [confirmPw, setConfirmPw] = React.useState('');
  const [pwStatus, setPwStatus] = React.useState(null); // { type: 'success'|'error', msg }
  const [pwBusy, setPwBusy] = React.useState(false);

  // Load session info once
  React.useEffect(() => {
    window.AICDB_AUTH.getSession().then((session) => {
      if (session && session.user) {
        setEmail(session.user.email || '');
      }
      setLoadingAccount(false);
    }).catch(() => setLoadingAccount(false));

    const unsub = window.AICDB_AUTH.subscribe(() => {
      setAccount(window.AICDB_MAIN_ACCOUNT || null);
    });
    setAccount(window.AICDB_MAIN_ACCOUNT || null);
    return unsub;
  }, []);

  async function handleChangePassword(e) {
    e.preventDefault();
    setPwStatus(null);
    if (!newPw) { setPwStatus({ type: 'error', msg: 'Enter a new password.' }); return; }
    if (newPw.length < 8) { setPwStatus({ type: 'error', msg: 'Password must be at least 8 characters.' }); return; }
    if (newPw !== confirmPw) { setPwStatus({ type: 'error', msg: 'Passwords do not match.' }); return; }
    const strength = pwStrength(newPw);
    if (strength.score < 2) { setPwStatus({ type: 'error', msg: 'Password is too weak — add uppercase letters, numbers, or symbols.' }); return; }

    setPwBusy(true);
    try {
      const supabase = await window.AICDB_AUTH.getClient();
      const { error } = await supabase.auth.updateUser({ password: newPw });
      if (error) throw error;
      setPwStatus({ type: 'success', msg: 'Password updated successfully.' });
      setNewPw('');
      setConfirmPw('');
    } catch (err) {
      setPwStatus({ type: 'error', msg: err.message || 'Could not update password.' });
    } finally {
      setPwBusy(false);
    }
  }

  const displayName = account ? account.name : '—';
  const joinDate    = account ? account.joined : '—';

  return (
    <>
      {/* Account Info */}
      <PrefSection icon="user-circle" title="Account" sub="Your account information on Dreamwall.">
        {loadingAccount ? (
          <div style={{ padding: '22px 0', display: 'flex', gap: 14 }}>
            {[180, 120, 100].map((w, i) => (
              <div key={i} className="aicdb-skel"
                style={{ height: 18, width: w, borderRadius: 6 }} />
            ))}
          </div>
        ) : (
          <>
            <PrefRow title="Email address" desc="Your sign-in email. To change it, contact support (email change coming soon).">
              <span style={{ font: '500 14px/1 var(--font-mono)', color: 'var(--fg-1)',
                padding: '8px 13px', background: 'var(--bg-2)', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)', userSelect: 'text' }}>
                {email || '—'}
              </span>
            </PrefRow>
            <PrefRow title="Display name" desc="How your name appears on Dreamwall. Change it on your Profile page.">
              <span style={{ font: '600 14px/1 var(--font-body)', color: 'var(--fg-0)',
                padding: '8px 13px', background: 'var(--bg-2)', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)' }}>
                {displayName}
              </span>
            </PrefRow>
            <PrefRow title="Member since" desc="The date your account was created." last>
              <span style={{ font: '500 13.5px/1 var(--font-body)', color: 'var(--fg-1)' }}>
                {joinDate}
              </span>
            </PrefRow>
          </>
        )}
      </PrefSection>

      {/* Change Password */}
      <PrefSection icon="lock-key" title="Change Password" sub="Set a new password for your account. You must be signed in.">
        <div style={{ padding: '18px 0' }}>
          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 360 }}>
            <div>
              <label style={{ display: 'block', font: '600 13px/1.2 var(--font-body)', color: 'var(--fg-1)', marginBottom: 7 }}
                htmlFor="pref-pw-new">New password</label>
              <PasswordInput id="pref-pw-new" value={newPw} onChange={setNewPw} placeholder="At least 8 characters" />
              <PasswordStrengthBar password={newPw} />
            </div>
            <div>
              <label style={{ display: 'block', font: '600 13px/1.2 var(--font-body)', color: 'var(--fg-1)', marginBottom: 7 }}
                htmlFor="pref-pw-confirm">Confirm new password</label>
              <PasswordInput id="pref-pw-confirm" value={confirmPw} onChange={setConfirmPw} placeholder="Repeat new password" />
              {confirmPw && newPw !== confirmPw && (
                <div style={{ font: '500 12px/1.2 var(--font-body)', color: 'var(--score-low)', marginTop: 5 }}>
                  Passwords do not match.
                </div>
              )}
            </div>
            {pwStatus && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 9, padding: '11px 13px',
                borderRadius: 'var(--radius-md)',
                background: pwStatus.type === 'success' ? 'rgba(78,205,196,0.1)' : 'rgba(229,72,77,0.1)',
                border: `1px solid ${pwStatus.type === 'success' ? 'rgba(78,205,196,0.4)' : 'rgba(229,72,77,0.4)'}`,
              }}>
                <Icon name={pwStatus.type === 'success' ? 'check-circle' : 'warning-circle'}
                  size={16} color={pwStatus.type === 'success' ? 'var(--teal-bright)' : 'var(--score-low)'} weight="fill" />
                <span style={{ font: '500 13px/1.4 var(--font-body)',
                  color: pwStatus.type === 'success' ? 'var(--teal-bright)' : 'var(--score-low)' }}>
                  {pwStatus.msg}
                </span>
              </div>
            )}
            <div>
              <button type="submit" disabled={pwBusy}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px',
                  borderRadius: 'var(--radius-md)', border: 'none', cursor: pwBusy ? 'default' : 'pointer',
                  background: pwBusy ? 'var(--bg-3)' : 'var(--coral)', color: pwBusy ? 'var(--fg-3)' : 'var(--fg-on-accent)',
                  font: '600 14px/1 var(--font-body)', transition: 'background var(--dur-fast)',
                  opacity: pwBusy ? 0.7 : 1,
                }}>
                <Icon name={pwBusy ? 'spinner' : 'lock-key'} size={15}
                  color={pwBusy ? 'var(--fg-3)' : 'var(--fg-on-accent)'} weight="fill" />
                {pwBusy ? 'Updating…' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </PrefSection>

      {/* Email change — coming soon */}
      <PrefSection icon="envelope-simple" title="Change Email" sub="Update the email address linked to your account.">
        <PrefRow title="Change email address"
          desc="Email change requires verified delivery — coming once custom SMTP is configured." last>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 13px',
            borderRadius: 'var(--radius-pill)', background: 'var(--bg-2)',
            border: '1px solid var(--border-subtle)', font: '600 12px/1 var(--font-body)',
            color: 'var(--fg-3)', cursor: 'default', userSelect: 'none',
          }}>
            <Icon name="clock" size={13} color="var(--fg-3)" />
            Coming soon
          </span>
        </PrefRow>
      </PrefSection>
    </>
  );
}

// ---- the page ----
function Preferences() {
  const [prefs, setPrefs] = React.useState(loadPrefs);
  const [saved, setSaved] = React.useState(false);
  const set = (patch) => setPrefs(p => ({ ...p, ...patch }));
  const setNotif = (k, v) => setPrefs(p => ({ ...p, notif: { ...p.notif, [k]: v } }));
  const setPrivacy = (k, v) => setPrefs(p => ({ ...p, privacy: { ...p.privacy, [k]: v } }));
  React.useEffect(() => { savePrefs(prefs); setSaved(true); const t = setTimeout(() => setSaved(false), 1600); return () => clearTimeout(t); }, [prefs]);

  return (
    <div style={{ maxWidth:760, margin:'0 auto', padding:'40px 28px 90px' }}>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:20, marginBottom:34, flexWrap:'wrap' }}>
        <div>
          <h1 style={{ font:'var(--text-h1)', color:'var(--fg-0)', letterSpacing:'-0.015em', margin:0 }}>Preferences</h1>
          <p style={{ font:'var(--text-body)', color:'var(--fg-2)', margin:'8px 0 0' }}>Manage your account, language, appearance, and privacy.</p>
        </div>
        <span style={{ display:'inline-flex', alignItems:'center', gap:7, font:'600 12.5px/1 var(--font-body)',
          color: saved ? 'var(--teal-bright)' : 'var(--fg-3)', transition:'color var(--dur-base)' }}>
          <Icon name={saved ? 'check-circle' : 'cloud-check'} size={15} color={saved ? 'var(--teal-bright)' : 'var(--fg-3)'} weight="fill" />
          {saved ? 'Saved' : 'All changes saved'}
        </span>
      </div>

      <AccountSection />

      <PrefSection icon="globe" title="Language & Region" sub="Choose the language for the Dreamwall interface.">
        <PrefRow title="Display language" desc="Applies across the catalog, reviews, and your profile." last>
          <LanguagePicker value={prefs.lang} onChange={(c) => set({ lang: c })} />
        </PrefRow>
      </PrefSection>

      <PrefSection icon="palette" title="Appearance" sub="Tune how Dreamwall looks on this device.">
        <PrefRow title="Theme" desc="Cyberpunk is the midnight-cinema look; Solarpunk is a sunlit greenhouse — sage, terracotta, and viridian." last>
          <Segmented value={prefs.theme} onChange={(v) => { set({ theme: v }); if (window.AICDB_applyTheme) window.AICDB_applyTheme(v); }}
            options={[
              { value:'Cyberpunk', label:'Cyberpunk', icon:'moon-stars' },
              { value:'Solarpunk', label:'Solarpunk', icon:'sun' },
              { value:'System',    label:'System',    icon:'desktop' },
            ]} />
        </PrefRow>
      </PrefSection>

      <PrefSection icon="shield-check" title="Privacy" sub="Control who sees your activity.">
        <PrefRow title="Show watchlist on profile" desc="Let visitors see the titles you've queued." last>
          <Toggle on={prefs.privacy.showWatchlist} onChange={(v) => setPrivacy('showWatchlist', v)} />
        </PrefRow>
      </PrefSection>
    </div>
  );
}

Object.assign(window, { Preferences, PrefToggle: Toggle, PrefSegmented: Segmented, LanguagePicker });
