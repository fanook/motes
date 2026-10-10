/* eslint react-refresh/only-export-components: ["error", { "allowExportNames": ["meta"] }] -- Articles expose metadata for the Vite content registry. */
import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Paper, Section, Changelog, HAND, PEN, INK, INK_SEPIA, INK_RED,
  INK_GREEN, RoughUnderline,
} from '../components/handwriting';
import type { MoteMeta } from '../lib/motes';

export const meta: MoteMeta = {
  title: 'Codex 如何做任务',
  date: '2026-10-10',
  tags: ['Codex', 'Agent', 'AI 入门'],
  summary: '一句需求如何变成任务资料袋：每轮模型请求里的提示词、工具调用、执行回执与结果验证。',
};

const TASK = '给 motes 首页加一个搜索框，按标题和摘要筛选文章，保持现在的手写风格。';
const sources = [
  ['工具调用', 'https://developers.openai.com/api/docs/guides/function-calling', '模型提出调用，程序执行，结果进入后续请求。'],
  ['消息与指令', 'https://developers.openai.com/api/docs/guides/text', '消息角色以及应用指令与用户需求的关系。'],
  ['AGENTS.md', 'https://learn.chatgpt.com/docs/agent-configuration/agents-md', '项目指导文件的发现与加载规则。'],
  ['对话状态', 'https://developers.openai.com/api/docs/guides/conversation-state', '历史信息如何供后续模型请求使用。'],
  ['推理模型', 'https://developers.openai.com/api/docs/guides/reasoning', '推理 token、可见摘要与内部推理的区别。'],
  ['权限与安全', 'https://learn.chatgpt.com/docs/agent-approvals-security', '沙箱和审批如何约束工具执行。'],
  ['上下文压缩', 'https://developers.openai.com/api/docs/guides/compaction', '用更少的 token 延续关键任务状态。'],
  ['提示词缓存', 'https://developers.openai.com/api/docs/guides/prompt-caching', '匹配的输入前缀可以复用计算。'],
  ['Harness 与执行环境', 'https://developers.openai.com/api/docs/guides/agents/sandboxes', '模型周围的调度程序与实际工作环境如何分工。'],
  ['Skills', 'https://learn.chatgpt.com/docs/build-skills', '为特定任务提供可复用的操作指导。'],
];

function Ref({ n }: { n: number }) {
  return <sup className="ml-0.5 text-xs"><a href={`#codex-ref-${n}`} className="underline" aria-label={`参考来源 ${n}`}>[{n}]</a></sup>;
}

function Note({ title, children, color = '#eee5d2' }: { title?: string; children: ReactNode; color?: string }) {
  return (
    <div className="my-3 border border-dashed border-stone-400 px-3 py-3 sm:px-5 sm:py-4 rounded-sm" style={{ backgroundColor: color, fontFamily: PEN, overflowWrap: 'anywhere' }}>
      {title && <p className="mb-2 text-lg sm:text-xl" style={{ fontFamily: HAND, color: INK_SEPIA }}>{title}</p>}
      <div className="space-y-2">{children}</div>
    </div>
  );
}

const packets = [
  { label: '工作规则', hint: '这份工作怎样做', text: '你是一个协助完成软件任务的助手。先了解项目再修改；尊重用户已有改动；检查结果；说明做了什么、验证了什么。', extra: '通常来自平台或应用。API 中可用 system / developer 等角色表达规则；这里展示的是含义，不是产品内部原文。', color: '#eee5d2' },
  { label: '用户需求', hint: '这次要交付什么', text: TASK, extra: '用户后续补充的“不要区分大小写”“空输入显示全部”等，也会成为任务信息。', color: '#f6e4cf' },
  { label: '项目与环境', hint: '在哪里、遵守哪些约定', text: '当前目录：motes。项目使用 React 和 TypeScript。首页保持手写字体、奶油纸底；需要适配手机。当前工作区允许修改，部分操作受权限限制。', extra: '可以来自项目指导文件、环境信息、已读取的资料。目录名称告诉模型去哪里找；目录里的代码还需要被读取。', color: '#e5ecd8' },
  { label: '工具说明书', hint: '有哪些动作可以申请', text: '读取文件：需要文件路径，返回文件内容。修改文件：需要路径与改动内容，返回执行结果。运行命令：需要命令与工作目录，返回输出和状态。', extra: '真实工具定义还会说明名称、参数格式等；它们通常是请求里的工具定义，并不全是塞在同一段提示词里的文字。', color: '#dde8ed' },
  { label: '过程记录', hint: '刚才已经发生了什么', text: '用户提出了需求。助手申请读取首页文件。工具返回了首页代码。助手提出修改。工具报告文件已更新……', extra: '第一轮可能还没有本次任务的工具记录；后续轮次会加入动作与回执。旧对话或压缩后的任务状态也可能在这里。', color: '#ebe1ed' },
];

