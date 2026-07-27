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
  const nodes=renderWithDom(
    "render0718Palace",
    {
      course0718:loadCourse0718(),
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

  const fixedSize=declarations(containerRule);
  assert.ok(
    fixedSize.has("min-height")&&fixedSize.has("height")&&fixedSize.has("max-height"),
    "the same base detail-container rule must retain its min/height/max sizing contract"
  );
  assert.equal(fixedSize.get("min-height"),fixedSize.get("height"));
  assert.equal(fixedSize.get("height"),fixedSize.get("max-height"));
  assert.ok(contentRule);
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
  }
  assert.deepEqual(cardNames,new Set(["父母","官鬼"]));
  baseRuleMatching(
    ".relative-focus-grid>article",
    body=>{
      const rule=declarations(body);
      return rule.get("display")==="grid"&&/\b1fr\b/.test(rule.get("grid-template-rows")??"");
    },
    "display and stable header/body/boundary rows must coexist in the base card rule"
  );
  baseRuleMatching(".relative-card-body",body=>/min-(?:block-size|height)\s*:/.test(body));
  baseRuleMatching(".relative-card-boundary",body=>/min-(?:block-size|height)\s*:/.test(body));

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

test("classics roadmap progress is semantic and independent of display wording",()=>{
  const roadmap=loadTraining().classics.roadmap;
  for(const title of ["浑天甲子","六亲"]){
    const entry=roadmap.find(step=>step.title===title);
    assert.ok(entry,`${title} roadmap record is missing`);
    assert.equal(entry.progress,"learned",`${title} must carry progress:"learned"`);
  }

  const renderRoadmapStates=progresses=>{
    const sharedStep={n:"01",title:"同一标题",state:"完全相同的显示文字",detail:"同一说明"};
    const nodes=renderWithDom(
      "renderClassicsPreview",
      {
        extendedEdition:true,
        courseTraining:{classics:{
          roadmap:progresses.map(progress=>({...sharedStep,progress})),
          najia:[],shiYing:[],roles:[],boundary:""
        }}
      },
      [
        ["#classicsRoadmap",domNode()],
        ["#najiaTrigramPicker",null],
        ["#najiaDetail",null],
        ["#shiYingStages",null],
        ["#shiYingDetail",null],
        ["#classicsRoleChain",null]
      ]
    );
    return [...(nodes.get("#classicsRoadmap")?.innerHTML??"").matchAll(/<article\b[^>]*>/g)]
      .map(match=>attribute(match[0],"class").split(/\s+/));
  };
  const learnedState=classes=>classes.find(token=>/^(?:is-)?(?:learned|taught)$/.test(token));
  const previewState=classes=>classes.find(token=>/^(?:is-)?(?:preview|planned|upcoming)$/.test(token));
  const forward=renderRoadmapStates(["learned","preview"]);
  const reversed=renderRoadmapStates(["preview","learned"]);
  assert.equal(forward.length,2);
  assert.equal(reversed.length,2);
  assert.ok(learnedState(forward[0]));
  assert.ok(previewState(forward[1]));
  assert.ok(previewState(reversed[0]));
  assert.ok(learnedState(reversed[1]));
});
