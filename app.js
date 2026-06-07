// ── State ──────────────────────────────────────────────────────────────────
const S = {
  view: 'home',
  session: null,
  sessionSaved: false,
  currentEx: 0,
  sessionTimer: null,
  sessionElapsed: 0,
  restTimer: null,
  restRemaining: 0,
  videoOpen: false,
  dietCat: 'breakfast',
  history: [],
  sleepLogs: [],
  sleepDraft: { bedtime: '23:00', wakeTime: '07:00', quality: '' },
  github: { token: '', owner: '', repo: '' },
  videoIds: {}
};

// ── Storage ─────────────────────────────────────────────────────────────────
function loadStorage() {
  try { S.history   = JSON.parse(localStorage.getItem('wt_history') || '[]'); } catch(e) { S.history = []; }
  try { S.sleepLogs = JSON.parse(localStorage.getItem('wt_sleep')   || '[]'); } catch(e) { S.sleepLogs = []; }
  try {
    const saved = JSON.parse(localStorage.getItem('wt_videos') || '{}');
    const cfg   = (typeof CONFIG !== 'undefined' && CONFIG.videoIds) ? CONFIG.videoIds : {};
    S.videoIds  = Object.assign({}, cfg, saved);
  } catch(e) {}
  try {
    const saved = JSON.parse(localStorage.getItem('wt_github') || '{}');
    const cfg   = (typeof CONFIG !== 'undefined') ? CONFIG.github : {};
    S.github = {
      token: saved.token || cfg.token || '',
      owner: saved.owner || cfg.owner || '',
      repo:  saved.repo  || cfg.repo  || ''
    };
  } catch(e) {}
}

function saveStorage() {
  localStorage.setItem('wt_history', JSON.stringify(S.history));
  localStorage.setItem('wt_sleep',   JSON.stringify(S.sleepLogs));
  localStorage.setItem('wt_github',  JSON.stringify(S.github));
  localStorage.setItem('wt_videos',  JSON.stringify(S.videoIds));
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmt(sec) {
  return `${String(Math.floor(sec / 60)).padStart(2,'0')}:${String(sec % 60).padStart(2,'0')}`;
}

function fmtDate(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
  });
}

function getNextDay() {
  const seq = PROGRAM.sequence;
  if (!S.history.length) return seq[0];
  const last = S.history[S.history.length - 1].dayId;
  return seq[(seq.indexOf(last) + 1) % seq.length];
}

function parseYtId(raw) {
  if (!raw) return null;
  const m = raw.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  if (/^[A-Za-z0-9_-]{11}$/.test(raw.trim())) return raw.trim();
  return null;
}

function calcDuration(bed, wake) {
  if (!bed || !wake) return null;
  const [bh, bm] = bed.split(':').map(Number);
  const [wh, wm] = wake.split(':').map(Number);
  let mins = (wh * 60 + wm) - (bh * 60 + bm);
  if (mins <= 0) mins += 1440; // crossed midnight
  return { h: Math.floor(mins / 60), m: mins % 60, total: mins };
}

function fmtDuration(d) {
  if (!d) return '—';
  return d.m > 0 ? `${d.h}h ${d.m}m` : `${d.h}h`;
}

// Returns the last logged sets for an exercise across all history
function getLastExData(exId) {
  for (let i = S.history.length - 1; i >= 0; i--) {
    const h = S.history[i];
    if (h.sets && h.sets[exId]) {
      const sets = h.sets[exId].filter(s => s.done || s.reps !== '');
      if (sets.length) return sets;
    }
  }
  return null;
}

// ── Session ──────────────────────────────────────────────────────────────────
function startSession(dayId) {
  const day = PROGRAM.days[dayId];

  // Pre-fill weights from the most recent logged session for each exercise
  const lastWeights = {};
  for (let i = S.history.length - 1; i >= 0; i--) {
    const hist = S.history[i];
    if (!hist.sets) continue;
    for (const ex of day.exercises) {
      if (lastWeights[ex.id] !== undefined) continue;
      const exSets = hist.sets[ex.id];
      if (exSets) {
        const w = exSets.find(s => s.weight && s.weight !== '')?.weight;
        if (w !== undefined) lastWeights[ex.id] = w;
      }
    }
  }

  const sets = {};
  for (const ex of day.exercises) {
    const prefill = ex.bodyweight ? '' : (lastWeights[ex.id] || '');
    sets[ex.id] = Array.from({ length: ex.sets }, () => ({
      weight: prefill, reps: '', done: false
    }));
  }

  S.session = {
    dayId, sets,
    date: new Date().toISOString().slice(0, 10),
    startedAt: Date.now(),
    endedAt: null,
    elapsed: 0,
    finisher: { duration: '', resistance: '' },
    energy: '', feel: '', notes: ''
  };
  S.currentEx = 0;
  S.sessionElapsed = 0;
  S.sessionSaved = false;
  S.videoOpen = false;

  if (S.sessionTimer) clearInterval(S.sessionTimer);
  S.sessionTimer = setInterval(() => {
    S.sessionElapsed++;
    const el = document.getElementById('session-clock');
    if (el) el.textContent = fmt(S.sessionElapsed);
  }, 1000);
  showView('session');
}

