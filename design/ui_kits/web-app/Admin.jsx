// Dreamwall — Admin Panel: shell (sidebar + topbar), shared admin UI primitives,
// and the Dashboard page. Reuses Primitives (Icon, Avatar, Logo, fmtCount).

// ============================================================
// Shared admin primitives
// ============================================================
const ADMIN_NAV = [
  { id:'Dashboard',  icon:'squares-four' },
  { id:'Content',    icon:'film-slate' },
  { id:'Users',      icon:'users' },
  { id:'Badges',     icon:'medal' },
  { id:'Reports',    icon:'flag' },
  { id:'Statistics', icon:'chart-line-up' },
  { id:'Settings',   icon:'gear' },
];

function statusColor(s) {
  return { pending:'var(--warning)', published:'var(--success)', rejected:'var(--danger)',
    high:'var(--danger)', medium:'var(--warning)', low:'var(--fg-1)',
    creator:'var(--teal)', admin:'var(--coral)', viewer:'var(--fg-1)', banned:'var(--danger)' }[s] || 'var(--fg-1)';
}

// status / role pill
function APill({ label, tone = 'var(--fg-1)', solid, icon }) {
  const bg = solid ? tone : 'transparent';
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 9px', borderRadius:'var(--radius-pill)',
      font:'600 11px/1 var(--font-body)', letterSpacing:'0.02em', whiteSpace:'nowrap',
      color: solid ? '#0a0a0a' : tone, background: bg,
      border: solid ? 'none' : `1px solid ${tone}55` }}>
      {icon && <Icon name={icon} size={11} color={solid ? '#0a0a0a' : tone} weight="fill" />}
      {label}
    </span>
  );
}

// admin action button — variants: ghost (default), approve, reject, neutral, primary
function ABtn({ children, icon, variant = 'ghost', size = 'sm', onClick, disabled }) {
  const [hover, setHover] = React.useState(false);
  const pads = size === 'xs' ? '6px 10px' : '8px 13px';
  const fs = size === 'xs' ? 12 : 13;
  const palette = {
    ghost:   { bg:'transparent', bgH:'var(--bg-3)', bd:'var(--border-default)', fg:'var(--fg-1)', fgH:'var(--fg-0)' },
    approve: { bg:'var(--teal-ghost)', bgH:'rgba(78,205,196,0.22)', bd:'rgba(78,205,196,0.4)', fg:'var(--teal-bright)', fgH:'var(--teal-bright)' },
    reject:  { bg:'rgba(229,72,77,0.12)', bgH:'rgba(229,72,77,0.22)', bd:'rgba(229,72,77,0.4)', fg:'#f0686c', fgH:'#f0686c' },
    warn:    { bg:'rgba(229,178,59,0.12)', bgH:'rgba(229,178,59,0.22)', bd:'rgba(229,178,59,0.4)', fg:'var(--warning)', fgH:'var(--warning)' },
    primary: { bg:'var(--coral)', bgH:'var(--coral-bright)', bd:'transparent', fg:'var(--fg-on-accent)', fgH:'var(--fg-on-accent)' },
    neutral: { bg:'var(--bg-3)', bgH:'var(--border-strong)', bd:'var(--border-default)', fg:'var(--fg-0)', fgH:'var(--fg-0)' },
  }[variant];
  return (
    <button onClick={onClick} disabled={disabled} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display:'inline-flex', alignItems:'center', gap:6, padding:pads, borderRadius:'var(--radius-md)',
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, font:`600 ${fs}px/1 var(--font-body)`,
        background: hover ? palette.bgH : palette.bg, border:`1px solid ${palette.bd}`,
        color: hover ? palette.fgH : palette.fg, transition:'all var(--dur-fast)', whiteSpace:'nowrap' }}>
      {icon && <Icon name={icon} size={fs+2} color="currentColor" />}
      {children}
    </button>
  );
}

