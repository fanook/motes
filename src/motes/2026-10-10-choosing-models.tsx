/* eslint react-refresh/only-export-components: ["error", { "allowExportNames": ["meta"] }] -- The article registry reads this metadata export. */
import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Paper, Section, Changelog, HAND, PEN, INK_SEPIA, INK_RED, RoughUnderline } from '../components/handwriting';
import type { MoteMeta } from '../lib/motes';

export const meta: MoteMeta = {
  title: '模型怎么选',
  date: '2026-10-10',
  tags: ['模型', 'OpenAI', 'Claude', '选型'],
  summary: 'OpenAI 与 Claude 当前模型的定位、场景选择、推理设置和 API 成本，用任务选择器与账单示意比较取舍。',
};

const references = [
  ['OpenAI Models', 'https://developers.openai.com/api/docs/models', '当前通用主线、模型规格与图像、语音等专用模型。'],
  ['OpenAI Model selection', 'https://developers.openai.com/api/docs/guides/model-selection', '任务、成本、等待时间与推理投入之间的选择。'],
  ['OpenAI Pricing', 'https://developers.openai.com/api/docs/pricing', '标准短上下文单价，以及长上下文、缓存和处理模式的区别。'],
  ['Claude Models overview', 'https://platform.claude.com/docs/en/models/overview', 'Claude 当前主线、定位和规格；API 目录与产品可用性需要分别确认。'],
  ['Claude Choosing a model', 'https://platform.claude.com/docs/en/about-claude/models/choosing-a-model', '效率优先、能力优先、推理投入及任务评估的方法。'],
  ['Claude Pricing', 'https://platform.claude.com/docs/en/about-claude/pricing', '模型单价、长提示定价、缓存、批处理和工具费用。'],
  ['Claude Haiku 5.5', 'https://platform.claude.com/docs/en/models/haiku-5-5/overview', '高频任务定位；10 万输入 token 的价格分界。'],
  ['Claude Opus 5.5', 'https://platform.claude.com/docs/en/models/opus-5-5/overview', '长时间编程与知识工作的定位、默认投入和单价。'],
  ['OpenAI Observability and usage', 'https://developers.openai.com/api/docs/guides/agents-api/observability', '输入、输出与推理 token 的计费，以及工具和重试成本。'],
  ['Claude Thinking', 'https://platform.claude.com/docs/en/build-with-claude/thinking', '思考 token 按输出计费，可见回答不等于完整计费输出。'],
  ['Claude Code', 'https://claude.com/product/claude-code', '在代码仓库中实现功能、修复问题、运行测试的编程产品。'],
  ['Get started with Claude Design', 'https://support.claude.com/en/articles/14604416-get-started-with-claude-design', '设计与交互原型的创作入口，以及它与聊天、Claude Code、Artifacts 的关系。'],
  ['Use ChatGPT', 'https://learn.chatgpt.com/docs/use-chatgpt', '聊天、Work、Codex，以及图片、可视化和 Sites 等创作能力。'],
  ['ChatGPT Work', 'https://learn.chatgpt.com/docs/get-started-with-work', '把研究、分析和文件制作交给多步骤任务执行入口。'],
  ['Meet dots', 'https://learn.chatgpt.com/docs/dots', '持续跟进职责的常驻 Agent，可把任务交给 Work 或 Codex；正在逐步开放。'],
  ['ChatGPT Space', 'https://learn.chatgpt.com/docs/space', '页面、文件与协作空间，包含 Pages 和 Sites。'],
  ['Claude Cowork', 'https://claude.com/product/cowork', '研究、分析、文件整理等知识工作，与 Claude Code 的区别。'],
  ['Claude Artifacts', 'https://claude.com/features/artifacts', 'Design、Slides、Docs，以及 beta 阶段的 Dashboards 和 Motion。'],
  ['ChatGPT for Excel and Google Sheets', 'https://help.openai.com/en/articles/20001063-chatgpt-for-excel-and-google-sheets', '在两种电子表格软件中直接创建、修改和解释工作簿。'],
  ['ChatGPT for PowerPoint', 'https://help.openai.com/en/articles/20001242-chatgpt-for-powerpoint', '在 PowerPoint 中制作和编辑可继续修改的演示文稿。'],
  ['Claude for Microsoft 365', 'https://claude.com/claude-for-microsoft-365', 'Excel、PowerPoint、Word 与 beta 阶段的 Outlook 入口。'],
  ['Claude Tag', 'https://claude.com/product/tag', '在 Slack 线程中通过 @Claude 参与团队工作，处于 beta 阶段。'],
  ['ChatGPT in Slack and Teams', 'https://learn.chatgpt.com/docs/enterprise/chatgpt-slack-and-teams', '在团队通讯工具中启用和使用 @ChatGPT。'],
  ['ChatGPT Browser', 'https://learn.chatgpt.com/docs/browser', '桌面应用内置浏览器与网页任务。'],
  ['Claude in Chrome', 'https://claude.com/claude-in-chrome', 'Chrome 扩展，以及 Cowork 内置浏览器与扩展的关系。'],
  ['Introducing Prism', 'https://openai.com/index/introducing-prism/', '面向科学写作的 LaTeX 协作工作区。'],
  ['Claude Science', 'https://claude.com/product/claude-science', '连接科研工具、数据库与计算环境的工作台，处于 public beta 阶段。'],
  ['Health in ChatGPT', 'https://help.openai.com/en/articles/20001036-health-in-chatgpt', '健康资料与对话入口，逐步向符合条件的用户开放。'],
  ['Aardvark → Codex Security', 'https://openai.com/index/introducing-aardvark/', '安全研究产品现已更名为 Codex Security，并集成到 Codex。'],
  ['Claude Security', 'https://claude.com/product/claude-security', '代码漏洞扫描与修复建议，以及 Claude Code 安全插件。'],
  ['OpenAI API Platform', 'https://developers.openai.com/api/docs', '模型 API、Agent 开发与开发工具。'],
  ['Claude Platform', 'https://claude.com/platform/api', '模型 API 和 Claude Console 的开发、观察与管理入口。'],
  ['ChatGPT Atlas retirement', 'https://help.openai.com/en/articles/20001371-chatgpt-atlas-retirement', 'Atlas 已退役，不应作为当前可选产品列出。'],
  ['Sora discontinuation', 'https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation', 'Sora 网页与应用已停用，API 也已到公告的关闭日期。'],
  ['Workspace Agents', 'https://learn.chatgpt.com/workspace-agents', '已发布的工作区 Agent 可从外部系统触发执行。'],
  ['Claude 产品目录', 'https://claude.com/', 'Claude 通用聊天产品、产品导航、功能与扩展目录。'],
];

