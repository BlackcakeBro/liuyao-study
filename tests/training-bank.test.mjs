import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import fs from "node:fs";

const source=["data.js","course-0718.js","training-bank.js"]
  .map(file=>fs.readFileSync(`liuyao-study-github/${file}`,"utf8"))
  .join("\n")+"\n;globalThis.__training=window.LIUYAO_TRAINING;";
const sandbox={window:{}};
vm.runInNewContext(source,sandbox);
const training=sandbox.__training;

test("audited question bank covers foundation, both taught courses, and ancient preview",()=>{
  assert.ok(training);
  const counts=Object.fromEntries(training.modules.map(module=>[
    module.id,
    training.bank.filter(question=>question.module===module.id).length
  ]));
  assert.deepEqual(counts,{
    foundation:73,
    lecture0704:54,
    lecture0718:140,
    classics:40
  });
  assert.equal(training.bank.length,307);
  assert.equal(new Set(training.bank.map(question=>question.id)).size,training.bank.length);
});

test("every question has a source, one answer and enough distinct distractors",()=>{
  training.bank.forEach(question=>{
    assert.ok(question.id);
    assert.ok(question.question);
    assert.ok(question.answer);
    assert.ok(question.source);
    assert.ok(question.feedback);
    assert.ok(Array.isArray(question.candidates));
    const choices=new Set([question.answer,...question.candidates].filter(Boolean));
    assert.ok(choices.size>=4,`${question.id} lacks four distinct choices`);
  });
});

test("Dui palace is tested only for name, palace, order and element while its meanings remain pending",()=>{
  const duiMeaningQuestions=training.bank.filter(question=>
    question.module==="lecture0718" && question.kind==="hexagram-cue" && question.palace==="兑"
  );
  assert.equal(duiMeaningQuestions.length,0);
  const duiMembership=training.bank.filter(question=>
    question.module==="lecture0718" && question.kind==="palace-membership" && question.palace==="兑"
  );
  assert.equal(duiMembership.length,8);
});

test("all course-image questions carry the non-deterministic interpretation boundary",()=>{
  const cueQuestions=training.bank.filter(question=>question.kind==="hexagram-cue");
  assert.equal(cueQuestions.length,56);
  cueQuestions.forEach(question=>assert.match(question.feedback,/不可脱离用神、旺衰与全卦/));
});

test("ancient preview follows the verified chapter order and exact na-jia sequences",()=>{
  assert.deepEqual(Array.from(training.classics.chapterOrder),[
    "八卦与占卦法","八宫六十四卦","浑天甲子","六亲","世应","动变","用神与元忌仇"
  ]);
  assert.deepEqual(Array.from(training.classics.najia[0].inner),["子水","寅木","辰土"]);
  assert.deepEqual(Array.from(training.classics.najia[0].outer),["午火","申金","戌土"]);
  assert.deepEqual(Array.from(training.classics.shiYing,stage=>stage.shi),[6,1,2,3,4,5,4,3]);
});
