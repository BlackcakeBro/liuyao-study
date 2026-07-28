# 装卦六亲与古籍参考重组 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将纳甲、世应与六亲的学习工具及题目归入新版“装卦六亲”课程，把“古籍预习”重构为可溯源的“古籍参考”，并修正判断边界底部文字贴边。

**Architecture:** 保持 `course-0725.js` 为课程事实与古籍展示数据的唯一来源，`training-bank.js` 只据其生成题目并调整模块归属。HTML 仅重排既有交互容器并新增原著／案例容器；`app.js` 将原有古籍预览渲染拆为课程工具渲染和古籍参考渲染。经典版由既有 `data-edition-only` 隔离，受保护目录不改写。

**Tech Stack:** 原生 HTML、CSS、JavaScript、Node.js `node:test`、GitHub Pages。

---

## 文件结构

- `liuyao-study-github/course-0725.js`：新增可追溯的原著索引与原著案例数据；保留课堂知识边界。
- `liuyao-study-github/index.html`：重排新版课程／古籍参考的容器、标题和缓存版本号。
- `liuyao-study-github/app.js`：渲染已迁入课程页的纳甲／世应工具与古籍参考卡片。
- `liuyao-study-github/styles.css`：课程工具组、原著参考卡、案例卡以及判断边界的响应式视觉规则。
- `liuyao-study-github/training-bank.js`：更新“古籍参考”模块命名，并把纳甲、世应、六亲题目归入 `lecture0725`，总题数保持 341。
- `tests/classics-reference-boundary.test.mjs`：锁定 DOM 归属、来源字段、训练模块归属、经典版隔离和判断边界内边距。
- `tests/classics-training-update.test.mjs`：更新新版命名与不再出现旧“古籍预习”学习面板的断言。
- `tests/training-bank.test.mjs`：更新模块题数契约，保持题库总数与唯一 ID。
- `认知硬核库/六爻/资料处理/ancient-ocr-1-24.txt`：仅作本地原著出处核对，不写入、不发布。
- `认知硬核库/六爻/六爻学习网站-副本-20260704课堂核查/`：最终同步的新版 Obsidian 副本。
- `liuyao-study-20260718/`：仓库内受保护的经典版树，只做哈希核验。

### Task 1: 先锁定迁移与边界的失败契约

**Files:**
- Create: `tests/classics-reference-boundary.test.mjs`
- Modify: `tests/classics-training-update.test.mjs`
- Modify: `tests/training-bank.test.mjs`
- Read: `liuyao-study-github/index.html`
- Read: `liuyao-study-github/app.js`
- Read: `liuyao-study-github/styles.css`
- Read: `liuyao-study-github/course-0725.js`
- Read: `liuyao-study-github/training-bank.js`

- [ ] **Step 1: 写入新的页面、来源和内边距回归测试**