// segmented tabs (count badges optional)
function ATabs({ tabs, active, onChange }) {
  return (
    <div style={{ display:'inline-flex', gap:4, padding:4, background:'var(--bg-1)', borderRadius:'var(--radius-md)',
      border:'1px solid var(--border-subtle)' }}>
      {tabs.map(t => {
        const on = active === t.id;
        return (
          <button key={t.id} onClick={() => onChange(t.id)}
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 15px', borderRadius:'var(--radius-sm)',
              cursor:'pointer', font:'600 13.5px/1 var(--font-body)', border:'none', transition:'all var(--dur-fast)',
              background: on ? 'var(--bg-3)' : 'transparent', color: on ? 'var(--fg-0)' : 'var(--fg-2)' }}>
            {t.label}
            {t.count != null && (
              <span style={{ font:'600 11px/1 var(--font-mono)', padding:'3px 6px', borderRadius:'var(--radius-pill)',
                background: on ? (t.tone || 'var(--coral)') : 'var(--bg-3)', color: on ? '#0a0a0a' : 'var(--fg-2)' }}>{t.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// toggle switch
function AToggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} role="switch" aria-checked={on}
      style={{ width:44, height:25, borderRadius:'var(--radius-pill)', border:'none', cursor:'pointer', padding:3,
        background: on ? 'var(--teal)' : 'var(--bg-3)', transition:'background var(--dur-base)', flex:'none' }}>
      <span style={{ display:'block', width:19, height:19, borderRadius:'50%', background:'#0a0a0a',
        transform: on ? 'translateX(19px)' : 'translateX(0)', transition:'transform var(--dur-base) var(--ease-out)' }} />
    </button>
  );
}

// thumbnail (poster) for tables
function AThumb({ g, type, w = 40 }) {
  const aspect = type === 'vertical' ? '9/16' : '2/3';
  return (
    <div style={{ width:w, aspectRatio:aspect, flex:'none', borderRadius:6, overflow:'hidden',
      background:`linear-gradient(150deg, ${g[0]}, ${g[1]} 150%)`, boxShadow:'var(--shadow-1)' }} />
  );
}

// search input
function ASearch({ value, onChange, placeholder }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:9, background:'var(--bg-1)', border:'1px solid var(--border-default)',
      borderRadius:'var(--radius-md)', padding:'9px 13px', minWidth:240 }}>
      <Icon name="magnifying-glass" size={15} color="var(--fg-2)" />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ background:'none', border:'none', outline:'none', color:'var(--fg-0)', font:'var(--text-body-sm)', width:'100%' }} />
    </div>
  );
}

// confirmation / reason modal
function AReasonModal({ title, sub, label, placeholder, confirmLabel, confirmVariant = 'reject', requireText, onConfirm, onClose }) {
  const [text, setText] = React.useState('');
  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:400, display:'flex', alignItems:'center', justifyContent:'center',
      background:'rgba(5,5,5,0.74)', backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)', padding:24 }}>
      <div onClick={e => e.stopPropagation()} style={{ width:'100%', maxWidth:440, background:'var(--bg-1)',
        border:'1px solid var(--border-default)', borderRadius:'var(--radius-xl)', boxShadow:'var(--shadow-3)', padding:'26px 26px 22px' }}>
        <h3 style={{ font:'var(--text-h3)', color:'var(--fg-0)', margin:'0 0 6px' }}>{title}</h3>
        {sub && <p style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', margin:'0 0 18px' }}>{sub}</p>}
        {label && (
          <>
            <label className="overline" style={{ color:'var(--fg-2)', display:'block', marginBottom:8 }}>{label}</label>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={3} placeholder={placeholder}
              style={{ width:'100%', resize:'vertical', background:'var(--bg-0)', border:'1px solid var(--border-default)',
                borderRadius:'var(--radius-md)', padding:'11px 13px', color:'var(--fg-0)', font:'var(--text-body)', outline:'none' }} />
          </>
        )}
        <div style={{ display:'flex', justifyContent:'flex-end', gap:10, marginTop:20 }}>
          <ABtn variant="ghost" size="sm" onClick={onClose}>Cancel</ABtn>
          <ABtn variant={confirmVariant} size="sm" disabled={requireText && !text.trim()}
            onClick={() => { onConfirm(text); onClose(); }}>{confirmLabel}</ABtn>
        </div>
      </div>
    </div>
  );
}

