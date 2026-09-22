import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";

const root=path.resolve(import.meta.dirname,"..");
const read=file=>fs.readFileSync(path.join(root,file),"utf8");

test("09-05 extends self-contained wealth knowledge without publishing teaching-process language",()=>{
  const source=read("liuyao-study-github/course-0905.js");
  const sandbox={};
  vm.runInNewContext(`${source};globalThis.__course=course0905;`,sandbox);
  const course=sandbox.__course;
  assert.equal(course.meta.topic,"求财");
  assert.equal(course.meta.evidenceStatus,"verified");
  assert.ok(course.wealthGeneralRules.length>=4);
  assert.ok(course.wealthWifeDynamicRules.length>=7);
  assert.ok(course.wealthHiddenRules.length>=5);
  assert.ok(course.wealthSourceRules.length>=8);
  assert.ok(course.holdingSelfPrinciples.some(item=>item.name==="父母持世"));
  assert.ok(course.wealthWifeDynamicRules.some(item=>item.name==="妻财化官鬼"));
  assert.ok(course.wealthHiddenRules.some(item=>item.name==="伏财在兄弟下"));
  assert.doesNotMatch(JSON.stringify([...course.holdingSelfPrinciples,...course.wealthGeneralRules,...course.wealthWifeDynamicRules,...course.wealthHiddenRules,...course.wealthSourceRules]),/课堂|课程|本讲|讲师|陈师/);
  assert.doesNotMatch(JSON.stringify(course.judgmentRules),/课堂|课程|本讲|已完成|后续/);
  assert.doesNotMatch(course.ethicsBoundary,/课堂|课程|本讲|已完成|后续/);
});

test("judgment page is organized as content, not a course schedule",()=>{
  const html=read("liuyao-study-github/index.html");
  const app=read("liuyao-study-github/app.js");
  const css=read("liuyao-study-github/styles.css");
  assert.match(html,/id="judgmentTopicRail"/);
  assert.match(html,/data-judgment-topic="wealth"/);
  assert.match(html,/断卦：先定结构，再辨问题/);
  assert.match(html,/动变、伏藏与财源/);
  assert.doesNotMatch(html,/持世、动变与财源/);
  assert.doesNotMatch(html,/已完成|待课堂讲授|后续专题|求财专题补全|音画已核/);
  assert.doesNotMatch(html,/<span aria-disabled="true">/);
  for(const id of ["judgmentWealthGeneral0905","judgmentWealthWife0905","judgmentWealthHidden0905","judgmentWealthSource0905"]){
    assert.match(html,new RegExp(`id="${id}"`));
  }
  assert.match(html,/course-0905\.js\?v=/);
  assert.ok(html.indexOf("course-0905.js")<html.indexOf("training-bank.js"));
  assert.match(app,/function render0905Course\(/);
  assert.match(app,/course0905\.holdingSelfPrinciples/);
  assert.match(app,/course0905\.wealthWifeDynamicRules/);
  assert.doesNotMatch(app,/课堂示例/);
  assert.doesNotMatch(app,/来源：\$\{state\.quiz\.source\}/);
  assert.match(css,/\.judgment-topic-rail\{/);
  assert.match(css,/\.judgment-topic-panel\{/);
});
