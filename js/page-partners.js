/* ============ PAGE: PARTNERS ============ */
function partnerCardHTML(p){
  return `
  <div class="partner-card">
    <div class="partner-head">
      <div class="partner-avatar">🎭</div>
      <div>
        <div class="partner-title">${p.title}</div>
        <div class="partner-tagline">«${p.tagline}»</div>
      </div>
      <div class="partner-since">С ${p.since} года</div>
    </div>
    <div class="partner-achievement"><b>🏆 Достижение 2026 года:</b> ${p.achievement}</div>
    <div class="partner-desc">${p.desc}</div>
    <div class="partner-repertoire">
      ${p.repertoire.map(r => `<span class="repertoire-pill">${r}</span>`).join('')}
    </div>
    <div class="partner-actions">
      <a href="${p.ticketUrl}" target="_blank" rel="noopener" class="partner-btn-primary">🎫 Купить билет на сайте театра</a>
      <a href="cabinet.html" class="partner-btn-secondary">⭐ Обменять бонусы на билет</a>
    </div>
  </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('partnersList').innerHTML = PARTNERS.map(partnerCardHTML).join('');
});
