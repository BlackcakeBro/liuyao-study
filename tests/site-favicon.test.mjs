import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const html=fs.readFileSync("liuyao-study-github/index.html","utf8");

test("browser tab uses the same red 爻 seal as the site header",()=>{
  assert.doesNotMatch(html,/<link\s+rel="icon"\s+href="data:,">/);
  assert.match(
    html,
    /<link\s+rel="icon"\s+type="image\/svg\+xml"\s+href="\.\/favicon\.svg\?v=20260808-logo-v1">/
  );
  const favicon=fs.readFileSync("liuyao-study-github/favicon.svg","utf8");
  assert.match(favicon,/fill="#9f3b2d"/);
  assert.match(favicon,/>爻<\/text>/);
});
