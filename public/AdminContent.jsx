// Dreamwall — Admin Panel: Content management, Reports, Badge management.

// ============================================================
// Admin Add Content Modal — same 3-step wizard as AddContent.jsx
// but with an extra "Creator" field and direct Supabase insert.
// ============================================================

const ADM_AC_BLANK = {
  type:'movie', seriesMode:'new',
  existingSeriesId:'', episodeNumber:'', episodeMedia:'',
  heroImage:null, motto:'', title:'', year:'', seasons:'', episodes:'', duration:'', description:'',
  genres:[], contentTags:[], poster:null, embed:'', episodeEmbeds:[{ ep:'Episode 1', embed:'' }],
  crew:[{ role:'Director', name:'' }, { role:'Prompt Architect', name:'' }], models:[],
  budget:'', prodDuration:'', contributors:'',
  // Admin-only: creator assignment
  creatorSearch:'', creatorId:'', creatorLabel:'',
};

function AdminAddContentModal({ sb, onClose, onDone, toast }) {
  const [step, setStep] = React.useState(1);
  const [maxStep, setMaxStep] = React.useState(1);
  const [form, setForm] = React.useState(ADM_AC_BLANK);
  const [tried, setTried] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState(null);
  // creator search — stored separately from form to avoid re-mount on every keystroke
  const [creatorInput, setCreatorInput] = React.useState('');
  const [creatorId, setCreatorId] = React.useState('');
  const [creatorLabel, setCreatorLabel] = React.useState('');
  const [creatorResults, setCreatorResults] = React.useState([]);
  const [creatorSearching, setCreatorSearching] = React.useState(false);
  const searchTimer = React.useRef(null);

  const set = (patch) => setForm(f => ({ ...f, ...patch }));

  const goto = (n) => { setStep(n); setMaxStep(m => Math.max(m, n)); };
  const next = () => { if (step === 1 && !form.title.trim()) { setTried(true); return; } setTried(false); goto(step + 1); };
  const back = () => goto(step - 1);

  // ---- creator search ----
  const onCreatorType = (q) => {
    setCreatorInput(q);
    // if the user edits away from the confirmed label, clear the matched id
    if (creatorId && q !== creatorLabel) { setCreatorId(''); setCreatorLabel(''); }
    if (!q.trim()) { setCreatorResults([]); return; }
    clearTimeout(searchTimer.current);
    setCreatorSearching(true);
    searchTimer.current = setTimeout(async () => {
      const { data } = await sb.from('profiles')
        .select('id, username, display_name')
        .or(`username.ilike.%${q}%,display_name.ilike.%${q}%`)
        .limit(8);
      setCreatorResults(data || []);
      setCreatorSearching(false);
    }, 350);
  };
  const pickCreator = (p) => {
    const label = p.display_name || p.username;
    setCreatorId(p.id);
    setCreatorLabel(label);
    setCreatorInput(label);
    setCreatorResults([]);
  };
  // free-text creator (no profile) — just keep whatever was typed as label, no UUID
  const keepFreeText = () => {
    setCreatorResults([]);
    // creatorId stays empty → will use admin's own id for FK, label stored in credits JSON
  };

  // ---- slug helper — must match DB check: ^[a-z0-9]+(?:-[a-z0-9]+)*$ ----
  const makeSlug = (title) => {
    const base = title.trim().toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')   // strip everything except letters/digits/spaces
      .trim()
      .replace(/\s+/g, '-')           // spaces → hyphens
      .replace(/-+/g, '-')            // collapse multiple hyphens
      .replace(/^-+|-+$/g, '');       // strip leading/trailing hyphens
    const suffix = Math.random().toString(36).slice(2, 6).replace(/[^a-z0-9]/g, 'x');
    return (base || 'content') + '-' + suffix;
  };

  // ---- submit ----
  const handleSubmit = async () => {
    if (!form.title.trim()) { setTried(true); goto(1); return; }
    setSaving(true);
    setSaveError(null);

    // Validate embed/URL for film & short BEFORE hitting the DB
    const dbType = form.type === 'movie' || form.type === 'short' ? 'film' : 'series';
    const embedTrimmed = form.embed.trim();
    if (dbType === 'film' && !embedTrimmed) {
      setSaveError('Film and Short require an embed code or video URL — go to Step 2 and fill in the Playback field.');
      setSaving(false);
      goto(2);
      return;
    }

    try {
      const { data: { user }, error: authErr } = await sb.auth.getUser();
      if (authErr || !user) throw new Error('Session not found. Please sign in again.');

      // submitted_by must be a valid profile UUID (FK → profiles.id ON DELETE RESTRICT).
      // Use the picked profile or fall back to the admin's own id.
      const submittedBy = creatorId || user.id;

      const durationMin = (() => {
        const s = (form.duration || '').toLowerCase();
        const h = parseInt((s.match(/(\d+)h/) || [])[1] || 0) * 60;
        const m = parseInt((s.match(/(\d+)m/) || [])[1] || 0);
        return (h + m) || null;
      })();

      const credits = form.crew.filter(r => r.role.trim() || r.name.trim())
        .map(r => ({ role: r.role, name: r.name }));

      // Store the free-text creator name in credits if no real profile was picked
      const displayCreator = creatorInput.trim() || creatorLabel.trim() || null;
      if (displayCreator && !creatorId) {
        credits.unshift({ role: 'Creator', name: displayCreator });
      }

      // poster_url is always a URL string in admin mode (no base64 uploads)
      const posterUrl = (form.poster && form.poster.trim().startsWith('http')) ? form.poster.trim() : null;

      const row = {
        type: dbType,
        status: 'published',
        slug: makeSlug(form.title),
        title: form.title.trim(),
        synopsis: form.description.trim() || null,
        genres: form.genres,
        poster_url: posterUrl,
        release_year: form.year ? parseInt(form.year) : null,
        duration_minutes: durationMin,
        external_url: null,
        embed_code: embedTrimmed || null,
        ai_tools: form.models.length ? form.models : null,
        credits: credits.length ? credits : null,
        submitted_by: submittedBy,
        published_at: new Date().toISOString(),
      };

      const { data, error } = await sb.from('content').insert(row).select().single();
      if (error) throw error;

      if (creatorId) {
        const { data: creatorProfile } = await sb.from('creator_profiles')
          .select('id')
          .eq('user_id', creatorId)
          .limit(1)
          .maybeSingle();
        if (creatorProfile?.id) {
          const { error: creatorErr } = await sb.from('content')
            .update({ creator_id: creatorProfile.id })
            .eq('id', data.id);
          if (creatorErr) throw creatorErr;
        }
      }

      // insert tags (skip silently on tag errors — not critical)
      try {
        const allTags = [...new Set([...form.genres, ...form.contentTags])];
        for (const tagName of allTags) {
          const tSlug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          let tagId;
          const { data: existing } = await sb.from('tags').select('id').eq('slug', tSlug).maybeSingle();
          if (existing) {
            tagId = existing.id;
          } else {
            const { data: newTag } = await sb.from('tags').insert({ name: tagName, slug: tSlug }).select('id').single();
            tagId = newTag?.id;
          }
          if (tagId) await sb.from('content_tags').insert({ content_id: data.id, tag_id: tagId });
        }
      } catch (_) {}

      toast('"' + form.title + '" published.');
      if (data) data._creatorLabel = displayCreator || creatorLabel || null;
      onDone && onDone(data);
      onClose();
    } catch (e) {
      setSaveError(e.message || 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  const canSubmit = form.title.trim();

  return (
    <div style={{ position:'fixed', inset:0, zIndex:900, display:'flex', alignItems:'flex-start', justifyContent:'center',
      background:'rgba(5,5,8,0.72)', backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)',
      overflowY:'auto', padding:'32px 16px 60px' }}>
      <div style={{ width:'100%', maxWidth:820, background:'var(--bg-1)', borderRadius:'var(--radius-xl)',
        border:'1px solid var(--border-subtle)', boxShadow:'var(--shadow-3)' }}>

        {/* header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'22px 28px',
          borderBottom:'1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <Icon name="film-slate" size={18} color="var(--coral)" weight="fill" />
              <span style={{ font:'700 17px/1 var(--font-body)', color:'var(--fg-0)' }}>Add Content</span>
              <APill label="Admin" tone="var(--warning)" />
            </div>
            <div style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', marginTop:5 }}>
              Publish directly — bypasses the review queue.
            </div>
          </div>
          <button onClick={onClose} style={{ display:'flex', padding:8, background:'transparent',
            border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', cursor:'pointer' }}>
            <Icon name="x" size={16} color="var(--fg-2)" />
          </button>
        </div>

        {/* stepper */}
        <div style={{ padding:'22px 28px 0' }}>
          <Stepper step={step} maxStep={maxStep} onJump={n => n <= maxStep && goto(n)} />
        </div>

        {/* form body */}
        <div style={{ padding:'0 28px 28px' }}>
          <div style={{ background:'var(--bg-0)', borderRadius:'var(--radius-lg)',
            border:'1px solid var(--border-subtle)', padding:'26px 28px' }}>

            {step === 1 && <Step1 form={form} set={set} nextEpisode={1} />}
            {step === 2 && <Step2 form={form} set={set} adminMode />}
            {step === 3 && (
              <>
                {/* ── Creator picker (admin-only) ── */}
                <div style={{ marginBottom:24, padding:'18px 20px', background:'rgba(229,178,59,0.07)',
                  border:'1px solid rgba(229,178,59,0.28)', borderRadius:'var(--radius-lg)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:12 }}>
                    <Icon name="user-circle" size={16} color="var(--warning)" weight="fill" />
                    <span style={{ font:'600 13px/1 var(--font-body)', color:'var(--fg-0)', textTransform:'uppercase', letterSpacing:'0.05em' }}>Creator</span>
                    <span style={{ font:'var(--text-data-sm)', color:'var(--fg-3)', marginLeft:2 }}>— any name works, even without a site profile</span>
                  </div>
                  <div style={{ position:'relative' }}>
                    <input
                      value={creatorInput}
                      onChange={e => onCreatorType(e.target.value)}
                      onBlur={keepFreeText}
                      placeholder="Name, @username, or free text…"
                      style={{ width:'100%', background:'var(--bg-0)', color:'var(--fg-0)',
                        border:'1px solid ' + (creatorId ? 'var(--teal)' : 'var(--border-subtle)'),
                        borderRadius:'var(--radius-md)', padding:'10px 14px', font:'var(--text-body)',
                        outline:'none', boxSizing:'border-box' }}
                    />
                    {creatorId && (
                      <span style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)',
                        display:'flex', alignItems:'center', gap:5, font:'var(--text-data-sm)', color:'var(--teal-bright)',
                        pointerEvents:'none' }}>
                        <Icon name="check-circle" size={14} color="var(--teal-bright)" weight="fill" /> profile matched
                      </span>
                    )}
                    {creatorSearching && (
                      <span style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)',
                        font:'var(--text-data-sm)', color:'var(--fg-3)', pointerEvents:'none' }}>Searching…</span>
                    )}
                    {creatorResults.length > 0 && (
                      <div style={{ position:'absolute', top:'calc(100% + 4px)', left:0, right:0, zIndex:60,
                        background:'var(--bg-2)', border:'1px solid var(--border-default)',
                        borderRadius:'var(--radius-md)', boxShadow:'var(--shadow-3)', overflow:'hidden' }}>
                        {creatorResults.map(p => (
                          <button key={p.id}
                            onMouseDown={e => { e.preventDefault(); pickCreator(p); }}
                            style={{ width:'100%', display:'flex', alignItems:'center', gap:11, padding:'10px 14px',
                              background:'transparent', border:'none', cursor:'pointer', textAlign:'left',
                              font:'var(--text-body)', color:'var(--fg-0)' }}
                            onMouseEnter={e => e.currentTarget.style.background='var(--bg-3)'}
                            onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                            <Icon name="user" size={15} color="var(--fg-2)" />
                            <span style={{ flex:1 }}>
                              <span style={{ fontWeight:600 }}>{p.display_name || p.username}</span>
                              {p.display_name && <span style={{ color:'var(--fg-3)', marginLeft:7 }}>@{p.username}</span>}
                            </span>
                          </button>
                        ))}
                        <div style={{ padding:'8px 14px', font:'var(--text-data-sm)', color:'var(--fg-3)',
                          borderTop:'1px solid var(--border-subtle)' }}>
                          Not in the list? Tab out — whatever you typed will be saved.
                        </div>
                      </div>
                    )}
                  </div>
                  {!creatorId && creatorInput.trim() && (
                    <div style={{ marginTop:8, font:'var(--text-data-sm)', color:'var(--fg-2)', display:'flex', alignItems:'center', gap:6 }}>
                      <Icon name="info" size={13} color="var(--fg-3)" />
                      No profile found — "<b style={{ color:'var(--fg-0)' }}>{creatorInput.trim()}</b>" will be saved as free text.
                    </div>
                  )}
                </div>
                <Step3 form={form} set={set} adminMode />
              </>
            )}

            {tried && step === 1 && !form.title.trim() && (
              <div style={{ display:'flex', alignItems:'center', gap:9, marginTop:16, padding:'11px 14px',
                borderRadius:'var(--radius-md)', background:'rgba(229,72,77,0.1)',
                border:'1px solid rgba(229,72,77,0.35)', font:'var(--text-body-sm)', color:'var(--score-low)' }}>
                <Icon name="warning" size={15} color="var(--score-low)" /> A title is required to continue.
              </div>
            )}
          </div>

          {/* error banner */}
          {saveError && (
            <div style={{ marginTop:14, display:'flex', alignItems:'flex-start', gap:10, padding:'12px 16px',
              borderRadius:'var(--radius-md)', background:'rgba(229,72,77,0.1)',
              border:'1px solid rgba(229,72,77,0.35)', font:'var(--text-body-sm)', color:'var(--score-low)' }}>
              <Icon name="warning-circle" size={16} color="var(--score-low)" weight="fill" style={{ flex:'none', marginTop:1 }} />
              <span><b>Save error:</b> {saveError}</span>
            </div>
          )}

          {/* nav */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:16 }}>
            {step > 1
              ? <Button variant="secondary" icon="chevron-left" onClick={back}>Back</Button>
              : <span />}
            {step < 3 ? (
              <Button variant="primary" onClick={next}>Continue</Button>
            ) : (
              <button onClick={handleSubmit} disabled={saving || !canSubmit}
                style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'11px 22px',
                  borderRadius:'var(--radius-md)', border:'none', cursor: (saving||!canSubmit) ? 'not-allowed' : 'pointer',
                  font:'600 14px/1 var(--font-body)',
                  background: canSubmit ? 'var(--coral)' : 'var(--bg-3)',
                  color: canSubmit ? 'var(--fg-on-accent)' : 'var(--fg-3)',
                  opacity: saving ? 0.7 : 1, transition:'all var(--dur-fast)' }}>
                {saving
                  ? <><span style={{ width:14, height:14, borderRadius:'50%', border:'2px solid var(--fg-on-accent)',
                      borderTopColor:'transparent', animation:'spin 0.7s linear infinite', display:'inline-block' }} /> Saving…</>
                  : <><Icon name="check" size={16} color="var(--fg-on-accent)" weight="bold" /> Publish</>}}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Content management — Pending / Published / Rejected
