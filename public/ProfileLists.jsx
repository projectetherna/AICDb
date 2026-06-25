// Dreamwall — profile created lists UI

// the "Created lists" box — opens a management modal (view / edit / delete / new)
function CreatedListsBox({ onOpenList, isOwnProfile = true, viewedUserId }) {
  const [hover, setHover] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const ownLists = useLists();
  const [viewedLists, setViewedLists] = React.useState([]);

  React.useEffect(() => {
    if (!isOwnProfile && viewedUserId) return;
    window.AICDB_LISTS.load();
  }, [isOwnProfile, viewedUserId]);

  React.useEffect(() => {
    if (isOwnProfile || !viewedUserId) return;
    let cancelled = false;
    (async () => {
      try {
        const sb = await window.AICDB_AUTH.getClient();
        const { data, error } = await sb
          .from('lists')
          .select('*, list_items(count)')
          .eq('user_id', viewedUserId)
          .eq('is_system', false)
          .eq('visibility', 'public')
          .order('created_at', { ascending: false });
        if (cancelled) return;
        if (error) { setViewedLists([]); return; }
        setViewedLists((data || []).map(row => {
          const count = row.list_items?.[0]?.count ?? 0;
          const { list_items, ...rest } = row;
          return { ...rest, count, title: rest.name };
        }));
      } catch (e) {
        if (!cancelled) setViewedLists([]);
      }
    })();
    return () => { cancelled = true; };
  }, [isOwnProfile, viewedUserId]);

  const lists = isOwnProfile ? ownLists : viewedLists;

  const onDelete = (id) => window.AICDB_LISTS.remove(id);
  const onRename = (id, title) => window.AICDB_LISTS.rename(id, title);
  const onNew = (title) => window.AICDB_LISTS.create(title);
  const handleOpenList = (listId) => { setOpen(false); onOpenList && onOpenList(listId); };

  const boxStyle = { position:'relative', padding:'14px 16px', height:'100%', background: hover ? 'var(--bg-2)' : 'var(--bg-1)',
    border:'1px solid', borderColor: hover ? 'var(--border-accent)' : 'var(--border-default)',
    borderRadius:'var(--radius-lg)', cursor:'pointer',
    transform: hover ? 'translateY(-2px)' : 'none',
    transition:'border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), transform var(--dur-base) var(--ease-out)' };

  const inner = (
    <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between', height:'100%' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ font:'700 28px/0.9 var(--font-mono)', color:'var(--teal)' }}>{lists.length}</span>
        <Icon name="list" size={16} color="var(--teal-dim)" />
      </div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:12 }}>
        <span className="overline" style={{ color:'var(--fg-1)' }}>Lists</span>
      </div>
    </div>
  );

  return (
    <>
      <div role="button" tabIndex={0} onClick={() => setOpen(true)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(true); } }}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={boxStyle}>
        {inner}
      </div>
      {open && <CreatedListsModal lists={lists} onClose={() => setOpen(false)}
        onDelete={onDelete} onRename={onRename} onNew={onNew} onOpenList={handleOpenList} readOnly={!isOwnProfile} />}
    </>
  );
}

