import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const app=fs.readFileSync("liuyao-study-github/app.js","utf8");
const css=fs.readFileSync("liuyao-study-github/styles.css","utf8");

test("the long Si hidden-stem explanation fits without resizing any card",()=>{
  assert.match(app,/detail\.dataset\.activeBranch=active/);
  const siRules=[...css.matchAll(/\.hidden-stem-detail\[data-active-branch="巳"\][^{]*\{[^}]*\}/g)].map(match=>match[0]).join("\n");
  assert.doesNotMatch(siRules,/font-size:/,"Si must use the same typography scale as every other branch");
  assert.match(css,/\.hidden-stem-detail\[data-active-branch="巳"\] h3\{margin:4px 0 8px/);
  assert.match(css,/\.hidden-stem-detail\[data-active-branch="巳"\] p\{min-height:0;margin:4px 0/);
  assert.match(css,/\.hidden-stem-detail\[data-active-branch="巳"\] em\{min-height:0;margin-top:auto;padding-top:10px/);
  assert.match(css,/\.hidden-stem-detail\{height:390px;min-height:390px/);
  assert.doesNotMatch(css,/\.hidden-stem-detail\[data-active-branch="巳"\]\{[^}]*(?:height|min-height|padding|width)/);
});
