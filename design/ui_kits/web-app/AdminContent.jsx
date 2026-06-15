// Dreamwall — Admin Panel: Content management, Reports, Badge management.

// ============================================================
// Content management — Pending / Published / Rejected
// ============================================================
function ContentRow({ item, onAction }) {
  const t = window.AICDB_TYPES[item.type];
  return (
    <div style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 18px', background:'var(--bg-1)',
      border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)' }}>
      <AThumb g={item.g} type={item.type} w={44} />
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

function ContentPage({ toast }) {
  const [tab, setTab] = React.useState('pending');
  const [items, setItems] = React.useState(window.ADMIN_SUBMISSIONS);
  const [modal, setModal] = React.useState(null); // {mode, item}

  const counts = {
    pending: items.filter(i => i.status === 'pending').length,
    published: items.filter(i => i.status === 'published').length,
    rejected: items.filter(i => i.status === 'rejected').length,
  };
  const shown = items.filter(i => i.status === tab);

  const setStatus = (item, status) => setItems(list => list.map(i => i.id === item.id ? { ...i, status } : i));
  const removeItem = (item) => setItems(list => list.filter(i => i.id !== item.id));

  const onAction = (mode, item) => {
    if (mode === 'approve') { setStatus(item, 'published'); toast(`“${item.title}” approved & published`); }
    else if (mode === 'edit') { toast(`Opening editor for “${item.title}”…`); }
    else if (mode === 'reject') { setModal({ mode:'reject', item }); }
    else if (mode === 'remove') { setModal({ mode:'remove', item }); }
  };

  return (
    <div>
      <APageHead title="Content" sub="Review submissions, manage the live catalog, and handle rejected uploads.">
        <ABtn variant="primary" icon="plus" size="sm">Add content</ABtn>
      </APageHead>
      <div style={{ marginBottom:22 }}>
        <ATabs active={tab} onChange={setTab} tabs={[
          { id:'pending', label:'Pending', count:counts.pending, tone:'var(--warning)' },
          { id:'published', label:'Published', count:counts.published, tone:'var(--success)' },
          { id:'rejected', label:'Rejected', count:counts.rejected, tone:'var(--danger)' },
        ]} />
      </div>

      {tab === 'pending' && counts.pending > 0 && (
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', marginBottom:16,
          background:'rgba(229,178,59,0.08)', border:'1px solid rgba(229,178,59,0.3)', borderRadius:'var(--radius-md)' }}>
          <Icon name="hourglass-medium" size={16} color="var(--warning)" weight="fill" />
          <span style={{ font:'var(--text-body-sm)', color:'var(--fg-1)' }}>
            <b style={{ color:'var(--fg-0)' }}>{counts.pending} submissions</b> are waiting for review — oldest first.
          </span>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {shown.length ? shown.map(i => <ContentRow key={i.id} item={i} onAction={onAction} />)
          : <EmptyState icon="check-circle" accent="var(--teal)" compact title={`No ${tab} content`} sub="You're all caught up here." />}
      </div>

      {modal && modal.mode === 'reject' && (
        <AReasonModal title={`Reject “${modal.item.title}”?`} sub="The creator will be notified with your reason."
          label="Reason for rejection" placeholder="e.g. Unauthorized likeness, low-effort content, duplicate…"
          confirmLabel="Reject submission" confirmVariant="reject" requireText
          onConfirm={(reason) => { setItems(list => list.map(i => i.id === modal.item.id ? { ...i, status:'rejected', reason } : i)); toast(`“${modal.item.title}” rejected`); }}
          onClose={() => setModal(null)} />
      )}
      {modal && modal.mode === 'remove' && (
        <AReasonModal title={`Remove “${modal.item.title}”?`} sub="This permanently removes the title from Dreamwall. This can't be undone."
          confirmLabel="Remove permanently" confirmVariant="reject"
          onConfirm={() => { removeItem(modal.item); toast(`“${modal.item.title}” removed`); }}
          onClose={() => setModal(null)} />
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
  const [data, setData] = React.useState({ ...window.ADMIN_REPORTS, bugs: window.ADMIN_BUG_REPORTS });
  const shown = data[tab];
  const resolve = (r, verb) => { setData(d => ({ ...d, [tab]: d[tab].filter(x => x.id !== r.id) })); toast(verb); };
  const onAction = (mode, r) => {
    if (mode === 'remove') resolve(r, 'Content removed & report closed');
    else if (mode === 'warn') resolve(r, `Warning sent to ${r.by === r.by ? r.target : ''}`.trim() || 'Warning issued');
    else resolve(r, 'Report dismissed');
  };
  const onBug = (mode, r) => {
    if (mode === 'fixed') resolve(r, 'Bug marked fixed & report closed');
    else if (mode === 'badge') resolve(r, `Bug Hunter badge awarded to ${r.by}`);
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

// a single beta bug report row
function BugReportRow({ r, onAction }) {
  const u = (window.ADMIN_USERS || []).find(x => x.handle === r.by);
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:16, padding:'16px 18px', background:'var(--bg-1)',
      border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)' }}>
      <div style={{ width:34, height:34, borderRadius:'var(--radius-md)', flex:'none', display:'flex', alignItems:'center', justifyContent:'center',
        background:'var(--teal-ghost)' }}>
        <Icon name="bug-beetle" size={17} color="var(--teal-bright)" weight="fill" />
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:6, flexWrap:'wrap' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7 }}>
            {u && <Avatar size={20} colors={u.av} />}
            <span style={{ font:'600 14px/1.2 var(--font-body)', color:'var(--fg-0)' }}>{r.by}</span>
          </div>
          <APill label={r.page} tone="var(--info)" icon="map-pin" />
          {r.image && (
            <span style={{ display:'inline-flex', alignItems:'center', gap:5, font:'var(--text-data-sm)', color:'var(--fg-2)' }}>
              <Icon name="paperclip" size={13} color="var(--fg-2)" /> 1 image
            </span>
          )}
        </div>
        <div style={{ font:'var(--text-body-sm)', color:'var(--fg-1)', marginBottom:6, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{r.desc}</div>
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
// Badge management — Staff Pick (manual) + Hidden Gem (auto)
// ============================================================
function BadgeRow({ film, onToggleStaff }) {
  const auto = window.AICDB_RIBBON(film) === 'gem';
  const isStaff = !!film._staff;
  const views = Math.round(window.AICDB_STAT(film).watched);
  return (
    <div style={{ display:'flex', alignItems:'center', gap:16, padding:'12px 18px', background:'var(--bg-1)',
      border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)' }}>
      <AThumb g={film.g} type={film.type} w={40} />
      <div style={{ flex:'1 1 180px', minWidth:0 }}>
        <div style={{ font:'600 15px/1.2 var(--font-body)', color:'var(--fg-0)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{film.title}</div>
        <div style={{ font:'var(--text-data-sm)', color:'var(--fg-2)', marginTop:4 }}>
          <span style={{ color:scoreColor(film.score), fontWeight:700 }}>{film.score.toFixed(1)}</span> · {fmtCount(views)} views · {film.creator}
        </div>
      </div>
      {/* current badges */}
      <div style={{ display:'flex', alignItems:'center', gap:8, flex:'none', minWidth:200, justifyContent:'flex-end' }}>
        {isStaff && <APill label="Staff Pick" tone="var(--coral)" solid icon="medal" />}
        {auto && <APill label="Hidden Gem · auto" tone="var(--teal)" solid icon="diamond" />}
        {!isStaff && !auto && <span style={{ font:'var(--text-body-sm)', color:'var(--fg-3)' }}>No badges</span>}
      </div>
      {/* controls */}
      <div style={{ display:'flex', alignItems:'center', gap:18, flex:'none', paddingLeft:18, borderLeft:'1px solid var(--border-subtle)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <span style={{ font:'var(--text-body-sm)', color: isStaff ? 'var(--coral-bright)' : 'var(--fg-2)' }}>Staff Pick</span>
          <AToggle on={isStaff} onChange={() => onToggleStaff(film)} />
        </div>
      </div>
    </div>
  );
}

function BadgesPage({ toast }) {
  const [films, setFilms] = React.useState(() =>
    window.AICDB_FILMS.map(f => ({ ...f, _staff: !!f.staffPick })));
  const [filter, setFilter] = React.useState('all');
  const toggleStaff = (film) => {
    setFilms(list => list.map(f => f.id === film.id ? { ...f, _staff: !f._staff } : f));
    toast(film._staff ? `Staff Pick removed from “${film.title}”` : `“${film.title}” marked as Staff Pick`);
  };
  const shown = films.filter(f => filter === 'all' ? true
    : filter === 'staff' ? f._staff
    : filter === 'gem' ? window.AICDB_RIBBON(f) === 'gem'
    : !f._staff && window.AICDB_RIBBON(f) !== 'gem');

  return (
    <div>
      <APageHead title="Badges" sub="Staff Pick is assigned manually. Hidden Gem is auto-awarded to high-rated, low-view titles — override below." />
      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
        {[['all','All content'],['staff','Staff Picks'],['gem','Hidden Gems'],['none','No badges']].map(([id, label]) => (
          <ABtn key={id} variant={filter === id ? 'neutral' : 'ghost'} onClick={() => setFilter(id)}>{label}</ABtn>
        ))}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:18, padding:'12px 18px', marginBottom:16,
        background:'var(--bg-1)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}><APill label="Staff Pick" tone="var(--coral)" solid icon="medal" /><span style={{ font:'var(--text-body-sm)', color:'var(--fg-2)' }}>editorially selected</span></div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}><APill label="Hidden Gem" tone="var(--teal)" solid icon="diamond" /><span style={{ font:'var(--text-body-sm)', color:'var(--fg-2)' }}>auto: score ≥ 8.0 &amp; under 9k ratings</span></div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {shown.map(f => <BadgeRow key={f.id} film={f} onToggleStaff={toggleStaff} />)}
      </div>
    </div>
  );
}

Object.assign(window, { ContentPage, ContentRow, ReportsPage, ReportRow, BugReportRow, BadgesPage, BadgeRow });
