import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const read=path=>fs.readFileSync(path,"utf8");
const html=read("liuyao-study-github/index.html");
const app=read("liuyao-study-github/app.js");
const training=read("liuyao-study-github/training-bank.js");
const source=read("liuyao-study-github/course-0829.js");
const load=()=>{const sandbox={};vm.runInNewContext(`${source};globalThis.__course=course0829;`,sandbox);return sandbox.__course;};

test("08-29 course is grounded in the complete recording's audio and screen tracks",()=>{
  const course=load();
  assert.equal(course.meta.date,"2026-08-29");
  assert.equal(course.meta.duration,"02:48:00");
  assert.equal(course.meta.sourceUrl,"https://meeting.tencent.com/cw/2BRnVr8o2b");
  assert.equal(course.meta.evidenceStatus,"verified");
  assert.match(course.meta.evidence,/02:48:00/);
  assert.match(course.meta.evidence,/屏幕共享画面/);
  assert.match(course.meta.evidence,/音轨/);
  assert.deepEqual(Array.from(course.timingPrinciples,item=>item.name),["先看能否，再谈何时","逐项找出限制条件","先月后日，寻找窗口","空、墓、合、冲须分吉凶","应期范围先近后远"]);
  assert.deepEqual(Array.from(course.wealthPrinciples,item=>item.name),["求财先定四个观察点","财路、阻力与耗财","世应先看双方能否相接","妻财持世","子孙持世","兄弟持世","官鬼持世"]);
  assert.equal(course.caseStudies.length,5);
  assert.match(course.caseStudies.map(item=>item.title).join("\n"),/调动/);
  assert.match(course.caseStudies.map(item=>item.title).join("\n"),/求财/);
  assert.match(course.ethicsBoundary,/具体占问/);
});

test("08-29 timing and wealth surface is loaded, rendered, and trained only in the extended edition",()=>{
  for(const id of ["judgmentTiming0829","judgmentWealth0829","judgmentCases0829","judgment0829Rules","judgment0829Ethics"]){
    assert.match(html,new RegExp(`id="${id}"`));
  }
  assert.match(html,/course-0829\.js\?v=/);
  assert.ok(html.indexOf("course-0829.js")<html.indexOf("training-bank.js"));
  assert.match(app,/function render0829Course\(/);
  for(const key of ["timingPrinciples","wealthPrinciples","caseStudies","judgmentRules"]){
    assert.match(app,new RegExp(`course0829\\.${key}`));
    assert.match(training,new RegExp(`course0829\\.${key}`));
  }
  assert.match(training,/id:"lecture0829"/);
  assert.match(training,/陈师 2026-08-29/);
  assert.match(training,/全程音画复核/);
});
