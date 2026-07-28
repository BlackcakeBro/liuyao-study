import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const html=fs.readFileSync("liuyao-study-github/index.html","utf8");
const app=fs.readFileSync("liuyao-study-github/app.js","utf8");
const css=fs.readFileSync("liuyao-study-github/styles.css","utf8");
const dataSource=fs.readFileSync("liuyao-study-github/data.js","utf8");
const course0718Source=fs.readFileSync("liuyao-study-github/course-0718.js","utf8");
const course0725Source=fs.readFileSync("liuyao-study-github/course-0725.js","utf8");
const trainingSource=fs.readFileSync("liuyao-study-github/training-bank.js","utf8");

const matchingBrace=(source,open)=>{
  let depth=0;
  let quote="";
  let escaped=false;
  let lineComment=false;
  let blockComment=false;
  for(let index=open;index<source.length;index+=1){
    const char=source[index],next=source[index+1];
    if(lineComment){
      if(char==="\n")lineComment=false;
      continue;
    }
    if(blockComment){
      if(char==="*"&&next==="/"){blockComment=false;index+=1;}
      continue;
    }
    if(quote){
      if(escaped){escaped=false;continue;}
      if(char==="\\"){escaped=true;continue;}
      if(char===quote)quote="";
      continue;
    }
    if(char==="/"&&next==="/"){lineComment=true;index+=1;continue;}
    if(char==="/"&&next==="*"){blockComment=true;index+=1;continue;}
    if(char==="'"||char==='"'){quote=char;continue;}
    if(char==="{")depth+=1;
    if(char==="}"){
      depth-=1;
      if(depth===0)return index;
    }
  }
  return -1;
};

const functionSource=name=>{
  const start=app.indexOf(`function ${name}(`);
  const open=app.indexOf("{",start);
  const close=matchingBrace(app,open);
  assert.ok(start>=0&&open>start&&close>open,`could not isolate ${name}`);
  return app.slice(start,close+1);
};

