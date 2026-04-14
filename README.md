# Multi-Tape Turing Machine Visualizer

Interactive web visualizer for single-tape and multi-tape Turing Machines, including preset machines, step-by-step execution, state diagram visualization, and complexity comparison.

## Project Structure

```text
TAFL TOC FINAL/
├── README.md
├── LICENSE
├── .gitignore
└── tm-visualizer/
    ├── index.html
    ├── styles/
    │   └── main.css
    ├── components/
    │   ├── nav.js
    │   ├── tabs.js
    │   ├── simulator.js
    │   ├── comparison.js
    │   └── layout.js
    └── js/
        ├── bootstrap.js
        ├── machines.js
        ├── engine.js
        └── app.js
```

## Architecture

- `index.html` is now a lightweight entry page that only loads styles, components, and scripts.
- `tm-visualizer/styles/main.css` contains all application styles.
- UI sections are split into component files in `tm-visualizer/components/`.
- `tm-visualizer/components/layout.js` composes all component markup.
- `tm-visualizer/js/bootstrap.js` mounts the composed layout into `<div id="app"></div>`.
- `tm-visualizer/js/machines.js` contains machine presets and transition definitions.
- `tm-visualizer/js/engine.js` contains the core `Tape` and `TM` classes.
- `tm-visualizer/js/app.js` contains UI state, rendering logic, controls, and bootstrapping calls.

## Features

- Single-tape and multi-tape simulation modes
- Preset machines (palindrome, binary copy, and a^n b^n equality)
- Live tape/head visualization
- Transition and state diagram tracking
- Complexity comparison tab
- Dark/light theme toggle

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript

