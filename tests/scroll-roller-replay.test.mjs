import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const html=fs.readFileSync("liuyao-study-github/index.html","utf8");
const app=fs.readFileSync("liuyao-study-github/app.js","utf8");
const css=fs.readFileSync("liuyao-study-github/styles.css","utf8");
const rule=(selector)=>{
  const escaped=selector.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  return css.match(new RegExp(`${escaped}\\{([^}]*)\\}`))?.[1]??"";
};
const pngHeight=path=>fs.readFileSync(path).readUInt32BE(20);

test("the physical roller artwork has no vertical transparent padding",()=>{
  assert.equal(pngHeight("liuyao-study-github/assets/scroll-left-roller-0718.png"),885);
  assert.equal(pngHeight("liuyao-study-github/assets/scroll-right-roller-0718.png"),880);
  assert.match(rule(".scroll-roller"),/top:-18px/);
  assert.match(rule(".scroll-roller"),/bottom:-18px/);
  assert.match(css,/scroll-left-roller-0718\.png\?v=20260722-scroll-v5/);
  assert.match(css,/scroll-right-roller-0718\.png\?v=20260722-scroll-v5/);
});

test("both rollers are accessible replay controls with a hand cursor",()=>{
  assert.equal((html.match(/class="scroll-roller scroll-roller-(?:left|right)"/g)||[]).length,2);
  assert.equal((html.match(/aria-label="重新展开八宫卦谱卷轴"/g)||[]).length,2);
  assert.match(rule(".scroll-roller"),/cursor:pointer/);
  assert.match(rule(".scroll-roller"),/pointer-events:auto/);
  assert.match(css,/\.scroll-roller:focus-visible/);
});

test("clicking either roller restarts the unroll animation",()=>{
  assert.match(app,/querySelectorAll\("#scroll0718Shell \.scroll-roller"\)/);
  assert.match(app,/addEventListener\("click",replay0718Scroll\)/);
  assert.match(app,/shell\.classList\.remove\("is-unrolling"\)/);
  assert.match(app,/void shell\.offsetWidth/);
  assert.match(app,/shell\.classList\.add\("is-unrolling"\)/);
});
