import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const root=new URL("../",import.meta.url);
const read=name=>fs.readFileSync(new URL(`../liuyao-study-github/${name}`,import.meta.url),"utf8");
const html=read("index.html"),app=read("app.js"),course0725Source=read("course-0725.js"),course0808Source=read("course-0808.js");
const load=(source,name)=>{const sandbox={};vm.runInNewContext(`${source};globalThis.__data=${name};`,sandbox);return sandbox.__data;};

test("纳甲歌逐卦保留内外天干、起支与六支顺序",()=>{
  const course=load(course0725Source,"course0725");
  assert.deepEqual(Array.from(course.najiaMnemonic,item=>item.verse),[
    "乾金甲子外壬午","坎水戊寅外戊申","艮土丙辰外丙戌","震木庚子外庚午",
    "巽木辛丑外辛未","离火己卯外己酉","坤土乙未外癸丑","兑金丁巳外丁亥"
  ]);
  assert.match(html,/id="najiaMnemonic0725"/);
  assert.match(app,/course0725\.najiaMnemonic/);
});

test("六神以日干定初爻起点并沿固定循环向上排",()=>{
  const course=load(course0808Source,"course0808");
  assert.deepEqual(Array.from(course.sixGodStartingRules,item=>`${item.stems}:${item.start}`),[
    "甲乙:青龙","丙丁:朱雀","戊:勾陈","己:螣蛇","庚辛:白虎","壬癸:玄武"
  ]);
  assert.deepEqual(Array.from(course.sixGodOrder),["青龙","朱雀","勾陈","螣蛇","白虎","玄武"]);
  assert.ok(course.sixGodDetails.every(item=>item.key&&item.images&&item.boundary));
  assert.match(html,/id="sixGodStart0808"/);
});

test("十二长生提供五行起点、入卦步骤、交互对照与使用边界",()=>{
  assert.match(app,/const changshengStarts=\{木:"亥",火:"寅",金:"巳",水:"申",土:"申"\}/);
  assert.match(app,/function renderChangshengApplication\(/);
  assert.match(html,/id="changshengCalculator"/);
  assert.match(html,/未土逢午支/);
  assert.match(html,/不越过月日、生克、动变直接定吉凶/);
});

test("土按水土同宫顺排，但临官禄位另按火土同宫区分戊己",()=>{
  assert.match(html,/土的临官\/禄位另按火土同宫：戊土参照丙火取巳，己土参照丁火取午/);
  assert.match(html,/土的临官例外/);
  assert.match(app,/\["木","火","金","水","土"\]/);
  assert.match(app,/earthOfficer\?"巳／午":cellBranch/);
  assert.match(app,/土的临官不用亥/);
  assert.doesNotMatch(app,/临官\*/);
});

 test("土的临官格及计算器实际渲染不再把亥当作土临官",()=>{
  const start=app.indexOf("const changshengStages ="),end=app.indexOf("const hiddenStemData",start);
  const fnStart=app.indexOf("function renderChangshengApplication()"),fnEnd=app.indexOf("function renderHiddenStems",fnStart);
  const nodes=new Map();
  const document={querySelector(selector){if(!nodes.has(selector))nodes.set(selector,{innerHTML:"",querySelectorAll:()=>[]});return nodes.get(selector);}};
  const sandbox={document};vm.createContext(sandbox);
  vm.runInContext('const branchOrder=["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];'+app.slice(start,end)+app.slice(fnStart,fnEnd)+';changshengState.element="土";changshengState.branch="亥";renderChangshengApplication();',sandbox);
  const table=nodes.get("#changshengTable").innerHTML;
  const earth=table.slice(table.lastIndexOf('<article'));
  assert.match(earth,/<small>临官<\/small><strong>巳／午<\/strong><em>戊／己<\/em>/);
  assert.doesNotMatch(earth,/<small>临官[^<]*<\/small><strong>亥/);
  assert.match(nodes.get("#changshengResult").innerHTML,/土爻遇亥：不取临官/);
  for(const [branch,label] of [["巳","戊土"],["午","己土"]]){
    vm.runInContext(`changshengState.branch="${branch}";renderChangshengApplication();`,sandbox);
    assert.ok(nodes.get("#changshengResult").innerHTML.includes(label+"临官/禄"));
  }
 });
