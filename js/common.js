/* ============ THEME (тёмная тема на десктопе, светлая на мобильном) ============ */
function applyAutoTheme(){
  const preferred = window.matchMedia('(max-width:768px)').matches ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', preferred);
  const btn = document.getElementById('themeToggle');
  if(btn) btn.textContent = preferred === 'dark' ? '🌙' : '☀️';
}
function wireThemeToggle(){
  const btn = document.getElementById('themeToggle');
  if(!btn) return;
  btn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    btn.textContent = next === 'dark' ? '🌙' : '☀️';
  });
}

/* Обновляет зелёный кружок с балансом бонусов в шапке сайта (есть на каждой странице) */
function updateHeaderDot(){
  const dot = document.getElementById('headerBonusDot');
  if(dot) dot.textContent = getProfile().balance;
}

/* ============ MOBILE NAV (гамбургер-меню) ============ */
function wireNavToggle(){
  const btn = document.getElementById('navToggle');
  const nav = document.querySelector('header nav');
  if(!btn || !nav) return;
  btn.addEventListener('click', () => {
    nav.classList.toggle('nav-open');
    btn.textContent = nav.classList.contains('nav-open') ? '✕' : '☰';
  });
  // закрываем меню после перехода по ссылке
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('nav-open');
      btn.textContent = '☰';
    });
  });
}

/* ============ INIT (выполняется на каждой странице) ============ */
document.addEventListener('DOMContentLoaded', () => {
  applyAutoTheme();
  wireThemeToggle();
  wireNavToggle();
  checkIncomingScan();
  updateHeaderDot();
});
