/* eslint react-refresh/only-export-components: ["error", { "allowExportNames": ["meta"] }] -- Article registry metadata. */
import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Paper, Section, Changelog, HAND, PEN, INK_SEPIA, INK_RED, RoughUnderline } from '../components/handwriting';
import type { MoteMeta } from '../lib/motes';

export const meta: MoteMeta = {
  title: '决策模型是什么', date: '2026-10-12', tags: ['Jev', '决策模型', 'Agent'],
  summary: '以 Jev 为例，用客服工单解释类型化决策、概率与置信度、并行判断，以及模型如何与程序和工具分工。',
};
const sources = [
  ['Introducing System One Models & Jev', 'https://typesafe.ai/blog/introducing-system-one-models-and-jev', '厂商发布介绍：架构、并行采样、RLCD，以及性能宣传的评测限制。'],
  ['System One', 'https://docs.typesafe.ai/concepts/system-one', '面向软件的快速结构化判断及适用范围。'],
  ['State', 'https://docs.typesafe.ai/concepts/state', '每次判断所需的状态与上下文。'],
  ['Primitives (Questions)', 'https://docs.typesafe.ai/primitives', '问题定义、三类输出、独立问题批量处理与依赖关系。'],
  ['Choice', 'https://docs.typesafe.ai/primitives/choice', '固定选项、选项描述、概率分布与兜底选项。'],
  ['Score', 'https://docs.typesafe.ai/primitives/score', '有序等级、评分与等级概率。'],
  ['Noul', 'https://docs.typesafe.ai/primitives/noul', '是非问题的概率含义及门槛判断。'],
  ['Confidence', 'https://docs.typesafe.ai/confidence', 'confidence 与概率的区别、计算及分流门槛。'],
  ['Jev 1.13 jaggedness', 'https://docs.typesafe.ai/model-jaggedness/jev-1.13', 'jev-1.13 的已知局限，最后审阅日期 2026-10-02。'],
  ['AI primer', 'https://docs.typesafe.ai/introduction/machine-learning-primer', '厂商对决策训练与概率校准的解释。'],
  ['Intent routing', 'https://docs.typesafe.ai/patterns/intent-routing', '模型提供判断，程序选择处理路径的模式。'],
  ['TypeSafe AI — Team', 'https://typesafe.ai/team', '公司所在地、三位联合创始人与公开履历。'],
  ['TypeSafe API — OpenAPI specification', 'https://api.typesafe.ai/openapi.json', '模型元数据中的 release_date 示例为 2026-09-15；示例不等同于首发公告。'],
];
function Ref({ n }: { n: number }) { return <sup className="ml-1 text-xs"><a href={`#jev-ref-${n}`} aria-label={`参考来源 ${n}`} className="underline">[{n}]</a></sup>; }
function Slip({ title, children, color = '#eee5d2' }: { title: string; children: ReactNode; color?: string }) {
  return <div className="my-4 border border-dashed border-stone-400 p-3 sm:p-4" style={{ backgroundColor: color }}><p className="mb-2 text-xl" style={{ fontFamily: HAND, color: INK_SEPIA }}>{title}</p><div className="space-y-2">{children}</div></div>;
}
function Related({ slug, children }: { slug: string; children: ReactNode }) { return <Link to={`/m/${slug}`} className="underline decoration-dashed" style={{ color: INK_SEPIA }}>{children}</Link>; }
const labels = ['账单', '技术', '售前', '其他'];
const tickets = [
  { name: '明确的账单问题', text: '同一笔订单扣了两次钱，麻烦帮我查一下。', probabilities: [0.94, 0.02, 0.01, 0.03], note: '这里只自动分配负责团队。是否真的重复扣款，仍需查询订单记录。' },
  { name: '跨部门的模糊问题', text: '升级后功能一直打不开，钱也已经扣了。我该找谁？', probabilities: [0.43, 0.46, 0.02, 0.09], note: '账单与技术两种可能很接近。补充资料或让人分诊，比只盯最高选项更合适。' },
  { name: '目录之外的诉求', text: '我是记者，想约你们负责人做一次采访。', probabilities: [0.03, 0.02, 0.05, 0.90], note: '即使“其他”的概率很高，也没有具体接收团队，因此进入人工分诊。' },
  { name: '模拟一次自信的错误', text: '我问的是能否开增值税发票，不是咨询产品功能。', probabilities: [0.03, 0.01, 0.95, 0.01], note: '故意放入错误预测：实际应交账单团队，模拟结果却选了售前。高置信度门槛也拦不住每个错误。' },
];
function TriageDesk() {
  const [active, setActive] = useState(0);
  const [threshold, setThreshold] = useState(70);
  const ticket = tickets[active];
  const top = Math.max(...ticket.probabilities);
  const winner = ticket.probabilities.indexOf(top);
  const confidence = (top - 1 / labels.length) / (1 - 1 / labels.length);
  const auto = confidence >= threshold / 100 && winner !== 3;
  return <div className="my-4 border border-dashed border-stone-400 p-3 sm:p-5 bg-[#e8eef0]">
    <p className="text-xl sm:text-2xl" style={{ fontFamily: HAND, color: INK_SEPIA }}>工单分流台</p>
    <p className="my-2 text-sm sm:text-base text-stone-600">固定模拟数据，不调用 Jev API。门槛仅演示自动分配团队，不授权退款或其他业务动作。</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3" role="group" aria-label="工单示例">{tickets.map((t, i) => <button key={t.name} type="button" aria-pressed={active === i} onClick={() => setActive(i)} className="p-2 border border-dashed text-left cursor-pointer" style={{ backgroundColor: active === i ? '#e5ecd8' : '#fff8' }}>{t.name}</button>)}</div>
    <blockquote className="border-l-2 border-stone-400 pl-3 my-4">“{ticket.text}”</blockquote>
    <p className="text-sm text-stone-600">问题：应该交给哪个团队？</p>
    <div className="space-y-2 my-3">{labels.map((label, i) => <div key={label} className="grid grid-cols-[3em_1fr_3em] gap-2 items-center"><span>{label}</span><div className="h-4 bg-white/60"><div className="h-full" style={{ width: `${ticket.probabilities[i] * 100}%`, backgroundColor: i === winner ? INK_SEPIA : '#9ca3af' }} /></div><span className="text-right tabular-nums">{Math.round(ticket.probabilities[i] * 100)}%</span></div>)}</div>
    <p>选择：<strong>{labels[winner]}</strong> · 最高选项概率：<strong>{Math.round(top * 100)}%</strong></p>
    <p>Choice confidence：<strong className="tabular-nums">{confidence.toFixed(2)}</strong>（按官方四选项公式计算）<Ref n={8} /></p>
    <label className="block mt-4" htmlFor="jev-threshold">自动分流门槛：confidence ≥ <strong className="tabular-nums">{(threshold / 100).toFixed(2)}</strong></label>
    <input id="jev-threshold" className="w-full my-2 accent-stone-700" type="range" min={0} max={100} step={1} value={threshold} onChange={e => setThreshold(Number(e.target.value))} />
    <div aria-live="polite" className="border-t border-dashed border-stone-400 pt-3"><p className="text-xl" style={{ color: auto ? INK_SEPIA : INK_RED }}>{auto ? `自动分配 → ${labels[winner]}团队` : '人工分诊 → 补充资料或检查目录'}</p><p className="mt-2">{ticket.note}</p></div>
  </div>;
}
const questionRows = [
  ['Choice · 选哪个', '账单、技术、售前、其他，哪个团队负责？', '选中的选项、各选项概率，以及 confidence。', 5],
  ['Score · 在哪一档', '按“无需催办 / 尽快跟进 / 立即升级”的明确标准评级。', '等级分数、等级说明、各等级概率与 confidence；分数可落在等级之间。', 6],
  ['Noul · 是否成立', '客户是否明确要求退还款项？', '“是”的概率，范围 0～1；没有单独的 confidence 字段。', 7],
] as const;

