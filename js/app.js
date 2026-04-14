/* ────────────────────────────────────────────────────
   APP STATE
──────────────────────────────────────────────────── */
let machine   = null;
let running   = false;
let timer     = null;
let log$      = [];
let curMode   = 'single';
let curPreset = 'palindrome';
const HALF    = 7;

/* ────────────────────────────────────────────────────
   UI HELPERS
──────────────────────────────────────────────────── */
function setMode(m) {
  curMode = m;
  document.getElementById('tglS').classList.toggle('on', m === 'single');
  document.getElementById('tglM').classList.toggle('on', m === 'multi');
  updateDesc();
  initMachine();
}

function onPreset() {
  curPreset = document.getElementById('presetSel').value;
  document.getElementById('inputStr').value = MACHINES[curPreset].defaultInput;
  updateDesc();
  initMachine();
}

function updateDesc() {
  document.getElementById('presetDesc').textContent = MACHINES[curPreset].descs[curMode] || '';
}

function getDefn() { return MACHINES[curPreset][curMode]; }

function initMachine() {
  stopRun();
  const defn = getDefn();
  const inp  = document.getElementById('inputStr').value.trim();
  document.getElementById('sLen').textContent = inp.length;
  machine = new TM({ n: defn.n, tr: defn.tr, init: defn.init, acc: defn.acc, rej: defn.rej });
  machine.setInput(inp, 0);
  log$ = [];
  drawDiagram();
  renderAll();
}

function resetMachine() { initMachine(); }

function doStep() {
  if (!machine || machine.halted) return;
  machine.tick();
  if (machine.last) {
    const t = machine.last;
    log$.unshift({ n: machine.step, from: t.from, reads: t.reads, to: machine.state, writes: t.writes, moves: t.moves });
    if (log$.length > 100) log$.pop();
  }
  renderAll();
}

function toggleRun() { running ? stopRun() : startRun(); }

function startRun() {
  if (!machine || machine.halted) return;
  running = true;
  document.getElementById('runLbl').textContent = 'Pause';
  document.getElementById('runIco').innerHTML   = '<rect x="5" y="4" width="4" height="16"/><rect x="15" y="4" width="4" height="16"/>';
  document.getElementById('runBtn').classList.add('primary');
  schedNext();
}

function stopRun() {
  running = false;
  if (timer) { clearTimeout(timer); timer = null; }
  document.getElementById('runLbl').textContent = 'Play';
  document.getElementById('runIco').innerHTML   = '<polygon points="5,3 19,12 5,21"/>';
  document.getElementById('runBtn').classList.remove('primary');
}

function schedNext() {
  if (!running) return;
  const spd = parseInt(document.getElementById('speedSlider').value);
  timer = setTimeout(() => {
    if (!machine || machine.halted) { stopRun(); renderAll(); return; }
    doStep();
    schedNext();
  }, Math.max(40, 640 - spd * 60));
}

function runToEnd() {
  if (!machine) return;
  stopRun();
  let max = 10000;
  while (!machine.halted && max-- > 0) {
    machine.tick();
    if (machine.last) {
      const t = machine.last;
      log$.unshift({ n: machine.step, from: t.from, reads: t.reads, to: machine.state, writes: t.writes, moves: t.moves });
    }
  }
  log$ = log$.slice(0, 100);
  renderAll();
}

/* ────────────────────────────────────────────────────
   RENDER FUNCTIONS
──────────────────────────────────────────────────── */
function renderAll() {
  if (!machine) return;
  renderStatus();
  renderTapes();
  renderStats();
  renderLog();
  renderInsight();
  hlState();
  updateCmp();
}

function renderStatus() {
  const b = document.getElementById('statusBadge');
  document.getElementById('execState').textContent = 'State: ' + machine.state;
  document.getElementById('execStep').textContent  = 'Step ' + machine.step;
  b.className = 'badge';
  if      (machine.isAcc()) { b.textContent = 'Accepted'; b.classList.add('acc'); }
  else if (machine.isRej()) { b.textContent = 'Rejected'; b.classList.add('rej'); }
  else                      { b.textContent = 'Running';  b.classList.add('run'); }
}