function endSession() {
  if (S.sessionTimer) { clearInterval(S.sessionTimer); S.sessionTimer = null; }
  if (S.restTimer)    { clearInterval(S.restTimer);    S.restTimer = null; }
  S.session.endedAt = Date.now();
  S.session.elapsed = S.sessionElapsed;
  showView('report');
}

function exitSession() {
  if (!confirm('Exit this session? Progress will be lost.')) return;
  if (S.sessionTimer) { clearInterval(S.sessionTimer); S.sessionTimer = null; }
  if (S.restTimer)    { clearInterval(S.restTimer);    S.restTimer = null; }
  S.session = null;
  showView('home');
}

// ── Rest timer ───────────────────────────────────────────────────────────────
function startRest(seconds) {
  if (S.restTimer) clearInterval(S.restTimer);
  S.restRemaining = seconds;
  tickRest();
  S.restTimer = setInterval(tickRest, 1000);
}

function tickRest() {
  const el = document.getElementById('rest-timer');
  if (!el) return;
  if (S.restRemaining > 0) {
    el.classList.add('visible');
    el.innerHTML = `<span class="rest-label-txt">Rest</span><span class="rest-count">${fmt(S.restRemaining)}</span>`;
    S.restRemaining--;
  } else {
    el.innerHTML = `<span class="rest-label-txt">Rest done</span><span class="rest-count rest-go">Go!</span>`;
    clearInterval(S.restTimer);
    S.restTimer = null;
    setTimeout(() => { if (el) el.classList.remove('visible'); }, 3000);
  }
}

