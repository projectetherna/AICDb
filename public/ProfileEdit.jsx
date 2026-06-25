// Dreamwall — profile edit slide-over panel

// ---- Edit Profile Panel (right slide-over) ----
// Using a slide-over panel rather than a centred modal because:
//   • The 6 editable fields (photo, banner, name, bio, quote, quote_from) need
//     vertical breathing room that a compact modal can't give without scrolling.
//   • A slide-over lets the user see their live profile behind it for reference.
//   • It matches common settings-panel UX without hiding the page entirely.
function ImageUploadField({ label, hint, previewUrl, onUpload, uploading, uploadError }) {
  const ref = React.useRef(null);
  const [localPreview, setLocalPreview] = React.useState(null);

  const handleFile = async (file) => {
    if (!file) return;
    // Show local blob preview immediately so the user sees their pick right away.
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    await onUpload(file);
  };

  const src = localPreview || previewUrl;

  return (
    <div>
      <span className="overline" style={{ display:'block', marginBottom:8, color:'var(--fg-2)' }}>{label}</span>
      {hint && <p style={{ font:'var(--text-body-sm)', color:'var(--fg-3)', margin:'0 0 10px' }}>{hint}</p>}
      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
        {src ? (
          <img src={src} alt=""
            style={{ width:72, height:72, borderRadius:'var(--radius-md)', objectFit:'cover',
              border:'1px solid var(--border-default)', flex:'none' }} />
        ) : (
          <div style={{ width:72, height:72, borderRadius:'var(--radius-md)', flex:'none',
            background:'var(--bg-3)', border:'1px dashed var(--border-default)',
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon name="image" size={24} color="var(--fg-3)" />
          </div>
        )}
        <div style={{ minWidth:0 }}>
          <button onClick={() => ref.current && ref.current.click()} disabled={uploading}
            style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'9px 15px',
              borderRadius:'var(--radius-md)', cursor: uploading ? 'default' : 'pointer',
              background:'var(--bg-2)', border:'1px solid var(--border-default)',
              color: uploading ? 'var(--fg-3)' : 'var(--fg-1)', font:'600 13px/1 var(--font-body)',
              transition:'all var(--dur-fast)' }}
            onMouseEnter={e => { if (!uploading) { e.currentTarget.style.borderColor='var(--border-accent)'; e.currentTarget.style.color='var(--fg-0)'; } }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-default)'; e.currentTarget.style.color='var(--fg-1)'; }}>
            <Icon name={uploading ? 'spinner' : 'upload-simple'} size={14} color="currentColor" />
            {uploading ? 'Uploading…' : src ? 'Replace' : 'Upload'}
          </button>
          <p style={{ font:'var(--text-body-sm)', color:'var(--fg-3)', margin:'7px 0 0' }}>JPEG, PNG, WebP · max 5 MB</p>
          {uploadError && (
            <p style={{ display:'flex', alignItems:'center', gap:6, font:'var(--text-body-sm)', color:'var(--danger)', margin:'6px 0 0' }}>
              <Icon name="warning-circle" size={13} color="var(--danger)" weight="fill" />{uploadError}
            </p>
          )}
        </div>
      </div>
      <input ref={ref} type="file" accept="image/*" style={{ display:'none' }}
        onChange={e => { const f = e.target.files && e.target.files[0]; if (f) handleFile(f); e.target.value = ''; }} />
    </div>
  );
}

