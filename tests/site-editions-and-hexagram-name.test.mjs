import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const app=fs.readFileSync("liuyao-study-github/app.js","utf8");
const css=fs.readFileSync("liuyao-study-github/styles.css","utf8");
const rule=(selector)=>{
  const escaped=selector.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  return css.match(new RegExp(`${escaped}\\{([^}]*)\\}`))?.[1]??"";
};

test("hexagram names stay on one line without changing desktop detail height",()=>{
  assert.match(rule(".scroll-palace-meta.is-hexagram-detail h3"),/white-space:nowrap/);
  assert.match(rule(".scroll-palace-meta"),/height:490px/);
  assert.match(rule(".scroll-palace-meta"),/max-height:490px/);
});

test("the default URL is classic while the canonical changsheng URL enables the extended edition",()=>{
  assert.match(app,/const extendedEdition=/);
  assert.match(app,/changsheng-ring-v3/);
  assert.match(app,/document\.documentElement\.dataset\.siteEdition/);
  assert.match(app,/\[data-view="lecture0704"\]/);
  assert.match(app,/\[data-view="lecture0718"\]/);
  assert.match(app,/\.remove\(\)/);
  assert.match(app,/从基础关系到断卦实证/);
});

test("classic learning progress excludes the two extended-only modules",()=>{
  assert.match(app,/\.\.\.\(extendedEdition\s*\?/);
  assert.match(app,/\["lecture0704-main","旺衰关系专题"\]/);
  assert.match(app,/\["lecture0718-main","八宫六十四卦"\]/);
  assert.doesNotMatch(app,/内容：16个知识模块/);
  assert.match(app,/内容：\$\{learningModules\.length\}个知识模块/);
});