```js
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const html=fs.readFileSync("liuyao-study-github/index.html","utf8");
const css=fs.readFileSync("liuyao-study-github/styles.css","utf8");
const app=fs.readFileSync("liuyao-study-github/app.js","utf8");
const source=["data.js","course-0718.js","course-0725.js","training-bank.js"]
  .map(file=>fs.readFileSync(`liuyao-study-github/${file}`,"utf8")).join("\n")+
  "\n;globalThis.__training=window.LIUYAO_TRAINING;globalThis.__course=course0725;";
const sandbox={window:{}};
vm.runInNewContext(source,sandbox);

const sectionAt=id=>html.indexOf(`id="${id}"`);

test("taught na-jia, shi-ying and six-relative tools live in the 07-25 course",()=>{
  assert.ok(sectionAt("lecture0725")>=0);
  assert.ok(sectionAt("najiaTrigramPicker")>sectionAt("lecture0725"));
  assert.ok(sectionAt("shiYingStages")>sectionAt("lecture0725"));
  assert.ok(sectionAt("relativeCards")>sectionAt("lecture0725"));
  assert.ok(sectionAt("najiaTrigramPicker")<sectionAt("casting"));
  assert.ok(sectionAt("shiYingStages")<sectionAt("casting"));
  assert.ok(sectionAt("relativeCards")<sectionAt("casting"));
});

test("extended classics reference retains casting but renders sourced references and cases",()=>{
  assert.match(html,/古籍参考/);
  assert.match(html,/id="classicsReferenceCards"/);
  assert.match(html,/id="classicsCaseCards"/);
  assert.match(html,/id="tossCoins"/);
  assert.equal(sandbox.__course.classicsReferences.length,4);
  assert.ok(sandbox.__course.classicsReferences.every(item=>item.book&&item.location&&item.purpose));
  assert.equal(sandbox.__course.classicsCases.length,2);
  assert.ok(sandbox.__course.classicsCases.every(item=>item.book&&item.location&&item.excerpt&&item.boundary));
  assert.match(app,/function renderClassicsReference\(/);
});

test("judgment boundary owns responsive horizontal padding for every content row",()=>{
  assert.match(css,/\.judgment-boundary\{[^}]*padding(?:-inline)?\s*:\s*clamp\(/s);
  assert.match(css,/\.judgment-boundary__next\{[^}]*border-top:/s);
  assert.match(css,/@media\(max-width:760px\)\{[^}]*\.judgment-boundary\{[^}]*grid-template-columns:minmax\(0,1fr\)/s);
});

test("training names classics as a reference and moves taught structures to lecture0725",()=>{
  const modules=Object.fromEntries(sandbox.__training.modules.map(item=>[item.id,item.label]));
  assert.equal(modules.classics,"古籍参考");
  const taughtKinds=new Set(["najia","shi-ying","six-relative"]);
  const taught=sandbox.__training.bank.filter(item=>taughtKinds.has(item.kind));
  assert.ok(taught.every(item=>item.module==="lecture0725"||item.module==="foundation"));
  assert.equal(sandbox.__training.bank.length,341);
});
```

- [ ] **Step 2: 将既有断言改为新命名与新模块题数**

在 `tests/classics-training-update.test.mjs` 的第一项测试中删除对旧标题、旧“古籍预习”文本和旧页面内纳甲／世应标题的断言，改为：

```js
assert.match(html,/古籍参考/);
assert.match(html,/原著参考/);
assert.match(html,/原著案例研读/);
assert.match(html,/模拟起卦/);
assert.match(app,/renderAssemblyLearningTools/);
assert.match(app,/renderClassicsReference/);
```

在 `tests/training-bank.test.mjs` 的模块计数断言中替换为：

```js
assert.deepEqual(counts,{
  foundation:73,
  lecture0704:54,
  lecture0718:148,
  lecture0725:55,
  classics:11
});
assert.equal(training.bank.length,341);
```

并在该文件末尾新增：

```js
test("taught assembly questions stay in the 07-25 module while later ancient reference remains separate",()=>{
  const taughtKinds=new Set(["najia","shi-ying","six-relative"]);
  const taught=training.bank.filter(question=>taughtKinds.has(question.kind));
  assert.ok(taught.every(question=>question.module==="lecture0725"||question.module==="foundation"));
  assert.ok(training.bank.filter(question=>question.module==="classics").every(question=>
    ["yongshen","role"].includes(question.kind)
  ));
});
```

- [ ] **Step 3: 运行测试，确认它们因旧页面结构与旧数据失败**

Run:

```bash
node --test tests/classics-reference-boundary.test.mjs tests/classics-training-update.test.mjs tests/training-bank.test.mjs
```

Expected: `classics-reference-boundary` 因容器、数据字段、渲染函数和 `.judgment-boundary` 内边距尚不存在而失败；既有两份测试因旧模块计数／旧标题而失败；不得出现 Node 语法或路径错误。

- [ ] **Step 4: 记录经典版哈希基线并提交测试**