function renderTapes() {
  const defn = getDefn();
  const sec  = document.getElementById('tapeSection');
  sec.innerHTML = '';
  machine.tapes.forEach((tape, idx) => {
    const wrap = document.createElement('div');
    wrap.style.marginBottom = '14px';
    const hr = document.createElement('div');
    hr.className = 'tape-hdr-row';
    hr.innerHTML = `<span class="tape-lbl">${defn.tapeNames[idx] || 'Tape ' + (idx + 1)}</span><span class="tape-ci">cell index</span>`;
    wrap.appendChild(hr);
    const outer = document.createElement('div');
    outer.className = 'tape-outer';
    const irow = document.createElement('div'); irow.className = 'tape-idx-row';
    const crow = document.createElement('div'); crow.className = 'tape-cells-row';
    tape.range(HALF).forEach(c => {
      const di = document.createElement('div');
      di.className = 'tidx';
      di.textContent = c.p;
      irow.appendChild(di);
      const dc = document.createElement('div');
      let cls = 'tcell';
      if (!c.bl) cls += ' sym';
      if (c.isH) cls += ' head';
      dc.className = cls;
      dc.textContent = c.s === 'B' ? '⊔' : c.s;
      if (c.isH) {
        const tri = document.createElement('div'); tri.className = 'htri'; dc.appendChild(tri);
        const lbl = document.createElement('div'); lbl.className = 'hlbl'; lbl.textContent = 'H' + (idx + 1); dc.appendChild(lbl);
      }
      crow.appendChild(dc);
    });
    outer.appendChild(irow);
    outer.appendChild(crow);
    wrap.appendChild(outer);
    sec.appendChild(wrap);
  });
}

function renderStats() {
  document.getElementById('sSteps').textContent = machine.step;
  document.getElementById('sH1').textContent    = machine.tapes[0].h;
  document.getElementById('sH2').textContent    = machine.tapes[1] ? machine.tapes[1].h : '—';
}

function renderLog() {
  const w = document.getElementById('logScroll');
  if (!log$.length) {
    w.innerHTML = '<div style="color:var(--text3);font-size:10px;font-family:JetBrains Mono,monospace;">No transitions yet…</div>';
    return;
  }
  w.innerHTML = log$.slice(0, 30).map(e =>
    `<div class="lentry">` +
    `<span class="ln">[${String(e.n).padStart(3, '0')}]</span>` +
    `<span class="lf">(${e.from},[${e.reads.join(',')}])</span>` +
    `<span class="la"> → </span>` +
    `<span class="lt">(${e.to},[${e.writes.join(',')}],[${e.moves.join(',')}])</span>` +
    `</div>`
  ).join('');
}

function renderInsight() {
  const defn = getDefn();
  const el   = document.getElementById('insightBody');
  if (machine.halted) {
    const inp = document.getElementById('inputStr').value;
    if (machine.isAcc())
      el.innerHTML = `<span style="color:var(--green)">✓ Accepted</span> "${inp}"\n${machine.step} steps — satisfies the language.`;
    else
      el.innerHTML = `<span style="color:var(--red)">✗ Rejected</span> "${inp}"\n${machine.step} steps — does not satisfy the language.`;
    return;
  }
  const ph = defn.phases && defn.phases[machine.state]
    ? `<span style="color:var(--amber)">${defn.phases[machine.state]}</span>\n` : '';
  if (machine.last) {
    const t = machine.last;
    el.innerHTML = ph +
      `δ(${t.from}, [${t.reads.join(', ')}])\n` +
      `  → ${machine.state}\n` +
      `  write [${t.writes.join(', ')}]\n` +
      `  move  [${t.moves.join(', ')}]`;
  } else {
    el.textContent = 'State: ' + machine.state + '\nPress Step or Play to begin.';
  }
}