function Ref({ n }: { n: number }) {
  return <sup className="ml-0.5 text-xs"><a href={`#models-ref-${n}`} className="underline" aria-label={`参考来源 ${n}`}>[{n}]</a></sup>;
}

function Note({ title, children, color = '#eee5d2' }: { title: string; children: ReactNode; color?: string }) {
  return <div className="my-3 border border-dashed border-stone-400 p-3 sm:p-4 rounded-sm" style={{ backgroundColor: color, overflowWrap: 'anywhere' }}>
    <p className="mb-2 text-xl" style={{ fontFamily: HAND, color: INK_SEPIA }}>{title}</p>
    <div className="space-y-2">{children}</div>
  </div>;
}

type ProductEntry = { name: string; use: string; refs: number[] };
const productRows: { purpose: string; openai: ProductEntry[]; anthropic: ProductEntry[] }[] = [
  { purpose: '对话', openai: [{ name: 'ChatGPT · Chat', use: '问答、写作、分析；网页、桌面与手机入口。', refs: [13] }], anthropic: [{ name: 'Claude · Chat', use: '问答、写作、分析；网页、桌面与手机入口。', refs: [36] }] },
  { purpose: '交付任务', openai: [{ name: 'ChatGPT Work', use: '研究、分析、制作文件等多步骤工作。', refs: [14] }, { name: 'Dots', use: '持续跟进一项职责，主动带回结果；逐步开放。', refs: [15] }, { name: 'Workspace Agents', use: '团队发布可复用的 Agent，并从业务系统触发任务。', refs: [35] }], anthropic: [{ name: 'Claude Cowork', use: '在授权的文件与工具中完成知识工作；网页和手机入口仍为 beta。', refs: [17] }] },
  { purpose: '编程', openai: [{ name: 'Codex', use: '实现功能、修 bug、测试、审查代码；桌面、CLI、IDE 与云端入口。', refs: [13] }], anthropic: [{ name: 'Claude Code', use: '读改代码、实现功能、运行测试；终端、IDE、桌面与网页入口。', refs: [11] }] },
  { purpose: '设计与创作', openai: [{ name: 'Images / Visualizations / Sites', use: 'ChatGPT 内的创作功能：生成与编辑图片、制作交互图解、搭建网站与工具。', refs: [13] }], anthropic: [{ name: 'Claude Design / Slides / Docs', use: '设计与原型、演示文稿、协作文档；可从 Artifacts 作品入口使用。', refs: [12, 18] }, { name: 'Dashboards / Motion（beta）', use: 'Artifacts 中的仪表盘与动态视觉创作入口。', refs: [18] }] },
  { purpose: '协作与通讯', openai: [{ name: 'ChatGPT Space / Pages', use: '把页面、文件和团队协作放在一起。', refs: [16] }, { name: '@ChatGPT', use: '在 Slack、Microsoft Teams 中使用。', refs: [23] }], anthropic: [{ name: 'Claude Tag · @Claude', use: '在 Slack 线程中参与团队工作，处于 beta；文档协作也可用 Claude Docs。', refs: [22, 18] }] },
  { purpose: '办公软件', openai: [{ name: 'ChatGPT for Excel / Google Sheets', use: '在表格侧栏中创建、修改、解释工作簿。', refs: [19] }, { name: 'ChatGPT for PowerPoint', use: '直接创建、编辑与完善演示文稿。', refs: [20] }], anthropic: [{ name: 'Claude for Microsoft 365', use: 'Excel、PowerPoint、Word 内的办公入口；Outlook 处于 beta。', refs: [21] }] },
  { purpose: '浏览器', openai: [{ name: 'ChatGPT 内置浏览器', use: '在桌面应用中查看网页并完成网页任务；浏览器扩展用于连接外部浏览器。', refs: [24] }], anthropic: [{ name: 'Claude in Chrome / Cowork 浏览器', use: '前者是 Chrome 扩展；后者是 Cowork 自带的浏览器。', refs: [25] }] },
  { purpose: '科学与健康', openai: [{ name: 'Prism', use: '科学写作与 LaTeX 协作工作区。', refs: [26] }, { name: 'Health in ChatGPT', use: '整理与理解个人健康资料的专门入口，逐步开放；用于辅助理解。', refs: [28] }], anthropic: [{ name: 'Claude Science', use: '连接科研数据库、工具与计算环境，推进科学分析；public beta。', refs: [27] }] },
  { purpose: '代码安全', openai: [{ name: 'Codex Security', use: '原 Aardvark，集成在 Codex 中的安全研究与漏洞检查入口。', refs: [29] }], anthropic: [{ name: 'Claude Security', use: '扫描代码漏洞并提出修复建议；另有 Claude Code 安全插件（beta）。', refs: [30] }] },
  { purpose: '开发者平台', openai: [{ name: 'OpenAI API Platform', use: '用 API 把模型接入自己的应用；平台提供开发与管理工具。', refs: [31] }], anthropic: [{ name: 'Claude Platform / Console', use: '用 API 接入模型，在 Console 中开发、观察与管理。', refs: [32] }] },
];

