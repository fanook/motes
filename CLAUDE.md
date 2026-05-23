# motes

每天用 AI 整理一些 AI 相关的知识碎片。每条知识 = `src/motes/` 下的一个 `.tsx` 文件，自动收录、自动生成路由。

## 技术栈

- Vite + React + TypeScript
- React Router（`/` 列表，`/m/:slug` 详情）
- Tailwind CSS v4（`@tailwindcss/vite` 插件）
- 部署：Cloudflare Pages（纯静态，构建命令 `npm run build`，输出 `dist`）

## 添加一条新 mote

新建 `src/motes/YYYY-MM-DD-slug.tsx`，导出 `meta` 和默认组件：

```tsx
import type { MoteMeta } from '../lib/motes';

export const meta: MoteMeta = {
  title: '标题',
  date: '2026-05-23',
  tags: ['可选'],
  summary: '可选的一句话简介',
};

export default function Mote() {
  return <article>...</article>;
}
```

无需手动注册路由 —— `src/lib/motes.ts` 通过 `import.meta.glob` 自动扫描。

## 约定

- 文件名格式：`YYYY-MM-DD-slug.tsx`，`slug` 部分即 URL。
- `meta.date` 用 ISO 日期字符串，列表按日期倒序。
- 每条 mote 可以自由用 React/Tailwind 做任意排版与交互，不必拘泥统一模板。

## 标题（meta.title）约定

- `meta.title` 是显示在 **首页列表卡片**、 **浏览器标签**、 **分享卡** 上的短标题
- **保持简洁**，最好 ≤ 10 个汉字（约相当于英文 20 字符内）
- **不要**把副标题 / 破折号后面的注解写进 `meta.title`
- 副标题写在文章 `<h1>` 下方的 `<p>` 里（用 `—— xxx` 风格）

例：
- ✅ `meta.title: 'Token 是什么'`，文章里 h1 + 副标题"AI 眼里的'小积木'"分两行
- ❌ `meta.title: 'Token 是什么 —— AI 眼里的"小积木"'`（卡片会换行/拥挤）

## 变更历史（Changelog）

每条 mote 文末用 `<Changelog created={meta.date} entries={meta.changelog} />` 显示创建日期 + 后续变更记录。

**MoteMeta 里的 `changelog` 字段**：
```ts
changelog?: { date: string; note: string }[]
```
按时间倒序（最新在前）。组件会自动追加 `创建` 那一条到最底。

**只记录"发布后的修改"，不要写调试 / 迭代日志**：
- ✅ 应该记：发布后补充新章节、 修订错误数据、 因官方更新而调整内容
- ❌ 不要记：初稿和重写迭代、 排版微调、 我们对话中的来回修改

新 mote 默认不写 changelog 字段， 让组件自然显示一条"创建"即可。

## 知识 backlog（写文章时遇到的衍生话题）

写某篇文章时， 经常会牵扯到其他可以单独成篇的概念 / 工具 / 论文。 **不要在原文里展开**， 记到下面这个 backlog， 后续单独写一篇。 这样：
- 每篇 mote 保持聚焦
- 知识图逐步织起来， 文章之间互相引用
- 不会"写一篇带出十篇"陷入无边

**当前 backlog**（按优先级， 越靠前越值得先写）：

```
[x] Context Window 深度版 → 2026-05-26-context-window.tsx
[x] Attention 机制 → 2026-05-27-attention.tsx
[x] Temperature / Top-p / Top-k → 2026-05-28-sampling.tsx
[x] Hallucination → 2026-05-29-hallucination.tsx
[x] RAG → 2026-05-30-rag.tsx
[x] Vector DB → 2026-05-31-vector-db.tsx
[x] Function Calling / Tool Use → 2026-06-01-function-calling.tsx
[x] Chain of Thought → 2026-06-02-chain-of-thought.tsx
[x] MCP → 2026-06-03-mcp.tsx
[x] Pre-training / Fine-tuning / RAG 三选一 → 2026-06-04-train-vs-finetune-vs-rag.tsx
[x] RLHF → 2026-06-05-rlhf.tsx
[x] MoE 混合专家 → 2026-06-06-moe.tsx
[x] Chunking 策略 → 2026-06-07-chunking.tsx
[x] Rerank 重排 → 2026-06-08-rerank.tsx
[x] Contrastive learning → 2026-06-09-contrastive-learning.tsx
[x] BERT → 2026-06-10-bert.tsx
```

