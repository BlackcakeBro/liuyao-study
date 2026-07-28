# 单卦卷轴与古籍参考扩展 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 固定新版八宫卷轴的选卦尺寸，只上移左栏说明，并把古籍参考扩展为可核原著学习材料和带卦象的逐案研读。

**Architecture:** `course-0725.js` 保存可定位的原文、案例与明确卦象字段；`app.js` 将这些字段渲染为只读的原著卡和逐案卷轴；`styles.css` 固定单卦详情容器尺寸并让内层内容位移。测试先锁定尺寸、数据完整性和文本边界，再实施最小改动。

**Tech Stack:** 原生 HTML/CSS/JavaScript、Node `node:test`、Playwright（本地 Chrome）。

---

### Task 1: 锁定单卦卷轴尺寸与标题说明对齐

**Files:**
- Modify: `tests/course-0725-layout.test.mjs`
- Modify: `tests/site-editions-and-hexagram-name.test.mjs`
- Modify: `liuyao-study-github/styles.css:351-361,378-452`

- [ ] **Step 1: 写失败测试，要求详情态不再扩展父卷轴且标题说明顶对齐。**

  在 `tests/course-0725-layout.test.mjs` 添加：

  ```js
  test("single-hexagram detail keeps the scroll frame fixed and only lifts its inner copy",()=>{
    const detail=declarations(baseRuleMatching(
      ".scroll-palace-meta.is-hexagram-detail",
      body=>/height\s*:\s*490px/.test(body)&&/max-height\s*:\s*490px/.test(body),
      "detail state must preserve the same 490px scroll-frame height"
    ));
    assert.equal(detail.get("height"),"490px");
    assert.equal(detail.get("max-height"),"490px");
    assert.match(
      baseRuleMatching(".scroll-detail-content",body=>/translate:\s*0\s*var\(--scroll-detail-lift-y\)/.test(body)),
      /translate:\s*0\s*var\(--scroll-detail-lift-y\)/
    );
  });
  ```

  并在 `tests/site-editions-and-hexagram-name.test.mjs` 添加：

  ```js
  test("atlas heading explanation aligns with the title at its top edge",()=>{
    assert.match(rule(".scroll-atlas-heading"),/align-items:start/);
    assert.match(rule(".scroll-atlas-heading p"),/text-align:right/);
  });
  ```

- [ ] **Step 2: 运行新测试，确认其因当前详情态 `height:auto` 而失败。**

  Run: `node --test tests/course-0725-layout.test.mjs tests/site-editions-and-hexagram-name.test.mjs`

  Expected: `single-hexagram detail keeps the scroll frame fixed...` 失败，提示详情态尚未拥有 `height:490px`。

- [ ] **Step 3: 以最小 CSS 改动固定详情态，只移动内层内容。**

  将详情规则替换为：

  ```css
  .scroll-atlas-heading{align-items:start}
  .scroll-palace-meta.is-hexagram-detail{
    min-height:490px;height:490px;max-height:490px;
    display:grid;align-items:center;
    padding-block:calc(var(--scroll-detail-gutter) - var(--scroll-detail-lift-y)) calc(var(--scroll-detail-gutter) + var(--scroll-detail-lift-y));
  }
  .scroll-detail-content{width:100%;display:flex;flex-direction:column;translate:0 var(--scroll-detail-lift-y)}
  ```

  在既有 1080px 与 760px 媒体查询中保持 `height:auto;max-height:none`，使窄屏内容可自然换行；不改动 `.scroll-palace-layout`、`.scroll-gua-grid` 的宽高。

- [ ] **Step 4: 运行同一测试，确认通过。**

  Run: `node --test tests/course-0725-layout.test.mjs tests/site-editions-and-hexagram-name.test.mjs`

  Expected: 0 failures。

- [ ] **Step 5: 提交。**

  ```bash
  git add liuyao-study-github/styles.css tests/course-0725-layout.test.mjs tests/site-editions-and-hexagram-name.test.mjs
  git commit -m "fix: preserve hexagram scroll frame size"
  ```

### Task 2: 整理可核原著参考与完整案例数据

