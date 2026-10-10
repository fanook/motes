/* eslint react-refresh/only-export-components: ["error", { "allowExportNames": ["meta"] }] -- The article registry reads this metadata export. */
import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Paper, Section, Changelog, HAND, PEN, INK_SEPIA, INK_RED, RoughUnderline } from '../components/handwriting';
import type { MoteMeta } from '../lib/motes';

export const meta: MoteMeta = {
  title: 'Skill、Tool 与 MCP',
  date: '2026-10-10',
  tags: ['Skill', 'Tool', 'MCP', 'AI 入门'],
  summary: '用客户反馈周报串起操作手册、具体动作和连接协议：能力如何被发现、选择、执行，再把结果带回模型。',
};

const refs = [
  ['Skills', 'https://developers.openai.com/plugins/concepts/skills', 'Skill 的组成、按需读取，以及与 MCP 工具的分工。'],
  ['Build skills', 'https://developers.openai.com/plugins/build/skills', '指导步骤、输入输出、参考资料与脚本怎样组织。'],
  ['Define tools', 'https://developers.openai.com/plugins/plan/tools', '工具名称、说明、输入要求、权限和回执的设计。'],
  ['Function calling', 'https://developers.openai.com/api/docs/guides/function-calling', '模型提出调用、程序执行、结果回到模型的循环。'],
  ['MCP server', 'https://developers.openai.com/plugins/concepts/mcp-server', '连接协议、客户端发现工具、服务端处理请求，以及资源与提示模板。'],
  ['Docs MCP', 'https://developers.openai.com/learn/docs-mcp', '一个真实的只读服务：搜索与读取官方文档。'],
];

function Ref({ n }: { n: number }) {
  return <sup className="ml-0.5 text-xs"><a href={`#stm-ref-${n}`} className="underline" aria-label={`参考来源 ${n}`}>[{n}]</a></sup>;
}

function Note({ title, children, color = '#eee5d2' }: { title: string; children: ReactNode; color?: string }) {
  return <div className="my-3 border border-dashed border-stone-400 rounded-sm p-3 sm:p-4" style={{ backgroundColor: color, overflowWrap: 'anywhere' }}>
    <p className="mb-2 text-xl" style={{ fontFamily: HAND, color: INK_SEPIA }}>{title}</p>
    <div className="space-y-2">{children}</div>
  </div>;
}

function Related({ slug, children }: { slug: string; children: ReactNode }) {
  return <Link to={`/m/${slug}`} className="underline decoration-dashed underline-offset-4" style={{ color: INK_SEPIA }}>{children}</Link>;
}

const steps = [
  { name: '发现能力', who: '应用准备目录', sees: '用户任务；Skill 简介“按公司格式整理客户反馈”；当前可用工具的名称、说明与输入要求。', action: '应用从已连接的 MCP 服务发现工具，并按实现提供给模型。有些系统先给索引，选中后再加载完整定义。', evidence: '能力目录里有：搜索反馈、读取反馈、创建文档、读取文档。', tip: '目录只说明能做什么，还没有读到客户反馈。' },
  { name: '打开手册', who: '模型选择，应用加载', sees: '周报 Skill 正文：先查指定日期范围；按问题归类；保留来源；保存后重新读取检查。', action: '模型判断手册适用，再借助应用提供的读取机制获得指导和需要的模板。', evidence: '获得周报章节模板；理解“不猜测缺失反馈”的要求。', tip: 'Skill 内容加入当前上下文，供模型参考；加载手册不会自动执行其中的动作。' },
  { name: '请求资料', who: '模型提出调用', sees: '任务要求、已加载手册、搜索工具的定义，以及已有的相关上下文。', action: '模型提出：搜索客户反馈；日期范围＝本周；项目＝用户指定项目。', evidence: '产生一条带工具名和参数的调用请求。', tip: '此时发出的是请求。模型还不能声称已经读取资料。' },
  { name: '执行与回传', who: '客户端与服务端执行', sees: '执行前，模型尚未拿到搜索结果；执行后，结果作为工具回执进入后续上下文。', action: '客户端通过 MCP 发送调用；服务端检查输入和访问权限，查询反馈系统，返回记录与来源标识。', evidence: '教学回执：找到 12 条反馈，包含记录编号、日期、正文与来源链接。', tip: 'MCP 传递请求和结果；查询的业务逻辑由服务端及它连接的系统完成。' },
  { name: '整理与保存', who: '模型整理，工具保存', sees: '已取得的反馈、周报模板、交付要求，以及创建文档工具的定义。', action: '模型整理正文，提出创建文档调用。文档服务保存后返回文档编号与链接。', evidence: '教学回执：创建成功；文档编号＝周报－01。', tip: '读取和保存可以来自不同 MCP 服务。它们是两类操作，各有权限边界。' },
  { name: '检查与交付', who: '工具读取，模型核对', sees: '保存回执、重新读取的文档内容、原反馈与用户要求。', action: '模型检查章节和来源是否齐全，再给用户文档链接；遵守“先别发送”。', evidence: '有保存回执和读取依据；没有发出发送调用。', tip: '保存成功证明动作完成；内容是否准确，还要逐项核对资料与需求。' },
];

