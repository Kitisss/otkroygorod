/* ============ PAGE: EVENTS LIST ============ */
let activeCategory = 'Все';
let searchQuery = '';

function renderCategoryTabs(){
  const tabsEl = document.getElementById('categoryTabs');
  const cityMeta = currentCityMeta();
  if(cityMeta.status === 'soon'){ tabsEl.innerHTML = ''; return; }
  tabsEl.innerHTML = CATEGORIES.map(c =>
    `<button class="filter-tab ${c===activeCategory?'active':''}" data-cat="${c}">${c}</button>`
  ).join('');
  tabsEl.querySelectorAll('.filter-tab').forEach(btn => {
    btn.addEventListener('click', () => { activeCategory = btn.dataset.cat; renderCategoryTabs(); renderEventsAll(); });
  });
}

function renderEventsAll(){
  const cityMeta = currentCityMeta();
  const gridEl = document.getElementById('eventsGridAll');
  if(cityMeta.status === 'soon'){
    gridEl.innerHTML = cityInDevelopmentHTML(cityMeta);
    return;
  }
  let list = EVENTS.filter(e => e.city === cityMeta.id);
  if(activeCategory !== 'Все') list = list.filter(e => e.category === activeCategory);
  if(searchQuery.trim()){
    const q = searchQuery.trim().toLowerCase();
    list = list.filter(e => e.title.toLowerCase().includes(q) || e.desc.toLowerCase().includes(q) || e.place.toLowerCase().includes(q));
  }
  gridEl.innerHTML = list.length
    ? list.map(eventCardHTML).join('')
    : '<div class="empty-state">Ничего не найдено. Попробуйте другой запрос или категорию.</div>';
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  searchQuery = params.get('q') || '';
  renderCategoryTabs();
  renderEventsAll();
});
