# Judgment Intro Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the judgment-page hero with its content container and remove learner-facing production metadata.

**Architecture:** Keep the existing course data and rendering model. Change only the extended-edition HTML, its shared CSS width rule, and training source labels. Regression tests assert the absence of audit strips and the full-width alignment rule.

**Tech Stack:** Static HTML, CSS, JavaScript, Node.js test runner.

---

### Task 1: Lock the desired presentation in tests

**Files:**
- Modify: `tests/course-0829-timing-wealth-update.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
assert.doesNotMatch(html,/audit-status-strip/);
assert.match(css,/\.judgment0822-intro\{[^}]*max-width:none/);
assert.doesNotMatch(training,/全程音画复核|02:48:00|02:35:05/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/course-0829-timing-wealth-update.test.mjs`
Expected: FAIL because the page still has audit strips and the intro remains capped at 1000px.

### Task 2: Remove presentation-only metadata

**Files:**
- Modify: `liuyao-study-github/index.html`
- Modify: `liuyao-study-github/styles.css`
- Modify: `liuyao-study-github/training-bank.js`

- [ ] **Step 1: Remove both `audit-status-strip` elements and replace the 08-22 introduction with learning-only text.**
- [ ] **Step 2: Set `.judgment0822-intro` to `max-width:none` so it occupies the same content width as following sections.**
- [ ] **Step 3: Replace the two course source labels with teacher and date only.**
- [ ] **Step 4: Run the targeted test.**

Run: `node --test tests/course-0829-timing-wealth-update.test.mjs`
Expected: PASS.

### Task 3: Verify and publish

**Files:**
- Modify: `知识库/六爻/六爻学习网站/新版/index.html`
- Modify: `知识库/六爻/六爻学习网站/新版/styles.css`
- Modify: `知识库/六爻/六爻学习网站/新版/training-bank.js`

- [ ] **Step 1: Run `node --test tests/*.test.mjs` and `git diff --check`.**
- [ ] **Step 2: Compare classic-edition hashes before and after mirroring only the three changed extended files.**
- [ ] **Step 3: Commit, push `main`, wait for Pages, and retrieve the published HTML to confirm the audit strip is absent.**
