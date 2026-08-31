import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import fs from "node:fs";

const source=["data.js","course-0718.js","course-0725.js","course-0801.js","course-0808.js","course-0815.js","course-0822.js","course-0829.js","training-bank.js"]
  .map(file=>fs.readFileSync(`liuyao-study-github/${file}`,"utf8"))
  .join("\n")+"\n;globalThis.__training=window.LIUYAO_TRAINING;";
const sandbox={window:{}};
vm.runInNewContext(source,sandbox);
const training=sandbox.__training;

test("audited question bank covers foundation, all taught courses, and ancient annotations",()=>{
  assert.ok(training);
  const counts=Object.fromEntries(training.modules.map(module=>[
    module.id,
    training.bank.filter(question=>question.module===module.id).length
  ]));
  assert.deepEqual(counts,{
    foundation:73,
    lecture0704:54,
    lecture0718:148,
    lecture0725:55,
    lecture0801:32,
    lecture0808:35,
    lecture0815:23,
    lecture0822:17,
    lecture0829:21,
    classics:11
  });
  assert.equal(training.bank.length,469);
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

test("Dui palace includes eight classroom-sourced image questions after 07-25",()=>{
  const duiMeaningQuestions=training.bank.filter(question=>
    question.module==="lecture0718" && question.kind==="hexagram-cue" && question.palace==="兑"
  );
  assert.equal(duiMeaningQuestions.length,8);
  assert.ok(duiMeaningQuestions.every(question=>question.source==="陈师 2026-07-25"));
  const duiMembership=training.bank.filter(question=>
    question.module==="lecture0718" && question.kind==="palace-membership" && question.palace==="兑"
  );
  assert.equal(duiMembership.length,8);
});

test("all course-image questions carry the non-deterministic interpretation boundary",()=>{
  const cueQuestions=training.bank.filter(question=>question.kind==="hexagram-cue");
  assert.equal(cueQuestions.length,64);
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


test("taught assembly questions stay in the 07-25 module while later ancient reference remains separate",()=>{
  const taughtKinds=new Set(["najia","shi-ying","six-relative"]);
  const taught=training.bank.filter(question=>taughtKinds.has(question.kind));
  assert.ok(taught.every(question=>question.module==="lecture0725"||question.module==="foundation"));
  assert.ok(training.bank.filter(question=>question.module==="classics").every(question=>
    ["yongshen","role"].includes(question.kind)
  ));
});