// ============================================================
function ContentRow({ item, onAction }) {
  const typeKey = item.type === 'film' ? 'movie' : item.type;
  const t = window.AICDB_TYPES[typeKey] || window.AICDB_TYPES['movie'];
  return (
    <div style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 18px', background:'var(--bg-1)',
      border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)' }}>
      <AThumb g={item.g || ['#1a1a2e','#16213e']} type={typeKey} w={44} />
      <div style={{ flex:'1 1 200px', minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:5 }}>
          <span style={{ font:'600 15px/1.2 var(--font-body)', color:'var(--fg-0)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.title}</span>
          <APill label={t.label} tone={t.color} />
        </div>
        <div style={{ font:'var(--text-body-sm)', color:'var(--fg-2)' }}>
          by <span style={{ color:'var(--fg-1)' }}>{item.creator}</span> · submitted {item.date}
        </div>
        {item.reason && (
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, marginTop:8, font:'var(--text-body-sm)', color:'#f0686c' }}>
            <Icon name="x-circle" size={13} color="#f0686c" weight="fill" /> {item.reason}
          </div>
        )}
        {item.score != null && (
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, marginTop:8, font:'var(--text-data-sm)', color:'var(--fg-2)' }}>
            <Icon name="star" size={12} color={scoreColor(item.score)} weight="fill" />
            <span style={{ color:scoreColor(item.score), fontWeight:700 }}>{item.score.toFixed(1)}</span> · {item.ratings} ratings
          </div>
        )}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', justifyContent:'flex-end' }}>
        {item.status === 'pending' && (<>
          <ABtn variant="approve" icon="check" onClick={() => onAction('approve', item)}>Approve</ABtn>
          <ABtn variant="reject" icon="x" onClick={() => onAction('reject', item)}>Reject</ABtn>
          <ABtn variant="ghost" icon="pencil-simple" onClick={() => onAction('edit', item)}>Edit</ABtn>
        </>)}
        {item.status === 'published' && (<>
          <ABtn variant="ghost" icon="pencil-simple" onClick={() => onAction('edit', item)}>Edit</ABtn>
          <ABtn variant="reject" icon="trash" onClick={() => onAction('remove', item)}>Remove</ABtn>
        </>)}
        {item.status === 'rejected' && (<>
          <ABtn variant="approve" icon="arrow-counter-clockwise" onClick={() => onAction('approve', item)}>Restore</ABtn>
          <ABtn variant="reject" icon="trash" onClick={() => onAction('remove', item)}>Remove</ABtn>
        </>)}
      </div>
    </div>
  );
}

