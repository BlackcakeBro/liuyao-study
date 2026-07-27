# 装卦六亲课程版式修正 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修正新版课程页的单卦详情留白、六亲生克图、父母与官鬼卡片、判断边界和古籍路线状态，同时保持经典版零改动。

**Architecture:** 以 `liuyao-study-github` 为唯一发布源，先用 Node 静态回归测试锁定 DOM、CSS 与状态契约，再修改渲染函数和新版样式。完成后同步到 Obsidian 新版副本，运行全量测试与真实浏览器视口检查，并对经典版目录做哈希比对。

**Tech Stack:** 原生 HTML、CSS、JavaScript、Node.js `node:test`、Playwright/浏览器回归、GitHub Pages

---

## 文件结构

- `liuyao-study-github/app.js`：单卦详情、六亲图、父母官鬼卡片及古籍路线的 DOM 渲染。
- `liuyao-study-github/styles.css`：全部新版视觉布局与响应式规则。
- `liuyao-study-github/index.html`：必要的缓存版本号与可访问性说明。
- `liuyao-study-github/training-bank.js`：只调整路线状态字段，不改题库内容与数量。
- `tests/course-0725-layout.test.mjs`：新增版式与状态回归契约。
- `tests/course-0725-update.test.mjs`：保留课程事实和新版隔离断言。
- `认知硬核库/六爻/六爻学习网站-副本-20260704课堂核查/`：验证通过后同步的 Obsidian 新版副本。

### Task 1: 建立失败的版式与路线回归测试

**Files:**
- Create: `tests/course-0725-layout.test.mjs`
- Read: `liuyao-study-github/app.js`
- Read: `liuyao-study-github/styles.css`
- Read: `liuyao-study-github/training-bank.js`

- [ ] **Step 1: 写入版式与状态契约**

```js
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const app=fs.readFileSync("liuyao-study-github/app.js","utf8");
const css=fs.readFileSync("liuyao-study-github/styles.css","utf8");
const trainingSource=[
  "data.js","course-0718.js","course-0725.js","training-bank.js"
].map(file=>fs.readFileSync(`liuyao-study-github/${file}`,"utf8")).join("\n")+
  "\n;globalThis.__training=window.LIUYAO_TRAINING;";
const sandbox={window:{}};
vm.runInNewContext(trainingSource,sandbox);

test("single-hexagram detail uses one positioned content group with balanced vertical gutters",()=>{
  assert.match(app,/class="scroll-detail-content"/);
  assert.match(css,/\.scroll-palace-meta\.is-hexagram-detail\{[^}]*--detail-gutter:/s);
  assert.match(css,/\.scroll-detail-content\{[^}]*height:calc\(100% - \(var\(--detail-gutter\) \* 2\)\)/s);
  assert.match(css,/\.scroll-detail-content\{[^}]*transform:translateY\(-/s);
});

test("07-25 six-relative relationships render as one SVG double-cycle diagram",()=>{
  assert.match(app,/relative-cycle-svg/);
  assert.match(app,/aria-label="六亲相生相克双环图"/);
  assert.match(app,/relative-cycle-edge sheng/);
  assert.match(app,/relative-cycle-edge ke/);
  assert.match(css,/\.relative-cycle-svg\{/);
});

test("focus-relative cards and judgment boundary use stable alignment regions",()=>{
  assert.match(app,/class="relative-card-body"/);
  assert.match(app,/class="relative-card-boundary"/);
  assert.match(css,/\.relative-focus-grid>article\{[^}]*grid-template-rows:/s);
  assert.match(css,/\.judgment-boundary\{[^}]*align-items:start/s);
  assert.match(css,/\.judgment-boundary__rules\{/);
});

test("assembly and six relatives are marked learned in the classics roadmap",()=>{
  const roadmap=sandbox.__training.classics.roadmap;
  assert.equal(roadmap.find(step=>step.title==="浑天甲子").progress,"learned");
  assert.equal(roadmap.find(step=>step.title==="六亲").progress,"learned");
  assert.match(app,/step\.progress==="learned"/);
});
```

- [ ] **Step 2: 运行新测试并确认失败原因正确**

Run:

```bash
node --test tests/course-0725-layout.test.mjs
```

Expected: 4 个测试因缺少 `scroll-detail-content`、`relative-cycle-svg`、稳定对齐区和 `progress:"learned"` 而失败，而不是语法或文件路径错误。

- [ ] **Step 3: 记录经典版修改前哈希**

Run:

```bash
find liuyao-study-github/archive/old-version-20260706 -type f -print0 \
  | sort -z | xargs -0 shasum -a 256 > /tmp/liuyao-classic-before.sha256
```

Expected: 生成非空基线文件；不修改经典版目录。

- [ ] **Step 4: 提交测试**

