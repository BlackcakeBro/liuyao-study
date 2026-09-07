import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";

const root=path.resolve(import.meta.dirname,"..");
const read=file=>fs.readFileSync(path.join(root,file),"utf8");

test("09-05 completes the wealth topic without creating another date-led learning surface",()=>{
  const source=read("liuyao-study-github/course-0905.js");
  const sandbox={};
  vm.runInNewContext(`${source};globalThis.__course=course0905;`,sandbox);
  const course=sandbox.__course;
  assert.equal(course.meta.topic,"求财");
  assert.equal(course.meta.evidenceStatus,"verified");
  assert.ok(course.wealthCompletion.length>=5);
  assert.ok(course.wealthCompletion.some(item=>item.name.includes("持世")));
  assert.ok(course.wealthCompletion.some(item=>item.name.includes("动变")));
  assert.ok(course.wealthCompletion.some(item=>item.name.includes("伏藏")));
});

test("judgment page is organized by stable framework and topic rail",()=>{
  const html=read("liuyao-study-github/index.html");
  const app=read("liuyao-study-github/app.js");
  const css=read("liuyao-study-github/styles.css");
  assert.match(html,/id="judgmentTopicRail"/);
  assert.match(html,/data-judgment-topic="wealth"/);
  assert.match(html,/id="judgmentWealth0905"/);
  assert.match(html,/course-0905\.js\?v=/);
  assert.ok(html.indexOf("course-0905.js")<html.indexOf("training-bank.js"));
  assert.match(app,/function render0905Course\(/);
  assert.match(app,/course0905\.wealthCompletion/);
  assert.match(css,/\.judgment-topic-rail\{/);
  assert.match(css,/\.judgment-topic-panel\{/);
});