```bash
classic_root="liuyao-study-20260718"
find "$classic_root" -type f -print0 | sort -z | xargs -0 shasum -a 256 > /tmp/liuyao-classic-before.sha256
wc -l /tmp/liuyao-classic-before.sha256
git add tests/classics-reference-boundary.test.mjs tests/classics-training-update.test.mjs tests/training-bank.test.mjs
git commit -m "test: lock classics reference boundary"
```

Expected: 哈希文件非空；测试提交独立于实现提交。

### Task 2: 给课程数据加入可追溯的原著索引与案例

**Files:**
- Modify: `liuyao-study-github/course-0725.js:1-52`
- Read: `认知硬核库/六爻/资料处理/ancient-ocr-1-24.txt:899-930`
- Read: `认知硬核库/六爻/资料处理/ancient-ocr-1-24.txt:422-456`
- Read: `认知硬核库/六爻/资料处理/ancient-ocr-1-24.txt:835-899`
- Test: `tests/classics-reference-boundary.test.mjs`

- [ ] **Step 1: 将四个原著索引和两个原著案例写入 `course0725`**

在 `nextLesson` 后增加逗号及以下字段；文案中的“OCR 第 N 页”是本地核查文件的页码，不显示为课堂来源：

```js
  classicsReferences: [
    {book:"《增删卜易》",location:"卷一·浑天甲子章",purpose:"核对八经卦内外卦由下向上的固定装支次序。",note:"作为课堂装支原理的原著索引，不另设预习课。"},
    {book:"《增删卜易》",location:"卷一·六亲歌章",purpose:"回查以卦宫五行为中心推六亲的原著章节。",note:"课堂先掌握生克关系；具体取象仍须回到占问。"},
    {book:"《增删卜易》",location:"卷一·世应章",purpose:"回查八宫序位与世应落爻的原著章节。",note:"世应先用于分辨求测者与所测对象，不直接判吉凶。"},
    {book:"《增删卜易》",location:"卷一·用神章及用神、元神、忌神、仇神章",purpose:"为后续取用、旺衰与动变提供原著检索入口。",note:"该部分属于后续参考，等待课程继续展开。"}
  ],
  classicsCases: [
    {title:"父母病：先随占问确定观察对象",book:"《增删卜易》",location:"卷一·占卦法章（本地 OCR 第10页）",excerpt:"占父母病，以父母爻为用神。",focus:"原文以“占父母病”说明：同为父母爻，先由所问之事确定其观察位置。",boundary:"这里只读原著的取用思路；旺衰、空破、动变等完整判断不在本课提前下结论。"},
    {title:"防灾虑患：官鬼不能脱离问题定性",book:"《增删卜易》",location:"卷一·赛锦囊秘法（本地 OCR 第22页）",excerpt:"若得官鬼持世，忧疑不解，加意防止。惟陈言谏诤者，又当别论。",focus:"同一官鬼在不同占问中需随问题转换解释，原文自身也保留例外情境。",boundary:"案例用于印证“没有固定吉凶”的学习边界，不替代具体占断。"}
  ]
```

- [ ] **Step 2: 运行来源字段与课程边界测试**

Run:

```bash
node --test --test-name-pattern="extended classics reference" tests/classics-reference-boundary.test.mjs
node --test tests/course-0725-update.test.mjs
```

Expected: 新测试仍因 HTML／渲染函数未完成而失败；原有 `course-0725-update` 通过，证明父母、官鬼和后续三亲边界未被改写。

- [ ] **Step 3: 提交来源数据**

```bash
git add liuyao-study-github/course-0725.js
git commit -m "data: add sourced classics references"
```

### Task 3: 重排新版课程与古籍参考的 DOM，保持经典版不变

**Files:**
- Modify: `liuyao-study-github/index.html:395-541,609-615`
- Test: `tests/classics-reference-boundary.test.mjs`
- Test: `tests/classics-training-update.test.mjs`

- [ ] **Step 1: 将纳甲、世应实验室和六亲总览移到 `#lecture0725`**

