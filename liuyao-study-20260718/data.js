window.LIUYAO_DATA = {
  elements: {
    木: { color: "#5f7f60", state: "生发、上升、舒展", virtue: "仁", organ: "肝", season: "春", direction: "东", taste: "酸" },
    火: { color: "#b5543e", state: "扩张、炎上、显现", virtue: "礼", organ: "心", season: "夏", direction: "南", taste: "苦" },
    土: { color: "#a47b45", state: "承载、运化、转换", virtue: "信", organ: "脾", season: "长夏", direction: "中央", taste: "甘" },
    金: { color: "#8b8272", state: "收敛、肃降、决断", virtue: "义", organ: "肺", season: "秋", direction: "西", taste: "辛" },
    水: { color: "#3f6572", state: "收藏、润下、潜藏", virtue: "智", organ: "肾", season: "冬", direction: "北", taste: "咸" }
  },
  elementImages: [
    {
      key:"木", polarity:"少阳", motion:"能量扩张的中间状态，生长而有生命力", nature:"腾上而无所止", virtue:"仁", direction:"东方", season:"春", taste:"酸", organ:"肝",
      trigrams:"震为阳木，巽为阴木", body:"足、股、肝胆、筋脉", people:"长男、长女", character:"仁慈、生发、主动；失衡时急躁或伸展受阻",
      scenes:["原野","田园","菜地","庭院","林区","竹林","道路","长廊","通道","管道","机场","邮局","商店","码头"],
      things:["草木","竹子","线路","车辆","广播","发射物"]
    },
    {
      key:"火", polarity:"太阳", motion:"能量扩张到极点的状态", nature:"炎上", virtue:"礼", direction:"正南", season:"夏", taste:"苦", organ:"心",
      trigrams:"离卦，阴火", body:"心脏、眼睛、舌", people:"中女、中年女性", character:"光明、表现、好动、社交；失衡时社交与表达受阻",
      scenes:["正南","明堂","会议室","娱乐场所","电影院","阳光处"],
      things:["太阳","火焰","电器","屏幕","文字","信息","白色空壳"]
    },
    {
      key:"土", polarity:"阴阳交", motion:"承载、运化，作为四时转换的平台", nature:"无常性，视四时所乘", virtue:"信", direction:"中央", season:"长夏与四季末", taste:"甘", organ:"脾",
      trigrams:"艮为阳土，坤为阴土", body:"手、腹部、脾胃", people:"少男、母亲", character:"宽厚、包容、踏实、承载",
      scenes:["山","丘陵","高台","平原","操场","农舍","坟","监狱","银行"],
      things:["土地","云雾","田宅","平台","容器"]
    },
    {
      key:"金", polarity:"少阴", motion:"能量收缩的中间状态", nature:"沉下而有所止", virtue:"义", direction:"西方", season:"秋", taste:"辛", organ:"肺",
      trigrams:"乾为阳金，兑为阴金", body:"头、口、肺", people:"父、少女", character:"收敛、决断、取舍分明",
      scenes:["西北","正西","皇宫","教堂","寺院","政府机构","湖泊","水池","会议厅","音乐厅","饭馆","门口","路口"],
      things:["金属","冰雹","珠宝","口袋","洞穴","工具"]
    },
    {
      key:"水", polarity:"太阴", motion:"能量收缩到极点的状态", nature:"润下、险、陷、收藏", virtue:"智", direction:"正北", season:"冬", taste:"咸", organ:"肾",
      trigrams:"坎卦，阳水", body:"肾、膀胱、泌尿系统、耳", people:"中男", character:"吸收、营养、知识、智慧；失衡时难吸收、坐不住",
      scenes:["正北","江河","沟渠","低洼","阴暗处","危险处"],
      things:["黑色","黑洞","水","知识","营养","收藏物"]
    }
  ],
  hetu: {
    title:"河图 · 先天之数",
    pairs:[["一、六","水","北"],["二、七","火","南"],["三、八","木","东"],["四、九","金","西"],["五、十","土","中央"]],
    note:"讲义以河图连接先天八卦，强调宇宙诞生初期的万物万象之形，即天道。"
  },
  luoshu: {
    title:"洛书 · 后天九宫",
    cells:[
      {n:4,trigram:"巽",direction:"东南",element:"木"},{n:9,trigram:"离",direction:"正南",element:"火"},{n:2,trigram:"坤",direction:"西南",element:"土"},
      {n:3,trigram:"震",direction:"正东",element:"木"},{n:5,trigram:"中",direction:"中央",element:"土"},{n:7,trigram:"兑",direction:"正西",element:"金"},
      {n:8,trigram:"艮",direction:"东北",element:"土"},{n:1,trigram:"坎",direction:"正北",element:"水"},{n:6,trigram:"乾",direction:"西北",element:"金"}
    ],
    note:"后天八卦反映自然界与人类社会的现实状态，用于方位、风水、环境和个人家族运程。"
  },
  stems: [
    {key:"甲",polarity:"阳",element:"木"},{key:"乙",polarity:"阴",element:"木"},
    {key:"丙",polarity:"阳",element:"火"},{key:"丁",polarity:"阴",element:"火"},
    {key:"戊",polarity:"阳",element:"土"},{key:"己",polarity:"阴",element:"土"},
    {key:"庚",polarity:"阳",element:"金"},{key:"辛",polarity:"阴",element:"金"},
    {key:"壬",polarity:"阳",element:"水"},{key:"癸",polarity:"阴",element:"水"}
  ],
  correspondences: [
    {element:"木",taste:"酸",organ:"肝",effect:"收敛、生津、柔肝",excess:"过酸伤筋、损脾胃",virtue:"仁",meaning:"慈爱、好生、宽厚"},
    {element:"火",taste:"苦",organ:"心",effect:"清热、燥湿、泻火",excess:"过苦伤心、耗骨气",virtue:"礼",meaning:"恭敬谦和、守规矩"},
    {element:"土",taste:"甘",organ:"脾",effect:"补益、和中、缓急",excess:"过甘生湿、发胖伤肉",virtue:"信",meaning:"忠厚踏实、诚实守信"},
    {element:"金",taste:"辛",organ:"肺",effect:"发散、行气、通窍",excess:"过辛耗气、耗阴血",virtue:"义",meaning:"取舍分明、守节仗义"},
    {element:"水",taste:"咸",organ:"肾",effect:"软坚、润下、入血",excess:"过咸伤血、伤骨骼",virtue:"智",meaning:"明辨是非、思虑深远"}
  ],
  solarTerms: [
    {season:"春",mnemonic:"春雨惊春清谷天",terms:["立春","雨水","惊蛰","春分","清明","谷雨"]},
    {season:"夏",mnemonic:"夏满芒夏暑相连",terms:["立夏","小满","芒种","夏至","小暑","大暑"]},
    {season:"秋",mnemonic:"秋处露秋寒霜降",terms:["立秋","处暑","白露","秋分","寒露","霜降"]},
    {season:"冬",mnemonic:"冬雪雪冬小大寒",terms:["立冬","小雪","大雪","冬至","小寒","大寒"]}
  ],
  seasonalElementNotes: [
    {season:"春",element:"木",text:"余寒犹存，喜火暖身、水来资扶；初春水不宜过多，土多损力，忌金重克木；春末阳壮水渴，更需水资扶。"},
    {season:"春",element:"火",text:"母旺子相，喜木生扶但不宜过旺；欲水既济，土多埋光，火盛烈燥，见金可以施展。"},
    {season:"春",element:"土",text:"其势虚浮，喜火生扶，忌木太过；水泛喜土助，用金制木为祥，金太多仍盗土气。"},
    {season:"春",element:"金",text:"余寒未尽，用火为贵；体弱宜厚土辅助，水盛增寒，木旺损力，可用金比助但仍要见火。"},
    {season:"春",element:"水",text:"性滥滔淫，再逢水助有崩堤之势，宜土制；喜金生扶但不宜过盛，火不可多，见木可以施功。"},
    {season:"夏",element:"木",text:"根干叶燥，用水滋润，忌火旺焚化；土宜薄不宜厚，金不可缺，木多徒然成林而难结果。"},
    {season:"夏",element:"火",text:"秉令乘权，用水制可免自焚；忌木再助，遇金可作良工，得土可成稼穑，但无水则金燥土焦。"},
    {season:"夏",element:"土",text:"其势燥烈，用水滋润，忌旺火炼焦；木助火炎而水克无碍，土生金、金生水有益。"},
    {season:"夏",element:"金",text:"尤为柔弱，水盛滋润呈祥；见木助火伤身，遇金扶持精壮，土薄有用，土厚埋没无光。"},
    {season:"夏",element:"水",text:"时当干涸，宜水与金来生扶；忌火旺、木盛盗气及土旺克制。"},
    {season:"秋",element:"木",text:"气渐凄凉、形渐凋败；初秋喜水土，中秋果实成可用金修削，霜降后不宜水盛，寒露又喜火。"},
    {season:"秋",element:"火",text:"性息体和，用木生有复明之庆；忌水克、土重掩光、金多损势，亦喜火助见光辉。"},
    {season:"秋",element:"土",text:"子旺母衰，金多耗气；木盛须制，不忌火重，忌水多，此时得土助力为佳。"},
    {season:"秋",element:"金",text:"当权得令，用火锻炼可成器；土多反浊，见水精神秀，逢木可施威，金再多则旺极而衰。"},
    {season:"秋",element:"水",text:"母旺子相，得金助则清澄；土旺混浊，火多财盛，木重子荣，水多则泛滥。"},
    {season:"冬",element:"木",text:"盘屈在地，土多可培养，忌水旺忘形；金多难克伐，火重温暖有功。"},
    {season:"冬",element:"火",text:"体绝形亡，喜木生救、土制水、火来帮助；忌水克，见金难任财。"},
    {season:"冬",element:"土",text:"外寒内温，水旺财丰，金多子秀，火盛有荣，不忌木，更喜土扶身强。"},
    {season:"冬",element:"金",text:"形寒性冷，木多难施削；水盛而沉，土能制水，喜金聚气、用火温养。"},
    {season:"冬",element:"水",text:"司令当权，用火增暖、用土形藏；忌金多，木盛有情，土太过则涸，水泛宜土堤防。"}
  ],
  seasons: [
    { name: "春", branch: "寅卯辰", dominant: "木", ranks: [["旺","木"],["相","火"],["休","水"],["囚","金"],["死","土"]] },
    { name: "夏", branch: "巳午未", dominant: "火", ranks: [["旺","火"],["相","土"],["休","木"],["囚","水"],["死","金"]] },
    { name: "秋", branch: "申酉戌", dominant: "金", ranks: [["旺","金"],["相","水"],["休","土"],["囚","火"],["死","木"]] },
    { name: "冬", branch: "亥子丑", dominant: "水", ranks: [["旺","水"],["相","木"],["休","金"],["囚","土"],["死","火"]] }
  ],
  trigrams: [
    { key:"乾", lines:[1,1,1], polarity:"阳", number:1, element:"金", direction:"西北", family:"父", nature:"天", body:"头", quality:"健、刚、领导", images:["天","父亲","首领","政府","高级场所","圆形","金玉"] },
    { key:"兑", lines:[1,1,0], polarity:"阴", number:2, element:"金", direction:"正西", family:"少女", nature:"泽", body:"口", quality:"悦、说、缺口", images:["沼泽","口舌","喜悦","聚会","音乐","洞穴","破损"] },
    { key:"离", lines:[1,0,1], polarity:"阴", number:3, element:"火", direction:"正南", family:"中女", nature:"火", body:"目", quality:"明、附丽、外实内虚", images:["太阳","光明","眼睛","文章","屏幕","电器","名声"] },
    { key:"震", lines:[1,0,0], polarity:"阳", number:4, element:"木", direction:"正东", family:"长男", nature:"雷", body:"足", quality:"动、起、惊", images:["雷","发动","道路","车辆","声音","长男","迅速"] },
    { key:"巽", lines:[0,1,1], polarity:"阴", number:5, element:"木", direction:"东南", family:"长女", nature:"风", body:"股", quality:"入、顺、传播", images:["风","通道","线路","绳索","草木","长女","渗透"] },
    { key:"坎", lines:[0,1,0], polarity:"阳", number:6, element:"水", direction:"正北", family:"中男", nature:"水", body:"耳", quality:"险、陷、流动", images:["水","沟渠","危险","耳朵","知识","盗贼","隐秘"] },
    { key:"艮", lines:[0,0,1], polarity:"阳", number:7, element:"土", direction:"东北", family:"少男", nature:"山", body:"手", quality:"止、界限、积累", images:["山","门槛","停止","手","坟墓","银行","少男"] },
    { key:"坤", lines:[0,0,0], polarity:"阴", number:8, element:"土", direction:"西南", family:"母", nature:"地", body:"腹", quality:"顺、承载、众多", images:["大地","母亲","腹部","平原","群众","布帛","承载"] }
  ],
  sixRelatives: [
    { key:"父母", relation:"生我者", role:"保护、文书与承载", topics:["父母长辈","房屋土地","车辆衣物","证件合同","书籍文章","工作单位"] },
    { key:"兄弟", relation:"同我者", role:"同类、竞争与分夺", topics:["兄弟姐妹","同事朋友","竞争者","阻隔","耗财","伙伴"] },
    { key:"子孙", relation:"我生者", role:"产出、福神与制鬼", topics:["子女晚辈","医药","娱乐","技术","解忧","动物"] },
    { key:"妻财", relation:"我克者", role:"财富、资源与可支配对象", topics:["钱财货物","妻子女友","收益","饮食","雇员","器物"] },
    { key:"官鬼", relation:"克我者", role:"约束、责任、疾病与权位", topics:["职位事业","领导丈夫","疾病灾祸","盗贼","压力","考试功名"] }
  ],
  yongshenTopics: [
    { topic:"求财、交易、收入", use:"妻财", note:"看财爻旺衰及是否受生、受克、空破。" },
    { topic:"工作、职位、考试功名", use:"官鬼", note:"官鬼代表职位、规则、名次和责任。" },
    { topic:"父母、房屋、合同、车辆、文章", use:"父母", note:"父母爻主庇护、承载和文书。" },
    { topic:"子女、医药、宠物、解忧", use:"子孙", note:"子孙为产出和福神，也能克制官鬼。" },
    { topic:"兄弟姐妹、朋友、竞争", use:"兄弟", note:"问同辈取兄弟；问财时兄弟常有分夺之意。" },
    { topic:"自己的状态", use:"世爻", note:"世爻通常代表求测者自身及当前立场。" },
    { topic:"对方、环境或所问之事", use:"应爻", note:"应爻与世爻相对，需结合具体占问定义。" }
  ],
  learningSteps: [
    { n:"01", title:"五行作用", subtitle:"先懂生克", detail:"所有六亲、旺衰和用忌关系，底层都由五行生克展开。" },
    { n:"02", title:"干支时空", subtitle:"把符号定位", detail:"地支提供季节、方位、时间和万物类象。" },
    { n:"03", title:"八卦结构", subtitle:"识别上下卦", detail:"三爻成经卦，上下相重成为六爻卦。" },
    { n:"04", title:"起卦装卦", subtitle:"形成卦盘", detail:"由下至上记录六次结果，标出动爻并形成变卦。" },
    { n:"05", title:"六亲取用", subtitle:"确定观察点", detail:"根据宫五行给各爻定六亲，再依据占问选用神。" },
    { n:"06", title:"旺衰动变", subtitle:"判断有效性", detail:"看月日、空破、生克冲合，以及动爻变爻的作用。" },
    { n:"07", title:"类象落地", subtitle:"翻译到现实", detail:"最后才用卦象、地支、六神和现实背景筛选细节。" },
    { n:"08", title:"应期复盘", subtitle:"接受验证", detail:"给出时间窗口并记录结果，用真实反馈修正规则。" }
  ],
  branches: [
    {
      key:"寅", polarity:"阳", element:"木", direction:"东北", month:"正月", time:"3–5 点", animal:"虎", action:"破寒而出 · 主动上升",
      people:["丈夫","贵人","公门人员","文官","官吏","秀才","道士","宾客"],
      places:["山林","桥梁","公衙","庙观","社稷"],
      objects:["文书","单据","发票","财物","棺材"],
      animals:["老虎","猫"], body:["三焦","胆","筋脉"],
      events:["上进","远行","婚姻","财帛","官吏之事","文书之事"],
      symbols:["支神功曹","箕宿","青龙之象","未＋寅：狂风四起"],
      hook:"严寒中抬头的阳木，兼有启动、上进、文职、远行和林木之象。"
    },
    {
      key:"卯", polarity:"阴", element:"木", direction:"正东", month:"二月", time:"5–7 点", animal:"兔", action:"柔性生发 · 门户连接",
      people:["兄弟","女人","手工业者","长男"],
      places:["大街","道路","门户","房屋","桥梁"],
      objects:["门窗","头发","车辆","船只","飞船","导弹","火箭"],
      animals:["兔","狐","蛐蛐"], body:["肝胆","骨骼","大肠","卵"],
      events:["合作","联合","婚姻","交通","雷动","快速发动","性急"],
      symbols:["支神太冲","房宿","六合之象","天冲星"],
      hook:"像枝条和门缝向外延伸，故多见门户、道路、连接、合作和细长之物。"
    },
    {
      key:"辰", polarity:"阳", element:"土", direction:"东南", month:"三月", time:"7–9 点", animal:"龙", action:"水库聚藏 · 迟滞调动",
      people:["女人","僧人","道人","狱师"],
      places:["水库","高岗土岭","坟","麦地","寺观","田宅","牢狱"],
      objects:["瓷器","缸盆","冰箱","香纸"],
      animals:["龙","鱼"], body:["肠","胸","右目"],
      events:["诉讼","纠纷","陈年旧事","考试","调动","搬家","出行","迟滞"],
      symbols:["支神天罡","众星之首","勾陈之象","辰戌：官司诉讼","辰＋寅：罡塞鬼户"],
      hook:"湿土与水库能收进去，也容易拖住，故有储藏、旧事、牢狱和迟滞之象。"
    },
    {
      key:"巳", polarity:"阴", element:"火", direction:"东南", month:"四月", time:"9–11 点", animal:"蛇", action:"曲折缠绕 · 文字双重",
      people:["女人","少女","术士","道士","厨师","铁匠","画家","长女"],
      places:["炉灶","厨房"],
      objects:["书画","文字","文书","乐器","电器","电磁辐射"],
      animals:["蛇","长虫","蚯蚓","蝉","萤火虫","飞虫","飞鸟","爬虫"],
      body:["心","三焦","咽喉","面","齿","眼","舌"],
      events:["口舌斗争","惊扰怪异","血光","火灾","怪梦","怀孕","文学","纠缠","主双"],
      symbols:["支神太乙","火神","螣蛇之象","巳＋辰：双胎","巳＋亥：移灶换工作","巳＋戌：铸印升迁升学"],
      hook:"像蛇般曲折缠绕，又属阴火，兼具文字、电器、炉灶、纠缠和两件事之象。"
    },
    {
      key:"午", polarity:"阳", element:"火", direction:"正南", month:"五月", time:"11–13 点", animal:"马", action:"光照四方 · 公开传播",
      people:["僧人","骑马的人","女秘书"],
      places:["大厅","会议室","娱乐场所","电影院","客厅","明堂"],
      objects:["电视机","音响","电器","手机","电脑","书画","旌旗","文章","车辆"],
      animals:["马","鹿"], body:["心","心血","小肠","眼睛","额头","舌头","脑神经"],
      events:["信息","文书","科举","考试","诉讼","交通","直播","自媒体","微商","口舌"],
      symbols:["支神胜光","朱雀之象"],
      hook:"太阳最盛，万物被照亮，因此指向公开、显眼、表达、媒体、屏幕和传播。"
    },
    {
      key:"未", polarity:"阴", element:"土", direction:"西南", month:"六月", time:"13–15 点", animal:"羊", action:"成熟收成 · 礼仪酒食",
      people:["老妇人","老男人","放羊人","寡妇","长辈","药师"],
      places:["田野","坟","院子","园林","庭院","井"],
      objects:["衣服","药品","食物","酒器"],
      animals:["羊","鹰"], body:["肝","肠胃"],
      events:["酒食","宴会","祭祀","婚礼","仪式","吃喝玩乐","丰收","丧事"],
      symbols:["支神小吉","风伯","天酒星","太常之象"],
      hook:"夏末作物趋熟，故有收成、食物、药物、宴会和礼仪之象。"
    },
    {
      key:"申", polarity:"阳", element:"金", direction:"西南", month:"七月", time:"15–17 点", animal:"猴", action:"传送道路 · 杀伐变动",
      people:["军警","凶恶之人","商贾","长辈","母亲"],
      places:["大堂","道路","路途"],
      objects:["火车","汽车","自行车","刀剑","斧子","铁器","信息","钱财"],
      animals:["猴","狮子"], body:["肺","胆","大肠","骨","身体"],
      events:["行人","出行","调动","疾病","丧孝","血光","商业"],
      symbols:["支神传送","天钱星","天鬼","天医","白虎之象"],
      hook:"阳金又名传送，故兼具交通流动、消息转移、金属工具和军警杀伐之象。"
    },
    {
      key:"酉", polarity:"阴", element:"金", direction:"正西", month:"八月", time:"17–19 点", animal:"鸡", action:"精细收敛 · 门户阴私",
      people:["女人","少女","酒水买卖者","下人","歌星","阴富贵人"],
      places:["门户"],
      objects:["金银首饰","珠宝","口罩","石柱","酒","姜蒜","钟表","精密仪器"],
      animals:["鸡","鸽子"], body:["口","耳","皮毛","爪骨","精血","小肠"],
      events:["买卖","小道消息","谣言","暧昧","阴私","天文","酒事"],
      symbols:["支神从魁","金神","斗魁第二","雨师","太阴之象"],
      hook:"日落之时光线收起，阴金又细致精巧，故见珠宝、钟表、隐私和小道消息。"
    },
    {
      key:"戌", polarity:"阳", element:"土", direction:"西北", month:"九月", time:"19–21 点", animal:"狗", action:"汇聚守门 · 陈旧虚空",
      people:["长者","僧人","道人","狱吏","员工","佣人","律师","强盗"],
      places:["山岭","岗坡","寺观","坟","牢狱","市井","空门"],
      objects:["大豆","高粱","瓷器","砖瓦","钥匙","鞋","印模","契约","文书"],
      animals:["狗","驴"], body:["命门","膀胱","足","腿"],
      events:["诉讼","逃亡","旧事","欺诈","考试夺魁","修行","无名无利","迟慢"],
      symbols:["支神河魁","斗魁第一","天空之象","辰戌：官司诉讼","巳＋戌：铸印升迁升学"],
      hook:"守门之犬与秋末收藏之土，形成守、聚、旧、牢狱、契约与虚而不实之象。"
    },
    {
      key:"亥", polarity:"阴", element:"水", direction:"西北", month:"十月", time:"21–23 点", animal:"猪", action:"极阴潜藏 · 流通陷入",
      people:["孩子","盗贼"],
      places:["江河湖海","水路","高台","仓库","牢狱","厕所","官府"],
      objects:["信息流","货币流","图书","案牍","毛发"],
      animals:["猪","鱼虾","海鲜"], body:["肝","肾","头","耳","足"],
      events:["水路交通","货币流通","征召","偷盗","阴私","聪明","陷险"],
      symbols:["支神登明","水神","玄武之象","巳＋亥：移灶换工作"],
      hook:"深水既能让事物流通，也能让事物沉入隐处，故见水路、货币、图书和盗贼。"
    },
    {
      key:"子", polarity:"阳", element:"水", direction:"正北", month:"十一月", time:"23–1 点", animal:"鼠", action:"一阳潜生 · 洞察阴私",
      people:["女人","盗贼","小孩","慈母"],
      places:["池塘","沟河","水边"],
      objects:["大豆","糖","文墨"],
      animals:["鼠","燕子","蝙蝠","蜗牛"], body:["肾","膀胱"],
      events:["恩泽","人情","慈爱","偷盗","暧昧","阴天雨雪","观察","洞察"],
      symbols:["支神神后","支神之首","华盖星","天后之象"],
      hook:"午夜外暗而一阳初生，故既有隐私、夜和水，也有观察、智慧与孕育。"
    },
    {
      key:"丑", polarity:"阴", element:"土", direction:"东北", month:"十二月", time:"1–3 点", animal:"牛", action:"寒湿收藏 · 田宅贵重",
      people:["贵人","尊长","神佛","长者","父母"],
      places:["桑园","桥梁","宫殿","礼堂","坟","大殿","井","田宅"],
      objects:["钥匙","首饰","珍宝","鞋","金库","矿藏","良田"],
      animals:["牛","驴","骡子","龟"], body:["腹部","脾","肺","小肠"],
      events:["喜庆","升迁","举荐","牢狱诉讼","口舌是非","地产","湿滞"],
      symbols:["支神大吉","斗牛星宿","风伯","雨师","贵人之象"],
      hook:"冬末湿土像泥土中的库藏，既见污湿牢滞，也见金库、矿藏、珍宝和田宅。"
    }
  ]
};
