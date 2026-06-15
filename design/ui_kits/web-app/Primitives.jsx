// Dreamwall UI kit — shared primitives
// Icon: Phosphor icon font (loaded in index.html). name maps to a Phosphor glyph.
// weight: 'fill' | 'bold' | 'regular' | 'duotone'. Passing fill=true forces fill weight.
const PH = {
  star:'star', bookmark:'bookmark-simple', play:'play', search:'magnifying-glass',
  sparkles:'sparkle', film:'film-slate', tv:'television-simple', smartphone:'device-mobile',
  clapperboard:'film-slate', 'message-square':'chat-centered-text', 'share-2':'share-network',
  list:'list-bullets', plus:'plus', 'chevron-left':'caret-left', check:'check', clock:'clock',
  heart:'heart', eye:'eye', fire:'fire', trophy:'trophy', mail:'envelope-simple', x:'x',
};

function Icon({ name, size = 20, color = 'currentColor', weight = 'bold', fill, style }) {
  const w = (fill && fill !== 'none') ? 'fill' : weight;
  return (
    <i className={`ph-${w} ph-${PH[name] || name}`}
      style={{ fontSize: size, lineHeight: 1, color, display:'block', flex:'none', ...style }} />
  );
}

function Logo({ size = 22, onClick }) {
  return (
    <div onClick={onClick} style={{ display:'flex', alignItems:'center', gap: size*0.5, cursor: onClick ? 'pointer' : 'default' }}>
      <img src={(window.__resources && window.__resources.aicdbMark) || "../../assets/aicdb-mark.png"} width={size*1.55} height={size*1.55}
        style={{ display:'block', filter:'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }} alt="" />
      <span style={{ font:`800 ${size}px/0.9 var(--font-display)`, letterSpacing:'-0.02em', color:'var(--fg-0)' }}>
        Dream<span style={{ color:'var(--coral)' }}>wall</span>
      </span>
    </div>
  );
}

function Button({ variant = 'primary', size = 'md', icon, children, onClick, active }) {
  const pad = size === 'sm' ? '7px 13px' : size === 'lg' ? '13px 22px' : '11px 18px';
  const fs = size === 'sm' ? 13 : size === 'lg' ? 15 : 14;
  const base = {
    font:`600 ${fs}px/1 var(--font-body)`, borderRadius:'var(--radius-md)', padding: pad,
    border:'1px solid transparent', cursor:'pointer', display:'inline-flex', alignItems:'center',
    gap:8, transition:'all var(--dur-fast) var(--ease-out)', whiteSpace:'nowrap',
  };
  const variants = {
    primary:   { background:'var(--coral)', color:'var(--fg-on-accent)' },
    teal:      { background: active ? 'var(--teal)' : 'var(--teal-ghost)', color: active ? '#04201e' : 'var(--teal-bright)', border: active ? '1px solid transparent' : '1px solid rgba(78,205,196,0.4)' },
    secondary: { background:'transparent', color:'var(--fg-0)', borderColor:'var(--border-strong)' },
    ghost:     { background:'transparent', color:'var(--fg-1)' },
  };
  const [hover, setHover] = React.useState(false);
  const hoverStyle = hover ? (
    variant === 'primary' ? { background:'var(--coral-bright)' } :
    variant === 'secondary' ? { background:'var(--bg-2)', borderColor:'var(--border-strong)' } :
    variant === 'ghost' ? { color:'var(--fg-0)' } : {}
  ) : {};
  return (
    <button onClick={onClick} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{ ...base, ...variants[variant], ...hoverStyle }}>
      {icon && <Icon name={icon} size={fs+2} fill={variant==='primary' && icon==='star' ? 'currentColor' : 'none'} />}
      {children}
    </button>
  );
}

function ContentBadge({ type, solid = false, size = 'md' }) {
  const t = window.AICDB_TYPES[type];
  if (!t) return null;
  const fs = size === 'sm' ? 10 : 12;
  const pad = size === 'sm' ? '3px 8px' : '6px 12px';
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:pad, borderRadius:'var(--radius-pill)',
      font:`600 ${fs}px/1 var(--font-body)`, letterSpacing:'0.04em',
      background: solid ? t.color : t.ghost, color: solid ? (type==='movie'?'#1a0d08':type==='series'?'#04201e':type==='short'?'#2a1f00':'#160a3a') : t.text }}>
      {!solid && <span style={{ width:7, height:7, borderRadius:'50%', background:t.color }} />}
      {t.label.toUpperCase()}
    </span>
  );
}