把课程页的四个主段改为以下顺序和容器；保留 `assembly0725Grid`、`shiying0725Roles`、`relative0725Cycles`、`relative0725Focus` 与 `judgment0725Rules` 的既有 id：

```html
<section class="section-block course-tool-section" id="courseNajia">
  <div class="section-heading"><div><span class="section-index">02</span><h2>纳甲装支：内外卦依次落位</h2></div><p>先分内卦、外卦，再由下向上装入六个爻位；实占可由软件排盘，理解顺序不能省略。</p></div>
  <div class="najia-lab"><div class="najia-trigram-picker" id="najiaTrigramPicker"></div><div class="najia-detail" id="najiaDetail"></div></div>
</section>
<section class="section-block course-shiying-section" id="courseShiYing">
  <div class="section-heading"><div><span class="section-index">03</span><h2>世应：先分“我”与“所测”</h2></div><p>世应先确定观察角色；应爻与世爻相差三位，中间隔两爻。</p></div>
  <div class="shiying-role-board" id="shiying0725Roles"></div>
  <div class="shiying-lab"><div class="shiying-stages" id="shiYingStages"></div><div class="shiying-detail" id="shiYingDetail"></div></div>
</section>
<section class="section-block cycle-section">
  <div class="section-heading"><div><span class="section-index">04</span><h2>六亲生克：必须熟记的两条链</h2></div><p>先记完整闭环，再把关系翻译回具体占问的人、事与状态。</p></div>
  <div class="relative-cycle-board" id="relative0725Cycles"></div>
  <div class="relative-cards course-relative-cards" id="relativeCards"></div>
</section>
<section class="section-block"><div class="section-heading"><div><span class="section-index">05</span><h2>父母爻与官鬼爻：三层取象</h2></div><p>人物、事物、状态可以并存；子孙、妻财、兄弟留待后续课堂。</p></div><div class="relative-focus-grid" id="relative0725Focus"></div></section>
```

保留原有 `01` 装卦三步与末尾判断边界。删除 `#casting` 内新版的 `classics-learning-map`、`#classicsNajia`、旧 `#classicsShiYing` 和旧 `#relativeCards` 容器；不得删除经典版 `data-edition-only="classic"` 的起卦路线图与说明。

- [ ] **Step 2: 将新版 `#casting` 改成古籍参考的三个职责区**

用以下新版 intro 替换 `classics-current-intro` 的标题与说明：

```html
<div class="page-intro classics-current-intro" data-edition-only="extended">
  <span class="eyebrow">SOURCE TEXT · CASE STUDY · CASTING PRACTICE</span>
  <h1>古籍参考</h1>
  <p>模拟起卦用于巩固爻序与动变；其余内容只提供与课程相关的原著出处和案例研读，不另设纳甲、六亲、世应预习课。</p>
</div>
```

在 `casting-workbench` 后、`yongshen-section` 前插入：

```html
<section class="section-block classics-reference-section" data-edition-only="extended">
  <div class="section-heading"><div><span class="section-index">02</span><h2>原著参考</h2></div><p>每一项标出书名与卷章，作为课程学习后的回查入口，而不是第二套课堂。</p></div>
  <div class="classics-reference-cards" id="classicsReferenceCards"></div>
</section>
<section class="section-block classics-case-section" data-edition-only="extended">
  <div class="section-heading"><div><span class="section-index">03</span><h2>原著案例研读</h2></div><p>从原著的具体占问情境回看课程边界；只展示可定位出处的材料。</p></div>
  <div class="classics-case-cards" id="classicsCaseCards"></div>
</section>
```

将新版取用神段的序号改为 `04`，标题改为“后续参考：取用神”，并把末尾提示改为“古籍参考边界”。

- [ ] **Step 3: 更新所有受影响的资源版本**

将 `styles.css`、`course-0725.js`、`training-bank.js`、`app.js` 的查询参数统一换为 `20260728-classics-reference-v7`，例如：

