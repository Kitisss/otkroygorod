/* ============ PAGE: CABINET ============ */
function renderCabinet(){
  const p = getProfile();
  const visits = p.history.length;

  animateNumber(document.getElementById('balanceNum'), p.balance);

  let level = LEVELS[0], next = LEVELS[1];
  for(let i=0;i<LEVELS.length;i++){ if(visits >= LEVELS[i].min){ level = LEVELS[i]; next = LEVELS[i+1]; } }
  document.getElementById('statusBadge').textContent = level.label;
  if(next){
    const pct = Math.min(100, Math.round((visits - level.min) / (next.min - level.min) * 100));
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('progressNote').textContent = `${visits} посещений · до статуса «${next.label.replace(/^[^ ]+ /,'')}» ещё ${next.min - visits}`;
  } else {
    document.getElementById('progressFill').style.width = '100%';
    document.getElementById('progressNote').textContent = `${visits} посещений · максимальный статус достигнут`;
  }

  const list = document.getElementById('historyList');
  if(p.history.length === 0){
    list.innerHTML = '<div class="empty-state">Пока нет посещений. Отсканируйте QR-код на любом мероприятии, чтобы получить первые бонусы.</div>';
  } else {
    list.innerHTML = p.history.map(h => `
      <div class="history-item">
        <div class="history-left">
          <div class="history-icon">${h.code && h.code.startsWith('shop-') ? '🛍️' : '🎟️'}</div>
          <div><div class="history-name">${h.title}</div><div class="history-date">${h.date}</div></div>
        </div>
        <div class="history-points" style="${h.points < 0 ? 'color:var(--text-muted);' : ''}">${h.points > 0 ? '+' : ''}${h.points}</div>
      </div>`).join('');
  }
}

function renderShop(){
  const grid = document.getElementById('shopGrid');
  if(!grid) return;
  const balance = getProfile().balance;
  grid.innerHTML = SHOP.map(item => `
    <div class="shop-item">
      <div class="shop-icon">${item.icon}</div>
      <div class="shop-title">${item.title}</div>
      <div class="shop-cost">${item.cost} ⭐</div>
      <button class="shop-buy" data-id="${item.id}" ${balance < item.cost ? 'disabled' : ''}>Обменять</button>
    </div>`).join('');

  grid.querySelectorAll('.shop-buy').forEach(btn => {
    btn.addEventListener('click', () => {
      const result = spendBonus(btn.dataset.id);
      showShopOverlay(result);
      updateHeaderDot();
      renderCabinet();
      renderShop();
      renderBadges();
    });
  });
}

function renderBadges(){
  const grid = document.getElementById('badgesGrid');
  if(!grid) return;
  const profile = getProfile();
  grid.innerHTML = BADGES.map(b => {
    const unlocked = b.check(profile);
    return `
    <div class="badge-item ${unlocked ? '' : 'locked'}">
      <div class="badge-icon">${b.icon}</div>
      <div class="badge-title">${b.title}</div>
      <div class="badge-desc">${b.desc}</div>
    </div>`;
  }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderCabinet();
  renderShop();
  renderBadges();
});
