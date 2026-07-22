import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const app=fs.readFileSync("liuyao-study-github/app.js","utf8");
const css=fs.readFileSync("liuyao-study-github/styles.css","utf8");

test("palace switching does not flash a full-scroll overlay",()=>{
  assert.doesNotMatch(css,/atlas-ink-wipe/);
  assert.doesNotMatch(css,/\.scroll-atlas-content\.is-switching::after/);
});

test("only the palace metadata and card grid take part in the soft transition",()=>{
  assert.match(css,/\.scroll-atlas-content\.is-switching \.scroll-palace-meta/);
  assert.match(css,/\.scroll-atlas-content\.is-switching \.scroll-gua-grid/);
  assert.match(css,/filter:blur\(/);
  assert.match(css,/opacity:0/);
});

test("the selected palace tab responds before content is replaced",()=>{
  assert.match(app,/button\.classList\.toggle\("active",button\.dataset\.palace0718===next\)/);
  assert.match(app,/setTimeout\(\(\)=>\{render0718Palace\(next,null\)/);
});
