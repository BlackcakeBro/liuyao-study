import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css=fs.readFileSync('liuyao-study-github/styles.css','utf8');
const html=fs.readFileSync('liuyao-study-github/index.html','utf8');
const tablet=css.split('/* Tablet only:')[1];

test('tablet rules stay inside the extended edition and leave phone/desktop breakpoints alone',()=>{
  assert.ok(tablet);
  assert.match(tablet,/@media\(min-width:761px\) and \(max-width:1100px\)/);
  for(const line of tablet.split('\n').filter(line=>line.startsWith('  ')&&line.includes('{'))){
    assert.match(line,/html\[data-site-edition="extended"\]/);
  }
  assert.match(tablet,/\.main-nav\{[^}]*flex-wrap:wrap;[^}]*overflow:visible/);
  assert.match(tablet,/#judgment \.judgment-topic-rail\{[^}]*grid-template-columns:repeat\(2/);
  assert.match(tablet,/\.section-heading\{display:block\}/);
  assert.match(tablet,/#scroll0718Shell \.scroll-paper\{[^}]*border-image:url\("\.\/assets\/scroll-paper-0718\.webp"\) 58 30 58 30 fill/);
  assert.match(tablet,/#scroll0718Shell \.scroll-atlas-content\{padding-block:78px 88px\}/);
  assert.match(html,/styles\.css\?v=20260929-tablet-v35/);
});
