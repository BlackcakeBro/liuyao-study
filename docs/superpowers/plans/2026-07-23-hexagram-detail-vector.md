# Hexagram Detail Vector Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the enlarged Unicode glyph in the extended-site single-hexagram detail panel with a precisely spaced six-line diagram centered between the detail kicker and hexagram name.

**Architecture:** Add a small pure rendering helper in `app.js` that converts each hexagram name into six top-to-bottom yin/yang lines using the eight natural-image trigrams. The detail panel will render semantic line markup, while scoped CSS controls the confirmed 176px width, 10px line thickness, 16px line gap, and compact centering. Existing card glyphs and the classic site remain unchanged.

**Tech Stack:** Native HTML, CSS, JavaScript, Node.js built-in test runner, Playwright browser QA.

---

### Task 1: Lock the six-line rendering contract with tests

**Files:**
- Create: `tests/hexagram-detail-vector.test.mjs`
- Read: `liuyao-study-github/course-0718.js`
- Read: `liuyao-study-github/app.js`
- Read: `liuyao-study-github/styles.css`

- [ ] **Step 1: Write the failing test**

```js
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const app=fs.readFileSync("liuyao-study-github/app.js","utf8");
const css=fs.readFileSync("liuyao-study-github/styles.css","utf8");
const courseSource=fs.readFileSync("liuyao-study-github/course-0718.js","utf8");
const context={};
vm.createContext(context);
vm.runInContext(`${courseSource};this.course0718=course0718;`,context);
const names=context.course0718.palaceOrder.flatMap(key=>context.course0718.palaces[key].hexagrams.map(item=>item[0]));

test("single-hexagram detail renders six explicit yao lines",()=>{
  assert.match(app,/const trigramTopDown=/);
  assert.match(app,/function hexagramDetailMarkup\(name\)/);
  assert.match(app,/scroll-detail-hexagram/);
  assert.match(app,/scroll-detail-yao/);
  assert.doesNotMatch(app,/class="scroll-detail-glyph"[^>]*>\\$\\{h\\[1\\]\\}/);
  assert.equal(names.length,64);
});

test("all eight natural-image trigrams have exact top-down line patterns",()=>{
  for(const [symbol,pattern] of Object.entries({
    天:"111",泽:"011",火:"101",雷:"001",风:"110",水:"010",山:"100",地:"000"
  })){
    assert.match(app,new RegExp(`${symbol}:"${pattern}"`));
  }
});

test("confirmed detail proportions are encoded in scoped CSS",()=>{
  assert.match(css,/\\.scroll-detail-hexagram\\{[^}]*width:176px[^}]*gap:16px/s);
  assert.match(css,/\\.scroll-detail-yao\\{[^}]*height:10px/s);
  assert.match(css,/\\.scroll-detail-yao\\.broken\\{[^}]*gap:24px/s);
  assert.match(css,/\\.scroll-detail-glyph-stage\\{[^}]*height:167px[^}]*margin:10px 0 9px/s);
});
```

- [ ] **Step 2: Run the new test and verify RED**

Run:

```bash
node --test tests/hexagram-detail-vector.test.mjs
```

Expected: FAIL because `hexagramDetailMarkup`, the trigram patterns, and vector-line CSS do not exist.

- [ ] **Step 3: Commit the failing test**

```bash
git add tests/hexagram-detail-vector.test.mjs
git commit -m "test: define hexagram detail vector contract"
```

### Task 2: Implement exact six-line markup and confirmed spacing

**Files:**
- Modify: `liuyao-study-github/app.js:990-1035`
- Modify: `liuyao-study-github/styles.css:348-355`
- Modify: `liuyao-study-github/index.html:9,563-566`

- [ ] **Step 1: Add the pure trigram patterns and rendering helper**

Insert before `render0718Palace`:

```js
const trigramTopDown={天:"111",泽:"011",火:"101",雷:"001",风:"110",水:"010",山:"100",地:"000"};
function hexagramDetailMarkup(name){
  const isPure=name.includes("为");
  const upper=isPure?name.at(-1):name[0];
  const lower=isPure?name.at(-1):name[1];
  const pattern=`${trigramTopDown[upper]||""}${trigramTopDown[lower]||""}`;
  if(pattern.length!==6)return "";
  return `<div class="scroll-detail-glyph-stage"><div class="scroll-detail-hexagram" role="img" aria-label="${name}卦象">${[...pattern].map(line=>`<i class="scroll-detail-yao ${line==="0"?"broken":"solid"}">${line==="0"?"<b></b><b></b>":""}</i>`).join("")}</div></div>`;
}
```

- [ ] **Step 2: Replace only the detail Unicode glyph**

Change the detail template to:

```js
meta.innerHTML=`<span class="scroll-detail-kicker">单卦取象 · ${palaceKey}宫 · ${stage}</span>${hexagramDetailMarkup(h[0])}<h3>${h[0]}</h3><strong>${h[2]}</strong><div class="scroll-detail-block"><b>意象提示</b><p>${h[3]}</p></div><em>${palaceKey}宫 · 宫五行${palace.element} · 第${String(activeIndex+1).padStart(2,"0")}卦</em>`;
```