// a single editable row inside the Created-lists modal
function CreatedListRow({ list, onDelete, onRename, onOpenList, readOnly = false }) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(list.title);
  const [visibility, setVisibility] = React.useState(list.visibility);
  const inputRef = React.useRef(null);
  React.useEffect(() => { if (editing && inputRef.current) inputRef.current.select(); }, [editing]);

  const commit = () => { const t = draft.trim(); if (t) onRename(list.id, t); else setDraft(list.title); setEditing(false); };
  const openList = () => { if (!editing && onOpenList) onOpenList(list.id); };
  const toggleVisibility = (e) => {
    e.stopPropagation();
    const next = visibility === 'private' ? 'public' : 'private';
    setVisibility(next);
    window.AICDB_LISTS.setVisibility(list.id, next);
  };

  return (
    <div style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 14px', borderRadius:'var(--radius-md)',
      background:'var(--bg-0)', border:'1px solid var(--border-subtle)' }}>
      <div onClick={openList} style={{ width:42, height:42, flex:'none', borderRadius:'var(--radius-md)', background:'var(--teal-ghost)',
        display:'flex', alignItems:'center', justifyContent:'center', cursor: onOpenList ? 'pointer' : 'default' }}>
        <Icon name="list" size={19} color="var(--teal-bright)" />
      </div>
      <div onClick={openList} style={{ minWidth:0, flex:1, cursor: onOpenList && !editing ? 'pointer' : 'default' }}>
        {editing ? (
          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
            <input ref={inputRef} value={draft} autoFocus
              onChange={e => setDraft(e.target.value)}
              onBlur={e => {
                const related = e.relatedTarget;
                if (related instanceof HTMLElement && related.hasAttribute('data-privacy-btn')) return;
                setTimeout(() => commit(), 0);
              }}
              onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(list.title); setEditing(false); } }}
              style={{ flex:1, minWidth:120, font:'600 15px/1.2 var(--font-body)', color:'var(--fg-0)', background:'var(--bg-3)',
                border:'1px solid var(--border-accent)', borderRadius:'var(--radius-sm)', padding:'6px 9px', outline:'none' }} />
            <ListPrivacyButton isPrivate={visibility === 'private'} onToggle={toggleVisibility} />
          </div>
        ) : (
          <div style={{ display:'flex', alignItems:'center', minWidth:0, font:'600 15px/1.2 var(--font-body)', color:'var(--fg-0)' }}>
            <span style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', minWidth:0, flex:1 }}>{list.title}</span>
            {visibility === 'private' && (
              <span style={{ display:'inline-flex', alignItems:'center', marginLeft:4, flex:'none' }}>
                <Icon name="lock-simple" size={12} weight="fill" color="var(--fg-3)" />
              </span>
            )}
          </div>
        )}
        <div style={{ display:'flex', alignItems:'center', gap:7, marginTop:5, font:'var(--text-data-sm)', color:'var(--fg-2)' }}>
          <span>{list.count} {list.count === 1 ? 'title' : 'titles'}</span>
          {list.note && (<><span style={{ color:'var(--fg-3)' }}>·</span>
            <span style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{list.note}</span></>)}
        </div>
      </div>
      {!readOnly && (
      <div style={{ display:'flex', alignItems:'center', gap:7, flex:'none' }}>
        <button onClick={() => editing ? commit() : setEditing(true)}
          style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 12px', borderRadius:'var(--radius-md)', cursor:'pointer',
            background:'var(--bg-2)', border:'1px solid var(--border-subtle)', color:'var(--fg-1)', font:'600 12.5px/1 var(--font-body)',
            transition:'all var(--dur-fast)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--teal-bright)'; e.currentTarget.style.color = 'var(--teal-bright)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--fg-1)'; }}>
          <Icon name="pencil-simple" size={14} color="currentColor" /> {editing ? 'Save' : 'Edit'}
        </button>
        <button onClick={() => onDelete(list.id)}
          style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 12px', borderRadius:'var(--radius-md)', cursor:'pointer',
            background:'var(--bg-2)', border:'1px solid var(--border-subtle)', color:'var(--fg-1)', font:'600 12.5px/1 var(--font-body)',
            transition:'all var(--dur-fast)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--score-low)'; e.currentTarget.style.color = 'var(--score-low)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--fg-1)'; }}>
          <Icon name="trash" size={14} color="currentColor" /> Delete
        </button>
      </div>
      )}
    </div>
  );
}

