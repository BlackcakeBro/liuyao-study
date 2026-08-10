import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const read=path=>fs.existsSync(path)?fs.readFileSync(path,"utf8"):"";
const html=read("liuyao-study-github/index.html");
const app=read("liuyao-study-github/app.js");
const training=read("liuyao-study-github/training-bank.js");
const source0808=read("liuyao-study-github/course-0808.js");

const loadCourse=()=>{
  if(!source0808)return null;
  const sandbox={};
  vm.runInNewContext(`${source0808};globalThis.__course=course0808;`,sandbox);
  return sandbox.__course;
};

test("08-08 course keeps its evidence boundary and complete taught scope",()=>{
  const course=loadCourse();
  assert.ok(course,"course-0808.js must exist");
  assert.equal(course.meta.date,"2026-08-08");
  assert.equal(course.meta.evidenceStatus,"partial");
  assert.match(course.meta.evidence,/逐字稿/);
  assert.match(course.meta.evidence,/时间轴/);
  assert.deepEqual(Array.from(course.sixGodDetails,item=>item.name),[
    "青龙","朱雀","勾陈","螣蛇","白虎","玄武"
  ]);
  assert.equal(course.dayMonthPrinciples.length,4);
  assert.equal(course.outcomePatterns.length,4);
  assert.deepEqual(Array.from(course.xuMonthZiDayExample,item=>item.branch),[
    "卯","巳","未","辰","寅","子"
  ]);
  assert.equal(course.applications.length,5);
});

test("08-08 learning surface expands six gods and adds day-month strength reading",()=>{
  assert.match(html,/id="sixGod0808Grid"/);
  assert.match(html,/id="dayMonth0808Principles"/);
  assert.match(html,/id="dayMonth0808Patterns"/);
  assert.match(html,/id="xuZi0808Example"/);
  assert.match(html,/id="dayMonth0808Applications"/);
  assert.match(app,/course0808\.sixGodDetails/);
  assert.match(app,/course0808\.dayMonthPrinciples/);
  assert.match(app,/course0808\.outcomePatterns/);
  assert.match(app,/course0808\.xuMonthZiDayExample/);
  assert.match(app,/course0808\.applications/);
});

test("08-08 asset and its distinct training module load before the question bank",()=>{
  assert.match(html,/course-0808\.js\?v=/);
  assert.ok(html.indexOf("course-0808.js")<html.indexOf("training-bank.js"));
  assert.match(training,/id:"lecture0808"/);
  assert.match(training,/陈师 2026-08-08/);
  assert.match(training,/0808-sixgod-/);
  assert.match(training,/0808-daymonth-/);
  assert.match(training,/0808-example-/);
});