```bash
git add tests/course-0725-layout.test.mjs
git commit -m "test: lock lecture layout refinements"
```

### Task 2: 统一 64 卦详情的尺寸与上下留白

**Files:**
- Modify: `liuyao-study-github/app.js:1011-1046`
- Modify: `liuyao-study-github/styles.css:346-430`

- [ ] **Step 1: 把完整单卦说明包装成一个内容组**

在 `render0718Palace()` 的详情分支中使用完整包装，不改变组内文字顺序：

```js
meta.innerHTML=`
  <div class="scroll-detail-content">
    <span class="scroll-detail-kicker">单卦取象 · ${palaceKey}宫 · ${stage}</span>
    ${hexagramDetailMarkup(h[0])}
    <h3>${h[0]}</h3>
    <strong>${h[2]}</strong>
    <div class="scroll-detail-block"><b>意象提示</b><p>${h[3]}</p></div>
    <em>${palaceKey}宫 · 宫五行${palace.element} · 第${String(activeIndex+1).padStart(2,"0")}卦</em>
  </div>`;
```

- [ ] **Step 2: 用同一内容高度和负向位移实现上下等量留白**

```css
.scroll-palace-meta.is-hexagram-detail{
  --detail-gutter:28px;
  --detail-shift:22px;
  overflow:hidden;
}
.scroll-detail-content{
  width:100%;
  height:calc(100% - (var(--detail-gutter) * 2));
  margin-block:var(--detail-gutter);
  display:flex;
  flex-direction:column;
  transform:translateY(calc(var(--detail-shift) * -1));
}
.scroll-detail-content em{
  margin-top:auto;
}
@media(max-width:1080px){
  .scroll-palace-meta.is-hexagram-detail{
    min-height:610px;
    height:610px;
    max-height:610px;
  }
}
@media(max-width:760px){
  .scroll-palace-meta.is-hexagram-detail{
    --detail-gutter:24px;
    --detail-shift:18px;
    min-height:650px;
    height:650px;
    max-height:650px;
  }
}
```

- [ ] **Step 3: 运行单项测试**

Run:

```bash
node --test --test-name-pattern="single-hexagram" tests/course-0725-layout.test.mjs
```

Expected: PASS。

- [ ] **Step 4: 提交单卦布局**

```bash
git add liuyao-study-github/app.js liuyao-study-github/styles.css
git commit -m "fix: balance hexagram detail spacing"
```

### Task 3: 将六亲生克重绘为双环图

**Files:**
- Modify: `liuyao-study-github/app.js:1087-1094`
- Modify: `liuyao-study-github/styles.css:447-456`

- [ ] **Step 1: 用 SVG 生成相生外环与相克内星**

新增 `relativeCycleDiagram()`，复用课程中五类六亲数据：

```js
function relativeCycleDiagram(){
  const nodes=[
    ["父母",200,52],["兄弟",332,148],["子孙",282,304],
    ["妻财",118,304],["官鬼",68,148]
  ];
  const sheng=[[0,1],[1,2],[2,3],[3,4],[4,0]];
  const ke=[[0,2],[2,4],[4,1],[1,3],[3,0]];
  const line=(pair,tone)=>{
    const [a,b]=pair.map(index=>nodes[index]);
    return `<line class="relative-cycle-edge ${tone}" x1="${a[1]}" y1="${a[2]}" x2="${b[1]}" y2="${b[2]}"/>`;
  };
  return `<svg class="relative-cycle-svg" viewBox="0 0 400 360"
    role="img" aria-label="六亲相生相克双环图">
    <defs>
      <marker id="relativeShengArrow" viewBox="0 0 10 10" refX="8" refY="5"
        markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z"/></marker>
      <marker id="relativeKeArrow" viewBox="0 0 10 10" refX="8" refY="5"
        markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z"/></marker>
    </defs>
    ${sheng.map(pair=>line(pair,"sheng")).join("")}
    ${ke.map(pair=>line(pair,"ke")).join("")}
    ${nodes.map(([name,x,y])=>`<g class="relative-cycle-node" transform="translate(${x} ${y})">
      <circle r="34"/><text y="5">${name}</text>
    </g>`).join("")}
    <g class="relative-cycle-legend" transform="translate(200 180)">
      <text y="-8">外环相生</text><text y="15">内星相克</text>
    </g>
  </svg>`;
}
```

- [ ] **Step 2: 替换旧的两列文字闭环渲染**

```js
document.querySelector("#relative0725Cycles").innerHTML=`
  <div class="relative-cycle-figure">
    ${relativeCycleDiagram()}
    <p><i class="sheng"></i>相生：顺箭头流转　<i class="ke"></i>相克：沿内星制约</p>
  </div>`;
```

- [ ] **Step 3: 添加图形与移动端样式**