```html
<link rel="stylesheet" href="./styles.css?v=20260728-classics-reference-v7">
<script src="./course-0725.js?v=20260728-classics-reference-v7"></script>
<script src="./training-bank.js?v=20260728-classics-reference-v7"></script>
<script src="./app.js?v=20260728-classics-reference-v7"></script>
```

`data.js` 与 `course-0718.js` 未改动，保留其现有版本号。

- [ ] **Step 4: 运行 DOM 结构测试并提交**

Run:

```bash
node --test tests/classics-reference-boundary.test.mjs tests/classics-training-update.test.mjs
```

Expected: 页面结构、新命名、资源加载顺序和课程／古籍归属断言通过；尚未渲染的古籍卡片或 CSS 相关断言可在下一任务完成。

```bash
git add liuyao-study-github/index.html
git commit -m "feat: move taught assembly tools into course"
```

### Task 4: 拆分渲染职责并移动题目模块归属

**Files:**
- Modify: `liuyao-study-github/app.js:488-573,1182`
- Modify: `liuyao-study-github/training-bank.js:5-25,168-182`
- Test: `tests/classics-reference-boundary.test.mjs`
- Test: `tests/training-bank.test.mjs`

- [ ] **Step 1: 把课程工具渲染从古籍预览中拆出**

将 `renderClassicsPreview` 重命名为 `renderAssemblyLearningTools`，删除其 `#classicsRoadmap` 与 `#classicsRoleChain` 渲染分支，保留并使用以下开头：

```js
function renderAssemblyLearningTools(){
  if(!extendedEdition||!courseTraining?.classics)return;
  const classics=courseTraining.classics;
  const picker=document.querySelector("#najiaTrigramPicker");
  const detail=document.querySelector("#najiaDetail");
```

保留现有 `showNajia` 与 `showStage` 函数内容，确保选择器仍只查询 `#najiaTrigramPicker`、`#najiaDetail`、`#shiYingStages`、`#shiYingDetail`。在入口初始化序列中将：

```js
renderClassicsPreview();
```

替换为：

```js
renderAssemblyLearningTools();
renderClassicsReference();
```

- [ ] **Step 2: 新增古籍索引与案例卡片渲染函数**

在 `renderAssemblyLearningTools` 后添加：

```js
function renderClassicsReference(){
  if(!extendedEdition||typeof course0725==="undefined")return;
  const references=document.querySelector("#classicsReferenceCards");
  if(references)references.innerHTML=course0725.classicsReferences.map((item,index)=>`
    <article><small>${String(index+1).padStart(2,"0")}</small><span>${item.book}</span>
      <h3>${item.location}</h3><p>${item.purpose}</p><footer>${item.note}</footer>
    </article>`).join("");
  const cases=document.querySelector("#classicsCaseCards");
  if(cases)cases.innerHTML=course0725.classicsCases.map((item,index)=>`
    <article><header><small>CASE ${String(index+1).padStart(2,"0")}</small><span>${item.book}</span><h3>${item.title}</h3><p>${item.location}</p></header>
      <blockquote>${item.excerpt}</blockquote><div><b>课程观察</b><p>${item.focus}</p></div>
      <footer><b>使用边界</b><p>${item.boundary}</p></footer>
    </article>`).join("");
}
```

- [ ] **Step 3: 保留题目 id，改变纳甲、世应、六亲题目的模块归属**

在 `training-bank.js`：

1. 将模块定义替换为 `{id:"classics",label:"古籍参考",short:"古籍"}`。
2. 将 16 条 `classics-najia-*`、8 条 `classics-shiying-*` 和 5 条 `classics-relative-*` 的 `module:"classics"` 全部改为 `module:"lecture0725"`，保持原 id 不变以保留本地学习记录。
3. 将三类题目的反馈中的“古籍校注”替换为“原著参考”，并保留其 `source:"《增删卜易》卷一 · …"` 字段。
4. 保留 `classics-yongshen-*` 与 `classics-role-*` 在 `classics` 模块，作为后续原著参考。

