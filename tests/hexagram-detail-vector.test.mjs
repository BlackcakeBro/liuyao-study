import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const app=fs.readFileSync("liuyao-study-github/app.js","utf8");
const css=fs.readFileSync("liuyao-study-github/styles.css","utf8");
const courseSource=fs.readFileSync("liuyao-study-github/course-0718.js","utf8");
const context={};
vm.createContext(context);
vm.runInContext(`${courseSource};this.course0718=course0718;`,context);
const names=context.course0718.palaceOrder.flatMap(key=>context.course0718.palaces[key].hexagrams.map(item=>item[0]));

test("single-hexagram detail renders six explicit yao lines",()=>{
  assert.match(app,/const trigramTopDown=/);
  assert.match(app,/function hexagramDetailMarkup\(name\)/);
  assert.match(app,/scroll-detail-hexagram/);
  assert.match(app,/scroll-detail-yao/);
  assert.doesNotMatch(app,/class="scroll-detail-glyph"[^>]*>\$\{h\[1\]\}/);
  assert.equal(names.length,64);
});

test("all eight natural-image trigrams have exact top-down line patterns",()=>{
  for(const [symbol,pattern] of Object.entries({
    天:"111",泽:"011",火:"101",雷:"001",风:"110",水:"010",山:"100",地:"000"
  })){
    assert.match(app,new RegExp(`${symbol}:"${pattern}"`));
  }
});

test("confirmed detail proportions are encoded in scoped CSS",()=>{
  assert.match(css,/\.scroll-detail-hexagram\{[^}]*width:176px[^}]*gap:16px/s);
  assert.match(css,/\.scroll-detail-yao\{[^}]*height:10px/s);
  assert.match(css,/\.scroll-detail-yao\.broken\{[^}]*gap:24px/s);
  assert.match(css,/\.scroll-detail-glyph-stage\{[^}]*height:167px[^}]*margin:10px 0 9px/s);
});