**新候选**（之前写文章时挖出的、 还没单独成篇）：
```
[ ] Agentic workflows / ReAct
[ ] Constitutional AI（RLAIF 的具体实现）
[ ] LoRA / QLoRA 微调技巧详解
[ ] FlashAttention 工程实现
[ ] BM25 经典关键词检索算法
[ ] AI 产品成本结构 PM 视角全景
[ ] Streaming / TTFT / Throughput 性能优化全景
[ ] 选模型决策框架（Haiku / Sonnet / Opus / GPT-4o-mini 等）
```

**工作流**：
- 写文章时遇到一个有信息量但偏离主题的概念， 用一句话总结 + 标"[详见: XX]"占位， 然后把 XX 加进上面这个列表
- 写完一篇就把对应条目从 `[ ]` 改成 `[x]` + 加上文件链接
- backlog 用得越来越短， 文章网络逐渐成形

## 封面图系统（每篇 mote 一张专属 cover）

每篇 mote 都有一张程序化生成的封面图， 风格类似 Anthropic 博客的"编辑插画"。 用于：
- 首页列表卡片左侧缩略图（80px / 128px）
- 文章详情页顶部 banner（嵌在 Paper 内， 跟正文是一个整体）
- 公众号封面图（通过 `/cover/:slug` 路由 + Playwright + 网站「⤓ 下载图片」按钮渲染 PNG）

**核心组件**：`src/components/cover-art.tsx`
- `<CoverArt slug={slug} />` 接受 slug， 全自动生成
- 1200×1200 viewBox， **正方形**， SVG 矢量， 浏览器内运行时渲染
- 调色板 + halftone variant + 符号 全部由 slug hash 决定， 同一 slug 永远生成同款

**视觉规则**（动 cover-art.tsx 时严格遵守）：
- ✅ **单一构图**， 不分两块、 不做 split panel
- ✅ **符号始终居中**（`translate(250, 250) scale(1.4)`， 中心点 600,600）
- ✅ **色块铺满整个 1200×1200**， 不留奶油纸边
- ✅ Halftone 三种 variant：`0` 下半 / `1` 无 / `2` 上半（由 slug hash 决定）
- ❌ **不要曲线**（之前画过墨色波纹， 已删， 不要加回）
- ❌ **不要 grid card overlay**（之前的 variant 1 视觉中心偏， 已删）

**怎么给新 mote 加专属符号**：
1. 在 `cover-art.tsx` 写一个 `SymbolDrawer` 函数：
   ```ts
   const drawXxx: SymbolDrawer = (g, rc, o) => {
     // 在 0~500 的局部坐标里画， 用 rc.rectangle / rc.circle / rc.line / rc.curve / rc.ellipse
     // 共享 helper： fillRect, fillCircle
     // 颜色用 o.stroke (黑墨色) 和 o.fill (奶油色)
     // 随机种子 o.seed + 偏移
   };
   ```
2. 加到 `SYMBOL_REGISTRY` 数组里：
   ```ts
   { test: (s) => s.includes('your-slug'), drawer: drawXxx },
   ```
3. 写完无须改其他文件 —— `<CoverArt>` 自动通过 slug 匹配。
4. 通过 `http://localhost:5174/cover/<slug>` 单独预览。

**符号设计原则**（保持视觉统一）：
- 主图占 500×500 局部坐标的中心区域
- 用 1~2 个核心几何形状（方块 / 圆 / 椭圆 / 线）
- 暗示文章主题， 但**抽象**， 不要图标级具象
- 用 `solidStroke: true` 让某些点变实心来形成视觉重心
- roughness 1.3~1.6， strokeWidth 3~5， 太细看不清、 太粗压扁

**Paper 自动嵌入封面**：
- `Paper` 组件读 `MoteSlugContext`， 如果有 slug 就在内容顶部渲染 `<CoverArt>`
- `MoteView` 通过 `<MoteSlugContext.Provider>` 包住 `<LazyMote>`
- 个别 mote 想不要封面 → 不需要改 mote 文件， 在 MoteView 里加例外列表即可

**列表卡片排版规则**（`Home.tsx` ListView）：
- 横向 flex： 左 cover（`w-20 sm:w-32`， 80/128px 方形）+ 右内容
- 内容区 `justify-between`： 标题顶上、 描述顶下
- 描述 `line-clamp-2 sm:line-clamp-3`
- **不显示日期 / 标签**（用户体验更清爽）
- cover 用 `self-stretch` 跟卡片同高

