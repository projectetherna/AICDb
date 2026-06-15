// Dreamwall UI kit — top navigation bar
// Live search dropdown (poster + title + year + type) and a profile menu.
function SearchResult({ film, onOpen }) {
  const [hover, setHover] = React.useState(false);
  const t = window.AICDB_TYPES[film.type];
  return (
    <div onMouseDown={(e) => { e.preventDefault(); onOpen(film); }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display:'flex', alignItems:'center', gap:12, padding:'8px 12px', cursor:'pointer',
        background: hover ? 'var(--bg-2)' : 'transparent', borderRadius:'var(--radius-md)',
        transition:'background var(--dur-fast)' }}>
      <div style={{ width:36, height:52, flex:'none', borderRadius:6, overflow:'hidden',
        background:`linear-gradient(150deg, ${film.g[0]}, ${film.g[1]} 150%)`, boxShadow:'var(--shadow-1)' }} />
      <div style={{ minWidth:0, flex:1 }}>
        <div style={{ font:'600 13.5px/1.2 var(--font-body)', color:'var(--fg-0)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{film.title}</div>
        <div style={{ font:'var(--text-data-sm)', color:'var(--fg-2)', marginTop:3 }}>{film.year}</div>
      </div>
      <span style={{ flex:'none', font:'600 10px/1 var(--font-body)', letterSpacing:'0.04em', textTransform:'uppercase',
        color:t.text, background:t.ghost, padding:'4px 8px', borderRadius:'var(--radius-pill)' }}>{t.label}</span>
    </div>
  );
}

function ProfileMenu({ onNav, isCreator = true, isAdmin = true }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  const items = [
    { icon:'user',     label:'Profile',     action:() => { window.location.href = 'Dreamwall%20Profile.html'; } },
    { icon:'film-slate', label:'My Contents', action:() => { window.location.href = 'Dreamwall%20My%20Contents.html?manage=1'; } },
    { icon:'plus-circle', label:'Add Creator Account', action:() => { window.location.href = 'Dreamwall%20Add%20Creator%20Account.html'; } },
    { icon:'chat-text', label:'My Reviews',  action:() => onNav && onNav('My Reviews') },
    { icon:'gear',     label:'Preferences', action:() => onNav && onNav('Preferences') },
    { icon:'sign-out', label:'Log Out',     action:() => {}, danger:true },
    isAdmin && { iconNode:<ShieldNoldor size={16} />, label:'Admin Panel', action:() => { window.location.href = 'Dreamwall%20Admin%20Panel.html'; } },
  ].filter(Boolean);
  return (
    <div ref={ref} style={{ position:'relative', flex:'none' }}>
      <div onClick={() => setOpen(o => !o)} style={{ cursor:'pointer', display:'flex', borderRadius:'50%',
        outline: open ? '2px solid var(--coral)' : '2px solid transparent', outlineOffset:2,
        transition:'outline-color var(--dur-fast)' }}>
        <Avatar size={30} colors={['#d85a30','#9d8df1']} />
      </div>
      {open && (
        <div style={{ position:'absolute', top:44, right:0, width:188, padding:6, zIndex:80,
          background:'var(--bg-1)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-lg)',
          boxShadow:'var(--shadow-3)' }}>
          <div style={{ padding:'8px 10px 10px', borderBottom:'1px solid var(--border-subtle)', marginBottom:4 }}>
            <div style={{ font:'600 14px/1.2 var(--font-body)', color:'var(--fg-0)' }}>Ada Vance</div>
            <div style={{ font:'var(--text-data-sm)', color:'var(--fg-2)', marginTop:3 }}>@adavance</div>
          </div>
          {items.map(it => (
            <MenuRow key={it.label} icon={it.icon} iconNode={it.iconNode} danger={it.danger} admin={it.admin}
              onClick={() => { setOpen(false); it.action(); }}>{it.label}</MenuRow>
          ))}
        </div>
      )}
    </div>
  );
}

// subtle shield carrying a Noldor (eight-pointed) star — understated, blends with text
function ShieldNoldor({ size = 16, color = 'var(--fg-1)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ display:'block', flex:'none' }}>
      <path d="M12 2.6 L19.2 5.2 V11 C19.2 15.6 16 18.9 12 20.4 C8 18.9 4.8 15.6 4.8 11 V5.2 Z"
        stroke={color} strokeWidth="1.3" fill="none" strokeLinejoin="round" />
      <polygon points="12,7.2 12.55,9.25 14.55,8.3 13.45,10.2 15.6,10.8 13.45,11.4 14.55,13.3 12.55,12.35 12,14.4 11.45,12.35 9.45,13.3 10.55,11.4 8.4,10.8 10.55,10.2 9.45,8.3 11.45,9.25"
        fill={color} />
    </svg>
  );
}

function MenuRow({ icon, iconNode, children, onClick, danger, admin }) {
  const [hover, setHover] = React.useState(false);
  const color = danger ? 'var(--score-low)' : admin ? 'var(--coral-bright)' : 'var(--fg-0)';
  const iconColor = danger ? 'var(--score-low)' : admin ? 'var(--coral-bright)' : 'var(--fg-1)';
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display:'flex', alignItems:'center', gap:11, padding:'9px 10px', cursor:'pointer',
        borderRadius:'var(--radius-md)', background: hover ? 'var(--bg-2)' : 'transparent',
        font:'500 13.5px/1 var(--font-body)', color,
        borderTop: admin ? '1px solid var(--border-subtle)' : 'none',
        marginTop: admin ? 4 : 0, paddingTop: admin ? 13 : 9,
        transition:'background var(--dur-fast)' }}>
      {iconNode ? iconNode : <Icon name={icon} size={16} color={iconColor} weight={admin ? 'fill' : 'regular'} />}
      {children}
      {admin && <Icon name="arrow-up-right" size={13} color="var(--fg-3)" />}
    </div>
  );
}

