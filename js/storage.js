/* ============ STORAGE (профиль пользователя хранится в localStorage браузера) ============ */
const STORE_KEY = 'otg_profile_v1';

function getProfile(){
  try{ return JSON.parse(localStorage.getItem(STORE_KEY)) || {balance:0, history:[]}; }
  catch(e){ return {balance:0, history:[]}; }
}
function saveProfile(p){ localStorage.setItem(STORE_KEY, JSON.stringify(p)); }
function hasScanned(code){ return getProfile().history.some(h => h.code === code); }

/* Начисляет бонус за мероприятие или музей (ищет по id сначала в EVENTS, потом в SIGHTS с qrEnabled).
   Если бонус уже был получен ранее — возвращает status:'already' и повторно не начисляет. */
function redeemBonus(eventId){
  let ev = EVENTS.find(e => e.id === eventId && e.status !== 'soon' && e.bonus);
  if(!ev) ev = SIGHTS.find(s => s.id === eventId && s.qrEnabled && s.bonus);
  if(!ev) return {status:'error'};
  const profile = getProfile();
  if(profile.history.some(h => h.code === eventId)){
    return {status:'already', event: ev};
  }
  profile.balance += ev.bonus;
  profile.history.unshift({
    code: eventId,
    title: ev.title,
    points: ev.bonus,
    date: new Date().toLocaleString('ru-RU', {day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'})
  });
  saveProfile(profile);
  return {status:'success', event: ev};
}

/* Списывает бонусы за покупку товара в магазине (js/data.js → SHOP).
   Если бонусов не хватает — возвращает status:'nofunds', иначе списывает и пишет в историю. */
function spendBonus(itemId){
  const item = SHOP.find(s => s.id === itemId);
  if(!item) return {status:'error'};
  const profile = getProfile();
  if(profile.balance < item.cost) return {status:'nofunds', item};
  profile.balance -= item.cost;
  profile.history.unshift({
    code: 'shop-' + item.id,
    title: item.title,
    points: -item.cost,
    date: new Date().toLocaleString('ru-RU', {day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'})
  });
  saveProfile(profile);
  return {status:'success', item};
}

/* ============ SOUND (короткий "дзынь" при начислении бонуса, без аудиофайлов) ============ */
function playChime(){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [880, 1320];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const start = ctx.currentTime + i * 0.09;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.18, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.55);
    });
  }catch(e){ /* тихо игнорируем, если звук недоступен (например, автоплей заблокирован) */ }
}

/* Разлёт звёзд-конфетти на весь экран, вызывается при успешном начислении бонуса */
function launchConfetti(){
  const layer = document.createElement('div');
  layer.className = 'confetti-layer';
  const glyphs = ['⭐','✨','🎉'];
  const count = 22;
  for(let i=0;i<count;i++){
    const s = document.createElement('span');
    s.className = 'confetti-piece';
    s.textContent = glyphs[Math.floor(Math.random()*glyphs.length)];
    s.style.left = (Math.random()*100) + '%';
    s.style.setProperty('--drift', (Math.random()*160-80) + 'px');
    s.style.setProperty('--rot', (Math.random()*720-360) + 'deg');
    s.style.animationDelay = (Math.random()*0.35) + 's';
    s.style.fontSize = (14 + Math.random()*16) + 'px';
    layer.appendChild(s);
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 2200);
}

/* ============ SCAN OVERLAY (попап "+N бонусов" / "уже получено") ============ */
function showScanOverlay(result){
  const overlay = document.createElement('div');
  overlay.className = 'scan-overlay';
  if(result.status === 'success'){
    overlay.innerHTML = `
      <div class="scan-card">
        <div class="scan-icon">✓</div>
        <div class="scan-title">Визит подтверждён</div>
        <div class="scan-bonus">+${result.event.bonus} ⭐</div>
        <div class="scan-sub">Бонусы за «${result.event.title}» зачислены на ваш счёт.</div>
        <button class="scan-close" onclick="this.closest('.scan-overlay').remove(); location.href='cabinet.html';">Открыть кабинет</button>
      </div>`;
    document.body.appendChild(overlay);
    launchConfetti();
    playChime();
    return;
  } else if(result.status === 'already'){
    overlay.innerHTML = `
      <div class="scan-card">
        <div class="scan-icon warn">i</div>
        <div class="scan-title">Вы уже получили бонус</div>
        <div class="scan-sub">За «${result.event.title}» бонус уже был начислен ранее. Повторно он не начисляется.</div>
        <button class="scan-close" onclick="this.closest('.scan-overlay').remove();">Понятно</button>
      </div>`;
  } else {
    return;
  }
  document.body.appendChild(overlay);
}

/* Попап после покупки в магазине бонусов */
function showShopOverlay(result){
  const overlay = document.createElement('div');
  overlay.className = 'scan-overlay';
  if(result.status === 'success'){
    overlay.innerHTML = `
      <div class="scan-card">
        <div class="scan-icon">${result.item.icon}</div>
        <div class="scan-title">Покупка оформлена</div>
        <div class="scan-bonus">−${result.item.cost} ⭐</div>
        <div class="scan-sub">«${result.item.title}» получен. Покажите этот экран на стойке партнёра.</div>
        <button class="scan-close" onclick="this.closest('.scan-overlay').remove();">Готово</button>
      </div>`;
  } else if(result.status === 'nofunds'){
    overlay.innerHTML = `
      <div class="scan-card">
        <div class="scan-icon warn">!</div>
        <div class="scan-title">Недостаточно бонусов</div>
        <div class="scan-sub">Для «${result.item.title}» нужно ${result.item.cost} ⭐. Посетите ещё мероприятия, чтобы накопить нужную сумму.</div>
        <button class="scan-close" onclick="this.closest('.scan-overlay').remove();">Понятно</button>
      </div>`;
  } else {
    return;
  }
  document.body.appendChild(overlay);
}

/* Анимированный счёт числа от 0 до target (используется в личном кабинете) */
function animateNumber(el, target){
  const start = 0; const duration = 800; const startTime = performance.now();
  function tick(now){
    const p = Math.min(1, (now - startTime) / duration);
    el.textContent = Math.round(start + (target-start) * (1 - Math.pow(1-p, 3)));
    if(p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* Обработка входящего QR-сканирования: если в адресе страницы есть ?scan=код
   (именно так будет устроена ссылка в QR-коде организатора), начисляем бонус
   и очищаем адрес, чтобы обновление страницы не срабатывало повторно. */
function checkIncomingScan(){
  const params = new URLSearchParams(location.search);
  const code = params.get('scan');
  if(code){
    const result = redeemBonus(code);
    if(result.status !== 'error') showScanOverlay(result);
    history.replaceState(null, '', location.pathname);
  }
}
