/* ============ PAGE: EVENT DETAIL ============ */
function renderEventDetail(id){
  const ev = EVENTS.find(e => e.id === id);
  const wrap = document.getElementById('eventDetailContent');
  if(!ev){ wrap.innerHTML = '<p>Мероприятие не найдено. <a href="events.html">Ко всем мероприятиям</a></p>'; return; }

  const heroImg = ev.image
    ? `<img src="${ev.image}" alt="${ev.title}">`
    : `<svg width="60" height="60" viewBox="0 0 46 46" fill="none"><circle cx="23" cy="23" r="18" stroke="var(--accent)" stroke-width="2"/><path d="M10 27L23 14" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"/></svg>`;

  let actionBlock;
  if(ev.status === 'soon'){
    actionBlock = `
    <div class="qr-box">
      <div class="qr-info">
        <h4>Дата уточняется</h4>
        <p>Дата ближайшего показа в Пензе пока не объявлена. Следите за обновлениями на платформе — как только дата будет назначена, здесь появится QR-код и бонус за визит.</p>
      </div>
    </div>`;
  } else {
    actionBlock = `
    <div class="qr-box">
      <div class="qr-info">
        <h4>Как получить бонус</h4>
        <p>На самом мероприятии организатор предоставит QR-код для сканирования — отсканируйте его камерой телефона, и бонус зачислится автоматически. Если QR недоступен, воспользуйтесь промокодом ниже.</p>
        <div class="bonus-pill">🎁 +${ev.bonus} бонусов за визит</div>
        ${ev.ticketUrl ? `<p style="margin-top:14px;">${ev.ticketNote || ''}</p><a href="${ev.ticketUrl}" class="bonus-pill" style="background:var(--bg-elevated-2); color:var(--text); border:1px solid var(--border); margin-top:8px; display:inline-flex;">🎫 Купить билет</a>` : ''}
      </div>
    </div>
    <div class="promo-box">
      <h4>Подтвердить визит промокодом</h4>
      <p>Введите промокод, который вам назовёт организатор на месте мероприятия — бонус начислится сразу.</p>
      <div class="promo-row">
        <input type="text" id="promoInput" placeholder="Например, GASTRO2026">
        <button id="promoBtn">Применить</button>
      </div>
      <div class="promo-error" id="promoError"></div>
    </div>`;
  }

  wrap.innerHTML = `
    <a href="events.html" class="back-link">← Ко всем мероприятиям</a>
    <div class="detail-hero">${heroImg}</div>
    <span class="cat-tag">${ev.category}</span>
    <h1 class="detail-title">${ev.title}</h1>
    <div class="detail-meta">
      <span>📅 ${ev.date}${ev.time ? ', ' + ev.time : ''}</span>
      <span>📍 ${ev.place}</span>
      ${ev.status !== 'soon' ? `<span>🎁 +${ev.bonus} бонусов</span>` : ''}
    </div>
    <p class="detail-desc">${ev.desc}</p>
    ${actionBlock}
  `;

  if(ev.status !== 'soon'){
    const promoBtn = document.getElementById('promoBtn');
    const promoInput = document.getElementById('promoInput');
    const promoError = document.getElementById('promoError');
    function submitPromo(){
      const entered = promoInput.value.trim().toUpperCase();
      if(!entered){ return; }
      if(entered === ev.promoCode){
        promoError.textContent = '';
        const result = redeemBonus(ev.id);
        showScanOverlay(result);
        updateHeaderDot();
      } else {
        promoError.textContent = 'Неверный промокод. Проверьте написание и попробуйте снова.';
      }
    }
    promoBtn.addEventListener('click', submitPromo);
    promoInput.addEventListener('keydown', e => { if(e.key === 'Enter') submitPromo(); });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  renderEventDetail(params.get('id'));
});
