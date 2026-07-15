/* ============ CITIES (переключатель города в шапке) ============ */

/* Текущий выбранный город хранится в localStorage, по умолчанию — Пенза */
function getCurrentCity(){
  return localStorage.getItem('otg_city') || 'penza';
}
function setCurrentCity(id){
  localStorage.setItem('otg_city', id);
  location.reload(); // проще всего пересобрать страницу с новым городом
}
function currentCityMeta(){
  return CITIES.find(c => c.id === getCurrentCity()) || CITIES[0];
}

/* HTML-заглушка «раздел в разработке» — используется на всех страницах для городов со status:'soon' */
function cityInDevelopmentHTML(cityMeta){
  return `
  <div class="empty-state" style="grid-column:1/-1; padding:70px 20px; max-width:480px; margin:0 auto;">
    <div style="font-family:var(--font-display); font-size:16px; font-weight:800; text-transform:uppercase; color:var(--text); margin-bottom:10px;">
      ${cityMeta.label} — раздел в разработке
    </div>
    <div>Мы уже готовим мероприятия и достопримечательности для этого города. Загляните чуть позже!</div>
  </div>`;
}

/* Рисует выпадающий список городов в шапке и подсвечивает текущий выбор */
function renderCityDropdown(){
  const dd = document.getElementById('cityDropdown');
  const label = document.getElementById('cityLabel');
  if(!dd || !label) return;
  const current = getCurrentCity();
  label.textContent = currentCityMeta().label;
  dd.innerHTML = CITIES.map(c => `
    <button class="city-option ${c.id===current?'active':''}" data-city="${c.id}">
      <span>${c.label}</span>
      ${c.status === 'soon' ? '<span class="city-soon-tag">скоро</span>' : ''}
    </button>`).join('');
  dd.querySelectorAll('.city-option').forEach(btn => {
    btn.addEventListener('click', () => setCurrentCity(btn.dataset.city));
  });
}

/* Открытие/закрытие выпадающего списка городов по клику */
function wireCityToggle(){
  const wrap = document.getElementById('cityToggle')?.closest('.city-switch');
  const btn = document.getElementById('cityToggle');
  if(!wrap || !btn) return;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    wrap.classList.toggle('open');
  });
  document.addEventListener('click', () => wrap.classList.remove('open'));
}

document.addEventListener('DOMContentLoaded', () => {
  renderCityDropdown();
  wireCityToggle();
});
