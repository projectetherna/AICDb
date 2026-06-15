// Dreamwall UI kit — Discover / home screen
function Hero({ film, onOpen }) {
  return (
    <div style={{ position:'relative', borderRadius:'var(--radius-xl)', overflow:'hidden', marginBottom:44,
      minHeight:340, background:'var(--bg-inset)' }}>
      {/* fading poster — featured content bleeds in from the left into the dark */}
      <div style={{ position:'absolute', top:0, left:0, bottom:0, width:'64%',
        background:`linear-gradient(120deg, ${film.g[0]}, ${film.g[1]} 160%)`,
        WebkitMaskImage:'linear-gradient(to right, rgba(0,0,0,1) 46%, rgba(0,0,0,0) 100%)',
        maskImage:'linear-gradient(to right, rgba(0,0,0,1) 46%, rgba(0,0,0,0) 100%)' }} />
      <div style={{ position:'absolute', inset:0,
        background:'linear-gradient(90deg, rgba(5,5,5,0.35) 0%, rgba(5,5,5,0.55) 46%, var(--bg-inset) 78%),'
          + 'linear-gradient(to top, var(--bg-inset) 2%, transparent 32%)' }} />
      <div style={{ position:'absolute', inset:0, opacity:0.4,
        backgroundImage:'radial-gradient(rgba(245,243,239,0.05) 1px, transparent 1px)', backgroundSize:'5px 5px' }} />
      <div style={{ position:'relative', padding:'44px 48px', maxWidth:540, marginLeft:'auto', display:'flex', flexDirection:'column', alignItems:'flex-end', textAlign:'right' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
          <span className="overline" style={{ color:'var(--coral-bright)' }}>Featured this week</span>
          <ContentBadge type={film.type} />
          <ContentRibbon film={film} size="sm" />
        </div>
        <h1 style={{ font:'var(--text-display)', letterSpacing:'-0.015em', color:'var(--fg-0)', marginBottom:14 }}>{film.title}</h1>
        <p style={{ font:'var(--text-body-lg)', color:'var(--fg-1)', marginBottom:22, maxWidth:460 }}>{film.synopsis}</p>
        <div style={{ display:'flex', alignItems:'center', gap:18, marginBottom:26 }}>
          <ScoreLine film={film} size={28} countColor="var(--fg-2)" />
          <span style={{ font:'var(--text-data)', color:'var(--fg-1)' }}>{film.year} · {film.runtime}</span>
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <Button variant="primary" icon="play" onClick={()=> onOpen(film)}>View title</Button>
          <Button variant="secondary" icon="plus">Watchlist</Button>
        </div>
      </div>
    </div>
  );
}

function Discover({ onOpen }) {
  const films = window.AICDB_FILMS;
  const byScore = [...films].sort((a,b)=> b.score-a.score);
  const byStars = [...films].sort((a,b)=> b.stars-a.stars);
  const byYear  = [...films].sort((a,b)=> b.year-a.year);
  const ratingNum = (f)=> parseFloat(String(f.ratings).replace('k',''))*(String(f.ratings).includes('k')?1000:1);
  const byBuzz  = [...films].sort((a,b)=> ratingNum(b)-ratingNum(a));
  const series  = films.filter(f=> f.type==='series');
  const shorts  = films.filter(f=> f.type==='short' || f.type==='vertical');
  const random  = [...films].sort(()=> Math.random()-0.5);

  const sections = [
    { title:'Recommended', sub:'Based on your ratings', films: dedupe([...byStars]).slice(0,6) },
    { title:'Top Rated', films: byScore.slice(0,6) },
    { title:'Trending Recently', films: byBuzz.slice(0,6) },
    { title:'New', films: byYear.slice(0,6) },
    { title:'Serial Lover', sub:'For the binge-watchers', films: series },
    { title:'Shorts', films: shorts },
    { title:'Random', sub:'Roll the dice', films: random.slice(0,6) },
  ];

  return (
    <div style={{ maxWidth:1180, margin:'0 auto', padding:'32px 28px 80px' }}>
      <Hero film={films[1]} onOpen={onOpen} />
      {sections.map(s => <FilmRow key={s.title} title={s.title} sub={s.sub} films={s.films} onOpen={onOpen} />)}
    </div>
  );
}

function dedupe(list) {
  const seen = new Set();
  return list.filter(f => seen.has(f.id) ? false : seen.add(f.id));
}
Object.assign(window, { Discover, Hero });
