// Dreamwall — Admin Panel: Users, Statistics (charts), Settings.

// ============================================================
// User management
// ============================================================
function fmtJoin(d) {
  const [y, m] = d.split('-');
  return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m - 1] + ' ' + y;
}

function UserRow({ u, onAction }) {
  const role = u.banned ? 'banned' : u.role;
  return (
    <div style={{ display:'grid', gridTemplateColumns:'2.4fr 1.5fr 0.9fr 0.7fr 0.9fr auto', alignItems:'center', gap:14,
      padding:'12px 18px', background:'var(--bg-1)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)' }}>
      {/* identity */}
      <div style={{ display:'flex', alignItems:'center', gap:12, minWidth:0 }}>
        <div style={{ opacity: u.banned ? 0.5 : 1, flex:'none' }}><Avatar size={38} colors={u.av} /></div>
        <div style={{ minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ font:'600 14px/1.2 var(--font-body)', color:'var(--fg-0)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{u.name}</span>
            {u.verified && <Icon name="seal-check" size={13} color="var(--teal-bright)" weight="fill" />}
          </div>
          <div style={{ font:'var(--text-data-sm)', color:'var(--fg-2)' }}>{u.handle}</div>
        </div>
      </div>
      <span style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{u.email}</span>
      <span style={{ font:'var(--text-body-sm)', color:'var(--fg-2)' }}>{fmtJoin(u.joined)}</span>
      <span style={{ font:'700 14px/1 var(--font-mono)', color: u.works ? 'var(--fg-0)' : 'var(--fg-3)' }}>{u.works}</span>
      <span><APill label={role} tone={statusColor(role)} /></span>
      {/* actions */}
      <div style={{ display:'flex', alignItems:'center', gap:6, justifyContent:'flex-end' }}>
        {!u.banned && <ABtn variant="warn" icon="warning" size="xs" onClick={() => onAction('warn', u)}>Warn</ABtn>}
        {u.banned
          ? <ABtn variant="approve" icon="lock-open" size="xs" onClick={() => onAction('unban', u)}>Unban</ABtn>
          : <ABtn variant="reject" icon="prohibit" size="xs" onClick={() => onAction('ban', u)}>Ban</ABtn>}
        <AUserMenu u={u} onAction={onAction} />
      </div>
    </div>
  );
}

function AUserMenu({ u, onAction }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  const item = (icon, label, act) => (
    <div onClick={() => { setOpen(false); onAction(act, u); }}
      style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 11px', cursor:'pointer', borderRadius:'var(--radius-md)',
        font:'500 13px/1 var(--font-body)', color:'var(--fg-1)' }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <Icon name={icon} size={15} color="var(--fg-2)" />{label}
    </div>
  );
  return (
    <div ref={ref} style={{ position:'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width:32, height:32, borderRadius:'var(--radius-md)', cursor:'pointer',
        background:'transparent', border:'1px solid var(--border-default)', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Icon name="dots-three-vertical" size={16} color="var(--fg-1)" weight="bold" />
      </button>
      {open && (
        <div style={{ position:'absolute', top:'calc(100% + 6px)', right:0, zIndex:60, width:190, padding:6,
          background:'var(--bg-1)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-lg)', boxShadow:'var(--shadow-3)' }}>
          {item('user', 'View profile', 'view')}
          {item(u.role === 'creator' ? 'user-minus' : 'user-plus', u.role === 'creator' ? 'Revoke creator' : 'Make creator', 'toggleCreator')}
        </div>
      )}
    </div>
  );
}

function UsersPage({ toast }) {
  const [users, setUsers] = React.useState(window.ADMIN_USERS);
  const [q, setQ] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  const onAction = (mode, u) => {
    if (mode === 'ban') setUsers(list => list.map(x => x.id === u.id ? { ...x, banned:true } : x)), toast(`${u.name} has been banned`);
    else if (mode === 'unban') setUsers(list => list.map(x => x.id === u.id ? { ...x, banned:false } : x)), toast(`${u.name} reinstated`);
    else if (mode === 'warn') toast(`Warning sent to ${u.name}`);
    else if (mode === 'view') toast(`Opening ${u.handle}'s profile…`);
    else if (mode === 'toggleCreator') {
      setUsers(list => list.map(x => x.id === u.id ? { ...x, role: x.role === 'creator' ? 'viewer' : 'creator' } : x));
      toast(u.role === 'creator' ? `${u.name} is no longer a creator` : `${u.name} is now a creator`);
    }
  };
  const ql = q.trim().toLowerCase();
  const shown = users.filter(u => {
    if (filter === 'creators' && u.role !== 'creator') return false;
    if (filter === 'banned' && !u.banned) return false;
    if (ql && !(u.name.toLowerCase().includes(ql) || u.handle.toLowerCase().includes(ql) || u.email.toLowerCase().includes(ql))) return false;
    return true;
  });
  const filters = [['all','All', users.length], ['creators','Creators', users.filter(u => u.role === 'creator').length], ['banned','Banned', users.filter(u => u.banned).length]];

  return (
    <div>
      <APageHead title="Users" sub={`${fmtCount(window.ADMIN_STATS.totalUsers)} total accounts · ${users.filter(u => u.banned).length} banned`}>
        <ASearch value={q} onChange={setQ} placeholder="Search name, handle, email…" />
      </APageHead>
      <div style={{ display:'flex', gap:8, marginBottom:18, flexWrap:'wrap' }}>
        {filters.map(([id, label, n]) => (
          <ABtn key={id} variant={filter === id ? 'neutral' : 'ghost'} onClick={() => setFilter(id)}>
            {label} <span style={{ font:'600 11px/1 var(--font-mono)', color:'var(--fg-3)' }}>{n}</span>
          </ABtn>
        ))}
      </div>
      {/* column header */}
      <div style={{ display:'grid', gridTemplateColumns:'2.4fr 1.5fr 0.9fr 0.7fr 0.9fr auto', gap:14, padding:'0 18px 10px' }}>
        {['User','Email','Joined','Works','Role',''].map((h, i) => (
          <span key={i} className="overline" style={{ color:'var(--fg-3)', textAlign: i === 5 ? 'right' : 'left' }}>{h}</span>
        ))}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {shown.length ? shown.map(u => <UserRow key={u.id} u={u} onAction={onAction} />)
          : <EmptyState icon="user" accent="var(--teal)" compact title="No users found" sub="Try a different search or filter." />}
      </div>
    </div>
  );
}

// ============================================================
// Statistics — charts + leaderboards
// ============================================================
function ChartCard({ title, value, delta, children }) {
  return (
    <ACard>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:18 }}>
        <div>
          <div className="overline" style={{ color:'var(--fg-2)', marginBottom:8 }}>{title}</div>
          <div style={{ display:'flex', alignItems:'baseline', gap:10 }}>
            <span style={{ font:'700 26px/1 var(--font-mono)', color:'var(--fg-0)' }}>{value}</span>
            {delta && <span style={{ font:'600 12px/1 var(--font-mono)', color:'var(--teal-bright)' }}>{delta}</span>}
          </div>
        </div>
      </div>
      {children}
    </ACard>
  );
}

// area/line chart with axis + hover-free grid
function LineChart({ series, tone, height = 150 }) {
  const w = 520, h = height, pad = 8;
  const max = Math.max(...series), min = Math.min(...series);
  const x = (i) => (i / (series.length - 1)) * (w - pad * 2) + pad;
  const y = (v) => h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
  const pts = series.map((v, i) => [x(i), y(v)]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = line + ` L ${x(series.length-1)} ${h} L ${x(0)} ${h} Z`;
  const gid = 'lc' + tone.replace(/[^a-z]/gi, '');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={tone} stopOpacity="0.3" /><stop offset="100%" stopColor={tone} stopOpacity="0" />
      </linearGradient></defs>
      {[0.25, 0.5, 0.75].map(g => <line key={g} x1={pad} x2={w-pad} y1={h*g} y2={h*g} stroke="var(--border-subtle)" strokeWidth="1" />)}
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={tone} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.filter((_, i) => i === pts.length - 1).map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="4" fill={tone} stroke="var(--bg-1)" strokeWidth="2" />)}
    </svg>
  );
}