// toast
function AToast({ msg, onClose }) {
  React.useEffect(() => { const t = setTimeout(onClose, 2600); return () => clearTimeout(t); }, [msg]);
  return (
    <div style={{ position:'fixed', left:'50%', bottom:30, transform:'translateX(-50%)', zIndex:500,
      display:'flex', alignItems:'center', gap:11, padding:'13px 20px', background:'var(--bg-2)',
      border:'1px solid var(--border-strong)', borderRadius:'var(--radius-pill)', boxShadow:'var(--shadow-3)',
      animation:'aicdbCardIn 0.35s var(--ease-out) both' }}>
      <Icon name="check-circle" size={18} color="var(--teal-bright)" weight="fill" />
      <span style={{ font:'600 14px/1 var(--font-body)', color:'var(--fg-0)' }}>{msg}</span>
    </div>
  );
}

// page header
function APageHead({ title, sub, children }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:20, flexWrap:'wrap', marginBottom:26 }}>
      <div>
        <h1 style={{ font:'600 28px/1.1 var(--font-display)', color:'var(--fg-0)', letterSpacing:'-0.01em', margin:0 }}>{title}</h1>
        {sub && <p style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', margin:'7px 0 0' }}>{sub}</p>}
      </div>
      {children && <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>{children}</div>}
    </div>
  );
}

// card wrapper
function ACard({ children, style, pad = 22 }) {
  return (
    <div style={{ background:'var(--bg-1)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)', padding:pad, ...style }}>
      {children}
    </div>
  );
}

// ============================================================
// Dashboard
// ============================================================
function StatCard({ icon, label, value, delta, tone, alert }) {
  return (
    <ACard pad={20} style={{ position:'relative', overflow:'hidden' }}>
      {alert && <span style={{ position:'absolute', top:16, right:16, width:8, height:8, borderRadius:'50%', background:tone, boxShadow:`0 0 8px ${tone}` }} />}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
        <div style={{ width:34, height:34, borderRadius:'var(--radius-md)', display:'flex', alignItems:'center', justifyContent:'center',
          background:`${tone}1f` }}>
          <Icon name={icon} size={18} color={tone} weight="fill" />
        </div>
        <span className="overline" style={{ color:'var(--fg-2)' }}>{label}</span>
      </div>
      <div style={{ font:'700 30px/1 var(--font-mono)', color:'var(--fg-0)', letterSpacing:'-0.01em' }}>{value}</div>
      {delta && (
        <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:10, font:'600 12px/1 var(--font-mono)',
          color: delta.startsWith('-') ? 'var(--danger)' : 'var(--teal-bright)' }}>
          <Icon name={delta.startsWith('-') ? 'trend-down' : 'trend-up'} size={13} color="currentColor" />{delta}
          <span style={{ color:'var(--fg-3)', fontWeight:500 }}>vs last week</span>
        </div>
      )}
    </ACard>
  );
}