function NavLink({ label, display, icon, bold, active, onNav }) {
  const [hover, setHover] = React.useState(false);
  const text = display || label;
  const isPeople = label === 'Feed';
  const isSecondary = label === 'What is Dreamwall';
  const accent = isPeople ? 'var(--teal-bright)' : 'var(--coral)';
  // resting color: People leans teal, secondary stays muted grey, others neutral
  const restColor = isPeople ? 'var(--teal-bright)' : isSecondary ? 'var(--fg-2)' : 'var(--fg-1)';
  const color = active ? 'var(--fg-0)' : (hover ? 'var(--fg-0)' : restColor);
  const weight = bold ? 600 : 500;
  const iconColor = active ? 'var(--fg-0)' : (hover ? 'var(--fg-0)' : (isPeople ? 'var(--teal-bright)' : 'var(--fg-1)'));
  return (
    <a onClick={() => onNav && onNav(label)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ cursor:'pointer', position:'relative', display:'inline-flex', alignItems:'center', gap:7,
        font: isSecondary ? '500 13.5px/1 var(--font-body)' : `${weight} 14px/1 var(--font-body)`,
        color, paddingBottom:5,
        borderBottom: active ? `2px solid ${accent}` : '2px solid transparent',
        transition:'color var(--dur-fast)' }}>
      {icon && (
        <Icon name={icon} size={16} color={iconColor} weight={isPeople ? 'fill' : 'regular'} />
      )}
      {text}
    </a>
  );
}

