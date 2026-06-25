// Dreamwall ù Creator profile edit panel (slide-over)

// ---- URL validation (same rules as CreatorSetup.jsx) ----
function validateSocialUrl(platform, url) {
  const u = (url || '').trim();
  if (!u) return true;
  const lower = u.toLowerCase();
  switch (platform) {
    case 'youtube':
      return lower.includes('youtube.com') || lower.includes('youtu.be');
    case 'instagram':
      return lower.includes('instagram.com');
    case 'x':
      return lower.includes('x.com') || lower.includes('twitter.com');
    case 'tiktok':
      return lower.includes('tiktok.com');
    case 'website':
      return /^https?:\/\//i.test(u);
    default:
      return true;
  }
}

const SOCIAL_PLATFORM_LABELS = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  x: 'X',
  tiktok: 'TikTok',
  website: 'Website',
};

function CreatorEditToggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} role="switch" aria-checked={on}
      style={{ width:46, height:26, flex:'none', borderRadius:'var(--radius-pill)', border:'none', cursor:'pointer',
        padding:3, display:'flex', alignItems:'center', background: on ? 'var(--teal)' : 'var(--bg-3)',
        justifyContent: on ? 'flex-end' : 'flex-start', transition:'background var(--dur-base) var(--ease-out)' }}>
      <span style={{ width:20, height:20, borderRadius:'50%', background: on ? '#04201e' : 'var(--fg-2)', boxShadow:'var(--shadow-1)' }} />
    </button>
  );
}

