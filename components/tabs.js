window.TMComponents = window.TMComponents || {};

window.TMComponents.tabs = `
<div class="tab-shell">
  <div class="tabs">
    <div class="tab active" id="tabSim" onclick="switchTab('sim')">
      <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
      Simulator
    </div>
    <div class="tab" id="tabCmp" onclick="switchTab('cmp')">
      <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="18" rx="1"></rect><rect x="14" y="3" width="7" height="18" rx="1"></rect></svg>
      Comparison
    </div>
  </div>
</div>
`;

