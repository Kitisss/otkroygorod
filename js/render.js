/* ============ RENDER: EVENT CARD (используется на index.html и events.html) ============ */
function eventCardHTML(ev){
  const bonusBadge = ev.status === 'soon'
    ? `<div class="card-bonus soon">Скоро</div>`
    : `<div class="card-bonus">+${ev.bonus}</div>`;
  const imgBlock = ev.image
    ? `<img src="${ev.image}" alt="${ev.title}">`
    : `<svg width="46" height="46" viewBox="0 0 46 46" fill="none"><circle cx="23" cy="23" r="18" stroke="var(--accent)" stroke-width="2"/><path d="M10 27L23 14" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"/></svg>`;
  return `
  <a class="card" href="event.html?id=${ev.id}">
    <div class="card-img">
      ${imgBlock}
      ${bonusBadge}
    </div>
    <div class="card-body">
      <span class="cat-tag">${ev.category}</span>
      <h3>${ev.title}</h3>
      <div class="card-meta"><span>${ev.date}</span><span>${ev.place}</span></div>
      <div class="card-desc">${ev.desc}</div>
      <div class="card-cta">Подробнее →</div>
    </div>
  </a>`;
}

/* ============ RENDER: SIGHT CARD (используется на attractions.html) ============ */
function sightCardHTML(s){
  const badge = s.qrEnabled
    ? `<div class="card-bonus">+${s.bonus}</div>`
    : `<div class="card-bonus soon">Инфо</div>`;
  const imgBlock = s.image
    ? `<img src="${s.image}" alt="${s.title}">`
    : `<svg width="46" height="46" viewBox="0 0 46 46" fill="none"><circle cx="23" cy="23" r="18" stroke="var(--accent)" stroke-width="2"/><path d="M10 27L23 14" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"/></svg>`;
  return `
  <div class="card">
    <div class="card-img">
      ${imgBlock}
      ${badge}
    </div>
    <div class="card-body">
      <span class="cat-tag">${s.category}</span>
      <h3>${s.title}</h3>
      <div class="card-meta"><span>📍 ${s.address}</span></div>
      <div class="card-desc">${s.desc}</div>
      ${s.qrEnabled ? `<div class="card-cta">📷 Отсканируйте QR на месте — получите бонус</div>` : ''}
    </div>
  </div>`;
}
