// Dreamwall UI kit — Creator Account Setup.
// Shows the user's main account on top, then a form to create (or edit) a
// creator account: banner, photo, bio, location, social links, tools, influences,
// plus a toggle to show/hide the connection on the main profile. Users can run
// multiple creator accounts linked to one main account.

const GRADIENTS = [
  ['#d85a30','#9d8df1'], ['#4ecdc4','#6f9ceb'], ['#e5b23b','#4ecdc4'],
  ['#a04a8f','#e5b23b'], ['#6b5bd0','#9d8df1'], ['#3a8fb0','#1a2b33'],
  ['#c44a2a','#e5b23b'], ['#2f6f8f','#4ecdc4'],
];

// ---- labelled text field ----
function Field({ label, hint, value, onChange, placeholder, prefix }) {
  return (
    <label style={{ display:'block' }}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:8 }}>
        <span className="overline" style={{ color:'var(--fg-1)' }}>{label}</span>
        {hint && <span style={{ font:'var(--text-data-sm)', color:'var(--fg-3)' }}>{hint}</span>}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--bg-0)', borderRadius:'var(--radius-md)',
        border:'1px solid var(--border-default)', padding:'0 14px' }}>
        {prefix && <span style={{ font:'600 14px/1 var(--font-mono)', color:'var(--fg-3)' }}>{prefix}</span>}
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={{ flex:1, background:'none', border:'none', outline:'none', color:'var(--fg-0)', font:'var(--text-body)', padding:'12px 0' }} />
      </div>
    </label>
  );
}

// ---- multiline ----
function Area({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <label style={{ display:'block' }}>
      <div className="overline" style={{ color:'var(--fg-1)', marginBottom:8 }}>{label}</div>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        style={{ width:'100%', resize:'vertical', background:'var(--bg-0)', color:'var(--fg-0)', border:'1px solid var(--border-default)',
          borderRadius:'var(--radius-md)', padding:'12px 14px', font:'var(--text-body)', outline:'none' }} />
    </label>
  );
}

// ---- tag / chip input (tools, influences) ----
function ChipInput({ label, hint, chips, onChange, accent = 'var(--teal-bright)', ghost = 'var(--teal-ghost)' }) {
  const [val, setVal] = React.useState('');
  const add = () => { const t = val.trim(); if (t && !chips.includes(t)) onChange([...chips, t]); setVal(''); };
  return (
    <div>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:8 }}>
        <span className="overline" style={{ color:'var(--fg-1)' }}>{label}</span>
        {hint && <span style={{ font:'var(--text-data-sm)', color:'var(--fg-3)' }}>{hint}</span>}
      </div>
      <div style={{ background:'var(--bg-0)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-md)', padding:'10px 12px' }}>
        {chips.length > 0 && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:10 }}>
            {chips.map(c => (
              <span key={c} style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'6px 10px', borderRadius:'var(--radius-pill)',
                background:ghost, color:accent, font:'600 12.5px/1 var(--font-body)' }}>
                {c}
                <button onClick={() => onChange(chips.filter(x => x !== c))} style={{ background:'none', border:'none', cursor:'pointer', padding:0, display:'flex' }}>
                  <Icon name="x" size={12} color={accent} />
                </button>
              </span>
            ))}
          </div>
        )}
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <input value={val} onChange={e => setVal(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }}
            placeholder="Type and press Enter…"
            style={{ flex:1, background:'none', border:'none', outline:'none', color:'var(--fg-0)', font:'var(--text-body-sm)' }} />
          <button onClick={add} style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'6px 11px', borderRadius:'var(--radius-pill)',
            border:'1px solid var(--border-default)', background:'transparent', color:'var(--fg-1)', cursor:'pointer', font:'600 12px/1 var(--font-body)' }}>
            <Icon name="plus" size={12} color="var(--fg-2)" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- toggle ----
function SetupToggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} role="switch" aria-checked={on}
      style={{ width:46, height:26, flex:'none', borderRadius:'var(--radius-pill)', border:'none', cursor:'pointer',
        padding:3, display:'flex', alignItems:'center', background: on ? 'var(--teal)' : 'var(--bg-3)',
        justifyContent: on ? 'flex-end' : 'flex-start', transition:'background var(--dur-base) var(--ease-out)' }}>
      <span style={{ width:20, height:20, borderRadius:'50%', background: on ? '#04201e' : 'var(--fg-2)', boxShadow:'var(--shadow-1)' }} />
    </button>
  );
}