function PacketExplorer() {
  const [active, setActive] = useState(0);
  const packet = packets[active];
  return (
    <div className="my-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="选择请求中的资料">
        {packets.map((p, i) => <button key={p.label} type="button" onClick={() => setActive(i)} aria-pressed={i === active} className="cursor-pointer px-3 py-2 border border-dashed rounded-sm text-sm sm:text-base" style={{ fontFamily: PEN, backgroundColor: i === active ? p.color : 'transparent', borderColor: i === active ? INK_SEPIA : '#a8a29e', color: INK_SEPIA }}>{p.label}</button>)}
      </div>
      <div aria-live="polite">
        <Note title={`${packet.label} · ${packet.hint}`} color={packet.color}>
          <p>{packet.text}</p>
          <p className="text-sm sm:text-base text-stone-600">{packet.extra}</p>
        </Note>
      </div>
    </div>
  );
}

const rounds = [
  { label: '找资料', added: '本次任务尚未拿到首页代码。资料袋里有规则、需求、环境信息与工具说明。', request: '请根据任务与现有资料决定下一步。', action: '申请读取首页 Home.tsx 和文章元信息 motes.ts。', receipt: '首页已有文章列表；每篇文章有 title 和 summary 字段。', next: '下一轮可以根据真实代码设计搜索，而不是猜项目结构。' },
  { label: '做修改', added: '新增：上一轮“读取哪些文件”的动作记录，以及工具返回的代码。', request: '原需求仍然有效；参考刚收到的首页代码继续完成任务。', action: '申请修改首页：记录搜索词，并用标题、摘要筛选列表。', receipt: '修改已保存到 Home.tsx。', next: '知道文件改好了，但还没有证据说明它能正常工作。' },
  { label: '查结果', added: '新增：修改动作与“文件已更新”的回执。先前的需求、代码等继续作为可用上下文。', request: '基于当前改动继续处理任务，检查是否符合要求。', action: '申请运行构建，并用可用的预览工具检查搜索行为。', receipt: '示例反馈：构建通过；输入关键词能筛选，但清空后仍只显示部分文章。', next: '反馈暴露了问题，需要修正清空输入时的逻辑。' },
  { label: '修正', added: '新增：构建结果和页面检查发现的问题。', request: '保留已完成的工作，根据检查结果继续。', action: '申请修正空输入的处理，再检查关键词搜索和清空操作。', receipt: '示例反馈：搜索正常；清空后恢复全部文章。', next: '有了本次验收项目的结果，可以准备交付。' },
  { label: '交付', added: '新增：修正后的检查结果。资料袋已包含需求、实际改动和验证依据。', request: '根据当前状态判断是否可以交付，并向用户说明结果。', action: '生成最终说明：修改了哪里、支持什么行为、完成了哪些检查。', receipt: '这一轮直接回复用户；没有新的工具调用。', next: '本次工作在这里结束。用户提出新要求后，可以继续下一轮。' },
];

