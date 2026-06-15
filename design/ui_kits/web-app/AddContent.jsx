// Dreamwall UI kit — Add Content page. 3-step submission flow with live preview.
const AC_STEPS = [
  { n:1, label:'Type & basics' },
  { n:2, label:'Media & tags' },
  { n:3, label:'Credits & legal' },
];
const AC_MODEL_SUGGESTIONS = ['Runway Gen-3', 'Sora', 'Midjourney', 'Veo', 'Kling', 'Pika', 'Stable Video', 'Flux'];

// ---- progress indicator ----
function Stepper({ step, maxStep, onJump }) {
  return (
    <div style={{ display:'flex', alignItems:'center', margin:'4px 0 36px' }}>
      {AC_STEPS.map((s, i) => {
        const state = step === s.n ? 'current' : (s.n < step ? 'done' : 'todo');
        const clickable = s.n <= maxStep;
        return (
          <React.Fragment key={s.n}>
            <div onClick={() => clickable && onJump(s.n)} style={{ display:'flex', alignItems:'center', gap:13, cursor: clickable ? 'pointer' : 'default' }}>
              <div style={{ width:36, height:36, flex:'none', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                font:'700 15px/1 var(--font-mono)',
                background: state==='current' ? 'var(--coral)' : (state==='done' ? 'var(--coral-ghost)' : 'var(--bg-2)'),
                color: state==='current' ? 'var(--fg-on-accent)' : (state==='done' ? 'var(--coral-bright)' : 'var(--fg-2)'),
                borderWidth:1, borderStyle:'solid', borderColor: state==='todo' ? 'var(--border-subtle)' : 'transparent',
                transition:'color var(--dur-base) var(--ease-out)' }}>
                {state==='done' ? <Icon name="check" size={16} color="var(--coral-bright)" weight="bold" /> : s.n}
              </div>
              <div style={{ minWidth:0 }}>
                <div className="overline" style={{ color: state==='todo' ? 'var(--fg-3)' : 'var(--fg-2)' }}>Step {s.n}</div>
                <div style={{ font:'600 14px/1.2 var(--font-body)', marginTop:3,
                  color: state==='current' ? 'var(--fg-0)' : (state==='todo' ? 'var(--fg-2)' : 'var(--fg-1)') }}>{s.label}</div>
              </div>
            </div>
            {i < AC_STEPS.length - 1 && (
              <div style={{ flex:1, height:2, margin:'0 20px', borderRadius:2,
                background: s.n < step ? 'var(--coral-dim)' : 'var(--border-subtle)', transition:'background var(--dur-base)' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ======================= STEPS =======================
function Step1({ form, set, nextEpisode }) {
  const series = form.type === 'series';
  const isEpisode = series && form.seriesMode === 'episode';
  return (
    <div>
      <SectionTitle icon="sparkles" hint="Pick a format — the fields below adapt to it.">Content type</SectionTitle>
      <TypeSelector value={form.type} onChange={v => set({ type:v, ...(v !== 'series' ? { seriesMode:'new' } : {}) })} />

      {/* New series vs. Add episode — only for Series, directly below the type selector */}
      {series && (
        <>
          <Divider />
          <SectionTitle icon="television-simple" hint="Adding a brand-new series, or a new episode to one you already have on Dreamwall?">Series</SectionTitle>
          <SeriesModeSelector value={form.seriesMode} onChange={v => set({ seriesMode:v })} />
        </>
      )}

      <Divider />

      {isEpisode ? (
        <EpisodeFields form={form} set={set} nextEpisode={nextEpisode} />
      ) : (
        <>
          <SectionTitle icon="info">Basic info</SectionTitle>
          <div style={{ display:'flex', gap:16 }}>
            <div style={{ flex:2 }}><Field label="Title"><TextInput value={form.title} onChange={v => set({ title:v })} placeholder="Your title's name" /></Field></div>
            <div style={{ flex:1 }}><Field label="Year"><TextInput value={form.year} onChange={v => set({ year:v.replace(/[^0-9]/g,'').slice(0,4) })} placeholder="2025" mono /></Field></div>
          </div>

          {series ? (
            <div style={{ display:'flex', gap:16 }}>
              <div style={{ flex:1 }}><Field label="Seasons"><TextInput value={form.seasons} onChange={v => set({ seasons:v.replace(/[^0-9]/g,'').slice(0,3) })} placeholder="1" mono /></Field></div>
              <div style={{ flex:1 }}><Field label="Episodes"><TextInput value={form.episodes} onChange={v => set({ episodes:v.replace(/[^0-9]/g,'').slice(0,4) })} placeholder="8" mono /></Field></div>
              <div style={{ flex:1 }}><Field label="Episode length"><TextInput value={form.duration} onChange={v => set({ duration:v })} placeholder="44m" /></Field></div>
            </div>
          ) : (
            <Field label="Duration" hint="Runtime in plain form, e.g. 45m or 1h30m."><TextInput value={form.duration} onChange={v => set({ duration:v })} placeholder="1h 42m" /></Field>
          )}

          <Field label="Description / synopsis"><TextArea value={form.description} onChange={v => set({ description:v })} rows={4} placeholder="What is it about? Keep it spoiler-light." /></Field>
        </>
      )}
    </div>
  );
}

function Step2({ form, set }) {
  const series = form.type === 'series';
  return (
    <div>
      <SectionTitle icon="image" hint="The hero photo runs behind the title-page header; the motto sits over it.">Hero</SectionTitle>
      <Field label="Background photo">
        <FileDrop value={form.heroImage} onChange={v => set({ heroImage:v })} aspect="16/9"
          label="Drop a thematic still, or click to upload" sub="16:9 · shown at the top of the title page" />
      </Field>
      <Field label="Motto (1–2 sentences)" hint="A short line or two that appears over the background photo — shown for every content type.">
        <TextArea value={form.motto} onChange={v => set({ motto:v })} rows={2} placeholder="One or two sentences that capture the mood…" />
      </Field>
      <Divider />

      <SectionTitle icon="image">Poster &amp; tags</SectionTitle>
      <div style={{ display:'flex', gap:20 }}>
        <div style={{ width:150, flex:'none' }}>
          <Field label="Poster">
            <FileDrop value={form.poster} onChange={v => set({ poster:v })} aspect="2/3" label="Upload poster" sub="2:3" />
          </Field>
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <Field label="Genre / type tags" hint="Press Enter to add. Sci-Fi, Drama, Animation…">
            <TagInput tags={form.genres} onChange={v => set({ genres:v })} placeholder="Add a genre…" />
          </Field>
          <Field label="Content tags" hint="Searchable labels — themes, techniques, moods.">
            <TagInput tags={form.contentTags} onChange={v => set({ contentTags:v })} placeholder="diffusion, neo-noir, rain…" />
          </Field>
        </div>
      </div>
      <Divider />

      <SectionTitle icon="play" hint={series ? 'Paste an embed per episode.' : 'Paste the player embed code for the film.'}>Playback</SectionTitle>
      {series ? (
        <EpisodeEmbeds rows={form.episodeEmbeds} onChange={v => set({ episodeEmbeds:v })} />
      ) : (
        <Field label="Embed code"><TextArea value={form.embed} onChange={v => set({ embed:v })} rows={3} mono placeholder='<iframe src="https://…" allowfullscreen></iframe>' /></Field>
      )}
    </div>
  );
}

function Step3({ form, set }) {
  const toggleModel = (m) => set({ models: form.models.includes(m) ? form.models.filter(x => x !== m) : [...form.models, m] });
  return (
    <div>
      <SectionTitle icon="users" hint="Who contributed to the production — director, cast, key roles.">Crew &amp; credits</SectionTitle>
      <CrewEditor rows={form.crew} onChange={v => set({ crew:v })} />
      <Divider />

      <SectionTitle icon="sparkles" hint="All production details are optional — fill in what you can.">Production info</SectionTitle>
      <Field label="AI models used" optional hint="Which models drove the generation. Press Enter to add custom.">
        <TagInput tags={form.models} onChange={v => set({ models:v })} placeholder="Add a model…" />
        <SuggestPills options={AC_MODEL_SUGGESTIONS} selected={form.models} onToggle={toggleModel} />
      </Field>
      <div style={{ display:'flex', gap:16 }}>
        <div style={{ flex:1 }}><Field label="Budget" optional><TextInput value={form.budget} onChange={v => set({ budget:v })} placeholder="$180k" mono /></Field></div>
        <div style={{ flex:1 }}><Field label="Production duration" optional><TextInput value={form.prodDuration} onChange={v => set({ prodDuration:v })} placeholder="5 months" /></Field></div>
        <div style={{ flex:1 }}><Field label="Contributors" optional><TextInput value={form.contributors} onChange={v => set({ contributors:v.replace(/[^0-9]/g,'').slice(0,5) })} placeholder="9" mono /></Field></div>
      </div>
      <Divider />

      <SectionTitle icon="shield">Declaration</SectionTitle>
      <div style={{ padding:'6px 0' }}>
        <CheckRow checked={form.agreeRights} onChange={v => set({ agreeRights:v })}>
          I confirm that this is my own work or I have rights to submit it to Dreamwall.
        </CheckRow>
        <CheckRow checked={form.agreeAI} onChange={v => set({ agreeAI:v })}>
          I confirm this content was created with AI assistance (50% or more).
        </CheckRow>
        <a href="#" onClick={e => e.preventDefault()} style={{ display:'inline-block', marginTop:10, marginLeft:35,
          font:'var(--text-body-sm)', color:'var(--teal)', textDecoration:'underline', textUnderlineOffset:3 }}>
          By submitting you agree to Dreamwall's content guidelines
        </a>
      </div>
    </div>
  );
}

// ---- the episode-only fields (shown when Series + "Add episode" is chosen) ----
// No poster, genre, cast or media steps — those are inherited from the chosen series.
function EpisodeFields({ form, set, nextEpisode }) {
  const sel = AC_MY_SERIES.find(s => s.id === form.existingSeriesId);
  return (
    <div>
      <SectionTitle icon="television-simple" hint="Search and pick the series this episode belongs to.">Existing series</SectionTitle>
      <Field label="Your series" hint="Only series you've already added appear here.">
        <SeriesPicker value={form.existingSeriesId} options={AC_MY_SERIES} onChange={id => set({ existingSeriesId:id })} />
      </Field>

      {sel ? (
        <>
          <div style={{ marginBottom:8 }}><InheritedSummary series={sel} /></div>
          <div style={{ display:'flex', alignItems:'center', gap:9, margin:'14px 0 4px', padding:'11px 14px', borderRadius:'var(--radius-md)',
            background:'var(--teal-ghost)', border:'1px solid rgba(78,205,196,0.3)', font:'var(--text-body-sm)', color:'var(--teal-bright)' }}>
            <Icon name="check-circle" size={16} color="var(--teal-bright)" weight="fill" />
            On submit, this episode is appended to <b style={{ color:'var(--fg-0)', margin:'0 3px' }}>{sel.name}</b> — Season {sel.seasons}, as episode {nextEpisode}.
          </div>
          <Divider />

          <SectionTitle icon="info" hint="Only the new episode's own details — everything above is already saved.">New episode</SectionTitle>
          <div style={{ display:'flex', gap:16 }}>
            <div style={{ width:140, flex:'none' }}>
              <Field label="Episode #">
                <TextInput value={form.episodeNumber} onChange={v => set({ episodeNumber:v.replace(/[^0-9]/g,'').slice(0,4) })} placeholder={String(nextEpisode)} mono />
              </Field>
            </div>
            <div style={{ flex:1 }}>
              <Field label="Episode title">
                <TextInput value={form.title} onChange={v => set({ title:v })} placeholder="e.g. The Last Broadcast" />
              </Field>
            </div>
          </div>

          <Field label="Video link or embed code" hint="Paste a public watch URL or a full <iframe> player embed.">
            <TextArea value={form.episodeMedia} onChange={v => set({ episodeMedia:v })} rows={3} mono
              placeholder={'https://…  —or—  <iframe src="https://…" allowfullscreen></iframe>'} />
          </Field>

          <Field label="Episode description" optional hint="A short, spoiler-light line about this episode.">
            <TextArea value={form.description} onChange={v => set({ description:v })} rows={2} placeholder="What happens in this one?" />
          </Field>
        </>
      ) : (
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'20px 16px', borderRadius:'var(--radius-md)',
          background:'var(--bg-0)', border:'1px dashed var(--border-strong)', font:'var(--text-body-sm)', color:'var(--fg-2)' }}>
          <Icon name="arrow-up" size={15} color="var(--fg-3)" />
          Pick one of your series above — then you'll only need the new episode's number, title and link.
        </div>
      )}
    </div>
  );
}

// ---- success screen ----
function SubmittedScreen({ form, onAnother }) {
  const isEpisode = form.type === 'series' && form.seriesMode === 'episode';
  const sel = isEpisode ? AC_MY_SERIES.find(s => s.id === form.existingSeriesId) : null;
  return (
    <div style={{ textAlign:'center', padding:'60px 24px' }}>
      <div style={{ width:74, height:74, borderRadius:'50%', margin:'0 auto 24px', display:'flex', alignItems:'center', justifyContent:'center',
        background:'var(--teal-ghost)', borderWidth:1, borderStyle:'solid', borderColor:'rgba(78,205,196,0.4)' }}>
        <Icon name="check" size={34} color="var(--teal-bright)" weight="bold" />
      </div>
      <h2 style={{ font:'var(--text-h2)', color:'var(--fg-0)', marginBottom:10 }}>
        {isEpisode ? 'Episode added' : 'Submitted for review'}
      </h2>
      <p style={{ font:'var(--text-body-lg)', color:'var(--fg-1)', maxWidth:460, margin:'0 auto 28px' }}>
        {isEpisode && sel ? (
          <>
            <span style={{ color:'var(--fg-0)', fontWeight:600 }}>Episode {form.episodeNumber || '—'}{form.title.trim() ? ` · ${form.title.trim()}` : ''}</span>{' '}
            was appended to <span style={{ color:'var(--fg-0)', fontWeight:600 }}>{sel.name}</span> and is in the review queue.
          </>
        ) : (
          <>
            <span style={{ color:'var(--fg-0)', fontWeight:600 }}>{form.title.trim() || 'Your title'}</span> is in the queue. We'll ping you once it clears moderation and goes live for users to rate.
          </>
        )}
      </p>
      <button onClick={onAnother} style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 22px', cursor:'pointer',
        borderRadius:'var(--radius-md)', border:'none', background:'var(--coral)', color:'var(--fg-on-accent)', font:'600 14px/1 var(--font-body)' }}>
        <Icon name="plus" size={15} color="var(--fg-on-accent)" weight="bold" /> {isEpisode ? 'Add another episode' : 'Add another title'}
      </button>
    </div>
  );
}

// ======================= PAGE =======================
const AC_BLANK = {
  type:'movie', seriesMode:'new', // 'new' = full series form | 'episode' = add to existing series
  existingSeriesId:'', episodeNumber:'', episodeMedia:'',
  heroImage:null, motto:'', title:'', year:'', seasons:'', episodes:'', duration:'', description:'',
  genres:[], contentTags:[], poster:null, embed:'', episodeEmbeds:[{ ep:'Episode 1', embed:'' }],
  crew:[{ role:'Director', name:'' }, { role:'Prompt Architect', name:'' }], models:[],
  budget:'', prodDuration:'', contributors:'', agreeRights:false, agreeAI:false,
};

function AddContent() {
  const [step, setStep] = React.useState(1);
  const [maxStep, setMaxStep] = React.useState(1);
  const [form, setForm] = React.useState(AC_BLANK);
  const [submitted, setSubmitted] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [tried, setTried] = React.useState(false);
  const set = (patch) => setForm(f => ({ ...f, ...patch }));

  const isEpisode = form.type === 'series' && form.seriesMode === 'episode';
  const selSeries = isEpisode ? AC_MY_SERIES.find(s => s.id === form.existingSeriesId) : null;
  const nextEpisode = selSeries ? selSeries.episodes + 1 : 1;

  const goto = (n) => { setStep(n); setMaxStep(m => Math.max(m, n)); window.scrollTo({ top:0, behavior:'smooth' }); };
  const next = () => { if (step === 1 && !form.title.trim()) { setTried(true); return; } setTried(false); goto(step + 1); };
  const back = () => goto(step - 1);

  // ----- episode path validity + submit -----
  const episodeValid = !!(form.existingSeriesId && form.episodeNumber.trim() && form.title.trim() && form.episodeMedia.trim());
  const newCanSubmit = form.agreeRights && form.agreeAI && form.title.trim();
  const submitEpisode = () => { if (!episodeValid) { setTried(true); return; } setSubmitted(true); window.scrollTo({ top:0, behavior:'smooth' }); };
  const submitNew = () => { if (!newCanSubmit) { setTried(true); return; } setSubmitted(true); window.scrollTo({ top:0, behavior:'smooth' }); };
  const reset = () => { setForm(AC_BLANK); setStep(1); setMaxStep(1); setSubmitted(false); setTried(false); };

  return (
    <div style={{ minHeight:'100vh' }}>
      <NavBar active="" onNav={() => {}} query={query} onQuery={setQuery} onOpenResult={() => {}} />

      <div style={{ maxWidth:1180, margin:'0 auto', padding:'40px 28px 90px' }}>
        <header style={{ marginBottom:30 }}>
          <div className="overline" style={{ color:'var(--coral-bright)', marginBottom:10 }}>Contribute</div>
          <h1 style={{ font:'var(--text-h1)', color:'var(--fg-0)', letterSpacing:'-0.015em', marginBottom:10 }}>Add a title to Dreamwall</h1>
          <p style={{ font:'var(--text-body-lg)', color:'var(--fg-1)', maxWidth:560 }}>
            Submit AI-generated film &amp; series for the community to rate, review and discover.
          </p>
        </header>

        {submitted ? (
          <div style={{ background:'var(--bg-1)', borderRadius:'var(--radius-xl)', borderWidth:1, borderStyle:'solid', borderColor:'var(--border-subtle)' }}>
            <SubmittedScreen form={form} onAnother={reset} />
          </div>
        ) : isEpisode ? (
          /* ===== Series → Add episode: compact, single-step episode form (no wizard, no preview) ===== */
          <div style={{ maxWidth:760 }}>
            <div style={{ background:'var(--bg-1)', borderRadius:'var(--radius-xl)', borderWidth:1, borderStyle:'solid', borderColor:'var(--border-subtle)',
              boxShadow:'var(--shadow-1)', padding:'30px 32px' }}>
              <Step1 form={form} set={set} nextEpisode={nextEpisode} />

              {tried && !episodeValid && (
                <div style={{ display:'flex', alignItems:'center', gap:9, marginTop:20, padding:'11px 14px', borderRadius:'var(--radius-md)',
                  background:'rgba(229,72,77,0.1)', borderWidth:1, borderStyle:'solid', borderColor:'rgba(229,72,77,0.35)',
                  font:'var(--text-body-sm)', color:'var(--score-low)' }}>
                  <Icon name="warning" size={15} color="var(--score-low)" />
                  Pick a series and fill in the episode number, title and video link to submit.
                </div>
              )}

              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:28, paddingTop:24,
                borderTopWidth:1, borderTopStyle:'solid', borderTopColor:'var(--border-subtle)' }}>
                <span style={{ font:'var(--text-body-sm)', color:'var(--fg-3)' }}>Episode details only</span>
                <button onClick={submitEpisode} style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'11px 20px', borderRadius:'var(--radius-md)',
                  border:'none', cursor: episodeValid ? 'pointer' : 'not-allowed', font:'600 14px/1 var(--font-body)',
                  background: episodeValid ? 'var(--teal)' : 'var(--bg-3)', color: episodeValid ? 'var(--fg-on-accent)' : 'var(--fg-3)',
                  transition:'background var(--dur-fast)' }}>
                  <Icon name="check" size={16} color={episodeValid ? 'var(--fg-on-accent)' : 'var(--fg-3)'} weight="bold" /> Add episode
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ===== Full submission wizard (film / short / new series) ===== */
          <>
            <Stepper step={step} maxStep={maxStep} onJump={goto} />
            <div className="ac-grid" style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) 332px', gap:44, alignItems:'start' }}>
              <div style={{ background:'var(--bg-1)', borderRadius:'var(--radius-xl)', borderWidth:1, borderStyle:'solid', borderColor:'var(--border-subtle)',
                boxShadow:'var(--shadow-1)', padding:'30px 32px' }}>
                {step === 1 && <Step1 form={form} set={set} nextEpisode={nextEpisode} />}
                {step === 2 && <Step2 form={form} set={set} />}
                {step === 3 && <Step3 form={form} set={set} />}

                {tried && ((step === 1 && !form.title.trim()) || (step === 3 && !newCanSubmit)) && (
                  <div style={{ display:'flex', alignItems:'center', gap:9, marginTop:20, padding:'11px 14px', borderRadius:'var(--radius-md)',
                    background:'rgba(229,72,77,0.1)', borderWidth:1, borderStyle:'solid', borderColor:'rgba(229,72,77,0.35)',
                    font:'var(--text-body-sm)', color:'var(--score-low)' }}>
                    <Icon name="warning" size={15} color="var(--score-low)" />
                    {step === 1 ? 'A title is required to continue.' : 'Confirm both declarations to submit.'}
                  </div>
                )}

                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:28, paddingTop:24,
                  borderTopWidth:1, borderTopStyle:'solid', borderTopColor:'var(--border-subtle)' }}>
                  {step > 1
                    ? <Button variant="secondary" icon="chevron-left" onClick={back}>Back</Button>
                    : <span style={{ font:'var(--text-body-sm)', color:'var(--fg-3)' }}>Step {step} of 3</span>}
                  {step < 3 ? (
                    <Button variant="primary" onClick={next}>Continue</Button>
                  ) : (
                    <button onClick={submitNew} style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'11px 20px', borderRadius:'var(--radius-md)',
                      border:'none', cursor: newCanSubmit ? 'pointer' : 'not-allowed', font:'600 14px/1 var(--font-body)',
                      background: newCanSubmit ? 'var(--coral)' : 'var(--bg-3)', color: newCanSubmit ? 'var(--fg-on-accent)' : 'var(--fg-3)',
                      transition:'background var(--dur-fast)' }}>
                      <Icon name="check" size={16} color={newCanSubmit ? 'var(--fg-on-accent)' : 'var(--fg-3)'} weight="bold" /> Submit title
                    </button>
                  )}
                </div>
              </div>

              <LivePreview form={form} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { AddContent, Stepper });
ReactDOM.createRoot(document.getElementById('root')).render(<AddContent />);