function rowToItem(row) {
  return {
    id: row.id,
    title: row.title || '—',
    type: row.type,
    status: row.status,
    date: (row.created_at || '').slice(0, 10),
    creator: row._creatorLabel || (row.profiles && (row.profiles.display_name || row.profiles.username)) || '—',
    g: ['#1a1a2e', '#16213e'],
    reason: row.rejection_reason || null,
    score: null,
  };
}

function usePendingContent(sb, toast) {
  const [pendingContent, setPendingContent] = React.useState([]);

  const fetchPending = React.useCallback(() => {
    if (!sb) return;
    sb.from('content')
      .select('id, title, type, created_at, submitted_by, creator_id, synopsis, genres, embed_code, poster_url, profiles!submitted_by(display_name)')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) { console.error('Failed to load pending:', error.message); setPendingContent([]); return; }
        const unique = (data || []).filter((row, i, arr) => arr.findIndex(r => r.id === row.id) === i);
        setPendingContent(unique);
      });
  }, [sb, toast]);

  React.useEffect(() => { fetchPending(); }, [fetchPending]);

  return { pendingContent, setPendingContent, fetchPending };
}

function PendingReviewRow({ row, onApprove, onReject, busy }) {
  const typeKey = row.type === 'film' ? 'movie' : row.type;
  const t = window.AICDB_TYPES[typeKey] || window.AICDB_TYPES['movie'];
  const submitter = (row.profiles && row.profiles.display_name) || '—';
  const submitted = (row.created_at || '').slice(0, 10);
  const noEmbed = row.embed_code == null || row.embed_code === '';
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px', background:'var(--bg-1)',
      border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', marginBottom:8 }}>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:4, flexWrap:'wrap' }}>
          <span style={{ font:'600 15px/1.2 var(--font-body)', color:'var(--fg-0)' }}>{row.title}</span>
          {noEmbed && (
            <span style={{ font:'600 11px/1 var(--font-body)', color:'var(--warning)', background:'rgba(229,178,59,0.12)', padding:'2px 7px', borderRadius:999 }}>
              No embed
            </span>
          )}
          <APill label={t.label} tone={t.color} />
        </div>
        <div style={{ font:'var(--text-body-sm)', color:'var(--fg-2)' }}>
          by <span style={{ color:'var(--fg-1)' }}>{submitter}</span> · submitted {submitted}
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8, flex:'none' }}>
        <button type="button" onClick={() => window.open('/index.html?film=' + row.id + '&preview=1', '_blank')}
          style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 13px', borderRadius:'var(--radius-md)',
            background:'var(--bg-2)', border:'1px solid var(--border-default)', color:'var(--fg-1)',
            font:'600 13px/1 var(--font-body)', cursor:'pointer' }}>
          <Icon name="eye" size={14} color="var(--fg-1)" /> Preview
        </button>
        <span style={{ opacity: noEmbed ? 0.5 : 1, display:'inline-flex' }}>
          <ABtn variant="approve" icon="check" disabled={busy || noEmbed} onClick={() => onApprove(row)}>Approve</ABtn>
        </span>
        <ABtn variant="reject" icon="x" disabled={busy} onClick={() => onReject(row)}>Reject</ABtn>
      </div>
    </div>
  );
}

