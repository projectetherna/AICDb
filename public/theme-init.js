// Dreamwall — theme bootstrap. Plain JS, loaded synchronously in <head> so the
// correct theme is on <html> before first paint (no flash). Reads the persisted
// preference, maps legacy + System values, and toggles data-theme="solarpunk".
(function () {
  function resolve(t) {
    if (t === 'System') {
      return (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'Solarpunk' : 'Cyberpunk';
    }
    if (t === 'Light') return 'Solarpunk';   // legacy
    if (t === 'Dark') return 'Cyberpunk';     // legacy
    return t || 'Cyberpunk';
  }
  function apply(theme) {
    var t = resolve(theme);
    var root = document.documentElement;
    if (t === 'Solarpunk') root.setAttribute('data-theme', 'solarpunk');
    else root.removeAttribute('data-theme');
  }
  // expose for live switching from Preferences
  window.AICDB_applyTheme = apply;
  try {
    var prefs = JSON.parse(localStorage.getItem('aicdb_prefs') || '{}');
    apply(prefs.theme);
  } catch (e) { apply('Cyberpunk'); }
})();