## 写新 mote 的事实核查与引用（强制要求）

不许凭记忆写。写 mote 之前 / 过程中，**必须用 `WebFetch` / `WebSearch` 实地读原始资料**，读完后用自己的话总结。

### 必须读原始来源（不要靠二手归纳）

| 内容 | 去哪读 |
|---|---|
| **概念 / 术语定义** | 算法 → 原论文；产品术语 → 厂商官方 docs；标准 → W3C / RFC / ISO 等正式文档 |
| **API 价格、限速** | 厂商定价页（anthropic.com/pricing、openai.com/api/pricing） |
| **模型规格**（context、参数量、能力） | 官方 model card / 发布博客 |
| **库 / 工具** | 官方 README / docs / pypi / npm |
| **行业现状、benchmark** | 原始报告 / 厂商博客 / 当期新闻 |

**算法原理 / 概念**虽然稳定， 但仍要读原始定义自己总结，不要靠记忆复述。

### 推荐的高置信度来源（按场景）

**百科 / 综述类**
- Wikipedia 英文版（比中文版更新快、引用全；读完一定翻底部 References 顺到一手）
- Britannica（老牌严格，更新慢）
- Stanford Encyclopedia of Philosophy（哲学 / 理论概念金标准）
- Scholarpedia（同行评议的"维基"，作者都是该领域专家）

**AI / CS 领域**
- arXiv.org（原论文一手）
- Papers With Code（论文 + 实现 + benchmark）
- HuggingFace model card / dataset card
- Distill.pub（已停更但仍权威，可视化解释经典论文）

**官方一手**
- 厂商 docs：anthropic.com/docs、platform.openai.com/docs、ai.google.dev/docs
- MDN Web Docs（Web 标准）
- RFC / W3C / ISO 标准文档

**学术**
- Google Scholar（搜引用数高的核心论文）
- 顶会论文集：NeurIPS / ICML / ACL / EMNLP / CVPR

**实战组合速查**

| 要写什么 | 优先来源 |
|---|---|
| 算法原理 / 概念 | arXiv 原论文 + Wikipedia EN（References 顺藤摸瓜） |
| API / 产品功能 | 厂商官方 docs |
| 价格 / 实时数据 | 厂商定价页 + 近期可信新闻 |
| benchmark / 模型对比 | Papers With Code + 原论文 |
| Web / 浏览器特性 | MDN |
| 数学 / 算法基础 | 经典教材（如 CLRS）+ Wikipedia |

**反例**（不要拿这些当主来源）：内容农场、堆 SEO 的科技博客、Quora / 知乎答案、AI 生成摘要型站点。这些可以做"灵感入口"，但具体数字 / 定义必须从上面表里的来源核。

### 文章末尾必须列出"参考来源"

每条 mote 在结尾写一个 **"参考来源 / References"** 章节，列出本文用到的全部资料：
- 官方文档链接
- 论文 / arXiv
- 实时新闻、价格页（带访问日期，如 `accessed 2026-05-23`）
- 第三方研究 / benchmark
- 公开数据集

格式建议（用 `<Section title="参考来源">` 包起来，列表呈现）：
```
1. [Anthropic Pricing](https://anthropic.com/pricing) — 价格表（2026-05-23 访问）
2. Sennrich et al. 2015. *Neural Machine Translation of Rare Words with Subword Units* (BPE 原论文)
3. ...
```

### 写法约束

- 核到真实值 → 直接写
- 来源易变（价格、context 长度）→ 旁注"* 实际以官网为准"
- 完全找不到原始来源 → **宁可不写也不要瞎编**

## 写作风格（必须遵守）

**🚫 不要用营销 / 夸大词**：避免"一篇看懂、 讲透、 秒懂、 完全搞懂、 一篇带你、 彻底、 保姆级、 深入浅出"这类内容农场常见词。 摘要里就直接列出文章涉及的主题点， 让读者自己判断；不要替读者"打包票"。

✅ 好示例：`'BPE 算法、 自回归生成、 词表权衡、 真实定价、 上下文经济学。'`
❌ 反例：`'一篇把 token 讲透。'`

**🚫 尽量不要出现真实代码**：知识 mote 重点是讲清楚原理 / 概念， 不是教某门语言的 API。 一定要展示流程或数据结构时， **必须用伪代码**（语言无关）， 而不是某具体语言 / 某家 SDK 的真实调用。