```css
.relative-cycle-board{display:block}
.relative-cycle-figure{max-width:720px;margin:auto;padding:26px;border:1px solid var(--line);background:rgba(255,255,255,.46)}
.relative-cycle-svg{display:block;width:min(100%,560px);height:auto;margin:auto;overflow:visible}
.relative-cycle-edge{fill:none;stroke-width:3}
.relative-cycle-edge.sheng{stroke:var(--wood);marker-end:url(#relativeShengArrow)}
.relative-cycle-edge.ke{stroke:var(--red);marker-end:url(#relativeKeArrow)}
.relative-cycle-node circle{fill:var(--ink);stroke:#e6dbcc;stroke-width:2}
.relative-cycle-node text{fill:var(--paper);font:800 17px "Songti SC";text-anchor:middle}
.relative-cycle-legend text{text-anchor:middle;fill:var(--muted);font-size:11px}
.relative-cycle-figure>p{text-align:center;color:var(--muted);font-size:12px}
```

- [ ] **Step 4: 运行图形回归测试**

Run:

```bash
node --test --test-name-pattern="double-cycle" tests/course-0725-layout.test.mjs
```

Expected: PASS。

- [ ] **Step 5: 提交双环图**

```bash
git add liuyao-study-github/app.js liuyao-study-github/styles.css
git commit -m "feat: visualize six-relative cycles"
```

### Task 4: 对齐父母官鬼卡片与判断边界

**Files:**
- Modify: `liuyao-study-github/app.js:1095-1110`
- Modify: `liuyao-study-github/styles.css:452-456`

- [ ] **Step 1: 为卡片增加稳定的主体和边界区域**

```js
document.querySelector("#relative0725Focus").innerHTML=course0725.focusRelatives.map(item=>`
  <article>
    <header><span>${item.relation}</span><h3>${item.name}爻</h3><strong>${item.tone}</strong></header>
    <div class="relative-card-body">
      <div class="relative-layers">
        <section><b>人物</b><p>${item.people.join(" · ")}</p></section>
        <section><b>事物</b><p>${item.things.join(" · ")}</p></section>
        <section><b>状态</b><p>${item.states.join(" · ")}</p></section>
      </div>
    </div>
    <footer class="relative-card-boundary"><b>使用边界</b><p>${item.boundary}</p></footer>
  </article>`).join("");
```

- [ ] **Step 2: 统一卡片行轨和列宽**

```css
.relative-focus-grid{align-items:stretch}
.relative-focus-grid>article{
  display:grid;
  grid-template-rows:auto 1fr minmax(128px,auto);
}
.relative-card-body{display:grid}
.relative-layers{height:100%;grid-template-columns:repeat(3,minmax(0,1fr))}
.relative-layers section{display:grid;grid-template-rows:auto 1fr}
.relative-card-boundary{display:grid;grid-template-columns:88px 1fr;align-items:start;gap:16px}
.relative-card-boundary p{margin:0}
@media(max-width:760px){
  .relative-focus-grid>article{grid-template-rows:auto auto auto}
  .relative-card-boundary{grid-template-columns:72px 1fr}
}
```

- [ ] **Step 3: 给判断边界增加语义类并统一基线**

修改 `index.html`：

```html
<section class="section-block judgment-boundary">
  <div class="judgment-boundary__title">
    <span>判断边界</span><h2>没有脱离占问的固定吉凶</h2>
  </div>
  <div class="judgment-boundary__rules">
    <ul id="judgment0725Rules"></ul>
  </div>
  <p class="judgment-boundary__next" id="next0725Lesson"></p>
</section>
```

添加样式：

```css
.judgment-boundary{align-items:start}
.judgment-boundary__title,.judgment-boundary__rules{min-width:0}
.judgment-boundary__rules ul{margin:0;padding-left:1.35em}
.judgment-boundary__rules li{padding-left:.35em}
.judgment-boundary__next{grid-column:1/-1}
```

- [ ] **Step 4: 更新 CSS 缓存版本**

将 `index.html` 中样式版本更新为：

```html
<link rel="stylesheet" href="./styles.css?v=20260727-layout-refine-v2">
```

- [ ] **Step 5: 运行对齐回归测试**

Run:

```bash
node --test --test-name-pattern="alignment" tests/course-0725-layout.test.mjs
```

Expected: PASS。

- [ ] **Step 6: 提交对齐修正**

```bash
git add liuyao-study-github/app.js liuyao-study-github/index.html liuyao-study-github/styles.css
git commit -m "fix: align relative cards and judgment boundary"
```

### Task 5: 把装卦和六亲标为已学习

**Files:**
- Modify: `liuyao-study-github/training-bank.js:4-25`
- Modify: `liuyao-study-github/app.js:529-534`
- Modify: `liuyao-study-github/styles.css:357-369`

