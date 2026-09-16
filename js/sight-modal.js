/* ============ SIGHT MODALS / QR LANDING ============ */
const QR_SIGHT_IDS = new Set([
  'naberezhnaya-sputnika',
  'dom-ofitserov',
  'pervoposelenec',
  'muzey-odnoy-kartiny'
]);

function getSightById(id){
  return SIGHTS.find(s => s.id === id);
}

function closeSightModal(){
  const modal = document.getElementById('sightModal');
  if(modal) modal.remove();
  document.body.classList.remove('modal-open');
}

function showSightModal(id){
  const sight = getSightById(id);
  if(!sight) return;
  closeSightModal();

  const modal = document.createElement('div');
  modal.id = 'sightModal';
  modal.className = 'sight-modal';
  modal.innerHTML = `
    <div class="sight-modal-backdrop" data-close-sight></div>
    <div class="sight-modal-card" role="dialog" aria-modal="true" aria-labelledby="sightModalTitle">
      <button class="sight-modal-close" type="button" aria-label="Закрыть" data-close-sight>×</button>
      <div class="sight-modal-image-wrap">
        ${sight.image ? `<img src="${sight.image}" alt="${sight.title}">` : ''}
        <span class="sight-modal-tag">${sight.category}</span>
      </div>
      <div class="sight-modal-body">
        <h2 id="sightModalTitle">${sight.title}</h2>
        <div class="sight-modal-address">📍 ${sight.address}</div>
        <p>${sight.desc}</p>
        ${sight.nowHere ? `
        <div class="sight-modal-now">
          <div class="sight-modal-now-label">🔥 Сейчас здесь</div>
          <div class="sight-modal-now-text">${sight.nowHere}</div>
        </div>` : ''}
        <div class="sight-modal-note">QR-точка проекта «Открой город» · информационная карточка</div>
      </div>
    </div>`;
  document.body.appendChild(modal);
  document.body.classList.add('modal-open');

  modal.querySelectorAll('[data-close-sight]').forEach(el => el.addEventListener('click', closeSightModal));
  document.addEventListener('keydown', handleSightEsc, {once:true});
}

function handleSightEsc(e){
  if(e.key === 'Escape') closeSightModal();
}

function handleSightCards(){
  document.querySelectorAll('[data-sight-id]').forEach(card => {
    card.addEventListener('click', () => showSightModal(card.dataset.sightId));
  });
}

function checkIncomingSight(){
  const params = new URLSearchParams(location.search);
  const id = params.get('sight');
  if(!id || !getSightById(id)) return;
  history.replaceState(null, '', location.pathname);
  showSightModal(id);
}

document.addEventListener('DOMContentLoaded', () => {
  handleSightCards();
  checkIncomingSight();
});
