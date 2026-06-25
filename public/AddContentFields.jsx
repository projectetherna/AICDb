// Dreamwall UI kit — Add Content form field primitives
// Shared inputs, tag inputs, file drop, crew editor, checkboxes, dividers.

const DREAMWALL_GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama',
  'Fantasy', 'Horror', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller',
  'Western', 'Biography', 'History', 'Sport', 'War', 'Family', 'Short',
  'Experimental', 'Avant-Garde', 'Art House', 'Surrealist', 'Absurdist',
  'Psychological', 'Supernatural', 'Cyberpunk', 'Dystopian', 'Neo-noir',
  'Found Footage', 'Mockumentary', 'AI-Generated', 'Generative Art',
  'Procedural', 'Algorithmic', 'Hybrid',
];

const AC_INPUT = {
  width:'100%', background:'var(--bg-0)', color:'var(--fg-0)',
  borderWidth:1, borderStyle:'solid', borderColor:'var(--border-subtle)',
  borderRadius:'var(--radius-md)', padding:'11px 14px', font:'var(--text-body)',
  outline:'none', transition:'border-color var(--dur-fast), box-shadow var(--dur-fast)',
};

// ---- labelled field wrapper ----
function Field({ label, hint, optional, children }) {
  return (
    <div style={{ marginBottom:18 }}>
      {label && (
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
          <span style={{ font:'600 13px/1 var(--font-body)', color:'var(--fg-0)' }}>{label}</span>
          {optional && <span className="overline" style={{ color:'var(--fg-3)' }}>Optional</span>}
        </div>
      )}
      {children}
      {hint && <div style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', marginTop:7 }}>{hint}</div>}
    </div>
  );
}

// ---- text input ----
function TextInput({ value, onChange, placeholder, type='text', mono }) {
  const [f, setF] = React.useState(false);
  return (
    <input type={type} value={value} placeholder={placeholder}
      onChange={e => onChange(e.target.value)} onFocus={() => setF(true)} onBlur={() => setF(false)}
      style={{ ...AC_INPUT, fontFamily: mono ? 'var(--font-mono)' : undefined,
        borderColor: f ? 'var(--border-accent)' : 'var(--border-subtle)', boxShadow: f ? 'var(--glow-coral)' : 'none' }} />
  );
}

function parseDurationValue(s) {
  const str = (s || '').trim().toLowerCase();
  let hours = 0;
  let minutes = 0;
  const hm = str.match(/(\d+)\s*h(?:\s*(\d+)\s*m)?/);
  if (hm) {
    hours = parseInt(hm[1], 10) || 0;
    minutes = hm[2] != null ? parseInt(hm[2], 10) || 0 : 0;
  } else {
    const mOnly = str.match(/(\d+)\s*m/);
    if (mOnly) minutes = parseInt(mOnly[1], 10) || 0;
  }
  hours = Math.min(5, Math.max(0, hours));
  minutes = Math.min(55, Math.max(0, Math.round(minutes / 5) * 5));
  if (minutes === 60) { hours = Math.min(5, hours + 1); minutes = 0; }
  return { hours, minutes };
}

function formatDurationValue(hours, minutes) {
  return `${hours}h${String(minutes).padStart(2, '0')}m`;
}

function DurationPicker({ value, onChange }) {
  const initial = parseDurationValue(value);
  const [hours, setHours] = React.useState(initial.hours);
  const [minutes, setMinutes] = React.useState(initial.minutes);
  const [focusH, setFocusH] = React.useState(false);
  const [focusM, setFocusM] = React.useState(false);

  React.useEffect(() => {
    const p = parseDurationValue(value);
    setHours(p.hours);
    setMinutes(p.minutes);
  }, [value]);

  const selectStyle = (focused) => ({
    padding:'10px 12px', background:'var(--bg-0)',
    border:'1px solid ' + (focused ? 'var(--border-accent)' : 'var(--border-subtle)'),
    borderRadius:'var(--radius-md)', color:'var(--fg-0)', font:'var(--text-body)', cursor:'pointer',
  });

  const onHoursChange = (h) => {
    setHours(h);
    onChange(formatDurationValue(h, minutes));
  };
  const onMinutesChange = (m) => {
    setMinutes(m);
    onChange(formatDurationValue(hours, m));
  };

  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <select value={hours} onChange={e => onHoursChange(parseInt(e.target.value, 10))}
        onFocus={() => setFocusH(true)} onBlur={() => setFocusH(false)} style={selectStyle(focusH)}>
        {[0, 1, 2, 3, 4, 5].map(h => <option key={h} value={h}>{h}</option>)}
      </select>
      <span style={{ font:'var(--text-body-sm)', color:'var(--fg-2)' }}>h</span>
      <select value={minutes} onChange={e => onMinutesChange(parseInt(e.target.value, 10))}
        onFocus={() => setFocusM(true)} onBlur={() => setFocusM(false)} style={selectStyle(focusM)}>
        {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      <span style={{ font:'var(--text-body-sm)', color:'var(--fg-2)' }}>m</span>
    </div>
  );
}

// ---- textarea ----
function TextArea({ value, onChange, placeholder, rows=4, mono }) {
  const [f, setF] = React.useState(false);
  return (
    <textarea value={value} placeholder={placeholder} rows={rows}
      onChange={e => onChange(e.target.value)} onFocus={() => setF(true)} onBlur={() => setF(false)}
      style={{ ...AC_INPUT, resize:'vertical', minHeight: rows*22, lineHeight:1.55,
        fontFamily: mono ? 'var(--font-mono)' : undefined, fontSize: mono ? 13 : undefined,
        borderColor: f ? 'var(--border-accent)' : 'var(--border-subtle)', boxShadow: f ? 'var(--glow-coral)' : 'none' }} />
  );
}

// ---- removable chip ----
function Chip({ label, onRemove }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'5px 6px 5px 11px', borderRadius:'var(--radius-pill)',
      background:'var(--bg-2)', border:'1px solid var(--border-default)', font:'600 12.5px/1 var(--font-body)', color:'var(--fg-0)' }}>
      {label}
      <span onClick={onRemove} style={{ cursor:'pointer', display:'flex', borderRadius:'50%', padding:1 }}
        onMouseEnter={e=>e.currentTarget.style.background='var(--bg-3)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
        <Icon name="x" size={12} color="var(--fg-2)" />
      </span>
    </span>
  );
}

