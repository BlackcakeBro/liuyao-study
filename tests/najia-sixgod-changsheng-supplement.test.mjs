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