function CreatedListsModal({ lists, onClose, onDelete, onRename, onNew, onOpenList, readOnly = false }) {
  const [creating, setCreating] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('mine');
  const [savedLists, setSavedLists] = React.useState([]);
  const newRef = React.useRef(null);
  React.useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  React.useEffect(() => { if (creating && newRef.current) newRef.current.focus(); }, [creating]);
  React.useEffect(() => {
    (async () => {
      const data = await window.AICDB_LISTS.loadFavoritedLists();
      setSavedLists(data || []);
    })();
  }, []);

  const commitNew = () => { const t = draft.trim(); if (t) { onNew(t); setDraft(''); setCreating(false); } };
  const tabBtn = (active) => ({
    padding:'8px 20px', borderRadius:999, border:'1px solid', cursor:'pointer', font:'600 13px/1 var(--font-body)',
    borderColor: active ? 'var(--teal-bright)' : 'var(--border-subtle)',
    color: active ? 'var(--teal-bright)' : 'var(--fg-2)', background:'transparent',
  });

  return (
    <div onClick={onClose}
      style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24,
        background:'rgba(5,5,5,0.74)', backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)' }}>
      <style>{`@keyframes aicdbModalIn{from{transform:translateY(14px) scale(0.985)}to{transform:none}}`}</style>
      <div onClick={e => e.stopPropagation()}
        style={{ position:'relative', width:'100%', maxWidth:560, maxHeight:'84vh', display:'flex', flexDirection:'column',
          background:'var(--bg-1)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-xl)',
          boxShadow:'var(--shadow-3)', overflow:'hidden', animation:'aicdbModalIn 0.34s var(--ease-out) both' }}>

        {/* header — title + New list (top-right) + close */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, padding:'24px 26px 18px',
          borderBottom:'1px solid var(--border-subtle)' }}>
          <div>
            <h2 style={{ font:'600 22px/1.2 var(--font-display)', color:'var(--fg-0)', margin:0 }}>Created lists</h2>
            <p style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', margin:'7px 0 0' }}>
              {lists.length} {lists.length === 1 ? 'list' : 'lists'} · curate your own corners of the catalog
            </p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10, flex:'none' }}>
            {!readOnly && (
            <button onClick={() => setCreating(c => !c)}
              style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'9px 14px', borderRadius:'var(--radius-md)', cursor:'pointer',
                background:'var(--coral)', border:'1px solid transparent', color:'var(--fg-on-accent)', font:'600 13px/1 var(--font-body)',
                transition:'all var(--dur-fast)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--coral-bright)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--coral)'; }}>
              <Icon name="plus" size={14} color="currentColor" weight="bold" /> New list
            </button>
            )}
            <button onClick={onClose} style={{ display:'flex', padding:8, borderRadius:'50%', flex:'none', cursor:'pointer',
              background:'var(--bg-2)', border:'1px solid var(--border-default)' }}>
              <Icon name="x" size={15} color="var(--fg-1)" />
            </button>
          </div>
        </div>

        {/* new-list composer (revealed by the button) */}
        {creating && !readOnly && (
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 26px', borderBottom:'1px solid var(--border-subtle)',
            background:'var(--bg-0)' }}>
            <input ref={newRef} value={draft} placeholder="Name your new list…"
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') commitNew(); if (e.key === 'Escape') { setDraft(''); setCreating(false); } }}
              style={{ flex:1, font:'var(--text-body)', color:'var(--fg-0)', background:'var(--bg-3)',
                border:'1px solid var(--border-default)', borderRadius:'var(--radius-md)', padding:'10px 12px', outline:'none' }} />
            <button onClick={commitNew}
              style={{ padding:'10px 16px', borderRadius:'var(--radius-md)', cursor:'pointer', background:'var(--coral)',
                border:'1px solid transparent', color:'var(--fg-on-accent)', font:'600 13px/1 var(--font-body)' }}>Create</button>
          </div>
        )}

        <div style={{ display:'flex', justifyContent:'center', gap:8, padding:'14px 26px 0' }}>
          <button style={tabBtn(activeTab === 'mine')} onClick={() => setActiveTab('mine')}>My lists</button>
          <button style={tabBtn(activeTab === 'saved')} onClick={() => setActiveTab('saved')}>Saved lists</button>
        </div>

        {/* list rows */}
        <div style={{ overflowY:'auto', padding:'14px 18px 18px', display:'flex', flexDirection:'column', gap:10 }}>
          {activeTab === 'mine' ? (
            lists.length ? lists.map(l => (
              <CreatedListRow key={l.id} list={l} onDelete={onDelete} onRename={onRename} onOpenList={onOpenList} readOnly={readOnly} />
            )) : (
              <div style={{ padding:'48px 0', textAlign:'center', font:'var(--text-body)', color:'var(--fg-2)' }}>
                No lists yet — hit <b style={{ color:'var(--fg-1)' }}>New list</b> to start one.
              </div>
            )
          ) : savedLists.length ? (
            savedLists.map(list => (
              <div key={list.id} onClick={() => onOpenList && onOpenList(list.id)}
                style={{ display:'flex', alignItems:'center', gap:14, padding:14, borderRadius:'var(--radius-md)',
                  background:'var(--bg-0)', border:'1px solid var(--border-subtle)', cursor:'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}>
                <div style={{ width:42, height:42, background:'var(--teal-ghost)', borderRadius:'var(--radius-md)',
                  display:'flex', alignItems:'center', justifyContent:'center', flex:'none' }}>
                  <Icon name="list" size={19} color="var(--teal-bright)" />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ font:'600 15px/1.2 var(--font-body)', color:'var(--fg-0)' }}>{list.name}</div>
                  <div style={{ marginTop:5, font:'var(--text-data-sm)', color:'var(--fg-2)' }}>
                    {list.view_count || 0} views
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding:'48px 0', textAlign:'center', font:'var(--text-body)', color:'var(--fg-2)' }}>
              You have no saved lists yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// single small list-wide privacy button (lives in the modal's top-right corner)
function ListPrivacyButton({ isPrivate, onToggle }) {
  const [hover, setHover] = React.useState(false);
  const accent = isPrivate ? 'var(--fg-1)' : 'var(--teal-bright)';
  return (
    <button data-privacy-btn onClick={onToggle} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      title={isPrivate ? 'Following list is private — tap to make public' : 'Following list is public — tap to make private'}
      style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'8px 13px', flex:'none', cursor:'pointer',
        borderRadius:'var(--radius-pill)', border:'1px solid', borderColor: hover ? 'var(--border-strong)' : 'var(--border-default)',
        background: hover ? 'var(--bg-2)' : 'var(--bg-0)', font:'600 12px/1 var(--font-body)', color: accent,
        transition:'all var(--dur-fast)' }}>
      <Icon name={isPrivate ? 'lock-simple' : 'eye'} size={13} color={accent} weight={isPrivate ? 'fill' : 'regular'} />
      {isPrivate ? 'Private' : 'Public'}
    </button>
  );
}

Object.assign(window, { CreatedListsBox, CreatedListsModal, CreatedListRow, ListPrivacyButton });

