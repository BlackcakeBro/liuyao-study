const {
  elements, elementImages, hetu, luoshu, stems, correspondences, solarTerms, seasonalElementNotes,
  seasons, branches, trigrams, sixRelatives, yongshenTopics, learningSteps
} = window.LIUYAO_DATA;
const categoryNames = { people:"人物", places:"场所", objects:"器物", animals:"动物", body:"身体", events:"人事情境", symbols:"神将组合" };
const cycle = ["木","火","土","金","水"];
const generating = { 木:"火", 火:"土", 土:"金", 金:"水", 水:"木" };
const controlling = { 木:"土", 土:"水", 水:"火", 火:"金", 金:"木" };
const generatedBy = Object.fromEntries(Object.entries(generating).map(([a,b]) => [b,a]));
const controlledBy = Object.fromEntries(Object.entries(controlling).map(([a,b]) => [b,a]));
const savedQuizStats = JSON.parse(localStorage.getItem("liuyao-quiz-stats") || '{"correct":0,"total":0}');
const state = {
  view:"path", element:"all", category:"all", search:"", flashIndex:0, quiz:null, quizCorrect:savedQuizStats.correct||0, quizTotal:savedQuizStats.total||0,
  selfElement:"木", cast:[], mastery:JSON.parse(localStorage.getItem("liuyao-mastery") || "{}"),
  viewed:new Set(JSON.parse(localStorage.getItem("liuyao-viewed") || "[]")),
  learnedModules:new Set(JSON.parse(localStorage.getItem("liuyao-learned-modules") || "[]")),
  castMode:"random", manualCoins:["字","背","字"]
};
const learningModules = [
  ["foundation-01","术数定位"],["foundation-02","五行能量与万物象"],["foundation-03","五行生克与六亲"],
  ["foundation-04","河图洛书与先后天八卦"],["foundation-05","四时旺衰"],["foundation-06","地支时空"],
  ["foundation-07","八卦体系"],["foundation-08","十天干"],["foundation-09","五味五脏五常"],
  ["foundation-10","节气月令"],["foundation-11","四时五行细论"],["casting-workbench","起卦与动变"],
  ["casting-relatives","古籍六亲"],["casting-yongshen","取用神"],["branches-images","十二地支万物类象"]
];
const hexagramNames = {
  "乾乾":"乾为天","乾兑":"天泽履","乾离":"天火同人","乾震":"天雷无妄","乾巽":"天风姤","乾坎":"天水讼","乾艮":"天山遁","乾坤":"天地否",
  "兑乾":"泽天夬","兑兑":"兑为泽","兑离":"泽火革","兑震":"泽雷随","兑巽":"泽风大过","兑坎":"泽水困","兑艮":"泽山咸","兑坤":"泽地萃",
  "离乾":"火天大有","离兑":"火泽睽","离离":"离为火","离震":"火雷噬嗑","离巽":"火风鼎","离坎":"火水未济","离艮":"火山旅","离坤":"火地晋",
  "震乾":"雷天大壮","震兑":"雷泽归妹","震离":"雷火丰","震震":"震为雷","震巽":"雷风恒","震坎":"雷水解","震艮":"雷山小过","震坤":"雷地豫",
  "巽乾":"风天小畜","巽兑":"风泽中孚","巽离":"风火家人","巽震":"风雷益","巽巽":"巽为风","巽坎":"风水涣","巽艮":"风山渐","巽坤":"风地观",
  "坎乾":"水天需","坎兑":"水泽节","坎离":"水火既济","坎震":"水雷屯","坎巽":"水风井","坎坎":"坎为水","坎艮":"水山蹇","坎坤":"水地比",
  "艮乾":"山天大畜","艮兑":"山泽损","艮离":"山火贲","艮震":"山雷颐","艮巽":"山风蛊","艮坎":"山水蒙","艮艮":"艮为山","艮坤":"山地剥",
  "坤乾":"地天泰","坤兑":"地泽临","坤离":"地火明夷","坤震":"地雷复","坤巽":"地风升","坤坎":"地水师","坤艮":"地山谦","坤坤":"坤为地"
};

function colorOf(e) { return elements[e].color; }
function shuffle(a) { return [...a].sort(() => Math.random() - .5); }
function setView(view) {
  state.view = view;
  document.querySelectorAll(".view").forEach(el => el.classList.toggle("active", el.id === view));
  document.querySelectorAll(".nav-item").forEach(el => el.classList.toggle("active", el.dataset.view === view));
  window.scrollTo({ top:0, behavior:"smooth" });
  if (view === "training" && !state.quiz) createQuiz();
  requestAnimationFrame(()=>{
    revealVisibleSections();
    window.activateWaterSurface?.();
  });
}

function renderPath() {
  const orbit = document.querySelector("#pathOrbit");
  orbit.innerHTML = learningSteps.map((s,i) => {
    const angle = -90 + i * 45, r = 172;
    return `<button data-step="${i}" style="left:${210+Math.cos(angle*Math.PI/180)*r}px;top:${210+Math.sin(angle*Math.PI/180)*r}px"><b>${s.n}</b><span>${s.title}</span></button>`;
  }).join("");
  const chain = document.querySelector("#learningChain");
  chain.innerHTML = learningSteps.map((s,i) => `<button data-step="${i}" class="${i===0?"active":""}"><b>${s.n}</b><span>${s.title}</span><small>${s.subtitle}</small></button>`).join("");
  const show = i => {
    const s = learningSteps[i];
    document.querySelector("#chainDetail").innerHTML = `<span>${s.n}</span><div><h3>${s.title} · ${s.subtitle}</h3><p>${s.detail}</p></div>`;
    document.querySelectorAll("[data-step]").forEach(b => b.classList.toggle("active", Number(b.dataset.step) === i));
  };
  document.querySelectorAll("[data-step]").forEach(b => b.addEventListener("click", () => show(Number(b.dataset.step))));
  show(0);
}