✅ 好示例：
```
v1 ← embed("一只可爱的猫")
similarity(a, b) := a · b / (|a| × |b|)
```
❌ 反例：写一段可直接 copy 跑的 Python（含 `import openai` 之类）

**🚫 全站禁止 `ui-monospace / Consolas / monospace` 字体**：哪怕在伪代码、 IPA 音标、 chat template、 BPE 切分块这种"看起来像代码"的地方， **一律用 `var(--font-hand-pen)`**。 视觉一致优先于"代码块识别度"。 用户的整本笔记是手写风， 不能突然冒出一段等宽字。

✅ `style={{ fontFamily: 'var(--font-hand-pen)' }}` 或 `style={{ fontFamily: PEN }}`
❌ `style={{ fontFamily: 'ui-monospace, Consolas, monospace' }}`

**也要注意 HTML 默认字体**：`<code>` / `<pre>` / `<kbd>` / `<samp>` 这几个标签浏览器默认就是 monospace。 这些已经被 `src/index.css` 里全局覆盖为 PEN：
```css
code, pre, kbd, samp, tt {
  font-family: var(--font-hand-pen) !important;
}
```
**不要删这条规则**。 如果某条 mote 想恢复 monospace（极不推荐）， 需要 inline style 显式覆盖。

之前 CLAUDE.md 写过的"chat template 等可保留 monospace 例外"已**取消**， 不要再加回来。

## 目标读者

- **AI 产品经理 / 业务决策者**为主，兼顾"听过但说不清楚"的好奇心读者
- 每篇 mote：**用高中生能听懂的语言**，讲到 **PM 能直接用的深度**（成本、产品决策、原理够用）
- 避免：堆术语、纯算法推导、过度学术化

## 视觉风格（默认手写笔记本风）

**整个站点都用手写笔记本风**（包括首页和文章）。

**共用组件**：`src/components/handwriting.tsx`
- `Paper` —— 纸张容器（奶油色背景 + 蓝色横线格 + 阴影）
- `Section` —— 带手绘下划线的章节标题 + 正文
- `RoughBox` —— 固定尺寸手绘方框
- `FluidRoughBox` —— 自适应宽度（用 ResizeObserver）
- `RoughArrow` —— 手绘箭头（支持 `right` / `down` 方向，移动端用 down）
- `RoughUnderline` —— 手绘下划线
- `RoughBarChart` —— 自适应手绘柱状图
- 常量：`INK` / `INK_BLUE` / `INK_RED` / `INK_GREEN`，`HAND` / `PEN` 字体变量

写新 mote 直接 `import` 这些原语，**不要在 mote 文件里重复定义**。

**字体**（通过 `@fontsource` 自托管，避免 Google CDN 在大陆被墙）
- `HAND` —— Caveat + Ma Shan Zheng，用于标题、标注
- `PEN` —— Kalam + Ma Shan Zheng，用于正文
- 在 `src/main.tsx` 顶部 `import '@fontsource/...'`，woff2 文件随构建打入 `dist/`
- 新加字体的步骤：`npm i @fontsource/<name>` → 在 `main.tsx` import 对应权重的 `.css`

**墨水色**
- `INK` `#1f2937` 深灰（正文）
- `INK_SEPIA` `#5b3a1f` 深棕墨（标题、术语，主要强调色）
- `INK_RED` `#b91c1c` 暗红（关键词、重点、下划线）
- `INK_GREEN` `#166534` 备用

**其他约定**
- 章节标题下方配 `RoughUnderline`
- 输入框做成虚线笔记本横线（`border-b-2 border-dashed`），不要圆角现代输入框
- 文末右下角加 `— YYYY.MM.DD · xxx —` 签名感
- 如内容确实不适合手写风（如纯代码示例），可显式偏离，但需注明

## 移动端响应式

**必须适配 ≥ 320px 屏宽**。手写字体在小屏上视觉偏大、`leading-loose` 太宽松，所以移动端要主动收紧。

**字号约定**（移动端 → 桌面端）
- 正文：`text-base sm:text-lg`（16px → 18px）
- 章节小标题：`text-xl sm:text-3xl`（20px → 30px）
- 一级标题：`text-3xl sm:text-5xl`
- 摘要 / 次要文字：`text-sm sm:text-base`