// ---- searchable genre picker (predefined list, max 5) ----
function GenrePicker({ tags, onChange }) {
  const [search, setSearch] = React.useState('');
  const [focused, setFocused] = React.useState(false);
  const selected = tags || [];
  const q = search.trim().toLowerCase();
  const options = q.length >= 1
    ? DREAMWALL_GENRES.filter(g => g.toLowerCase().includes(q) && !selected.includes(g))
    : [];
  const showDrop = focused && q.length >= 1;

  const add = (genre) => {
    if (selected.length >= 5 || selected.includes(genre)) return;
    onChange([...selected, genre]);
    setSearch('');
  };
  const remove = (genre) => onChange(selected.filter(x => x !== genre));

  return (
    <div style={{ position:'relative' }}>
      <input type="text" value={search} placeholder="Search genres..."
        onChange={e => setSearch(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        style={{ ...AC_INPUT, width:'100%', boxSizing:'border-box',
          borderColor: focused ? 'var(--border-accent)' : 'var(--border-subtle)', boxShadow: focused ? 'var(--glow-coral)' : 'none' }} />
      {showDrop && options.length > 0 && (
        <div style={{ position:'absolute', top:'calc(100% + 4px)', left:0, right:0, zIndex:50,
          background:'var(--bg-1)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-md)',
          maxHeight:200, overflowY:'auto', boxShadow:'var(--shadow-2)' }}>
          {options.map(g => (
            <div key={g} onMouseDown={e => { e.preventDefault(); add(g); }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              style={{ padding:'10px 14px', cursor:'pointer', font:'var(--text-body)', color:'var(--fg-0)' }}>
              {g}
            </div>
          ))}
        </div>
      )}
      {selected.length > 0 && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:10 }}>
          {selected.map(t => <Chip key={t} label={t} onRemove={() => remove(t)} />)}
        </div>
      )}
    </div>
  );
}