function PendingReviewSection({ pendingContent, onApprove, onReject, busy }) {
  const [open, setOpen] = React.useState(true);
  if (!pendingContent.length) return null;
  return (
    <div style={{ marginBottom:22 }}>
      <button type="button" onClick={() => setOpen(o => !o)}
        style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'12px 16px', marginBottom: open ? 12 : 0,
          background:'rgba(229,178,59,0.08)', border:'1px solid rgba(229,178,59,0.3)', borderRadius:'var(--radius-md)',
          cursor:'pointer', textAlign:'left' }}>
        <Icon name={open ? 'caret-down' : 'caret-right'} size={14} color="var(--warning)" weight="bold" />
        <span style={{ font:'600 15px/1 var(--font-body)', color:'var(--fg-0)' }}>Pending Review</span>
        <span style={{ font:'600 11px/1 var(--font-body)', letterSpacing:'0.04em', textTransform:'uppercase',
          color:'var(--warning)', background:'rgba(229,178,59,0.15)', padding:'4px 8px', borderRadius:'var(--radius-pill)' }}>
          {pendingContent.length}
        </span>
      </button>
      {open && pendingContent.map(row => (
        <PendingReviewRow key={row.id} row={row} onApprove={onApprove} onReject={onReject} busy={busy} />
      ))}
    </div>
  );
}

