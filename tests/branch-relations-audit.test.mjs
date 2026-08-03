import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const app=fs.readFileSync(new URL("../liuyao-study-github/app.js",import.meta.url),"utf8");
const html=fs.readFileSync(new URL("../liuyao-study-github/index.html",import.meta.url),"utf8");
const start=app.indexOf("const branchRelationTypes =")+"const branchRelationTypes =".length;
const end=app.indexOf("const branchRelationState",start);
const relations=JSON.parse(JSON.stringify(vm.runInNewContext(`(${app.slice(start,end).trim().replace(/;$/,'')})`)));

test("all classroom-audited earthly-branch relationships are encoded exactly",()=>{
  assert.deepEqual(relations.sanhe.groups.map(group=>[...group]),[["亥","卯","未"],["寅","午","戌"],["巳","酉","丑"],["申","子","辰"]]);
  assert.deepEqual(relations.liuchong.pairs.map(pair=>[...pair]),[["子","午"],["丑","未"],["寅","申"],["卯","酉"],["辰","戌"],["巳","亥"]]);
  assert.deepEqual(relations.liuhe.pairs.map(pair=>[...pair]),[["子","丑"],["寅","亥"],["卯","戌"],["辰","酉"],["巳","申"],["午","未"]]);
  assert.deepEqual(relations.xing.groups.map(group=>[...group]),[["子","卯"],["丑","未","戌"],["寅","巳","申"],["辰"],["午"],["酉"],["亥"]]);
  assert.deepEqual(relations.chuan.pairs.map(pair=>[...pair]),[["子","未"],["丑","午"],["寅","巳"],["卯","辰"],["申","亥"],["酉","戌"]]);
  assert.deepEqual(relations.jue.pairs.map(pair=>[...pair]),[["子","巳"],["午","亥"],["寅","酉"],["卯","申"]]);
  assert.deepEqual(relations.anhe.pairs.map(pair=>[...pair]),[["寅","丑"],["卯","申"],["子","巳"],["午","亥"]]);

  const pairTypes=new Map();
  Object.entries(relations).forEach(([type,relation])=>(relation.groups||relation.pairs).forEach(group=>{
    for(let i=0;i<group.length;i++)for(let j=i+1;j<group.length;j++){
      const pair=[group[i],group[j]].sort().join("");
      pairTypes.set(pair,[...(pairTypes.get(pair)||[]),type]);
    }
  }));
  assert.deepEqual([...pairTypes].filter(([,types])=>types.length>1).map(([pair,types])=>`${pair}:${types.join("+")}`).sort(),[
    "丑未:liuchong+xing","亥午:jue+anhe","卯申:jue+anhe","子巳:jue+anhe",
    "寅巳:xing+chuan","寅申:liuchong+xing","巳申:liuhe+xing"
  ]);
});

test("the inspector exposes overlapping relationships instead of implying exclusivity",()=>{
  assert.match(app,/function overlappingRelationsFor\(/);
  assert.match(app,/兼有关系/);
  assert.match(app,/自刑/);
  assert.match(app,/子中癸与巳中戊暗合/);
  assert.match(html,/同一对地支可以同时成立多种关系；当前类型只是筛选观察，不代表排除其他关系。/);
});