// ---- tag input (type + Enter to add) ----
function TagInput({ tags, onChange, placeholder }) {
  const [val, setVal] = React.useState('');
  const [f, setF] = React.useState(false);
  const add = (t) => { t = t.trim().replace(/,$/, ''); if (t && !tags.includes(t)) onChange([...tags, t]); setVal(''); };
  const remove = (t) => onChange(tags.filter(x => x !== t));
  return (
    <div onClick={e => { const inp = e.currentTarget.querySelector('input'); inp && inp.focus(); }}
      style={{ ...AC_INPUT, display:'flex', flexWrap:'wrap', gap:8, alignItems:'center', padding:'8px 10px', cursor:'text',
        borderColor: f ? 'var(--border-accent)' : 'var(--border-subtle)', boxShadow: f ? 'var(--glow-coral)' : 'none' }}>
      {tags.map(t => <Chip key={t} label={t} onRemove={() => remove(t)} />)}
      <input value={val} placeholder={tags.length ? '' : placeholder} onChange={e => setVal(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(val); }
          else if (e.key === 'Backspace' && !val && tags.length) remove(tags[tags.length - 1]);
        }}
        onFocus={() => setF(true)} onBlur={() => { setF(false); add(val); }}
        style={{ flex:1, minWidth:90, background:'none', border:'none', outline:'none', color:'var(--fg-0)', font:'var(--text-body)' }} />
    </div>
  );
}

// ---- quick-add suggestion pills (for AI models) ----
function SuggestPills({ options, selected, onToggle }) {
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:10 }}>
      {options.map(o => {
        const on = selected.includes(o);
        return (
          <button key={o} onClick={() => onToggle(o)} style={{ display:'inline-flex', alignItems:'center', gap:6, cursor:'pointer',
            padding:'6px 11px', borderRadius:'var(--radius-pill)', font:'600 12px/1 var(--font-body)',
            background: on ? 'var(--teal-ghost)' : 'transparent', color: on ? 'var(--teal-bright)' : 'var(--fg-1)',
            border:'1px solid ' + (on ? 'rgba(78,205,196,0.4)' : 'var(--border-subtle)'), transition:'all var(--dur-fast)' }}>
            <Icon name={on ? 'check' : 'plus'} size={12} color={on ? 'var(--teal-bright)' : 'var(--fg-2)'} />{o}
          </button>
        );
      })}
    </div>
  );
}

// ---- image upload / drop zone ----
function FileDrop({ value, onChange, aspect='16/9', label, sub }) {
  const inputRef = React.useRef(null);
  const [hover, setHover] = React.useState(false);
  const pick = (file) => { if (!file) return; const r = new FileReader(); r.onload = () => onChange(r.result); r.readAsDataURL(file); };
  return (
    <div onClick={() => inputRef.current.click()}
      onDragOver={e => { e.preventDefault(); setHover(true); }} onDragLeave={() => setHover(false)}
      onDrop={e => { e.preventDefault(); setHover(false); pick(e.dataTransfer.files[0]); }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ position:'relative', aspectRatio:aspect, borderRadius:'var(--radius-lg)', cursor:'pointer', overflow:'hidden',
        borderWidth:1, borderStyle:'dashed', borderColor: hover ? 'var(--border-accent)' : 'var(--border-strong)',
        background: value ? 'var(--bg-inset)' : 'var(--bg-0)', transition:'border-color var(--dur-fast)',
        display:'flex', alignItems:'center', justifyContent:'center' }}>
      {value
        ? <img src={value} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
        : <div style={{ textAlign:'center', padding:18 }}>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:10 }}><Icon name="upload-simple" size={26} color={hover ? 'var(--coral-bright)' : 'var(--fg-2)'} /></div>
            <div style={{ font:'600 13px/1.3 var(--font-body)', color:'var(--fg-1)' }}>{label}</div>
            {sub && <div style={{ font:'var(--text-data-sm)', color:'var(--fg-3)', marginTop:6, letterSpacing:'0.04em' }}>{sub}</div>}
          </div>}
      {value && (
        <button onClick={e => { e.stopPropagation(); onChange(null); }}
          style={{ position:'absolute', top:9, right:9, display:'flex', padding:7, borderRadius:'50%', cursor:'pointer',
            background:'rgba(10,10,10,0.62)', border:'1px solid var(--border-default)', backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)' }}>
          <Icon name="x" size={14} color="#fff" /></button>
      )}
      <input ref={inputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e => pick(e.target.files[0])} />
    </div>
  );
}

