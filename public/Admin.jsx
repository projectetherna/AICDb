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
  const [stats, setStats] = React.useState({ totalUsers:0, totalContent:0, pendingReviews:0, totalRatings:0 });
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    window.AICDB_AUTH.getClient().then(async (sb) => {
      const [
        { count: totalUsers },
        { count: totalContent },
        { count: pendingReviews },
        { count: totalRatings },
      ] = await Promise.all([
        sb.from('profiles').select('id', { count:'exact', head:true }),
        sb.from('content').select('id', { count:'exact', head:true }).eq('status', 'published'),
        sb.from('content').select('id', { count:'exact', head:true }).eq('status', 'pending'),
        sb.from('ratings').select('id', { count:'exact', head:true }),
      ]);
      const s = { totalUsers: totalUsers||0, totalContent: totalContent||0, pendingReviews: pendingReviews||0, totalRatings: totalRatings||0 };
      Object.assign(window.ADMIN_STATS, s);
      setStats(s);
      setLoaded(true);
    });
  }, []);

  const fmt = (n) => loaded ? fmtCount(n) : '—';
  const cards = [
    { icon:'users',           label:'Total Users',      value:fmt(stats.totalUsers),      tone:'var(--teal)' },
    { icon:'film-slate',      label:'Published Content', value:fmt(stats.totalContent),    tone:'var(--coral)' },
    { icon:'hourglass-medium',label:'Pending Reviews',   value:fmt(stats.pendingReviews),  tone:'var(--warning)', alert:stats.pendingReviews > 0 },
    { icon:'star',            label:'Total Ratings',     value:fmt(stats.totalRatings),    tone:'var(--coral)' },
  ];

  const today = new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  return (
    <div>
      <APageHead title="Dashboard" sub={'Platform health at a glance — ' + today} />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16, marginBottom:30 }}>
        {cards.map(c => <StatCard key={c.label} {...c} />)}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:20, alignItems:'start' }}>
        <ACard>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
            <h3 style={{ font:'600 18px/1 var(--font-display)', color:'var(--fg-0)' }}>Recent activity</h3>
          </div>
          <div style={{ padding:'28px 0', textAlign:'center', font:'var(--text-body-sm)', color:'var(--fg-3)' }}>
            Activity feed coming soon.
          </div>
        </ACard>

        <ACard>
          <h3 style={{ font:'600 18px/1 var(--font-display)', color:'var(--fg-0)', marginBottom:16 }}>Needs attention</h3>
          <QueueRow icon="hourglass-medium" tone="var(--warning)" label="Content pending review" count={stats.pendingReviews} onClick={() => onNav('Content')} />
          <QueueRow icon="flag" tone="var(--danger)" label="Open reports" count={0} onClick={() => onNav('Reports')} last />
        </ACard>
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
            <div style={{ font:'600 13px/1.2 var(--font-body)', color:'var(--fg-0)' }}>Admin</div>
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
// Admin gate — checks Supabase session + profiles.is_admin
// ============================================================
function AdminPinGate({ children }) {
  // states: 'loading' | 'unauthenticated' | 'forbidden' | 'allowed'
  const [state, setState] = React.useState('loading');

  React.useEffect(() => {
    if (!window.AICDB_AUTH) { setState('unauthenticated'); return; }
    window.AICDB_AUTH.getClient().then(async (supabase) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setState('unauthenticated'); return; }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();

      if (error || !profile || !profile.is_admin) {
        setState('forbidden');
      } else {
        setState('allowed');
      }
    }).catch(() => setState('unauthenticated'));
  }, []);

  if (state === 'loading') {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-0)' }}>
        <div style={{ width:32, height:32, borderRadius:'50%', border:'3px solid var(--border-default)', borderTopColor:'var(--coral)', animation:'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (state === 'unauthenticated') {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24,
        background:'radial-gradient(120% 90% at 50% 0%, var(--bg-vignette, #1a0a00), var(--bg-0) 60%)' }}>
        <div style={{ width:'100%', maxWidth:360, textAlign:'center' }}>
          <div style={{ width:62, height:62, margin:'0 auto 24px', borderRadius:'var(--radius-lg)', display:'flex', alignItems:'center', justifyContent:'center',
            background:'var(--coral-ghost)', border:'1px solid var(--border-accent)' }}>
            <Icon name="lock-key" size={28} color="var(--coral-bright)" weight="fill" />
          </div>
          <div className="overline" style={{ color:'var(--coral-bright)', letterSpacing:'0.14em', marginBottom:12 }}>Admin Panel</div>
          <h1 style={{ font:'600 26px/1.15 var(--font-display)', color:'var(--fg-0)', margin:'0 0 8px' }}>Sign in required</h1>
          <p style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', margin:'0 0 28px' }}>You need to be signed in to access the admin panel.</p>
          <button onClick={() => { window.location.href = window.AICDB_PAGE('login') + '?next=/admin.html'; }}
            style={{ width:'100%', padding:'13px 0', borderRadius:'var(--radius-md)', border:'none', cursor:'pointer',
              font:'600 14px/1 var(--font-body)', background:'var(--coral)', color:'var(--fg-on-accent)' }}>
            Sign in
          </button>
          <a onClick={() => { window.location.href = '/'; }}
            style={{ display:'inline-block', marginTop:18, cursor:'pointer', font:'500 13px/1 var(--font-body)', color:'var(--fg-2)' }}>← Back to site</a>
        </div>
      </div>
    );
  }

  if (state === 'forbidden') {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24, background:'var(--bg-0)' }}>
        <div style={{ width:'100%', maxWidth:360, textAlign:'center' }}>
          <div style={{ width:62, height:62, margin:'0 auto 24px', borderRadius:'var(--radius-lg)', display:'flex', alignItems:'center', justifyContent:'center',
            background:'rgba(229,72,77,0.12)', border:'1px solid rgba(229,72,77,0.35)' }}>
            <Icon name="prohibit" size={28} color="#f0686c" weight="fill" />
          </div>
          <h1 style={{ font:'600 26px/1.15 var(--font-display)', color:'var(--fg-0)', margin:'0 0 8px' }}>Access denied</h1>
          <p style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', margin:'0 0 28px' }}>Your account does not have admin privileges.</p>
          <a onClick={() => { window.location.href = '/'; }}
            style={{ display:'inline-block', cursor:'pointer', font:'500 13px/1 var(--font-body)', color:'var(--fg-2)' }}>← Back to site</a>
        </div>
      </div>
    );
  }

  return children;
}

Object.assign(window, { AdminPinGate });