// ── GitHub API ───────────────────────────────────────────────────────────────
async function saveToGitHub(session) {
  const { token, owner, repo } = S.github;
  if (!token || !owner || !repo) return { ok: false, error: 'GitHub not configured in Settings.' };
  const path = `logs/${session.date}-${session.dayId}.json`;
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(session, null, 2))));
  let sha = null;
  try {
    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' }
    });
    if (r.ok) sha = (await r.json()).sha;
  } catch(e) {}
  try {
    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Workout: ${session.date} ${PROGRAM.days[session.dayId].name}`,
        content,
        ...(sha ? { sha } : {})
      })
    });
    if (r.ok) return { ok: true };
    return { ok: false, error: (await r.json()).message || 'GitHub API error' };
  } catch(e) {
    return { ok: false, error: e.message };
  }
}

async function saveSleepToGitHub(entry) {
  const { token, owner, repo } = S.github;
  if (!token || !owner || !repo) return { ok: false };
  const path = `sleep/${entry.date}.json`;
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(entry, null, 2))));
  let sha = null;
  try {
    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' }
    });
    if (r.ok) sha = (await r.json()).sha;
  } catch(e) {}
  try {
    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: `Sleep: ${entry.date}`, content, ...(sha ? { sha } : {}) })
    });
    return r.ok ? { ok: true } : { ok: false };
  } catch(e) { return { ok: false }; }
}

// ── Verdict logic ─────────────────────────────────────────────────────────────
function verdict(ex, sets) {
  const done = sets.filter(s => s.done);
  if (done.length < ex.sets) return 'skip';
  const m = ex.repsTarget.match(/^(\d+)[–-](\d+)$/);
  if (m) {
    const hi = parseInt(m[2]);
    return done.every(s => parseInt(s.reps) >= hi) ? 'up' : 'hold';
  }
  const n = parseInt(ex.repsTarget);
  if (!isNaN(n)) return done.every(s => parseInt(s.reps) >= n) ? 'up' : 'hold';
  return 'hold';
}

// ── Render helpers ────────────────────────────────────────────────────────────
function buildExBody(ex, idx, day) {
  const exSets = S.session.sets[ex.id];
  const vid = S.videoIds[ex.id] || null;
  const isLast = idx === day.exercises.length - 1;
  const lastSets = getLastExData(ex.id);

  // Last session reference line
  const lastRef = lastSets ? `
    <div class="last-ref">
      Last: ${lastSets.map(s =>
        ex.bodyweight ? `BW×${s.reps || '—'}` : `${s.weight || '?'}×${s.reps || '—'}`
      ).join(' · ')}
    </div>
  ` : '';

  const setRows = exSets.map((set, i) => `
    <div class="set-row">
      <div class="set-num">${i + 1}</div>
      ${ex.bodyweight
        ? `<div class="set-input set-bw">BW</div>`
        : `<input class="set-input" type="text" inputmode="decimal" placeholder="—"
             data-field="weight"
             value="${set.weight}"
             oninput="updateSet(${i},'weight',this.value)" />`
      }
      <input class="set-input" type="text" inputmode="numeric"
        placeholder="${ex.repsTarget}"
        data-field="reps"
        value="${set.reps}"
        oninput="updateSet(${i},'reps',this.value)"
      />
      <button class="set-check ${set.done ? 'done' : ''}" onclick="toggleDone(${i})">${set.done ? '✓' : ''}</button>
    </div>
  `).join('');

  return `
    ${vid ? `
      <div class="video-section${S.videoOpen ? ' open' : ''}">
        <button class="video-toggle" onclick="toggleVideo(this)">
          ${S.videoOpen ? '▼ Hide video' : '▶ Form video'}
        </button>
        <div class="video-wrap">
          <iframe src="https://www.youtube-nocookie.com/embed/${vid}?rel=0&modestbranding=1"
            allow="autoplay; fullscreen" allowfullscreen></iframe>
        </div>
      </div>
    ` : ''}
    <div class="ex-info">
      <h2>${ex.name}</h2>
      <div class="ex-meta">
        <span>${ex.sets} sets</span>
        <span>${ex.repsTarget} reps</span>
        <span>${ex.rest}s rest</span>
      </div>
      ${lastRef}
    </div>
    ${ex.note ? `<div class="ex-note">${ex.note}</div>` : ''}
    <div class="sets-wrap">
      <div class="sets-head"><div>Set</div><div>Weight</div><div>Reps</div><div></div></div>
      ${setRows}
    </div>
    <div class="rest-timer" id="rest-timer"></div>
    <div class="nav-row">
      ${idx > 0
        ? `<button class="btn btn-surface" onclick="goEx(${idx - 1})">← Prev</button>`
        : `<div style="flex:1"></div>`}
      ${isLast
        ? `<button class="btn btn-surface" onclick="showFinisher()">Finisher →</button>`
        : `<button class="btn btn-primary" onclick="goEx(${idx + 1})">Next →</button>`}
    </div>
  `;
}

function buildDots(day) {
  return day.exercises.map((e, i) => {
    const done = S.session.sets[e.id].filter(s => s.done).length;
    const cls = i === S.currentEx ? 'active' : (done > 0 ? 'done' : '');
    return `<button class="ex-dot ${cls}" onclick="goEx(${i})">${i + 1}</button>`;
  }).join('');
}

// ── Views ─────────────────────────────────────────────────────────────────────
function viewHome() {
  const nextId = getNextDay();
  const day = PROGRAM.days[nextId];
  const last = S.history.length ? S.history[S.history.length - 1] : null;
  return `
    <div class="view active" id="view-home">
      <div class="view-header">
        <h1>Workout</h1>
        <button class="btn btn-sm btn-surface" onclick="showView('settings')">Settings</button>
      </div>
      <div class="home-body">
        <div class="next-card">
          <div class="eyebrow">Next Up</div>
          <h2>${day.name}</h2>
          <div class="tag">${day.tag}</div>
          ${day.patellaStrap ? `<div class="strap-badge">⚠ Patella strap required</div>` : ''}
          <button class="btn btn-primary btn-full" onclick="startSession('${nextId}')">Start Session</button>
        </div>
        ${last ? `
          <div class="last-card">
            <div class="eyebrow">Last Session</div>
            <div class="name">${PROGRAM.days[last.dayId].name}</div>
            <div class="meta">${fmtDate(last.date)} · ${fmt(last.elapsed || 0)}</div>
          </div>
        ` : `
          <div class="last-card">
            <div class="eyebrow">Last Session</div>
            <div class="meta">No sessions yet. Hit Start above.</div>
          </div>
        `}
        ${S.history.length ? `<button class="btn btn-surface btn-full" onclick="showView('history')">Session History</button>` : ''}
        <button class="btn btn-surface btn-full" onclick="showView('diet')">Meal Ideas</button>
        <button class="btn btn-surface btn-full" onclick="showView('sleep')">Sleep Log</button>
        ${!S.github.token ? `<div class="setup-banner" onclick="showView('settings')">GitHub sync not set up — tap Settings to add your token</div>` : ''}
      </div>
    </div>
  `;
}

function viewSession() {
  const day = PROGRAM.days[S.session.dayId];
  const ex  = day.exercises[S.currentEx];
  return `
    <div class="view active" id="view-session">
      <div class="session-header">
        <button class="btn btn-sm btn-surface" onclick="exitSession()">Exit</button>
        <div class="session-title">${day.name}</div>
        <span id="session-clock" class="session-clock">${fmt(S.sessionElapsed)}</span>
      </div>
      <div class="ex-nav" id="ex-nav">${buildDots(day)}</div>
      <div class="ex-body" id="ex-body">${buildExBody(ex, S.currentEx, day)}</div>
    </div>
  `;
}

function viewReport() {
  const { session } = S;
  const day = PROGRAM.days[session.dayId];
  const totalDone = Object.values(session.sets).flat().filter(s => s.done).length;

  const cards = day.exercises.map(ex => {
    const sets = session.sets[ex.id];
    const v = verdict(ex, sets);
    const badgeMap = { up: ['badge-up','Add weight'], hold: ['badge-hold','Keep weight'], skip: ['badge-skip','Incomplete'] };
    const [bc, bt] = badgeMap[v];
    const chips = sets.map(s => {
      if (!s.done && s.reps === '') return '';
      const txt = ex.bodyweight ? `BW × ${s.reps || '—'}` : `${s.weight || '?'}kg × ${s.reps || '—'}`;
      return `<span class="chip">${txt}</span>`;
    }).join('');
    return `
      <div class="ex-report-card">
        <div class="ex-report-name"><span>${ex.name}</span><span class="badge ${bc}">${bt}</span></div>
        <div class="set-chips">${chips || '<span style="font-size:12px;color:var(--muted)">No sets logged</span>'}</div>
      </div>
    `;
  }).join('');

  return `
    <div class="view active" id="view-report">
      <div class="view-header">
        <h1>Report</h1>
        <button class="btn btn-sm btn-surface" onclick="leaveReport()">Home</button>
      </div>
      <div class="report-body">
        <div class="report-summary">
          <h2>${day.name}</h2>
          <div class="report-date">${fmtDate(session.date)}</div>
          <div class="stats">
            <div class="stat"><div class="val">${fmt(session.elapsed || 0)}</div><div class="lbl">Duration</div></div>
            <div class="stat"><div class="val">${totalDone}</div><div class="lbl">Sets Done</div></div>
            <div class="stat"><div class="val">${day.exercises.length}</div><div class="lbl">Exercises</div></div>
          </div>
        </div>

        <div class="report-fields">
          <div class="field-group">
            <div class="field-lbl">Energy today</div>
            <div class="seg">
              ${['low','medium','high'].map(e => `<button class="seg-btn ${session.energy===e?'on':''}" onclick="pick('energy','${e}',this)">${e[0].toUpperCase()+e.slice(1)}</button>`).join('')}
            </div>
          </div>
          <div class="field-group">
            <div class="field-lbl">Session feel</div>
            <div class="seg">
              ${['rough','average','good'].map(f => `<button class="seg-btn ${session.feel===f?'on':''}" onclick="pick('feel','${f}',this)">${f[0].toUpperCase()+f.slice(1)}</button>`).join('')}
            </div>
          </div>
          <div class="field-group">
            <div class="field-lbl">Notes</div>
            <textarea class="notes-ta" placeholder="Anything to flag — form, pain, energy, PRs…" oninput="S.session.notes=this.value">${session.notes}</textarea>
          </div>
        </div>

        <div class="save-row">
          <button class="btn btn-primary btn-full" id="save-btn" onclick="saveSession()">Save Session</button>
          <div class="save-msg" id="save-msg"></div>
        </div>

        <div class="section-label" style="margin-top:20px">Exercise Breakdown</div>
        ${cards}
      </div>
    </div>
  `;
}

function viewSettings() {
  const allEx = PROGRAM.sequence.flatMap(id => PROGRAM.days[id].exercises);
  const rows = allEx.map(ex => `
    <div class="video-row">
      <span class="video-row-name">${ex.name}</span>
      <input class="video-id-input" type="text" placeholder="YouTube URL or ID"
        value="${S.videoIds[ex.id] || ''}"
        oninput="setVid('${ex.id}',this.value)">
    </div>
  `).join('');

  return `
    <div class="view active" id="view-settings">
      <div class="view-header">
        <button class="btn btn-sm btn-surface" onclick="showView('home')">← Back</button>
        <h1>Settings</h1>
        <div style="width:64px"></div>
      </div>
      <div class="settings-body">
        <div class="settings-section">
          <div class="settings-section-title">GitHub Sync</div>
          <div class="field-row">
            <label>Personal Access Token</label>
            <input class="text-input" type="password" placeholder="ghp_…" value="${S.github.token}" oninput="gh('token',this.value)">
            <div class="hint">Create at github.com → Settings → Developer settings → Tokens (classic). Give it repo scope. Stored only in this browser.</div>
          </div>
          <div class="field-row">
            <label>GitHub Username</label>
            <input class="text-input" type="text" placeholder="your-username" value="${S.github.owner}" oninput="gh('owner',this.value)">
          </div>
          <div class="field-row">
            <label>Repository Name</label>
            <input class="text-input" type="text" placeholder="workout-logs" value="${S.github.repo}" oninput="gh('repo',this.value)">
            <div class="hint">Create an empty private repo on GitHub. Logs will be saved as JSON files in a /logs folder inside it.</div>
          </div>
          <button class="btn btn-surface btn-full" onclick="testConnection()">Test Connection</button>
          <div class="save-msg" id="gh-test-msg" style="text-align:left;padding-top:8px"></div>
        </div>

        <div class="settings-section">
          <div class="settings-section-title">Tutorial Videos</div>
          <div class="hint" style="margin-bottom:12px">Paste a YouTube URL or the 11-character video ID next to each exercise.</div>
          <div class="video-rows">${rows}</div>
        </div>
      </div>
    </div>
  `;
}

function viewDiet() {
  const cat = MEALS.cats.find(c => c.id === S.dietCat);
  const items = MEALS.items.filter(m => m.cat === S.dietCat);
  const { kcalMin, kcalMax, protein, budget } = MEALS.target;

  const catTabs = MEALS.cats.map(c => `
    <button class="diet-cat-btn ${c.id === S.dietCat ? 'active' : ''}" onclick="setDietCat('${c.id}')">${c.label}</button>
  `).join('');

  const cards = items.map(m => `
    <div class="meal-card">
      <div class="meal-name">${m.name}</div>
      <div class="meal-ingredients">${m.ingredients.join(' · ')}</div>
      ${m.note ? `<div class="meal-note">${m.note}</div>` : ''}
      <div class="meal-macros">
        <span class="macro-chip macro-protein">P ${m.protein}g</span>
        <span class="macro-chip">${m.kcal} kcal</span>
        <span class="macro-chip">₹${m.cost}</span>
        <span class="macro-chip">${m.time === 0 ? 'no cook' : `${m.time} min`}</span>
      </div>
    </div>
  `).join('');

  return `
    <div class="view active" id="view-diet">
      <div class="view-header">
        <button class="btn btn-sm btn-surface" onclick="showView('home')">← Back</button>
        <h1>Meals</h1>
        <div style="width:64px"></div>
      </div>
      <div class="diet-target-bar">
        ${kcalMin}–${kcalMax} kcal &nbsp;·&nbsp; ${protein}g+ protein &nbsp;·&nbsp; ₹${budget}/day
      </div>
      <div class="diet-cats">${catTabs}</div>
      <div class="diet-body">
        <div class="diet-tip">${cat.tip}</div>
        ${cards}
      </div>
    </div>
  `;
}

function setDietCat(id) {
  S.dietCat = id;
  render();
}

function viewSleep() {
  const today = new Date().toISOString().slice(0, 10);
  const todayLog = S.sleepLogs.find(e => e.date === today);

  const bed   = todayLog?.bedtime  || S.sleepDraft.bedtime  || '23:00';
  const wake  = todayLog?.wakeTime || S.sleepDraft.wakeTime || '07:00';
  const qual  = todayLog?.quality  || S.sleepDraft.quality  || '';
  const d     = calcDuration(bed, wake);
  const durTxt = fmtDuration(d);
  const durCls = d && d.total >= 420 ? 'ok' : 'low';

  const recent = [...S.sleepLogs].reverse().slice(0, 10);
  const qualLabels = { poor: 'Restless', ok: 'Okay', good: 'Refreshed' };
  const qualBadge  = { poor: 'badge-skip', ok: 'badge-hold', good: 'badge-up' };

  const avg = recent.length
    ? Math.round(recent.reduce((a, e) => a + (e.duration || 0), 0) / recent.length)
    : null;

  const histCards = recent.map(e => {
    const ed  = calcDuration(e.bedtime, e.wakeTime);
    const cls = ed && ed.total >= 420 ? 'ok' : 'low';
    const qb  = qualBadge[e.quality]  || 'badge-hold';
    const ql  = qualLabels[e.quality] || '—';
    return `
      <div class="sleep-hist-card">
        <div class="shc-left">
          <div class="shc-date">${fmtDate(e.date)}</div>
          <div class="shc-time">${e.bedtime} → ${e.wakeTime}</div>
        </div>
        <div class="shc-right">
          <div class="shc-dur ${cls}">${fmtDuration(ed)}</div>
          <span class="badge ${qb}">${ql}</span>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="view active" id="view-sleep">
      <div class="view-header">
        <button class="btn btn-sm btn-surface" onclick="showView('home')">← Back</button>
        <h1>Sleep</h1>
        <div style="width:64px"></div>
      </div>
      <div class="sleep-target-bar">
        Target: 7–8 hrs &nbsp;·&nbsp; Sleep is when muscle repairs
        ${avg ? `&nbsp;·&nbsp; <strong>7-day avg: ${fmtDuration({ h: Math.floor(avg/60), m: avg%60, total: avg })}</strong>` : ''}
      </div>
      <div class="sleep-body">
        <div class="sleep-log-card">
          <div class="sleep-log-title">Last night</div>
          <div class="sleep-time-row">
            <div class="sleep-time-field">
              <label>Bedtime</label>
              <input class="sleep-time-input" type="time" id="sleep-bed" value="${bed}" oninput="refreshSleepCalc()">
            </div>
            <div class="sleep-arrow">→</div>
            <div class="sleep-time-field">
              <label>Wake up</label>
              <input class="sleep-time-input" type="time" id="sleep-wake" value="${wake}" oninput="refreshSleepCalc()">
            </div>
          </div>
          <div class="sleep-dur-row">
            <span class="sleep-dur-lbl">Duration</span>
            <span id="sleep-duration" class="sleep-dur-val ${durCls}">${durTxt}</span>
          </div>
          <div class="field-lbl" style="margin-top:16px;margin-bottom:8px">How did you sleep?</div>
          <div class="seg">
            ${['poor','ok','good'].map(q => `
              <button class="seg-btn ${qual === q ? 'on' : ''}" onclick="setSleepQuality('${q}',this)">${qualLabels[q]}</button>
            `).join('')}
          </div>
          <button class="btn btn-primary btn-full" style="margin-top:16px" id="sleep-save-btn" onclick="saveSleepLog()">
            ${todayLog ? 'Update' : 'Save'}
          </button>
          <div class="save-msg" id="sleep-save-msg"></div>
        </div>

        ${recent.length ? `
          <div class="section-label">History</div>
          ${histCards}
        ` : ''}
      </div>
    </div>
  `;
}

function viewHistory() {
  const recent = [...S.history].reverse().slice(0, 30);
  const cards = recent.map(s => {
    const day = PROGRAM.days[s.dayId];
    const done = Object.values(s.sets).flat().filter(x => x.done).length;
    return `
      <div class="history-card">
        <div class="hc-name">${day.name}</div>
        <div class="hc-meta">${fmtDate(s.date)} · ${fmt(s.elapsed || 0)} · ${done} sets${s.energy ? ` · ${s.energy} energy` : ''}</div>
      </div>
    `;
  }).join('');

  return `
    <div class="view active" id="view-history">
      <div class="view-header">
        <button class="btn btn-sm btn-surface" onclick="showView('home')">← Back</button>
        <h1>History</h1>
        <div style="width:64px"></div>
      </div>
      <div class="history-body">
        ${cards || '<p style="color:var(--muted);font-size:14px">No sessions yet.</p>'}
      </div>
    </div>
  `;
}

// ── Render ────────────────────────────────────────────────────────────────────
function render() {
  const app = document.getElementById('app');
  switch (S.view) {
    case 'home':     app.innerHTML = viewHome();     break;
    case 'session':  app.innerHTML = viewSession();  break;
    case 'report':   app.innerHTML = viewReport();   break;
    case 'settings': app.innerHTML = viewSettings(); break;
    case 'history':  app.innerHTML = viewHistory();  break;
    case 'diet':     app.innerHTML = viewDiet();     break;
    case 'sleep':    app.innerHTML = viewSleep();    break;
  }
}

function showView(v) {
  S.view = v;
  render();
}

// ── Event handlers ────────────────────────────────────────────────────────────
function goEx(idx) {
  S.currentEx = idx;
  S.videoOpen = false;
  const day = PROGRAM.days[S.session.dayId];
  const ex  = day.exercises[idx];
  document.getElementById('ex-body').innerHTML = buildExBody(ex, idx, day);
  document.getElementById('ex-nav').innerHTML  = buildDots(day);
  if (S.restTimer || S.restRemaining > 0) tickRest();
}

function toggleVideo(btn) {
  S.videoOpen = !S.videoOpen;
  const section = btn.closest('.video-section');
  section.classList.toggle('open', S.videoOpen);
  btn.textContent = S.videoOpen ? '▼ Hide video' : '▶ Form video';
}

function showFinisher() {
  const day = PROGRAM.days[S.session.dayId];
  const fin = S.session.finisher;
  document.getElementById('ex-body').innerHTML = `
    <div class="ex-info" style="padding-top:20px">
      <h2>Finisher</h2>
    </div>
    <div class="finisher-wrap">
      <div class="finisher-card">
        <h3>${day.finisher.name}</h3>
        <div class="finisher-fields">
          <div>
            <label>Duration (min)</label>
            <input class="finisher-input" type="text" inputmode="numeric" placeholder="${day.finisher.duration}"
              value="${fin.duration}" oninput="S.session.finisher.duration=this.value">
          </div>
          <div>
            <label>Resistance level</label>
            <input class="finisher-input" type="text" inputmode="numeric" placeholder="—"
              value="${fin.resistance}" oninput="S.session.finisher.resistance=this.value">
          </div>
        </div>
      </div>
    </div>
    <div class="end-wrap">
      <button class="btn btn-primary btn-full" onclick="endSession()">End Session & Get Report</button>
    </div>
  `;
  document.querySelectorAll('.ex-dot').forEach(d => d.classList.remove('active'));
}

function updateSet(i, field, val) {
  const ex = PROGRAM.days[S.session.dayId].exercises[S.currentEx];
  S.session.sets[ex.id][i][field] = val;
}

function toggleDone(i) {
  const ex = PROGRAM.days[S.session.dayId].exercises[S.currentEx];
  const set = S.session.sets[ex.id][i];
  set.done = !set.done;

  const btns = document.querySelectorAll('.set-check');
  btns[i].className = `set-check ${set.done ? 'done' : ''}`;
  btns[i].textContent = set.done ? '✓' : '';

  if (set.done) {
    startRest(ex.rest);

    // Auto-fill weight to the next set if it's still empty
    if (!ex.bodyweight && set.weight !== '') {
      const exSets = S.session.sets[ex.id];
      if (i + 1 < exSets.length && exSets[i + 1].weight === '') {
        exSets[i + 1].weight = set.weight;
        const rows = document.querySelectorAll('.set-row');
        if (rows[i + 1]) {
          const wInput = rows[i + 1].querySelector('[data-field="weight"]');
          if (wInput) wInput.value = set.weight;
        }
      }
    }
  }

  // Update dot when all sets done
  const allDone = S.session.sets[ex.id].every(s => s.done);
  const dots = document.querySelectorAll('.ex-dot');
  if (dots[S.currentEx]) {
    dots[S.currentEx].className = `ex-dot ${S.currentEx === S.currentEx ? 'active' : (allDone ? 'done' : '')}`;
    if (allDone) dots[S.currentEx].className = 'ex-dot done';
  }
}

function pick(field, val, btn) {
  S.session[field] = val;
  btn.closest('.seg').querySelectorAll('.seg-btn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
}

function leaveReport() {
  if (!S.sessionSaved && !confirm('Session not saved yet. Leave anyway?')) return;
  showView('home');
}

function gh(field, val) {
  S.github[field] = val;
  saveStorage();
}

async function testConnection() {
  const msg = document.getElementById('gh-test-msg');
  const { token, owner, repo } = S.github;
  if (!token || !owner || !repo) {
    msg.className = 'save-msg err'; msg.textContent = 'Fill in all three fields first.'; return;
  }
  msg.className = 'save-msg'; msg.textContent = 'Testing…';
  try {
    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' }
    });
    if (r.ok) {
      msg.className = 'save-msg ok'; msg.textContent = '✓ Connected — repo found and token is valid.';
    } else if (r.status === 401) {
      msg.className = 'save-msg err'; msg.textContent = 'Token rejected (401). Check the token and try again.';
    } else if (r.status === 404) {
      msg.className = 'save-msg err'; msg.textContent = 'Repo not found (404). Check username and repo name.';
    } else {
      msg.className = 'save-msg err'; msg.textContent = `Error ${r.status}. Check all fields.`;
    }
  } catch(e) {
    msg.className = 'save-msg err'; msg.textContent = `Network error: ${e.message}`;
  }
}

function setVid(exId, val) {
  const id = parseYtId(val);
  if (id) S.videoIds[exId] = id;
  else delete S.videoIds[exId];
  saveStorage();
}

function askVideo(exId) {
  const url = prompt('Paste YouTube URL or video ID:');
  if (!url) return;
  const id = parseYtId(url);
  if (!id) { alert("Couldn't find a YouTube video ID. Try pasting the full video URL."); return; }
  S.videoIds[exId] = id;
  saveStorage();
  goEx(S.currentEx);
}

async function saveSession() {
  const btn = document.getElementById('save-btn');
  const msg = document.getElementById('save-msg');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }

  // Auto-mark any set with reps entered as done
  for (const exSets of Object.values(S.session.sets)) {
    for (const set of exSets) {
      if (set.reps !== '' && set.reps !== null) set.done = true;
    }
  }

  S.history.push({ ...S.session });
  saveStorage();
  S.sessionSaved = true;

  if (S.github.token && S.github.owner && S.github.repo) {
    if (msg) { msg.className = 'save-msg'; msg.textContent = 'Uploading to GitHub…'; }
    const result = await saveToGitHub(S.session);
    if (msg) {
      msg.className = result.ok ? 'save-msg ok' : 'save-msg err';
      msg.textContent = result.ok ? '✓ Saved to GitHub' : `GitHub: ${result.error}`;
    }
  } else {
    if (msg) { msg.className = 'save-msg'; msg.textContent = 'Saved locally. Add GitHub in Settings to sync.'; }
  }

  if (btn) { btn.textContent = 'Saved'; }
}

function refreshSleepCalc() {
  const bed  = document.getElementById('sleep-bed')?.value;
  const wake = document.getElementById('sleep-wake')?.value;
  S.sleepDraft.bedtime  = bed  || S.sleepDraft.bedtime;
  S.sleepDraft.wakeTime = wake || S.sleepDraft.wakeTime;
  const el = document.getElementById('sleep-duration');
  if (!el) return;
  const d = calcDuration(bed, wake);
  el.textContent = fmtDuration(d);
  el.className = `sleep-dur-val ${d && d.total >= 420 ? 'ok' : 'low'}`;
}

function setSleepQuality(q, btn) {
  S.sleepDraft.quality = q;
  btn.closest('.seg').querySelectorAll('.seg-btn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
}

async function saveSleepLog() {
  const bed  = document.getElementById('sleep-bed')?.value  || S.sleepDraft.bedtime;
  const wake = document.getElementById('sleep-wake')?.value || S.sleepDraft.wakeTime;
  const d    = calcDuration(bed, wake);
  const btn  = document.getElementById('sleep-save-btn');
  const msg  = document.getElementById('sleep-save-msg');

  const entry = {
    date:     new Date().toISOString().slice(0, 10),
    bedtime:  bed,
    wakeTime: wake,
    duration: d ? d.total : 0,
    quality:  S.sleepDraft.quality || 'ok'
  };

  const idx = S.sleepLogs.findIndex(e => e.date === entry.date);
  if (idx >= 0) S.sleepLogs[idx] = entry;
  else S.sleepLogs.push(entry);
  saveStorage();

  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }

  if (S.github.token && S.github.owner && S.github.repo) {
    const result = await saveSleepToGitHub(entry);
    if (msg) {
      msg.className = result.ok ? 'save-msg ok' : 'save-msg';
      msg.textContent = result.ok ? '✓ Saved to GitHub' : 'Saved locally';
    }
  } else {
    if (msg) { msg.className = 'save-msg'; msg.textContent = 'Saved locally'; }
  }

  if (btn) { btn.disabled = false; btn.textContent = 'Update'; }
}

// ── Init ──────────────────────────────────────────────────────────────────────
loadStorage();
render();