function ProductCell({ entries }: { entries: ProductEntry[] }) {
  return <td className="p-2 sm:p-3"><div className="space-y-3">{entries.map(entry => <div key={entry.name}><strong>{entry.name}</strong><span className="block mt-1">{entry.use}{entry.refs.map(n => <Ref key={n} n={n} />)}</span></div>)}</div></td>;
}

type Model = { name: string; id: string; company: 'OpenAI' | 'Claude'; role: string; fit: string; input: number; output: number; context: string; effort: string; ref: number };
const models: Model[] = [
  { name: 'GPT-6 Luna', id: 'gpt-6-luna', company: 'OpenAI', role: '高频、明确的小任务', fit: '分类、抽取、局部修改；优先控制调用成本。', input: 0.1, output: 0.5, context: '1.05M', effort: '支持从 none 到 max 的多个投入档位。', ref: 1 },
  { name: 'GPT-6.1 Sol', id: 'gpt-6.1-sol', company: 'OpenAI', role: '兼顾能力与成本的主力', fit: '编程、写作、多步骤交付；复杂工作也值得先测试。', input: 2, output: 10, context: '1.05M', effort: '支持 low、medium、high、xhigh、max。', ref: 1 },
  { name: 'GPT-6 Astra', id: 'gpt-6-astra', company: 'OpenAI', role: '最困难的通用工作', fit: '复杂推理、棘手编程、要求严格的综合交付。', input: 10, output: 50, context: '1.05M', effort: '支持 low、medium、high、xhigh、max。', ref: 1 },
  { name: 'Claude Haiku 5.5', id: 'claude-haiku-5-5', company: 'Claude', role: '高频、低延迟的任务', fit: '分类、抽取、任务分流；大量重复处理。', input: 0.1, output: 0.5, context: '1M', effort: '支持自适应思考，默认 effort 为 medium。', ref: 7 },
  { name: 'Claude Sonnet 5.5', id: 'claude-sonnet-5-5', company: 'Claude', role: '速度与能力兼顾', fit: '日常编程、内容创作、数据分析与工具工作流。', input: 2, output: 10, context: '1M', effort: '支持自适应思考，默认 effort 为 high。', ref: 4 },
  { name: 'Claude Opus 5.5', id: 'claude-opus-5-5', company: 'Claude', role: '长时间编程与知识工作', fit: '大范围重构、复杂工程、需要持续推进的任务。', input: 4, output: 20, context: '1M', effort: '自适应思考始终开启，默认 effort 为 medium。', ref: 8 },
  { name: 'Claude Fable 5.1', id: 'claude-fable-5-1', company: 'Claude', role: '更困难的推理与长任务', fit: '多步骤研究、长时间 Agent 工作；用于其他选择仍达不到要求的任务。', input: 10, output: 50, context: '1M', effort: '自适应思考始终开启，默认 effort 为 high。', ref: 4 },
];

