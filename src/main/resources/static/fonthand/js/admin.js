const ADMIN_PANEL_API = "http://localhost:8080/api/admin";
const VOTER_API = "http://localhost:8080/api/auth";

let adminCandidates = [];
let pendingConfirmAction = null;

function fetchAdminCandidates() {
  return fetch(ADMIN_PANEL_API + "/candidates")
    .then((res) => res.json())
    .then((data) => {
      adminCandidates = Array.isArray(data) ? data : [];
      return adminCandidates;
    })
    .catch((err) => {
      console.error(err);
      adminCandidates = [];
      return [];
    });
}

function renderAdmin() {
  Promise.all([fetchAdminCandidates(), loadResults()]).then(([candidates, results]) => {
    renderAdminStats(candidates, results);
    renderAdminCandidates(candidates);
  });
}

function renderAdminStats(candidates, results) {
  const host = document.getElementById('adminStats');
  if (!host) return;
  const totalVotes = (results || []).reduce((sum, candidate) => sum + (candidate.votes || 0), 0);
  host.innerHTML = `
    <div class="stat-card">
      <div class="stat-val">${candidates.length}</div>
      <div class="stat-lbl">Candidates</div>
    </div>
    <div class="stat-card">
      <div class="stat-val">${totalVotes}</div>
      <div class="stat-lbl">Votes Cast</div>
    </div>
    <div class="stat-card">
      <div class="stat-val">${(results || []).length}</div>
      <div class="stat-lbl">Result Rows</div>
    </div>`;
}

function renderAdminCandidates(candidates) {
  const host = document.getElementById('adminCandList');
  if (!host) return;

  host.innerHTML = candidates.length
    ? candidates
        .map(
          (candidate) => `
            <div class="card" style="margin-bottom:1rem;">
              <div style="display:flex;justify-content:space-between;gap:1rem;align-items:start;flex-wrap:wrap;">
                <div>
                  <h3>${candidate.name}</h3>
                  <p>${candidate.party || 'Independent'}</p>
                  <p>Votes: ${candidate.votes || 0}</p>
                </div>
                <div style="display:flex;gap:0.6rem;flex-wrap:wrap;">
                  <button class="btn btn-outline btn-sm" onclick="openEditCandidate(${candidate.id})">Edit</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteCandidate(${candidate.id})">Delete</button>
                </div>
              </div>
            </div>`
        )
        .join('')
    : '<div class="card">No candidates added yet.</div>';
}

function addCandidate() {
  const name = document.getElementById('candName')?.value.trim();
  const party = document.getElementById('candParty')?.value.trim();

  if (!name || !party) {
    showAlert('addCandAlert', 'danger', '⚠️ Enter candidate name and party');
    return;
  }

  fetch(ADMIN_PANEL_API + '/addCandidate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, party, votes: 0 }),
  })
    .then((res) => res.json())
    .then(() => {
      showAlert('addCandAlert', 'success', '✅ Candidate added');
      document.getElementById('candName').value = '';
      document.getElementById('candParty').value = '';
      const slogan = document.getElementById('candSlogan');
      if (slogan) slogan.value = '';
      renderAdmin();
      if (typeof loadCandidates === 'function') loadCandidates();
    })
    .catch(() => showAlert('addCandAlert', 'danger', '❌ Failed to add candidate'));
}

function openEditCandidate(id) {
  const candidate = adminCandidates.find((item) => item.id === id);
  if (!candidate) return;
  document.getElementById('editCandId').value = String(candidate.id);
  document.getElementById('editCandName').value = candidate.name || '';
  document.getElementById('editCandParty').value = candidate.party || '';
  document.getElementById('editCandSlogan').value = '';
  document.getElementById('editModal')?.classList.add('open');
}

function saveEdit() {
  const id = document.getElementById('editCandId')?.value;
  const name = document.getElementById('editCandName')?.value.trim();
  const party = document.getElementById('editCandParty')?.value.trim();
  const existing = adminCandidates.find((item) => String(item.id) === String(id));

  if (!id || !name || !party || !existing) {
    return;
  }

  fetch(ADMIN_PANEL_API + '/update/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: existing.id, name, party, votes: existing.votes || 0 }),
  })
    .then((res) => res.json())
    .then(() => {
      closeModal();
      renderAdmin();
      if (typeof loadCandidates === 'function') loadCandidates();
    })
    .catch((err) => console.error(err));
}

function deleteCandidate(id) {
  pendingConfirmAction = () => {
    fetch(ADMIN_PANEL_API + '/delete/' + id, { method: 'DELETE' })
      .then(() => {
        closeModal();
        renderAdmin();
        if (typeof loadCandidates === 'function') loadCandidates();
      })
      .catch((err) => console.error(err));
  };

  const confirmModal = document.getElementById('confirmModal');
  const confirmTitle = document.getElementById('confirmTitle');
  const confirmMsg = document.getElementById('confirmMsg');
  const confirmYes = document.getElementById('confirmYes');

  if (confirmTitle) confirmTitle.textContent = 'Delete candidate?';
  if (confirmMsg) confirmMsg.textContent = 'This candidate will be removed from the election list.';
  if (confirmYes) confirmYes.onclick = () => pendingConfirmAction && pendingConfirmAction();
  confirmModal?.classList.add('open');
}

function renderAdminResults() {
  fetch(ADMIN_PANEL_API + '/results')
    .then((res) => res.json())
    .then((data) => {
      const host = document.getElementById('adminResultsCard');
      if (!host) return;
      const totalVotes = data.reduce((sum, candidate) => sum + (candidate.votes || 0), 0);
      host.innerHTML = data.length
        ? data
            .sort((a, b) => (b.votes || 0) - (a.votes || 0))
            .map((candidate, index) => {
              const percent = totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : '0.0';
              return `
                <div class="result-item">
                  <div class="result-header">
                    <strong>${index === 0 && totalVotes > 0 ? '🥇 ' : ''}${candidate.name}</strong>
                    <span>${candidate.votes || 0} votes (${percent}%)</span>
                  </div>
                  <div class="result-bar-bg">
                    <div class="result-bar ${index === 0 && totalVotes > 0 ? 'winner' : ''}" style="width:${totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0}%"></div>
                  </div>
                </div>`;
            })
            .join('')
        : '<p>No results yet.</p>';
    })
    .catch((err) => console.error(err));
}

function renderVotersTable() {
  const tbody = document.getElementById('votersTbody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="5">Backend does not expose voter listing yet.</td></tr>';
}

function saveSettings() {
  const title = document.getElementById('elecTitle')?.value || 'General Secretary Election 2024–25';
  const startTime = document.getElementById('elecStart')?.value;
  const endTime = document.getElementById('elecEnd')?.value;

  if (!startTime || !endTime) {
    alert('Enter start and end time');
    return;
  }

  fetch(ADMIN_PANEL_API + '/setElection', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, startTime, endTime, active: true }),
  })
    .then((res) => res.json())
    .then(() => alert('✅ Election settings saved'))
    .catch((err) => console.error(err));
}

function resetElection() {
  alert('Reset all votes is not available from the current backend yet.');
}
