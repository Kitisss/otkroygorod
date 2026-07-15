/* ============ PAGE: ATTRACTIONS LIST ============ */
let activeSightCategory = 'Все';

function renderSightTabs(){
  const tabsEl = document.getElementById('sightTabs');
  const cityMeta = currentCityMeta();
  if(cityMeta.status === 'soon'){ tabsEl.innerHTML = ''; return; }
  tabsEl.innerHTML = SIGHT_CATEGORIES.map(c =>
    `<button class="filter-tab ${c===activeSightCategory?'active':''}" data-cat="${c}">${c}</button>`
  ).join('');
  tabsEl.querySelectorAll('.filter-tab').forEach(btn => {
    btn.addEventListener('click', () => { activeSightCategory = btn.dataset.cat; renderSightTabs(); renderSightsAll(); });
  });
}

function renderSightsAll(){
  const cityMeta = currentCityMeta();
  const titleEl = document.getElementById('sightsTitle');
  if(titleEl) titleEl.textContent = 'Достопримечательности: ' + cityMeta.label;
  const gridEl = document.getElementById('sightsGrid');
  if(cityMeta.status === 'soon'){
    gridEl.innerHTML = cityInDevelopmentHTML(cityMeta);
    return;
  }
  let list = SIGHTS.filter(s => s.city === cityMeta.id);
  if(activeSightCategory !== 'Все') list = list.filter(s => s.category === activeSightCategory);
  gridEl.innerHTML = list.length
    ? list.map(sightCardHTML).join('')
    : '<div class="empty-state">Ничего не найдено.</div>';
}

document.addEventListener('DOMContentLoaded', () => {
  renderSightTabs();
  renderSightsAll();
});