// ---- checkbox row ----
function CheckRow({ checked, onChange, children }) {
  return (
    <div onClick={() => onChange(!checked)}
      style={{ display:'flex', alignItems:'flex-start', gap:13, cursor:'pointer', padding:'9px 0' }}>
      <span style={{ width:22, height:22, flex:'none', borderRadius:'var(--radius-sm)', marginTop:1,
        borderWidth:1, borderStyle:'solid', borderColor: checked ? 'transparent' : 'var(--border-strong)',
        background: checked ? 'var(--coral)' : 'var(--bg-0)', display:'flex', alignItems:'center', justifyContent:'center',
        transition:'all var(--dur-fast)' }}>
        {checked && <Icon name="check" size={14} color="var(--fg-on-accent)" weight="bold" />}
      </span>
      <span style={{ font:'var(--text-body)', color:'var(--fg-1)' }}>{children}</span>
    </div>
  );
}

// ---- thin section divider ----
function Divider({ space=26 }) {
  return <div style={{ height:1, background:'var(--border-subtle)', margin:`${space}px 0` }} />;
}

// ---- section heading inside a step ----
function SectionTitle({ children, icon, hint }) {
  return (
    <div style={{ marginBottom:18 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        {icon && <Icon name={icon} size={16} color="var(--coral)" />}
        <h3 style={{ font:'600 15px/1 var(--font-body)', color:'var(--fg-0)', letterSpacing:'0.04em', textTransform:'uppercase' }}>{children}</h3>
      </div>
      {hint && <p style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', margin:'8px 0 0' }}>{hint}</p>}
    </div>
  );
}

// ---- content-type selector cards (Film / Series / Short) ----
function TypeCard({ active, onClick, icon, label, sub }) {
  const [h, setH] = React.useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ flex:1, textAlign:'left', cursor:'pointer', padding:'17px 17px', borderRadius:'var(--radius-lg)',
        background: active ? 'var(--coral-ghost)' : (h ? 'var(--bg-2)' : 'var(--bg-0)'),
        borderWidth:1, borderStyle:'solid', borderColor: active ? 'var(--border-accent)' : 'var(--border-subtle)',
        transition:'border-color var(--dur-fast)' }}>
      <Icon name={icon} size={24} color={active ? 'var(--coral)' : 'var(--fg-1)'} />
      <div style={{ font:'600 15px/1 var(--font-body)', color:'var(--fg-0)', marginTop:13 }}>{label}</div>
      <div style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', marginTop:5 }}>{sub}</div>
    </button>
  );
}

function TypeSelector({ value, onChange }) {
  return (
    <div style={{ display:'flex', gap:12 }}>
      <TypeCard active={value==='movie'}  onClick={() => onChange('movie')}  icon="film"        label="Film"   sub="Feature or standalone" />
      <TypeCard active={value==='series'} onClick={() => onChange('series')} icon="tv"          label="Series" sub="Seasons & episodes" />
      <TypeCard active={value==='short'}  onClick={() => onChange('short')}  icon="clapperboard" label="Short"  sub="Under ~40 minutes" />
    </div>
  );
}