function renderWuxing() {
  const points = { 木:[200,42], 火:[352,152], 土:[294,330], 金:[106,330], 水:[48,152] };
  const shorten = (a,b,start=42,end=48) => {
    const [x1,y1]=points[a],[x2,y2]=points[b], dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy);
    return [x1+dx/len*start,y1+dy/len*start,x2-dx/len*end,y2-dy/len*end];
  };
  const edges = [
    ...Object.entries(generating).map(([a,b]) => ({a,b,type:"sheng"})),
    ...Object.entries(controlling).map(([a,b]) => ({a,b,type:"ke"}))
  ];
  const svg = `
    <svg viewBox="0 0 400 380" role="img" aria-label="五行相生相克关系图">
      <defs>
        <marker id="arrowSheng" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10Z"/></marker>
        <marker id="arrowKe" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10Z"/></marker>
      </defs>
      ${edges.map(({a,b,type}) => {
        const [x1,y1,x2,y2]=shorten(a,b);
        return `<line class="relation-line ${type}" data-from="${a}" data-to="${b}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
      }).join("")}
      ${cycle.map(e => `<g class="wuxing-node" data-element="${e}" transform="translate(${points[e][0]} ${points[e][1]})">
        <g class="wuxing-node-motion">
          <circle r="37" fill="${colorOf(e)}"/><text class="node-main" y="5">${e}</text><text class="node-sub" y="22">${elements[e].state.split("、")[0]}</text>
        </g>
      </g>`).join("")}
      <text class="diagram-caption" x="200" y="183">点击任一五行</text><text class="diagram-caption strong" x="200" y="203">查看四种关系</text>
    </svg>`;
  const diagram = document.querySelector("#wuxingDiagram");
  diagram.innerHTML = svg;
  let selectedElement = null;
  const overview = `<strong>五行</strong><div><b>相生外环</b><span>木→火→土→金→水→木</span></div><div><b>相克内星</b><span>木→土→水→火→金→木</span></div><div><b>点击节点</b><span>单独高亮该五行的四种关系</span></div><div><b>继续推导</b><span>生我、同我、我生、我克、克我转为六亲</span></div>`;
  const reset = () => {
    selectedElement = null;
    document.querySelectorAll(".wuxing-node,.relation-line").forEach(n => n.classList.remove("active","dim"));
    document.querySelector("#wuxingExplanation").innerHTML = overview;
  };
  const explain = e => {
    selectedElement = e;
    document.querySelectorAll(".wuxing-node,.relation-line").forEach(n => n.classList.remove("active","dim"));
    document.querySelectorAll(".wuxing-node").forEach(n => { if(n.dataset.element!==e) n.classList.add("dim"); else n.classList.add("active"); });
    document.querySelectorAll(".relation-line").forEach(n => {
      if (n.dataset.from===e || n.dataset.to===e) n.classList.add("active"); else n.classList.add("dim");
    });
    document.querySelector("#wuxingExplanation").innerHTML = `
      <strong style="color:${colorOf(e)}">${e}</strong>
      <div><b>${e}生${generating[e]}</b><span>我生者，力量向外输出</span></div>
      <div><b>${generatedBy[e]}生${e}</b><span>生我者，给予支持</span></div>
      <div><b>${e}克${controlling[e]}</b><span>我克者，被我支配</span></div>
      <div><b>${controlledBy[e]}克${e}</b><span>克我者，形成约束</span></div>`;
  };
  document.querySelectorAll(".wuxing-node").forEach(n => n.addEventListener("click", event => {
    event.stopPropagation();
    explain(n.dataset.element);
  }));
  diagram.addEventListener("click", event => {
    if (!event.target.closest(".wuxing-node")) reset();
  });
  document.addEventListener("click", event => {
    if (selectedElement && !event.target.closest(".wuxing-node")) reset();
  });
  reset();
}

function renderRelativeTransformer() {
  const picker = document.querySelector("#selfElementPicker");
  picker.innerHTML = cycle.map(e => `<button data-self="${e}" class="${e===state.selfElement?"active":""}" style="--c:${colorOf(e)}">${e}</button>`).join("");
  const me = state.selfElement;
  const relations = [
    ["兄弟",me,"同我者"],["子孙",generating[me],"我生者"],["妻财",controlling[me],"我克者"],
    ["官鬼",controlledBy[me],"克我者"],["父母",generatedBy[me],"生我者"]
  ];
  document.querySelector("#relativeWheel").innerHTML = `
    <div class="relative-center" style="--c:${colorOf(me)}"><small>宫五行 / 我</small><strong>${me}</strong></div>
    ${relations.map(([r,e,d],i) => `<article><span style="background:${colorOf(e)}">${e}</span><div><b>${r}</b><small>${d}</small></div></article>`).join("")}`;
  picker.querySelectorAll("button").forEach(b => b.addEventListener("click", () => { state.selfElement=b.dataset.self; renderRelativeTransformer(); }));
}

function renderElementImages(active="木") {
  const tabs=document.querySelector("#elementImageTabs");
  tabs.innerHTML=elementImages.map(x=>`<button data-image-element="${x.key}" class="${x.key===active?"active":""}" style="--c:${colorOf(x.key)}">${x.key}<small>${x.polarity}</small></button>`).join("");
  const x=elementImages.find(v=>v.key===active);
  document.querySelector("#elementImageDetail").innerHTML=`
    <div class="element-image-head" style="--c:${colorOf(x.key)}"><strong>${x.key}</strong><div><span>${x.polarity} · ${x.direction} · ${x.season}</span><h3>${x.motion}</h3><p>性：${x.nature}　五常：${x.virtue}　五味：${x.taste}　五脏：${x.organ}</p></div></div>
    <div class="image-dimensions">
      <article><b>卦与阴阳</b><p>${x.trigrams}</p></article>
      <article><b>人物身体</b><p>${x.people}；${x.body}</p></article>
      <article><b>性情表现</b><p>${x.character}</p></article>
      <article><b>场所环境</b><div>${x.scenes.map(v=>`<span>${v}</span>`).join("")}</div></article>
      <article><b>事物器象</b><div>${x.things.map(v=>`<span>${v}</span>`).join("")}</div></article>
    </div>`;
  tabs.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>renderElementImages(b.dataset.imageElement)));
}

function renderMap(type="hetu") {
  document.querySelectorAll("[data-map]").forEach(b=>b.classList.toggle("active",b.dataset.map===type));
  if(type==="hetu") {
    document.querySelector("#mapVisualization").innerHTML=`
      <div class="map-copy"><span>河图先天八卦卦序</span><h3>${hetu.title}</h3><p>${hetu.note}</p>
        <div class="number-pairs">${hetu.pairs.map(([n,e,d])=>`<article style="--c:${colorOf(e)}"><b>${n}</b><strong>${e}</strong><small>${d}</small></article>`).join("")}</div>
      </div>
      <div class="prior-trigram-ring">
        <i class="map-orbit-trace"></i>
        ${["乾","巽","坎","艮","坤","震","离","兑"].map((key,i)=>{const t=trigrams.find(item=>item.key===key),a=-90+i*45,r=145;return `<div style="left:${180+Math.cos(a*Math.PI/180)*r}px;top:${180+Math.sin(a*Math.PI/180)*r}px;--c:${colorOf(t.element)}"><b>${t.number}</b><strong>${t.key}</strong><small>${t.nature}</small></div>`}).join("")}
        <span><b>先天</b><small>按先天方位排列</small></span>
      </div>`;
  } else {
    document.querySelector("#mapVisualization").innerHTML=`
      <div class="map-copy"><span>洛书后天八卦卦序</span><h3>${luoshu.title}</h3><p>${luoshu.note}</p>
        <div class="map-rule"><b>上南下北，左东右西</b><small>用于传统九宫方位图的阅读</small></div>
      </div>
      <div class="nine-palace">${luoshu.cells.map(c=>`<article style="--c:${colorOf(c.element)}"><b>${c.n}</b><strong>${c.trigram}</strong><span>${c.direction}</span><small>${c.element}</small></article>`).join("")}</div>`;
  }
  document.querySelectorAll(".prior-trigram-ring>div,.nine-palace article,.number-pairs article").forEach((el,i)=>{
    el.style.setProperty("--order",i);
    el.addEventListener("pointerenter",()=>el.parentElement.classList.add("has-focus"));
    el.addEventListener("pointerleave",()=>el.parentElement.classList.remove("has-focus"));
  });
}

function renderLectureTables() {
  document.querySelector("#stemGrid").innerHTML=stems.map(s=>`<article data-stem-element="${s.element}" style="--c:${colorOf(s.element)}"><strong>${s.key}</strong><span>${s.polarity}${s.element}</span></article>`).join("");
  document.querySelector("#correspondenceList").innerHTML=correspondences.map(c=>`<article data-correspondence-element="${c.element}" style="--c:${colorOf(c.element)}"><strong>${c.element}</strong><div><b>${c.taste} · ${c.organ} · ${c.virtue}</b><p>${c.effect}；${c.excess}</p><small>${c.meaning}</small></div></article>`).join("");
  const lab=document.querySelector("#stemLinkLab");
  lab.innerHTML=`<div><span>联动记忆</span><h3>从天干找到五行，再串联五味、五脏与五常</h3><p>点击任一天干，观察同五行知识自动汇合。</p></div><div class="stem-link-result" id="stemLinkResult"></div>`;
  const select=s=>{
    document.querySelectorAll("[data-stem-element]").forEach(x=>x.classList.toggle("active",x===s));
    document.querySelectorAll("[data-correspondence-element]").forEach(x=>x.classList.toggle("active",x.dataset.correspondenceElement===s.dataset.stemElement));
    const c=correspondences.find(x=>x.element===s.dataset.stemElement);
    document.querySelector("#stemLinkResult").innerHTML=`<strong style="--c:${colorOf(c.element)}">${s.querySelector("strong").textContent}</strong><i>归于</i><b style="color:${colorOf(c.element)}">${c.element}</b><i>对应</i><span>${c.taste}</span><span>${c.organ}</span><span>${c.virtue}</span><small>${c.meaning}</small>`;
  };
  document.querySelectorAll("[data-stem-element]").forEach(s=>s.addEventListener("click",()=>select(s)));
  select(document.querySelector("[data-stem-element]"));
  document.querySelector("#solarGrid").innerHTML=solarTerms.map(s=>`<article class="solar-${s.season}"><span>${s.season}</span><h3>${s.mnemonic}</h3><div>${s.terms.map((t,i)=>`<b>${t}<small>${i%2===0?"节":"气"}</small></b>`).join("")}</div></article>`).join("");
}

function renderSeasonNotes(active="春") {
  const fs=document.querySelector("#seasonNoteFilters");
  fs.innerHTML=["春","夏","秋","冬"].map(s=>`<button data-note-season="${s}" class="${s===active?"active":""}">${s}季</button>`).join("");
  document.querySelector("#seasonNoteGrid").innerHTML=seasonalElementNotes.filter(x=>x.season===active).map(x=>`<article style="--c:${colorOf(x.element)}"><strong>${active}${x.element}</strong><p>${x.text}</p></article>`).join("");
  fs.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>renderSeasonNotes(b.dataset.noteSeason)));
}

function renderSeasons(active=0) {
  const tabs=document.querySelector("#seasonTabs");
  tabs.innerHTML=seasons.map((s,i)=>`<button class="${i===active?"active":""}" data-season="${i}">${s.name} · ${s.branch}</button>`).join("");
  const s=seasons[active];
  document.querySelector("#seasonResult").innerHTML=`<div class="season-meta"><strong style="color:${colorOf(s.dominant)}">${s.name}</strong><span>${s.branch}月 · ${s.dominant}当令</span></div>
    <div class="rank-row">${s.ranks.map(([r,e])=>`<div class="rank-cell"><small>${r}</small><b style="color:${colorOf(e)}">${e}</b></div>`).join("")}</div>
    <p class="derive-rule">推导：同我为旺 → 我生为相 → 生我为休 → 克我为囚 → 我克为死</p>`;
  tabs.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>renderSeasons(Number(b.dataset.season))));
}

function renderWheel() {
  const root=document.querySelector("#branchWheel");
  const order=["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
  root.innerHTML=`<i class="wheel-sweep"></i><i class="wheel-direction"></i>`+order.map((key,i)=>{
    const b=branches.find(x=>x.key===key),a=-90+i*30,r=157;
    return `<button class="wheel-node ${i===0?"active":""}" data-key="${key}" style="left:${180+Math.cos(a*Math.PI/180)*r}px;top:${180+Math.sin(a*Math.PI/180)*r}px;--c:${colorOf(b.element)}">${key}</button>`;
  }).join("");
  root.querySelectorAll("button").forEach((btn,index)=>btn.addEventListener("click",()=>{
    root.querySelectorAll("button").forEach(n=>n.classList.remove("active"));btn.classList.add("active");
    root.style.setProperty("--wheel-angle",`${index*30}deg`);
    const b=branches.find(x=>x.key===btn.dataset.key);
    document.querySelector("#wheelCenterBranch").textContent=b.key;
    document.querySelector("#wheelCenterBranch").style.color=colorOf(b.element);
    document.querySelector("#wheelCenterMeta").innerHTML=`${b.polarity}${b.element} · ${b.direction}<em>${b.month} · ${b.time}</em>`;
  }));
}

function lineMarkup(v) { return v ? `<span class="yang"></span>` : `<span class="yin"><i></i><i></i></span>`; }
function renderTrigrams(active="乾") {
  document.querySelector("#trigramGrid").innerHTML=trigrams.map(t=>`<button data-trigram="${t.key}" class="${t.key===active?"active":""}" style="--c:${colorOf(t.element)}">
    <div class="mini-lines">${[...t.lines].reverse().map(lineMarkup).join("")}</div><strong>${t.key}</strong><small>${t.nature} · ${t.direction}</small></button>`).join("");
  const t=trigrams.find(x=>x.key===active);
  document.querySelector("#trigramDetail").innerHTML=`<div class="large-trigram">${[...t.lines].reverse().map(lineMarkup).join("")}</div>
    <div><span>先天序 ${t.number} · ${t.polarity}卦 · ${t.polarity}${t.element}</span><h3>${t.key}为${t.nature} · ${t.direction} · ${t.family}</h3><p>${t.quality}</p>
    <div class="tag-list">${t.images.map(x=>`<span class="tag">${x}</span>`).join("")}</div><small>身体：${t.body}</small></div>`;
  document.querySelectorAll("[data-trigram]").forEach(b=>b.addEventListener("click",()=>renderTrigrams(b.dataset.trigram)));
}

function identifyTrigram(lines) { return trigrams.find(t => t.lines.join("")===lines.join(""))?.key || "?"; }
function identifyHex(lines) {
  if(lines.length<6) return "等待完成";
  const lower=identifyTrigram(lines.slice(0,3)), upper=identifyTrigram(lines.slice(3,6));
  return hexagramNames[upper+lower] || `上${upper}下${lower}`;
}
function renderCast() {
  const board=document.querySelector("#hexagramBoard");
  const rows=[];
  for(let i=5;i>=0;i--) {
    const item=state.cast[i];
    if(!item) rows.push(`<div class="hex-row empty"><span>${i+1}</span><div>等待</div><div>等待</div></div>`);
    else {
      const yang=item.value%2===1, changed=item.moving?!yang:yang;
      rows.push(`<div class="hex-row ${item.moving?"moving":""}"><span>${i+1}</span><div>${lineMarkup(yang)}<small>${item.name}${item.moving?item.value===9?" ○":" ×":""}</small></div><i>→</i><div>${lineMarkup(changed)}<small>${item.moving?"已变":"不变"}</small></div></div>`);
    }
  }
  board.innerHTML=rows.join("");
  const base=state.cast.map(x=>x.value%2===1?1:0), changed=state.cast.map(x=>x.moving?(x.value%2===1?0:1):(x.value%2===1?1:0));
  document.querySelector("#baseHexName").textContent=identifyHex(base);
  document.querySelector("#changedHexName").textContent=state.cast.length===6&&state.cast.some(x=>x.moving)?identifyHex(changed):"—";
  document.querySelector("#tossCoins").disabled=state.cast.length>=6;
  document.querySelector("#tossCoins").textContent=state.castMode==="manual"?"确认本爻":"掷三枚铜钱";
  document.querySelector("#castMessage").textContent=state.cast.length<6?`下一次记录为第 ${state.cast.length+1} 爻（由下向上）`:`本卦已完成：${identifyHex(base)}。${state.cast.some(x=>x.moving)?"动爻已生成变卦。":"本次六爻皆静，无变卦。"}`;
}
function coinMarkup(face,flipDirection="",index=0){
  return `<button class="coin ${face==="字"?"front":"back"} ${flipDirection}" data-coin-index="${index}" aria-label="铜钱${index+1}，当前${face}面"><span class="coin-face coin-front"></span><span class="coin-face coin-back"></span><b>${face}</b></button>`;
}
function renderCoins(flippingIndex=-1,previousFace=""){
  const coins=state.castMode==="manual"?state.manualCoins:["字","背","字"];
  document.querySelector("#coins").innerHTML=coins.map((x,i)=>{
    const direction=i===flippingIndex
      ? (previousFace==="字"?"flip-to-back":"flip-to-front")
      : "";
    return coinMarkup(x,direction,i);
  }).join("");
  document.querySelector("#manualHint").classList.toggle("visible",state.castMode==="manual");
  document.querySelectorAll("#coins .coin").forEach(btn=>btn.addEventListener("click",()=>{
    if(state.castMode!=="manual")return;
    const i=Number(btn.dataset.coinIndex);
    const previous=state.manualCoins[i];
    state.manualCoins[i]=previous==="字"?"背":"字";
    renderCoins(i,previous);
  }));
  document.querySelectorAll("#coins .coin[class*='flip-to-'],#coins .coin[class*='toss-to-']").forEach(btn=>{
    btn.addEventListener("animationend",()=>{
      btn.classList.remove("flip-to-back","flip-to-front","toss-to-front","toss-to-back");
    },{once:true});
  });
}
function addCastFromCoins(coins){
  const backs=coins.filter(x=>x==="背").length;
  const map={0:{value:6,name:"老阴",moving:true},1:{value:7,name:"少阳",moving:false},2:{value:8,name:"少阴",moving:false},3:{value:9,name:"老阳",moving:true}};
  state.cast.push(map[backs]);
  renderCast();
}
function tossCoins() {
  const coins=state.castMode==="manual"?[...state.manualCoins]:Array.from({length:3},()=>Math.random()<.5?"字":"背");
  if(state.castMode==="random"){
    document.querySelector("#coins").innerHTML=coins.map((x,i)=>coinMarkup(x,x==="字"?"toss-to-front":"toss-to-back",i)).join("");
    setTimeout(()=>addCastFromCoins(coins),420);
  }else addCastFromCoins(coins);
}

function renderRelatives() {
  document.querySelector("#relativeCards").innerHTML=sixRelatives.map(r=>`<article><span>${r.relation}</span><h3>${r.key}</h3><b>${r.role}</b><div>${r.topics.map(x=>`<small>${x}</small>`).join("")}</div></article>`).join("");
}
function renderTopics(active=0) {
  document.querySelector("#topicButtons").innerHTML=yongshenTopics.map((x,i)=>`<button data-topic="${i}" class="${i===active?"active":""}">${x.topic}</button>`).join("");
  const x=yongshenTopics[active];
  document.querySelector("#topicResult").innerHTML=`<span>初步取用</span><strong>${x.use}</strong><p>${x.note}</p><small>下一步：检查用神是否旺相、有根、受生，是否空破、入墓或受动爻克制。</small>`;
  document.querySelectorAll("[data-topic]").forEach(b=>b.addEventListener("click",()=>renderTopics(Number(b.dataset.topic))));
}

function renderFilters() {
  const root=document.querySelector("#elementFilters");
  root.innerHTML=["all","木","火","土","金","水"].map(e=>`<button data-element="${e}" class="${state.element===e?"active":""}">${e==="all"?"全部":e}</button>`).join("");
  root.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{state.element=b.dataset.element;renderFilters();renderBranchGrid();}));
}
function branchMatches(b) {
  if(state.element!=="all"&&b.element!==state.element)return false;
  const source=state.category==="all"?Object.keys(categoryNames).flatMap(k=>b[k]):b[state.category];
  return [b.key,b.element,b.direction,b.action,b.hook,...source].join(" ").toLowerCase().includes(state.search.toLowerCase());
}
function visibleTags(b){return state.category!=="all"?b[state.category].slice(0,7):[b.people[0],b.places[0],b.objects[0],b.body[0],b.events[0]].filter(Boolean);}
function renderBranchGrid(){
  const list=branches.filter(branchMatches);
  document.querySelector("#resultSummary").textContent=`找到 ${list.length} 个地支 · 点击卡片查看完整八维象意`;
  document.querySelector("#branchGrid").innerHTML=list.map(b=>`<article class="branch-card" data-key="${b.key}" style="--element:${colorOf(b.element)}">
    <span class="branch-watermark">${b.key}</span><div class="branch-card-top"><div class="branch-card-key"><strong>${b.key}</strong><span>${b.polarity}${b.element}<br>${b.direction} · ${b.time}</span></div><small>${b.animal}</small></div>
    <h3 class="branch-action">${b.action}</h3><p class="branch-hook">${b.hook}</p><div class="tag-list">${visibleTags(b).map(t=>`<span class="tag">${t}</span>`).join("")}</div>
    <div class="card-footer"><span>${b.month}</span><span>展开详表 →</span></div></article>`).join("");
  document.querySelectorAll(".branch-card").forEach(c=>c.addEventListener("click",()=>openDrawer(c.dataset.key)));
}
function openDrawer(key){
  const b=branches.find(x=>x.key===key); state.viewed.add(key); localStorage.setItem("liuyao-viewed",JSON.stringify([...state.viewed]));updateProgress();
  document.querySelector("#drawerContent").innerHTML=`<div class="drawer-hero" style="--element:${colorOf(b.element)}"><strong>${b.key}</strong><h2>${b.action}</h2>
    <div class="drawer-meta"><span>${b.polarity}${b.element}</span><span>${b.direction}</span><span>${b.month}</span><span>${b.time}</span><span>生肖 ${b.animal}</span></div><p class="drawer-hook">${b.hook}</p></div>
    <div class="category-grid">${Object.entries(categoryNames).map(([field,name])=>`<section class="category-block"><h3>${name}</h3><div>${b[field].map(v=>`<span>${v}</span>`).join("")}</div></section>`).join("")}</div>`;
  const drawer=document.querySelector("#branchDrawer"),panel=drawer.querySelector("aside");
  panel.scrollTop=0;
  drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");
  requestAnimationFrame(()=>panel.scrollTo({top:0,behavior:"auto"}));
}
function closeDrawer(){document.querySelector("#branchDrawer").classList.remove("open");document.querySelector("#branchDrawer").setAttribute("aria-hidden","true");}

function renderFlashcard(){
  const b=branches[state.flashIndex],card=document.querySelector("#flashcard");card.classList.remove("flipped");card.style.setProperty("--element",colorOf(b.element));
  document.querySelector("#flashBranch").textContent=b.key;
  document.querySelector("#flashAnswer").innerHTML=`<h3>${b.key} · ${b.polarity}${b.element}</h3><p><b>时空：</b>${b.direction} · ${b.month} · ${b.time}</p><p><b>动作：</b>${b.action}</p><p><b>人物：</b>${b.people.slice(0,4).join("、")}</p><p><b>场所：</b>${b.places.slice(0,4).join("、")}</p><p><b>身体：</b>${b.body.slice(0,4).join("、")}</p>`;
}
function nextFlashcard(){state.flashIndex=Math.floor(Math.random()*branches.length);renderFlashcard();}
function setMastery(level){state.mastery[branches[state.flashIndex].key]=level;localStorage.setItem("liuyao-mastery",JSON.stringify(state.mastery));updateProgress();nextFlashcard();}

function uniqueQuizOptions(answer,candidates){
  const options=[answer];
  shuffle(candidates).forEach(value=>{if(value&&value!==answer&&!options.includes(value)&&options.length<4)options.push(value);});
  return shuffle(options);
}
function createQuiz(){
  const mode=Math.floor(Math.random()*3);let question,answer,options,feedback;
  if(mode===0){
    const b=branches[Math.floor(Math.random()*branches.length)],types=["direction","action","body","objects"],type=types[Math.floor(Math.random()*types.length)];
    if(type==="direction"){
      question=`“${b.key}”的阴阳五行与方位是？`;
      answer=`${b.polarity}${b.element} · ${b.direction}`;
      options=uniqueQuizOptions(answer,branches.filter(x=>x.key!==b.key).map(x=>`${x.polarity}${x.element} · ${x.direction}`));
      feedback=`<b>讲义地支基础：</b>${b.key}为${b.polarity}${b.element}，方位${b.direction}。`;
    }else if(type==="action"){
      question=`按讲义象意，哪组核心动作最符合“${b.key}”？`;
      answer=b.action;
      options=uniqueQuizOptions(answer,branches.filter(x=>x.key!==b.key).map(x=>x.action));
      feedback=`<b>讲义地支象意：</b>${b.key}的核心状态整理为“${b.action}”。${b.hook}`;
    }else if(type==="body"){
      answer=b.body.join("、");
      question=`按讲义的“地支身体类象”，哪组属于“${b.key}”？`;
      options=uniqueQuizOptions(answer,branches.filter(x=>x.key!==b.key).map(x=>x.body.join("、")));
      const boundary=b.key==="未"
        ?"特别注意：这里的“肝、肠胃”是讲义列出的未支专属身体类象；它不等于五行—五脏表。五行对应中，土对应脾，木才对应肝。"
        :"地支身体类象属于地支象意词库，不可直接等同于“五行—五脏”对应表。";
      feedback=`<b>讲义地支身体类象：</b>${b.key}列“${answer}”。${boundary}`;
    }else{
      answer=b.objects.join("、");
      question=`按讲义的“地支器物类象”，哪组属于“${b.key}”？`;
      options=uniqueQuizOptions(answer,branches.filter(x=>x.key!==b.key).map(x=>x.objects.join("、")));
      feedback=`<b>讲义地支器物类象：</b>${b.key}列“${answer}”。${b.hook}`;
    }
  } else if(mode===1) {
    const me=cycle[Math.floor(Math.random()*5)], kind=shuffle(["我生","生我","我克","克我"])[0];
    const map={我生:generating[me],生我:generatedBy[me],我克:controlling[me],克我:controlledBy[me]};
    question=`以${me}为“我”，${kind}者是什么五行？`;answer=map[kind];options=uniqueQuizOptions(answer,cycle.filter(x=>x!==answer));feedback=`<b>五行生克：</b>${kind}关系由相生相克直接推导，是六亲定位的基础。`;
  } else {
    const r=sixRelatives[Math.floor(Math.random()*sixRelatives.length)];question=`“${r.relation}”在六亲中称为什么？`;answer=r.key;options=uniqueQuizOptions(answer,sixRelatives.map(x=>x.key).filter(x=>x!==answer));feedback=`<b>六亲定义：</b>${r.relation}为${r.key}，主${r.role}。`;
  }
  state.quiz={question,answer,options,feedback,answered:false};renderQuiz();
}
function renderQuiz(){
  const q=state.quiz;document.querySelector("#quizContent").innerHTML=`<div class="quiz-question"><small>第 ${state.quizTotal+1} 题 · 单项选择</small><h3>${q.question}</h3></div><div class="quiz-options">${q.options.map(o=>`<button class="quiz-option" data-answer="${o}">${o}</button>`).join("")}</div><div class="quiz-feedback" id="quizFeedback">先判断题目属于哪套知识体系，再选择答案。</div>`;
  document.querySelector("#nextQuiz").disabled=true;document.querySelectorAll(".quiz-option").forEach(b=>b.addEventListener("click",()=>answerQuiz(b)));
}
function answerQuiz(button){
  if(state.quiz.answered)return;state.quiz.answered=true;state.quizTotal++;const ok=button.dataset.answer===state.quiz.answer;if(ok)state.quizCorrect++;
  localStorage.setItem("liuyao-quiz-stats",JSON.stringify({correct:state.quizCorrect,total:state.quizTotal}));
  document.querySelectorAll(".quiz-option").forEach(b=>{b.disabled=true;if(b.dataset.answer===state.quiz.answer)b.classList.add("correct");});if(!ok)button.classList.add("wrong");
  document.querySelector("#quizFeedback").innerHTML=`${ok?"回答正确。":"这次没有选对。"}<br>${state.quiz.feedback}`;document.querySelector("#quizCorrect").textContent=state.quizCorrect;document.querySelector("#quizTotal").textContent=state.quizTotal;document.querySelector("#nextQuiz").disabled=false;
  updateProgress();
}

function getProgressBreakdown(){
  const content=state.learnedModules.size/learningModules.length;
  const flash=Object.values(state.mastery).reduce((sum,value)=>sum+({again:0,hard:.5,known:1}[value]||0),0)/12;
  const accuracy=state.quizTotal ? state.quizCorrect/state.quizTotal : 0;
  const volume=Math.min(state.quizTotal/20,1);
  const training=state.quizTotal ? volume*(accuracy*.7+.3) : 0;
  return {
    content,flash,training,accuracy,volume,
    total:Math.min(1,content*.25+flash*.4+training*.35)
  };
}

function updateProgress(){
  const score=getProgressBreakdown();
  const progress=Math.round(score.total*100);
  const display=document.querySelector("#headerProgress");
  display.textContent=`${progress}%`;
  display.parentElement.title="点击查看掌握度明细";
  document.querySelector("#quizCorrect").textContent=state.quizCorrect;
  document.querySelector("#quizTotal").textContent=state.quizTotal;
  const detail=document.querySelector("#progressDetail");
  if(detail){
    detail.querySelector("[data-progress-total]").textContent=`${progress}%`;
    detail.querySelector("[data-progress-content]").textContent=`${Math.round(score.content*25)} / 25`;
    detail.querySelector("[data-progress-content-note]").textContent=`已学 ${state.learnedModules.size} / ${learningModules.length} 个知识模块`;
    detail.querySelector("[data-progress-flash]").textContent=`${Math.round(score.flash*40)} / 40`;
    detail.querySelector("[data-progress-flash-note]").textContent=`已评价 ${Object.keys(state.mastery).length} / 12 个地支`;
    detail.querySelector("[data-progress-training]").textContent=`${Math.round(score.training*35)} / 35`;
    detail.querySelector("[data-progress-training-note]").textContent=state.quizTotal
      ? `正确率 ${Math.round(score.accuracy*100)}% · 已答 ${state.quizTotal} / 20 题量目标`
      : "尚未答题";
  }
}

function renderLearningTracking(){
  const targets = new Map();
  document.querySelectorAll("#foundation .section-heading").forEach(heading=>{
    const index=heading.querySelector(".section-index")?.textContent.trim();
    if(index) targets.set(`foundation-${index}`,heading);
  });
  targets.set("casting-workbench",document.querySelector("#casting .casting-workbench .panel-heading"));
  const castingSections=document.querySelectorAll("#casting .section-block .section-heading");
  targets.set("casting-relatives",castingSections[0]);
  targets.set("casting-yongshen",castingSections[1]);
  targets.set("branches-images",document.querySelector("#branches .page-intro"));

  learningModules.forEach(([key,label])=>{
    const target=targets.get(key);
    if(!target)return;
    target.dataset.learningModule=key;
    let button=target.querySelector(".learn-module-button");
    if(!button){
      button=document.createElement("button");
      button.className="learn-module-button";
      button.type="button";
      target.append(button);
    }
    const refresh=()=>{
      const learned=state.learnedModules.has(key);
      button.classList.toggle("learned",learned);
      button.setAttribute("aria-pressed",String(learned));
      button.innerHTML=learned?`<i>✓</i> 已学：${label}`:`<i>○</i> 标记已学`;
    };
    button.onclick=event=>{
      event.stopPropagation();
      state.learnedModules.has(key)?state.learnedModules.delete(key):state.learnedModules.add(key);
      localStorage.setItem("liuyao-learned-modules",JSON.stringify([...state.learnedModules]));
      refresh();
      updateProgress();
    };
    refresh();
  });
}

function initProgressDetail(){
  const panel=document.createElement("div");
  panel.className="progress-detail";
  panel.id="progressDetail";
  panel.setAttribute("aria-hidden","true");
  panel.innerHTML=`
    <button class="progress-detail-backdrop" aria-label="关闭掌握度明细"></button>
    <aside>
      <button class="progress-detail-close" aria-label="关闭">×</button>
      <span>本地学习记录</span>
      <h2>掌握度 <strong data-progress-total>0%</strong></h2>
      <p>导航、滚动和普通点击不计分；只有明确学习行为才会改变掌握度。</p>
      <div class="progress-parts">
        <article><b>内容学习</b><strong data-progress-content>0 / 25</strong><small data-progress-content-note></small></article>
        <article><b>闪卡自评</b><strong data-progress-flash>0 / 40</strong><small data-progress-flash-note></small></article>
        <article><b>训练表现</b><strong data-progress-training>0 / 35</strong><small data-progress-training-note></small></article>
      </div>
      <div class="progress-formula">
        <b>计算逻辑</b>
        <span>内容：15个知识模块，手动“标记已学”</span>
        <span>闪卡：模糊 0%、基本想起 50%、掌握 100%，每支以最新评价覆盖</span>
        <span>训练：正确率占70%、完成题量占30%；正确率得分随题量逐步释放，20题达到完整权重</span>
      </div>
      <button class="reset-progress-button" type="button">重置本地学习记录</button>
    </aside>`;
  document.body.append(panel);
  const close=()=>{panel.classList.remove("open");panel.setAttribute("aria-hidden","true");};
  document.querySelector(".header-progress").setAttribute("role","button");
  document.querySelector(".header-progress").setAttribute("tabindex","0");
  document.querySelector(".header-progress").addEventListener("click",()=>{updateProgress();panel.classList.add("open");panel.setAttribute("aria-hidden","false");});
  document.querySelector(".header-progress").addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();document.querySelector(".header-progress").click();}});
  panel.querySelector(".progress-detail-backdrop").addEventListener("click",close);
  panel.querySelector(".progress-detail-close").addEventListener("click",close);
  panel.querySelector(".reset-progress-button").addEventListener("click",()=>{
    if(!confirm("确定清空当前浏览器中的模块学习、闪卡自评和训练答题记录吗？"))return;
    state.learnedModules.clear();
    state.mastery={};
    state.quizCorrect=0;
    state.quizTotal=0;
    ["liuyao-learned-modules","liuyao-mastery","liuyao-quiz-stats"].forEach(key=>localStorage.removeItem(key));
    renderLearningTracking();
    updateProgress();
  });
  updateProgress();
}

let revealObserver;
function revealVisibleSections(){
  document.querySelectorAll(".view.active .motion-reveal").forEach(el=>{
    const rect=el.getBoundingClientRect();
    if(rect.top<innerHeight*.94)el.classList.add("is-revealed");
  });
}

function initWaterFlow(){
  if(!window.jQuery?.fn?.ripples)return;
  const $=window.jQuery;
  document.querySelectorAll(".view").forEach(view=>{
    if(view.querySelector(".water-ripple-surface"))return;
    const surface=document.createElement("div");
    surface.className="water-ripple-surface";
    surface.setAttribute("aria-hidden","true");
    view.prepend(surface);
  });

  const activateSurface=()=>{
    const surface=document.querySelector(".view.active .water-ripple-surface");
    if(!surface||surface.dataset.ripplesReady)return surface;
    try{
      $(surface).ripples({
        resolution:600,
        dropRadius:18,
        perturbance:.022,
        interactive:false
      });
      surface.dataset.ripplesReady="true";
    }catch(error){
      surface.classList.add("water-ripple-fallback");
      surface.dataset.rippleError=String(error?.message||error);
      console.warn("Water ripple unavailable:",error);
    }
    return surface;
  };

  const dropAt=(clientX,clientY,radius,strength)=>{
    const surface=activateSurface();
    if(!surface?.dataset.ripplesReady)return false;
    const rect=surface.getBoundingClientRect();
    if(clientX<rect.left||clientX>rect.right||clientY<rect.top||clientY>rect.bottom)return false;
    $(surface).ripples("drop",clientX-rect.left,clientY-rect.top,radius,strength);
    return true;
  };

  let lastDrop=0,lastX=0,lastY=0;
  document.addEventListener("pointermove",event=>{
    const now=performance.now();
    const distance=Math.hypot(event.clientX-lastX,event.clientY-lastY);
    if(now-lastDrop<28||distance<5)return;
    const speed=Math.min(1,distance/34);
    const radius=8+speed*5;
    const strength=.005+speed*.008;
    if(dropAt(event.clientX,event.clientY,radius,strength)){
      lastDrop=now;lastX=event.clientX;lastY=event.clientY;
    }
  },{passive:true});

  document.addEventListener("pointerdown",event=>{
    if(event.button!==0)return;
    if(event.target.closest("button,a,input,select,textarea,label,[role='button'],.flashcard,.branch-card,.map-switcher,.relationship-lab,.relation-transformer,.training-panel,.coin-panel,.hexagram-panel"))return;
    dropAt(event.clientX,event.clientY,24,.032);
  },{passive:true});

  window.activateWaterSurface=activateSurface;
  requestAnimationFrame(activateSurface);
}

function initImmersiveMotion(){
  const reduceMotion=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer=matchMedia("(pointer: fine)").matches;

  const progress=document.createElement("div");
  progress.className="deduction-progress";
  progress.setAttribute("aria-hidden","true");
  progress.innerHTML="<i></i>";
  document.body.append(progress);
  const updateScrollProgress=()=>{
    const max=document.documentElement.scrollHeight-innerHeight;
    progress.style.setProperty("--scroll",max>0?Math.min(1,scrollY/max):0);
    document.documentElement.style.setProperty("--page-drift",`${Math.min(90,scrollY*.035)}px`);
  };
  addEventListener("scroll",updateScrollProgress,{passive:true});
  addEventListener("resize",updateScrollProgress,{passive:true});
  updateScrollProgress();

  const revealTargets=document.querySelectorAll(
    ".section-block,.foundation-grid,.lecture-sequence,.casting-roadmap,.casting-workbench,.lecture-next,.path-hero"
  );
  revealTargets.forEach(el=>el.classList.add("motion-reveal"));
  if(!reduceMotion&&"IntersectionObserver" in window){
    revealObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add("is-revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },{threshold:.08,rootMargin:"0px 0px -5% 0px"});
    revealTargets.forEach(el=>revealObserver.observe(el));
  }else{
    revealTargets.forEach(el=>el.classList.add("is-revealed"));
  }
  revealVisibleSections();

  if(reduceMotion||!finePointer)return;
  initWaterFlow();

  document.addEventListener("pointerdown",event=>{
    const target=event.target.closest("button,.branch-card,.map-switcher,.relationship-lab");
    if(!target)return;
    const pulse=document.createElement("i");
    const rect=target.getBoundingClientRect();
    pulse.className="interaction-ripple";
    pulse.style.left=`${event.clientX-rect.left}px`;
    pulse.style.top=`${event.clientY-rect.top}px`;
    target.append(pulse);
    pulse.addEventListener("animationend",()=>pulse.remove(),{once:true});
  });

  const fieldModules=[...document.querySelectorAll(".path-compass,.relationship-lab,.trigram-lab")];
  fieldModules.forEach(module=>{
    module.classList.add("proximity-field");
    module.addEventListener("pointermove",event=>{
      const rect=module.getBoundingClientRect();
      module.style.setProperty("--field-x",`${event.clientX-rect.left}px`);
      module.style.setProperty("--field-y",`${event.clientY-rect.top}px`);
      module.style.setProperty("--field-opacity","1");
    });
    module.addEventListener("pointerleave",()=>module.style.setProperty("--field-opacity","0"));
  });

  const diagram=document.querySelector("#wuxingDiagram");
  if(diagram){
    const hint=document.createElement("div");
    hint.className="motion-hint";
    hint.innerHTML="<i></i><span>移动鼠标，感受五行气机</span>";
    diagram.append(hint);
  }
  diagram?.addEventListener("pointermove",event=>{
    diagram.classList.add("is-interacting");
    diagram.querySelectorAll(".wuxing-node").forEach(node=>{
      const rect=node.getBoundingClientRect();
      const dx=event.clientX-(rect.left+rect.width/2);
      const dy=event.clientY-(rect.top+rect.height/2);
      const distance=Math.hypot(dx,dy);
      const near=Math.max(0,1-distance/190);
      const safe=distance||1;
      node.style.setProperty("--push-x",`${(-dx/safe)*near*8}px`);
      node.style.setProperty("--push-y",`${(-dy/safe)*near*8}px`);
      node.style.setProperty("--near",near.toFixed(3));
    });
  });
  diagram?.addEventListener("pointerleave",()=>{
    diagram.classList.remove("is-interacting");
    diagram.querySelectorAll(".wuxing-node").forEach(node=>{
      node.style.setProperty("--push-x","0px");
      node.style.setProperty("--push-y","0px");
      node.style.setProperty("--near","0");
    });
  });

  let activeCard=null;
  document.addEventListener("pointermove",event=>{
    const card=event.target.closest(
      ".energy-axis article,.trigram-grid button,.branch-card,.lecture-sequence article,.solar-grid article,#pathOrbit button"
    );
    if(activeCard&&activeCard!==card){
      activeCard.classList.remove("proximity-active");
      activeCard.style.removeProperty("--tilt-x");
      activeCard.style.removeProperty("--tilt-y");
      activeCard.style.removeProperty("--lift-x");
      activeCard.style.removeProperty("--lift-y");
    }
    activeCard=card;
    if(!card)return;
    const rect=card.getBoundingClientRect();
    const x=(event.clientX-rect.left)/rect.width-.5;
    const y=(event.clientY-rect.top)/rect.height-.5;
    card.style.setProperty("--tilt-x",`${(-y*4).toFixed(2)}deg`);
    card.style.setProperty("--tilt-y",`${(x*5).toFixed(2)}deg`);
    card.style.setProperty("--lift-x",`${(x*3).toFixed(2)}px`);
    card.style.setProperty("--lift-y",`${(y*3).toFixed(2)}px`);
    card.classList.add("proximity-active");
  },{passive:true});
  document.addEventListener("pointerleave",()=>{
    activeCard?.classList.remove("proximity-active");
    activeCard=null;
  });
}

document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>setView(b.dataset.view)));
document.querySelectorAll("[data-jump]").forEach(b=>b.addEventListener("click",()=>setView(b.dataset.jump)));
document.querySelector("[data-view-link]").addEventListener("click",()=>setView("path"));
document.querySelector("#branchSearch").addEventListener("input",e=>{state.search=e.target.value.trim();renderBranchGrid();});
document.querySelector("#categoryFilter").addEventListener("change",e=>{state.category=e.target.value;renderBranchGrid();});
document.querySelector("#branchDrawer .drawer-backdrop").addEventListener("click",closeDrawer);document.querySelector(".drawer-close").addEventListener("click",closeDrawer);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeDrawer();});
document.querySelector("#flashcard").addEventListener("click",e=>e.currentTarget.classList.toggle("flipped"));
document.querySelector("#flashcard").addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" ")e.currentTarget.classList.toggle("flipped");});
document.querySelector("#nextFlashcard").addEventListener("click",nextFlashcard);document.querySelectorAll("[data-mastery]").forEach(b=>b.addEventListener("click",()=>setMastery(b.dataset.mastery)));
document.querySelector("#nextQuiz").addEventListener("click",createQuiz);
document.querySelector("#tossCoins").addEventListener("click",tossCoins);
document.querySelectorAll("[data-cast-mode]").forEach(button=>button.addEventListener("click",()=>{
  state.castMode=button.dataset.castMode;
  document.querySelectorAll("[data-cast-mode]").forEach(x=>x.classList.toggle("active",x===button));
  renderCoins();
  renderCast();
}));
document.querySelector("#resetCast").addEventListener("click",()=>{state.cast=[];state.manualCoins=["字","背","字"];renderCoins();renderCast();});

document.querySelectorAll("[data-map]").forEach(b=>b.addEventListener("click",()=>renderMap(b.dataset.map)));
renderPath();renderElementImages();renderWuxing();renderRelativeTransformer();renderMap();renderSeasons();renderWheel();renderTrigrams();renderLectureTables();renderSeasonNotes();renderCoins();renderCast();renderRelatives();renderTopics();renderFilters();renderBranchGrid();renderFlashcard();renderLearningTracking();initProgressDetail();updateProgress();
initImmersiveMotion();
const initialView=new URLSearchParams(location.search).get("view");
if(["path","foundation","casting","branches","training"].includes(initialView))setView(initialView);
