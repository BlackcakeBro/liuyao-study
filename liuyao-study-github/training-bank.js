(()=>{
  const data=window.LIUYAO_DATA;
  const modules=[
    {id:"foundation",label:"基础关系",short:"基础"},
    {id:"lecture0704",label:"旺衰与地支关系",short:"07·04"},
    {id:"lecture0718",label:"起卦与八宫卦谱",short:"07·18"},
    {id:"lecture0725",label:"装卦与六亲取象",short:"07·25"},
    {id:"lecture0801",label:"六亲与六神进阶",short:"08·01"},
    {id:"classics",label:"古籍参考",short:"古籍"}
  ];
  const classics={
    source:"《增删卜易》卷一",
    boundary:"已进入课堂的结构以陈师口径为主；完整纳甲表等细节继续标为古籍校注，不冒充课堂逐项讲授。",
    chapterOrder:["八卦与占卦法","八宫六十四卦","浑天甲子","六亲","世应","动变","用神与元忌仇"],
    roadmap:[
      {n:"01",title:"起卦与爻位",progress:"learned",state:"陈师已讲",detail:"三钱定爻、初爻至上爻、内外卦与动变。"},
      {n:"02",title:"八宫六十四卦",progress:"learned",state:"陈师已讲",detail:"八宫归属、宫内序位及八宫核心取象已经讲完。"},
      {n:"03",title:"浑天甲子",progress:"learned",state:"课堂原理 + 古籍校注",detail:"课堂已讲内外卦固定装支原理；完整逐爻表仍作古籍校注。"},
      {n:"04",title:"六亲",progress:"learned",state:"六亲已讲",detail:"六亲生克链与父母、官鬼、兄弟、妻财、子孙的三层取象均已进入课堂。"},
      {n:"05",title:"世应",progress:"learned",state:"陈师已讲",detail:"世为求测者，应为所测或对方；应与世中间隔两爻。"},
      {n:"06",title:"动变与取用",progress:"learned",state:"课堂已讲取用顺序",detail:"先定所问、再取用神，并结合世爻、月日、旺衰与动静；元忌仇关系继续参考古籍。"}
    ],
    najia:[
      {trigram:"乾",inner:["子水","寅木","辰土"],outer:["午火","申金","戌土"]},
      {trigram:"坎",inner:["寅木","辰土","午火"],outer:["申金","戌土","子水"]},
      {trigram:"艮",inner:["辰土","午火","申金"],outer:["戌土","子水","寅木"]},
      {trigram:"震",inner:["子水","寅木","辰土"],outer:["午火","申金","戌土"]},
      {trigram:"巽",inner:["丑土","亥水","酉金"],outer:["未土","巳火","卯木"]},
      {trigram:"离",inner:["卯木","丑土","亥水"],outer:["酉金","未土","巳火"]},
      {trigram:"坤",inner:["未土","巳火","卯木"],outer:["丑土","亥水","酉金"]},
      {trigram:"兑",inner:["巳火","卯木","丑土"],outer:["亥水","酉金","未土"]}
    ],
    shiYing:[
      {stage:"本宫",shi:6},{stage:"一世",shi:1},{stage:"二世",shi:2},{stage:"三世",shi:3},
      {stage:"四世",shi:4},{stage:"五世",shi:5},{stage:"游魂",shi:4},{stage:"归魂",shi:3}
    ],
    roles:[
      {name:"用神",definition:"所占事项在卦中的主要观察爻"},
      {name:"元神",definition:"生用神之爻"},
      {name:"忌神",definition:"克用神之爻"},
      {name:"仇神",definition:"克制元神、又生忌神之爻"}
    ]
  };

  const changsheng=[
    ["长生","生起","事情开始有气，如根苗初生"],["沐浴","洗濯","外露、洗濯、形象未稳"],
    ["冠带","成形","有外观、有名分、开始成形"],["临官","得位","禄、工资、职位与权位"],
    ["帝旺","极盛","力量达到顶峰"],["衰","退势","力量从高点开始减退"],
    ["病","失衡","结构出现漏洞、弱点或受制点"],["死","停滞","事情停住、难以推进"],
    ["墓","归藏","收藏、关闭、限制，也可能形成保护"],["绝","断绝","关系或可能性断掉；不可脱离全卦直接定凶"],
    ["胎","酝酿","尚未成形，但已有内在动机"],["养","培育","为下一轮长生蓄力"]
  ];
  const hiddenStems={
    寅:["甲","丙","戊"],卯:["乙"],辰:["戊","癸","乙"],巳:["丙","庚","戊"],
    午:["丁","己"],未:["己","乙","丁"],申:["庚","壬","戊"],酉:["辛"],
    戌:["戊","丁","辛"],亥:["壬","甲"],子:["癸"],丑:["己","辛","癸"]
  };
  const relationSets={
    sanhe:{label:"三合",groups:[
      {members:["亥","卯","未"],answer:"亥卯未三合木局"},{members:["寅","午","戌"],answer:"寅午戌三合火局"},
      {members:["巳","酉","丑"],answer:"巳酉丑三合金局"},{members:["申","子","辰"],answer:"申子辰三合水局"}
    ]},
    liuchong:{label:"六冲",pairs:[["子","午"],["丑","未"],["寅","申"],["卯","酉"],["辰","戌"],["巳","亥"]]},
    liuhe:{label:"六合",pairs:[["子","丑"],["寅","亥"],["卯","戌"],["辰","酉"],["巳","申"],["午","未"]]},
    chuan:{label:"穿 / 害",pairs:[["子","未"],["丑","午"],["寅","巳"],["卯","辰"],["申","亥"],["酉","戌"]]},
    jue:{label:"绝",pairs:[["子","巳"],["午","亥"],["寅","酉"],["卯","申"]]},
    anhe:{label:"暗合",pairs:[["寅","丑"],["卯","申"],["子","巳"],["午","亥"]]}
  };
  const cycle=["木","火","土","金","水"];
  const generating={木:"火",火:"土",土:"金",金:"水",水:"木"};
  const controlling={木:"土",土:"水",水:"火",火:"金",金:"木"};
  const generatedBy=Object.fromEntries(Object.entries(generating).map(([a,b])=>[b,a]));
  const controlledBy=Object.fromEntries(Object.entries(controlling).map(([a,b])=>[b,a]));
  const bank=[];
  const add=question=>bank.push(question);
  const branchChoices={
    direction:data.branches.map(branch=>`${branch.polarity}${branch.element} · ${branch.direction}`),
    action:data.branches.map(branch=>branch.action),
    body:data.branches.map(branch=>branch.body.join("、")),
    objects:data.branches.map(branch=>branch.objects.join("、"))
  };

  data.branches.forEach(branch=>{
    const source="陈师基础讲义";
    add({id:`foundation-branch-${branch.key}-direction`,module:"foundation",kind:"branch",source,question:`“${branch.key}”的阴阳五行与方位是？`,answer:`${branch.polarity}${branch.element} · ${branch.direction}`,candidates:branchChoices.direction,feedback:`${branch.key}为${branch.polarity}${branch.element}，方位${branch.direction}。`});
    add({id:`foundation-branch-${branch.key}-action`,module:"foundation",kind:"branch",source,question:`按讲义象意，哪组核心动作最符合“${branch.key}”？`,answer:branch.action,candidates:branchChoices.action,feedback:`${branch.key}的核心状态整理为“${branch.action}”。${branch.hook}`});
    const bodyBoundary=branch.key==="未"?"这里的肝、肠胃是未支的地支类象，不等于五行—五脏表；五行对应中土对应脾，木对应肝。":"地支身体类象属于地支象意词库，不可直接等同于五行—五脏对应表。";
    add({id:`foundation-branch-${branch.key}-body`,module:"foundation",kind:"branch",source,question:`按讲义的地支身体类象，哪组属于“${branch.key}”？`,answer:branch.body.join("、"),candidates:branchChoices.body,feedback:`${branch.key}列“${branch.body.join("、")}”。${bodyBoundary}`});
    add({id:`foundation-branch-${branch.key}-objects`,module:"foundation",kind:"branch",source,question:`按讲义的地支器物类象，哪组属于“${branch.key}”？`,answer:branch.objects.join("、"),candidates:branchChoices.objects,feedback:`${branch.key}列“${branch.objects.join("、")}”。${branch.hook}`});
  });
  cycle.forEach(element=>{
    const relations={我生:generating[element],生我:generatedBy[element],我克:controlling[element],克我:controlledBy[element]};
    Object.entries(relations).forEach(([relation,answer])=>add({id:`foundation-wuxing-${element}-${relation}`,module:"foundation",kind:"wuxing",source:"陈师基础讲义",question:`以${element}为“我”，${relation}者是什么五行？`,answer,candidates:cycle,feedback:`以${element}为“我”，${relation}者为${answer}；这是继续推导六亲的底层关系。`}));
  });
  data.sixRelatives.forEach(relative=>add({id:`foundation-relative-${relative.key}`,module:"foundation",kind:"six-relative",source:"陈师基础讲义",question:`“${relative.relation}”在六亲中称为什么？`,answer:relative.key,candidates:data.sixRelatives.map(item=>item.key),feedback:`${relative.relation}为${relative.key}，主${relative.role}。`}));

  changsheng.forEach(([name,phase,note])=>add({id:`0704-changsheng-${name}`,module:"lecture0704",kind:"changsheng",source:"陈师 2026-07-04",question:`十二长生中，处于“${phase}”状态的是哪一阶段？`,answer:name,candidates:changsheng.map(item=>item[0]),feedback:`${name} · ${phase}：${note}。十二长生只描述气的阶段，仍须以四时旺衰为纲。`}));
  relationSets.sanhe.groups.forEach(group=>add({id:`0704-sanhe-${group.members.join("")}`,module:"lecture0704",kind:"branch-relation",source:"陈师 2026-07-04",question:`${group.members.join("、")}三支合成什么局？`,answer:group.answer,candidates:relationSets.sanhe.groups.map(item=>item.answer),feedback:`${group.answer}。三合可从长生、帝旺、墓三点理解，具体作用仍看全卦。`}));
  ["liuchong","liuhe","chuan","jue","anhe"].forEach(type=>{
    const relation=relationSets[type];
    relation.pairs.forEach(([a,b])=>add({id:`0704-${type}-${a}${b}`,module:"lecture0704",kind:"branch-relation",source:"陈师 2026-07-04",question:`在“${relation.label}”关系中，与${a}对应的是哪一支？`,answer:b,candidates:Object.keys(hiddenStems),feedback:`${a}与${b}构成${relation.label}。${["jue","anhe"].includes(type)?"此关系并非十二地支每支都有；":""}关系本身不直接等于吉凶。`}));
  });
  const hiddenChoices=Object.values(hiddenStems).map(stems=>stems.join("、"));
  Object.entries(hiddenStems).forEach(([branch,stems])=>add({id:`0704-hidden-${branch}`,module:"lecture0704",kind:"hidden-stems",source:"陈师 2026-07-04",question:`地支“${branch}”中藏有哪些天干？`,answer:stems.join("、"),candidates:hiddenChoices,feedback:`${branch}中藏${stems.join("、")}。藏干用于理解地支关系的内在作用，不可脱离旺衰直接断事。`}));

  const coinChoices=course0718.coins.map(item=>`${item.result} · ${item.line}${item.moving?"":"静"}`);
  course0718.coins.forEach(item=>add({id:`0718-coin-${item.faces}`,module:"lecture0718",kind:"coin",source:"陈师 2026-07-18",question:`三枚铜钱出现“${item.faces}”时，定为什么爻？`,answer:`${item.result} · ${item.line}${item.moving?"":"静"}`,candidates:coinChoices,feedback:`${item.faces}定${item.result}，${item.note}`}));
  const faceChoices=["阴面（汉字面）","阳面（满文面）","阳面（汉字面）","阴面（满文面）"];
  add({id:"0718-coin-face-hanzi",module:"lecture0718",kind:"coin-face",source:"陈师 2026-07-18",question:"乾隆通宝铜钱的汉字面在本课中记作什么？",answer:"阴面（汉字面）",candidates:faceChoices,feedback:"本课口径：汉字面记阴，满文面记阳。"});
  add({id:"0718-coin-face-manchu",module:"lecture0718",kind:"coin-face",source:"陈师 2026-07-18",question:"乾隆通宝铜钱的满文面在本课中记作什么？",answer:"阳面（满文面）",candidates:faceChoices,feedback:"本课口径：满文面记阳，汉字面记阴。"});
  const yaoChoices=course0718.yao.map(item=>`${item.name} · ${item.triad} · ${item.zone}`);
  course0718.yao.forEach(item=>add({id:`0718-yao-${item.n}`,module:"lecture0718",kind:"yao-position",source:"陈师 2026-07-18",question:`第${item.n}次投掷对应哪一爻、哪一位与哪一卦区？`,answer:`${item.name} · ${item.triad} · ${item.zone}`,candidates:yaoChoices,feedback:`第${item.n}次投掷记为${item.name}，属${item.triad}、${item.zone}；${item.cue}。`}));
  const palaceChoices=course0718.palaceOrder.map(key=>`${key}宫`);
  course0718.palaceOrder.forEach(key=>{
    const palace=course0718.palaces[key];
    add({id:`0718-palace-element-${key}`,module:"lecture0718",kind:"palace-element",source:"陈师 2026-07-18",question:`${key}宫八卦的宫五行是什么？`,answer:palace.element,candidates:cycle,feedback:`${key}宫八卦俱属${palace.element}。`});
    palace.hexagrams.forEach((hexagram,index)=>{
      add({id:`0718-membership-${hexagram[0]}`,module:"lecture0718",kind:"palace-membership",palace:key,source:"陈师 2026-07-18",question:`“${hexagram[0]}”属于八宫中的哪一宫？`,answer:`${key}宫`,candidates:palaceChoices,feedback:`${hexagram[0]}属${key}宫，为宫内“${course0718.palaceStages[index]}”序位；宫五行${palace.element}。`});
      if(palace.status==="verified")add({id:`0718-cue-${hexagram[0]}`,module:"lecture0718",kind:"hexagram-cue",palace:key,source:palace.source||"陈师 2026-07-18",question:`按陈师课堂取象，哪组核心提示属于“${hexagram[0]}”？`,answer:hexagram[2],candidates:course0718.palaceOrder.filter(palaceKey=>course0718.palaces[palaceKey].status==="verified").flatMap(palaceKey=>course0718.palaces[palaceKey].hexagrams.map(item=>item[2])),feedback:`${hexagram[0]}：${hexagram[2]}。这只是课堂取象提示，不可脱离用神、旺衰与全卦直接下结论。`});
    });
  });

  const source0725="陈师 2026-07-25";
  const assemblyChoices=[...course0725.assemblyPrinciples.map(item=>item.cue),"先凭卦名直接定吉凶"];
  course0725.assemblyPrinciples.forEach(item=>add({
    id:`0725-assembly-${item.name}`,module:"lecture0725",kind:"assembly",source:source0725,
    question:`装卦步骤“${item.name}”的课堂核心是什么？`,answer:item.cue,candidates:assemblyChoices,
    feedback:`${item.name}：${item.detail}`
  }));
  const roleChoices0725=[...course0725.shiYingRoles.map(item=>item.role),"固定代表长辈","固定代表晚辈"];
  course0725.shiYingRoles.forEach(item=>add({
    id:`0725-shiying-${item.name}`,module:"lecture0725",kind:"shi-ying-role",source:source0725,
    question:`本课中“${item.name}”首先代表什么？`,answer:item.role,candidates:roleChoices0725,
    feedback:`${item.name}：${item.role}。${item.note}`
  }));
  const relativeNames=["父母","兄弟","子孙","妻财","官鬼"];
  [...course0725.relativeCycles.generating,...course0725.relativeCycles.controlling].forEach((relation,index)=>{
    const [from,to]=relation.split(index<5?"生":"克");
    const verb=index<5?"生":"克";
    add({
      id:`0725-cycle-${verb}-${from}-${to}`,module:"lecture0725",kind:"relative-cycle",source:source0725,
      question:`六亲生克链中，${from}${verb}什么？`,answer:to,candidates:relativeNames,
      feedback:`完整关系为“${relation}”；必须放回两条闭环中记忆。`
    });
  });
  const layerChoices=course0725.focusRelatives.flatMap(item=>[item.people.join("、"),item.things.join("、"),item.states.join("、")]);
  course0725.focusRelatives.forEach(item=>{
    [["人物",item.people],["事物",item.things],["状态",item.states]].forEach(([layer,values])=>add({
      id:`0725-${item.name}-${layer}`,module:"lecture0725",kind:"relative-image",source:source0725,
      question:`按本课三层取象，哪组属于${item.name}爻的“${layer}”层？`,answer:values.join("、"),candidates:layerChoices,
      feedback:`${item.name}爻 · ${layer}：${values.join("、")}。${item.boundary}`
    }));
  });
  const boundaryChoices=[
    ...course0725.focusRelatives.map(item=>item.boundary),
    "只看六亲名称即可直接判断吉凶。",
    "任何感情占都一律以官鬼代表男性伴侣。"
  ];
  course0725.focusRelatives.forEach(item=>add({
    id:`0725-boundary-${item.name}`,module:"lecture0725",kind:"judgment-boundary",source:source0725,
    question:`关于${item.name}爻，哪一条符合本课使用边界？`,answer:item.boundary,candidates:boundaryChoices,
    feedback:item.boundary
  }));
  const ruleChoices=[...course0725.judgmentRules,"六亲名称本身已经包含固定吉凶。"];
  course0725.judgmentRules.forEach((rule,index)=>add({
    id:`0725-rule-${index+1}`,module:"lecture0725",kind:"judgment-rule",source:source0725,
    question:"哪一条符合本课的六亲判断原则？",answer:rule,candidates:ruleChoices,
    feedback:rule
  }));

  const source0801="陈师 2026-08-01";
  const layers0801=course0801.focusRelatives.flatMap(item=>[item.people.join("、"),item.things.join("、"),item.states.join("、")]);
  course0801.focusRelatives.forEach(item=>{
    [["人物",item.people],["事物",item.things],["状态",item.states]].forEach(([layer,values])=>add({
      id:`0801-relative-${item.name}-${layer}`,module:"lecture0801",kind:"relative-image",source:source0801,
      question:`哪组内容属于${item.name}爻的“${layer}”层取象？`,answer:values.join("、"),candidates:layers0801,
      feedback:`${item.name}爻 · ${layer}：${values.join("、")}。${item.boundary}`
    }));
  });
  const boundaries0801=[...course0801.focusRelatives.map(item=>item.boundary),"只看六亲名称即可直接判断吉凶。"];
  course0801.focusRelatives.forEach(item=>add({
    id:`0801-relative-boundary-${item.name}`,module:"lecture0801",kind:"judgment-boundary",source:source0801,
    question:`关于${item.name}爻，哪条符合本课判断边界？`,answer:item.boundary,candidates:boundaries0801,feedback:item.boundary
  }));
  const useGodCues=course0801.useGodSteps.map(item=>item.cue);
  course0801.useGodSteps.forEach((item,index)=>add({
    id:`0801-usegod-${index+1}`,module:"lecture0801",kind:"use-god",source:source0801,
    question:`“${item.name}”这一步的核心是什么？`,answer:item.cue,candidates:useGodCues,feedback:`${item.cue}。${item.detail}`
  }));
  const sixGodCues=course0801.sixGods.map(item=>item.cue);
  const sixGodCombos=course0801.sixGods.map(item=>item.combos.join("、"));
  course0801.sixGods.forEach(item=>{
    add({id:`0801-sixgod-${item.name}-cue`,module:"lecture0801",kind:"six-god",source:source0801,
      question:`六神“${item.name}”的课堂核心提示是哪一组？`,answer:item.cue,candidates:sixGodCues,feedback:`${item.name}：${item.images.join("、")}。${item.boundary}`});
    add({id:`0801-sixgod-${item.name}-combo`,module:"lecture0801",kind:"six-god-combination",source:source0801,
      question:`哪组是课堂列举的“${item.name}”组合示例？`,answer:item.combos.join("、"),candidates:sixGodCombos,feedback:`${item.combos.join("；")}。${course0801.sixGodBoundary}`});
  });
  const rules0801=[...course0801.judgmentRules,"六神名称本身足以直接断定结果。"];
  course0801.judgmentRules.forEach((rule,index)=>add({
    id:`0801-rule-${index+1}`,module:"lecture0801",kind:"judgment-rule",source:source0801,
    question:"哪一条符合 8 月 1 日课堂的判断顺序？",answer:rule,candidates:rules0801,feedback:rule
  }));

  const innerChoices=classics.najia.map(item=>item.inner.join(" → "));
  const outerChoices=classics.najia.map(item=>item.outer.join(" → "));
  classics.najia.forEach(item=>{
    add({id:`classics-najia-${item.trigram}-inner`,module:"lecture0725",kind:"najia",source:"《增删卜易》卷一 · 浑天甲子章",question:`${item.trigram}卦作为内卦时，由下向上装哪三支？`,answer:item.inner.join(" → "),candidates:innerChoices,feedback:`${item.trigram}在内卦，由下向上装${item.inner.join("、")}。课堂已讲固定装支原理；此完整序列来自原著参考。`});
    add({id:`classics-najia-${item.trigram}-outer`,module:"lecture0725",kind:"najia",source:"《增删卜易》卷一 · 浑天甲子章",question:`${item.trigram}卦作为外卦时，由下向上装哪三支？`,answer:item.outer.join(" → "),candidates:outerChoices,feedback:`${item.trigram}在外卦，由下向上装${item.outer.join("、")}。课堂已讲固定装支原理；此完整序列来自原著参考。`});
  });
  const shiChoices=classics.shiYing.map(item=>`${item.shi===6?"上":item.shi}爻（第${item.shi}爻）`);
  classics.shiYing.forEach(item=>add({id:`classics-shiying-${item.stage}`,module:"lecture0725",kind:"shi-ying",source:"《增删卜易》卷一 · 世应章",question:`八宫序位为“${item.stage}”时，世爻落在哪一爻？`,answer:`${item.shi===6?"上":item.shi}爻（第${item.shi}爻）`,candidates:shiChoices,feedback:`${item.stage}卦世在第${item.shi}爻；应与世中间隔两爻，也就是爻位相差三。此处用于课堂定位复习。`}));
  data.sixRelatives.forEach(relative=>add({id:`classics-relative-${relative.key}`,module:"lecture0725",kind:"six-relative",source:"《增删卜易》卷一 · 六亲歌章",question:`古籍六亲定法中，“${relative.relation}”称为什么？`,answer:relative.key,candidates:data.sixRelatives.map(item=>item.key),feedback:`${relative.relation}为${relative.key}。六亲须以卦宫五行为“我”来推。`}));
  const yongshenChoices=data.yongshenTopics.map(item=>item.use);
  data.yongshenTopics.forEach((item,index)=>add({id:`classics-yongshen-${index+1}`,module:"classics",kind:"yongshen",source:"《增删卜易》卷一 · 用神章",question:`占问“${item.topic}”时，首先取什么为用神或主要观察点？`,answer:item.use,candidates:yongshenChoices,feedback:`此类占问先取${item.use}。${item.note}取准用神后仍要继续看旺衰、生克、冲合与动变。`}));
  const roleChoices=classics.roles.map(item=>item.definition);
  classics.roles.forEach(role=>add({id:`classics-role-${role.name}`,module:"classics",kind:"role",source:"《增删卜易》卷一 · 用神、元神、忌神、仇神章",question:`古籍所说“${role.name}”指什么？`,answer:role.definition,candidates:roleChoices,feedback:`${role.name}：${role.definition}。这是关系定义，是否有力仍须继续判断旺衰与动变。`}));

  window.LIUYAO_TRAINING={modules,classics,bank};
})();
