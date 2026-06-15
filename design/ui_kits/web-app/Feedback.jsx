// Dreamwall UI kit — rating feedback.
// Subtle confirmation (soft glow on the score) after any rating, and a small,
// tasteful celebratory moment the very first time a user rates on the platform.

const FEEDBACK_STYLE = `
@keyframes aicdbScorePop { 0% { transform: scale(0.7); opacity: 0; } 55% { transform: scale(1.08); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
@keyframes aicdbGlowPulse { 0% { box-shadow: 0 0 0 0 rgba(216,90,48,0.55), 0 0 0 0 rgba(216,90,48,0.0); } 70% { box-shadow: 0 0 0 18px rgba(216,90,48,0.0), 0 0 40px 6px rgba(216,90,48,0.35); } 100% { box-shadow: 0 0 0 0 rgba(216,90,48,0.0); } }
@keyframes aicdbBackdropIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes aicdbCardIn { from { opacity: 0; transform: translateY(14px) scale(0.97); } to { opacity: 1; transform: none; } }
@keyframes aicdbConfettiFall { 0% { transform: translateY(-12px) rotate(0deg); opacity: 0; } 12% { opacity: 1; } 100% { transform: translateY(240px) rotate(420deg); opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  .aicdb-pop, .aicdb-glow, .aicdb-confetti, .aicdb-cardin, .aicdb-backin { animation: none !important; }
}
`;

// localStorage-backed: has this user ever rated? record a rating, report if it was the first.
window.AICDB_RATINGS = (function () {
  const KEY = 'aicdb_has_rated';
  return {
    hasRated: () => { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } },
    record: () => {
      let first = false;
      try { first = localStorage.getItem(KEY) !== '1'; localStorage.setItem(KEY, '1'); } catch (e) {}
      return first;
    },
    reset: () => { try { localStorage.removeItem(KEY); } catch (e) {} },
  };
})();

function aicdbRecordRating() { return window.AICDB_RATINGS.record(); }

// glowing score disc reused by both confirm + celebration
function GlowScore({ score, size = 96 }) {
  return (
    <div className="aicdb-pop aicdb-glow" style={{ width:size, height:size, borderRadius:'50%', margin:'0 auto',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      background:'radial-gradient(circle at 50% 38%, rgba(216,90,48,0.22), var(--bg-2))',
      border:'1px solid var(--border-accent)',
      animation:'aicdbScorePop 0.5s var(--ease-out) both, aicdbGlowPulse 1.5s var(--ease-out) 0.15s' }}>
      <span style={{ font:`700 ${size*0.34}px/1 var(--font-mono)`, color:'var(--coral)' }}>{Number(score).toFixed(1)}</span>
      <span style={{ font:`500 ${size*0.1}px/1 var(--font-mono)`, color:'var(--fg-2)', letterSpacing:'0.06em', marginTop:3 }}>YOUR SCORE</span>
    </div>
  );
}

function Confetti({ count = 16 }) {
  const colors = ['#d85a30', '#4ecdc4', '#e5b23b', '#9d8df1', '#f5f3ef'];
  const pieces = React.useMemo(() => Array.from({ length: count }).map((_, i) => ({
    left: 6 + Math.random() * 88,
    bg: colors[i % colors.length],
    delay: Math.random() * 0.35,
    dur: 1.1 + Math.random() * 0.9,
    size: 6 + Math.random() * 6,
    round: Math.random() > 0.5,
  })), [count]);
  return (
    <div aria-hidden="true" style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', borderRadius:'inherit' }}>
      {pieces.map((p, i) => (
        <span key={i} className="aicdb-confetti" style={{ position:'absolute', top:0, left:`${p.left}%`,
          width:p.size, height:p.size, background:p.bg, borderRadius: p.round ? '50%' : 2,
          animation:`aicdbConfettiFall ${p.dur}s var(--ease-out) ${p.delay}s both` }} />
      ))}
    </div>
  );
}

// First-ever rating — a small modal celebration
function FirstRatingCelebration({ score, onClose }) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 5200);
    return () => clearTimeout(t);
  }, []);
  return (
    <div onClick={onClose} className="aicdb-backin"
      style={{ position:'fixed', inset:0, zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:24,
        background:'rgba(5,5,5,0.74)', backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)',
        animation:'aicdbBackdropIn 0.25s var(--ease-out) both' }}>
      <div onClick={e => e.stopPropagation()} className="aicdb-cardin"
        style={{ position:'relative', width:'100%', maxWidth:380, textAlign:'center', overflow:'hidden',
          background:'var(--bg-1)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-xl)',
          boxShadow:'var(--shadow-3)', padding:'40px 34px 32px', animation:'aicdbCardIn 0.45s var(--ease-out) both' }}>
        <Confetti count={18} />
        <div style={{ position:'relative' }}>
          <div className="overline" style={{ color:'var(--teal-bright)', marginBottom:18, letterSpacing:'0.14em' }}>Your first rating</div>
          <GlowScore score={score} />
          <h2 style={{ font:'600 25px/1.2 var(--font-display)', color:'var(--fg-0)', margin:'24px 0 10px' }}>You’re officially a critic.</h2>
          <p style={{ font:'var(--text-body)', color:'var(--fg-2)', margin:'0 0 24px' }}>
            That’s your first score on Dreamwall. Every rating you give sharpens the community’s taste — and your own.
          </p>
          <Button variant="primary" onClick={onClose}>Keep watching</Button>
        </div>
      </div>
    </div>
  );
}

// Subtle confirmation toast for any (subsequent) rating
function RatingConfirm({ score, onClose }) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 2400);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="aicdb-cardin"
      style={{ position:'fixed', left:'50%', bottom:32, transform:'translateX(-50%)', zIndex:300,
        display:'flex', alignItems:'center', gap:14, padding:'14px 20px 14px 16px',
        background:'var(--bg-1)', border:'1px solid var(--border-accent)', borderRadius:'var(--radius-pill)',
        boxShadow:'var(--shadow-3)', animation:'aicdbCardIn 0.4s var(--ease-out) both' }}>
      <div className="aicdb-pop aicdb-glow" style={{ width:46, height:46, borderRadius:'50%', flex:'none',
        display:'flex', alignItems:'center', justifyContent:'center', background:'var(--coral-ghost)',
        border:'1px solid var(--border-accent)',
        animation:'aicdbScorePop 0.45s var(--ease-out) both, aicdbGlowPulse 1.4s var(--ease-out) 0.1s' }}>
        <span style={{ font:'700 17px/1 var(--font-mono)', color:'var(--coral)' }}>{Number(score).toFixed(1)}</span>
      </div>
      <div style={{ textAlign:'left' }}>
        <div style={{ font:'600 14px/1.2 var(--font-body)', color:'var(--fg-0)' }}>Rating saved</div>
        <div style={{ font:'var(--text-body-sm)', color:'var(--fg-2)', marginTop:2 }}>Thanks — your score is in.</div>
      </div>
      <Icon name="check-circle" size={20} color="var(--teal-bright)" weight="fill" />
    </div>
  );
}

// Convenience: render the right feedback given (score, wasFirst)
function RatingFeedback({ score, first, onClose }) {
  return first
    ? <FirstRatingCelebration score={score} onClose={onClose} />
    : <RatingConfirm score={score} onClose={onClose} />;
}

Object.assign(window, { FEEDBACK_STYLE, GlowScore, Confetti, FirstRatingCelebration, RatingConfirm, RatingFeedback, aicdbRecordRating });