function TaskWalkthrough() {
  const [active, setActive] = useState(0);
  const step = steps[active];
  return <div className="my-4">
    <p className="mb-3 text-sm sm:text-base text-stone-500">按顺序点击，追踪一份周报怎样从任务变成真实文档。步骤与回执均为教学示意。</p>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="group" aria-label="周报任务步骤">
      {steps.map((s, i) => <button key={s.name} type="button" aria-pressed={active === i} onClick={() => setActive(i)} className="cursor-pointer border border-dashed p-3 text-left rounded-sm" style={{ backgroundColor: active === i ? '#dde8ed' : '#ffffff50', borderColor: active === i ? INK_SEPIA : '#a8a29e' }}><span className="text-sm text-stone-500">0{i + 1}</span><span className="block text-xl" style={{ fontFamily: HAND }}>{s.name}</span></button>)}
    </div>
    <div aria-live="polite">
      <p className="mt-4" style={{ color: INK_RED }}>{step.who}</p>
      <Note title="模型这时能看到什么" color="#e5ecd8"><p>{step.sees}</p></Note>
      <Note title="发生的动作" color="#dde8ed"><p>{step.action}</p></Note>
      <Note title="留下的依据" color="#f6e4cf"><p>{step.evidence}</p></Note>
      <p className="text-sm sm:text-base text-stone-600">{step.tip}</p>
    </div>
  </div>;
}

const missingParts = [
  ['少了 Skill', '仍可能做成，但流程更依赖临时提示和模型判断。', '工具能读写反馈，模型也能整理；公司特定的分类口径和引用格式，需要通过任务说明、模板或其他上下文补充。'],
  ['少了 Tool', '懂方法，缺少实际操作能力。', '手册写得再详细，也不能凭空打开反馈系统或保存云文档。可以整理用户已提供的文本，或请用户补充资料。'],
  ['没接 MCP', '看现有工具通过什么方式接入。', '如果已通过普通 API 或本地工具获得读写能力，任务仍可完成；如果所需能力只由一个未连接的 MCP 服务提供，就需要先接通它。'],
  ['没有访问权限', '连得上，仍可能读不到或写不了。', '接口存在与账号获准访问是两回事。应根据错误确认账号和资源权限，或选择已授权的资料与位置。'],
];

function MissingParts() {
  const [active, setActive] = useState(0);
  const item = missingParts[active];
  return <div className="my-4">
    <div className="flex flex-wrap gap-2" role="group" aria-label="选择缺失的工作条件">
      {missingParts.map(([name], i) => <button key={name} type="button" aria-pressed={active === i} onClick={() => setActive(i)} className="cursor-pointer border-b-2 border-dashed px-3 py-2" style={{ borderColor: active === i ? INK_RED : '#a8a29e', color: active === i ? INK_RED : INK_SEPIA }}>{name}</button>)}
    </div>
    <div aria-live="polite"><Note title={item[1]} color="#f6e4cf"><p>{item[2]}</p></Note></div>
  </div>;
}

