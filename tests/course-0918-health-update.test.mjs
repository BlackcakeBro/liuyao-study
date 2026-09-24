import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
const root=path.resolve(import.meta.dirname,"..");
const read=file=>fs.readFileSync(path.join(root,file),"utf8");

test("09-18 disease knowledge is explicit, deep and safety bounded",()=>{
  const source=read("liuyao-study-github/course-0918.js"),sandbox={};
  vm.runInNewContext(`${source};globalThis.__course=course0918;`,sandbox);
  const course=sandbox.__course;
  assert.equal(course.meta.date,"2026-09-18");
  assert.equal(course.meta.evidenceStatus,"verified");
  assert.equal(course.relationshipCases.length,3);
  assert.equal(course.healthFramework.length,4);
  assert.equal(course.selfHoldingRules.length,6);
  assert.equal(course.yaoPositionRules.length,6);
  assert.equal(course.fiveElementRules.length,9);
  assert.equal(course.palaceRules.length,8);
  assert.equal(course.sixSpiritRules.length,6);
  assert.equal(course.hiddenGhostRules.length,6);
  assert.equal(course.ghostDynamicRules.length,11);
  assert.equal(course.medicineRules.length,9);
  assert.equal(course.foodRules.length,4);
  assert.equal(course.proxyRules.length,6);
  assert.equal(course.healthCase.hexagram.name,"泽山咸");
  assert.equal(course.healthCase.hexagram.changed.name,"水山蹇");
  assert.deepEqual(Array.from(course.healthCase.hexagram.moving),[4]);
  assert.match(course.selfHoldingRules.find(item=>item.name==="官鬼持世").detail,/病程缠绵、反复|长期管理/);
  assert.match(course.medicineRules.find(item=>item.name==="子孙化官鬼").detail,/副作用|新问题|未对症/);
  assert.match(course.foodRules.find(item=>item.name==="妻财动在上卦或下卦").detail,/上卦偏呕吐.*下卦偏腹泻/);
  assert.match(course.ethicsBoundary,/不能替代执业医师、检查、诊断与治疗/);
  const publicCopy=JSON.stringify([course.relationshipCases,course.healthFramework,course.selfHoldingRules,course.yaoPositionRules,course.fiveElementRules,course.palaceRules,course.sixSpiritRules,course.hiddenGhostRules,course.ghostDynamicRules,course.medicineRules,course.foodRules,course.proxyRules,course.healthCase,course.judgmentRules]);
  assert.doesNotMatch(publicCopy,/课堂|课程|录制|复核|音轨|共享画面|时长/);
});

test("disease topic has complete page, render, training and cache wiring",()=>{
  const html=read("liuyao-study-github/index.html");
  const app=read("liuyao-study-github/app.js");
  const bank=read("liuyao-study-github/training-bank.js");
  ["judgmentHealthTopic","judgmentHealthSelf0918","judgmentHealthYao0918","judgmentHealthElement0918","judgmentHealthPalace0918","judgmentHealthSpirit0918","judgmentHealthHidden0918","judgmentHealthGhost0918","judgmentHealthMedicine0918","judgmentHealthFood0918","judgmentHealthProxy0918","judgmentHealthCase0918"].forEach(id=>assert.match(html,new RegExp(`id="${id}"`)));
  assert.match(html,/断卦方向 03/);
  assert.match(html,/course-0918\.js\?v=20260924-classics-navigation-v28/);
  assert.match(app,/function render0918Course\(/);
  assert.match(app,/course0918\.medicineRules/);
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
