// ════════════════════════════════
// router.js — page navigation + shared UI helpers
// ════════════════════════════════

let currentUser = null;

function showAlert(id, type, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = 'alert alert-' + type + ' show';
  el.textContent = msg;
  setTimeout(() => {
    el.className = 'alert';
  }, 3500);
}

function showPage(id) {
  document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
  const target = document.getElementById('page-' + id);
  if (target) target.classList.add('active');
  updateNav();

  if (id === 'results' && typeof renderResults === 'function') renderResults();
  if (id === 'student-dash' && typeof renderDash === 'function') renderDash();
  if (id === 'vote' && typeof renderVotePage === 'function') renderVotePage();
  if (id === 'admin' && typeof renderAdmin === 'function') renderAdmin();

  window.scrollTo(0, 0);
}

function updateNav() {
  const navUser = document.getElementById('navUser');
  const navLogout = document.getElementById('navLogout');
  const navResults = document.getElementById('navResults');

  if (!navUser || !navLogout || !navResults) return;

  if (currentUser) {
    navUser.textContent = currentUser.type === 'admin'
      ? '🛡 Admin'
      : '👤 ' + ((currentUser.data?.name || 'Student').split(' ')[0]);
    navLogout.style.display = 'inline-flex';
    navResults.style.display = 'inline-flex';
  } else {
    navUser.textContent = '';
    navLogout.style.display = 'none';
    navResults.style.display = 'none';
  }
}

function goResults() { showPage('results'); }
function goPublicResults() { showPage('results'); }

function switchTab(t) {
  ['login', 'register'].forEach((tab) => {
    document.getElementById('tab-' + tab)?.classList.toggle('active', tab === t);
    const panel = document.getElementById('tab-content-' + tab);
    if (panel) panel.style.display = tab === t ? 'block' : 'none';
  });
}

function switchAdminTab(t) {
  ['candidates', 'voters', 'results', 'settings'].forEach((tab) => {
    document.getElementById('atab-' + tab)?.classList.toggle('active', tab === t);
    const panel = document.getElementById('atab-content-' + tab);
    if (panel) panel.style.display = tab === t ? 'block' : 'none';
  });
  if (t === 'voters' && typeof renderVotersTable === 'function') renderVotersTable();
  if (t === 'results' && typeof renderAdminResults === 'function') renderAdminResults();
}

function closeModal() {
  document.querySelectorAll('.modal-overlay').forEach((m) => m.classList.remove('open'));
}

window.addEventListener('DOMContentLoaded', () => {
  updateNav();
});
