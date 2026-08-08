import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const app=fs.readFileSync("liuyao-study-github/app.js","utf8");
const css=fs.readFileSync("liuyao-study-github/styles.css","utf8");

test("the long Si hidden-stem explanation fits without resizing any card",()=>{
  assert.match(app,/detail\.dataset\.activeBranch=active/);
  assert.match(css,/\.hidden-stem-detail\[data-active-branch="巳"\] h3\{[^}]*font-size:34px[^}]*margin:6px 0 12px/);
  assert.match(css,/\.hidden-stem-detail\[data-active-branch="巳"\] em\{[^}]*min-height:0[^}]*font-size:14px[^}]*line-height:1\.55/);
  assert.match(css,/\.hidden-stem-detail\{height:390px;min-height:390px/);
  assert.doesNotMatch(css,/\.hidden-stem-detail\[data-active-branch="巳"\]\{[^}]*(?:height|min-height|padding|width)/);
});