export default function Mote() {
  return <Paper>
    <header className="mb-6 sm:mb-8"><h1 className="text-3xl sm:text-5xl" style={{ fontFamily: HAND, color: INK_SEPIA }}>决策模型是什么</h1><RoughUnderline width={250} seed={121} /><p className="mt-3 text-lg sm:text-2xl" style={{ fontFamily: HAND }}>—— 用 Jev 看 AI 怎样替程序做判断</p></header>
    <div className="text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-2.5" style={{ fontFamily: PEN, overflowWrap: 'anywhere' }}>
      <p>客服每天收到一万条消息。真正写回复之前，系统先得判断：找哪个团队？是否紧急？有没有提出退款？</p>
      <p>这些判断读起来不复杂，写成规则却很容易漏。“钱扣了两次”和“重复收费”没有相同关键词，却可能说着同一件事。</p>
      <Slip title="本文主角：TypeSafe AI 的 Jev"><p>Jev 是厂商称为 System One 的决策模型：接收当前资料和预先定义的问题，返回软件可以使用的选择与数值。这里的“决策模型”聚焦这种有边界的判断，不泛指所有预测、规划或强化学习模型。<Ref n={2} /></p><p className="text-sm sm:text-base text-stone-600">资料核对日期 2026-10-12。本文未实测 Jev；界面里的消息、概率和结果均为教学模拟，产品行为与可用性以官方文档为准。</p></Slip>
    </div>
    <Section title="一、Jev 从哪里来？">
      <p>先认清名字之间的关系：<strong>TypeSafe AI 是开发公司，System One 是它给这类模型起的名称，Jev 是推出的模型。</strong>它面向软件里的判断环节，公开介绍时处于 early access（早期开放试用）阶段。<Ref n={1} /></p>
      <table className="w-full table-fixed border-collapse my-4 text-sm sm:text-base" aria-label="Jev 的公司与历史背景"><thead><tr className="border-b-2 border-dashed border-stone-400 text-left"><th className="w-[27%] p-2">背景</th><th className="p-2">具体是谁、发生了什么</th></tr></thead><tbody>
        <tr className="border-b border-dashed border-stone-400 align-top bg-[#dde8ed]"><th scope="row" className="p-2 text-left font-normal">开发公司</th><td className="p-2">TypeSafe AI，团队在美国旧金山办公。<Ref n={12} /></td></tr>
        <tr className="border-b border-dashed border-stone-400 align-top"><th scope="row" className="p-2 text-left font-normal">联合创始人</th><td className="p-2">Diogo Almeida（CEO）、Sasha Sheng（COO）、Erik Gafni（CTO）。Almeida 曾在 OpenAI 参与指令跟随与对话模型相关研究；Sheng 曾在 Meta / FAIR 担任研究工程师；Gafni 有创业及生产 AI 系统经验。<Ref n={1} /><Ref n={12} /></td></tr>
        <tr className="border-b border-dashed border-stone-400 align-top bg-[#dde8ed]"><th scope="row" className="p-2 text-left font-normal">公开之前</th><td className="p-2">官方发布介绍称，团队经过两年隐身研发后公开 Jev。这里描述的是研发历程，不能据此推算公司的确切成立日。<Ref n={1} /></td></tr>
        <tr className="border-b border-dashed border-stone-400 align-top"><th scope="row" className="p-2 text-left font-normal">发布日期线索</th><td className="p-2">官方 API 文档给 jev-latest 的 release_date 示例写的是 <strong>2026-09-15</strong>。发布博客正文未标日期，因此目前只能将其列为官方日期线索，尚不能独立确认它就是首次公开发布日。<Ref n={13} /></td></tr>
        <tr className="border-b border-dashed border-stone-400 align-top bg-[#dde8ed]"><th scope="row" className="p-2 text-left font-normal">公开时的阶段</th><td className="p-2">Jev 以 early access 形式介绍给开发者。早期试用、正式全面可用和后续版本更新，是不同时间节点。<Ref n={1} /></td></tr>
      </tbody></table>
      <p><strong>为什么要做它？</strong>Almeida 在发布文章里提出一个问题：模型已经很会聊天，为什么软件自动化还没有同样普及？团队选择把精力放在大量反复发生的小判断上，希望降低它们的成本与等待时间，并让结果更容易被程序使用。<Ref n={1} /></p>
      <Slip title="两个名字，两条来路" color="#e5ecd8"><p><strong>System One：</strong>命名受丹尼尔·卡尼曼《思考，快与慢》中“系统 1 / 系统 2”的区分启发，借此强调快速判断。这是产品命名的类比，不表示它复现了人脑机制。</p><p><strong>Jev：</strong>取自经济学家 William Stanley Jevons（威廉·斯坦利·杰文斯）。公司借这个名字表达一种期待：智能使用成本下降后，会出现更多值得自动化的场景。<Ref n={1} /></p></Slip>
      <p>理解这段来历，再看下面的工单例子，就更容易明白它为什么围绕选择、评分与概率来设计接口。</p>
    </Section>
    <Section title="二、把它想成一个分诊员">
      <p>医院先分诊，再进入具体诊室。工单系统也可以先读懂诉求，把它交给合适的团队。Jev 可以放在这个判断环节，程序负责真正分配。<Ref n={11} /></p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">{[['资料', '客户消息、订单记录、已知政策'], ['判断', '属于哪一类？某个条件成立吗？'], ['动作', '程序分流，再由工具执行']].map(([title, text], i) => <Slip key={title} title={`0${i + 1} · ${title}`} color={['#e5ecd8', '#dde8ed', '#f6e4cf'][i]}><p>{text}</p></Slip>)}</div>
      <p>比如“帮我写一封体面的道歉信”需要生成内容；“这条消息是不是在要求退款”则适合一次聚焦的判断。两者可以前后配合。</p>
    </Section>
    <Section title="三、一次请求里，究竟装什么？">
      <p>可以把每次请求想成一张判断单：上半张放事实，下半张写题目与答案范围。state 是供模型判断的资料；它不会自动替你查询订单或读取数据库。相关记录要由应用先取得，再放进来。<Ref n={3} /></p>
      <Slip title="教学判断单 · 不是可运行的 API 请求" color="#e5ecd8"><p><strong>选用模型：</strong>应用指定要调用的 Jev 型号。</p><p><strong>当前资料 state：</strong>“同一笔订单扣了两次钱”；订单系统尚未核对。</p><p><strong>判断题 instructions：</strong>“客户主要诉求应该由哪个团队接收？”</p><p><strong>选项标准 criteria：</strong>账单＝扣款和发票；技术＝功能故障；售前＝购买前咨询；其他＝以上均不适合。</p><p><strong>返回结果：</strong>选中的团队 + 各选项概率 + confidence。</p></Slip>
      <p>“账单＝扣款和发票”这些描述也是提示的一部分。选项边界不清，模型就难以替你补齐业务定义。题目应直接写明，不只靠一个叫“部门”的字段名暗示意思。<Ref n={5} /></p>
      <p>资料里说“扣了两次”，只证明客户提出了这个说法。验证重复扣款，还要取得真实交易记录；判断不能代替查证。</p>
    </Section>
    <Section title="四、三种题型，分别用在哪里？">
      <p>Jev 的基础接口有三种题型。先决定软件需要哪一种结果，再选择题型。<Ref n={4} /></p>
      <table className="w-full table-fixed border-collapse my-4 text-sm sm:text-base" aria-label="Jev 三种问题类型"><thead><tr className="border-b-2 border-dashed border-stone-400 text-left"><th className="w-[24%] p-2">题型</th><th className="w-[36%] p-2">工单中的问题</th><th className="w-[40%] p-2">返回什么</th></tr></thead><tbody>{questionRows.map(([name, question, answer, ref], i) => <tr key={name} className="border-b border-dashed border-stone-400 align-top" style={{ backgroundColor: i % 2 ? '#eee5d2' : '#dde8ed' }}><th scope="row" className="p-2 text-left font-normal">{name}</th><td className="p-2">{question}</td><td className="p-2">{answer}<Ref n={ref} /></td></tr>)}</tbody></table>
      <p>注意：Noul 的 0.5 表示对“是”和“否”同样不确定，不表示事情“完成了一半”或“严重程度中等”。如果要衡量程度，应先定义 Score 的等级。<Ref n={7} /></p>
    </Section>
    <Section title="五、动手分流：什么时候交给人？">
      <p>切换工单，再移动门槛。同一份预测，程序可以采取不同策略。选项里有“其他”，但我们仍明确规定它进入人工分诊。</p>
      <TriageDesk />
      <p><strong style={{ color: INK_RED }}>选项概率和 confidence，要分开读。</strong>前者是模型给每个选项的概率；后者概括答案分布有多集中。在四选项情况下，最高概率 0.94 对应 confidence 0.92，并非把同一个数改个名字。<Ref n={8} /></p>
      <p>校准的目标是：大量有代表性的样本里，预测约 90% 的那一组，实际也约九成正确。单次预测无法证明校准，更不能把 confidence＝0.9 直接读成“本次有九成正确率”。真实门槛需要用自己的数据验证。<Ref n={10} /></p>
      <p>提高门槛通常会把更多任务交给人，也可能仍放过自信的错误。应同时记录分流错误率、人工接手比例，以及错误造成的返工。</p>
    </Section>
    <Section title="六、和聊天模型输出 JSON 有什么区别？">
      <p>JSON 只规定包装形式。普通生成模型也能使用受约束的结构化输出；不能因为返回了一个对象，就断言它是决策模型。</p>
      <Slip title="厂商披露的技术路线" color="#f6e4cf"><p>TypeSafe 表示，Jev 使用面向决策的架构、并行采样，以及 RLCD（面向校准决策的强化学习），把训练目标放在判断与概率上；没有沿用自由文本逐 token 输出的交互方式。<Ref n={1} /></p><p>这是厂商公开说明，并不等于完整公开了网络结构、参数和训练配方。本文据此解释路线，不推断未披露的内部细节。</p></Slip>
      <p>一个请求可以一起问“交给谁”“有没有退款诉求”“处于哪个紧急等级”。这些问题共享资料、独立求值；第一题的答案不会自动成为第二题的依据。如果必须先查到记录再判断，就要让程序获取资料后发下一次请求。<Ref n={4} /></p>
      <p>可以想象同时交出几张小判断单，少走几趟取送流程。但更长输入、网络、问题数量和实际部署仍影响耗时；并行不表示无限任务都能瞬间做完。</p>
    </Section>
    <Section title="七、它在 Agent 里站哪一班岗？">
      <ol className="list-decimal pl-5 space-y-3"><li><strong>程序准备资料：</strong>拿到客户消息，必要时调用工具读取订单。</li><li><strong>Jev 做窄判断：</strong>分类、识别诉求，给候选路径评分。</li><li><strong>程序检查条件：</strong>看门槛、目录是否覆盖、权限和业务规则。</li><li><strong>工具与生成模型继续工作：</strong>查询证据、生成回复草稿，再按流程验收。</li><li><strong>保存回执：</strong>记录采用哪个模型、看过什么资料、为什么走这条路径，便于追查。</li></ol>
      <p>这是按官方意图路由模式整理的教学流程。Jev 返回“账单”本身不会创建工单；返回“需要退款”也不授予退款权限。执行仍由程序与工具控制。<Ref n={11} /></p>
      <p>其中的工作系统，见 <Related slug="2026-10-10-agent-harness">Harness 是什么</Related>；实际动作与操作指导的区别，见 <Related slug="2026-10-10-skill-tool-mcp">Skill、Tool 与 MCP</Related>。把 Jev 接进系统，也需要明确设计这些连接。</p>
    </Section>
    <Section title="八、“不会幻觉”，到底保证哪一层？">
      <p>TypeSafe 的宣传把无幻觉与类型安全联系起来，强调答案结构和候选范围受约束。这是接口层的保证，不能推导出所有业务判断都正确。<Ref n={1} /></p>
      <Slip title="一张没有正确答案的选择题" color="#dde8ed"><p>消息：“我是记者，想安排采访。”</p><p>选项：账单 / 技术 / 售前。</p><p>三个选项都不合适。模型即使严格选了其中一个，格式仍然合法，业务却分错了。加入“其他 / 以上都不是”能提供退出路径，但仍需测试模型是否会正确使用。<Ref n={5} /></p></Slip>
      <p>官方对 jev-1.13 列出的局限包括精确数值计算、日期比较、多层间接关系、无关资料干扰、对抗内容与选项顺序敏感等。这些是该版本的已知边界，不应假设所有后续版本完全相同。<Ref n={9} /></p>
      <p>实践上，把精确算术交给代码，把判断条件写清，测试否定句、混合诉求和目录之外的输入。需要写文章、写解释或解决复杂开放问题时，仍用适合的生成与推理工具。</p>
    </Section>
    <Section title="九、它值不值得用，看整条流程">
      <p>高频、选项明确、可以验收的判断，值得测试这种路线。只做几次判断，或主要时间花在查资料与人工检查上，换模型带来的收益可能有限。</p>
      <p>不要把官网的数百倍优势当成普遍结果。发布介绍承认：部分评测参考其他强模型的概率，短输入演示对 Jev 有利，且展示的工作流收益可能处在真实收益的高端。它们是厂商评测，不能替代你的业务试用。<Ref n={1} /></p>
      <Slip title="留一份小型验收单" color="#e5ecd8"><p>① 选一组真实工单，包含明确、模糊、缺资料与目录外案例。</p><p>② 同时比较现有规则、生成模型与 Jev 的分类错误和等待时间。</p><p>③ 改门槛，观察自动处理比例与漏掉的错误；检查概率是否可信。</p><p>④ 把人工检查、工具耗时和返工算进每份合格结果的成本。</p></Slip>
      <p>Jev 这个方向提供了一种分工：把大量小判断做成软件能使用的输出，让程序组织流程，再把开放式工作交给适合的模型。选型的共同方法，也可参考 <Related slug="2026-10-10-choosing-models">模型怎么选</Related>。</p>
    </Section>
    <Section title="参考来源"><p className="text-sm sm:text-base text-stone-500">均为 TypeSafe AI 官方原始资料，accessed 2026-10-12。本文未进行模型性能实测；交互数据为模拟。</p><ol className="list-decimal pl-5 space-y-3 text-sm sm:text-base" style={{ overflowWrap: 'anywhere' }}>{sources.map(([name, url, description], i) => <li key={url} id={`jev-ref-${i + 1}`}><a href={url} target="_blank" rel="noreferrer" className="underline" style={{ color: INK_SEPIA }}>{name}</a> — {description}<span className="block text-stone-500">{url} · accessed 2026-10-12</span></li>)}</ol></Section>
    <Changelog created={meta.date} entries={meta.changelog} />
  </Paper>;
}