function BarChart({ series, tone, height = 150 }) {
  const max = Math.max(...series);
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:3, height, padding:'0 2px' }}>
      {series.map((v, i) => (
        <div key={i} title={fmtCount(v)} style={{ flex:1, height:`${(v / max) * 100}%`, minHeight:3, borderRadius:'3px 3px 0 0',
          background: tone, opacity: i === series.length - 1 ? 1 : 0.4, transition:'height var(--dur-base)' }} />
      ))}
    </div>
  );
}

function RangeToggle({ value, onChange }) {
  return (
    <div style={{ display:'inline-flex', gap:2, padding:3, background:'var(--bg-0)', borderRadius:'var(--radius-md)', border:'1px solid var(--border-subtle)' }}>
      {['Daily','Weekly','Monthly'].map(r => {
        const on = value === r;
        return <button key={r} onClick={() => onChange(r)} style={{ padding:'6px 12px', borderRadius:'var(--radius-sm)', border:'none',
          cursor:'pointer', font:'600 12px/1 var(--font-body)', background: on ? 'var(--bg-3)' : 'transparent', color: on ? 'var(--fg-0)' : 'var(--fg-2)' }}>{r}</button>;
      })}
    </div>
  );
}

function LeaderList({ title, rows }) {
  return (
    <ACard>
      <h3 style={{ font:'600 18px/1 var(--font-display)', color:'var(--fg-0)', marginBottom:16 }}>{title}</h3>
      <div style={{ display:'flex', flexDirection:'column' }}>
        {rows.map((row, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:13, padding:'10px 0',
            borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--border-subtle)' }}>
            <span style={{ font:'700 14px/1 var(--font-mono)', color:'var(--fg-3)', width:18, flex:'none' }}>{i + 1}</span>
            {row.thumb}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ font:'600 14px/1.2 var(--font-body)', color:'var(--fg-0)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{row.label}</div>
              {row.sub && <div style={{ font:'var(--text-data-sm)', color:'var(--fg-2)', marginTop:3 }}>{row.sub}</div>}
            </div>
            <span style={{ font:'700 14px/1 var(--font-mono)', color: row.metricColor || 'var(--fg-1)', flex:'none' }}>{row.metric}</span>
          </div>
        ))}
      </div>
    </ACard>
  );
}

