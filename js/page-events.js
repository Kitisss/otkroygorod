/* ============ PAGE: EVENTS LIST ============ */
let activeCategory = 'Все';
let searchQuery = '';

function renderCategoryTabs(){
  const tabsEl = document.getElementById('categoryTabs');
  tabsEl.innerHTML = CATEGORIES.map(c =>
    `<button class="filter-tab ${c===activeCategory?'active':''}" data-cat="${c}">${c}</button>`
  ).join('');
  tabsEl.querySelectorAll('.filter-tab').forEach(btn => {
    btn.addEventListener('click', () => { activeCategory = btn.dataset.cat; renderCategoryTabs(); renderEventsAll(); });
  });
}

function renderEventsAll(){
  let list = activeCategory === 'Все' ? EVENTS : EVENTS.filter(e => e.category === activeCategory);
  if(searchQuery.trim()){
    const q = searchQuery.trim().toLowerCase();
    list = list.filter(e => e.title.toLowerCase().includes(q) || e.desc.toLowerCase().includes(q) || e.place.toLowerCase().includes(q));
  }
  document.getElementById('eventsGridAll').innerHTML = list.length
    ? list.map(eventCardHTML).join('')
    : '<div class="empty-state">Ничего не найдено. Попробуйте другой запрос или категорию.</div>';
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  searchQuery = params.get('q') || '';
  renderCategoryTabs();
  renderEventsAll();
});