export default function Mote() {
  return <Paper>
    <header className="mb-6 sm:mb-8">
      <h1 className="text-3xl sm:text-5xl leading-tight" style={{ fontFamily: HAND, color: INK_SEPIA }}>Skill、Tool 与 MCP</h1>
      <RoughUnderline width={240} seed={71} />
      <p className="mt-2 sm:mt-3 text-lg sm:text-2xl" style={{ fontFamily: HAND }}>—— AI 的能力是怎么接上的？</p>
    </header>
    <div className="text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-2.5" style={{ fontFamily: PEN }}>
      <p>你让 AI 整理客户反馈。它打开一份指导，查到系统里的记录，最后给你一份保存好的周报。界面里先后出现 Skill、Tool、MCP，看起来都在“给 AI 加能力”。</p>
      <p>可以先把它们放到三个位置：<strong style={{ color: INK_RED }}>Skill 是做事的手册，Tool 是可以执行的动作，MCP 是连接能力时遵守的共同约定。</strong></p>
      <p>三者配合起来，模型才有机会按合适的方法，借助真实系统，完成你交给它的工作。</p>
    </div>

    <Section title="一、先摆好手册、工具和连接线">
      <p>延续上一篇的“办公室”类比。你请一位顾问写周报：桌上有公司操作手册，设备能查询反馈和创建文档，设备与外部系统之间还有通信线路。</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        {[
          ['Skill · 方法', '“周报要按什么步骤做？”', '手册写着：按问题归类，保留来源，保存后检查。', '#e5ecd8'],
          ['Tool · 动作', '“现在具体能做什么？”', '搜索反馈、读取记录、创建文档、重新打开检查。', '#dde8ed'],
          ['MCP · 协议', '“怎样找到并调用外部能力？”', '双方按共同格式介绍能力、接收请求、返回结果。', '#f6e4cf'],
        ].map(([name, question, desc, color]) => <Note key={name} title={name} color={color}><p style={{ color: INK_SEPIA }}>{question}</p><p>{desc}</p></Note>)}
      </div>
      <p>类比里的连接线，强调的是互通规则。MCP 的全名是 Model Context Protocol；它是一套开放的连接规范。真正运行的客户端、服务端和业务系统，才负责传递与处理请求。<Ref n={5} /></p>
      <p>前两篇讲了 <Related slug="2026-10-10-codex-task-loop">Codex 如何做任务</Related> 和 <Related slug="2026-10-10-agent-harness">Harness 是什么</Related>。这里聚焦能力之间的分工，办公室里的调度和状态管理可以回到上一篇看。</p>
    </Section>

    <Section title="二、Skill：先翻目录，再读手册">
      <p>Skill 通常是一份可复用的工作指导及配套材料。它可以包含步骤、示例、模板、参考资料，也可以带脚本。核心指导放在名为 SKILL.md 的文件里。<Ref n={1} /><Ref n={2} /></p>
      <Note title="一份周报手册可能这样写" color="#e5ecd8">
        <p>适用场景：用户要求整理客户反馈周报。</p>
        <p>步骤：确认时间范围 → 查询反馈 → 按问题归类 → 保留来源 → 保存 → 重新读取检查。</p>
        <p>交付要求：沿用指定模板；没有资料的部分标明缺失；未获授权不要发送。</p>
      </Note>
      <p>在官方描述的加载方式里，模型先看到 Skill 的名称和简介，判断适用后再读取完整指导。这像先看书架目录，再翻开本次需要的手册；附带材料也可以按需要继续读取。<Ref n={1} /></p>
      <p>读取指导，会给模型本次工作增加可参考的内容。安装一个 Skill，并不等于重新训练模型，也不保证它每次都按要求完成。</p>
      <p>如果手册附带“生成图表”的脚本，脚本仍要借助执行工具运行。文字指导和实际执行，在这里依然是两件需要接起来的事。<Ref n={2} /></p>
    </Section>

    <Section title="三、Tool：给模型一张可填写的操作单">
      <p>一个工具可以理解为应用向模型开放的具体操作。模型通常需要知道它叫什么、什么时候使用，以及必须填写哪些参数。执行程序则需要知道怎样处理这些参数、返回什么结果。<Ref n={3} /></p>
      <Note title="搜索反馈工具 · 定义示意" color="#dde8ed">
        <p><strong>名称：</strong>搜索客户反馈。</p>
        <p><strong>用途：</strong>查找指定项目、指定时间范围内的反馈记录。</p>
        <p><strong>输入要求：</strong>项目编号、开始日期、结束日期。</p>
        <p><strong>结果：</strong>反馈记录、来源标识；无法读取时返回错误。</p>
      </Note>
      <p>这张单子帮助模型选对动作、填对信息。真正调用时，它会提出类似“搜索项目 A 本周反馈”的工具请求，再由程序执行。</p>
      <p>请求完成后，回执要与原调用对应起来，带回后续模型请求。模型才能根据真实结果继续整理。更完整的过程见 <Related slug="2026-06-01-function-calling">Function Calling</Related>。<Ref n={4} /></p>
      <p>工具不一定来自外部平台。本地文件读取、命令执行、自定义 API 操作，也可以作为工具提供。一个工具还可能在内部完成多个业务步骤；动作粒度由实现决定。</p>
    </Section>

    <Section title="四、MCP：让两边按同一套约定说话">
      <p>假设反馈系统与文档系统都想为 AI 提供能力。它们可以各自开放接口，再由每个应用编写适配；也可以实现 MCP，让支持这个协议的应用按共同方式发现和调用能力。<Ref n={5} /></p>
      <Note title="从模型到真实系统" color="#f6e4cf">
        <p>模型提出调用 → 应用里的 MCP 客户端 → MCP 服务端 → 反馈或文档系统。</p>
        <p>结果沿连接返回 → 应用把回执放入后续上下文 → 模型继续工作。</p>
      </Note>
      <p>MCP 是协议；MCP 服务端是实现协议、提供能力的程序；Tool 是其中某个可调用的动作。这几个名字对应不同层次。服务端还可以提供资源和提示模板，所以 MCP 的范围也不只有工具。<Ref n={5} /></p>
      <p>一个真实例子是 OpenAI 的 Docs MCP：它提供搜索和读取官方文档的只读能力。连接这个服务，可以取得相关文档；它本身不会替你调用 OpenAI API 或创建业务文档。<Ref n={6} /></p>
      <p>协议细节和连接方式已有一篇 <Related slug="2026-06-03-mcp">MCP</Related>，这里记住：统一连接方式，有助于复用能力；具体能做什么，仍由服务提供的功能和权限决定。</p>
    </Section>

    <Section title="五、追踪一份周报的完整来回">
      <Note title="这次交给 AI 的任务"><p>把反馈系统里的本周客户反馈，整理成一页周报。沿用公司模板，保留反馈来源，保存到文档系统，先别发送。</p></Note>
      <p>假设应用已经连接所需服务，也有获准访问的账号和周报 Skill。下面展示常见分工，不代表 Codex 的实际请求记录或固定内部实现。</p>
      <TaskWalkthrough />
      <p>这里的“模型能看到什么”，指当前可用上下文。真实系统可能通过会话续接、按需加载或摘要管理材料，每轮不必完整重发全部历史。关键是：需要使用的信息，要以模型可用的形式进入上下文。</p>
    </Section>

    <Section title="六、它们不是必须凑齐的三件套">
      <p>这三者常一起出现，但不存在“所有任务都必须先有 Skill，再通过 MCP 调 Tool”的固定顺序。点一下，看看缺少一项会怎样。</p>
      <MissingParts />
      <p>比如修改本地文章，可以用内置读写工具；格式要求也可以直接写在任务里。查询某个外部平台，则可能需要连接它提供的服务。</p>
      <p>Skill 也可以只指导写作方式，无须 MCP。已有工具同样可以直接使用，无须先加载 Skill。选哪种组合，要看任务所需的方法、操作和数据在哪里。<Ref n={1} /></p>
    </Section>

    <Section title="七、做产品时，该补哪一层？">
      <p>把“AI 没做好”拆成具体问题，会更容易找到要改的地方。</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        {[
          ['格式与流程总不一致', '先检查任务说明、模板和 Skill：步骤、分类口径、验收要求是否清楚？'],
          ['选错操作或填错参数', '先检查 Tool 定义：描述能否区分相似操作？输入要求是否明确？'],
          ['外部资料始终拿不到', '检查连接、账号权限、资源位置和服务回执。接入 MCP 本身不保证有数据可读。'],
          ['有回执，交付仍不对', '核对原始资料与成果，检查模型判断和验收流程。接口通了只是完成了其中一环。'],
        ].map(([title, text]) => <Note key={title} title={title}><p>{text}</p></Note>)}
      </div>
      <p>公司周报习惯适合放进可复用指导；搜索与创建文档需要真实操作能力；多个应用要复用外部能力时，可以考虑标准化连接。这样的分工有助于各自维护。<Ref n={2} /><Ref n={3} /></p>
      <Note title="记住三个问题" color="#e5ecd8"><p>Skill：按什么方法做？</p><p>Tool：具体做什么动作？</p><p>MCP：应用怎样与能力提供方互通？</p></Note>
      <p>模型根据现有信息选择行动，运行系统安排执行，再把结果带回来。手册、动作和连接各自到位，才能把一句任务逐步变成可检查的成果。</p>
    </Section>

    <Section title="参考来源">
      <p className="text-sm sm:text-base text-stone-500">以下均为 OpenAI 官方资料，访问日期 2026-10-10。文章用公开机制解释分工；产品的可用功能、加载方式和权限策略以当前文档与实际配置为准。</p>
      <ol className="list-decimal pl-5 space-y-3 text-sm sm:text-base" style={{ overflowWrap: 'anywhere' }}>
        {refs.map(([title, url, desc], i) => <li key={url} id={`stm-ref-${i + 1}`}><a href={url} target="_blank" rel="noreferrer" className="underline underline-offset-4" style={{ color: INK_SEPIA }}>{title}</a> — {desc}<span className="block text-stone-500">{url} · accessed 2026-10-10</span></li>)}
      </ol>
    </Section>
    <Changelog created={meta.date} entries={meta.changelog} />
  </Paper>;
}