- [ ] **Step 3: Replace detail-glyph CSS with the approved vector layout**

Add:

```css
.scroll-detail-glyph-stage{height:167px;margin:10px 0 9px;display:grid;place-items:center}
.scroll-detail-hexagram{width:176px;display:grid;gap:16px;filter:drop-shadow(0 8px 13px rgba(45,37,28,.12));animation:gua-glyph-breathe 3.4s ease-in-out infinite}
.scroll-detail-yao{display:block;height:10px;background:var(--scroll-ink)}
.scroll-detail-yao.broken{display:grid;grid-template-columns:1fr 1fr;gap:24px;background:transparent}
.scroll-detail-yao.broken b{display:block;background:var(--scroll-ink)}
```

Update responsive rules:

```css
@media(max-width:1080px){
  .scroll-detail-glyph-stage{grid-row:2/5;height:154px}
  .scroll-detail-hexagram{width:164px;gap:14px}
  .scroll-detail-yao{height:9px}
}
@media(max-width:760px){
  .scroll-detail-glyph-stage{height:148px;margin:9px 0 8px}
  .scroll-detail-hexagram{width:158px;gap:13px}
  .scroll-detail-yao{height:9px}
}
```

Include `.scroll-detail-hexagram` and `.scroll-detail-yao` in the reduced-motion rule and remove the obsolete `.scroll-detail-glyph` selectors.

- [ ] **Step 4: Bump cache keys**

Set both CSS and app cache versions in `index.html` to:

```html
styles.css?v=20260723-hexagram-vector-v9
app.js?v=20260723-hexagram-vector-v9
```

- [ ] **Step 5: Run the focused test and verify GREEN**

Run:

```bash
node --test tests/hexagram-detail-vector.test.mjs
```

Expected: 3 tests pass.

- [ ] **Step 6: Run syntax and full regression tests**

Run:

```bash
node --check liuyao-study-github/app.js
node --test tests/*.test.mjs
git diff --check
```

Expected: all tests pass, JavaScript syntax is valid, and no whitespace errors appear.

- [ ] **Step 7: Commit implementation**

```bash
git add liuyao-study-github/app.js liuyao-study-github/styles.css liuyao-study-github/index.html
git commit -m "Render enlarged hexagrams with precise yao spacing"
```

### Task 3: Browser QA, vault sync, and deployment

**Files:**
- Verify: `liuyao-study-github/app.js`
- Verify: `liuyao-study-github/styles.css`
- Sync: `认知硬核库/六爻/六爻学习网站-副本-20260704课堂核查`

- [ ] **Step 1: Run local desktop interaction QA**

Open:

```text
http://127.0.0.1:8765/#edition=extended&view=lecture0718
```

Test flow:

1. Click 震宫.
2. Click 泽雷随.
3. Verify the six-line diagram reads 阴、阳、阳、阴、阴、阳 from top to bottom.
4. Verify the diagram is centered between “单卦取象 · 震宫 · 归魂” and “泽雷随”.
5. Verify computed desktop values are width 176px, line height 10px, gap 16px, and stage height 167px.
6. Switch to 乾为天 and 坤为地 and verify all-solid and all-broken diagrams.
7. Confirm no console errors.

- [ ] **Step 2: Run mobile QA**

At 390×844:

1. Open the same extended route.
2. Click a palace and a hexagram.
3. Verify no overlap, clipping, wrapping, or horizontal overflow.
4. Verify the six lines remain visually distinct.

- [ ] **Step 3: Capture and inspect screenshots**

Capture desktop and mobile detail screenshots outside the repository. Compare them with the accepted visual-companion design for:

- correct six-line pattern,
- compact vertical spacing,
- visual centering between the two text boundaries,
- unchanged one-line hexagram name,
- unchanged scroll and card layout.

- [ ] **Step 4: Sync the verified site to the vault**

Run:

```bash
TARGET='/Users/hanyuxuan/ObsidianVaults/HYX/认知硬核库/六爻/六爻学习网站-副本-20260704课堂核查'
rsync -a --delete --exclude='.edgeone' --exclude='.vercel' liuyao-study-github/ "$TARGET/"
cmp liuyao-study-github/app.js "$TARGET/app.js"
cmp liuyao-study-github/styles.css "$TARGET/styles.css"
cmp liuyao-study-github/index.html "$TARGET/index.html"
```

Expected: all `cmp` commands exit successfully.

- [ ] **Step 5: Merge, push, and watch GitHub Pages**

After the finishing workflow chooses local merge:

```bash
git switch main
git merge --ff-only agent/hexagram-detail-vector-v9
git push origin main
gh run list --repo BlackcakeBro/liuyao-study --branch main --limit 1
gh run watch <run-id> --repo BlackcakeBro/liuyao-study --exit-status
```

Expected: Pages deployment completes with `success`.

- [ ] **Step 6: Verify the live extended site**

Open:

```text
https://blackcakebro.github.io/liuyao-study/liuyao-study-github/#edition=extended&view=lecture0718
```

Repeat the desktop interaction checks and verify the `v9` CSS/app assets load with no failed requests.

