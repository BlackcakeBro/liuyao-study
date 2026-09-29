import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=file=>fs.readFileSync(`liuyao-study-github/${file}`,'utf8');
const context={};vm.runInNewContext(`${read('course-0924.js')}\nglobalThis.lesson=course0924`,context);
const lesson=context.lesson;

test('new directions are independent learning topics, not course logistics',()=>{
  const html=read('index.html');
  for(const id of ['judgmentMethod0924','judgmentLawsuitTopic','judgmentLawsuitHoldings0924','judgmentLawsuitWorld0924','judgmentLawsuitGhost0924','judgmentLawsuitSpirits0924','judgmentLawsuitDocuments0924','judgmentLawsuitWealth0924','judgmentLawsuitParticipants0924','judgmentCareerTopic','judgmentCareerHoldings0924','judgmentExamTopic','judgmentExamCases0924'])assert.match(html,new RegExp(`id="${id}"`));
  assert.match(html,/course-0924\.js\?v=20260929-tablet-v36/);
  assert.match(read('app.js'),/render0924Course\(\)/);
  const portion=html.slice(html.indexOf('id="judgmentLawsuitTopic"'),html.indexOf('class="section-block judgment0822-boundary"'));
  assert.doesNotMatch(portion,/课堂|课程时长|逐字稿|屏幕共享|复核/);
});

test('both exam cases have verified geometry, moving lines and six assembly rows',()=>{
  assert.equal(lesson.exam.cases.length,2);
  for(const item of lesson.exam.cases){
    const h=item.hexagram;
    assert.equal(h.lines.length,6);assert.equal(h.changed.lines.length,6);
    assert.deepEqual(Array.from(h.moving),Array.from(h.lines,(line,i)=>line!==h.changed.lines[i]?i+1:null).filter(Boolean));
    assert.deepEqual(Array.from(h.assembly,x=>x.position),[6,5,4,3,2,1]);
  }
  assert.equal(lesson.exam.cases[0].hexagram.assembly[1].main.includes('伏子孙辛巳火'),true);
  assert.deepEqual(Array.from(lesson.exam.cases[1].hexagram.moving),[2,6]);
});

test('legal and exam boundaries reject deterministic high-stakes conclusions',()=>{
  assert.match(lesson.lawsuit.boundary,/不能|不可/);
  assert.match(lesson.exam.boundary,/成绩/);
  assert.doesNotMatch(lesson.lawsuit.sequence.map(x=>x.detail).join(''),/肯定有罪|必然坐牢|送钱/);
});


test('five lawsuit self-holdings and detailed topic arrays are individually sourced',()=>{
  assert.deepEqual(Array.from(lesson.lawsuit.holdings,x=>x.name),['官鬼持世','父母持世','妻财持世','兄弟持世','子孙持世']);
  const groups=[lesson.lawsuit.holdings,lesson.lawsuit.world,lesson.lawsuit.ghost,lesson.lawsuit.spirits,lesson.lawsuit.documents,lesson.lawsuit.wealth,lesson.lawsuit.participants,lesson.career.enterprise,lesson.career.holdings,lesson.career.office,lesson.career.positions,lesson.career.industry,lesson.exam.world,lesson.exam.relatives,lesson.exam.proxy,lesson.exam.positions,lesson.methodRules];
  assert.ok(groups.every(group=>group.length>=2));
  assert.ok(groups.flat().every(item=>item.at&&item.name&&item.cue&&item.detail));
  assert.match(read('app.js'),/judgmentMethod0924:course0924\.methodRules/);
});
