import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const read=path=>fs.existsSync(path)?fs.readFileSync(path,"utf8"):"";
const html=read("liuyao-study-github/index.html");
const app=read("liuyao-study-github/app.js");
const training=read("liuyao-study-github/training-bank.js");
const source=read("liuyao-study-github/course-0815.js");
const load=()=>{const sandbox={};vm.runInNewContext(`${source};globalThis.__course=course0815;`,sandbox);return sandbox.__course;};

test("08-15 course records taught scope and source boundary",()=>{
  assert.ok(source,"course-0815.js must exist");
  const course=load();
  assert.equal(course.meta.date,"2026-08-15");
  assert.equal(course.meta.sourceUrl,"https://meeting.tencent.com/cw/KEeZ4LDO22");
  assert.equal(course.meta.evidenceStatus,"partial");
  assert.deepEqual(Array.from(course.movingYaoPrinciples,item=>item.name),["动爻优先","谁动谁显","多动先核意念"]);
  assert.deepEqual(Array.from(course.voidPrinciples,item=>item.name),["旬空","出空与填实","动空不作废"]);
  assert.deepEqual(Array.from(course.monthBreakPrinciples,item=>item.name),["月破","扶助不改当月","土冲开墓库"]);
  assert.deepEqual(Array.from(course.tombStorehousePrinciples,item=>item.name),["墓与库","得令为库","开墓开库"]);
  assert.match(source,/卦身/);
  assert.match(source,/不替代/);
});

test("08-15 learning surface and training module are wired",()=>{
  for(const id of ["movingYao0815Grid","void0815Grid","monthBreak0815Grid","tombStorehouse0815Grid","hexagramBody0815Grid"]){
    assert.match(html,new RegExp(`id="${id}"`));
  }
  assert.match(html,/course-0815\.js\?v=/);
  assert.ok(html.indexOf("course-0815.js")<html.indexOf("training-bank.js"));
  for(const key of ["movingYaoPrinciples","voidPrinciples","monthBreakPrinciples","tombStorehousePrinciples","hexagramBodyPrinciples"]){
    assert.match(app,new RegExp(`course0815\\.${key}`));
  }
  assert.match(training,/id:"lecture0815"/);
  assert.match(training,/陈师 2026-08-15/);
  assert.match(training,/add0815Principles\("moving"/);
  assert.match(training,/add0815Principles\("void"/);
  assert.match(training,/add0815Principles\("tomb"/);
});
