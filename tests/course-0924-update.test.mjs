import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=file=>fs.readFileSync(`liuyao-study-github/${file}`,'utf8');
const context={};vm.runInNewContext(`${read('course-0924.js')}\nglobalThis.lesson=course0924`,context);
const lesson=context.lesson;

test('new directions are independent learning topics, not course logistics',()=>{
  const html=read('index.html');
  for(const id of ['judgmentLawsuitTopic','judgmentCareerTopic','judgmentExamTopic','judgmentExamCases0924'])assert.match(html,new RegExp(`id="${id}"`));
  assert.match(html,/course-0924\.js\?v=20260928-judgment-v32/);
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