// ---- repeatable crew / credit rows ----
function CrewEditor({ rows, onChange }) {
  const update = (i, k, v) => onChange(rows.map((r, j) => j === i ? { ...r, [k]: v } : r));
  const add = () => onChange([...rows, { role:'', name:'' }]);
  const remove = (i) => onChange(rows.filter((_, j) => j !== i));
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display:'flex', gap:10, alignItems:'center' }}>
          <div style={{ width:180, flex:'none' }}><TextInput value={r.role} onChange={v => update(i,'role',v)} placeholder="Role (e.g. Director)" /></div>
          <div style={{ flex:1, minWidth:0 }}><TextInput value={r.name} onChange={v => update(i,'name',v)} placeholder="Name or @handle" /></div>
          <button onClick={() => remove(i)} title="Remove"
            style={{ flex:'none', display:'flex', padding:11, borderRadius:'var(--radius-md)', cursor:'pointer',
              background:'transparent', borderWidth:1, borderStyle:'solid', borderColor:'var(--border-subtle)' }}
            onMouseEnter={e=>e.currentTarget.style.borderColor='var(--border-strong)'} onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border-subtle)'}>
            <Icon name="trash" size={15} color="var(--fg-2)" /></button>
        </div>
      ))}
      <button onClick={add} style={{ alignSelf:'flex-start', display:'inline-flex', alignItems:'center', gap:8, cursor:'pointer',
        padding:'10px 15px', borderRadius:'var(--radius-md)', background:'transparent',
        borderWidth:1, borderStyle:'dashed', borderColor:'var(--border-strong)', font:'600 13px/1 var(--font-body)', color:'var(--fg-1)' }}>
        <Icon name="plus" size={14} color="var(--fg-1)" /> Add credit
      </button>
    </div>
  );
}

// ---- per-episode embed rows (series) ----
function EpisodeEmbeds({ rows, onChange }) {
  const update = (i, k, v) => onChange(rows.map((r, j) => j === i ? { ...r, [k]: v } : r));
  const add = () => onChange([...rows, { ep:'Episode ' + (rows.length + 1), embed:'' }]);
  const remove = (i) => onChange(rows.filter((_, j) => j !== i));
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      {rows.map((r, i) => (
        <div key={i} style={{ padding:'14px 16px', background:'var(--bg-0)', borderRadius:'var(--radius-md)',
          borderWidth:1, borderStyle:'solid', borderColor:'var(--border-subtle)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
            <Icon name="play" size={14} color="var(--fg-2)" />
            <input value={r.ep} onChange={e => update(i,'ep',e.target.value)}
              style={{ flex:1, background:'none', border:'none', outline:'none', color:'var(--fg-0)', font:'600 14px/1 var(--font-body)' }} />
            <button onClick={() => remove(i)} title="Remove episode" style={{ display:'flex', padding:4, background:'none', border:'none', cursor:'pointer' }}>
              <Icon name="trash" size={14} color="var(--fg-2)" /></button>
          </div>
          <TextArea value={r.embed} onChange={v => update(i,'embed',v)} rows={2} mono placeholder='<iframe src="…"></iframe>' />
        </div>
      ))}
      <button onClick={add} style={{ alignSelf:'flex-start', display:'inline-flex', alignItems:'center', gap:8, cursor:'pointer',
        padding:'10px 15px', borderRadius:'var(--radius-md)', background:'transparent',
        borderWidth:1, borderStyle:'dashed', borderColor:'var(--border-strong)', font:'600 13px/1 var(--font-body)', color:'var(--fg-1)' }}>
        <Icon name="plus" size={14} color="var(--fg-1)" /> Add episode
      </button>
    </div>
  );
}

// ---- the user's previously-added series (for "add episode to existing series") ----
// Empty by default — the user hasn't added any series yet.
const AC_MY_SERIES = [];

// ---- Series submission mode: brand-new series vs. add an episode to an existing one ----
function SeriesModeCard({ active, onClick, icon, label, sub }) {
  const [h, setH] = React.useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ flex:1, textAlign:'left', cursor:'pointer', padding:'16px 16px', borderRadius:'var(--radius-lg)', position:'relative',
        background: active ? 'var(--coral-ghost)' : (h ? 'var(--bg-2)' : 'var(--bg-0)'),
        borderWidth:1, borderStyle:'solid', borderColor: active ? 'var(--border-accent)' : 'var(--border-subtle)',
        transition:'border-color var(--dur-fast)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:11 }}>
        <span style={{ width:36, height:36, flex:'none', borderRadius:'var(--radius-md)', display:'flex', alignItems:'center', justifyContent:'center',
          background: active ? 'var(--coral)' : 'var(--bg-2)' }}>
          <Icon name={icon} size={19} color={active ? 'var(--fg-on-accent)' : 'var(--fg-1)'} />
        </span>
        <div style={{ minWidth:0 }}>
          <div style={{ font:'600 14.5px/1.2 var(--font-body)', color:'var(--fg-0)' }}>{label}</div>
          <div style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', marginTop:4 }}>{sub}</div>
        </div>
      </div>
      <span style={{ position:'absolute', top:14, right:14, width:18, height:18, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
        borderWidth:1, borderStyle:'solid', borderColor: active ? 'transparent' : 'var(--border-strong)',
        background: active ? 'var(--coral)' : 'transparent' }}>
        {active && <Icon name="check" size={11} color="var(--fg-on-accent)" weight="bold" />}
      </span>
    </button>
  );
}