function NavBar({ active = 'Feed', onNav, query, onQuery, onOpenResult, isCreator = true, isAdmin = true }) {
  const primaryLinks = ['Discover', 'Films', 'Series', 'Creators'];
  const [focused, setFocused] = React.useState(false);
  const q = (query || '').trim().toLowerCase();
  const results = q ? window.AICDB_FILMS.filter(f =>
    f.title.toLowerCase().includes(q) ||
    f.creator.toLowerCase().includes(q) ||
    f.genres.join(' ').toLowerCase().includes(q)
  ).slice(0, 6) : [];
  const showDrop = focused && q.length > 0;
  const suggestion = (!results.length && q.length >= 2 && window.aicdbSuggest) ? window.aicdbSuggest(query) : null;
  const runSearch = (term) => { onQuery && onQuery(term); };

  return (
    <nav className="aicdb-nav" style={{ position:'sticky', top:0, zIndex:50, display:'flex', alignItems:'center', gap:28,
      padding:'14px 28px', background:'var(--bg-glass)', backdropFilter:'blur(14px)',
      WebkitBackdropFilter:'blur(14px)', borderBottom:'1px solid var(--border-subtle)' }}>
      <Logo size={20} onClick={()=> onNav && onNav('Discover')} />
      <div className="aicdb-nav-primary" style={{ display:'flex', alignItems:'center', gap:22 }}>
        {primaryLinks.map(l => <NavLink key={l} label={l} active={active===l} onNav={onNav} />)}
        {/* secondary, muted, extra spaced + divider */}
        <span className="aicdb-nav-sec" style={{ width:1, height:16, background:'var(--border-default)', margin:'0 4px' }} />
        <span className="aicdb-nav-sec"><NavLink label="What is Dreamwall" active={active==='What is Dreamwall'} onNav={onNav} /></span>
      </div>
      <div className="aicdb-nav-spacer" style={{ flex:1 }} />
      <div className="aicdb-nav-search" style={{ position:'relative', width:240 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--bg-2)',
          border:'1px solid ' + (focused ? 'var(--border-accent)' : 'var(--border-subtle)'),
          borderRadius: showDrop ? '18px 18px 0 0' : 'var(--radius-pill)', padding:'7px 14px',
          transition:'border-color var(--dur-fast)' }}>
          <Icon name="search" size={16} color="var(--fg-2)" />
          <input value={query||''} onChange={e=>{ setFocused(true); onQuery && onQuery(e.target.value); }}
            onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
            placeholder="Search titles, creators…"
            style={{ background:'none', border:'none', outline:'none', color:'var(--fg-0)',
              font:'var(--text-body-sm)', width:'100%' }} />
        </div>
        {showDrop && (
          <div style={{ position:'absolute', top:'100%', left:0, right:0, zIndex:60, padding:6,
            background:'var(--bg-1)', border:'1px solid var(--border-accent)', borderTop:'none',
            borderRadius:'0 0 var(--radius-lg) var(--radius-lg)', boxShadow:'var(--shadow-3)',
            maxHeight:380, overflowY:'auto' }}>
            {results.length ? results.map(f => (
              <SearchResult key={f.id} film={f} onOpen={(film)=>{ onOpenResult && onOpenResult(film); }} />
            )) : (
              <div style={{ padding:'20px 14px 14px', textAlign:'center' }}>
                <Icon name="magnifying-glass" size={22} color="var(--fg-3)" />
                <div style={{ font:'600 14px/1.3 var(--font-body)', color:'var(--fg-0)', marginTop:10 }}>No titles match “{query}”</div>
                {suggestion ? (
                  <div onMouseDown={(e)=>{ e.preventDefault(); runSearch(suggestion); }}
                    style={{ display:'inline-flex', alignItems:'center', gap:6, marginTop:12, padding:'9px 14px', cursor:'pointer',
                      borderRadius:'var(--radius-pill)', background:'var(--teal-ghost)', border:'1px solid rgba(78,205,196,0.4)',
                      font:'600 13px/1 var(--font-body)', color:'var(--teal-bright)' }}>
                    Did you mean <span style={{ textDecoration:'underline' }}>{suggestion}</span>?
                  </div>
                ) : (
                  <div style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', marginTop:6 }}>Try a different title, creator, or genre.</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="aicdb-nav-right" style={{ display:'flex', alignItems:'center', gap:22 }}>
        <NavLink label="Feed" display="People" icon="users" bold active={active==='Feed'} onNav={onNav} />
        <NavLink label="Watchlist" display="My Watchlist" icon="bookmark" active={active==='Watchlist'} onNav={onNav} />
        <ProfileMenu onNav={onNav} isCreator={isCreator} isAdmin={isAdmin} />
      </div>
    </nav>
  );
}
Object.assign(window, { NavBar, NavLink, ProfileMenu, SearchResult });