function EditProfilePanel({ onClose, onSaved }) {
  const [displayName, setDisplayName] = React.useState(PROFILE.name === 'Guest' ? '' : PROFILE.name);
  const [bio,       setBio]       = React.useState(PROFILE.bio || '');
  const [quote,     setQuote]     = React.useState(PROFILE.quote || '');
  const [quoteFrom, setQuoteFrom] = React.useState(PROFILE.quoteFrom || '');

  // These hold the committed public URLs (set after a successful upload).
  const [avatarUrl, setAvatarUrl] = React.useState(PROFILE.avatarUrl || null);
  const [bannerUrl, setBannerUrl] = React.useState(PROFILE.bannerUrl || null);

  // Upload states per image field — independent so one failure doesn't block the other.
  const [avatarUploading, setAvatarUploading] = React.useState(false);
  const [avatarUploadErr, setAvatarUploadErr] = React.useState('');
  const [bannerUploading, setBannerUploading] = React.useState(false);
  const [bannerUploadErr, setBannerUploadErr] = React.useState('');

  const [saving, setSaving] = React.useState(false);
  const [error,  setError]  = React.useState('');
  const [saved,  setSaved]  = React.useState(false);

  // Slide-in on mount, slide-out on close.
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);
  const close = () => {
    setVisible(false);
    setTimeout(onClose, 280);
  };

  React.useEffect(() => {
    const h = e => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const handleAvatarUpload = async (file) => {
    setAvatarUploading(true);
    setAvatarUploadErr('');
    try {
      const { publicUrl } = await window.AICDB_AUTH.uploadImage({ file, path: 'avatar.jpg' });
      setAvatarUrl(publicUrl);
    } catch (err) {
      setAvatarUploadErr(err.message || 'Avatar upload failed.');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleBannerUpload = async (file) => {
    setBannerUploading(true);
    setBannerUploadErr('');
    try {
      const { publicUrl } = await window.AICDB_AUTH.uploadImage({ file, path: 'banner.jpg' });
      setBannerUrl(publicUrl);
    } catch (err) {
      setBannerUploadErr(err.message || 'Banner upload failed.');
    } finally {
      setBannerUploading(false);
    }
  };

  const save = async () => {
    const name = displayName.trim();
    if (!name) { setError('Display name is required.'); return; }
    setError('');
    setSaving(true);
    setSaved(false);
    try {
      const data = await window.AICDB_AUTH.updateProfile({
        display_name: name,
        bio:          bio.trim(),
        avatar_url:   avatarUrl,
        banner_url:   bannerUrl,
        quote:        quote.trim(),
        quote_from:   quoteFrom.trim(),
      });
      PROFILE.name      = data.display_name.charAt(0).toUpperCase() + data.display_name.slice(1);
      PROFILE.initials  = PROFILE.name.charAt(0).toUpperCase();
      PROFILE.bio       = data.bio       || '';
      PROFILE.avatarUrl = data.avatar_url || null;
      PROFILE.bannerUrl = data.banner_url || null;
      PROFILE.quote     = data.quote      || '';
      PROFILE.quoteFrom = data.quote_from || '';
      setSaved(true);
      setTimeout(() => { onSaved && onSaved(); close(); }, 900);
    } catch (err) {
      setError(err.message || 'Could not save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%', font: 'var(--text-body)', color: 'var(--fg-0)',
    background: 'var(--bg-3)', border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-md)', padding: '11px 13px', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color var(--dur-fast)',
  };
  const focusIn  = e => { e.target.style.borderColor = 'var(--border-accent)'; };
  const focusOut = e => { e.target.style.borderColor = 'var(--border-default)'; };

  const PANEL_W = 480;

  return (
    <>
      <style>{`
        @keyframes epPanelIn  { from { transform:translateX(100%) } to { transform:translateX(0) } }
        @keyframes epPanelOut { from { transform:translateX(0) } to { transform:translateX(100%) } }
        @keyframes epScrimIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes epScrimOut { from { opacity:1 } to { opacity:0 } }
      `}</style>

      {/* scrim */}
      <div onClick={close}
        style={{ position:'fixed', inset:0, zIndex:1100,
          background:'rgba(5,5,5,0.60)', backdropFilter:'blur(4px)', WebkitBackdropFilter:'blur(4px)',
          animation: `${visible ? 'epScrimIn' : 'epScrimOut'} 0.28s var(--ease-out) both` }} />

      {/* panel */}
      <div style={{ position:'fixed', top:0, right:0, bottom:0, width:PANEL_W, maxWidth:'95vw', zIndex:1101,
        background:'var(--bg-1)', borderLeft:'1px solid var(--border-default)',
        boxShadow:'-8px 0 40px rgba(0,0,0,0.45)', display:'flex', flexDirection:'column',
        animation: `${visible ? 'epPanelIn' : 'epPanelOut'} 0.28s var(--ease-out) both` }}>

        {/* header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'20px 24px 18px', borderBottom:'1px solid var(--border-subtle)', flex:'none' }}>
          <div>
            <h2 style={{ font:'700 20px/1.1 var(--font-display)', color:'var(--fg-0)', margin:0 }}>Edit profile</h2>
            <p style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', margin:'4px 0 0' }}>Changes are saved to your account</p>
          </div>
          <button onClick={close} aria-label="Close panel"
            style={{ width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center',
              background:'var(--bg-2)', border:'1px solid var(--border-subtle)',
              borderRadius:'var(--radius-pill)', cursor:'pointer', color:'var(--fg-1)', flex:'none' }}>
            <Icon name="x" size={16} />
          </button>
        </div>

        {/* scrollable body */}
        <div style={{ flex:1, overflowY:'auto', padding:'24px 24px 0' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:26 }}>

            {/* â”€â”€ Photos section â”€â”€ */}
            <div>
              <h3 style={{ font:'600 13px/1 var(--font-body)', letterSpacing:'0.06em', textTransform:'uppercase',
                color:'var(--fg-3)', margin:'0 0 18px' }}>Photos</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
                <ImageUploadField
                  label="Profile photo"
                  hint="Shown in your avatar circle. Replaces the gradient initials when set."
                  previewUrl={avatarUrl}
                  onUpload={handleAvatarUpload}
                  uploading={avatarUploading}
                  uploadError={avatarUploadErr} />
                <ImageUploadField
                  label="Banner image"
                  hint="Wide cinematic strip at the top of your profile."
                  previewUrl={bannerUrl}
                  onUpload={handleBannerUpload}
                  uploading={bannerUploading}
                  uploadError={bannerUploadErr} />
              </div>
            </div>

            <div style={{ height:1, background:'var(--border-subtle)' }} />

            {/* â”€â”€ Identity section â”€â”€ */}
            <div>
              <h3 style={{ font:'600 13px/1 var(--font-body)', letterSpacing:'0.06em', textTransform:'uppercase',
                color:'var(--fg-3)', margin:'0 0 18px' }}>Identity</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <label style={{ display:'block' }}>
                  <span className="overline" style={{ display:'block', marginBottom:7, color:'var(--fg-2)' }}>Display name</span>
                  <input value={displayName}
                    onChange={e => { setDisplayName(e.target.value); setError(''); setSaved(false); }}
                    onKeyDown={e => { if (e.key === 'Enter') save(); }}
                    placeholder="Your name"
                    style={{ ...inputStyle, borderColor: error && !displayName.trim() ? 'var(--danger)' : 'var(--border-default)' }}
                    onFocus={focusIn} onBlur={focusOut} />
                </label>
                <label style={{ display:'block' }}>
                  <span className="overline" style={{ display:'block', marginBottom:7, color:'var(--fg-2)' }}>
                    Bio <span style={{ color:'var(--fg-3)', fontWeight:400, textTransform:'none', fontSize:'0.95em' }}>(optional)</span>
                  </span>
                  <textarea value={bio} onChange={e => { setBio(e.target.value); setSaved(false); }}
                    placeholder="A sentence or two about you…" rows={3}
                    style={{ ...inputStyle, resize:'vertical', minHeight:80, lineHeight:1.5 }}
                    onFocus={focusIn} onBlur={focusOut} />
                </label>
              </div>
            </div>

            <div style={{ height:1, background:'var(--border-subtle)' }} />

            {/* â”€â”€ Quote section â”€â”€ */}
            <div>
              <h3 style={{ font:'600 13px/1 var(--font-body)', letterSpacing:'0.06em', textTransform:'uppercase',
                color:'var(--fg-3)', margin:'0 0 4px' }}>Favourite quote</h3>
              <p style={{ font:'var(--text-body-sm)', color:'var(--fg-3)', margin:'0 0 18px' }}>
                Shown in italic below your name on the profile. Leave blank to hide.
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <label style={{ display:'block' }}>
                  <span className="overline" style={{ display:'block', marginBottom:7, color:'var(--fg-2)' }}>Quote</span>
                  <textarea value={quote} onChange={e => { setQuote(e.target.value); setSaved(false); }}
                    placeholder='"The cinema is not a slice of life but a piece of cake."'
                    rows={2}
                    style={{ ...inputStyle, resize:'vertical', minHeight:64, lineHeight:1.5, fontStyle: quote ? 'italic' : 'normal' }}
                    onFocus={focusIn} onBlur={focusOut} />
                </label>
                <label style={{ display:'block' }}>
                  <span className="overline" style={{ display:'block', marginBottom:7, color:'var(--fg-2)' }}>
                    From (film name) <span style={{ color:'var(--fg-3)', fontWeight:400, textTransform:'none', fontSize:'0.95em' }}>(optional)</span>
                  </span>
                  <input value={quoteFrom}
                    onChange={e => { setQuoteFrom(e.target.value); setSaved(false); }}
                    placeholder="e.g. Sunset Boulevard"
                    style={inputStyle}
                    onFocus={focusIn} onBlur={focusOut} />
                  <p style={{ font:'var(--text-body-sm)', color:'var(--fg-3)', margin:'6px 0 0' }}>
                    Renders as "— Sunset Boulevard" beneath the quote.
                  </p>
                </label>
              </div>

              {/* live quote preview */}
              {quote.trim() && (
                <div style={{ marginTop:18, padding:'14px 16px', background:'var(--bg-0)',
                  borderLeft:'2px solid var(--coral-dim)', borderRadius:'0 var(--radius-md) var(--radius-md) 0' }}>
                  <p style={{ font:'400 italic 14px/1.5 var(--font-display)', color:'var(--fg-1)', margin:0 }}>
                    "{quote.trim()}"
                  </p>
                  {quoteFrom.trim() && (
                    <p style={{ font:'500 13px/1 var(--font-body)', color:'var(--fg-2)', margin:'8px 0 0' }}>
                      — {quoteFrom.trim()}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* spacer so content doesn't sit under the sticky footer */}
            <div style={{ height:24 }} />
          </div>
        </div>

        {/* sticky footer */}
        <div style={{ padding:'16px 24px', borderTop:'1px solid var(--border-subtle)', flex:'none',
          background:'var(--bg-1)', display:'flex', flexDirection:'column', gap:10 }}>
          {error && (
            <p style={{ display:'flex', alignItems:'center', gap:7, font:'var(--text-body-sm)', color:'var(--danger)', margin:0 }}>
              <Icon name="warning-circle" size={14} color="var(--danger)" weight="fill" />{error}
            </p>
          )}
          {saved && (
            <p style={{ display:'flex', alignItems:'center', gap:7, font:'var(--text-body-sm)', color:'var(--teal)', margin:0 }}>
              <Icon name="check-circle" size={14} color="var(--teal)" weight="fill" />Profile saved!
            </p>
          )}
          <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
            <button onClick={close}
              style={{ padding:'11px 20px', borderRadius:'var(--radius-md)', cursor:'pointer', font:'600 14px/1 var(--font-body)',
                background:'var(--bg-2)', border:'1px solid var(--border-default)', color:'var(--fg-1)',
                transition:'all var(--dur-fast)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border-strong)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-default)'; }}>
              Cancel
            </button>
            <button onClick={save} disabled={saving || avatarUploading || bannerUploading}
              style={{ padding:'11px 24px', borderRadius:'var(--radius-md)',
                cursor: (saving || avatarUploading || bannerUploading) ? 'default' : 'pointer',
                font:'600 14px/1 var(--font-body)', border:'none',
                background: (saving || avatarUploading || bannerUploading) ? 'var(--bg-3)' : 'var(--coral)',
                color:      (saving || avatarUploading || bannerUploading) ? 'var(--fg-3)' : 'var(--fg-on-accent)',
                transition:'background var(--dur-fast)' }}
              onMouseEnter={e => { if (!saving && !avatarUploading && !bannerUploading) e.currentTarget.style.background='var(--coral-bright)'; }}
              onMouseLeave={e => { if (!saving && !avatarUploading && !bannerUploading) e.currentTarget.style.background='var(--coral)'; }}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { EditProfilePanel });