**Files:**
- Read: `/Users/hanyuxuan/ObsidianVaults/HYX/认知硬核库/六爻/资料处理/ancient-ocr-1-24.txt`
- Modify: `liuyao-study-github/course-0725.js`
- Modify: `tests/classics-reference-boundary.test.mjs`

- [ ] **Step 1: 写失败测试，要求原著参考和案例字段完整且不含课程排期文字。**

  在 `tests/classics-reference-boundary.test.mjs` 添加：

  ```js
  test("classics materials provide readable excerpts and diagram-ready complete cases",()=>{
    assert.ok(sandbox.__course.classicsReferences.every(item=>item.excerpt&&item.keywords&&item.connection));
    assert.ok(sandbox.__course.classicsReferences.every(item=>!/(预习|后续课堂|等待课程)/.test(JSON.stringify(item))));
    assert.ok(sandbox.__course.classicsCases.length>=4&&sandbox.__course.classicsCases.length<=6);
    assert.ok(sandbox.__course.classicsCases.every(item=>
      item.sourceText&&item.hexagram&&item.hexagram.name&&item.hexagram.lines?.length===6&&
      Number.isInteger(item.hexagram.shi)&&Number.isInteger(item.hexagram.ying)
    ));
  });
  ```

- [ ] **Step 2: 运行测试，确认因现有参考缺少 `excerpt`、案例仅两则而失败。**

  Run: `node --test tests/classics-reference-boundary.test.mjs`

  Expected: `classics materials provide readable excerpts...` 失败。

- [ ] **Step 3: 从本地 OCR 提取并逐字核对材料，补全数据。**

  对每段保留 `book`、`location`、`sourcePage`、`excerpt`、`keywords`、`connection`；删除 `note` 中的课程排期措辞。将 `classicsCases` 扩展到 4–6 则，只采用能同时核对占问、连续原文和原卦六爻的案例。

  使用以下数据结构：

  ```js
  {
    title:"……", book:"《……》", location:"……", sourcePage:"OCR 第…页",
    question:"……", sourceText:"……",
    hexagram:{name:"……", lines:["yang","yin","…"], shi:2, ying:5, moving:[3]},
    reading:{object:"……", relation:"……", clue:"……"},
    boundary:"……"
  }
  ```

  `lines` 固定为自下而上六项；`shi`、`ying` 使用 1–6 爻位；`moving` 只记录原文明确的动爻。无可核卦象的材料不进入 `classicsCases`。

- [ ] **Step 4: 运行数据测试，确认通过。**

  Run: `node --test tests/classics-reference-boundary.test.mjs`

  Expected: 0 failures。

- [ ] **Step 5: 提交。**

  ```bash
  git add liuyao-study-github/course-0725.js tests/classics-reference-boundary.test.mjs
  git commit -m "data: expand source-backed classics materials"
  ```

### Task 3: 渲染原著学习卡与逐案卦象卷轴

**Files:**
- Modify: `liuyao-study-github/app.js:renderClassicsReference`
- Modify: `liuyao-study-github/styles.css:473-492`
- Modify: `tests/classics-reference-boundary.test.mjs`

- [ ] **Step 1: 写失败测试，要求渲染函数输出完整原文、六爻图和世应标记。**

  在 `tests/classics-reference-boundary.test.mjs` 添加：

  ```js
  test("classics renderer outputs source study layers and six-yao case diagrams",()=>{
    assert.match(app,/classics-reference-excerpt/);
    assert.match(app,/classics-reference-keywords/);
    assert.match(app,/classics-case-hexagram/);
    assert.match(app,/data-yao-role="世"/);
    assert.match(app,/data-yao-role="应"/);
  });
  ```

- [ ] **Step 2: 运行测试，确认现有简略模板不包含这些结构。**

  Run: `node --test tests/classics-reference-boundary.test.mjs`

  Expected: `classics renderer outputs...` 失败。

- [ ] **Step 3: 最小化扩展 `renderClassicsReference()`。**

  新增纯渲染辅助函数：

  ```js
  function classicsCaseHexagramMarkup({name,lines,shi,ying,moving=[]}){
    return `<figure class="classics-case-hexagram" aria-label="${name}原卦，自下而上六爻">${[...lines].reverse().map((line,index)=>{
      const position=6-index;
      const role=position===shi?"世":position===ying?"应":"";
      return `<i class="${line} ${moving.includes(position)?"moving":""}" data-yao-role="${role}"><b>${position}爻</b><span></span><em>${role}</em></i>`;
    }).join("")}<figcaption>${name}</figcaption></figure>`;
  }
  ```

  原著参考依序渲染 `excerpt`、`keywords`、`connection`。案例卡依序渲染 `question`、卦图、`sourceText`、`reading` 和 `boundary`；不再输出任何“预习/后续课堂/课程安排”文案。

