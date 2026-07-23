import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const html=fs.readFileSync("liuyao-study-github/index.html","utf8");
const app=fs.readFileSync("liuyao-study-github/app.js","utf8");
const css=fs.readFileSync("liuyao-study-github/styles.css","utf8");
const readme=fs.readFileSync("liuyao-study-github/README.md","utf8");

test("Qianlong Tongbao coin faces are embedded instead of relying on extra image requests",()=>{
  assert.match(css,/\.coins \.coin-front\{background-image:url\("data:image\/jpeg;base64,/);
  assert.match(css,/\.coins \.coin-back\{background-image:url\("data:image\/jpeg;base64,/);
  assert.doesNotMatch(css,/\.\/assets\/coin-(?:front|back)\.webp/);
  assert.match(app,/乾隆通宝铜钱/);
  assert.match(html,/乾隆通宝/);
});

test("the Qianlong Tongbao photograph carries its source and license attribution",()=>{
  assert.match(readme,/Coin\. Qing Dynasty\. Qianlong Tongbao\. Bao Quan/);
  assert.match(readme,/Murberget Länsmuseet Västernorrland/);
  assert.match(readme,/Public domain/);
});

test("the extended edition supports a fragment route that sends the same document request as the classic URL",()=>{
  assert.match(app,/const hashParams=new URLSearchParams\(location\.hash\.slice\(1\)\)/);
  assert.match(app,/hashParams\.get\("edition"\)==="extended"/);
  assert.match(app,/hashParams\.get\("view"\)\|\|siteParams\.get\("view"\)/);
  assert.match(app,/const requestedAnchor=hashParams\.get\("anchor"\)/);
  assert.match(app,/document\.getElementById\(requestedAnchor\)\?\.scrollIntoView/);
});