/* ────────────────────────────────────────────────────
   STATE DIAGRAM (SVG)
──────────────────────────────────────────────────── */
function drawDiagram() {
  const defn = getDefn();
  const svg  = document.getElementById('sdSvg');
  svg.innerHTML = `<defs>
    <marker id="ma" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3z" fill="#3d5a7a"/>
    </marker>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>`;

  const acc = new Set(defn.acc);
  const rej = new Set(defn.rej);
  const sl  = defn.sl;

  defn.edges.forEach(([from, to]) => {
    const a = sl[from], b = sl[to];
    if (!a || !b) return;
    const isSelf = from === to;
    let d;
    if (isSelf) {
      d = `M${a.x - 14},${a.y - 22} C${a.x - 32},${a.y - 58} ${a.x + 32},${a.y - 58} ${a.x + 14},${a.y - 22}`;
    } else {
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - 18;
      d = `M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`;
    }
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', d);
    p.setAttribute('fill', 'none');
    p.setAttribute('stroke', '#1f2d42');
    p.setAttribute('stroke-width', '1.5');
    p.setAttribute('marker-end', 'url(#ma)');
    svg.appendChild(p);
  });

  defn.states.forEach(s => {
    const pos = sl[s];
    if (!pos) return;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${pos.x},${pos.y})`);
    g.dataset.st = s;

    const isA = acc.has(s), isR = rej.has(s), isI = s === defn.init;
    const el  = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    el.setAttribute('rx', '42');
    el.setAttribute('ry', '23');
    el.setAttribute('fill',   isA ? 'rgba(52,211,153,.12)' : isR ? 'rgba(248,113,113,.12)' : '#1a2236');
    el.setAttribute('stroke', isA ? '#34d399' : isR ? '#f87171' : isI ? '#38bdf8' : '#1f2d42');
    el.setAttribute('stroke-width', isI ? '2' : '1.5');

    if (isA) {
      const el2 = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      el2.setAttribute('rx', '34'); el2.setAttribute('ry', '15');
      el2.setAttribute('fill', 'none');
      el2.setAttribute('stroke', '#34d399');
      el2.setAttribute('stroke-width', '1');
      g.appendChild(el);
      g.appendChild(el2);
    } else {
      g.appendChild(el);
    }

    const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    txt.setAttribute('text-anchor', 'middle');
    txt.setAttribute('dominant-baseline', 'central');
    txt.setAttribute('font-size', '11');
    txt.setAttribute('font-family', 'JetBrains Mono, monospace');
    txt.setAttribute('fill', isA ? '#34d399' : isR ? '#f87171' : isI ? '#38bdf8' : '#7a95b8');
    txt.setAttribute('font-weight', isI || isA || isR ? '600' : '400');
    txt.textContent = s;
    g.appendChild(txt);
    svg.appendChild(g);
  });
}

function hlState() {
  if (!machine) return;
  const defn = getDefn();
  document.querySelectorAll('#sdSvg g[data-st]').forEach(g => {
    const s      = g.dataset.st;
    const active = s === machine.state;
    const el     = g.querySelector('ellipse');
    const txt    = g.querySelector('text');
    if (!el || !txt) return;
    const isA = defn.acc.includes(s), isR = defn.rej.includes(s), isI = s === defn.init;
    if (active) {
      el.setAttribute('stroke', '#38bdf8');
      el.setAttribute('stroke-width', '2.5');
      el.setAttribute('fill', 'rgba(56,189,248,.15)');
      el.setAttribute('filter', 'url(#glow)');
      txt.setAttribute('fill', '#38bdf8');
      txt.setAttribute('font-weight', '600');
    } else {
      el.removeAttribute('filter');
      el.setAttribute('fill',         isA ? 'rgba(52,211,153,.12)' : isR ? 'rgba(248,113,113,.12)' : '#1a2236');
      el.setAttribute('stroke',       isA ? '#34d399' : isR ? '#f87171' : isI ? '#38bdf8' : '#1f2d42');
      el.setAttribute('stroke-width', isI ? '2' : '1.5');
      txt.setAttribute('fill',        isA ? '#34d399' : isR ? '#f87171' : isI ? '#38bdf8' : '#7a95b8');
      txt.setAttribute('font-weight', isA || isR || isI ? '600' : '400');
    }
  });
}

/* ────────────────────────────────────────────────────
   COMPARISON TAB
──────────────────────────────────────────────────── */
function updateCmp() {
  if (!machine) return;
  const ex  = MACHINES[curPreset];
  const n   = Math.max(1, document.getElementById('inputStr').value.length);
  const act = Math.max(1, machine.step);
  const est = ex.complexity.single === 'O(n²)'
    ? Math.max(1, Math.round(n * n / 2))
    : ex.complexity.single === 'O(n log n)'
      ? Math.round(n * Math.log2(Math.max(2, n)))
      : n * 2;
  const total = Math.max(act, est, 1);
  const mp = Math.min(100, Math.round(act  / total * 100));
  const sp = Math.min(100, Math.round(est  / total * 100));
  document.getElementById('cmpBarsEl').innerHTML =
    `<div class="cbar"><div class="cbar-lbl"><span><span class="ctag m">Multi-tape</span> actual</span><span style="color:var(--blue)">${act} steps</span></div><div class="cbar-track"><div class="cbar-fill bl" style="width:${mp}%"></div></div></div>` +
    `<div class="cbar"><div class="cbar-lbl"><span><span class="ctag s">Single-tape</span> estimated</span><span style="color:#a78bfa">~${est} steps</span></div><div class="cbar-track"><div class="cbar-fill pu" style="width:${sp}%"></div></div></div>`;
  const ratio = (est / act).toFixed(1);
  document.getElementById('cmpNoteEl').innerHTML =
    `Speedup factor: <span style="color:var(--amber);font-weight:600;">~${ratio}×</span> for n = ${n} &nbsp;·&nbsp; ` +
    `Multi-tape: <strong>${ex.complexity.multi}</strong> &nbsp;·&nbsp; Single-tape: <strong>${ex.complexity.single}</strong><br>` +
    `<span style="color:var(--text3);font-size:10px;">Both are provably Turing-equivalent — same decidable languages.</span>`;
}

/* ────────────────────────────────────────────────────
   TAB SWITCH
──────────────────────────────────────────────────── */
function switchTab(t) {
  document.getElementById('simTab').classList.toggle('hidden', t !== 'sim');
  document.getElementById('cmpTab').classList.toggle('hidden', t !== 'cmp');
  document.getElementById('tabSim').classList.toggle('active', t === 'sim');
  document.getElementById('tabCmp').classList.toggle('active', t === 'cmp');
  if (t === 'cmp') updateCmp();
}

/* ────────────────────────────────────────────────────
   TOUR
──────────────────────────────────────────────────── */
function doTour() {
  alert(
    'Welcome to the Multi-Tape TM Visualizer!\n\n' +
    '1. Choose Single tape OR Multi-tape mode at the top of the left panel.\n' +
    '2. Pick a Preset:\n' +
    '   • Palindrome checker\n' +
    '   • Binary copy\n' +
    '   • Equality check aⁿbⁿ\n' +
    '3. Type an input string and click "Initialize Machine".\n' +
    '4. Use the controls:\n' +
    '   Reset — restart from scratch\n' +
    '   Step  — one transition at a time\n' +
    '   Play  — auto-run (adjust speed slider)\n' +
    '   End   — jump to final state\n' +
    '5. Watch the tape heads (▼ H1 / H2), the glowing state diagram, and the transition log.\n' +
    '6. Switch to the Comparison tab for complexity analysis.\n\n' +
    'Colors: Green = Accept state  ·  Red = Reject state  ·  Blue glow = current active state'
  );
}

/* ────────────────────────────────────────────────────
   THEME TOGGLE
──────────────────────────────────────────────────── */
let lightMode = false;
function toggleTheme() {
  lightMode = !lightMode;
  document.getElementById('themeLabel').textContent = lightMode ? 'Light' : 'Dark';
  if (lightMode) {
    document.documentElement.style.setProperty('--bg',     '#f0f4f8');
    document.documentElement.style.setProperty('--bg2',    '#ffffff');
    document.documentElement.style.setProperty('--bg3',    '#e8eef5');
    document.documentElement.style.setProperty('--bg4',    '#dde5ee');
    document.documentElement.style.setProperty('--border', '#c8d5e2');
    document.documentElement.style.setProperty('--border2','#b0c0d0');
    document.documentElement.style.setProperty('--text',   '#0d1b2a');
    document.documentElement.style.setProperty('--text2',  '#3a5068');
    document.documentElement.style.setProperty('--text3',  '#7a95b8');
  } else {
    document.documentElement.style.setProperty('--bg',     '#0a0e17');
    document.documentElement.style.setProperty('--bg2',    '#111827');
    document.documentElement.style.setProperty('--bg3',    '#1a2236');
    document.documentElement.style.setProperty('--bg4',    '#1e2a3a');
    document.documentElement.style.setProperty('--border', '#1f2d42');
    document.documentElement.style.setProperty('--border2','#263548');
    document.documentElement.style.setProperty('--text',   '#e2eaf6');
    document.documentElement.style.setProperty('--text2',  '#7a95b8');
    document.documentElement.style.setProperty('--text3',  '#3d5a7a');
  }
}

/* ────────────────────────────────────────────────────
   BOOT
──────────────────────────────────────────────────── */
updateDesc();
initMachine();
