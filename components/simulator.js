window.TMComponents = window.TMComponents || {};

window.TMComponents.simulator = `
<div id="simTab">
  <div class="content">
    <div>
      <div class="card">
        <div class="ctitle">Machine &amp; input</div>
        <div class="tgl-group">
          <button class="tgl on" id="tglS" onclick="setMode('single')">Single tape</button>
          <button class="tgl" id="tglM" onclick="setMode('multi')">Multi-tape</button>
        </div>
        <div class="flbl">Preset</div>
        <select id="presetSel" onchange="onPreset()" style="margin-bottom:14px;">
          <option value="palindrome">Palindrome checker</option>
          <option value="copy">Binary copy</option>
          <option value="equality">Equality check aⁿbⁿ</option>
        </select>
        <div class="flbl">Input string</div>
        <input type="text" id="inputStr" value="abba" spellcheck="false" style="margin-bottom:8px;">
        <div class="fhint" id="presetDesc"></div>
        <button class="load-btn" onclick="initMachine()">Initialize Machine</button>
      </div>

      <div class="exec-card">
        <div class="exec-hdr">
          <span class="badge run" id="statusBadge">Running</span>
          <span class="exec-state" id="execState">State: q0</span>
          <span class="exec-step" id="execStep">Step 0</span>
          <div class="ctrl-group">
            <button class="cbtn danger" onclick="resetMachine()" title="Reset">
              <svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
              Reset
            </button>
            <button class="cbtn" onclick="doStep()">
              <svg viewBox="0 0 24 24"><polygon points="5,4 15,12 5,20"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
              Step
            </button>
            <button class="cbtn primary" onclick="toggleRun()" id="runBtn">
              <svg viewBox="0 0 24 24" id="runIco"><polygon points="5,3 19,12 5,21"></polygon></svg>
              <span id="runLbl">Play</span>
            </button>
            <button class="cbtn" onclick="runToEnd()">
              <svg viewBox="0 0 24 24"><polygon points="5,4 13,12 5,20"></polygon><polygon points="12,4 20,12 12,20"></polygon></svg>
              End
            </button>
            <div class="spd">
              <span>SPEED</span>
              <input type="range" id="speedSlider" min="1" max="10" value="5" oninput="document.getElementById('spdVal').textContent=(this.value*42)+'ms'">
              <span class="speed-val" id="spdVal">210ms</span>
            </div>
          </div>
        </div>

        <div class="stats-row">
          <div class="schip"><div class="sl">Steps</div><div class="sv" id="sSteps">0</div></div>
          <div class="schip"><div class="sl">Head 1</div><div class="sv" id="sH1">0</div></div>
          <div class="schip"><div class="sl">Head 2</div><div class="sv" id="sH2">—</div></div>
          <div class="schip"><div class="sl">Input |n|</div><div class="sv" id="sLen">4</div></div>
        </div>

        <div id="tapeSection" class="tape-wrap"></div>

        <div class="log-sec">
          <div class="log-hdr">Transition log</div>
          <div class="log-scroll" id="logScroll">
            <div style="color:var(--text3);font-size:10px;font-family:'JetBrains Mono',monospace;">No transitions yet…</div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="card">
        <div class="ctitle-row">
          <span class="ctitle" style="margin-bottom:0;">State diagram</span>
          <span class="chint">Live highlight · current state glows</span>
        </div>
        <div class="sd-wrap">
          <svg id="sdSvg" viewBox="0 0 340 290"></svg>
        </div>
      </div>

      <div class="card">
        <div class="ins-hdr">
          <svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"></path><line x1="9" y1="21" x2="15" y2="21"></line><line x1="9" y1="18" x2="15" y2="18"></line></svg>
          <span class="ins-htxt">Step insight</span>
        </div>
        <div class="ins-body" id="insightBody">Initial config: state q0, all heads at position 0.
Press Step or Play.</div>

        <div class="ins-sec">
          <div class="ins-shdr">
            <svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            <span class="ins-stitle">Why multi-tape helps</span>
          </div>
          <ul class="ins-list">
            <li>A <strong>k-tape</strong> machine runs palindromes in <strong>Θ(n)</strong> vs <strong>Θ(n²)</strong> on one tape.</li>
            <li>Tape 2 acts as <strong>scratch space</strong>: copy, rewind, compare — all O(n).</li>
            <li>Multi-tape TMs are <strong>Turing-equivalent</strong>: same decidable languages, just faster.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
`;