function ContentPage({ toast }) {
  const [sb, setSb] = React.useState(null);
  const [tab, setTab] = React.useState('published');
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [modal, setModal] = React.useState(null);
  const [addOpen, setAddOpen] = React.useState(false);
  const [pendingBusy, setPendingBusy] = React.useState(false);
  const { pendingContent, setPendingContent, fetchPending } = usePendingContent(sb, toast);

  React.useEffect(() => {
    window.AICDB_AUTH.getClient().then(setSb);
  }, []);

  const loadItems = React.useCallback(() => {
    if (!sb) return;
    setLoading(true);
    sb.from('content')
      .select('*, profiles!submitted_by(username, display_name)')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) { toast('Failed to load content: ' + error.message); setLoading(false); return; }
        const mapped = (data || []).map(rowToItem);
        window.ADMIN_STATS.pendingReviews = mapped.filter(i => i.status === 'pending').length;
        window.ADMIN_STATS.totalContent   = mapped.filter(i => i.status === 'published').length;
        setItems(mapped.filter(i => i.status !== 'pending'));
        setLoading(false);
      });
  }, [sb, toast]);

  React.useEffect(() => {
    loadItems();
  }, [loadItems]);

  const approvePending = async (row) => {
    if (!sb || pendingBusy) return;
    setPendingBusy(true);
    console.log('APPROVE: attempting', row.id);
    const { data, error } = await sb.from('content')
      .update({ status: 'published', published_at: new Date().toISOString() })
      .eq('id', row.id);
    console.log('APPROVE: result', { data, error });
    setPendingBusy(false);
    if (error) { console.log('APPROVE: error detail', JSON.stringify(error)); toast('Error: ' + error.message); return; }
    setPendingContent(prev => prev.filter(r => r.id !== row.id));
    toast('"' + row.title + '" approved & published');
    loadItems();
  };

  const rejectPending = async (row) => {
    if (!sb || pendingBusy) return;
    setPendingBusy(true);
    const { error } = await sb.from('content')
      .update({ status: 'rejected' })
      .eq('id', row.id);
    setPendingBusy(false);
    if (error) { toast('Error: ' + error.message); return; }
    setPendingContent(list => list.filter(p => p.id !== row.id));
    toast('"' + row.title + '" rejected');
  };

  const counts = {
    published: items.filter(i => i.status === 'published').length,
    rejected:  items.filter(i => i.status === 'rejected').length,
  };
  const shown = items.filter(i => i.status === tab);

  const updateStatus = async (item, status, extra) => {
    const patch = Object.assign({ status, updated_at: new Date().toISOString() }, extra || {});
    const { error } = await sb.from('content').update(patch).eq('id', item.id);
    if (error) { toast('Error: ' + error.message); return; }
    setItems(list => list.map(i => i.id === item.id ? Object.assign({}, i, patch) : i));
  };

  const deleteItem = async (item) => {
    const { error } = await sb.from('content').delete().eq('id', item.id);
    if (error) { toast('Error: ' + error.message); return; }
    setItems(list => list.filter(i => i.id !== item.id));
  };

  const onAction = (mode, item) => {
    if (mode === 'approve') {
      updateStatus(item, 'published', { published_at: new Date().toISOString() })
        .then(() => toast('"' + item.title + '" approved & published'));
    } else if (mode === 'edit') {
      toast('Opening editor for "' + item.title + '"...');
    } else if (mode === 'reject') {
      setModal({ mode: 'reject', item });
    } else if (mode === 'remove') {
      setModal({ mode: 'remove', item });
    }
  };

  return (
    <div>
      <APageHead title="Content" sub="Review submissions, manage the live catalog, and handle rejected uploads.">
        <ABtn variant="primary" icon="plus" size="sm" onClick={() => setAddOpen(true)}>Add content</ABtn>
      </APageHead>
      <div style={{ marginBottom:22 }}>
        <ATabs active={tab} onChange={setTab} tabs={[
          { id:'published', label:'Published', count:counts.published, tone:'var(--success)' },
          { id:'rejected', label:'Rejected', count:counts.rejected, tone:'var(--danger)' },
        ]} />
      </div>

      <PendingReviewSection
        pendingContent={pendingContent}
        onApprove={approvePending}
        onReject={rejectPending}
        busy={pendingBusy}
      />

      {loading ? (
        <div style={{ padding:'40px 0', textAlign:'center', font:'var(--text-body-sm)', color:'var(--fg-3)' }}>
          <div style={{ width:28, height:28, borderRadius:'50%', border:'3px solid var(--border-default)', borderTopColor:'var(--coral)',
            animation:'spin 0.8s linear infinite', margin:'0 auto 12px' }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          Loading content...
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {shown.length ? shown.map(i => <ContentRow key={i.id} item={i} onAction={onAction} />)
            : <EmptyState icon="check-circle" accent="var(--teal)" compact title={'No ' + tab + ' content'} sub="You're all caught up here." />}
        </div>
      )}

      {modal && modal.mode === 'reject' && (
        <AReasonModal title={'Reject "' + modal.item.title + '"?'} sub="The creator will be notified with your reason."
          label="Reason for rejection" placeholder="e.g. Unauthorized likeness, low-effort content, duplicate..."
          confirmLabel="Reject submission" confirmVariant="reject" requireText
          onConfirm={(reason) => {
            updateStatus(modal.item, 'rejected', { rejection_reason: reason })
              .then(() => toast('"' + modal.item.title + '" rejected'));
          }}
          onClose={() => setModal(null)} />
      )}
      {modal && modal.mode === 'remove' && (
        <AReasonModal title={'Remove "' + modal.item.title + '"?'} sub="This permanently removes the title from Dreamwall. This can't be undone."
          confirmLabel="Remove permanently" confirmVariant="reject"
          onConfirm={() => {
            deleteItem(modal.item).then(() => toast('"' + modal.item.title + '" removed'));
          }}
          onClose={() => setModal(null)} />
      )}

      {addOpen && sb && (
        <AdminAddContentModal
          sb={sb}
          toast={toast}
          onClose={() => setAddOpen(false)}
          onDone={(row) => {
            if (row) setItems(list => [rowToItem(row), ...list]);
            setTab('published');
          }}
        />
      )}
    </div>
  );
}

