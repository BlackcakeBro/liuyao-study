import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const read=path=>fs.readFileSync(path,"utf8");
const html=read("liuyao-study-github/index.html");
const app=read("liuyao-study-github/app.js");
const training=read("liuyao-study-github/training-bank.js");
const css=read("liuyao-study-github/styles.css");

const loadCourse=()=>{
  const sandbox={};
  vm.runInNewContext(`${read("liuyao-study-github/course-0801.js")};globalThis.__course=course0801;`,sandbox);
  return sandbox.__course;
};

test("08-01 classroom data completes the remaining three relatives",()=>{
  const course=loadCourse();
  assert.equal(course.meta.date,"2026-08-01");
  assert.deepEqual(Array.from(course.focusRelatives,item=>item.name),["兄弟","妻财","子孙"]);
  assert.ok(course.focusRelatives.every(item=>item.people.length>=3));
  assert.ok(course.focusRelatives.every(item=>item.things.length>=3));
  assert.ok(course.focusRelatives.every(item=>item.states.length>=3));
  assert.ok(course.focusRelatives.every(item=>item.boundary.length>=30));
});

test("08-01 data preserves question-first use-god reading and the original six-god introduction",()=>{
  const course=loadCourse();
  assert.deepEqual(Array.from(course.useGodSteps,item=>item.name),["先定所问","取用神","联系世爻","合看力量"]);
  assert.deepEqual(Array.from(course.sixGods,item=>item.name),["青龙","朱雀","勾陈","螣蛇","白虎","玄武"]);
  assert.match(course.sixGodBoundary,/初步|后续|不可/);
  assert.match(html,/id="useGod0801Steps"/);
  assert.match(html,/id="sixGod0808Grid"/);
  assert.match(app,/course0801\.useGodSteps/);
  assert.doesNotMatch(app,/course0801\.sixGods\.map/);
});

test("08-01 assets load before training and questions have a distinct source module",()=>{
  assert.match(html,/course-0801\.js\?v=/);
  assert.ok(html.indexOf("course-0801.js")<html.indexOf("training-bank.js"));
  assert.match(training,/id:"lecture0801"/);
  assert.match(training,/陈师 2026-08-01/);
  assert.match(training,/0801-relative-/);
  assert.match(training,/0801-sixgod-/);
});

test("the combined lesson no longer labels the three relatives as pending",()=>{
  const section=html.slice(html.indexOf('<section class="view" id="lecture0725">'),html.indexOf('<section class="view" id="casting">'));
  assert.doesNotMatch(section,/三类六亲待续|子孙、妻财、兄弟留待后续课堂/);
  assert.match(section,/兄弟、妻财、子孙/);
  assert.match(section,/六神详解/);
});

test("the longer combined lesson title wraps inside a mobile viewport",()=>{
  assert.match(css,/@media\(max-width:760px\)\{#lecture0725\{[^}]*overflow-x:hidden/);
  assert.match(css,/\.lecture0725-intro h1\{[^}]*overflow-wrap:anywhere[^}]*word-break:break-all/);
});

test("the relative section uses a concise title and aligns boundary labels with copy",()=>{
  const section=html.slice(html.indexOf('id="relative0725Focus"')-500,html.indexOf('id="relative0725Focus"')+100);
  assert.match(section,/<h2>六亲：人物、事物与状态<\/h2>/);
  assert.doesNotMatch(section,/来自 7 月 25 日课堂|来自 8 月 1 日课堂/);
  assert.doesNotMatch(html,/五类六亲已讲/);
  assert.match(css,/\.relative-card-boundary\{[^}]*display:grid[^}]*grid-template-columns:72px minmax\(0,1fr\)[^}]*align-items:start/);
  assert.match(css,/\.relative-card-boundary p\{[^}]*margin:0/);
});
