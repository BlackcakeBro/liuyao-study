import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const app=fs.readFileSync("liuyao-study-github/app.js","utf8");
const css=fs.readFileSync("liuyao-study-github/styles.css","utf8");

const rule=(selector)=>{
  const escaped=selector.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  return css.match(new RegExp(`${escaped}\\{([^}]*)\\}`))?.[1]??"";
};

test("scroll height is driven by its revealed content instead of fixed desktop heights",()=>{
  assert.match(rule(".scroll-unroll-mask"),/position:relative/);
  assert.doesNotMatch(rule(".scroll-atlas-shell"),/min-height/);
  assert.doesNotMatch(rule(".scroll-atlas-content"),/min-height/);
});

test("palace click always restores palace overview while hexagram click opens its detail",()=>{
  assert.equal((app.match(/const atlas0718State=/g)||[]).length,1,"atlas state must have one source of truth");
  assert.equal((app.match(/function render0718Palace\(/g)||[]).length,1,"palace renderer must not be duplicated");
  assert.match(app,/function render0718Palace\(palaceKey="乾",activeIndex=null\)/);
  assert.match(app,/render0718Palace\(next,null\)/);
  assert.match(app,/render0718Palace\(palaceKey,Number\(button\.dataset\.gua0718\)\)/);
  assert.match(app,/h\[3\]/);
  assert.match(app,/单卦取象/);
});

test("hexagram glyphs have dedicated motion with reduced-motion fallback",()=>{
  assert.match(css,/@keyframes gua-glyph-breathe/);
  assert.match(css,/@keyframes gua-card-enter/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)[\s\S]*\.scroll-gua-glyph/);
});