// ============================================================
// Reports — Reported Content / Reported Comments
// ============================================================
function ReportRow({ r, onAction }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:16, padding:'16px 18px', background:'var(--bg-1)',
      border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)' }}>
      <div style={{ width:34, height:34, borderRadius:'var(--radius-md)', flex:'none', display:'flex', alignItems:'center', justifyContent:'center',
        background:`${statusColor(r.severity)}1f` }}>
        <Icon name="flag" size={16} color={statusColor(r.severity)} weight="fill" />
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:5, flexWrap:'wrap' }}>
          <span style={{ font:'600 15px/1.3 var(--font-body)', color:'var(--fg-0)' }}>{r.target}</span>
          <APill label={r.severity + ' priority'} tone={statusColor(r.severity)} />
          <span style={{ font:'var(--text-data-sm)', color:'var(--fg-3)' }}>{r.targetType}</span>
        </div>
        <div style={{ font:'var(--text-body-sm)', color:'var(--fg-1)', marginBottom:4 }}>
          <Icon name="warning-circle" size={13} color="var(--fg-2)" /> {r.reason}
        </div>
        <div style={{ font:'var(--text-body-sm)', color:'var(--fg-2)' }}>
          Reported by <span style={{ color:'var(--fg-1)' }}>{r.by}</span> · {r.date}
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', justifyContent:'flex-end' }}>
        <ABtn variant="reject" icon="trash" onClick={() => onAction('remove', r)}>Remove content</ABtn>
        <ABtn variant="warn" icon="warning" onClick={() => onAction('warn', r)}>Warn user</ABtn>
        <ABtn variant="ghost" icon="check" onClick={() => onAction('dismiss', r)}>Dismiss</ABtn>
      </div>
    </div>
  );
}

