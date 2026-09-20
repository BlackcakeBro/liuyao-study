import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
const root=path.resolve(import.meta.dirname,"..");
const read=file=>fs.readFileSync(path.join(root,file),"utf8");

test("09-18 adds verified relationship cases and a safety-bounded disease topic",()=>{
  const source=read("liuyao-study-github/course-0918.js"),sandbox={};
  vm.runInNewContext(`${source};globalThis.__course=course0918;`,sandbox);
  const course=sandbox.__course;
  assert.equal(course.meta.date,"2026-09-18");
  assert.equal(course.meta.evidenceStatus,"verified");
  assert.equal(course.relationshipCases.length,3);
  assert.equal(course.healthFramework.length,4);
  assert.equal(course.healthLayers.length,4);
  assert.equal(course.illnessDynamics.length,4);
  assert.equal(course.proxyRules.length,4);
  assert.equal(course.healthCase.hexagram.name,"泽山咸");
  assert.equal(course.healthCase.hexagram.changed.name,"水山蹇");
  assert.deepEqual(Array.from(course.healthCase.hexagram.moving),[4]);
  assert.match(course.ethicsBoundary,/不能替代执业医师、检查、诊断与治疗/);
  const publicCopy=JSON.stringify([course.relationshipCases,course.healthFramework,course.healthLayers,course.illnessDynamics,course.proxyRules,course.healthCase,course.judgmentRules]);
  assert.doesNotMatch(publicCopy,/课堂|课程|录制|复核|音轨|共享画面|时长/);
});

test("disease topic has complete page, render, training and cache wiring",()=>{
  const html=read("liuyao-study-github/index.html");
  const app=read("liuyao-study-github/app.js");
  const bank=read("liuyao-study-github/training-bank.js");
  assert.match(html,/id="judgmentHealthTopic"/);
  assert.match(html,/断卦方向 03/);
  assert.match(html,/id="judgmentRelationshipCases0918"/);
  assert.match(html,/id="judgmentHealthCase0918"/);
  assert.match(html,/course-0918\.js\?v=20260920-health-v17/);
  assert.match(app,/function render0918Course\(/);
  assert.match(app,/course0918\.relationshipCases/);
  assert.match(bank,/id:"judgmentHealth"/);
  assert.match(bank,/0918-health-case/);
});

test("all four new case diagrams contain complete equal-length six-line pairs and assembly",()=>{
  const source=read("liuyao-study-github/course-0918.js"),sandbox={};
  vm.runInNewContext(`${source};globalThis.__course=course0918;`,sandbox);
  const cases=[...sandbox.__course.relationshipCases,sandbox.__course.healthCase];
  cases.forEach(item=>{
    assert.equal(item.hexagram.lines.length,6);
    assert.equal(item.hexagram.changed.lines.length,6);
    assert.equal(item.hexagram.assembly.length,6);
    assert.ok(item.hexagram.moving.length>=1);
    item.hexagram.assembly.forEach(row=>{assert.ok(row.main);assert.ok(row.changed);});
  });
});
