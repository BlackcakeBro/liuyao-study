# 交互动效 Design QA

- source visual truth path: `/tmp/dyv-contact.png`
- implementation screenshot path: `/tmp/liuyao-motion-verified.png`
- viewport: 1440 × 1100，桌面端
- state: 讲义主课 → 五行生克关系图；指针接近“木”节点

## Full-view comparison evidence

参考视频以大幅自然物体、极简文字和接近函数造成的连续空间形变为视觉核心。本站没有复制其巨型 3D 场景，而是保留原有高密度学习布局，只提取“接近感应、景深位移、连续流动”三种交互语言，避免动画压过讲义内容。

## Focused region comparison evidence

重点检查五行生克模块，因为它是本次最接近参考视频“物体受指针距离影响”的区域：

- 五个节点仍保持正确方位和五行配色。
- 指针接近节点时，节点产生约 8px 内的轻微避让和最高约 8% 的缩放。
- 相生、相克线在模块悬停时连续流动，但不改变关系方向。
- 首轮实现曾使 CSS transform 覆盖 SVG 定位，已改为仅变换节点内部图层，方位恢复正常。

## Required fidelity surfaces

- Fonts and typography: 延续网站既有宋体标题、无衬线正文体系，未因动画缩小字号或改变信息层级。
- Spacing and layout rhythm: 动画不参与文档流，不改变模块尺寸、间距和滚动位置。
- Colors and visual tokens: 使用既有 `--red` 与五行色，不引入脱离主题的霓虹色。
- Image quality and asset fidelity: 本次不复制参考视频中的树木资产；采用原生 SVG 知识图形以保持关系图清晰度。
- Copy and content: 未修改讲义内容、术语和学习顺序。

## Findings

- 无 P0 / P1 / P2 问题。
- [P3] 静态截图不能完整展示连续流动与卡片倾斜。
  - Location: 五行图、八卦卡片、学习卡片。
  - Impact: 不影响使用，仅影响交付材料对动态效果的表达。
  - Follow-up: 后续部署时可补录 8–12 秒交互演示。

## Patches made

1. 增加模块内指针接近光场。
2. 增加五行节点距离感应与生克线流动。
3. 增加知识卡片、八卦卡片和学习路径节点的轻量空间倾斜。
4. 增加分区滚动显现与顶部推演进度线。
5. 增加 `prefers-reduced-motion` 无障碍降级。
6. 修复 SVG 节点变换覆盖原始坐标的问题。

## Implementation Checklist

- [x] 桌面端视觉检查
- [x] JavaScript 语法检查
- [x] 五行节点接近感应数值验证
- [x] 滚动显现状态验证
- [x] 动画降级规则

## 2026-06-11 第二轮修改复查

- 修复“宫五行 / 我”文字对比度，浏览器计算颜色为白色。
- 河图先天环增加双层旋转轨道、节点依次显现与悬停聚焦；洛书九宫增加宫位反馈。
- 十二地支时空环增加方向扫描线、双环转动、选中脉冲，以及月份和时辰联动。
- 新增“天干 → 五行 → 五味、五脏、五常”联动记忆区，填补原有大面积空白。
- 新增自动投掷与手动定面两种起卦方式；三枚铜钱均可独立切换正反面。
- 铜钱更换为生成式古铜钱图片，正反面清楚可辨。
- 删除所有“交互一、交互二、交互三”提示，浏览器检查结果为 0 处残留。
- 不同主页面分别使用山水、爻线铜钱、地支时序、学习竹简主题背景。
- JavaScript 语法检查通过；河洛切换、午支联动、丙火联动与背景资源加载检查通过。

final result: passed