function RoundExplorer() {
  const [active, setActive] = useState(0);
  const round = rounds[active];
  return (
    <div className="my-4">
      <p className="text-sm sm:text-base text-stone-500 mb-3">点击轮次，观察资料怎样增加。五轮只是简化示例，实际可以更多或更少。</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="选择模型请求轮次">
        {rounds.map((r, i) => <button key={r.label} type="button" onClick={() => setActive(i)} aria-pressed={active === i} className="px-3 py-2 border-b-2 border-dashed cursor-pointer" style={{ color: active === i ? INK_RED : INK_SEPIA, borderColor: active === i ? INK_RED : '#a8a29e', fontFamily: HAND }}>{i + 1} · {r.label}</button>)}
      </div>
      <div aria-live="polite">
        <Note title={`第 ${active + 1} 次模型请求 · 资料袋里有什么？`} color="#e5ecd8"><p>{round.added}</p><p className="text-sm sm:text-base text-stone-600">用人话概括这次请求的意思：“{round.request}”</p></Note>
        <details className="my-3 border border-dashed border-stone-400 p-3 sm:p-4 rounded-sm bg-white/40">
          <summary className="cursor-pointer" style={{ color: INK_SEPIA }}>展开这轮的完整教学资料单</summary>
          <div className="mt-3 space-y-3 text-sm sm:text-base">
            <p className="text-stone-500">按用途展开可用上下文；不表示实际请求字段、排列顺序或传输原文。</p>
            <p><strong>工作规则：</strong>{packets[0].text}</p>
            <p><strong>项目与环境：</strong>{packets[2].text}</p>
            <p><strong>工具定义：</strong>{packets[3].text}</p>
            <p><strong>用户消息：</strong>{TASK}</p>
            {active === 0 ? <p><strong>本次执行历史：</strong>还没有工具回执，尚未读取首页代码。</p> : rounds.slice(0, active).map((r, i) => <div key={r.label} className="border-l-2 border-dashed border-stone-300 pl-3 space-y-1"><p><strong>助手动作 {i + 1}：</strong>{r.action}</p><p><strong>对应工具结果 {i + 1}：</strong>{r.receipt}</p>{i === 0 && <p className="text-stone-500">实际读取回执会带上请求读取的代码；这里仅用文字概括，方便不写代码的读者阅读。</p>}</div>)}
            <p><strong>当前状态：</strong>{round.added}</p>
          </div>
        </details>
        <Note title="模型输出 · 下一步动作" color="#dde8ed"><p>{round.action}</p></Note>
        <Note title={active === 4 ? '用户收到的结果' : '执行回执 · 新增的事实'} color="#f6e4cf"><p>{round.receipt}</p></Note>
        <p className="pl-2" style={{ color: INK_GREEN }}>→ {round.next}</p>
      </div>
      <p className="mt-3 text-sm sm:text-base text-stone-500">上面的“请求的意思”是解释性转述。运行程序可以追加工具结果后再次调用模型，不需要每次另外写一句“请继续”。</p>
    </div>
  );
}

function Related({ slug, children }: { slug: string; children: ReactNode }) {
  return <Link to={`/m/${slug}`} className="underline decoration-dashed underline-offset-4" style={{ color: INK_SEPIA }}>{children}</Link>;
}

