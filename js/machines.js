/* ────────────────────────────────────────────────────
   MACHINE DEFINITIONS
   Each preset has a "single" and "multi" variant.
   Keys for single-tape:  "state,sym"
   Keys for multi-tape:   "state,sym1,sym2"
──────────────────────────────────────────────────── */
const MACHINES = {

  /* ══ PALINDROME ══════════════════════════════════ */
  palindrome: {
    name: 'Palindrome checker',
    defaultInput: 'abba',
    descs: {
      single: "Single-tape O(n²): marks outermost symbols, scans back-and-forth to compare pairs. Try: abba (✓), abab (✗), a (✓), racecar (✓).",
      multi:  "Multi-tape O(n): copies input to Tape 2, rewinds Tape 1, then compares left→right vs right←left simultaneously. Try: abba (✓), abab (✗)."
    },
    complexity: { multi: 'O(n)', single: 'O(n²)' },

    single: {
      n: 1,
      tapeNames: ['Single tape'],
      init: 'q0', acc: ['qacc'], rej: ['qrej'],
      phases: {
        q0:      'Find first symbol',
        qSeekA:  'Scan right — want last a',
        qSeekB:  'Scan right — want last b',
        qMatchA: 'Check rightmost symbol (expect a)',
        qMatchB: 'Check rightmost symbol (expect b)',
        qReturn: 'Rewind to left end',
        qacc:    'Accepted ✓',
        qrej:    'Rejected ✗'
      },
      states: ['q0','qSeekA','qSeekB','qMatchA','qMatchB','qReturn','qacc','qrej'],
      sl: {
        q0:      { x: 50,  y: 90  },
        qSeekA:  { x: 140, y: 40  },
        qSeekB:  { x: 140, y: 145 },
        qMatchA: { x: 240, y: 40  },
        qMatchB: { x: 240, y: 145 },
        qReturn: { x: 200, y: 200 },
        qacc:    { x: 70,  y: 255 },
        qrej:    { x: 290, y: 255 }
      },
      edges: [
        ['q0','qSeekA'], ['q0','qSeekB'],
        ['qSeekA','qSeekA'], ['qSeekB','qSeekB'],
        ['qSeekA','qMatchA'], ['qSeekB','qMatchB'],
        ['qMatchA','qReturn'], ['qMatchB','qReturn'],
        ['qReturn','qReturn'], ['qReturn','q0'],
        ['q0','qacc'], ['qMatchA','qrej'], ['qMatchB','qrej']
      ],
      tr: (() => {
        const T = {};
        T['q0,B'] = { newState:'qacc',   writes:['B'], moves:['S'] };
        T['q0,X'] = { newState:'q0',     writes:['X'], moves:['R'] };
        T['q0,Y'] = { newState:'q0',     writes:['Y'], moves:['R'] };
        T['q0,a'] = { newState:'qSeekA', writes:['X'], moves:['R'] };
        T['q0,b'] = { newState:'qSeekB', writes:['Y'], moves:['R'] };
        for (const s of ['a','b','X','Y'])
          T[`qSeekA,${s}`] = { newState:'qSeekA', writes:[s], moves:['R'] };
        T['qSeekA,B'] = { newState:'qMatchA', writes:['B'], moves:['L'] };
        T['qMatchA,a'] = { newState:'qReturn', writes:['X'], moves:['L'] };
        T['qMatchA,b'] = { newState:'qrej',    writes:['b'], moves:['S'] };
        T['qMatchA,X'] = { newState:'qacc',    writes:['X'], moves:['S'] };
        T['qMatchA,Y'] = { newState:'qacc',    writes:['Y'], moves:['S'] };
        T['qMatchA,B'] = { newState:'qacc',    writes:['B'], moves:['S'] };
        for (const s of ['a','b','X','Y'])
          T[`qSeekB,${s}`] = { newState:'qSeekB', writes:[s], moves:['R'] };
        T['qSeekB,B'] = { newState:'qMatchB', writes:['B'], moves:['L'] };
        T['qMatchB,b'] = { newState:'qReturn', writes:['Y'], moves:['L'] };
        T['qMatchB,a'] = { newState:'qrej',    writes:['a'], moves:['S'] };
        T['qMatchB,X'] = { newState:'qacc',    writes:['X'], moves:['S'] };
        T['qMatchB,Y'] = { newState:'qacc',    writes:['Y'], moves:['S'] };
        T['qMatchB,B'] = { newState:'qacc',    writes:['B'], moves:['S'] };
        for (const s of ['a','b','X','Y'])
          T[`qReturn,${s}`] = { newState:'qReturn', writes:[s], moves:['L'] };
        T['qReturn,B'] = { newState:'q0', writes:['B'], moves:['R'] };
        return T;
      })()
    },

    multi: {
      n: 2,
      tapeNames: ['Input tape', 'Work tape (copy)'],
      init: 'q_copy', acc: ['q_acc'], rej: ['q_rej'],
      phases: {
        q_copy:   'Copying input → Tape 2',
        q_rewind: 'Rewinding Tape 1 to start',
        q_compare:'Comparing left↔right',
        q_acc:    'Accepted ✓',
        q_rej:    'Rejected ✗'
      },
      states: ['q_copy','q_rewind','q_compare','q_acc','q_rej'],
      sl: {
        q_copy:   { x: 62,  y: 80  },
        q_rewind: { x: 170, y: 48  },
        q_compare:{ x: 278, y: 110 },
        q_acc:    { x: 80,  y: 210 },
        q_rej:    { x: 210, y: 220 }
      },
      edges: [
        ['q_copy','q_copy'], ['q_copy','q_rewind'],
        ['q_rewind','q_compare'], ['q_rewind','q_acc'],
        ['q_compare','q_compare'], ['q_compare','q_acc'], ['q_compare','q_rej']
      ],
      tr: (() => {
        const T = {};
        const syms = ['a','b','0','1'];
        for (const s of syms)
          T[`q_copy,${s},B`] = { newState:'q_copy', writes:[s,s], moves:['R','R'] };
        T['q_copy,B,B'] = { newState:'q_rewind', writes:['B','B'], moves:['L','L'] };
        for (const s of syms)
          for (const t of syms)
            T[`q_rewind,${s},${t}`] = { newState:'q_rewind', writes:[s,t], moves:['L','S'] };
        for (const s of syms)
          T[`q_rewind,B,${s}`] = { newState:'q_compare', writes:['B',s], moves:['R','S'] };
        for (const s of syms)
          T[`q_rewind,${s},B`] = { newState:'q_rewind', writes:[s,'B'], moves:['L','S'] };
        T['q_rewind,B,B'] = { newState:'q_acc', writes:['B','B'], moves:['S','S'] };
        for (const s of syms)
          for (const t of syms) {
            if (s === t)
              T[`q_compare,${s},${t}`] = { newState:'q_compare', writes:[s,t], moves:['R','L'] };
            else
              T[`q_compare,${s},${t}`] = { newState:'q_rej',     writes:[s,t], moves:['S','S'] };
          }
        T['q_compare,B,B'] = { newState:'q_acc', writes:['B','B'], moves:['S','S'] };
        for (const s of syms) {
          T[`q_compare,B,${s}`] = { newState:'q_acc', writes:['B',s], moves:['S','S'] };
          T[`q_compare,${s},B`] = { newState:'q_acc', writes:[s,'B'], moves:['S','S'] };
        }
        return T;
      })()
    }
  },

  /* ══ BINARY COPY ═════════════════════════════════ */
  copy: {
    name: 'Binary copy',
    defaultInput: '1011',
    descs: {
      single: "Single-tape O(n²): marks each bit, scans all the way right to append it at the end, rewinds. Steps grow quadratically. Try: 1011, 0, 101.",
      multi:  "Multi-tape O(n): both heads advance in parallel — Tape 1 reads, Tape 2 writes simultaneously. Steps grow linearly. Try: 1011, 10110."
    },
    complexity: { multi: 'O(n)', single: 'O(n²)' },

    single: {
      n: 1,
      tapeNames: ['Tape'],
      init: 'q_s0', acc: ['q_acc'], rej: ['q_rej'],
      phases: {
        q_s0:    'Scan for next unmarked bit',
        q_mark0: 'Bit 0 marked — scan right to append',
        q_mark1: 'Bit 1 marked — scan right to append',
        q_rew:   'Rewinding to start',
        q_acc:   'Copy complete ✓',
        q_rej:   'Error ✗'
      },
      states: ['q_s0','q_mark0','q_mark1','q_rew','q_acc','q_rej'],
      sl: {
        q_s0:    { x: 50,  y: 120 },
        q_mark0: { x: 145, y: 60  },
        q_mark1: { x: 145, y: 185 },
        q_rew:   { x: 235, y: 120 },
        q_acc:   { x: 295, y: 60  },
        q_rej:   { x: 295, y: 185 }
      },
      edges: [
        ['q_s0','q_mark0'], ['q_s0','q_mark1'],
        ['q_mark0','q_rew'], ['q_mark1','q_rew'],
        ['q_rew','q_rew'], ['q_rew','q_s0'],
        ['q_s0','q_acc']
      ],
      tr: (() => {
        const T = {};
        T['q_s0,B'] = { newState:'q_acc',   writes:['B'], moves:['S'] };
        T['q_s0,0'] = { newState:'q_mark0', writes:['X'], moves:['R'] };
        T['q_s0,1'] = { newState:'q_mark1', writes:['Y'], moves:['R'] };
        T['q_s0,X'] = { newState:'q_s0',    writes:['X'], moves:['R'] };
        T['q_s0,Y'] = { newState:'q_s0',    writes:['Y'], moves:['R'] };
        T['q_s0,#'] = { newState:'q_acc',   writes:['#'], moves:['S'] };
        for (const s of ['0','1','X','Y','#'])
          T[`q_mark0,${s}`] = { newState:'q_mark0', writes:[s], moves:['R'] };
        T['q_mark0,B'] = { newState:'q_rew', writes:['0'], moves:['L'] };
        for (const s of ['0','1','X','Y','#'])
          T[`q_mark1,${s}`] = { newState:'q_mark1', writes:[s], moves:['R'] };
        T['q_mark1,B'] = { newState:'q_rew', writes:['1'], moves:['L'] };
        for (const s of ['0','1','X','Y','#'])
          T[`q_rew,${s}`] = { newState:'q_rew', writes:[s], moves:['L'] };
        T['q_rew,B'] = { newState:'q_s0', writes:['B'], moves:['R'] };
        return T;
      })()
    },

    multi: {
      n: 2,
      tapeNames: ['Source tape', 'Destination tape'],
      init: 'q0', acc: ['q_acc'], rej: ['q_rej'],
      phases: { q0:'Copying in parallel', q_acc:'Copy complete ✓', q_rej:'Error ✗' },
      states: ['q0','q_acc','q_rej'],
      sl: {
        q0:    { x: 85,  y: 130 },
        q_acc: { x: 220, y: 75  },
        q_rej: { x: 225, y: 195 }
      },
      edges: [['q0','q0'], ['q0','q_acc'], ['q0','q_rej']],
      tr: {
        'q0,0,B': { newState:'q0',    writes:['0','0'], moves:['R','R'] },
        'q0,1,B': { newState:'q0',    writes:['1','1'], moves:['R','R'] },
        'q0,B,B': { newState:'q_acc', writes:['B','B'], moves:['S','S'] }
      }
    }
  },

  /* ══ EQUALITY aⁿbⁿ ══════════════════════════════ */
  equality: {
    name: 'Equality check aⁿbⁿ',
    defaultInput: 'aaabbb',
    descs: {
      single: "Single-tape O(n²): repeatedly marks one a as X and one b as Y, scanning back-and-forth each time. Try: aaabbb (✓), aabb (✓), aab (✗), abb (✗).",
      multi:  "Multi-tape O(n): counts a's as tally marks | on Tape 2, then matches b's against them one-by-one. Try: aaabbb (✓), aab (✗), abb (✗)."
    },
    complexity: { multi: 'O(n)', single: 'O(n²)' },

    single: {
      n: 1,
      tapeNames: ['Tape'],
      init: 'q0', acc: ['q_acc'], rej: ['q_rej'],
      phases: {
        q0:      "Find next a to mark",
        q1:      "Scan right for unmarked b",
        q2:      "Scan left back to start",
        q_check: "Verify no b's remain",
        q_acc:   'Accepted ✓',
        q_rej:   'Rejected ✗'
      },
      states: ['q0','q1','q2','q_check','q_acc','q_rej'],
      sl: {
        q0:      { x: 55,  y: 110 },
        q1:      { x: 155, y: 55  },
        q2:      { x: 255, y: 110 },
        q_check: { x: 155, y: 175 },
        q_acc:   { x: 75,  y: 245 },
        q_rej:   { x: 245, y: 245 }
      },
      edges: [
        ['q0','q0'], ['q0','q1'], ['q0','q_check'],
        ['q1','q1'], ['q1','q2'], ['q1','q_rej'],
        ['q2','q2'], ['q2','q0'],
        ['q_check','q_check'], ['q_check','q_acc'], ['q_check','q_rej']
      ],
      tr: (() => {
        const T = {};
        T['q0,X'] = { newState:'q0',      writes:['X'], moves:['R'] };
        T['q0,a'] = { newState:'q1',      writes:['X'], moves:['R'] };
        T['q0,Y'] = { newState:'q0',      writes:['Y'], moves:['R'] };
        T['q0,b'] = { newState:'q_rej',   writes:['b'], moves:['S'] };
        T['q0,B'] = { newState:'q_check', writes:['B'], moves:['L'] };
        T['q_check,Y'] = { newState:'q_check', writes:['Y'], moves:['L'] };
        T['q_check,X'] = { newState:'q_check', writes:['X'], moves:['L'] };
        T['q_check,B'] = { newState:'q_acc',   writes:['B'], moves:['S'] };
        T['q_check,b'] = { newState:'q_rej',   writes:['b'], moves:['S'] };
        T['q_check,a'] = { newState:'q_rej',   writes:['a'], moves:['S'] };
        T['q1,a'] = { newState:'q1',    writes:['a'], moves:['R'] };
        T['q1,X'] = { newState:'q1',    writes:['X'], moves:['R'] };
        T['q1,Y'] = { newState:'q1',    writes:['Y'], moves:['R'] };
        T['q1,b'] = { newState:'q2',    writes:['Y'], moves:['L'] };
        T['q1,B'] = { newState:'q_rej', writes:['B'], moves:['S'] };
        T['q2,a'] = { newState:'q2', writes:['a'], moves:['L'] };
        T['q2,X'] = { newState:'q2', writes:['X'], moves:['L'] };
        T['q2,Y'] = { newState:'q2', writes:['Y'], moves:['L'] };
        T['q2,b'] = { newState:'q2', writes:['b'], moves:['L'] };
        T['q2,B'] = { newState:'q0', writes:['B'], moves:['R'] };
        return T;
      })()
    },

    multi: {
      n: 2,
      tapeNames: ['Input tape', 'Counter tape'],
      init: 'q_counta', acc: ['q_acc'], rej: ['q_rej'],
      phases: {
        q_counta: "Counting a's onto Tape 2",
        q_rewindc:'Rewinding counter tape',
        q_countb: "Matching b's with tallies",
        q_acc:    'Accepted ✓',
        q_rej:    'Rejected ✗'
      },
      states: ['q_counta','q_rewindc','q_countb','q_acc','q_rej'],
      sl: {
        q_counta: { x: 62,  y: 80  },
        q_rewindc:{ x: 170, y: 48  },
        q_countb: { x: 278, y: 110 },
        q_acc:    { x: 80,  y: 210 },
        q_rej:    { x: 210, y: 220 }
      },
      edges: [
        ['q_counta','q_counta'], ['q_counta','q_rewindc'],
        ['q_rewindc','q_countb'],
        ['q_countb','q_countb'], ['q_countb','q_acc'], ['q_countb','q_rej']
      ],
      tr: {
        'q_counta,a,B': { newState:'q_counta',  writes:['a','|'], moves:['R','R'] },
        'q_counta,b,B': { newState:'q_rewindc', writes:['b','B'], moves:['S','L'] },
        'q_counta,B,B': { newState:'q_rej',     writes:['B','B'], moves:['S','S'] },
        'q_rewindc,b,|':{ newState:'q_rewindc', writes:['b','|'], moves:['S','L'] },
        'q_rewindc,b,B':{ newState:'q_countb',  writes:['b','B'], moves:['S','R'] },
        'q_countb,b,|': { newState:'q_countb',  writes:['b','B'], moves:['R','R'] },
        'q_countb,B,B': { newState:'q_acc',     writes:['B','B'], moves:['S','S'] },
        'q_countb,b,B': { newState:'q_rej',     writes:['b','B'], moves:['S','S'] },
        'q_countb,B,|': { newState:'q_rej',     writes:['B','|'], moves:['S','S'] }
      }
    }
  }
};
