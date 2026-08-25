import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const read=path=>fs.existsSync(path)?fs.readFileSync(path,"utf8"):"";
const html=read("liuyao-study-github/index.html");
const app=read("liuyao-study-github/app.js");
const training=read("liuyao-study-github/training-bank.js");
const source=read("liuyao-study-github/course-0822.js");
const load=()=>{const sandbox={};vm.runInNewContext(`${source};globalThis.__course=course0822;`,sandbox);return sandbox.__course;};

test("08-22 course is reconciled against the complete screen recording and audio",()=>{
  assert.ok(source,"course-0822.js must exist");
  const course=load();
  assert.equal(course.meta.date,"2026-08-22");
  assert.equal(course.meta.sourceUrl,"https://meeting.tencent.com/cw/l5kr5RDV0c");
  assert.equal(course.meta.evidenceStatus,"verified");
  assert.equal(course.meta.duration,"02:35:05");
  assert.equal(course.meta.transcriptCoverage,"00:00–02:35:01");
  assert.equal(course.meta.visualEvidenceStatus,"screen track reviewed");
  assert.match(course.meta.evidence,/屏幕共享画面/);
  assert.match(course.meta.evidence,/音轨/);
  assert.deepEqual(Array.from(course.judgmentSteps,item=>item.name),["先定占问","取用神","看力量与关系","辨吉凶与细节","最后看应期"]);
  assert.deepEqual(Array.from(course.coreConcepts,item=>item.name),["用神","多用神取舍","元神、忌神与仇神","飞神与伏神","进神与退神","伏吟与反吟","应期"]);
  assert.equal(course.caseStudies.length,6);
  assert.match(course.caseStudies.map(item=>item.title).join("\n"),/伏神/);
  assert.match(course.caseStudies.map(item=>item.title).join("\n"),/进神/);
  assert.match(source,/不能脱离/);
  assert.match(source,/现实核验/);
});

test("08-22 judgment page and training module state full video verification and stay in the extended edition",()=>{
  assert.match(html,/data-view="judgment"/);
  assert.match(html,/id="judgment"/);
  assert.match(html,/id="judgmentSteps0822"/);
  assert.match(html,/id="judgmentConcepts0822"/);
  assert.match(html,/id="judgmentCases0822"/);
  assert.match(html,/全程复核/);
  assert.match(html,/飞神伏神/);
  assert.match(html,/进神退神/);
  assert.match(html,/course-0822\.js\?v=/);
  assert.ok(html.indexOf("course-0822.js")<html.indexOf("training-bank.js"));
  assert.match(app,/render0822Course\(\)/);
  assert.match(app,/course0822\.judgmentSteps/);
  assert.match(training,/id:"lecture0822"/);
  assert.match(training,/陈师 2026-08-22/);
  assert.match(training,/全程音画复核/);
  assert.match(training,/course0822\.judgmentSteps/);
  assert.match(training,/course0822\.coreConcepts/);
});

test("extended navigation calls the existing assembly page 装卦",()=>{
  assert.match(html,/>装卦<\/button>/);
  assert.doesNotMatch(html,/>装卦六亲·六神<\/button>/);
});