// ---- section wrapper ----
function SetupCard({ children, style }) {
  return (
    <div style={{ padding:'24px 26px', background:'var(--bg-1)', border:'1px solid var(--border-subtle)',
      borderRadius:'var(--radius-lg)', ...style }}>{children}</div>
  );
}

// ---- main (viewer) account card ----
function MainAccountCard() {
  const m = window.AICDB_MAIN_ACCOUNT;
  if (!m) return null;
  return (
    <SetupCard style={{ display:'flex', alignItems:'center', gap:16, marginBottom:14 }}>
      <div style={{ width:54, height:54, borderRadius:'50%', flex:'none',
        background:`linear-gradient(135deg, ${m.avatar[0]}, ${m.avatar[1]})`,
        display:'flex', alignItems:'center', justifyContent:'center', font:'600 22px/1 var(--font-display)', color:'rgba(255,255,255,0.92)' }}>
        {m.name.charAt(0)}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9, flexWrap:'wrap' }}>
          <span style={{ font:'600 17px/1.2 var(--font-display)', color:'var(--fg-0)' }}>{m.name}</span>
          <span style={{ font:'600 9px/1 var(--font-body)', letterSpacing:'0.05em', textTransform:'uppercase', color:'var(--fg-2)',
            background:'var(--bg-3)', padding:'4px 8px', borderRadius:'var(--radius-pill)' }}>Main account</span>
        </div>
        <div style={{ font:'var(--text-data-sm)', color:'var(--fg-2)', marginTop:4 }}>{m.handle} · {m.joined}</div>
      </div>
      <Icon name="link-simple" size={18} color="var(--fg-3)" />
    </SetupCard>
  );
}