function StatisticsPage() {
  const [range, setRange] = React.useState('Daily');
  const s = window.ADMIN_SERIES;
  const L = window.ADMIN_LEADERS;
  // derive weekly/monthly aggregates from the daily series
  const agg = (arr, size) => { const out = []; for (let i = 0; i < arr.length; i += size) out.push(Math.round(arr.slice(i, i + size).reduce((a, b) => a + b, 0) / Math.min(size, arr.length - i))); return out; };
  const active = range === 'Daily' ? s.active : range === 'Weekly' ? agg(s.active, 7) : agg(s.active, 15);
  const avgActive = Math.round(active.reduce((a, b) => a + b, 0) / active.length);

  return (
    <div>
      <APageHead title="Statistics" sub="Growth, engagement, and the titles & creators driving the platform." />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
        <ChartCard title="Active users" value={fmtCount(active[active.length-1])} delta="+1.8%">
          <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:12 }}><RangeToggle value={range} onChange={setRange} /></div>
          <LineChart series={active} tone="var(--teal)" />
          <div style={{ font:'var(--text-data-sm)', color:'var(--fg-3)', marginTop:10 }}>Avg {fmtCount(avgActive)} · {range.toLowerCase()} active</div>
        </ChartCard>
        <ChartCard title="New registrations" value={fmtCount(s.regs.reduce((a, b) => a + b, 0))} delta="+6.4%">
          <div style={{ height:34 }} />
          <BarChart series={s.regs} tone="var(--coral)" />
          <div style={{ font:'var(--text-data-sm)', color:'var(--fg-3)', marginTop:10 }}>Last 30 days · {fmtCount(s.regs[s.regs.length-1])} today</div>
        </ChartCard>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:20 }}>
        <LeaderList title="Most viewed" rows={L.byViews.map(x => ({
          thumb:<AThumb g={x.film.g} type={x.film.type} w={32} />, label:x.film.title, sub:x.film.creator,
          metric:fmtCount(x.views), metricColor:'var(--teal-bright)' }))} />
        <LeaderList title="Most rated" rows={L.byRatings.map(x => ({
          thumb:<AThumb g={x.film.g} type={x.film.type} w={32} />, label:x.film.title, sub:`${x.film.score.toFixed(1)} avg`,
          metric:fmtCount(x.rated), metricColor:'var(--coral-bright)' }))} />
        <LeaderList title="Top creators" rows={L.topCreators.map(c => ({
          thumb:<div style={{ width:32, height:32, borderRadius:'50%', flex:'none', background:`linear-gradient(135deg, ${c.av[0]}, ${c.av[1]})` }} />,
          label:c.name, sub:c.handle, metric:fmtCount(c.followers), metricColor:'var(--fg-0)' }))} />
      </div>
    </div>
  );
}

