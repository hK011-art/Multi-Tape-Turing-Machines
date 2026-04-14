/* ────────────────────────────────────────────────────
   TAPE CLASS
──────────────────────────────────────────────────── */
class Tape {
  constructor() { this.c = {}; this.h = 0; }
  read()       { return this.c[this.h] !== undefined ? this.c[this.h] : 'B'; }
  write(s)     { this.c[this.h] = s; }
  move(d)      { if (d === 'R') this.h++; else if (d === 'L') this.h--; }
  setInput(s)  { this.c = {}; this.h = 0; for (let i = 0; i < s.length; i++) this.c[i] = s[i]; }
  range(half) {
    const r = [];
    for (let i = this.h - half; i <= this.h + half; i++)
      r.push({ p: i, s: this.c[i] !== undefined ? this.c[i] : 'B', isH: i === this.h, bl: this.c[i] === undefined || this.c[i] === 'B' });
    return r;
  }
}

/* ────────────────────────────────────────────────────
   TURING MACHINE CLASS
──────────────────────────────────────────────────── */
class TM {
  constructor(cfg) {
    this.n     = cfg.n || 1;
    this.tapes = Array.from({ length: this.n }, () => new Tape());
    this.tr    = cfg.tr;
    this.state = cfg.init;
    this.acc   = cfg.acc;
    this.rej   = cfg.rej;
    this.step  = 0;
    this.halted = false;
    this.last  = null;
  }
  setInput(s, t) { this.tapes[t || 0].setInput(s); }
  tick() {
    if (this.halted) return false;
    const syms = this.tapes.map(t => t.read());
    const key  = [this.state, ...syms].join(',');
    const tr   = this.tr[key];
    if (!tr) { this.halted = true; this.last = null; return false; }
    this.last  = { from: this.state, reads: [...syms], key, ...tr };
    this.state = tr.newState;
    tr.writes.forEach((s, i) => this.tapes[i].write(s));
    tr.moves .forEach((d, i) => this.tapes[i].move(d));
    this.step++;
    if (this.acc.includes(this.state) || this.rej.includes(this.state)) this.halted = true;
    return true;
  }
  isAcc() { return this.acc.includes(this.state); }
  isRej() { return this.rej.includes(this.state) || (this.halted && !this.isAcc()); }
}