**行高 / 间距约定**（手写字体本身偏大，整体偏紧）
- 正文行高：`leading-relaxed`（1.625，两端统一，**不要用 leading-loose**）
- 章节间距：`mt-8 sm:mt-10`
- 段落间距：`space-y-2 sm:space-y-2.5`

**其他**
- `Paper` 内置 `px-4 py-6 sm:px-12 sm:py-14`，无需重复
- 横排流程图：`flex-col sm:flex-row`，移动端用 `<RoughArrow direction="down">`
- 表格 / 多列布局：在 `sm` 以下退化成卡片堆叠
- 用 `FluidRoughBox` / `RoughBarChart` 自适应容器宽度
- 避免任何 `width={固定 px}` 的元素大过 320px，否则用 `FluidRoughBox`
- `html, body` 全局加了 `overflow-x: clip` 兜底；不要依赖它，仍要主动适配
- 测试方法：dev tools 模拟 iPhone 14 Pro Max (430px) 和 iPhone SE (375px)，以及 iPad Pro

## 首页（Home）

- 使用 `Paper` 包裹（手写风）
- 单一显示模式：彩色卡片纵向堆叠（每条不同色，由 slug hash 决定，固定可复现）
- 右上角有手绘 **打乱按钮**（`ShuffleIcon`），点击随机打乱条目顺序

## ✅ 写完 mote 必过的 checklist

写完一篇 mote 后， **必须显式过一遍下面这张表**， 全部 ✓ 才能 commit / 告知用户完成。 不许跳过、 不许"默认应该没问题"。

### A. 信息核查
- [ ] 价格 / 模型规格 / 库版本：用 WebFetch 核过官方源？
- [ ] 算法 / 概念：读了原论文 / 厂商 docs， 不是凭记忆？
- [ ] 引用论文的作者、 年份、 venue 都正确？
- [ ] 文末有"参考来源 / References"章节， 列全用到的源？
- [ ] 引用格式：URL + accessed YYYY-MM-DD + 一句简短描述？
- [ ] 易变信息（价格 / context 长度等）旁注"* 实际以官网为准"？
- [ ] 完全找不到原始来源的内容 → 已删除， 不瞎编？

### B. 写作风格
- [ ] `meta.title` ≤ 10 汉字， 不带副标题？
- [ ] 没有"一篇看懂 / 讲透 / 秒懂 / 彻底 / 保姆级" 等营销词？
- [ ] `summary` 中性陈述， 不打包票、 不"带你"？
- [ ] 代码块都用了**伪代码**（除非文章本身就是讲某 API 格式）？
- [ ] 整体 tone 客观， 不浮夸？

### C. 视觉 / 排版
- [ ] 用了共用组件（Paper / Section / Changelog / RoughBox / ...）， 没在 mote 文件里重复定义？
- [ ] 正文字号 `text-base sm:text-lg`， 标题 `text-xl sm:text-3xl`？
- [ ] 行高 `leading-relaxed`（不要 `leading-loose`）， 段落间距 `space-y-2 sm:space-y-2.5`？
- [ ] 移动端无横向溢出？（无固定 >320px 元素； 大块图用 FluidRoughBox / RoughBarChart）
- [ ] 算式、 计算、 表达式块用 `PEN` 字体 + `tabular-nums`， 不用 `ui-monospace`？
- [ ] 章节标题都通过 `Section` 组件渲染（自带下划线）？
- [ ] 流程图横排：移动端 `flex-col sm:flex-row` + 向下箭头？

### D. 知识连贯
- [ ] 写时遇到的衍生话题， 已加到 CLAUDE.md "知识 backlog"？
- [ ] 跟已有 mote 重叠的概念， 用一句话点 + 链接， 不重复展开？

### E. 构建 / 体验
- [ ] `npm run build` 通过， 无 TS / ESLint 报错？
- [ ] dev server 刷新看过实际效果（至少桌面 + iPhone 14 Pro Max 430px）？

---

**操作约定**：写完每篇 mote， 把上面 checklist **逐条用文字回答**给用户看（不是默默心里过），让用户也能监督。 全部过了再说"已完成"。

## 发布到公众号草稿（skill 操作手册）

下次用户说"发到公众号 / 上传草稿 / 公众号草稿"时， **按这套流程操作， 不要凭印象重新探索**。

### 0. 前置条件（一次性， 不必每次确认）

