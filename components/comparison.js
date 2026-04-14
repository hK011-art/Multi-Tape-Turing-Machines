window.TMComponents = window.TMComponents || {};

window.TMComponents.comparison = `
<div id="cmpTab" class="hidden">
  <div class="cmp-content">
    <div class="cpanel">
      <div class="ctitle" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
        Performance analysis
        <span class="ctag m">Multi-tape</span>
        <span style="color:var(--text3);font-size:12px;font-weight:400;">vs</span>
        <span class="ctag s">Single-tape</span>
      </div>
      <div id="cmpBarsEl">
        <div style="color:var(--text3);font-size:12px;">Run the simulator first to see live data.</div>
      </div>
      <div style="margin-top:12px;font-size:11px;color:var(--text2);line-height:1.75;" id="cmpNoteEl"></div>
    </div>

    <div class="cpanel">
      <div class="ctitle">Complexity table</div>
      <table class="ctable">
        <thead>
          <tr><th>Problem</th><th>Multi-tape</th><th>Single-tape</th><th>Speedup</th></tr>
        </thead>
        <tbody>
          <tr><td>Palindrome check</td><td style="color:var(--green)">O(n)</td><td style="color:var(--red)">O(n²)</td><td style="color:var(--amber)">n×</td></tr>
          <tr><td>Binary copy</td><td style="color:var(--green)">O(n)</td><td style="color:var(--text2)">O(n)</td><td style="color:var(--text3)">1×</td></tr>
          <tr><td>Equality aⁿbⁿ</td><td style="color:var(--green)">O(n)</td><td style="color:var(--amber)">O(n²)</td><td style="color:var(--amber)">n×</td></tr>
          <tr><td>General sim.</td><td style="color:var(--green)">O(t)</td><td style="color:var(--red)">O(t²)</td><td style="color:var(--amber)">t×</td></tr>
        </tbody>
      </table>
    </div>

    <div class="cpanel" style="grid-column:1/-1;">
      <div class="ctitle">Key theorems</div>
      <div class="theo-grid">
        <div class="theo">
          <div class="theo-title" style="color:var(--blue);">Equivalence Theorem</div>
          <div class="theo-body">Every k-tape TM can be simulated by a 1-tape TM. They recognise exactly the same class of languages (Turing-recognisable).</div>
        </div>
        <div class="theo">
          <div class="theo-title" style="color:var(--amber);">Overhead Bound</div>
          <div class="theo-body">A t(n)-time k-tape TM can be simulated by an O(t(n)²)-time single-tape TM. The blowup comes from repeated head-scan passes.</div>
        </div>
        <div class="theo">
          <div class="theo-title" style="color:var(--green);">Practical Significance</div>
          <div class="theo-body">Multi-tape TMs model RAM and real computers more faithfully, making them the preferred tool for complexity-theoretic proofs.</div>
        </div>
      </div>
    </div>
  </div>
</div>
`;

