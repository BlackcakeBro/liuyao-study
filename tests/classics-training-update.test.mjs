import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const html=fs.readFileSync("liuyao-study-github/index.html","utf8");
const app=fs.readFileSync("liuyao-study-github/app.js","utf8");
const css=fs.readFileSync("liuyao-study-github/styles.css","utf8");

test("extended classics preview advances from the taught eight palaces into na-jia and shi-ying",()=>{
  assert.match(html,/data-edition-only="classic"/);
  assert.match(html,/data-edition-only="extended"/);
  assert.match(html,/古籍预习 · 从八宫进入装卦/);
  assert.match(html,/浑天甲子/);
  assert.match(html,/纳甲装支/);
  assert.match(html,/世应定位/);
  assert.match(html,/陈师已讲/);
  assert.match(html,/古籍预习/);
  assert.match(app,/renderClassicsPreview/);
});

test("classic and extended editions keep separate ancient-preview and training surfaces",()=>{
  assert.match(app,/\[data-edition-only="extended"\]/);
  assert.match(app,/\[data-edition-only="classic"\]/);
  assert.match(html,/id="trainingModuleFilters"/);
  assert.match(html,/id="trainingBankSummary"/);
  assert.match(app,/renderTrainingFilters/);
  assert.match(app,/extendedEdition\s*\?\s*createCourseQuiz/);
});

test("the new audited training-bank asset is loaded before the application",()=>{
  const dataIndex=html.indexOf("data.js");
  const courseIndex=html.indexOf("course-0718.js");
  const bankIndex=html.indexOf("training-bank.js");
  const appIndex=html.indexOf("app.js");
  assert.ok(dataIndex>=0 && courseIndex>dataIndex && bankIndex>courseIndex && appIndex>bankIndex);
});

test("training panels may shrink inside the mobile viewport without forcing page overflow",()=>{
  assert.match(css,/\.training-panel\{[^}]*min-width:0/);
  assert.match(css,/\.quiz-panel\{[^}]*overflow:hidden/);
});

test("training module filters lay out every category without a clipped horizontal strip",()=>{
  assert.match(css,/\.training-module-filters\{[^}]*display:grid/);
  assert.match(css,/\.training-module-filters\{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css,/\.training-module-filters button:first-child\{[^}]*grid-column:1\/-1/);
  assert.match(css,/@media\(max-width:520px\)\{[^}]*\.training-module-filters\{[^}]*grid-template-columns:1fr/);
});