const tiers = [
  ['高频与低成本', 'GPT-6 Luna', 'Claude Haiku 5.5', '任务明确、数量多、便于检查'],
  ['日常主力', 'GPT-6.1 Sol', 'Claude Sonnet 5.5', '写作、编程、分析与常见交付'],
  ['长时间复杂工作', 'GPT-6.1 Sol / GPT-6 Astra', 'Claude Opus 5.5', '跨文件修改、持续执行、复杂工程'],
  ['最高能力优先', 'GPT-6 Astra', 'Claude Fable 5.1', '困难推理、综合研究、严格交付'],
];

function FamilyMap() {
  return <div className="my-4">
    <table className="hidden sm:table w-full text-left text-base border-collapse" aria-label="两家模型的定位分布">
      <thead><tr className="border-b-2 border-dashed border-stone-400">{['任务定位', 'OpenAI', 'Claude'].map(h => <th key={h} className="p-2 font-normal text-xl" style={{ fontFamily: HAND }}>{h}</th>)}</tr></thead>
      <tbody>{tiers.map(([role, openai, claude, fit]) => <tr key={role} className="border-b border-dashed border-stone-300"><th scope="row" className="p-2 font-normal w-[30%]"><span className="block" style={{ color: INK_SEPIA }}>{role}</span><span className="text-sm text-stone-500">{fit}</span></th><td className="p-2 w-[35%]">{openai}</td><td className="p-2 w-[35%]">{claude}</td></tr>)}</tbody>
    </table>
    <div className="sm:hidden space-y-3">{tiers.map(([role, openai, claude, fit]) => <Note key={role} title={role}><p>OpenAI：{openai}</p><p>Claude：{claude}</p><p className="text-sm text-stone-500">{fit}</p></Note>)}</div>
    <p className="mt-3 text-sm sm:text-base text-stone-500">按官方定位整理的任务地图，行与行允许重叠。同一行表示用途相近，不表示两家能力相等或跑分相同。</p>
  </div>;
}

function ModelShelf() {
  const [company, setCompany] = useState<'OpenAI' | 'Claude'>('OpenAI');
  return <div className="my-4">
    <div className="flex gap-3" role="group" aria-label="选择模型家族">{(['OpenAI', 'Claude'] as const).map(c => <button key={c} type="button" onClick={() => setCompany(c)} aria-pressed={company === c} className="cursor-pointer border-b-2 border-dashed px-4 py-2 text-xl" style={{ color: company === c ? INK_RED : INK_SEPIA, borderColor: company === c ? INK_RED : '#a8a29e', fontFamily: HAND }}>{c}</button>)}</div>
    <div aria-live="polite" className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
      {models.filter(m => m.company === company).map(m => <Note key={m.id} title={m.name} color={company === 'OpenAI' ? '#dde8ed' : '#f6e4cf'}><p style={{ color: INK_SEPIA }}>{m.role}<Ref n={m.ref} /></p><p>{m.fit}</p><p className="text-sm sm:text-base text-stone-600">API ID：{m.id}<br />上下文：{m.context} token；最大输出：128K token。<br />输入 / 输出：${m.input} / ${m.output}，每百万 token。</p><p className="text-sm sm:text-base">{m.effort}</p></Note>)}
    </div>
    <p className="text-sm sm:text-base text-stone-500">单价口径：美元、直接 API、标准处理、未命中缓存的短提示。Haiku 的此档价格适用于输入不超过 100,000 token；超过后输入 / 输出为 $0.50 / $2.50。OpenAI 长上下文另有单价。实际以官网为准。<Ref n={3} /><Ref n={6} /></p>
  </div>;
}

