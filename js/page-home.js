/* ============ PAGE: HOME ============ */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('eventsGridHome').innerHTML = EVENTS.slice(0,3).map(eventCardHTML).join('');

  function runHeroSearch(){
    const q = document.getElementById('heroSearchInput').value;
    location.href = 'events.html' + (q.trim() ? ('?q=' + encodeURIComponent(q)) : '');
  }
  document.getElementById('heroSearchBtn').addEventListener('click', runHeroSearch);
  document.getElementById('heroSearchInput').addEventListener('keydown', e => { if(e.key === 'Enter') runHeroSearch(); });
});
