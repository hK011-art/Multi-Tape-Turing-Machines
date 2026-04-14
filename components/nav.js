window.TMComponents = window.TMComponents || {};

window.TMComponents.nav = `
<nav class="nav">
  <div class="nav-logo">
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2">
      <rect x="2" y="7" width="20" height="4.5" rx="1.5"></rect>
      <rect x="2" y="13.5" width="20" height="4.5" rx="1.5"></rect>
      <circle cx="7" cy="9.25" r="1.3" fill="#fff" stroke="none"></circle>
      <circle cx="14" cy="15.75" r="1.3" fill="#fff" stroke="none"></circle>
    </svg>
  </div>
  <div class="nav-info">
    <div class="nav-title">Multi-Tape / Multi-Head TM Visualizer</div>
    <div class="nav-sub">Theory of Computation · interactive δ simulator</div>
  </div>
  <div class="nav-btns">
    <button class="nbtn" onclick="doTour()">
      <svg viewBox="0 0 24 24"><path d="M3 3l6 3 6-3 6 3v15l-6-3-6 3-6-3V3z"></path></svg>
      Tour
    </button>
    <button class="nbtn" onclick="toggleTheme()">
      <svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
      <span id="themeLabel">Dark</span>
    </button>
  </div>
</nav>
`;