// ---- Series submission mode: brand-new series vs. add an episode to an existing one.
// Appears directly below the Content Type selector, only when "Series" is chosen. ----
function SeriesModeSelector({ value, onChange }) {
  return (
    <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
      <SeriesModeCard active={value==='new'} onClick={() => onChange('new')}
        icon="plus-circle" label="New series"
        sub="Add a brand-new series from scratch." />
      <SeriesModeCard active={value==='episode'} onClick={() => onChange('episode')}
        icon="television-simple" label="Add episode to existing series"
        sub="Pick one of your series and add just the new episode." />
    </div>
  );
}

// ---- searchable dropdown to pick one of the user's existing series ----
function SeriesPosterChip({ series, size=34 }) {
  return (
    <span style={{ width:size, height:Math.round(size*1.34), flex:'none', borderRadius:'var(--radius-sm)', overflow:'hidden',
      background:`linear-gradient(150deg, ${series.g[0]}, ${series.g[1]} 150%)`, boxShadow:'var(--shadow-1)' }} />
  );
}

function SeriesPicker({ value, options, onChange }) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState('');
  const searchRef = React.useRef(null);
  const sel = options.find(o => o.id === value);
  React.useEffect(() => { if (open && searchRef.current) searchRef.current.focus(); }, [open]);
  const filtered = options.filter(o => o.name.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div style={{ position:'relative' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ ...AC_INPUT, display:'flex', alignItems:'center', gap:12, cursor:'pointer', textAlign:'left', padding:'9px 12px',
          borderColor: open ? 'var(--border-accent)' : 'var(--border-subtle)', boxShadow: open ? 'var(--glow-coral)' : 'none' }}>
        {sel ? (
          <>
            <SeriesPosterChip series={sel} size={30} />
            <span style={{ flex:1, minWidth:0 }}>
              <span style={{ display:'block', font:'600 14px/1.2 var(--font-body)', color:'var(--fg-0)' }}>{sel.name}</span>
              <span style={{ display:'block', font:'var(--text-data-sm)', color:'var(--fg-2)', marginTop:2 }}>{sel.seasons} {sel.seasons===1?'season':'seasons'} · {sel.episodes} episodes</span>
            </span>
          </>
        ) : (
          <span style={{ flex:1, color:'var(--fg-3)', font:'var(--text-body)' }}>Search your series…</span>
        )}
        <Icon name="caret-down" size={15} color="var(--fg-2)" />
      </button>
      {open && (
        <>
          <div onClick={() => { setOpen(false); setQ(''); }} style={{ position:'fixed', inset:0, zIndex:30 }} />
          <div style={{ position:'absolute', top:'calc(100% + 6px)', left:0, right:0, zIndex:31, padding:6,
            background:'var(--bg-2)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-md)',
            boxShadow:'var(--shadow-3)' }}>
            {/* search box */}
            <div style={{ position:'relative', marginBottom:6 }}>
              <span style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', display:'flex' }}>
                <Icon name="magnifying-glass" size={15} color="var(--fg-3)" />
              </span>
              <input ref={searchRef} value={q} onChange={e => setQ(e.target.value)} placeholder="Search your series…"
                style={{ width:'100%', font:'var(--text-body)', color:'var(--fg-0)', background:'var(--bg-0)',
                  border:'1px solid var(--border-default)', borderRadius:'var(--radius-sm)', padding:'9px 12px 9px 34px', outline:'none' }} />
            </div>
            <div style={{ maxHeight:248, overflowY:'auto' }}>
              {filtered.length ? filtered.map(o => {
                const on = o.id === value;
                return (
                  <button key={o.id} onClick={() => { onChange(o.id); setOpen(false); setQ(''); }}
                    style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'9px 10px', cursor:'pointer', textAlign:'left',
                      borderRadius:'var(--radius-sm)', border:'none', background: on ? 'var(--coral-ghost)' : 'transparent', transition:'background var(--dur-fast)' }}
                    onMouseEnter={e => { if (!on) e.currentTarget.style.background = 'var(--bg-3)'; }}
                    onMouseLeave={e => { if (!on) e.currentTarget.style.background = 'transparent'; }}>
                    <SeriesPosterChip series={o} size={30} />
                    <span style={{ flex:1, minWidth:0 }}>
                      <span style={{ display:'block', font:'600 14px/1.2 var(--font-body)', color:'var(--fg-0)' }}>{o.name}</span>
                      <span style={{ display:'block', font:'var(--text-data-sm)', color:'var(--fg-2)', marginTop:2 }}>{o.seasons} {o.seasons===1?'season':'seasons'} · {o.episodes} episodes</span>
                    </span>
                    {on && <Icon name="check" size={15} color="var(--coral)" weight="bold" />}
                  </button>
                );
              }) : (
                <div style={{ padding:'18px 10px', textAlign:'center', font:'var(--text-body-sm)', color:'var(--fg-3)' }}>
                  No series match “{q}”.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ---- read-only summary of the info inherited from the chosen series ----
function InheritedSummary({ series }) {
  return (
    <div style={{ display:'flex', gap:16, padding:'16px', background:'var(--bg-0)', borderRadius:'var(--radius-lg)',
      borderWidth:1, borderStyle:'solid', borderColor:'var(--border-subtle)' }}>
      <SeriesPosterChip series={series} size={64} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9, flexWrap:'wrap' }}>
          <span style={{ font:'600 16px/1.2 var(--font-display)', color:'var(--fg-0)' }}>{series.name}</span>
          <span style={{ display:'inline-flex', alignItems:'center', gap:5, font:'600 9px/1 var(--font-body)', letterSpacing:'0.05em',
            textTransform:'uppercase', color:'var(--teal-bright)', background:'var(--teal-ghost)', padding:'4px 8px', borderRadius:'var(--radius-pill)' }}>
            <Icon name="check" size={10} color="var(--teal-bright)" weight="bold" /> Inherited
          </span>
        </div>
        <p style={{ font:'var(--text-body-sm)', color:'var(--fg-1)', margin:'8px 0 10px',
          display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{series.description}</p>
        <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
          {series.genres.map(g => (
            <span key={g} style={{ font:'600 11px/1 var(--font-body)', color:'var(--fg-1)', background:'var(--bg-2)',
              border:'1px solid var(--border-subtle)', padding:'5px 9px', borderRadius:'var(--radius-pill)' }}>{g}</span>
          ))}
        </div>
        <div style={{ font:'var(--text-data-sm)', color:'var(--fg-3)', marginTop:11 }}>
          Series name, description, poster &amp; genre carry over automatically — no need to re-enter.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  AC_INPUT, Field, TextInput, TextArea, DurationPicker, Chip, TagInput, GenrePicker, SuggestPills,
  FileDrop, CheckRow, Divider, SectionTitle, TypeCard, TypeSelector, CrewEditor, EpisodeEmbeds,
  AC_MY_SERIES, SeriesModeSelector, SeriesPicker, InheritedSummary, SeriesPosterChip,
});