function ActivityRow({ a }) {
  const cfg = {
    register:   { icon:'user-plus', tone:'var(--teal)' },
    submission: { icon:'upload-simple', tone:'var(--coral)' },
    report:     { icon:'flag', tone:'var(--warning)' },
    ban:        { icon:'prohibit', tone:'var(--danger)' },
  }[a.kind];
  return (
    <div style={{ display:'flex', alignItems:'center', gap:13, padding:'13px 0', borderBottom:'1px solid var(--border-subtle)' }}>
      <div style={{ position:'relative', flex:'none' }}>
        <Avatar size={36} colors={a.av} />
        <span style={{ position:'absolute', bottom:-2, right:-2, width:17, height:17, borderRadius:'50%',
          background:'var(--bg-1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon name={cfg.icon} size={11} color={cfg.tone} weight="fill" />
        </span>
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ font:'var(--text-body-sm)', color:'var(--fg-1)' }}>
          <span style={{ color:'var(--fg-0)', fontWeight:600 }}>{a.who}</span> {a.detail}
        </div>
      </div>
      <span style={{ font:'var(--text-data-sm)', color:'var(--fg-3)', flex:'none' }}>{a.time}</span>
    </div>
  );
}

function Dashboard({ onNav }) {
  const s = window.ADMIN_STATS;
  const cards = [
    { icon:'users', label:'Total Users', value:fmtCount(s.totalUsers), delta:'+4.2%', tone:'var(--teal)' },
    { icon:'film-slate', label:'Total Content', value:s.totalContent, delta:'+3', tone:'var(--coral)' },
    { icon:'hourglass-medium', label:'Pending Reviews', value:s.pendingReviews, tone:'var(--warning)', alert:true },
    { icon:'pulse', label:'Active Today', value:fmtCount(s.activeToday), delta:'+1.8%', tone:'var(--info)' },
    { icon:'star', label:'Total Ratings', value:fmtCount(s.totalRatings), delta:'+12k', tone:'var(--coral)' },
    { icon:'flag', label:'Reported Items', value:s.reportedItems, tone:'var(--danger)', alert:true },
  ];
  return (
    <div>
      <APageHead title="Dashboard" sub="Platform health at a glance — Saturday, June 3, 2026" />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16, marginBottom:30 }}>
        {cards.map(c => <StatCard key={c.label} {...c} />)}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:20, alignItems:'start' }}>
        <ACard>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
            <h3 style={{ font:'600 18px/1 var(--font-display)', color:'var(--fg-0)' }}>Recent activity</h3>
            <span style={{ display:'inline-flex', alignItems:'center', gap:6, font:'var(--text-data-sm)', color:'var(--teal-bright)' }}>
              <span style={{ width:7, height:7, borderRadius:'50%', background:'var(--teal-bright)', boxShadow:'0 0 8px rgba(78,205,196,0.9)' }} /> Live
            </span>
          </div>
          {window.ADMIN_ACTIVITY.map((a, i) => <ActivityRow key={i} a={a} />)}
        </ACard>

        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <ACard>
            <h3 style={{ font:'600 18px/1 var(--font-display)', color:'var(--fg-0)', marginBottom:16 }}>Needs attention</h3>
            <QueueRow icon="hourglass-medium" tone="var(--warning)" label="Content pending review" count={window.ADMIN_STATS.pendingReviews} onClick={() => onNav('Content')} />
            <QueueRow icon="flag" tone="var(--danger)" label="Open reports" count={window.ADMIN_STATS.reportedItems} onClick={() => onNav('Reports')} />
            <QueueRow icon="prohibit" tone="var(--fg-1)" label="Banned accounts" count={window.ADMIN_USERS.filter(u => u.banned).length} onClick={() => onNav('Users')} last />
          </ACard>
          <ACard>
            <h3 style={{ font:'600 18px/1 var(--font-display)', color:'var(--fg-0)', marginBottom:6 }}>This week</h3>
            <MiniSpark series={window.ADMIN_SERIES.active.slice(-14)} tone="var(--teal)" label="Active users" />
          </ACard>
        </div>
      </div>
    </div>
  );
}