- `wenyan-mcp` 已配在 Claude Code 的 `~/.claude.json` （project: `/Users/huhufan/work/dev`）
- 凭证已经通过 `claude mcp add wenyan-mcp -e WECHAT_APP_ID=... -e WECHAT_APP_SECRET=...` 注入到本机 `~/.claude.json`， 仓库里**不能**出现明文 AppID / AppSecret
- 公众号开发者平台 IP 白名单里有用户电脑公网 IP（每次换网络要重新加， 错误码 40164 就是没加）
- 本地 dev server 在跑：`http://localhost:5174/`（如果没在跑， 用 `cd /Users/huhufan/work/dev/motes && npm run dev &`）

### 1. 准备 cover 图（1200×1200 方形， WeChat 列表预览用）

1. Playwright 调浏览器到 1300×1300 视口
2. navigate `http://localhost:5174/cover/<slug>`
3. `browser_take_screenshot` 用 `target="#cover-art-page"`， 存到 `motes/public/screenshots/<slug>-cover.png`

### 2. 准备 body 图（2x 高清， 1440 宽 × N 高）

1. resize 浏览器到 900×1200
2. navigate `http://localhost:5174/m/<slug>`
3. **先查 Paper 总高**：
   ```js
   () => document.fonts.ready.then(() => {
     const paper = document.getElementById('mote-paper');
     return { total: paper.offsetHeight };
   })
   ```
4. 如果 `total < 8000` (CSS px， 2x 后 < 16000) → 直接触发下载按钮：
   ```js
   () => {
     const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('下载'));
     btn?.click();
   }
   ```
5. 如果 `total ≥ 8000` → **必须拆图**， 否则会撞 Chrome canvas 16384 高度上限被截断（html-to-image 用的 canvas 渲染）。 拆图步骤见下方"长文章 split"
6. Playwright 自动捕获下载到 `/Users/huhufan/work/dev/.playwright-mcp/<slug>.png`
7. `cp` 到 `motes/public/screenshots/<slug>-body.png`（如果拆图就 `-body-1.png` / `-body-2.png`）

### 2.5 长文章 split（仅 total ≥ 8000 px 时）

Paper 结构：`paper.children[0]` 是 cover SVG， `paper.children[1]` 是内容容器， `paper.children[1].children[...]` 是各 Section。

**逻辑**：先查每个 Section 高度， 累加分组（每组 < 4500 CSS px， 2x 后 < 9000）， 然后 N 次循环：
- 隐藏不属于本组的 Section（`display: none`）
- 第 2 张及以后还要隐藏 cover（避免重复）
- 触发下载按钮
- 等下载完， `cp` 到 `-body-N.png`
- 恢复 display

参考 Token 那次的实操（content 8663 CSS px， 拆 10/8 节两组， 出 1440×10910 + 1440×8080 两张图）。

### 3. 调 wenyan-mcp 发草稿

```yaml
tool: mcp__wenyan-mcp__publish_article
theme_id: default
content: |
  ---
  title: <短标题， ≤ 10 汉字>
  author: yifanook
  cover: /Users/huhufan/work/dev/motes/public/screenshots/<slug>-cover.png
  ---

  ![](/Users/huhufan/work/dev/motes/public/screenshots/<slug>-body.png)
```

**不要加额外文字 / 链接 / AI 标注**到 markdown 里 —— 用户明确要求过， 草稿只有图片。

### 4. 验证

返回 `Your article was successfully published to '公众号草稿箱'` + media ID → 成功
返回 `40164` → IP 白名单问题
返回 `40113` → 图片格式问题（必须 PNG/JPG/GIF， 不能 SVG）

### 批量发布所有 mote

需要做 20 篇时， 一篇一篇按上面 1~3 步走， 不要并行（Playwright 串行更可靠）。 写一个 todo list 用 TaskCreate 跟踪进度。

### 易变细节注意

- 文章一旦在网站上有改动（特别是 cover 颜色配色规则、 字体、 排版）→ 之前发的草稿过时， 需要重新跑流程覆盖
- 草稿 media_id 没法用 wenyan-mcp 删除， 重复发就行， 用户在公众号后台手工清理旧的
- 发布前先确认 dev server 跑的是最新代码（如果刚改过文件， npm run dev 的 HMR 应已生效； 怀疑就 kill + 重启）

## Git 提交规范

- **commit message 简洁为主**，一行能讲清就一行，不写多段详述。
- 形如 `add mote: 标题`、`tweak home layout`、`fix router` 即可。
- 不要堆砌 "what/why/how" 多段说明，PR/diff 已经能看出细节。
