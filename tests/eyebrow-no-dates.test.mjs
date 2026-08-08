import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const html=fs.readFileSync("liuyao-study-github/index.html","utf8");

test("English eyebrow titles never contain lesson dates",()=>{
  const eyebrowTitles=[...html.matchAll(/<span class="eyebrow">([^<]+)<\/span>/g)].map(match=>match[1]);
  assert.ok(eyebrowTitles.length>=8);
  eyebrowTitles.forEach(title=>assert.doesNotMatch(title,/20\d{2}[-/]\d{2}[-/]\d{2}/,title));
  assert.ok(eyebrowTitles.includes("LECTURE MODULE · CORE STRUCTURE"));
  assert.ok(eyebrowTitles.includes("LECTURE MODULE · ASSEMBLY, RELATIVES &amp; SIX GODS"));
});
