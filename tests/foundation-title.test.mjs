import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const html=fs.readFileSync("liuyao-study-github/index.html","utf8");
const training=fs.readFileSync("liuyao-study-github/training-bank.js","utf8");

test("the foundation module is consistently titled 基础体系 without altering source attribution",()=>{
  assert.match(html,/<button class="nav-item" data-view="foundation">基础体系<\/button>/);
  assert.match(html,/<h1>基础体系<\/h1>/);
  assert.match(html,/题目按知识来源分组：基础体系、旺衰与地支关系/);
  assert.match(training,/{id:"foundation",label:"基础体系",short:"基础"}/);
  assert.match(training,/source="陈师基础讲义"/);
});
