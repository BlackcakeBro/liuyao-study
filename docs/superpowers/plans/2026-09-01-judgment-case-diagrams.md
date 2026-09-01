# Judgment Case Diagrams Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every displayed 2026-08-29 classroom case understandable through a source-verified original and changed hexagram, moving lines, and six-line assembly labels.

**Architecture:** Add a `hexagram` record to each displayable case and reuse the existing SVG line renderer. The four visual-verifiable cases remain in the case grid; the undiagrammed wealth explanation remains a knowledge card rather than a fictional case.

**Tech Stack:** Static JavaScript, SVG markup, CSS Grid, Node.js tests.

---

### Task 1: Add regression coverage
- [ ] Extend `tests/course-0829-timing-wealth-update.test.mjs` to require exactly four visual cases, a hexagram record with original/changed lines and six assembly rows per case, and rendered `case-diagram` markup.
- [ ] Run the targeted test and observe failure before implementation.

### Task 2: Encode only visual-verifiable examples
- [ ] Update `liuyao-study-github/course-0829.js` with the four examples read from the screen track: 水雷屯→风雷益, 雷风恒→山水蒙, 水火既济→艮为山, 风山渐→山水蒙.
- [ ] Store moving lines and main/changed labels exactly as read from the shared screen; retain no standalone wealth “case” without a visible hexagram.

### Task 3: Render a consistent case diagram
- [ ] Update `liuyao-study-github/app.js` to render two equal diagrams, highlighted moving lines, and the six main/changed assembly rows before each case explanation.
- [ ] Add responsive CSS in `liuyao-study-github/styles.css` for the paired diagram, labels and mobile single-column layout.
- [ ] Run targeted and full test suites.

### Task 4: Mirror, isolate, publish
- [ ] Hash classic files, copy only changed extended-edition assets to the vault mirror, and compare hashes.
- [ ] Commit, push, wait for Pages and retrieve the published page/assets.
