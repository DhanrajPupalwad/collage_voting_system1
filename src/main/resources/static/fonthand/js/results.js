const RESULTS_API = "http://localhost:8080/api/admin";

function loadResults() {
  return fetch(RESULTS_API + "/results")
    .then((res) => res.json())
    .then((data) => {
      renderResults(Array.isArray(data) ? data : []);
      return data;
    })
    .catch((err) => {
      console.error(err);
      renderResults([]);
      return [];
    });
}

function renderResults(candidates = null) {
  if (!Array.isArray(candidates)) {
    loadResults();
    return;
  }

  const total = candidates.reduce((sum, candidate) => sum + (candidate.votes || 0), 0);
  const sorted = [...candidates].sort((a, b) => (b.votes || 0) - (a.votes || 0));
  const winner = sorted[0];

  const totalVotesEl = document.getElementById("resTotalVotes");
  const candidatesEl = document.getElementById("resCandidates");
  const votersEl = document.getElementById("resVoters");
  const banner = document.getElementById("winnerBanner");
  const chart = document.getElementById("resultsChart");

  if (totalVotesEl) totalVotesEl.textContent = String(total);
  if (candidatesEl) candidatesEl.textContent = String(candidates.length);
  if (votersEl) votersEl.textContent = "-";

  if (banner) {
    if (total > 0 && winner && winner.votes > 0) {
      const pct = ((winner.votes / total) * 100).toFixed(1);
      banner.innerHTML = `
        <div class="winner-banner">
          <h3>🏆 Current Leader</h3>
          <h2>${winner.name}</h2>
          <p>${winner.party || "Independent"} · ${winner.votes} votes · ${pct}%</p>
        </div>`;
    } else {
      banner.innerHTML = '<div style="text-align:center;padding:1.5rem;color:gray">No votes cast yet — be the first!</div>';
    }
  }

  if (chart) {
    chart.innerHTML = sorted.length
      ? sorted
          .map((candidate, index) => {
            const percent = total > 0 ? ((candidate.votes / total) * 100).toFixed(1) : "0.0";
            const barWidth = total > 0 ? (candidate.votes / total) * 100 : 0;
            return `
              <div class="result-item">
                <div class="result-header">
                  <div>
                    <span class="result-name">${index === 0 && total > 0 ? "🥇 " : ""}${candidate.name}</span>
                    <span class="result-party-tag"> · ${candidate.party || "Independent"}</span>
                  </div>
                  <span class="result-votes">${candidate.votes || 0} votes (${percent}%)</span>
                </div>
                <div class="result-bar-bg">
                  <div class="result-bar ${index === 0 && total > 0 ? "winner" : ""}" style="width:${barWidth}%"></div>
                </div>
              </div>`;
          })
          .join("")
      : '<p style="text-align:center;padding:2rem;color:gray">No candidates yet</p>';
  }
}