function ReportsPage({ toast }) {
  const [tab, setTab] = React.useState('content');
  const [data, setData] = React.useState({ content: [], comments: [], bugs: [] });
  const shown = data[tab] || [];
  const resolve = (r, verb) => { setData(d => ({ ...d, [tab]: d[tab].filter(x => x.id !== r.id) })); toast(verb); };
  const onAction = (mode, r) => {
    if (mode === 'remove') resolve(r, 'Content removed & report closed');
    else if (mode === 'warn') resolve(r, 'Warning issued');
    else resolve(r, 'Report dismissed');
  };
  const onBug = (mode, r) => {
    if (mode === 'fixed') resolve(r, 'Bug marked fixed & report closed');
    else if (mode === 'badge') resolve(r, 'Bug Hunter badge awarded to ' + r.by);
    else resolve(r, 'Bug report dismissed');
  };
  return (
    <div>
      <APageHead title="Reports" sub="Community flags and beta bug reports awaiting moderation. High-priority items first." />
      <div style={{ marginBottom:22 }}>
        <ATabs active={tab} onChange={setTab} tabs={[
          { id:'content', label:'Reported Content', count:data.content.length, tone:'var(--danger)' },
          { id:'comments', label:'Reported Comments', count:data.comments.length, tone:'var(--danger)' },
          { id:'bugs', label:'Bug Reports', count:data.bugs.length, tone:'var(--teal)' },
        ]} />
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {tab === 'bugs'
          ? (shown.length ? shown.map(r => <BugReportRow key={r.id} r={r} onAction={onBug} />)
              : <EmptyState icon="bug-beetle" accent="var(--teal)" compact title="No open bug reports" sub="Beta testers haven't flagged anything new. Smooth sailing." />)
          : (shown.length ? shown.map(r => <ReportRow key={r.id} r={r} onAction={onAction} />)
              : <EmptyState icon="shield-check" accent="var(--teal)" compact title="Queue clear" sub="No open reports in this category. Nice." />)}
      </div>
    </div>
  );
}

