/* ============ PAGE: HOME ============ */
document.addEventListener('DOMContentLoaded', () => {
  const cityMeta = currentCityMeta();
  const grid = document.getElementById('eventsGridHome');
  if(cityMeta.status === 'soon'){
    grid.innerHTML = cityInDevelopmentHTML(cityMeta);
  } else {
    const list = EVENTS.filter(e => e.city === cityMeta.id);
    grid.innerHTML = list.length
      ? list.slice(0,3).map(eventCardHTML).join('')
      : '<div class="empty-state">Пока нет мероприятий в этом городе.</div>';
  }

  function runHeroSearch(){
    const q = document.getElementById('heroSearchInput').value;
    location.href = 'events.html' + (q.trim() ? ('?q=' + encodeURIComponent(q)) : '');
  }
  document.getElementById('heroSearchBtn').addEventListener('click', runHeroSearch);
  document.getElementById('heroSearchInput').addEventListener('keydown', e => { if(e.key === 'Enter') runHeroSearch(); });
});
