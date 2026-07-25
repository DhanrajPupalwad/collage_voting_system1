const API = "http://localhost:8080/api";

let selectedCandId = null;
let cachedCandidates = [];

function getLoggedInVoterId() {
  return localStorage.getItem("voterId");
}

function getLoggedInUserName() {
  return localStorage.getItem("userName") || "Student";
}

function hasCurrentUserVoted() {
  return localStorage.getItem("hasVoted") === "true";
}

function renderDash() {
  const voterId = getLoggedInVoterId();
  if (!voterId) {
    showPage("student-login");
    return;
  }

  const welcome = document.getElementById("studentWelcome");
  if (welcome) {
    welcome.textContent = "👋 Welcome, " + getLoggedInUserName();
  }

  const voteStatus = document.getElementById("dashVoteStatus");
  const voteBtn = document.getElementById("voteBtn");
  const voted = hasCurrentUserVoted();

  if (voteStatus) voteStatus.textContent = voted ? "Submitted" : "Pending";
  if (voteBtn) {
    voteBtn.disabled = voted;
    voteBtn.textContent = voted ? "✅ Vote Submitted" : "🗳 Cast Your Vote";
  }

  loadCandidates();
}

function loadCandidates() {
  fetch(API + "/admin/results")
    .then((res) => res.json())
    .then((data) => {
      cachedCandidates = Array.isArray(data) ? data : [];
      renderCandidateSummary(cachedCandidates);
      renderVotePage();
    })
    .catch((err) => console.error(err));
}

function renderCandidateSummary(candidates) {
  const dashCount = document.getElementById("dashCandCount");
  const dashTotalVotes = document.getElementById("dashTotalVotes");
  const dashCandList = document.getElementById("dashCandList");

  if (dashCount) dashCount.textContent = String(candidates.length);
  if (dashTotalVotes) {
    const totalVotes = candidates.reduce((sum, candidate) => sum + (candidate.votes || 0), 0);
    dashTotalVotes.textContent = String(totalVotes);
  }

  if (dashCandList) {
    dashCandList.innerHTML = candidates.length
      ? candidates
          .map(
            (candidate) => `
              <div class="card" style="padding:1rem; margin-bottom:0.6rem;">
                <h4>${candidate.name}</h4>
                <p>${candidate.party || "Independent"}</p>
                <p>Votes: ${candidate.votes || 0}</p>
              </div>`
          )
          .join("")
      : '<div class="card" style="padding:1rem;">No candidates available yet.</div>';
  }
}

function renderVotePage() {
  const voteList = document.getElementById("voteList");
  const votedMessage = document.getElementById("alreadyVotedMsg");
  const submitVoteBtn = document.getElementById("submitVoteBtn");
  const voted = hasCurrentUserVoted();

  if (!voteList) return;

  if (votedMessage) votedMessage.style.display = voted ? "block" : "none";
  if (submitVoteBtn) submitVoteBtn.disabled = voted;

  voteList.innerHTML = cachedCandidates.length
    ? cachedCandidates
        .map(
          (candidate) => `
            <div class="card vote-candidate ${selectedCandId === candidate.id ? "selected" : ""}" data-candidate-id="${candidate.id}" onclick="selectCandidate(${candidate.id})" style="margin-bottom:1rem; cursor:${voted ? "not-allowed" : "pointer"}; opacity:${voted ? "0.7" : "1"};">
              <h4>${candidate.name}</h4>
              <p>${candidate.party || "Independent"}</p>
            </div>`
        )
        .join("")
    : '<div class="card">No candidates available yet.</div>';
}

function selectCandidate(id) {
  if (hasCurrentUserVoted()) {
    return;
  }

  selectedCandId = id;
  document.querySelectorAll(".vote-candidate").forEach((el) => {
    el.classList.toggle("selected", Number(el.dataset.candidateId) === id);
  });
}

function submitVote() {
  const voterId = getLoggedInVoterId();

  if (!voterId) {
    alert("Please login first");
    showPage("student-login");
    return;
  }

  if (hasCurrentUserVoted()) {
    alert("You already voted");
    showPage("results");
    return;
  }

  if (!selectedCandId) {
    alert("⚠️ Select a candidate first");
    return;
  }

  fetch(API + "/vote/" + voterId + "/" + selectedCandId, {
    method: "POST"
  })
    .then((res) => res.text())
    .then((data) => {
      alert(data);
      if (data.toLowerCase().includes("success")) {
        localStorage.setItem("hasVoted", "true");
        if (currentUser?.type === "student") {
          currentUser.data.hasVoted = true;
        }
        selectedCandId = null;
        renderDash();
        loadResults();
        showPage("results");
      }
    })
    .catch((err) => console.error(err));
}