- [ ] **Step 4: 运行渲染、数据和题库测试**

Run:

```bash
node --check liuyao-study-github/app.js
node --check liuyao-study-github/course-0725.js
node --check liuyao-study-github/training-bank.js
node --test tests/classics-reference-boundary.test.mjs tests/training-bank.test.mjs tests/course-0725-update.test.mjs
```

Expected: 三个语法检查无输出且退出码为 0；测试显示 341 题不变、`lecture0725:55`、`classics:11`、每个古籍条目来源完整。

- [ ] **Step 5: 提交渲染与题库归属**

```bash
git add liuyao-study-github/app.js liuyao-study-github/training-bank.js
git commit -m "feat: separate classics reference from course tools"
```

### Task 5: 完成视觉层与响应式判断边界修复

**Files:**
- Modify: `liuyao-study-github/styles.css:364-373,461-464`
- Test: `tests/classics-reference-boundary.test.mjs`

- [ ] **Step 1: 让课程工具、六亲总览和原著卡有清晰的版式边界**

在现有 `.najia-lab`、`.shiying-lab` 和 `.relative-cards` 规则之后增加：

```css
.course-tool-section,.course-shiying-section{position:relative}
.course-shiying-section .shiying-role-board{margin-bottom:18px}
.course-relative-cards{margin-top:18px}
.classics-reference-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.classics-reference-cards article{min-width:0;padding:26px;border:1px solid var(--line);background:rgba(255,255,255,.34)}
.classics-reference-cards small,.classics-case-cards small{color:var(--red);font-weight:800;letter-spacing:.12em}
.classics-reference-cards span{display:block;margin-top:18px;color:var(--muted);font-size:12px}
.classics-reference-cards h3{margin:8px 0 10px;font-size:25px}
.classics-reference-cards p{margin:0;line-height:1.75}
.classics-reference-cards footer{margin-top:18px;padding-top:14px;border-top:1px solid var(--line);color:var(--muted);font-size:12px;line-height:1.7}
.classics-case-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
.classics-case-cards article{min-width:0;border:1px solid var(--line);background:rgba(255,255,255,.35);box-shadow:var(--shadow)}
.classics-case-cards header,.classics-case-cards>article>div,.classics-case-cards footer{padding:24px}
.classics-case-cards header{background:linear-gradient(135deg,rgba(45,37,28,.96),rgba(82,64,43,.94));color:var(--paper)}
.classics-case-cards header span{display:block;margin-top:14px;color:#d9a48f;font-size:12px}
.classics-case-cards h3{margin:7px 0;font-size:28px}
.classics-case-cards header p{margin:0;color:#d6cbbb;font-size:12px}
.classics-case-cards blockquote{margin:0;padding:24px;border-bottom:1px solid var(--line);font:700 22px/1.65 "Songti SC";color:var(--ink)}
.classics-case-cards>article>div b,.classics-case-cards footer b{color:var(--red);font-size:12px}
.classics-case-cards>article>div p,.classics-case-cards footer p{margin:8px 0 0;line-height:1.75}
.classics-case-cards footer{border-top:1px solid var(--line);background:rgba(159,59,45,.06)}
```

- [ ] **Step 2: 为判断边界加入统一内嵌内容线**

将基础 `.judgment-boundary` 规则改为：

```css
.judgment-boundary{display:grid;grid-template-columns:minmax(220px,.8fr) minmax(0,1.2fr);grid-template-areas:"title rules" "next next";align-items:start;gap:22px 48px;padding:clamp(28px,4vw,56px);background:linear-gradient(120deg,#29231c,#4c3b2b);color:var(--paper)}
```

保留 `.judgment-boundary__next` 的 `grid-area:next`、`padding-top:20px` 和 `border-top`，不得另设负外边距或 `translate`。这样标题、规则、底部后续课堂文字和分隔线都与同一左右内边距对齐。

- [ ] **Step 3: 补齐平板与手机单列卡片规则**