const scenarios = [
  { name: '分类与抽取', task: '给几千条客户反馈打标签，抽取项目名和日期。', fast: ['GPT-6 Luna', 'Claude Haiku 5.5'], quality: ['GPT-6.1 Sol', 'Claude Sonnet 5.5'], why: '重复且边界明确，适合先试低成本模型；遇到讽刺、隐含诉求或复杂分类，再比较主力模型。', check: '检查漏标、错标和字段格式；把少见类别也放进样本。' },
  { name: '写作与改稿', task: '写邮件、改文章，或把材料整理成有依据的周报。', fast: ['GPT-6.1 Sol', 'Claude Sonnet 5.5'], quality: ['GPT-6 Astra', 'Claude Opus 5.5'], why: '主力模型适合先出可修改的稿件；复杂材料和严格文风值得比较更高能力模型。短句润色也可先试 Luna 或 Haiku。', check: '核对事实、语气和遗漏；请候选模型处理同一份原稿再比较。' },
  { name: '日常编程', task: '加一个页面、修已定位的 bug，或给已有功能做小修改。', fast: ['GPT-6.1 Sol', 'Claude Sonnet 5.5'], quality: ['GPT-6 Astra', 'Claude Opus 5.5'], why: '从主力开始，结合真实仓库和测试看能否完成；涉及难定位问题或复杂约束时，再比较更强选择。', check: '能否构建、功能是否正确、是否引入回归；不要只看生成了多少代码。' },
  { name: '大型重构', task: '跨多个模块改架构，查一个反复出现、难以复现的问题。', fast: ['GPT-6.1 Sol', 'Claude Opus 5.5'], quality: ['GPT-6 Astra', 'Claude Fable 5.1'], why: '需要持续保持任务目标、追踪依赖和核对结果。优先确保候选能完成，再考虑减少成本；Opus 已是复杂工作的重要起点。', check: '同一套任务、同一份仓库、同一组测试；检查遗漏、返工和实际总耗时。' },
  { name: '研究与分析', task: '综合多份资料，解释矛盾证据，给出带来源的建议。', fast: ['GPT-6.1 Sol', 'Claude Sonnet 5.5'], quality: ['GPT-6 Astra', 'Claude Fable 5.1'], why: '简单摘要可从主力开始；证据相互冲突、需要多步研究与完整交付时，比较最高能力档。', check: '来源是否真的支持结论、是否遗漏反例；最新事实需要资料或搜索工具。' },
  { name: '读图与生成图片', task: '有时要读截图、分析图表，有时要直接生成一张插画。', fast: ['GPT-6.1 Sol（读图）', 'Claude Sonnet 5.5（读图）'], quality: ['GPT-6 Astra（读图）', 'Claude Opus 5.5（读图）'], why: '读图可以测试支持视觉的通用模型；生成图片则要使用图像生成模型或工具，不能只按通用文本模型的档位选。', check: '读图看细节识别与数据解释；生成图片另看构图、修改能力和图片成本。' },
];

function ScenarioChooser() {
  const [active, setActive] = useState(2);
  const [quality, setQuality] = useState(false);
  const item = scenarios[active];
  const picks = quality ? item.quality : item.fast;
  return <div className="my-4">
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="group" aria-label="选择任务场景">{scenarios.map((s, i) => <button key={s.name} type="button" onClick={() => setActive(i)} aria-pressed={active === i} className="cursor-pointer border border-dashed p-3 text-left rounded-sm" style={{ backgroundColor: active === i ? '#e5ecd8' : '#ffffff50', borderColor: active === i ? INK_SEPIA : '#a8a29e' }}>{s.name}</button>)}</div>
    <div className="flex flex-wrap gap-3 my-3" role="group" aria-label="选择优先事项">{[[false, '兼顾速度与成本'], [true, '能力与交付优先']].map(([value, label]) => <button key={String(value)} type="button" aria-pressed={quality === value} onClick={() => setQuality(value as boolean)} className="cursor-pointer border-b-2 border-dashed px-2 py-2" style={{ color: quality === value ? INK_RED : INK_SEPIA, borderColor: quality === value ? INK_RED : '#a8a29e' }}>{label}</button>)}</div>
    <div aria-live="polite">
      <Note title={item.task} color="#e5ecd8"><p><strong>OpenAI 候选：</strong>{picks[0]}</p><p><strong>Claude 候选：</strong>{picks[1]}</p></Note>
      <p>{item.why}</p><p className="mt-2" style={{ color: INK_RED }}>怎么判断选对了：{item.check}</p>
    </div>
    <p className="mt-3 text-sm sm:text-base text-stone-500">这是依据官方定位给出的试用起点，属于本文建议。没有进行两家模型的同任务实测，不构成性能排名或成功保证。</p>
  </div>;
}

const workloads = [
  { name: '短文本处理', input: 800, output: 200 },
  { name: '资料整理', input: 10000, output: 2000 },
  { name: '较长材料分析', input: 50000, output: 5000 },
];
function CostNotebook() {
  const [active, setActive] = useState(1);
  const [count, setCount] = useState(100);
  const task = workloads[active];
  return <div className="my-4">
    <div className="flex flex-wrap gap-2" role="group" aria-label="选择账单示意任务">{workloads.map((w, i) => <button key={w.name} type="button" onClick={() => setActive(i)} aria-pressed={active === i} className="cursor-pointer border-b-2 border-dashed px-3 py-2" style={{ borderColor: active === i ? INK_RED : '#a8a29e' }}>{w.name}</button>)}</div>
    <label className="block my-4" htmlFor="model-call-count">独立请求数量：{count} 次<input id="model-call-count" type="range" min="1" max="1000" step="1" value={count} onChange={e => setCount(Number(e.target.value))} className="block w-full mt-2" style={{ accentColor: INK_SEPIA }} /></label>
    <p className="text-sm sm:text-base mb-3">假设每次计费输入 {task.input.toLocaleString()} token，计费输出 {task.output.toLocaleString()} token。</p>
    <div aria-live="polite" className="border-y border-dashed border-stone-400 py-2">
      {models.map(m => <div key={m.id} className="flex justify-between items-baseline gap-3 py-2 border-b border-dashed border-stone-200 last:border-0"><span className="text-sm sm:text-base">{m.name}</span><span className="shrink-0 tabular-nums" style={{ color: INK_SEPIA }}>${((task.input * m.input + task.output * m.output) * count / 1000000).toFixed(4)}</span></div>)}
    </div>
    <p className="mt-3 text-sm sm:text-base text-stone-500">仅估算这些请求的标准 token 费用，无缓存、批处理折扣、长提示加价或工具费。计费输出假设已包括需付费的思考 token；不是只数界面里的回答。不同模型对同一份文本的 token 计数和输出量可能不同，真实任务不会自动符合这组假设。<Ref n={3} /><Ref n={6} /><Ref n={9} /><Ref n={10} /></p>
  </div>;
}