// ============================================================
// Settings — announcement, content guidelines, language
// ============================================================
function SettingsPage({ toast }) {
  const [annOn, setAnnOn] = React.useState(true);
  const [annMsg, setAnnMsg] = React.useState('Dreamwall is now open to new creators — switch to a creator account to publish your work.');
  const [guidelines, setGuidelines] = React.useState(
    'Dreamwall celebrates AI-generated film & series.\n\n1. Credit your tools and collaborators.\n2. No unauthorized likenesses of real people.\n3. Label disturbing content with a warning.\n4. Every score comes from real viewers — no vote manipulation.\n5. No spam, harassment, or self-promotion in comments.');
  const [lang, setLang] = React.useState('EN');

  return (
    <div>
      <APageHead title="Settings" sub="Platform-wide configuration." />
      <div style={{ display:'flex', flexDirection:'column', gap:20, maxWidth:760 }}>

        {/* announcement */}
        <ACard>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, marginBottom:16 }}>
            <div>
              <h3 style={{ font:'600 18px/1.2 var(--font-display)', color:'var(--fg-0)', margin:'0 0 5px' }}>Site announcement banner</h3>
              <p style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', margin:0 }}>When on, every user sees this banner on the homepage.</p>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10, flex:'none' }}>
              <span style={{ font:'600 12px/1 var(--font-body)', color: annOn ? 'var(--teal-bright)' : 'var(--fg-3)' }}>{annOn ? 'On' : 'Off'}</span>
              <AToggle on={annOn} onChange={setAnnOn} />
            </div>
          </div>
          {/* live preview */}
          <div style={{ opacity: annOn ? 1 : 0.4, transition:'opacity var(--dur-base)', display:'flex', alignItems:'center', gap:11,
            padding:'12px 16px', borderRadius:'var(--radius-md)', marginBottom:14,
            background:'linear-gradient(90deg, var(--coral-ghost), transparent)', border:'1px solid var(--border-accent)' }}>
            <Icon name="megaphone" size={17} color="var(--coral-bright)" weight="fill" />
            <span style={{ font:'var(--text-body-sm)', color:'var(--fg-0)', flex:1 }}>{annMsg || 'Your announcement preview appears here.'}</span>
            <Icon name="x" size={14} color="var(--fg-3)" />
          </div>
          <textarea value={annMsg} onChange={e => setAnnMsg(e.target.value)} rows={2}
            style={{ width:'100%', resize:'vertical', background:'var(--bg-0)', border:'1px solid var(--border-default)',
              borderRadius:'var(--radius-md)', padding:'11px 13px', color:'var(--fg-0)', font:'var(--text-body)', outline:'none' }} />
          <div style={{ display:'flex', justifyContent:'flex-end', marginTop:14 }}>
            <ABtn variant="primary" icon="check" onClick={() => toast('Announcement saved')}>Save banner</ABtn>
          </div>
        </ACard>

        {/* content guidelines */}
        <ACard>
          <h3 style={{ font:'600 18px/1.2 var(--font-display)', color:'var(--fg-0)', margin:'0 0 5px' }}>Content guidelines</h3>
          <p style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', margin:'0 0 14px' }}>Shown to creators on submission and linked in the footer.</p>
          {/* faux editor toolbar */}
          <div style={{ display:'flex', gap:2, padding:6, background:'var(--bg-0)', borderRadius:'var(--radius-md) var(--radius-md) 0 0',
            border:'1px solid var(--border-default)', borderBottom:'none' }}>
            {['text-b','text-italic','list-bullets','list-numbers','link'].map(ic => (
              <button key={ic} style={{ width:30, height:30, borderRadius:'var(--radius-sm)', border:'none', cursor:'pointer',
                background:'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <Icon name={ic} size={15} color="var(--fg-1)" />
              </button>
            ))}
          </div>
          <textarea value={guidelines} onChange={e => setGuidelines(e.target.value)} rows={8}
            style={{ width:'100%', resize:'vertical', background:'var(--bg-0)', border:'1px solid var(--border-default)',
              borderRadius:'0 0 var(--radius-md) var(--radius-md)', padding:'13px', color:'var(--fg-0)', font:'var(--text-body)',
              lineHeight:1.6, outline:'none' }} />
          <div style={{ display:'flex', justifyContent:'flex-end', marginTop:14 }}>
            <ABtn variant="primary" icon="check" onClick={() => toast('Guidelines updated')}>Save guidelines</ABtn>
          </div>
        </ACard>

        {/* language */}
        <ACard>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>
            <div>
              <h3 style={{ font:'600 18px/1.2 var(--font-display)', color:'var(--fg-0)', margin:'0 0 5px' }}>Default language</h3>
              <p style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', margin:0 }}>Localization is groundwork — only English is active today.</p>
            </div>
            <select value={lang} onChange={e => setLang(e.target.value)}
              style={{ background:'var(--bg-0)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-md)',
                padding:'10px 14px', color:'var(--fg-0)', font:'var(--text-body-sm)', cursor:'pointer', outline:'none' }}>
              {(window.AICDB_LANGS || ['EN']).map(l => <option key={l} value={l}>{l === 'EN' ? 'English (EN)' : l}</option>)}
            </select>
          </div>
        </ACard>

      </div>
    </div>
  );
}

Object.assign(window, { UsersPage, UserRow, AUserMenu, StatisticsPage, LineChart, BarChart, ChartCard,
  RangeToggle, LeaderList, SettingsPage, fmtJoin });