在已有 `@media(max-width:1100px)` 块加入：

```css
.classics-reference-cards,.classics-case-cards{grid-template-columns:1fr}
```

在已有 `@media(max-width:760px)` 块加入：

```css
.judgment-boundary{padding:28px 22px}
.classics-reference-cards article,.classics-case-cards header,.classics-case-cards>article>div,.classics-case-cards footer{padding:20px}
.classics-case-cards blockquote{padding:20px;font-size:19px}
```

- [ ] **Step 4: 运行视觉契约测试并提交**

Run:

```bash
node --test tests/classics-reference-boundary.test.mjs tests/course-0725-layout.test.mjs
```

Expected: 判断边界有响应式内边距；原有六亲双环和父母／官鬼卡片断言仍通过。

```bash
git add liuyao-study-github/styles.css
git commit -m "fix: align judgment boundary and classics reference"
```

### Task 6: 全量验证、同步新版副本、发布与保护核验

**Files:**
- Modify: `认知硬核库/六爻/六爻学习网站-副本-20260704课堂核查/index.html`
- Modify: `认知硬核库/六爻/六爻学习网站-副本-20260704课堂核查/styles.css`
- Modify: `认知硬核库/六爻/六爻学习网站-副本-20260704课堂核查/app.js`
- Modify: `认知硬核库/六爻/六爻学习网站-副本-20260704课堂核查/course-0725.js`
- Modify: `认知硬核库/六爻/六爻学习网站-副本-20260704课堂核查/training-bank.js`
- Read: `/tmp/liuyao-classic-before.sha256`

- [ ] **Step 1: 运行完整静态与数据回归套件**

```bash
node --check liuyao-study-github/app.js
node --check liuyao-study-github/course-0725.js
node --check liuyao-study-github/training-bank.js
node --test tests/*.test.mjs
```

Expected: 现有与新增测试全部通过；总题数仍为 341。

- [ ] **Step 2: 在三个视口进行真实浏览器验证**

启动本地静态服务：

```bash
python3 -m http.server 4173 --directory liuyao-study-github
```

在浏览器的新版路径分别检查 `1440×1000`、`1024×900`、`390×844`：

1. `lecture0725` 的顺序是装卦三步、纳甲、世应、六亲、父母／官鬼、判断边界；三个迁入工具可点击更新。
2. 判断边界的“后续课堂”文本和分隔线都在面板内侧，未贴左边框或溢出。
3. `casting` 标题为“古籍参考”，模拟起卦仍可投掷／清空，原著索引和两个案例均带书名与位置；取用神标为后续参考。
4. 切换为默认经典版，确认经典版的 `casting` 页面和起卦流程未变。

停止服务后继续。

- [ ] **Step 3: 同步允许修改的新版源文件到 Obsidian 副本**

```bash
vault_root="/Users/hanyuxuan/ObsidianVaults/HYX"
replica="$vault_root/认知硬核库/六爻/六爻学习网站-副本-20260704课堂核查"
for file in index.html styles.css app.js course-0725.js training-bank.js; do
  cmp -s "liuyao-study-github/$file" "$replica/$file" || cp "liuyao-study-github/$file" "$replica/$file"
done
for file in index.html styles.css app.js course-0725.js training-bank.js; do
  cmp -s "liuyao-study-github/$file" "$replica/$file"
done
```

Expected: 五个新版副本文件与发布源逐字一致；不复制到任何经典版目录。

- [ ] **Step 4: 核验经典版未变、提交并推送**

```bash
find "$classic_root" -type f -print0 | sort -z | xargs -0 shasum -a 256 > /tmp/liuyao-classic-after.sha256
diff -u /tmp/liuyao-classic-before.sha256 /tmp/liuyao-classic-after.sha256
git status --short
git add liuyao-study-github
git commit -m "feat: reorganize classics reference"
git push origin main
```

Expected: 哈希 `diff` 无输出；工作树仅含意图内变更并在最终提交后干净；`git push` 成功。