export default function Mote() {
  return <Paper>
    <header className="mb-6 sm:mb-8">
      <h1 className="text-3xl sm:text-5xl leading-tight" style={{ fontFamily: HAND, color: INK_SEPIA }}>模型怎么选</h1>
      <RoughUnderline width={230} seed={81} />
      <p className="mt-2 sm:mt-3 text-lg sm:text-2xl" style={{ fontFamily: HAND }}>—— OpenAI 与 Claude，给不同任务找合适的搭档</p>
    </header>
    <div className="text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-2.5" style={{ fontFamily: PEN }}>
      <p>写一封邮件、处理一万条反馈、重构一个项目，都叫“让 AI 帮忙”。但它们需要的判断力、等待时间和预算，可能差很多。</p>
      <p>选模型，像给工作选搭档：明确又重复的任务，可以先找轻快的；需要判断与组织的工作，用主力；遇到复杂、难验收的问题，再比较更强的选择。</p>
      <Note title="本文版本 · 2026-10-10"><p>本文按当天官方 API 文档整理 OpenAI 和 Anthropic 的 Claude 通用模型。型号、价格和产品可用性会变，实际以官网为准。场景建议是试用起点，不是横向实测排名。</p></Note>
    </div>

    <Section title="一、先分清公司、产品和模型">
      <p>顺着同一列往下看：谁开发 → 你用什么产品或功能入口 → 背后是什么模型。中间按用途展开，便于找到你实际要打开的工具。</p>
      <p className="text-sm sm:text-base text-stone-600">按 2026-10-10 官方目录与文档整理主要公开产品、专门工作入口和扩展。不同用途之间不代表能力完全对应；beta、逐步开放或企业入口，也不代表每个账号都能使用。</p>
      <table className="my-4 w-full table-fixed border-collapse text-left text-sm sm:text-base" aria-label="公司、产品与模型的对应关系" style={{ overflowWrap: 'anywhere' }}>
        <thead><tr className="border-b-2 border-dashed border-stone-400" style={{ fontFamily: HAND, color: INK_SEPIA }}>
          <th scope="col" className="w-[20%] p-2 font-normal">层次</th>
          <th scope="col" className="w-[40%] p-2 font-normal">OpenAI 一侧</th>
          <th scope="col" className="w-[40%] p-2 font-normal">Anthropic 一侧</th>
        </tr></thead>
        <tbody>
          <tr className="border-b border-dashed border-stone-400 align-top" style={{ backgroundColor: '#e5ecd8' }}>
            <th scope="row" className="p-2 font-normal"><strong>公司</strong><span className="hidden sm:block mt-1 text-stone-600">谁开发</span></th>
            <td className="p-2"><strong>OpenAI</strong></td>
            <td className="p-2"><strong>Anthropic</strong></td>
          </tr>
          {productRows.map((row, i) => <tr key={row.purpose} className="border-b border-dashed border-stone-400 align-top" style={{ backgroundColor: i % 2 === 0 ? '#dde8ed' : '#e8eef0' }}>
            <th scope="row" className="p-2 sm:p-3 font-normal"><span className="block text-xs text-stone-600">产品 / 入口</span><strong>{row.purpose}</strong></th>
            <ProductCell entries={row.openai} /><ProductCell entries={row.anthropic} />
          </tr>)}
          <tr className="border-b border-dashed border-stone-400 align-top" style={{ backgroundColor: '#f6e4cf' }}>
            <th scope="row" className="p-2 font-normal"><strong>模型</strong><span className="hidden sm:block mt-1 text-stone-600">理解、推理与生成</span></th>
            <td className="p-2"><strong>GPT 系列</strong><span className="block mt-1">如 GPT-6.1 Sol、GPT-6 Astra。<Ref n={1} /></span></td>
            <td className="p-2"><strong>Claude 系列</strong><span className="block mt-1">如 Claude Sonnet 5.5、Claude Opus 5.5。<Ref n={4} /></span></td>
          </tr>
        </tbody>
      </table>
      <p><strong>看名字，还要看它属于哪一种：</strong>ChatGPT、Claude 是通用产品；Work、Cowork 是执行任务的入口；Design、Slides、Images 等是创作体验；办公插件与浏览器扩展把能力带到别的软件里。它们可以共用模型，也可以相互连接。</p>
      <p><strong>套餐与功能也要分清：</strong>Plus、Pro、Max、Business、Team、Enterprise、Edu 等描述账号的额度与管理方式；搜索、深度研究、语音、Projects、记忆、Skills、连接器等描述产品中的能力。它们不与 GPT、Sonnet、Opus 这些模型名称处在同一层。</p>
      <p><strong>旧名字另看状态：</strong>Atlas 已退役；Sora 网页与应用于 2026-04-26 停用，API 公告关闭日期为 2026-09-24，因此不放入当前产品表。Aardvark 则已更名为 Codex Security。<Ref n={33} /><Ref n={34} /><Ref n={29} /></p>
      <p>产品入口之间也可以相互连接：Claude Design 的设计体验目前可在 Claude 对话、Claude Code 和 Artifacts 中使用。它提供画布与设计编辑流程，属于产品这一层；底下负责理解与生成的，仍是模型。<Ref n={12} /></p>
      <p><strong style={{ color: INK_RED }}>Claude 这个名字会出现在两层：</strong>“我打开 Claude 写文章”通常说的是产品；“我选择 Claude Sonnet 5.5”说的是具体模型。</p>
      <p>模型像发动机，产品像整辆车。产品提供界面、文件接入和工具，模型负责理解与生成。同一型号装进不同产品，提示词、工具和运行流程都会影响最后的体验。</p>
      <p>因此，“这个模型在 API 目录里”与“我在当前软件里能选到它”，要分别看。本文用 API 型号介绍定位，具体软件还要看账号、套餐、管理员设置和模型菜单。</p>
      <p>模型周围怎样组织工作，见 <Link to="/m/2026-10-10-agent-harness" className="underline decoration-dashed" style={{ color: INK_SEPIA }}>Harness 是什么</Link>。</p>
    </Section>

    <Section title="二、两家的模型分布，先看任务地图">
      <p>截至本文日期，OpenAI 当前通用主线是 GPT-6 Luna、GPT-6.1 Sol、GPT-6 Astra；Claude 当前主线是 Haiku 5.5、Sonnet 5.5、Opus 5.5、Fable 5.1。<Ref n={1} /><Ref n={4} /></p>
      <FamilyMap />
      <p>这张图把用途排在前面：同一模型可能覆盖多行。价格更高通常对应厂商定位更复杂的工作，但不能仅凭价格推断某个任务必然做得更好。</p>
      <p>数字也要和家族名一起看。Claude Fable 5.1 与 Sonnet 5.5 属于不同定位，不能因为“5.5 大于 5.1”就把 Sonnet 判成更强。OpenAI 的 Astra、Sol、Luna，同样要看定位与完整型号。</p>
    </Section>

    <Section title="三、把当前型号放到两本小册子里">
      <p>点击家族，查看每个型号适合先试什么、上下文多大、API 怎么计价。</p>
      <ModelShelf />
      <p>OpenAI 官方把 Astra 放在最高能力的位置，Sol 兼顾能力与成本；Claude 官方建议多数工作可以从 Opus 5.5 开始，同时也给出从 Haiku 等低成本模型起步的路线。本文的“日常主力”按用途与预算整理，不代表替换厂商默认推荐。<Ref n={2} /><Ref n={5} /></p>
      <p>上述上下文数字表示一轮可处理材料的容量；最大输出表示能生成多长。它们不是“保证记住每个细节”的分数。已有一篇 <Link to="/m/2026-05-26-context-window" className="underline decoration-dashed" style={{ color: INK_SEPIA }}>Context Window</Link> 专门解释这个区别。</p>
    </Section>

    <Section title="四、什么场景，从什么模型开始？">
      <p>先选工作，再选你更看重什么。两列候选都值得测试，最后用自己的材料和验收标准决定。</p>
      <ScenarioChooser />
      <Note title="一份客户反馈，可以分三段做" color="#dde8ed"><p>① Luna / Haiku：逐条抽取字段、做初步分类。</p><p>② Sol / Sonnet：综合问题，写成可修改的周报。</p><p>③ 需要时再用 Astra、Opus 或 Fable：检查矛盾证据，处理困难案例。</p></Note>
      <p>这是任务分工示意。分段后仍要核对信息有没有丢失；小模型漏掉的反馈，后面的模型如果看不到原始资料，也难以补回来。</p>
    </Section>

    <Section title="五、型号之外，还有“投入多少思考”">
      <p>一些模型支持 reasoning effort 或 effort，可以理解为给当前任务设定思考投入。它与模型型号是两项选择：换一个搭档，和让同一个搭档多花时间推敲，作用不同。<Ref n={2} /><Ref n={5} /></p>
      <Note title="同一个主力，也能用不同投入" color="#e5ecd8"><p>只改按钮文案：从较低投入试起，检查有没有改错事实。</p><p>跨文件修 bug：保留足够投入，并配合定位、修改和测试。</p><p>研究相互冲突的证据：比较提高投入后，论证与检查是否真的改善。</p></Note>
      <p>本文建议：先用产品默认值或官方推荐起点跑一次，再根据质量与等待时间调整。两家的 high、medium 并非同一把尺子；有些模型始终开启思考，有些支持关闭，不能按相同按钮名比较。</p>
      <p>模型输出更长、等待更久，也不自动代表结果更好。要看增加投入是否减少了错误、遗漏和返工。</p>
    </Section>

    <Section title="六、价格差多少，先算一份小账">
      <p>API 常把费用分成输入与输出：输入是模型本轮收到的材料，输出是它生成的内容。token 是计数单位，不直接等于汉字或单词；详见 <Link to="/m/2026-05-23-what-is-token" className="underline decoration-dashed" style={{ color: INK_SEPIA }}>Token 是什么</Link>。</p>
      <Note title="计算示意"><p>总费用 ≈ 请求数量 ×（输入 token ÷ 一百万 × 输入单价 ＋ 计费输出 token ÷ 一百万 × 输出单价）。</p></Note>
      <CostNotebook />
      <p>相同假设下，100 次“资料整理”：Luna / Haiku 为 $0.20，Sol / Sonnet 为 $4，Opus 为 $8，Astra / Fable 为 $20。这是单价差异的示意，相同价格不意味着相同能力。</p>
      <p>ChatGPT、Claude 或编程软件的订阅额度，需要按产品自己的规则看；这张 API 账单不能直接换算成月费套餐能用多少次。</p>
      <p>真正选型还要看<strong style={{ color: INK_RED }}>每份合格成果的成本</strong>：模型费用、工具费用、失败重试，以及人的检查与返工时间。便宜模型一次完成很划算；反复重做，优势就可能缩小。</p>
    </Section>

    <Section title="七、读图、画图、说话，要先认能力类型">
      <p>本文列出的通用主线支持文本与图片输入、文本输出。读一张截图和生成一张插画，是不同的能力需求。<Ref n={1} /><Ref n={4} /></p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Note title="理解文字与图片" color="#e5ecd8"><p>先测试通用模型：文章、代码、截图、图表解释。材料质量与任务难度决定候选档位。</p></Note>
        <Note title="生成图片与处理语音" color="#f6e4cf"><p>确认专用模型或工具：OpenAI 目录另列图像生成、实时语音、转写等类别，费用与输入输出方式也不同。<Ref n={1} /></p></Note>
      </div>
      <p>应用可能把专用工具接在通用模型后面，让你只看到一个对话入口。判断能不能画图、听录音或实时说话，要看整套应用实际接入的能力。</p>
    </Section>

    <Section title="八、用自己的任务，做一次小型试用">
      <p>两家官方都建议用实际任务测试。一般从这四步开始，比记住一份固定排行榜更有用。<Ref n={2} /><Ref n={5} /></p>
      <ol className="list-decimal pl-5 space-y-2">
        <li><strong>留一小组真实任务：</strong>例如 10～20 个样本，覆盖普通情况、难例和边界；这是起步建议，不是充分统计验证。</li>
        <li><strong>先写验收标准：</strong>分类看漏标，写作看事实与语气，编程看测试与功能。</li>
        <li><strong>用相同条件试候选：</strong>相同资料、工具和要求，分别记录合格率、耗时、费用与返工。</li>
        <li><strong>按目标定起点：</strong>高频任务可从便宜模型测试；困难交付可先从强模型建立可行方案，再比较能否降成本。</li>
      </ol>
      <p>如果失败来自读不到文件或缺少工具，先修工作条件。更强模型也不能凭空取得没有接入的资料。</p>
      <Note title="给下一次任务留一张选型便签" color="#e5ecd8"><p>任务是否明确？需要哪些输入与工具？可以等多久？怎样算完成？</p><p>从一两个合适候选开始，用真实交付验证；发现具体能力缺口，再调整型号或思考投入。</p></Note>
    </Section>

    <Section title="参考来源">
      <p className="text-sm sm:text-base text-stone-500">均为两家官方资料，accessed 2026-10-10。型号、价格、规格与可用性以官网为准；本文未对候选模型进行性能实测。</p>
      <ol className="list-decimal pl-5 space-y-3 text-sm sm:text-base" style={{ overflowWrap: 'anywhere' }}>{references.map(([title, url, desc], i) => <li key={url} id={`models-ref-${i + 1}`}><a href={url} target="_blank" rel="noreferrer" className="underline underline-offset-4" style={{ color: INK_SEPIA }}>{title}</a> — {desc}<span className="block text-stone-500">{url} · accessed 2026-10-10</span></li>)}</ol>
    </Section>
    <Changelog created={meta.date} entries={meta.changelog} />
  </Paper>;
}
