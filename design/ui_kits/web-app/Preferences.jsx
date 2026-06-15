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
          <p style={{ font:'var(--text-body)', color:'var(--fg-2)', margin:'8px 0 0' }}>Manage your language, appearance, and privacy.</p>
        </div>
        <span style={{ display:'inline-flex', alignItems:'center', gap:7, font:'600 12.5px/1 var(--font-body)',
          color: saved ? 'var(--teal-bright)' : 'var(--fg-3)', transition:'color var(--dur-base)' }}>
          <Icon name={saved ? 'check-circle' : 'cloud-check'} size={15} color={saved ? 'var(--teal-bright)' : 'var(--fg-3)'} weight="fill" />
          {saved ? 'Saved' : 'All changes saved'}
        </span>
      </div>

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

      <PrefSection icon="lock-key" title="Privacy" sub="Control who sees your activity.">
        <PrefRow title="Show watchlist on profile" desc="Let visitors see the titles you've queued." last>
          <Toggle on={prefs.privacy.showWatchlist} onChange={(v) => setPrivacy('showWatchlist', v)} />
        </PrefRow>
      </PrefSection>
    </div>
  );
}

Object.assign(window, { Preferences, PrefToggle: Toggle, PrefSegmented: Segmented, LanguagePicker });
