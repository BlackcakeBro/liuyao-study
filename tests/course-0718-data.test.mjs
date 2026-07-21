import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import fs from "node:fs";

const source=fs.readFileSync("liuyao-study-github/course-0718.js","utf8")+"\n;globalThis.__course=course0718;";
const sandbox={};
vm.runInNewContext(source,sandbox);
const course=sandbox.__course;

test("eight palaces contain 64 unique hexagrams",()=>{
  assert.deepEqual(Array.from(course.palaceOrder),["乾","兑","离","震","巽","坎","艮","坤"]);
  const names=course.palaceOrder.flatMap(key=>course.palaces[key].hexagrams.map(item=>item[0]));
  assert.equal(names.length,64);
  assert.equal(new Set(names).size,64);
  course.palaceOrder.forEach(key=>assert.equal(course.palaces[key].hexagrams.length,8));
});

test("Dui palace is complete but all interpretations remain pending",()=>{
  const dui=course.palaces["兑"];
  assert.deepEqual(Array.from(dui.hexagrams,x=>x[0]),["兑为泽","泽水困","泽地萃","泽山咸","水山蹇","地山谦","雷山小过","雷泽归妹"]);
  assert.ok(dui.hexagrams.every(x=>x[2]==="待陈师下节课补充"));
});