- [ ] **Step 1: 为路线步骤增加独立进度字段**

```js
{n:"03",title:"浑天甲子",progress:"learned",state:"课堂原理 + 古籍校注",
 detail:"课堂已讲内外卦固定装支原理；完整逐爻表仍作古籍校注。"},
{n:"04",title:"六亲",progress:"learned",state:"陈师讲至父母、官鬼",
 detail:"六亲生克链已讲；父母、官鬼已展开，子孙、妻财、兄弟待续。"},
{n:"05",title:"世应",progress:"learned",state:"陈师已讲",
 detail:"世为求测者，应为所测或对方；应与世中间隔两爻。"},
```

其余仍待后续学习的步骤使用 `progress:"preview"`；已讲八宫步骤使用 `progress:"learned"`。

- [ ] **Step 2: 按进度字段渲染，而不是按完整文案匹配**

```js
roadmap.innerHTML=classics.roadmap.map((step,index)=>`
  <article class="${step.progress==="learned"?"taught":"preview"}"
    style="--roadmap-index:${index}">
    <small>${step.n}</small><span>${step.state}</span>
    <h3>${step.title}</h3><p>${step.detail}</p>
  </article>`).join("");
```

- [ ] **Step 3: 让已学习连接线覆盖相应节点**

```css
.classics-roadmap::after{
  background:linear-gradient(90deg,#d39b88 0 83.333%,rgba(255,255,255,.18) 83.333% 100%);
}
```

- [ ] **Step 4: 运行路线状态测试**

Run:

```bash
node --test --test-name-pattern="marked learned" tests/course-0725-layout.test.mjs
```

Expected: PASS。

- [ ] **Step 5: 提交路线状态**

```bash
git add liuyao-study-github/training-bank.js liuyao-study-github/app.js liuyao-study-github/styles.css
git commit -m "fix: mark taught assembly topics as learned"
```

### Task 6: 全量验证、同步副本与发布

**Files:**
- Modify: `认知硬核库/六爻/六爻学习网站-副本-20260704课堂核查/app.js`
- Modify: `认知硬核库/六爻/六爻学习网站-副本-20260704课堂核查/index.html`
- Modify: `认知硬核库/六爻/六爻学习网站-副本-20260704课堂核查/styles.css`
- Modify: `认知硬核库/六爻/六爻学习网站-副本-20260704课堂核查/training-bank.js`

- [ ] **Step 1: 运行语法与完整测试**

```bash
node --check liuyao-study-github/app.js
node --check liuyao-study-github/training-bank.js
node --test tests/*.test.mjs
```

Expected: 现有 37 项加新增 4 项，共 41/41 通过。

- [ ] **Step 2: 验证经典版哈希零改动**

```bash
find liuyao-study-github/archive/old-version-20260706 -type f -print0 \
  | sort -z | xargs -0 shasum -a 256 > /tmp/liuyao-classic-after.sha256
diff -u /tmp/liuyao-classic-before.sha256 /tmp/liuyao-classic-after.sha256
```

Expected: `diff` 无输出、退出码 0。

- [ ] **Step 3: 启动本地服务并做真实浏览器回归**

```bash
python3 -m http.server 4173
```

检查视口：

- `1440×1000`：巽宫、兑宫各抽查一长一短说明，详情宽高一致，上下留白视觉相等。
- `768×1024`：单卦内容组不贴底，双环图无裁切。
- `390×844`：父母、官鬼卡片标签列一致，判断边界无错位。
- 默认 URL：经典版不出现 `lecture0725`。
- 新版 URL：`#edition=extended&view=lecture0725` 正常显示全部调整。

- [ ] **Step 4: 同步四个发布文件到 Obsidian 新版副本**

```bash
for file in app.js index.html styles.css training-bank.js; do
  cp "liuyao-study-github/$file" \
    "认知硬核库/六爻/六爻学习网站-副本-20260704课堂核查/$file"
done
```

- [ ] **Step 5: 比较发布源与新版副本**

```bash
for file in app.js index.html styles.css training-bank.js; do
  cmp "liuyao-study-github/$file" \
    "认知硬核库/六爻/六爻学习网站-副本-20260704课堂核查/$file"
done
```

Expected: 四次 `cmp` 均无输出、退出码 0。

- [ ] **Step 6: 提交并推送**

```bash
git add liuyao-study-github tests
git commit -m "fix: refine lecture layouts"
git push origin main
```

- [ ] **Step 7: 发布后检查**

打开：

- 经典版：`https://blackcakebro.github.io/liuyao-study/liuyao-study-github/`
- 新版：`https://blackcakebro.github.io/liuyao-study/liuyao-study-github/#edition=extended&view=lecture0725`

Expected: 新版显示新布局；默认经典版不出现新版导航或页面；题库仍为 341 题。
