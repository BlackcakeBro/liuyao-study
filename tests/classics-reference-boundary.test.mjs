import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const html=fs.readFileSync("liuyao-study-github/index.html","utf8");
const css=fs.readFileSync("liuyao-study-github/styles.css","utf8");
const app=fs.readFileSync("liuyao-study-github/app.js","utf8");
const source=["data.js","course-0718.js","course-0725.js","classics-library.js","course-0801.js","course-0808.js","course-0815.js","training-bank.js"]
  .map(file=>fs.readFileSync(`liuyao-study-github/${file}`,"utf8")).join("\n")+
  "\n;globalThis.__training=window.LIUYAO_TRAINING;globalThis.__course=course0725;";
const sandbox={window:{}};
vm.runInNewContext(source,sandbox);

const sectionAt=id=>html.indexOf(`id="${id}"`);

test("taught na-jia, shi-ying and six-relative tools live in the 07-25 course",()=>{
  assert.ok(sectionAt("lecture0725")>=0);
  assert.ok(sectionAt("najiaTrigramPicker")>sectionAt("lecture0725"));
  assert.ok(sectionAt("shiYingStages")>sectionAt("lecture0725"));
  assert.ok(sectionAt("relativeCards")>sectionAt("lecture0725"));
  assert.ok(sectionAt("najiaTrigramPicker")<sectionAt("casting"));
  assert.ok(sectionAt("shiYingStages")<sectionAt("casting"));
  assert.ok(sectionAt("relativeCards")<sectionAt("casting"));
  assert.doesNotMatch(app,/#classicsNajia|#classicsShiYing/);
  assert.match(app,/\[\"course-najia\",\"纳甲装支\"\]/);
  assert.match(app,/\[\"course-shiying\",\"世应定位\"\]/);
});

test("extended classics reference retains casting but renders sourced references and cases",()=>{
  assert.match(html,/古籍参考/);
  assert.ok(app.includes('if(extendedEdition)document.querySelector(\'[data-view="casting"]\').textContent="古籍参考";'));
  assert.match(html,/id="classicsReferenceCards"/);
  assert.match(html,/id="classicsCaseCards"/);
  assert.match(html,/id="tossCoins"/);
  assert.equal(sandbox.__course.classicsReferences.length,70);
  assert.ok(new Set(sandbox.__course.classicsReferences.map(item=>item.book)).size>=7);
  assert.ok(sandbox.__course.classicsReferences.slice(10).every(item=>item.sourceUrl));
  assert.ok(sandbox.__course.classicsCases.slice(11).every(item=>item.sourceUrl));
  assert.equal(new Set(sandbox.__course.classicsCases.slice(11).map(item=>item.title)).size,103);
  assert.ok(sandbox.__course.classicsCases.slice(11).every(item=>{
    const changed=item.hexagram.changed;
    if(!changed)return !item.hexagram.moving?.length;
    const positions=item.hexagram.lines.flatMap((line,index)=>line===changed.lines[index]?[]:[index+1]);
    return JSON.stringify(positions)===JSON.stringify(item.hexagram.moving);
  }));
  assert.ok(sandbox.__course.classicsCases.slice(11).every(item=>!/%[A-F0-9]{2}|原剑按|⚊|⚋/.test(item.sourceText)));
  assert.match(app,/classics-pager-ellipsis/);
  assert.match(html,/id="classicsReferenceBook"/);
  assert.match(html,/id="classicsCaseBook"/);
  assert.match(app,/classics-pager-jump/);
  assert.ok(new Set(sandbox.__course.classicsCases.map(item=>item.book)).size>=3);
  assert.ok(sandbox.__course.classicsReferences.every(item=>item.book&&item.location&&item.excerpt&&item.plain&&item.application&&item.checklist?.length===3&&item.keywords&&item.connection));
  assert.equal(sandbox.__course.classicsCases.length,114);
  assert.ok(sandbox.__course.classicsCases.every(item=>item.book&&item.location&&item.sourceText&&item.hexagram?.lines?.length===6&&item.analysis?.length>=3&&item.boundary));
  assert.ok(sandbox.__course.classicsReferences.every(item=>!/(预习|后续课堂|等待课程)/.test(JSON.stringify(item))));
  assert.match(app,/classics-case-hexagram/);
  assert.ok(sandbox.__course.classicsCases.some(item=>item.hexagram.changed&&item.hexagram.moving?.length));
  assert.match(app,/function renderClassicsReference\(/);
  assert.match(app,/function renderClassicsPager\(/);
  assert.match(app,/const referencePageSize=2/);
  assert.match(app,/const casePages=caseItems\.length/);
  assert.match(app,/if\(!buttons\|\|!result\)return;/);
  assert.doesNotMatch(html,/后续参考：取用神/);
  assert.match(html,/id="classicsReferencePager"/);
  assert.match(html,/id="classicsCasePager"/);
  assert.match(html,/id="classicsPracticalIndex"/);
  assert.match(html,/id="classicRelativeCards"/);
  assert.match(app,/function renderRelatives\(\)/);
});

test("judgment boundary owns responsive horizontal padding for every content row",()=>{
  assert.match(css,/\.judgment-boundary\{[^}]*padding(?:-inline)?\s*:\s*clamp\(/s);
  assert.match(css,/\.judgment-boundary__next\{[^}]*border-top:/s);
  assert.match(css,/\.judgment-boundary\{[^}]*grid-template-columns:minmax\(220px,.8fr\) minmax\(0,1.2fr\)/s);
  assert.match(css,/@media\(max-width:760px\)\{[^}]*\.judgment-boundary\{[^}]*padding:28px 22px/s);
});

test("training names classics as a reference and moves taught structures to lecture0725",()=>{
  const modules=Object.fromEntries(sandbox.__training.modules.map(item=>[item.id,item.label]));
  assert.equal(modules.classics,"古籍参考");
  const taughtKinds=new Set(["najia","shi-ying","six-relative"]);
  const taught=sandbox.__training.bank.filter(item=>taughtKinds.has(item.kind));
  assert.ok(taught.every(item=>item.module==="lecture0725"||item.module==="foundation"));
  assert.equal(sandbox.__training.bank.length,431);
});