function QueueRow({ icon, tone, label, count, onClick, last }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 10px', margin:'0 -10px', cursor:'pointer',
        borderRadius:'var(--radius-md)', background: hover ? 'var(--bg-2)' : 'transparent',
        borderBottom: last ? 'none' : '1px solid var(--border-subtle)' }}>
      <Icon name={icon} size={17} color={tone} weight="fill" />
      <span style={{ flex:1, font:'var(--text-body-sm)', color:'var(--fg-1)' }}>{label}</span>
      <span style={{ font:'700 15px/1 var(--font-mono)', color:'var(--fg-0)' }}>{count}</span>
      <Icon name="caret-right" size={14} color="var(--fg-3)" />
    </div>
  );
}

// tiny inline sparkline (area)
function MiniSpark({ series, tone, label }) {
  const w = 280, h = 70, max = Math.max(...series), min = Math.min(...series);
  const pts = series.map((v, i) => [ (i / (series.length - 1)) * w, h - ((v - min) / (max - min || 1)) * (h - 8) - 4 ]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = line + ` L ${w} ${h} L 0 ${h} Z`;
  return (
    <div>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:8 }}>
        <span style={{ font:'var(--text-body-sm)', color:'var(--fg-2)' }}>{label}</span>
        <span style={{ font:'700 16px/1 var(--font-mono)', color:'var(--fg-0)' }}>{fmtCount(series[series.length-1])}</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
        <defs><linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tone} stopOpacity="0.32" /><stop offset="100%" stopColor={tone} stopOpacity="0" />
        </linearGradient></defs>
        <path d={area} fill="url(#spark)" />
        <path d={line} fill="none" stroke={tone} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

Object.assign(window, { ADMIN_NAV, statusColor, APill, ABtn, ATabs, AToggle, AThumb, ASearch,
  AReasonModal, AToast, APageHead, ACard, Dashboard, StatCard, ActivityRow, QueueRow, MiniSpark });

// ============================================================
// Sidebar + shell
// ============================================================
function AdminSidebar({ active, onNav }) {
  return (
    <aside style={{ width:240, flex:'none', position:'sticky', top:0, alignSelf:'flex-start', height:'100vh',
      background:'var(--bg-1)', borderRight:'1px solid var(--border-subtle)', display:'flex', flexDirection:'column' }}>
      {/* brand */}
      <div style={{ padding:'22px 22px 18px', borderBottom:'1px solid var(--border-subtle)' }}>
        <Logo size={19} onClick={() => { window.location.href = 'index.html'; }} />
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, marginTop:12, padding:'4px 10px', borderRadius:'var(--radius-pill)',
          background:'var(--coral-ghost)', border:'1px solid var(--border-accent)' }}>
          <Icon name="shield-star" size={12} color="var(--coral-bright)" weight="fill" />
          <span style={{ font:'700 10px/1 var(--font-body)', letterSpacing:'0.1em', color:'var(--coral-bright)', textTransform:'uppercase' }}>Admin Panel</span>
        </div>
      </div>
      {/* nav */}
      <nav style={{ flex:1, padding:'14px 12px', display:'flex', flexDirection:'column', gap:3, overflowY:'auto' }}>
        {ADMIN_NAV.map(n => {
          const on = active === n.id;
          return (
            <button key={n.id} onClick={() => onNav(n.id)}
              style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 13px', borderRadius:'var(--radius-md)', cursor:'pointer',
                border:'none', textAlign:'left', font:'600 14px/1 var(--font-body)', transition:'all var(--dur-fast)',
                background: on ? 'var(--bg-3)' : 'transparent', color: on ? 'var(--fg-0)' : 'var(--fg-1)',
                position:'relative' }}
              onMouseEnter={e => { if (!on) e.currentTarget.style.background = 'var(--bg-2)'; }}
              onMouseLeave={e => { if (!on) e.currentTarget.style.background = 'transparent'; }}>
              {on && <span style={{ position:'absolute', left:0, top:9, bottom:9, width:3, borderRadius:'0 3px 3px 0', background:'var(--coral)' }} />}
              <Icon name={n.icon} size={18} color={on ? 'var(--coral-bright)' : 'var(--fg-2)'} weight={on ? 'fill' : 'regular'} />
              {n.id}
              {n.id === 'Content' && window.ADMIN_STATS.pendingReviews > 0 &&
                <span style={{ marginLeft:'auto', font:'600 10px/1 var(--font-mono)', padding:'3px 6px', borderRadius:'var(--radius-pill)', background:'var(--warning)', color:'#0a0a0a' }}>{window.ADMIN_STATS.pendingReviews}</span>}
              {n.id === 'Reports' && window.ADMIN_STATS.reportedItems > 0 &&
                <span style={{ marginLeft:'auto', font:'600 10px/1 var(--font-mono)', padding:'3px 6px', borderRadius:'var(--radius-pill)', background:'var(--danger)', color:'#0a0a0a' }}>{window.ADMIN_STATS.reportedItems}</span>}
            </button>
          );
        })}
      </nav>
      {/* footer: admin identity + back to site */}
      <div style={{ padding:'14px 16px', borderTop:'1px solid var(--border-subtle)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
          <Avatar size={34} colors={['#d85a30','#9d8df1']} />
          <div style={{ minWidth:0 }}>
            <div style={{ font:'600 13px/1.2 var(--font-body)', color:'var(--fg-0)' }}>Ada Vance</div>
            <div style={{ font:'var(--text-data-sm)', color:'var(--fg-2)' }}>Administrator</div>
          </div>
        </div>
        <a onClick={() => { window.location.href = 'index.html'; }}
          style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 11px', borderRadius:'var(--radius-md)', cursor:'pointer',
            font:'500 13px/1 var(--font-body)', color:'var(--fg-1)', background:'var(--bg-2)' }}>
          <Icon name="arrow-left" size={14} color="var(--fg-2)" /> Back to site
        </a>
      </div>
    </aside>
  );
}

