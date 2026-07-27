import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const html=fs.readFileSync("liuyao-study-github/index.html","utf8");
const app=fs.readFileSync("liuyao-study-github/app.js","utf8");
const css=fs.readFileSync("liuyao-study-github/styles.css","utf8");

function loadCourse(){
  const source=fs.readFileSync("liuyao-study-github/course-0725.js","utf8")+
    "\n;globalThis.__course=course0725;";
  const sandbox={};
  vm.runInNewContext(source,sandbox);
  return sandbox.__course;
}

test("07-25 course data preserves the verified scope and next-lesson boundary",()=>{
  const course=loadCourse();
  assert.equal(course.meta.date,"2026-07-25");
  assert.deepEqual(Array.from(course.relativeCycles.generating),[
    "父母生兄弟","兄弟生子孙","子孙生妻财","妻财生官鬼","官鬼生父母"
  ]);
  assert.deepEqual(Array.from(course.relativeCycles.controlling),[
    "父母克子孙","子孙克官鬼","官鬼克兄弟","兄弟克妻财","妻财克父母"
  ]);
  assert.deepEqual(Array.from(course.focusRelatives,item=>item.name),["父母","官鬼"]);
  assert.match(course.nextLesson,/子孙、妻财、兄弟/);
});

test("Dui palace is now classroom-verified without placeholder meanings",()=>{
  const source=fs.readFileSync("liuyao-study-github/course-0718.js","utf8")+
    "\n;globalThis.__course=course0718;";
  const sandbox={};
  vm.runInNewContext(source,sandbox);
  const dui=sandbox.__course.palaces["兑"];
  assert.equal(dui.status,"verified");
  assert.match(dui.source,/2026-07-25/);
  assert.ok(dui.hexagrams.every(item=>!item.join("").includes("待陈师")));
});

test("07-25 page is extended-only and directly routable",()=>{
  assert.match(html,/data-view="lecture0725"/);
  assert.match(html,/id="lecture0725"/);
  assert.match(html,/course-0725\.js/);
  assert.ok(html.indexOf("course-0725.js")<html.indexOf("training-bank.js"));
  assert.match(app,/\["lecture0704","lecture0718","lecture0725"\]\.includes/);
  assert.match(app,/\[data-view="lecture0725"\]/);
  assert.match(app,/render0725Course/);
  assert.match(app,/"lecture0725"/);
});

test("07-25 learning surface is responsive and visually scoped",()=>{
  assert.match(css,/\.lecture0725-grid\{/);
  assert.match(css,/\.relative-cycle-board\{/);
  assert.match(css,/@media\(max-width:760px\)\{[^}]*\.lecture0725-grid\{/s);
});