- [ ] **Step 4: 增加响应式样式。**

  ```css
  .classics-case-article{display:grid;grid-template-columns:minmax(180px,240px) minmax(0,1fr)}
  .classics-case-hexagram{display:grid;gap:8px}
  .classics-case-hexagram i{display:grid;grid-template-columns:32px 1fr 24px;gap:8px;align-items:center}
  .classics-case-hexagram i.yin span{display:grid;grid-template-columns:1fr 1fr;gap:18px;background:none}
  .classics-case-hexagram i.yin span::before,.classics-case-hexagram i.yin span::after{content:"";height:7px;background:var(--ink)}
  .classics-case-hexagram i.yang span{height:7px;background:var(--ink)}
  @media(max-width:760px){.classics-case-article{grid-template-columns:1fr}}
  ```

- [ ] **Step 5: 运行测试，确认通过。**

  Run: `node --test tests/classics-reference-boundary.test.mjs`

  Expected: 0 failures。

- [ ] **Step 6: 提交。**

  ```bash
  git add liuyao-study-github/app.js liuyao-study-github/styles.css tests/classics-reference-boundary.test.mjs
  git commit -m "feat: render complete classics case studies"
  ```

### Task 4: 全量回归、浏览器尺寸核查、隔离与同步

**Files:**
- Verify: `liuyao-study-github/`
- Verify: `liuyao-study-20260718/`
- Sync: `/Users/hanyuxuan/ObsidianVaults/HYX/认知硬核库/六爻/六爻学习网站-副本-20260704课堂核查/`

- [ ] **Step 1: 执行静态检查和完整测试。**

  Run:

  ```bash
  node --check liuyao-study-github/app.js
  node --check liuyao-study-github/course-0725.js
  node --test tests/*.test.mjs
  ```

  Expected: 所有测试通过，0 failures。

- [ ] **Step 2: 启动本地站点并作浏览器核查。**

  Run: `python3 -m http.server 4173 --directory liuyao-study-github`

  在 1440px、1024px、390px 下打开 `/?v=changsheng-ring-v3#view=lecture0718`。选中至少两个不同卦，记录 `.scroll-palace-meta` 与 `.scroll-gua-grid` 的 `getBoundingClientRect()`；桌面选择前后 `.scroll-palace-meta` 高度必须均为 490px，右侧网格宽高不变。再打开 `#view=casting`，确认原著参考无排期文案、每则案例有六爻图和完整原文、无横向溢出。

- [ ] **Step 3: 核查经典版隔离与保护哈希。**

  默认 URL 打开 `#view=casting`，确认仍为 `classic`、无 `#classicsReferenceCards`、起卦按钮可生成六爻。随后运行：

  ```bash
  find liuyao-study-20260718 -type f -print0 | sort -z | xargs -0 shasum -a 256 > /tmp/liuyao-classic-after.sha256
  diff -u /tmp/liuyao-classic-before.sha256 /tmp/liuyao-classic-after.sha256
  ```

  Expected: `diff` 无输出。

- [ ] **Step 4: 同步副本并逐文件校验。**

  ```bash
  replica='/Users/hanyuxuan/ObsidianVaults/HYX/认知硬核库/六爻/六爻学习网站-副本-20260704课堂核查'
  for file in index.html styles.css app.js course-0725.js training-bank.js; do
    cp "liuyao-study-github/$file" "$replica/$file"
    cmp -s "liuyao-study-github/$file" "$replica/$file"
  done
  ```

- [ ] **Step 5: 提交发布版本并推送。**

  ```bash
  git status --short
  git add liuyao-study-github/index.html liuyao-study-github/styles.css liuyao-study-github/app.js liuyao-study-github/course-0725.js tests
  git commit -m "feat: expand classics reference studies"
  git push origin main
  ```