const normalizedSelector=selector=>selector.replace(/\s+/g,"");
const parseCssRules=(source,contexts=[])=>{
  const rules=[];
  let cursor=0;
  while(cursor<source.length){
    const open=source.indexOf("{",cursor);
    if(open<0)break;
    const prelude=source.slice(cursor,open).replace(/\/\*[\s\S]*?\*\//g,"").trim();
    const close=matchingBrace(source,open);
    if(close<0)break;
    const body=source.slice(open+1,close);
    if(prelude.startsWith("@")){
      rules.push(...parseCssRules(body,[...contexts,prelude]));
    }else if(prelude){
      rules.push({selectors:prelude.split(",").map(item=>normalizedSelector(item)),body,contexts});
    }
    cursor=close+1;
  }
  return rules;
};
const parsedCss=parseCssRules(css);
const cssRuleBodies=(selector,{baseOnly=true}={})=>parsedCss
  .filter(rule=>(!baseOnly||rule.contexts.length===0)&&rule.selectors.includes(normalizedSelector(selector)))
  .map(rule=>rule.body);
const declarations=body=>new Map(
  body.split(";")
    .map(item=>item.split(/:(.*)/s).slice(0,2).map(value=>value.trim()))
    .filter(([property,value])=>property&&value)
);
const baseRuleMatching=(selector,predicate,message)=>{
  const body=cssRuleBodies(selector).find(predicate);
  assert.ok(body,message??`${selector} base rule is missing required declarations`);
  return body;
};

const loadCourse0725=()=>{
  const sandbox={};
  vm.runInNewContext(`${course0725Source};globalThis.__course=course0725;`,sandbox);
  return sandbox.__course;
};
const loadCourse0718=()=>{
  const sandbox={};
  vm.runInNewContext(`${course0718Source};globalThis.__course=course0718;`,sandbox);
  return sandbox.__course;
};

const loadTraining=()=>{
  const sandbox={window:{}};
  vm.createContext(sandbox);
  vm.runInContext(dataSource,sandbox);
  vm.runInContext(course0718Source,sandbox);
  vm.runInContext(course0725Source,sandbox);
  vm.runInContext(trainingSource,sandbox);
  return sandbox.window.LIUYAO_TRAINING;
};

const domNode=()=>({innerHTML:""});
const renderWithDom=(functionName,globals,selectorEntries,args=[])=>{
  const nodes=new Map(selectorEntries);
  const document={
    querySelector(selector){
      assert.ok(nodes.has(selector),`${functionName} queried undeclared DOM node ${selector}`);
      return nodes.get(selector);
    }
  };
  const sandbox={document,__args:args,...globals};
  vm.runInNewContext(`"use strict";${functionSource(functionName)};${functionName}(...__args);`,sandbox);
  return nodes;
};

const attribute=(tag,name)=>{
  const escaped=name.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  return tag.match(new RegExp(`\\b${escaped}="([^"]*)"`))?.[1]??"";
};
const tagsWithClass=(markup,token)=>[...markup.matchAll(/<[^/!][^>]*>/g)]
  .map(match=>match[0])
  .filter(tag=>attribute(tag,"class").split(/\s+/).includes(token));

const assertClosedCycle=(edgeTags,nodeNames,tone,expectedPairs)=>{
  assert.equal(edgeTags.length,5,`${tone} cycle must render five directed edges`);
  const from=edgeTags.map(tag=>attribute(tag,"data-from"));
  const to=edgeTags.map(tag=>attribute(tag,"data-to"));
  assert.ok(from.every(Boolean)&&to.every(Boolean),`${tone} edges need explicit endpoints`);
  assert.deepEqual(new Set(from),nodeNames,`${tone} must leave every node exactly once`);
  assert.deepEqual(new Set(to),nodeNames,`${tone} must enter every node exactly once`);
  assert.deepEqual(
    new Set(edgeTags.map(tag=>`${attribute(tag,"data-from")}→${attribute(tag,"data-to")}`)),
    new Set(expectedPairs),
    `${tone} edges must preserve the intended directed relationships`
  );

  const nextByNode=new Map(edgeTags.map(tag=>[
    attribute(tag,"data-from"),
    attribute(tag,"data-to")
  ]));
  const start=nodeNames.values().next().value;
  const visited=new Set();
  let cursor=start;
  for(let step=0;step<nodeNames.size;step+=1){
    assert.ok(!visited.has(cursor),`${tone} must not contain a self-loop or shorter disconnected cycle`);
    visited.add(cursor);
    cursor=nextByNode.get(cursor);
  }
  assert.equal(cursor,start,`${tone} must close only after traversing all five nodes`);
  assert.deepEqual(visited,nodeNames,`${tone} must form one connected five-node cycle`);
};

test("single-hexagram detail moves as one consistently sized content group",()=>{
  const classList={add(){},remove(){}};
  const meta={innerHTML:"",classList};
  const course=loadCourse0718();
  const nodes=renderWithDom(
    "render0718Palace",
    {
      course0718:course,
      atlas0718State:{palace:"乾",hexagram:null},
      palace0718SwitchTimer:null,
      hexagramDetailMarkup:()=>'<div class="glyph-probe"></div>'
    },
    [
      ["#scroll0718PalaceTabs",{innerHTML:"",querySelectorAll:()=>[]}],
      ["#scroll0718PalaceMeta",meta],
      ["#scroll0718GuaGrid",{innerHTML:"",querySelectorAll:()=>[]}],
      ["#lecture0718 .scroll-atlas-content",{classList}]
    ],
    ["乾",0]
  );
  const detailMarkup=nodes.get("#scroll0718PalaceMeta").innerHTML.trim();
  const firstTag=detailMarkup.match(/^<[^>]+>/)?.[0]??"";

  assert.match(
    firstTag,
    /^<div\b[^>]*>/,
    "single-hexagram detail must begin with a content-group element"
  );
  assert.ok(
    attribute(firstTag,"class").split(/\s+/).includes("scroll-detail-content"),
    "all single-hexagram detail markup must be enclosed by one scroll-detail-content group"
  );
  assert.match(detailMarkup,/<\/div>\s*$/,"the content-group wrapper must close after all detail markup");
  assert.equal(
    tagsWithClass(detailMarkup,"scroll-detail-content").length,
    1,
    "the detail template must have one content-group wrapper"
  );

  const containerRule=baseRuleMatching(
    ".scroll-palace-meta",
    body=>[
      /--scroll-detail-(?:gutter|inline-gutter)\s*:/,
      /--scroll-detail-(?:offset|lift)(?:-y)?\s*:/,
      /box-sizing\s*:\s*border-box/,
      /padding(?:-inline)?\s*:[^;]*var\(--scroll-detail-(?:gutter|inline-gutter)/
    ].every(pattern=>pattern.test(body)),
    "shared gutter, offset, sizing, and padding declarations must coexist in the base detail-container rule"
  );
  const contentRule=baseRuleMatching(
    ".scroll-detail-content",
    body=>/(?:transform\s*:[^;]*translateY|translate|top|margin-block-start)\s*:[^;]*var\(--scroll-detail-(?:offset|lift)(?:-y)?/.test(body),
    "the base content-group rule must consume the shared vertical offset"
  );

  const detailSize=declarations(baseRuleMatching(
    ".scroll-palace-meta.is-hexagram-detail",
    body=>/min-height\s*:/.test(body)&&/height\s*:\s*490px/.test(body)&&/max-height\s*:\s*490px/.test(body),
    "desktop detail mode must preserve the shared 490px scroll frame"
  ));
  assert.ok(detailSize.has("min-height"),"detail mode needs a stable visual minimum");
  assert.equal(detailSize.get("height"),"490px");
  assert.equal(detailSize.get("max-height"),"490px");
  assert.equal(
    detailSize.get("overflow-y"),
    "auto",
    "desktop detail mode must scroll longer or zoomed copy within the fixed frame"
  );
  assert.equal(
    detailSize.get("align-items"),
    "safe center",
    "overflowed detail copy must remain reachable from the top of its scroll frame"
  );
  assert.ok(contentRule);

  const atlasHeading=declarations(baseRuleMatching(
    ".scroll-atlas-heading",
    body=>/align-items\s*:/.test(body),
    "the atlas heading needs an explicit cross-axis alignment"
  ));
  assert.equal(
    atlasHeading.get("align-items"),
    "start",
    "the heading description must top-align with the title"
  );

  const responsiveRule=(selector,width)=>parsedCss.find(rule=>
    rule.selectors.includes(normalizedSelector(selector))&&
    rule.contexts.some(context=>context.includes(`max-width:${width}px`))
  )?.body??"";
  const tabletOverview=declarations(responsiveRule(".scroll-palace-meta",1080));
  assert.equal(tabletOverview.get("min-height"),"auto","responsive palace overviews must remain content-sized");
  assert.equal(tabletOverview.get("height"),"auto","responsive palace overviews must not inherit the fixed detail height");
  assert.equal(tabletOverview.get("max-height"),"none","responsive palace overviews must not leave fixed-height blank gaps");
  for(const width of [1080,760]){
    const detail=declarations(responsiveRule(".scroll-palace-meta.is-hexagram-detail",width));
    assert.ok(detail.has("min-height"),`${width}px detail mode needs a stable visual minimum`);
    assert.equal(detail.get("height"),"auto",`${width}px detail mode must grow with wrapped content`);
    assert.equal(detail.get("max-height"),"none",`${width}px detail mode must not clip longer content`);
  }
  assert.match(
    responsiveRule(".scroll-detail-content",1080),
    /grid-column\s*:\s*1\s*\/\s*-1/,
    "tablet detail content must span the complete parent width"
  );
  assert.match(
    responsiveRule(".scroll-palace-meta.is-hexagram-detail",760),
    /grid-template-columns\s*:\s*1fr/,
    "mobile detail mode must reset inherited parent columns"
  );
  assert.match(
    responsiveRule(".site-header",1100),
    /grid-template-columns\s*:\s*auto\s+minmax\(0\s*,\s*1fr\)/,
    "tablet header must preserve the brand while allowing navigation to shrink"
  );
  assert.match(responsiveRule(".brand",1100),/min-width\s*:\s*0/);
  assert.doesNotMatch(responsiveRule(".brand",1100),/display\s*:\s*none/);
  assert.match(
    responsiveRule(".main-nav",1100),
    /min-width\s*:\s*0[\s\S]*max-width\s*:\s*100%[\s\S]*overflow-x\s*:\s*auto/,
    "tablet navigation must scroll internally instead of widening the page"
  );
  assert.match(
    responsiveRule(".nav-item",1100),
    /flex\s*:\s*0\s+0\s+auto/,
    "tablet navigation items must stay readable inside the internal scroller"
  );
  assert.match(
    responsiveRule(".site-header",760),
    /grid-template-columns\s*:\s*1fr\s+auto/,
    "mobile header must retain its established brand layout"
  );
  const mobileHeader=declarations(responsiveRule(".site-header",760));
  assert.equal(
    mobileHeader.get("backdrop-filter"),
    "none",
    "mobile header must not establish a containing block that traps its fixed navigation"
  );
  assert.equal(
    mobileHeader.get("-webkit-backdrop-filter"),
    "none",
    "mobile Safari must not trap fixed navigation inside the sticky header"
  );
  assert.match(
    mobileHeader.get("background")??"",
    /rgba?\(/,
    "mobile header must retain an opaque or near-opaque reading surface without blur"
  );
  const mobileNav=declarations(responsiveRule(".main-nav",760));
  assert.equal(mobileNav.get("position"),"fixed","mobile navigation must remain viewport-fixed");
  assert.equal(mobileNav.get("left"),"12px","mobile navigation must stay inside the left viewport edge");
  assert.equal(mobileNav.get("right"),"12px","mobile navigation must stay inside the right viewport edge");
  assert.match(
    mobileNav.get("bottom")??"",
    /env\(safe-area-inset-bottom/,
    "mobile navigation must clear the viewport safe area"
  );
  assert.equal(
    mobileNav.get("overflow-x"),
    "auto",
    "mobile navigation must scroll internally instead of widening the page"
  );
  assert.match(
    responsiveRule(".nav-item",760),
    /flex\s*:\s*0\s+0\s+auto/,
    "mobile navigation labels must remain readable rather than shrink and clip"
  );
  const mobilePathHero=declarations(responsiveRule(".path-hero",760));
  assert.equal(
    mobilePathHero.get("grid-template-columns"),
    "minmax(0,1fr)",
    "mobile path content must use a shrinkable grid track instead of inheriting a wide intrinsic minimum"
  );
  assert.notEqual(
    mobilePathHero.get("overflow"),
    "hidden",
    "mobile path containment must resize its content rather than clip it"
  );
  const pathCompass=declarations(baseRuleMatching(".path-compass",body=>
    /width\s*:\s*440px/.test(body)&&/max-width\s*:\s*100%/.test(body)
  ));
  assert.equal(pathCompass.get("width"),"440px","the path compass needs one stable logical coordinate system");
  const mobileCompass=declarations(responsiveRule(".path-compass",760));
  assert.equal(mobileCompass.get("max-width"),"none","mobile orbit coordinates must retain their 440px logical canvas");
  const mediaApplies=(contexts,width)=>contexts
    .filter(context=>context.startsWith("@media"))
    .every(context=>{
      const minimum=Number(context.match(/min-width\s*:\s*(\d+)px/)?.[1]??0);
      const maximum=Number(context.match(/max-width\s*:\s*(\d+)px/)?.[1]??Infinity);
      return width>=minimum&&width<=maximum;
    });
  const fallbackCompassAt=width=>{
    const resolved=new Map();
    parsedCss
      .filter(rule=>
        rule.selectors.includes(normalizedSelector(".path-compass"))
        &&!rule.contexts.some(context=>context.startsWith("@supports"))
        &&mediaApplies(rule.contexts,width)
      )
      .forEach(rule=>declarations(rule.body).forEach((value,property)=>resolved.set(property,value)));
    return resolved;
  };
  for(const [width,zoom] of [
    [320,".65"],[359,".65"],
    [360,".75"],[381,".75"],
    [382,".8"],[390,".8"],
    [391,".82"],[760,".82"]
  ]){
    assert.equal(
      fallbackCompassAt(width).get("zoom"),
      zoom,
      `${width}px must have a portable numeric compass fallback`
    );
  }
  assert.equal(
    fallbackCompassAt(761).get("zoom"),
    undefined,
    "portable mobile compass scaling must stop before the tablet breakpoint"
  );
  const advancedCompassRules=parsedCss.filter(rule=>{
    const zoom=declarations(rule.body).get("zoom")??"";
    return rule.selectors.includes(normalizedSelector(".path-compass"))&&zoom.includes("/");
  });
  assert.equal(advancedCompassRules.length,1,"typed division must have one isolated progressive enhancement");
  assert.ok(
    advancedCompassRules[0].contexts.some(context=>
      context.startsWith("@supports")&&context.includes("zoom:calc(1px / 1px)")
    ),
    "typed length division must only run behind a matching zoom feature query"
  );
  assert.ok(
    advancedCompassRules[0].contexts.some(context=>context.includes("max-width:760px")),
    "advanced scaling must remain mobile-only"
  );
  assert.equal(mobileCompass.get("transform"),"none","mobile containment must not use paint-only scaling");
  assert.notEqual(mobileCompass.get("overflow"),"hidden","mobile compass controls must be resized, not clipped");
});

test("07-25 six-relative relationships use one accessible SVG with distinct sheng and ke edges",()=>{
  const course=loadCourse0725();
  const nodes=renderWithDom(
    "render0725Course",
    {course0725:course},
    [
      ["#assembly0725Grid",domNode()],
      ["#shiying0725Roles",domNode()],
      ["#relative0725Cycles",domNode()],
      ["#relative0725Focus",domNode()],
      ["#judgment0725Rules",domNode()],
      ["#next0725Lesson",domNode()]
    ]
  );
  const cycleMarkup=nodes.get("#relative0725Cycles")?.innerHTML??"";
  const svgs=[...cycleMarkup.matchAll(/<svg\b[\s\S]*?<\/svg>/g)].map(match=>match[0]);
  assert.equal(
    svgs.length,
    1,
    "#relative0725Cycles must receive exactly one combined SVG diagram"
  );
  const svg=svgs[0];
  const svgTag=svg.match(/^<svg\b[^>]*>/)?.[0]??"";
  assert.equal(attribute(svgTag,"role"),"img");
  assert.ok(
    Boolean(attribute(svgTag,"aria-label"))||/<title>[^<]+<\/title>/.test(svg),
    "the relationship SVG needs an accessible name"
  );
  const nodeTags=tagsWithClass(svg,"relative-cycle-node");
  const nodeNames=new Set(nodeTags.map(tag=>attribute(tag,"data-relative")));
  assert.equal(nodeTags.length,5,"the shared diagram must render five relative nodes");
  assert.equal(nodeNames.size,5,"each relative node needs a stable semantic identity");

  const edgeTags=tagsWithClass(svg,"relative-cycle-edge");
  const shengEdges=edgeTags.filter(tag=>attribute(tag,"class").split(/\s+/).includes("sheng"));
  const keEdges=edgeTags.filter(tag=>attribute(tag,"class").split(/\s+/).includes("ke"));
  const pairs=(relations,verb)=>relations.map(relation=>{
    const [from,to]=relation.split(verb);
    return `${from}→${to}`;
  });
  assertClosedCycle(shengEdges,nodeNames,"sheng",pairs(course.relativeCycles.generating,"生"));
  assertClosedCycle(keEdges,nodeNames,"ke",pairs(course.relativeCycles.controlling,"克"));

  const shengRule=baseRuleMatching(".relative-cycle-edge.sheng",body=>/stroke\s*:/.test(body));
  const keRule=baseRuleMatching(".relative-cycle-edge.ke",body=>/stroke\s*:/.test(body));
  assert.match(shengRule,/stroke\s*:/);
  assert.match(keRule,/stroke\s*:/);
  assert.notEqual(shengRule.replace(/\s+/g,""),keRule.replace(/\s+/g,""));
});

test("relative cards and judgment boundary expose stable aligned regions",()=>{
  const nodes=renderWithDom(
    "render0725Course",
    {course0725:loadCourse0725()},
    [
      ["#assembly0725Grid",domNode()],
      ["#shiying0725Roles",domNode()],
      ["#relative0725Cycles",domNode()],
      ["#relative0725Focus",domNode()],
      ["#judgment0725Rules",domNode()],
      ["#next0725Lesson",domNode()]
    ]
  );
  const focusMarkup=nodes.get("#relative0725Focus")?.innerHTML??"";
  const cards=[...focusMarkup.matchAll(/<article\b[\s\S]*?<\/article>/g)]
    .map(match=>match[0]);
  assert.equal(cards.length,2,"父母、官鬼必须各自渲染为一张卡片");
  const cardNames=new Set();
  for(const card of cards){
    const name=card.match(/<h3\b[^>]*>\s*(父母|官鬼)爻\s*<\/h3>/)?.[1]??"";
    assert.ok(name==="父母"||name==="官鬼","每张卡片必须保留稳定的六亲身份");
    cardNames.add(name);
    assert.equal(
      tagsWithClass(card,"relative-card-body").length,
      1,
      `${name}卡片需要且只能有一个 relative-card-body 区域`
    );
    assert.equal(
      tagsWithClass(card,"relative-card-boundary").length,
      1,
      `${name}卡片需要且只能有一个 relative-card-boundary 区域`
    );
    assert.equal(
      tagsWithClass(card,"relative-layers").filter(tag=>/^<dl\b/.test(tag)).length,
      1,
      `${name}卡片的三层取象必须使用一个语义化定义列表`
    );
    assert.equal((card.match(/<dt\b/g)??[]).length,3,`${name}卡片必须包含三项取象名称`);
    assert.equal((card.match(/<dd\b/g)??[]).length,3,`${name}卡片必须包含三项取象内容`);
  }
  assert.deepEqual(cardNames,new Set(["父母","官鬼"]));
  const cardRule=baseRuleMatching(
    ".relative-focus-grid>article",
    body=>{
      const rule=declarations(body);
      return rule.get("display")==="grid"
        &&/^auto\s+minmax\([^)]*1fr\)\s+auto$/.test(rule.get("grid-template-rows")??"");
    },
    "fallback card rows must let the header and boundary grow"
  );
  assert.doesNotMatch(cardRule,/overflow\s*:\s*hidden/,"relative cards must not clip enlarged copy");
  assert.ok(
    parsedCss.some(rule=>
      rule.selectors.includes(normalizedSelector(".relative-focus-grid"))
      &&rule.contexts.some(context=>/^@supports\b/.test(context)&&/subgrid/.test(context))
      &&/grid-template-rows\s*:\s*auto\s+minmax\([^)]*1fr\)\s+auto/.test(rule.body)
    ),
    "desktop focus grid must own three growth-capable shared tracks"
  );
  assert.ok(
    parsedCss.some(rule=>
      rule.selectors.includes(normalizedSelector(".relative-focus-grid>article"))
      &&rule.contexts.some(context=>/^@supports\b/.test(context)&&/subgrid/.test(context))
      &&/grid-row\s*:\s*span\s+3/.test(rule.body)
      &&/grid-template-rows\s*:\s*subgrid/.test(rule.body)
    ),
    "desktop cards must span and subgrid the shared header/body/boundary tracks"
  );
  assert.ok(
    parsedCss.some(rule=>
      rule.selectors.includes(normalizedSelector(".relative-focus-grid>article"))
      &&rule.contexts.some(context=>/^@media\b/.test(context)&&/max-width\s*:\s*1000px/.test(context))
      &&/grid-row\s*:\s*auto/.test(rule.body)
      &&/grid-template-rows\s*:\s*auto\s+minmax\([^)]*1fr\)\s+auto/.test(rule.body)
    ),
    "single-column cards must reset to independent growth-capable rows"
  );

  const judgmentSections=[...html.matchAll(/<section\b[^>]*class="[^"]*\bjudgment-boundary\b[^"]*"[^>]*>[\s\S]*?<\/section>/g)]
    .map(match=>match[0]);
  assert.equal(judgmentSections.length,1,"judgment regions must share one judgment-boundary section");
  const judgmentSection=judgmentSections[0];
  assert.equal(tagsWithClass(judgmentSection,"judgment-boundary__title").length,1);
  assert.equal(tagsWithClass(judgmentSection,"judgment-boundary__rules").length,1);
  assert.equal(tagsWithClass(judgmentSection,"judgment-boundary__next").length,1);
  const rulesTag=judgmentSection.match(/<[^>]*id="judgment0725Rules"[^>]*>/)?.[0]??"";
  const nextTag=judgmentSection.match(/<[^>]*id="next0725Lesson"[^>]*>/)?.[0]??"";
  assert.ok(attribute(rulesTag,"class").split(/\s+/).includes("judgment-boundary__rules"));
  assert.ok(attribute(nextTag,"class").split(/\s+/).includes("judgment-boundary__next"));
  baseRuleMatching(".judgment-boundary",body=>/grid-template-areas\s*:/.test(body));
  baseRuleMatching(".judgment-boundary__title",body=>/grid-area\s*:\s*title/.test(body));
  baseRuleMatching(".judgment-boundary__rules",body=>/grid-area\s*:\s*rules/.test(body));
  baseRuleMatching(".judgment-boundary__next",body=>/grid-area\s*:\s*next/.test(body));
});

test("classics reference is source-backed and ships with one fresh cache version",()=>{
  const training=loadTraining();
  assert.deepEqual(Array.from(training.classics.chapterOrder),[
    "八卦与占卦法","八宫六十四卦","浑天甲子","六亲","世应","动变","用神与元忌仇"
  ]);
  assert.match(app,/function renderClassicsReference\(/);
  assert.match(app,/course0725\.classicsReferences/);
  assert.match(app,/course0725\.classicsCases/);
  assert.doesNotMatch(html,/id="classicsRoadmap"/);

  const coupledAssetVersions=[
    ...html.matchAll(/(?:href|src)="\.\/(?:styles\.css|course-0725\.js|training-bank\.js|app\.js)\?v=([^"]+)"/g)
  ].map(match=>match[1]);
  assert.deepEqual(
    coupledAssetVersions,
    Array(4).fill("20260728-classics-reference-v7"),
    "course data, renderer, training bank, and styling must ship with one fresh cache version"
  );
});