function AdminApp() {
  const [nav, setNav] = React.useState('Dashboard');
  const [toastMsg, setToastMsg] = React.useState(null);
  const toast = (msg) => setToastMsg(msg);
  const go = (n) => { setNav(n); window.scrollTo(0, 0); };

  let page;
  if (nav === 'Dashboard') page = <Dashboard onNav={go} />;
  else if (nav === 'Content') page = <ContentPage toast={toast} />;
  else if (nav === 'Users') page = <UsersPage toast={toast} />;
  else if (nav === 'Badges') page = <BadgesPage toast={toast} />;
  else if (nav === 'Reports') page = <ReportsPage toast={toast} />;
  else if (nav === 'Statistics') page = <StatisticsPage />;
  else if (nav === 'Settings') page = <SettingsPage toast={toast} />;

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg-0)' }}>
      <AdminSidebar active={nav} onNav={go} />
      <main style={{ flex:1, minWidth:0, padding:'34px 38px 80px', maxWidth:1280 }}>{page}</main>
      {toastMsg && <AToast msg={toastMsg} onClose={() => setToastMsg(null)} />}
    </div>
  );
}

Object.assign(window, { AdminSidebar, AdminApp });

// ============================================================
// PIN entry gate — minimal dark screen shown before the panel
// ============================================================
function AdminPinGate({ children }) {
  const PIN = '2580';
  const LEN = 4;
  const [pin, setPin] = React.useState('');
  const [unlocked, setUnlocked] = React.useState(false);
  const [error, setError] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => { ref.current && ref.current.focus(); }, []);

  const submit = (value) => {
    if (value === PIN) { setError(false); setUnlocked(true); }
    else { setError(true); setPin(''); setTimeout(() => ref.current && ref.current.focus(), 0); }
  };
  const onChange = (raw) => {
    const v = raw.replace(/[^0-9]/g, '').slice(0, LEN);
    setPin(v); if (error) setError(false);
    if (v.length === LEN) submit(v);
  };

  if (unlocked) return children;

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24,
      background:'radial-gradient(120% 90% at 50% 0%, var(--bg-vignette), var(--bg-0) 60%)' }}>
      <div style={{ width:'100%', maxWidth:360, textAlign:'center' }}>
        <div style={{ width:62, height:62, margin:'0 auto 24px', borderRadius:'var(--radius-lg)', display:'flex', alignItems:'center', justifyContent:'center',
          background:'var(--coral-ghost)', border:'1px solid var(--border-accent)' }}>
          <Icon name="lock-key" size={28} color="var(--coral-bright)" weight="fill" />
        </div>
        <div className="overline" style={{ color:'var(--coral-bright)', letterSpacing:'0.14em', marginBottom:12 }}>Admin Panel</div>
        <h1 style={{ font:'600 26px/1.15 var(--font-display)', color:'var(--fg-0)', margin:'0 0 8px' }}>Enter your PIN</h1>
        <p style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', margin:'0 0 28px' }}>This area is restricted. Enter your {LEN}-digit admin PIN to continue.</p>

        {/* hidden input drives the dots */}
        <input ref={ref} value={pin} onChange={e => onChange(e.target.value)} inputMode="numeric" type="password" autoComplete="off"
          onKeyDown={e => { if (e.key === 'Enter') submit(pin); }}
          style={{ position:'absolute', opacity:0, width:1, height:1, pointerEvents:'none' }} />
        <div onClick={() => ref.current && ref.current.focus()}
          style={{ display:'flex', justifyContent:'center', gap:14, marginBottom:22, cursor:'text' }}>
          {Array.from({ length: LEN }).map((_, i) => {
            const filled = i < pin.length;
            return (
              <div key={i} style={{ width:54, height:62, borderRadius:'var(--radius-md)', display:'flex', alignItems:'center', justifyContent:'center',
                background:'var(--bg-1)', borderWidth:1, borderStyle:'solid',
                borderColor: error ? 'var(--danger)' : (filled || (i === pin.length) ? 'var(--border-accent)' : 'var(--border-default)'),
                boxShadow: (i === pin.length && !error) ? 'var(--glow-coral)' : 'none', transition:'border-color var(--dur-fast), box-shadow var(--dur-fast)' }}>
                {filled && <span style={{ width:12, height:12, borderRadius:'50%', background:'var(--fg-0)' }} />}
              </div>
            );
          })}
        </div>

        {error && (
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, marginBottom:18, padding:'8px 13px', borderRadius:'var(--radius-md)',
            background:'rgba(229,72,77,0.1)', border:'1px solid rgba(229,72,77,0.35)', font:'var(--text-body-sm)', color:'var(--score-low)' }}>
            <Icon name="warning" size={14} color="var(--score-low)" /> Incorrect PIN. Try again.
          </div>
        )}

        <button onClick={() => submit(pin)} disabled={pin.length < LEN}
          style={{ width:'100%', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8, padding:'13px 0',
            borderRadius:'var(--radius-md)', border:'none', cursor: pin.length < LEN ? 'not-allowed' : 'pointer',
            font:'600 14px/1 var(--font-body)', transition:'background var(--dur-fast)',
            background: pin.length < LEN ? 'var(--bg-3)' : 'var(--coral)', color: pin.length < LEN ? 'var(--fg-3)' : 'var(--fg-on-accent)' }}>
          <Icon name="arrow-right" size={16} color={pin.length < LEN ? 'var(--fg-3)' : 'var(--fg-on-accent)'} weight="bold" /> Confirm
        </button>

        <a onClick={() => { window.location.href = 'index.html'; }}
          style={{ display:'inline-block', marginTop:22, cursor:'pointer', font:'500 13px/1 var(--font-body)', color:'var(--fg-2)' }}>← Back to site</a>
      </div>
    </div>
  );
}

Object.assign(window, { AdminPinGate });