function CreatorEditPanel({ creator, onClose, onSaved }) {
  const socialDefaults = () => {
    const raw = creator.social || {};
    const out = { youtube:'', instagram:'', x:'', tiktok:'', website:'' };
    Object.keys(out).forEach(k => {
      const v = raw[k];
      out[k] = (v && v !== '#') ? v : '';
    });
    return out;
  };

  const [displayName, setDisplayName] = React.useState(creator.name || '');
  const [handle, setHandle] = React.useState((creator.handle || '').replace(/^@/, ''));
  const [location, setLocation] = React.useState(creator.location === 'Online' ? '' : (creator.location || ''));
  const [bio, setBio] = React.useState(creator.manifesto || '');
  const [notes, setNotes] = React.useState(creator.notes || '');
  const [social, setSocial] = React.useState(socialDefaults);
  const [showOnProfile, setShowOnProfile] = React.useState(creator.showOnProfile !== false);
  const [avatarUrl, setAvatarUrl] = React.useState(creator.avatarImg || null);
  const [bannerUrl, setBannerUrl] = React.useState(creator.banner || null);
  const [avatarUploading, setAvatarUploading] = React.useState(false);
  const [bannerUploading, setBannerUploading] = React.useState(false);
  const [uploadErr, setUploadErr] = React.useState('');
  const [socialErrors, setSocialErrors] = React.useState({});
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');

  const avatarInputRef = React.useRef(null);
  const bannerInputRef = React.useRef(null);

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
    setUploadErr('');
    try {
      const { publicUrl } = await window.AICDB_AUTH.uploadImage({ file, path: 'creator_avatar_' + (creator.id || creator.accountId) + '.jpg' });
      setAvatarUrl(publicUrl);
    } catch (err) { setUploadErr(err.message || 'Upload failed.'); }
    finally { setAvatarUploading(false); }
  };

  const handleBannerUpload = async (file) => {
    setBannerUploading(true);
    setUploadErr('');
    try {
      const { publicUrl } = await window.AICDB_AUTH.uploadImage({ file, path: 'creator_banner_' + (creator.id || creator.accountId) + '.jpg' });
      setBannerUrl(publicUrl);
    } catch (err) { setUploadErr(err.message || 'Upload failed.'); }
    finally { setBannerUploading(false); }
  };

  const setSoc = (key) => (value) => {
    setSocial(s => ({ ...s, [key]: value }));
    if (!value.trim() || validateSocialUrl(key, value)) {
      setSocialErrors(errs => { const next = { ...errs }; delete next[key]; return next; });
    }
  };

  const validateSocialField = (platform, value) => {
    const valid = validateSocialUrl(platform, value);
    setSocialErrors(errs => {
      const next = { ...errs };
      if (valid) delete next[platform];
      else next[platform] = 'Please enter a valid ' + SOCIAL_PLATFORM_LABELS[platform] + ' URL';
      return next;
    });
    return valid;
  };

  const validateAllSocial = () => {
    const keys = ['youtube', 'instagram', 'x', 'tiktok', 'website'];
    const errors = {};
    let ok = true;
    keys.forEach(k => {
      if (!validateSocialUrl(k, social[k] || '')) {
        errors[k] = 'Please enter a valid ' + SOCIAL_PLATFORM_LABELS[k] + ' URL';
        ok = false;
      }
    });
    setSocialErrors(errors);
    return ok;
  };

  const save = async () => {
    const name = displayName.trim();
    if (!name) { setError('Display name is required.'); return; }
    if (!validateAllSocial()) return;
    setError('');
    setSaving(true);
    try {
      const payload = {
        display_name: name,
        handle: handle.trim().replace(/^@/, ''),
        location: location.trim() || null,
        bio: bio.trim() || null,
        notes: notes.trim() || null,
        social_links: social,
        show_on_main_profile: showOnProfile,
        avatar_url: avatarUrl,
        banner_url: bannerUrl,
      };
      const { error: updateError } = await window.AICDB_CREATOR_ACCOUNTS.update(
        creator.accountId || creator.id,
        payload
      );
      if (updateError) {
        setError(updateError.message || 'Could not save changes. Please try again.');
        return;
      }
      if (onSaved) onSaved();
      close();
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

  const sectionTitle = {
    font:'600 13px/1 var(--font-body)', letterSpacing:'0.06em', textTransform:'uppercase',
    color:'var(--fg-3)', margin:'0 0 18px',
  };

  const PANEL_W = 480;

  return (
    <>
      <style>{`
        @keyframes cepPanelIn  { from { transform:translateX(100%) } to { transform:translateX(0) } }
        @keyframes cepPanelOut { from { transform:translateX(0) } to { transform:translateX(100%) } }
        @keyframes cepScrimIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes cepScrimOut { from { opacity:1 } to { opacity:0 } }
      `}</style>

      <div onClick={close}
        style={{ position:'fixed', inset:0, zIndex:1100,
          background:'rgba(5,5,5,0.60)', backdropFilter:'blur(4px)', WebkitBackdropFilter:'blur(4px)',
          animation: `${visible ? 'cepScrimIn' : 'cepScrimOut'} 0.28s var(--ease-out) both` }} />

      <div style={{ position:'fixed', top:0, right:0, bottom:0, width:PANEL_W, maxWidth:'95vw', zIndex:1101,
        background:'var(--bg-1)', borderLeft:'1px solid var(--border-default)',
        boxShadow:'-8px 0 40px rgba(0,0,0,0.45)', display:'flex', flexDirection:'column',
        animation: `${visible ? 'cepPanelIn' : 'cepPanelOut'} 0.28s var(--ease-out) both` }}>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'20px 24px 18px', borderBottom:'1px solid var(--border-subtle)', flex:'none' }}>
          <h2 style={{ font:'700 20px/1.1 var(--font-display)', color:'var(--fg-0)', margin:0 }}>Edit creator profile</h2>
          <button onClick={close} aria-label="Close panel"
            style={{ width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center',
              background:'var(--bg-2)', border:'1px solid var(--border-subtle)',
              borderRadius:'var(--radius-pill)', cursor:'pointer', color:'var(--fg-1)', flex:'none' }}>
            <Icon name="x" size={16} />
          </button>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'24px 24px 0' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:26 }}>

            <div>
              <h3 style={sectionTitle}>Photos</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:48, height:48, borderRadius:'50%', flex:'none', overflow:'hidden',
                    background: avatarUrl ? `url(${avatarUrl}) center/cover` : `linear-gradient(135deg, ${creator.avatar[0]}, ${creator.avatar[1]})`,
                    border:'1px solid var(--border-default)' }} />
                  <div>
                    <button type="button" onClick={() => avatarInputRef.current && avatarInputRef.current.click()}
                      disabled={avatarUploading}
                      style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'9px 15px',
                        borderRadius:'var(--radius-md)', cursor: avatarUploading ? 'default' : 'pointer',
                        background:'var(--bg-2)', border:'1px solid var(--border-default)',
                        color: avatarUploading ? 'var(--fg-3)' : 'var(--fg-1)', font:'600 13px/1 var(--font-body)' }}>
                      {avatarUploading ? 'Uploadingù' : 'Upload photo'}
                    </button>
                    <input ref={avatarInputRef} type="file" accept="image/*" style={{ display:'none' }}
                      onChange={e => { const f = e.target.files && e.target.files[0]; if (f) handleAvatarUpload(f); e.target.value = ''; }} />
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:80, height:36, borderRadius:'var(--radius-sm)', flex:'none', overflow:'hidden',
                    background: bannerUrl ? `url(${bannerUrl}) center/cover` : `linear-gradient(125deg, ${creator.avatar[0]}, ${creator.avatar[1]})`,
                    border:'1px solid var(--border-default)' }} />
                  <div>
                    <button type="button" onClick={() => bannerInputRef.current && bannerInputRef.current.click()}
                      disabled={bannerUploading}
                      style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'9px 15px',
                        borderRadius:'var(--radius-md)', cursor: bannerUploading ? 'default' : 'pointer',
                        background:'var(--bg-2)', border:'1px solid var(--border-default)',
                        color: bannerUploading ? 'var(--fg-3)' : 'var(--fg-1)', font:'600 13px/1 var(--font-body)' }}>
                      {bannerUploading ? 'Uploadingù' : 'Upload banner'}
                    </button>
                    <input ref={bannerInputRef} type="file" accept="image/*" style={{ display:'none' }}
                      onChange={e => { const f = e.target.files && e.target.files[0]; if (f) handleBannerUpload(f); e.target.value = ''; }} />
                  </div>
                </div>
                {uploadErr && (
                  <div style={{ font:'var(--text-body-sm)', color:'var(--score-low)' }}>{uploadErr}</div>
                )}
              </div>
            </div>

            <div style={{ height:1, background:'var(--border-subtle)' }} />

            <div>
              <h3 style={sectionTitle}>Identity</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <label style={{ display:'block' }}>
                  <span className="overline" style={{ display:'block', marginBottom:7, color:'var(--fg-2)' }}>Display name</span>
                  <input value={displayName}
                    onChange={e => { setDisplayName(e.target.value); setError(''); }}
                    placeholder="Your creator name"
                    style={{ ...inputStyle, borderColor: error && !displayName.trim() ? 'var(--danger)' : 'var(--border-default)' }}
                    onFocus={focusIn} onBlur={focusOut} />
                </label>
                <label style={{ display:'block' }}>
                  <span className="overline" style={{ display:'block', marginBottom:7, color:'var(--fg-2)' }}>Handle</span>
                  <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--bg-3)',
                    border:'1px solid var(--border-default)', borderRadius:'var(--radius-md)', padding:'0 13px' }}>
                    <span style={{ font:'600 14px/1 var(--font-mono)', color:'var(--fg-3)' }}>@</span>
                    <input value={handle}
                      onChange={e => setHandle(e.target.value.replace(/^@/, ''))}
                      placeholder="novapictures"
                      style={{ flex:1, background:'none', border:'none', outline:'none', color:'var(--fg-0)',
                        font:'var(--text-body)', padding:'11px 0' }} />
                  </div>
                </label>
                <label style={{ display:'block' }}>
                  <span className="overline" style={{ display:'block', marginBottom:7, color:'var(--fg-2)' }}>
                    Location <span style={{ color:'var(--fg-3)', fontWeight:400, textTransform:'none', fontSize:'0.95em' }}>(optional)</span>
                  </span>
                  <input value={location} onChange={e => setLocation(e.target.value)}
                    placeholder="City, country"
                    style={inputStyle}
                    onFocus={focusIn} onBlur={focusOut} />
                </label>
              </div>
            </div>

            <div style={{ height:1, background:'var(--border-subtle)' }} />

            <div>
              <h3 style={sectionTitle}>About</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                <label style={{ display:'block' }}>
                  <span className="overline" style={{ display:'block', marginBottom:7, color:'var(--fg-2)' }}>Bio</span>
                  <textarea value={bio} onChange={e => setBio(e.target.value)}
                    placeholder="What do you make, and why?" rows={4}
                    style={{ ...inputStyle, resize:'vertical', minHeight:96, lineHeight:1.5 }}
                    onFocus={focusIn} onBlur={focusOut} />
                </label>
                <label style={{ display:'block' }}>
                  <span className="overline" style={{ display:'block', marginBottom:7, color:'var(--fg-2)' }}>Notes</span>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)}
                    placeholder="Anything else visitors should know (optional)" rows={4}
                    style={{ ...inputStyle, resize:'vertical', minHeight:96, lineHeight:1.5 }}
                    onFocus={focusIn} onBlur={focusOut} />
                </label>
              </div>
            </div>

            <div style={{ height:1, background:'var(--border-subtle)' }} />

            <div>
              <h3 style={sectionTitle}>Social links</h3>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {[['youtube','YouTube','youtube-logo'],['instagram','Instagram','instagram-logo'],['x','X','x-logo'],['tiktok','TikTok','tiktok-logo'],['website','Website','globe']].map(([k, lbl, icon]) => (
                  <div key={k}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--bg-3)',
                      border:'1px solid var(--border-default)', borderRadius:'var(--radius-md)', padding:'0 12px' }}>
                      <Icon name={icon} size={16} color="var(--fg-2)" weight="fill" />
                      <input value={social[k] || ''}
                        onChange={e => setSoc(k)(e.target.value)}
                        onBlur={e => validateSocialField(k, e.target.value)}
                        placeholder={lbl}
                        style={{ flex:1, background:'none', border:'none', outline:'none', color:'var(--fg-0)',
                          font:'var(--text-body-sm)', padding:'11px 0' }} />
                    </div>
                    {socialErrors[k] && (
                      <div style={{ font:'var(--text-body-sm)', color:'var(--score-low)', marginTop:4 }}>{socialErrors[k]}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ height:1, background:'var(--border-subtle)' }} />

            <div>
              <h3 style={sectionTitle}>Profile settings</h3>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:20,
                padding:'16px 18px', background:'var(--bg-3)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)' }}>
                <div style={{ minWidth:0 }}>
                  <div style={{ font:'600 14.5px/1.3 var(--font-body)', color:'var(--fg-0)' }}>Show on main profile</div>
                  <div style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', marginTop:4 }}>
                    Visitors to your main profile will see a link to this creator page.
                  </div>
                </div>
                <CreatorEditToggle on={showOnProfile} onChange={setShowOnProfile} />
              </div>
            </div>

            <div style={{ height:24 }} />
          </div>
        </div>

        <div style={{ padding:'16px 24px', borderTop:'1px solid var(--border-subtle)', flex:'none',
          background:'var(--bg-1)', display:'flex', flexDirection:'column', gap:10 }}>
          {error && (
            <p style={{ display:'flex', alignItems:'center', gap:7, font:'var(--text-body-sm)', color:'var(--danger)', margin:0 }}>
              <Icon name="warning-circle" size={14} color="var(--danger)" weight="fill" />{error}
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
            <button onClick={save} disabled={saving}
              style={{ padding:'11px 24px', borderRadius:'var(--radius-md)',
                cursor: saving ? 'default' : 'pointer',
                font:'600 14px/1 var(--font-body)', border:'none',
                background: saving ? 'var(--bg-3)' : 'var(--coral)',
                color: saving ? 'var(--fg-3)' : 'var(--fg-on-accent)',
                transition:'background var(--dur-fast)' }}
              onMouseEnter={e => { if (!saving) e.currentTarget.style.background='var(--coral-bright)'; }}
              onMouseLeave={e => { if (!saving) e.currentTarget.style.background='var(--coral)'; }}>
              {saving ? 'SavingÖ' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { CreatorEditPanel });