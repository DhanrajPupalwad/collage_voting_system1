// ════════════════════════════════
// db.js — shared data store
// ════════════════════════════════

let DB = {
  students: [
    { id: 1, name: 'Aarav Mehta',  email: 'aarav@fonthand.edu',  studentId: 'FC2024001', pass: 'pass123', voted: null },
    { id: 2, name: 'Priya Sharma', email: 'priya@fonthand.edu', studentId: 'FC2024002', pass: 'pass123', voted: null },
  ],
  candidates: [
    { id: 1, name: 'Rohan Verma',  party: 'Progressive Students Union', slogan: 'Together we rise!',         votes: 0 },
    { id: 2, name: 'Sneha Patil',  party: 'Student Action Front',        slogan: 'Change starts with you',   votes: 0 },
    { id: 3, name: 'Kiran Joshi',  party: 'United Campus Alliance',      slogan: 'Your campus, your future', votes: 0 },
  ],
  admin: { username: 'admin', password: 'admin123' },
  electionTitle: 'General Secretary Election 2024–25',
  electionStart: '',
  electionEnd: '',
  nextStudentId: 3,
  nextCandId: 4,
};

function saveDB() {
  try { localStorage.setItem('fhDB', JSON.stringify(DB)); } catch(e) {}
}

function loadDB() {
  try {
    const d = localStorage.getItem('fhDB');
    if (d) DB = JSON.parse(d);
  } catch(e) {}
}

// Current logged-in user session
let currentUser = null; // { type: 'student'|'admin', data: {...} }

// Utility: get initials from full name
function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// Utility: show a temporary alert inside a div
function showAlert(id, type, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = 'alert alert-' + type + ' show';
  el.textContent = msg;
  setTimeout(() => { el.className = 'alert'; }, 3500);
}

// Load DB on script parse
loadDB();
