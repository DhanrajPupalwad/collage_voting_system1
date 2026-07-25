# Fonthand College — General Secretary Voting System

## Project Structure

```
fonthand/
├── index.html          ← Single entry point (all pages are here)
├── css/
│   └── style.css       ← All styles (Caveat handwritten font theme)
├── js/
│   ├── db.js           ← Data store + localStorage persistence
│   ├── router.js       ← Page navigation + tab switching
│   ├── auth.js         ← Student register/login + admin login
│   ├── vote.js         ← Voting page + student dashboard
│   ├── results.js      ← Public results page
│   └── admin.js        ← Admin dashboard (add/edit/delete candidates, voters, settings)
└── README.md
```

## How to Run

Just open `index.html` in any modern browser — no server needed.

## Default Credentials

| Role  | Username / Email         | Password  |
|-------|--------------------------|-----------|
| Admin | admin                    | admin123  |
| Student | aarav@fonthand.edu    | pass123   |
| Student | priya@fonthand.edu    | pass123   |

## Features

### Home Page
- Welcome screen with role-based entry cards
- Public results button (no login required)

### Student Flow
1. Register (name, email, student ID, password)
2. Login with email + password
3. View dashboard (vote status, candidate list, stats)
4. Cast vote (one vote per student, cannot re-vote)
5. See live results

### Admin Flow
1. Login with username + password
2. **Candidates tab** — Add, Edit, Delete candidates
3. **Voters tab** — View all registered students and their vote status
4. **Results tab** — Live vote count with bar charts
5. **Settings tab** — Set election title, start/end time, reset all votes

## Data Storage

All data is stored in `localStorage` under the key `fhDB`.
To reset everything, open browser DevTools → Application → Local Storage → delete `fhDB`.