// ---- existing creator accounts (multi-account) ----
function ExistingAccounts({ accounts, editingId }) {
  if (!accounts.length) return null;
  return (
    <div style={{ marginBottom:30 }}>
      <div className="overline" style={{ color:'var(--fg-2)', margin:'0 2px 12px' }}>Your creator accounts · {accounts.length}</div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {accounts.map(a => (
          <div key={a.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 16px', background:'var(--bg-1)',
            border:'1px solid ' + (a.id === editingId ? 'var(--border-accent)' : 'var(--border-subtle)'), borderRadius:'var(--radius-lg)' }}>
            <div style={{ width:42, height:42, borderRadius:'50%', flex:'none',
              background:`linear-gradient(135deg, ${(a.avatar||['#d85a30','#9d8df1'])[0]}, ${(a.avatar||['#d85a30','#9d8df1'])[1]})`,
              display:'flex', alignItems:'center', justifyContent:'center', font:'600 17px/1 var(--font-display)', color:'rgba(255,255,255,0.92)' }}>
              {(a.name||'C').charAt(0).toUpperCase()}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ font:'600 14.5px/1.2 var(--font-body)', color:'var(--fg-0)' }}>{a.name}</div>
              <div style={{ font:'var(--text-data-sm)', color:'var(--fg-2)', marginTop:3 }}>
                {a.handle || '—'}{a.showOnProfile ? ' · shown on profile' : ' · hidden'}
              </div>
            </div>
            <a href={'creator.html?account=' + encodeURIComponent(a.id)} style={{ font:'600 13px/1 var(--font-body)', color:'var(--teal)', textDecoration:'none' }}>View</a>
            <a href={'creator-setup.html?edit=' + encodeURIComponent(a.id)} style={{ font:'600 13px/1 var(--font-body)', color:'var(--fg-1)', textDecoration:'none' }}>Edit</a>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- the page ----
function CreatorSetup() {
  const accounts = useCreatorAccounts();
  let editId = null;
  try { editId = new URLSearchParams(window.location.search).get('edit'); } catch (e) {}
  const editing = editId ? window.AICDB_CREATOR_ACCOUNTS.byId(editId) : null;

  const [name, setName] = React.useState(editing ? editing.name : '');
  const [handle, setHandle] = React.useState(editing ? (editing.handle || '').replace(/^@/, '') : '');
  const [location, setLocation] = React.useState(editing ? (editing.location || '') : '');
  const [bio, setBio] = React.useState(editing ? (editing.bio || '') : '');
  const [avatar, setAvatar] = React.useState(editing ? (editing.avatar || GRADIENTS[0]) : GRADIENTS[0]);
  const [social, setSocial] = React.useState(editing ? (editing.social || {}) : {});
  const [tools, setTools] = React.useState(editing ? (editing.tools || []) : []);
  const [influences, setInfluences] = React.useState(editing ? (editing.influences || []) : []);
  const [notes, setNotes] = React.useState(editing ? (editing.notes || '') : '');
  const [showOnProfile, setShowOnProfile] = React.useState(editing ? editing.showOnProfile !== false : true);

  const setSoc = (k) => (v) => setSocial(s => ({ ...s, [k]: v }));
  const canSave = name.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    const payload = {
      name: name.trim(), handle: handle.trim() ? '@' + handle.trim().replace(/^@/, '') : '',
      location: location.trim(), bio: bio.trim(), avatar, banner: null,
      social, tools, influences, notes: notes.trim(), showOnProfile,
    };
    let id = editId;
    if (editing) window.AICDB_CREATOR_ACCOUNTS.update(editId, payload);
    else { const rec = window.AICDB_CREATOR_ACCOUNTS.add(payload); id = rec.id; }
    window.location.href = 'creator.html?account=' + encodeURIComponent(id) + (editing ? '' : '&manage=1');
  };

  const goApp = (label) => { window.location.href = 'index.html' + (label ? '#' + encodeURIComponent(label) : ''); };

  return (
    <div style={{ minHeight:'100vh' }}>
      <NavBar active="" onNav={goApp} query="" onQuery={() => {}} onOpenResult={() => {}} />
      <div style={{ maxWidth:720, margin:'0 auto', padding:'40px 28px 90px' }}>
        <div style={{ marginBottom:28 }}>
          <h1 style={{ font:'var(--text-h1)', color:'var(--fg-0)', letterSpacing:'-0.015em', margin:0 }}>
            {editing ? 'Edit creator account' : 'Set up a creator account'}
          </h1>
          <p style={{ font:'var(--text-body)', color:'var(--fg-2)', margin:'8px 0 0' }}>
            A creator account is the identity you publish and get rated under. It’s linked to your main account — you can run as many as you like.
          </p>
        </div>

        {/* main account on top */}
        <div className="overline" style={{ color:'var(--fg-2)', margin:'0 2px 12px' }}>Linked to</div>
        <MainAccountCard />

        {/* connector */}
        <div style={{ display:'flex', justifyContent:'center', margin:'2px 0 18px' }}>
          <Icon name="arrow-down" size={18} color="var(--fg-3)" />
        </div>

        {!editing && <ExistingAccounts accounts={accounts} editingId={editId} />}

        {/* the creator profile form */}
        <SetupCard style={{ padding:0, overflow:'hidden' }}>
          {/* banner + avatar */}
          <div style={{ position:'relative', height:150, background:`linear-gradient(125deg, ${avatar[0]}33, ${avatar[1]}22), var(--bg-2)` }}>
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', gap:9,
              color:'var(--fg-2)', font:'600 13px/1 var(--font-body)' }}>
              <Icon name="image" size={16} color="var(--fg-2)" /> Add a banner image
            </div>
            <div style={{ position:'absolute', left:26, bottom:-34, width:84, height:84, borderRadius:'50%',
              background:`linear-gradient(135deg, ${avatar[0]}, ${avatar[1]})`, border:'4px solid var(--bg-1)', boxShadow:'var(--shadow-2)',
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon name="camera" size={20} color="rgba(255,255,255,0.9)" weight="fill" />
            </div>
          </div>

          <div style={{ padding:'46px 26px 26px', display:'flex', flexDirection:'column', gap:20 }}>
            {/* avatar color */}
            <div>
              <div className="overline" style={{ color:'var(--fg-1)', marginBottom:10 }}>Profile photo color</div>
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                {GRADIENTS.map((g, i) => {
                  const on = g[0] === avatar[0] && g[1] === avatar[1];
                  return (
                    <button key={i} onClick={() => setAvatar(g)} title="Use this color"
                      style={{ width:34, height:34, borderRadius:'50%', cursor:'pointer', padding:0,
                        background:`linear-gradient(135deg, ${g[0]}, ${g[1]})`,
                        border:'2px solid ' + (on ? 'var(--fg-0)' : 'transparent'), boxShadow: on ? '0 0 0 2px var(--bg-1)' : 'none' }} />
                  );
                })}
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }} className="aicdb-setup-grid">
              <Field label="Display name" value={name} onChange={setName} placeholder="e.g. Nova Pictures" />
              <Field label="Handle" prefix="@" value={handle} onChange={setHandle} placeholder="novapictures" />
            </div>
            <Field label="Location" hint="optional" value={location} onChange={setLocation} placeholder="e.g. Reykjavík" />
            <Area label="Bio / manifesto" value={bio} onChange={setBio} placeholder="What do you make, and why? This shows under your name." rows={3} />

            {/* social links */}
            <div>
              <div className="overline" style={{ color:'var(--fg-1)', marginBottom:10 }}>Social links <span style={{ color:'var(--fg-3)', textTransform:'none', letterSpacing:0 }}>· optional</span></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }} className="aicdb-setup-grid">
                {[['youtube','YouTube','youtube-logo'],['instagram','Instagram','instagram-logo'],['x','X','x-logo'],['tiktok','TikTok','tiktok-logo'],['website','Website','globe']].map(([k, lbl, icon]) => (
                  <div key={k} style={{ display:'flex', alignItems:'center', gap:8, background:'var(--bg-0)', borderRadius:'var(--radius-md)',
                    border:'1px solid var(--border-default)', padding:'0 12px' }}>
                    <Icon name={icon} size={16} color="var(--fg-2)" weight="fill" />
                    <input value={social[k] || ''} onChange={e => setSoc(k)(e.target.value)} placeholder={lbl}
                      style={{ flex:1, background:'none', border:'none', outline:'none', color:'var(--fg-0)', font:'var(--text-body-sm)', padding:'11px 0' }} />
                  </div>
                ))}
              </div>
            </div>

            <ChipInput label="Tools & stack" hint="press Enter to add" chips={tools} onChange={setTools} accent="var(--teal-bright)" ghost="var(--teal-ghost)" />
            <ChipInput label="Influences" hint="press Enter to add" chips={influences} onChange={setInfluences} accent="var(--coral-bright)" ghost="var(--coral-ghost)" />
            <Area label="Notes from the creator" value={notes} onChange={setNotes} placeholder="Anything else visitors should know (optional)." rows={3} />

            {/* show on profile toggle */}
            <div className="aicdb-pref-row" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:20,
              padding:'16px 18px', background:'var(--bg-0)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)' }}>
              <div style={{ minWidth:0 }}>
                <div style={{ font:'600 14.5px/1.3 var(--font-body)', color:'var(--fg-0)' }}>Show this creator account on my main profile</div>
                <div style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', marginTop:4 }}>Visitors to your main profile will see a link to this creator page.</div>
              </div>
              <SetupToggle on={showOnProfile} onChange={setShowOnProfile} />
            </div>
          </div>
        </SetupCard>

        {/* actions */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:12, marginTop:22 }}>
          <a href="index.html" style={{ font:'600 14px/1 var(--font-body)', color:'var(--fg-2)', textDecoration:'none', padding:'13px 18px' }}>Cancel</a>
          <button onClick={save} disabled={!canSave}
            style={{ display:'inline-flex', alignItems:'center', gap:9, padding:'14px 26px', borderRadius:'var(--radius-md)', border:'none',
              cursor: canSave ? 'pointer' : 'not-allowed', font:'600 15px/1 var(--font-body)',
              background: canSave ? 'var(--coral)' : 'var(--bg-3)', color: canSave ? 'var(--fg-on-accent)' : 'var(--fg-3)' }}>
            <Icon name={editing ? 'check' : 'plus'} size={16} color={canSave ? 'var(--fg-on-accent)' : 'var(--fg-3)'} weight="bold" />
            {editing ? 'Save changes' : 'Create creator account'}
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CreatorSetup, CreatorSetupField: Field, ChipInput, SetupToggle });