function BugReportRow({ r, onAction }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:16, padding:'16px 18px', background:'var(--bg-1)',
      border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)' }}>
      <div style={{ width:34, height:34, borderRadius:'var(--radius-md)', flex:'none', display:'flex', alignItems:'center', justifyContent:'center',
        background:'var(--teal-ghost)' }}>
        <Icon name="bug-beetle" size={17} color="var(--teal-bright)" weight="fill" />
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:6, flexWrap:'wrap' }}>
          <span style={{ font:'600 14px/1.2 var(--font-body)', color:'var(--fg-0)' }}>{r.by}</span>
          <APill label={r.page} tone="var(--info)" icon="map-pin" />
          {r.image && (
            <span style={{ display:'inline-flex', alignItems:'center', gap:5, font:'var(--text-data-sm)', color:'var(--fg-2)' }}>
              <Icon name="paperclip" size={13} color="var(--fg-2)" /> 1 image
            </span>
          )}
        </div>
        <div style={{ font:'var(--text-body-sm)', color:'var(--fg-1)', marginBottom:6 }}>{r.desc}</div>
        <div style={{ font:'var(--text-data-sm)', color:'var(--fg-3)' }}>Reported {r.date}</div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', justifyContent:'flex-end' }}>
        <ABtn variant="approve" icon="check" onClick={() => onAction('fixed', r)}>Mark fixed</ABtn>
        <ABtn variant="warn" icon="medal" onClick={() => onAction('badge', r)}>Award badge</ABtn>
        <ABtn variant="ghost" icon="x" onClick={() => onAction('dismiss', r)}>Dismiss</ABtn>
      </div>
    </div>
  );
}

// ============================================================
// Badge management
// ============================================================
function BadgesPage({ toast }) {
  const [items, setItems] = React.useState([]);
  const [filter, setFilter] = React.useState('all');

  React.useEffect(() => {
    window.AICDB_AUTH.getClient().then(sb => {
      sb.from('content')
        .select('id, title, type, slug')
        .eq('status', 'published')
        .order('title')
        .then(({ data }) => setItems((data || []).map(r => ({ ...r, _staff: false }))));
    });
  }, []);

  const toggleStaff = (item) => {
    setItems(list => list.map(f => f.id === item.id ? { ...f, _staff: !f._staff } : f));
    toast(item._staff ? 'Staff Pick removed from "' + item.title + '"' : '"' + item.title + '" marked as Staff Pick');
  };

  const shown = items.filter(f =>
    filter === 'staff' ? f._staff :
    filter === 'none'  ? !f._staff : true
  );

  return (
    <div>
      <APageHead title="Badges" sub="Manually mark published titles as Staff Picks." />
      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
        {[['all','All content'],['staff','Staff Picks'],['none','No badges']].map(([id, label]) => (
          <ABtn key={id} variant={filter === id ? 'neutral' : 'ghost'} onClick={() => setFilter(id)}>{label}</ABtn>
        ))}
      </div>
      {shown.length === 0 ? (
        <EmptyState icon="medal" accent="var(--coral)" compact title="No published content yet" sub="Approve some submissions to manage badges here." />
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {shown.map(f => (
            <div key={f.id} style={{ display:'flex', alignItems:'center', gap:16, padding:'12px 18px', background:'var(--bg-1)',
              border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)' }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ font:'600 15px/1.2 var(--font-body)', color:'var(--fg-0)' }}>{f.title}</div>
                <div style={{ font:'var(--text-data-sm)', color:'var(--fg-2)', marginTop:4 }}>{f.type}</div>
              </div>
              {f._staff && <APill label="Staff Pick" tone="var(--coral)" solid icon="medal" />}
              <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                <span style={{ font:'var(--text-body-sm)', color: f._staff ? 'var(--coral-bright)' : 'var(--fg-2)' }}>Staff Pick</span>
                <AToggle on={f._staff} onChange={() => toggleStaff(f)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { ContentPage, ContentRow, ReportsPage, ReportRow, BugReportRow, BadgesPage });