function StarRating({ value = 0, interactive = false, onChange, size = 18 }) {
  const [hover, setHover] = React.useState(null);
  const display = hover != null ? hover : value;
  return (
    <div style={{ display:'inline-flex', gap:3 }} onMouseLeave={()=>setHover(null)}>
      {[1,2,3,4,5].map(i => {
        const fillPct = Math.max(0, Math.min(1, display - (i-1))) * 100;
        return (
          <div key={i} style={{ position:'relative', cursor: interactive?'pointer':'default', width:size, height:size }}
            onMouseMove={interactive ? (e)=>{ const half = e.nativeEvent.offsetX < size/2; setHover(i-(half?0.5:0)); } : undefined}
            onClick={interactive ? ()=> onChange && onChange(hover) : undefined}>
            <div style={{ position:'absolute', inset:0, color:'var(--rating-track)' }}><Icon name="star" size={size} fill="currentColor" stroke={0} /></div>
            <div style={{ position:'absolute', inset:0, width:`${fillPct}%`, overflow:'hidden', color:'var(--coral)' }}><Icon name="star" size={size} fill="currentColor" stroke={0} /></div>
          </div>
        );
      })}
    </div>
  );
}

function scoreColor(s) { return s >= 8 ? 'var(--score-high)' : s >= 5 ? 'var(--score-mid)' : 'var(--score-low)'; }

// Score + rating count, e.g. "8.4 · 1.2k". countColor adapts to light/dark contexts.
function ScoreLine({ film, size = 22, countColor = 'var(--fg-2)', gap = 6 }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'baseline', gap }}>
      <span style={{ font:`700 ${size}px/1 var(--font-mono)`, color: scoreColor(film.score) }}>{film.score.toFixed(1)}</span>
      <span style={{ font:`500 ${Math.max(10, Math.round(size*0.5))}px/1 var(--font-mono)`, color: countColor }}>· {film.ratings}</span>
    </span>
  );
}

// Editorial / auto content ribbon: "Staff Pick" or "Hidden Gem".
function ContentRibbon({ film, size = 'md' }) {
  const kind = window.AICDB_RIBBON ? window.AICDB_RIBBON(film) : null;
  if (!kind) return null;
  const cfg = kind === 'staff'
    ? { label:'Staff Pick', icon:'medal', fg:'#1a0d08', bg:'var(--coral)' }
    : { label:'Hidden Gem', icon:'diamond', fg:'#04201e', bg:'var(--teal)' };
  const fs = size === 'sm' ? 10 : 11;
  const pad = size === 'sm' ? '4px 8px' : '5px 10px';
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:pad, borderRadius:'var(--radius-pill)',
      background:cfg.bg, color:cfg.fg, font:`700 ${fs}px/1 var(--font-body)`, letterSpacing:'0.02em',
      boxShadow:'0 2px 8px rgba(0,0,0,0.4)', whiteSpace:'nowrap' }}>
      <Icon name={cfg.icon} size={fs+2} color={cfg.fg} weight="fill" />{cfg.label}
    </span>
  );
}

// Compact count label: 1.2k / 3.4M
function fmtCount(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(Math.round(n));
}

// Compact duration label for poster hover: 45m / 1h30m / S (series).
function formatDuration(film) {
  if (film.type === 'series') return 'S';
  const m = parseInt(String(film.runtime).replace(/[^0-9]/g, ''), 10);
  if (!m) return '—';
  if (m < 60) return m + 'm';
  const h = Math.floor(m / 60), rem = m % 60;
  return rem ? `${h}h${rem}m` : `${h}h`;
}

// Subscribe to the shared watchlist store.
function useWatchlist() {
  const [ids, setIds] = React.useState(window.AICDB_WATCHLIST.get());
  React.useEffect(() => window.AICDB_WATCHLIST.subscribe(setIds), []);
  return ids;
}

// Subscribe to the shared creator-accounts store.
function useCreatorAccounts() {
  const [list, setList] = React.useState(window.AICDB_CREATOR_ACCOUNTS.get());
  React.useEffect(() => window.AICDB_CREATOR_ACCOUNTS.subscribe(setList), []);
  return list;
}

function ScoreRing({ score = 0, size = 78 }) {
  const pct = (score/10)*100;
  const col = score >= 8 ? '#4ecdc4' : score >= 5 ? '#e5b23b' : '#e5484d';
  return (
    <div style={{ width:size, height:size, borderRadius:'50%',
      background:`conic-gradient(${col} 0 ${pct}%, var(--rating-track) ${pct}% 100%)`,
      display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:size-16, height:size-16, borderRadius:'50%', background:'var(--bg-0)',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <span style={{ font:`700 ${size*0.3}px/1 var(--font-mono)`, color:'var(--fg-0)' }}>{score.toFixed(1)}</span>
        <span style={{ font:`500 ${size*0.115}px/1 var(--font-mono)`, color:'var(--fg-2)', letterSpacing:'0.05em', marginTop:2 }}>SCORE</span>
      </div>
    </div>
  );
}

function Avatar({ colors = ['#d85a30','#4ecdc4'], size = 30 }) {
  return <div style={{ width:size, height:size, borderRadius:'50%', flex:'none',
    background:`linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }} />;
}

Object.assign(window, { Icon, Logo, Button, ContentBadge, StarRating, ScoreRing, Avatar, scoreColor, ScoreLine, ContentRibbon, formatDuration, useWatchlist, useCreatorAccounts, fmtCount });
