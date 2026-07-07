/* ============ PAGE: ATTRACTIONS LIST ============ */
let activeSightCategory = 'Все';

function renderSightTabs(){
  const tabsEl = document.getElementById('sightTabs');
  tabsEl.innerHTML = SIGHT_CATEGORIES.map(c =>
    `<button class="filter-tab ${c===activeSightCategory?'active':''}" data-cat="${c}">${c}</button>`
  ).join('');
  tabsEl.querySelectorAll('.filter-tab').forEach(btn => {
    btn.addEventListener('click', () => { activeSightCategory = btn.dataset.cat; renderSightTabs(); renderSightsAll(); });
  });
}

function renderSightsAll(){
  const list = activeSightCategory === 'Все' ? SIGHTS : SIGHTS.filter(s => s.category === activeSightCategory);
  document.getElementById('sightsGrid').innerHTML = list.length
    ? list.map(sightCardHTML).join('')
    : '<div class="empty-state">Ничего не найдено.</div>';
}

document.addEventListener('DOMContentLoaded', () => {
  renderSightTabs();
  renderSightsAll();
});