export default function Mote() {
  return (
    <Paper>
      <header className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-5xl leading-tight" style={{ fontFamily: HAND, color: INK_SEPIA }}>Codex 如何做任务</h1>
        <div className="mt-1"><RoughUnderline width={240} seed={42} /></div>
        <p className="mt-2 sm:mt-3 text-lg sm:text-2xl" style={{ fontFamily: HAND, color: INK }}>—— 从按下发送，到文件真的被改好</p>
      </header>
      <div className="text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-2.5" style={{ fontFamily: PEN }}>
        <p>你在 Codex 里输入一句任务。它先说“我看一下项目”，接着读文件、改代码、运行命令，过一会儿告诉你“完成了”。</p>
        <p>这段时间里，谁在读文件？大模型收到的只有你那句话吗？第一次没做对，它又是怎么知道的？</p>
        <p>我们用一个小任务，从头走一遍：</p>
        <Note color="#f6e4cf"><p>“{TASK}”</p></Note>
        <p className="text-sm sm:text-base text-stone-500">本文依据公开文档解释通用工作机制。资料袋、提示词和五轮过程均为教学示意，不是某次真实请求抓包，也不是 Codex 内部提示词原文；具体工具、消息组织和执行环境随版本与配置变化。</p>
      </div>

      <Section title="一、先认识这支小队">
        <p>把它想成一个远程协作的小队：你提出需求，有人组织工作，有人分析资料，还有人实际动手。</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          {[
            ['Codex 运行程序', '像项目协调员', '组织资料，调用模型，调度工具，把执行结果带回来。'],
            ['大模型', '像读材料的顾问', '根据眼前的信息，生成解释、代码或下一步动作。'],
            ['工具与环境', '像实际工作的手', '打开文件、保存改动、运行命令，返回结果。'],
          ].map(([name, role, desc]) => <div key={name} className="border border-dashed border-stone-400 p-3 sm:p-4 rounded-sm bg-white/40"><p style={{ fontFamily: HAND, color: INK_SEPIA }} className="text-xl">{name}</p><p className="text-sm text-stone-500 mb-2">{role}</p><p>{desc}</p></div>)}
        </div>
        <p>模型周围这套组织和执行机制常叫 <strong>Harness</strong>，可以理解为“让模型开展工作的配套程序”。界面上都显示为 Codex 在做事，背后却有不同角色在接力。<Ref n={9} /></p>
        <p>本地任务的工具可以在你的电脑上工作，云端任务可以在远程环境里工作。模型能获得哪些资料，取决于提供给它的上下文和工具返回的内容；它不会仅凭一个目录路径，就自动知道里面所有代码。</p>
      </Section>

      <Section title="二、按下发送，先装一个资料袋">
        <p><strong style={{ color: INK_RED }}>你输入的那句话，是任务需求；模型处理这次任务所依据的全部材料，叫上下文。</strong></p>
        <p>“提示词”有时指你写的需求，有时泛指给模型的指令。为方便理解，我们把一次请求中可供模型使用的材料叫“资料袋”。它包含指令，也包含代码、历史和工具结果等事实材料。<Ref n={2} /><Ref n={4} /></p>
        <PacketExplorer />
        <p>这五类是按用途分的抽屉，不对应五个固定 API 字段。实际请求可以包含带角色的消息、工具定义、图片或其他输入项。选择哪个模型、允许多长输出、推理力度等设置，也属于请求配置；它们不一定是一段自然语言提示词。</p>
        <p>所以，发送任务之前，应用可能已准备好一部分工作规则和环境信息；模型开始工作后，再通过工具补充缺少的资料。</p>
      </Section>

      <Section title="三、提示词为什么还要分身份？">
        <p>同样是一段文字，“工作要求”“用户需求”“网页上的一句话”，身份不同，用途也不同。</p>
        <Note title="像文件上盖了不同的章">
          <p><strong>system / developer：</strong>平台或应用给出的工作规则。</p>
          <p><strong>user：</strong>用户的需求、补充说明，以及用户提供的材料。</p>
          <p><strong>assistant：</strong>模型先前生成的消息或动作。</p>
          <p><strong>工具结果：</strong>某次执行返回的材料；具体 API 可用专门的结果项表示。</p>
        </Note>
        <p>这些标签让模型知道“谁说的、这段内容用来做什么”。应用指令与用户需求有优先关系；文章里看到的“忽略所有规则”，也不能因为出现在读取结果中，就被当成新的工作指令。<Ref n={2} /></p>
        <p>项目还可以写一份 <strong>AGENTS.md</strong>，例如“使用现有组件”“不要覆盖已有改动”。Codex 有发现和加载这类文件的机制；具体范围有规则，不是把电脑上所有同名文件都读进来。<Ref n={3} /></p>
        <p>Skill 则可以理解为某类任务的操作手册，例如处理文档时如何排版和检查。是否加载、加载多少，要看任务和工具机制。<strong>工作手册提供方法，工具负责执行动作。</strong><Ref n={10} /></p>
      </Section>

      <Section title="四、模型读完资料，输出什么？">
        <p>资料进入模型后，会被转换成它能处理的表示；文字通常按 token 计量。你可以把 token 想成阅读材料时用的小块，而不是一个 token 就一定对应一个汉字。详见 <Related slug="2026-05-23-what-is-token">Token 是什么</Related>。</p>
        <p>模型依据上下文生成输出。推理模型还可能使用内部推理 token；界面上的进度说明、可见推理摘要，都不能直接等同于完整内部思维记录。<Ref n={5} /></p>
        <p>对于我们的任务，输出可能有两种用途：</p>
        <Note title="说给你听"><p>“我先查看首页结构和文章元信息，再添加搜索。”</p></Note>
        <Note title="交给程序执行" color="#dde8ed"><p>动作：读取文件。对象：首页文件和文章元信息文件。调用编号：读取－01。</p></Note>
        <p>后一种叫 <strong>工具调用</strong>。它带上工具需要的参数，交给运行程序处理。具体格式可以是结构化参数，也可以是工具支持的文本；这里用“动作单”表达它的意思。<Ref n={1} /></p>
        <p>写一句“我已修改文件”和发出修改工具调用，是两件事。文件是否真的改变，需要实际执行和回执来确认。</p>
      </Section>

      <Section title="五、动作单怎样变成真实操作？">
        <div className="my-4 space-y-2 border-l-2 border-dashed border-stone-400 pl-4 sm:pl-6">
          <p><strong style={{ color: INK_SEPIA }}>模型：</strong>申请读取首页文件。</p>
          <p>↓</p>
          <p><strong style={{ color: INK_SEPIA }}>运行程序：</strong>调度读取工具，按配置处理权限边界。</p>
          <p>↓</p>
          <p><strong style={{ color: INK_SEPIA }}>工具：</strong>打开文件，返回代码或报错。</p>
          <p>↓</p>
          <p><strong style={{ color: INK_SEPIA }}>下一次模型请求：</strong>带着这份回执继续。</p>
        </div>
        <p>调用编号像快递单号：它把“读取－01”的结果，与之前那张动作单对应起来。工具成功可以返回内容，失败也可以返回“文件不存在”“权限不足”等信息。失败回执同样是下一步判断的材料。<Ref n={1} /></p>
        <p>权限有两层意思：<strong>沙箱</strong>规定工作环境能访问什么；<strong>审批策略</strong>规定哪些操作需要怎样的批准。它们是执行机制的一部分，不能只靠在提示词里写“请小心”替代。<Ref n={6} /></p>
        <p>等待命令结束、等待网络结果、等待批准，都可能表现为界面暂时没有新文字。这个时间不全是模型在推理。</p>
      </Section>

      <Section title="六、第二次请求，比第一次多了什么？">
        <p>第一轮不知道首页长什么样。读完文件后，下一轮就有了真实代码。</p>
        <Note title="资料袋的变化" color="#e5ecd8">
          <p><strong>第一次：</strong>工作规则 ＋ 工具说明 ＋ 环境信息 ＋ 用户需求 ＋ 可用的已有记录。</p>
          <p><strong>第二次：</strong>延续所需的前文 ＋ 刚才的读取动作 ＋ 文件内容回执。</p>
          <p><strong>第三次：</strong>继续延续任务信息 ＋ 修改动作 ＋ 修改执行结果。</p>
        </Note>
        <p>像每次重新开工前，顾问都会获得一份最新工作档案。新的回执告诉它：“这是首页的真实代码”“文件已经改了”“构建失败了”。</p>
        <p>在 API 层面，应用可以提交历史输入，也可以通过对话或上一响应的标识延续服务端保存的状态。<strong>逻辑上能用到前文，不等于网络上每次都把全部旧文字原样上传。</strong>具体采用哪种方式要看实现。<Ref n={4} /></p>
        <p>同理，每次请求也不必重新编一份工作规则。相对稳定的规则可以继续有效，过程记录则不断增加；当任务很长时，旧记录还可能被整理或压缩。</p>
      </Section>

      <Section title="七、跟着一个任务，走完五轮">
        <p>现在把资料袋、模型和工具连起来。下面是同一个搜索任务的简化演示；其中故意安排一次页面问题，让你看到“检查反馈”怎样改变下一步。</p>
        <RoundExplorer />
        <p><strong style={{ color: INK_RED }}>一个用户任务，可以跨越多次模型请求。</strong>每次模型输出又可能包含一个或多个工具调用；它们也可能并行执行。五轮不是固定程序，模型会根据获得的信息调整动作。<Ref n={1} /></p>
        <p>这个“判断 → 执行 → 观察结果 → 再判断”的循环，就是 Agent 能持续工作的核心机制。已有的 <Related slug="2026-05-28-ai-agent">AI Agent</Related> 和 <Related slug="2026-06-01-function-calling">Function Calling</Related> 两篇分别解释了角色与工具连接。</p>
      </Section>

      <Section title="八、资料袋越来越厚，会发生什么？">
        <p>模型一次能处理的上下文有上限。不断加入代码、命令日志、截图与对话，资料袋就会变厚。详见 <Related slug="2026-05-26-context-window">Context Window</Related>。</p>
        <Note title="把厚档案整理成一张交接单" color="#ebe1ed">
          <p>任务：添加搜索框。约束：保持手写风，适配手机。</p>
          <p>已做：修改首页，构建通过。</p>
          <p>未完成：检查清空输入是否恢复列表。</p>
          <p>需要细节：重新读取当前首页代码。</p>
        </Note>
        <p>这张交接单帮助理解 <strong>上下文压缩</strong>：用较短的表示延续关键状态。实际压缩结果不一定是可读的摘要，也可能包含不可直接阅读的状态项；这里不是展示真实压缩输出。<Ref n={7} /></p>
        <p>精简后的记录并不保证保留所有细节。涉及精确代码或关键约束时，重新读取文件、核对任务要求，仍然很有用。</p>
        <p>还有另一种机制叫 <strong>提示词缓存</strong>：符合条件的相同输入前缀，可以复用计算，降低部分重复处理的成本或延迟。它与压缩的作用不同——压缩缩短资料，缓存复用处理；缓存也不意味着保存了新的长期记忆。<Ref n={8} /> 详见 <Related slug="2026-05-24-prompt-caching">Prompt Caching</Related>。</p>
      </Section>

      <Section title="九、最后一句“完成了”，靠什么支撑？">
        <p>在正常交付的路径上，模型会根据已有结果生成最终回复，运行程序把它展示给你。本轮不再申请工具执行，循环就可以结束。任务也可能因为中断、错误、限制或等待用户信息而暂停；停止本身不能证明任务成功。<Ref n={1} /></p>
        <p>搜索框任务需要的证据，至少有三个层次：</p>
        <div className="space-y-3 my-4">
          {[
            ['文件确实改了', '修改回执和代码差异能说明改动落到了文件里。'],
            ['项目可以构建', '构建成功能排除本次构建检查捕捉到的错误。'],
            ['行为符合需求', '输入标题或摘要能筛选；清空后恢复；手机上布局合适。'],
          ].map(([title, text], i) => <div key={title} className="flex gap-3 border-b border-dashed border-stone-300 pb-3"><span className="text-2xl shrink-0" style={{ color: INK_RED, fontFamily: HAND }}>{i + 1}</span><div><p style={{ color: INK_SEPIA }}>{title}</p><p>{text}</p></div></div>)}
        </div>
        <p>构建通过，只覆盖它检查到的范围；“加了搜索”也不自动证明搜索结果正确。好的交付会说明做了哪些验证，以及还有哪些部分没检查。</p>
        <Note title="给任务一张验收小纸条" color="#e5ecd8">
          <p>在首页添加搜索框，按标题和摘要筛选。</p>
          <p>不区分英文大小写；空输入显示全部文章；没有匹配时给提示。</p>
          <p>沿用现有手写样式，手机上能正常使用；完成后说明实际检查了哪些行为。</p>
        </Note>
        <p>这张纸条同时帮助模型选择动作，也帮助你判断交付是否满足需求。任务执行过程中，你还可以补充要求，新的信息进入后续工作上下文。</p>
      </Section>

      <Section title="十、回到你按下发送的那一刻">
        <p>从一句任务到一个结果，中间是一轮轮接力：</p>
        <Note color="#f6e4cf"><p>装好资料袋 → 模型提出下一步 → 工具实际执行 → 回执补进资料袋 → 模型继续判断 → 核对结果并交付。</p></Note>
        <p>你在界面上看到的是一段连续工作；背后，需求、规则、事实与执行结果在不断汇合。理解这条链路，就能更容易分清：它现在知道什么、正在做什么，以及“完成”的依据是什么。</p>
      </Section>

      <Section title="参考来源">
        <p className="text-sm sm:text-base text-stone-500">均为 OpenAI 官方文档，访问日期：2026-10-10。产品细节以当前官方说明为准；API 文档用于解释通用机制，不代表 Codex 每个客户端的完整内部实现。</p>
        <ol className="list-decimal pl-5 space-y-3 text-sm sm:text-base" style={{ overflowWrap: 'anywhere' }}>
          {sources.map(([title, url, desc], i) => <li id={`codex-ref-${i + 1}`} key={url}><a href={url} target="_blank" rel="noreferrer" className="underline underline-offset-4" style={{ color: INK_SEPIA }}>{title}</a> — {desc}<span className="block text-stone-500">{url} · accessed 2026-10-10</span></li>)}
        </ol>
      </Section>
      <Changelog created={meta.date} entries={meta.changelog} />
    </Paper>
  );
}
