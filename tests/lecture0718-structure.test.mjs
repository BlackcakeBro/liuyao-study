import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const html=fs.readFileSync("liuyao-study-github/index.html","utf8");
const css=fs.readFileSync("liuyao-study-github/styles.css","utf8");

test("website contains the 64-hexagram learning route",()=>{
  assert.match(html,/data-view="lecture0718"/);
  assert.match(html,/id="lecture0718"/);
});

test("new learning route contains exactly three learning themes",()=>{
  const start=html.indexOf('<section class="view" id="lecture0718">');
  assert.notEqual(start,-1);
  const next=html.indexOf('<section class="view"',start+10);
  const block=html.slice(start,next===-1?html.length:next);
  assert.match(block,/01[\s\S]*六爻识图/);
  assert.match(block,/02[\s\S]*八宫六十四卦/);
  assert.match(block,/03[\s\S]*易混卦象对照/);
  assert.doesNotMatch(block,/副本|已核查|录制定位|本讲学习链/);
});

test("paper and content share one expanding scroll mask",()=>{
  assert.match(html,/class="scroll-unroll-mask"/);
  assert.match(css,/\.scroll-unroll-mask[^}]*clip-path/);
  assert.match(css,/@keyframes scroll-mask-open/);
  assert.match(css,/@keyframes scroll-left-open/);
  assert.match(css,/@keyframes scroll-right-open/);
  assert.doesNotMatch(css,/\.scroll-atlas-content[^}]*animation:[^;}]*opacity/);
});

