/* eslint react-refresh/only-export-components: ["error", { "allowExportNames": ["meta"] }] -- Article registry metadata. */
import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Paper, Section, Changelog, HAND, PEN, INK_SEPIA, INK_RED, RoughUnderline } from '../components/handwriting';
import type { MoteMeta } from '../lib/motes';

export const meta: MoteMeta = {
  title: '工具结果太大怎么办', date: '2026-10-12', tags: ['Agent', '工具', '上下文工程'],
  summary: '用仓库与办公桌解释过滤、分页、外部存储、检索、程序计算和摘要，比较它们如何减少输入，以及可能漏掉什么。',
};
const sources = [
  ['Writing effective tools for agents', 'https://www.anthropic.com/engineering/writing-tools-for-agents', '工具返回内容设计：过滤、范围选择、分页、截断与结果粒度。'],
  ['Effective context engineering for AI agents', 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents', '按需读取、外部引用、压缩、笔记与子任务隔离。'],
  ['Code execution with MCP', 'https://www.anthropic.com/engineering/code-execution-with-mcp', '在执行环境处理大数据，只把需要的结果返回模型。'],
  ['Pagination — Slack', 'https://docs.slack.dev/apis/web-api/pagination/', '游标分页、结束条件、少于请求条数不代表结束，以及游标有效期。'],
  ['File search — OpenAI', 'https://developers.openai.com/api/docs/guides/tools-file-search', '关键词与语义检索，以及限制返回结果数量。'],
  ['Compaction — OpenAI', 'https://developers.openai.com/api/docs/guides/compaction', '延续任务状态的上下文压缩；压缩项可以是不透明表示。'],
  ['Tool search — OpenAI', 'https://developers.openai.com/api/docs/guides/tools-tool-search', '按需加载工具定义，与处理工具返回的数据是不同问题。'],
];
function Ref({ n }: { n: number }) { return <sup className="ml-1 text-xs"><a href={`#large-result-ref-${n}`} aria-label={`参考来源 ${n}`} className="underline">[{n}]</a></sup>; }
function Note({ title, children, color = '#eee5d2' }: { title: string; children: ReactNode; color?: string }) {
  return <div className="my-4 border border-dashed border-stone-400 p-3 sm:p-4" style={{ backgroundColor: color }}><p className="mb-2 text-xl" style={{ fontFamily: HAND, color: INK_SEPIA }}>{title}</p><div className="space-y-2">{children}</div></div>;
}
function Related({ slug, children }: { slug: string; children: ReactNode }) { return <Link to={`/m/${slug}`} className="underline decoration-dashed" style={{ color: INK_SEPIA }}>{children}</Link>; }
const records = Array.from({ length: 12 }, (_, i) => ({
  id: `R${String(i + 1).padStart(2, '0')}`,
  status: i === 5 ? '失败' : i === 9 ? '超时' : '成功',
  text: i === 5 ? '支付失败：通道返回拒绝。' : i === 9 ? '等待支付回执超时，尚未确认是否扣款。' : '支付成功，已收到回执。',
}));
const modes = ['直接截断', '搜“失败”', '逐页检查', '程序汇总'];
function ResultLab() {
  const [mode, setMode] = useState(0);
  const [page, setPage] = useState(0);
  const [visited, setVisited] = useState<number[]>([0]);
  const shown = mode === 0 ? records.slice(0, 4) : mode === 1 ? records.filter(r => r.text.includes('失败')) : mode === 2 ? records.slice(page * 4, page * 4 + 4) : [];
  const covered = mode === 0 ? 4 : mode === 2 ? visited.length * 4 : 12;
  const found = mode === 0 ? [] : mode === 1 ? records.filter(r => r.text.includes('失败')) : mode === 2 ? records.filter((r, i) => visited.includes(Math.floor(i / 4)) && r.status !== '成功') : records.filter(r => r.status !== '成功');
  const verdict = mode === 0 ? '前 4 条均成功；后 8 条未查看，不能断言没有异常。' : mode === 1 ? '找到 R06；检索条件只匹配“失败”，遗漏了写作“超时”的 R10。' : mode === 2 ? visited.length === 3 ? '三页均已查看：发现 R06、R10 两条非成功记录。' : '当前只覆盖部分页面。已发现的异常可以记录，全部数量仍未确认。' : '程序遍历 12 条：成功 10、失败 1、超时 1。模型收到计数与两条证据，无需逐条阅读成功记录。';
  return <div className="my-4 border border-dashed border-stone-400 bg-[#dde8ed] p-3 sm:p-5">
    <p className="text-xl sm:text-2xl" style={{ fontFamily: HAND, color: INK_SEPIA }}>同一箱资料，换四种处理方法</p>
    <p className="mt-2 text-sm sm:text-base">任务：找出所有状态不是“成功”的记录。固定教学数据，共 12 条；不调用模型或真实工具。</p>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4" role="group" aria-label="处理结果的方法">{modes.map((name, i) => <button type="button" key={name} aria-pressed={mode === i} onClick={() => setMode(i)} className="border border-dashed p-2 cursor-pointer text-left" style={{ backgroundColor: mode === i ? '#e5ecd8' : '#ffffff66' }}>{name}</button>)}</div>
    {mode === 2 && <div className="mb-3"><p className="text-sm mb-2">每页 4 条；点开一页代表本演示完成了该页检查。已看页面会保留标记。</p><div className="flex flex-wrap gap-2" role="group" aria-label="记录页面">{[0, 1, 2].map(i => <button type="button" key={i} aria-pressed={page === i} onClick={() => { setPage(i); setVisited(v => v.includes(i) ? v : [...v, i]); }} className="border border-dashed px-3 py-2 cursor-pointer" style={{ backgroundColor: page === i ? '#eee5d2' : '#ffffff66' }}>第 {i + 1} 页{visited.includes(i) ? ' · 已看' : ''}</button>)}</div></div>}
    <div aria-live="polite">
      {mode === 3 ? <Note title="进入模型的统计回执" color="#e5ecd8"><p>处理范围：R01～R12，12 / 12 条。</p><p>统计条件：状态 ≠ 成功。</p><p>结果：2 条；来源定位：R06、R10。</p>{found.map(r => <p key={r.id}><strong>{r.id} · {r.status}</strong>：{r.text}</p>)}</Note> : <div className="space-y-2 my-3">{shown.map(r => <p key={r.id} className="border-b border-dashed border-stone-400 pb-2"><strong>{r.id} · {r.status}</strong>：{r.text}</p>)}</div>}
      <p className="my-3 text-sm sm:text-base">{mode === 1 ? '关键词程序搜索了 12 条；模型只收到 1 条命中。这不保证问题所需的资料都命中了。' : `处理覆盖：${covered} / 12 条${mode === 3 ? '（由程序遍历）' : '（本演示已展示的记录）'}。`}</p>
      <p><strong>已发现：</strong>{found.length ? found.map(r => r.id).join('、') : '暂无'}</p>
      <p className="mt-2" style={{ color: mode === 3 || (mode === 2 && visited.length === 3) ? INK_SEPIA : INK_RED }}>{verdict}</p>
    </div>
    <button type="button" className="mt-4 underline decoration-dashed cursor-pointer text-sm" onClick={() => { setMode(0); setPage(0); setVisited([0]); }}>重置演示</button>
  </div>;
}
const strategies = [
  ['源头过滤', '只查询指定日期、客户和字段。', '范围明确，原始数据很多。', '条件错了，关键资料进不来。'],
  ['程序计算', '扫描全量，返回计数、分组和异常定位。', '总数、金额、状态等规则明确。', '计算口径或输入范围可能错。'],
  ['分页 / 分块', '每次送一部分，记录已处理范围。', '确实需要逐项阅读或检查。', '漏页、重页、边界上下文丢失。'],
  ['外部存储 + 检索', '原件放仓库，按编号或内容取片段。', '大文档、日志、跨轮复查。', '搜索没命中，或原件已不可访问。'],
  ['摘要 / 分层归纳', '逐块提炼，再合成整体说明。', '大量文字的主题与趋势。', '细节、例外和少数意见被压掉。'],
  ['截断', '到上限就停止展示，标注未显示范围。', '限制意外输出，作为兜底。', '删掉的部分可能正好是关键证据。'],
];

export default function Mote() {
  return <Paper>
    <header className="mb-6 sm:mb-8"><h1 className="text-3xl sm:text-5xl" style={{ fontFamily: HAND, color: INK_SEPIA }}>工具结果太大怎么办</h1><RoughUnderline width={265} seed={131} /><p className="mt-3 text-lg sm:text-2xl" style={{ fontFamily: HAND }}>—— 给 AI 一张办公桌，再配一间资料仓库</p></header>
    <div className="text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-2.5" style={{ fontFamily: PEN, overflowWrap: 'anywhere' }}>
      <p>你让 AI 查一笔重复扣款。工具却送回来十万条订单、几万行日志，还有一串很长的附加字段。</p>
      <p>人遇到这种情况，会先查目录、筛日期、算总数，再翻关键几页。让 AI 处理大结果，也可以这样组织。</p>
      <Note title="先分清两件事"><p><strong>工具和程序可以处理很多数据；模型每次请求能接收的内容有上限。</strong>程序扫描了整张表，可以只向模型返回统计和证据。反过来，模型只读了第一页，就不能声称检查过整张表。</p><p className="text-sm sm:text-base text-stone-600">本文讲通用系统设计，不假定 Codex、Claude Code 或某个插件自动实现全部方案。数字、回执与交互均为教学示例；资料核对日期 2026-10-12。</p></Note>
    </div>
    <Section title="一、资料仓库，不必搬上办公桌">
      <p>把模型这一次能看到的材料想成办公桌：任务说明、此前记录、工具说明和新返回的资料，都要占地方。大结果既可能放不下，也可能让有用信息更难找。<Ref n={2} /></p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">{[['仓库', '文件、数据库、工具服务：保管原始资料。'], ['搬运与加工', '运行程序：查询、分块、计算，再组织回执。'], ['办公桌', '模型当前上下文：本轮真正送入的材料。']].map(([title, desc], i) => <Note key={title} title={title} color={['#eee5d2', '#dde8ed', '#e5ecd8'][i]}><p>{desc}</p></Note>)}</div>
      <p>模型可以提出“只查昨天的订单”或“打开这一段”。真正执行查询、保存资料、限制输出长度的是工具与配套程序。角色分工见 <Related slug="2026-10-10-agent-harness">Harness 是什么</Related>。</p>
      <p><strong>文件路径像仓库货架号。</strong>它告诉模型去哪取，并不让文件内容自动进入上下文。还需要可用的读取工具、访问权限和实际取回动作。<Ref n={2} /></p>
    </Section>
    <Section title="二、先看大小发生在哪一层">
      <p>“结果太大”可能卡在不同地方。下面是一种教学拆法，实际系统可能把几步合在一起：</p>
      <ol className="list-decimal pl-5 space-y-2"><li><strong>数据源：</strong>数据库或服务中有多少原始资料？能否直接筛选？</li><li><strong>工具执行：</strong>抓取、传输、内存和运行时间是否允许处理这些资料？</li><li><strong>工具回执：</strong>哪些字段、片段或统计会返回给模型？是否被截断？</li><li><strong>后续请求：</strong>连同历史记录一起送入后，还能否容纳并有效使用？</li></ol>
      <p>只把最后展示的文字缩短，未必减少前面的下载与内存开销。反过来，程序流式扫描文件、只保留计数，可以在不把整份文件放进模型请求的情况下完成统计。执行环境中先加工再返回，是公开介绍过的 Agent 设计方式。<Ref n={3} /></p>
      <Note title="三个经常混淆的“上限”" color="#f6e4cf"><p>页面每次显示多少条，工具允许返回多少内容，模型一次能接收多少 token，是不同上限。</p><p>行数、字节数与 token 数也不能直接互换：一行短日志和一行巨大的数据对象，体积完全不同。界面折叠一段文字，也不能证明发给模型的内容变少了。</p></Note>
    </Section>
    <Section title="三、六种办法，解决不同的问题">
      <p>工具设计可以支持过滤、分页、范围读取和返回长度控制。<Ref n={1} /> 以下是结合这些机制整理的选用建议；几种办法通常一起使用。</p>
      <div className="hidden sm:block"><table className="w-full table-fixed border-collapse my-4 text-base" aria-label="大工具结果处理方案"><thead><tr className="border-b-2 border-dashed border-stone-400 text-left">{['办法', '怎么做', '适合什么', '可能漏什么'].map(t => <th key={t} className="w-1/4 p-2">{t}</th>)}</tr></thead><tbody>{strategies.map((row, i) => <tr key={row[0]} className="border-b border-dashed border-stone-400 align-top" style={{ backgroundColor: i % 2 ? '#eee5d2' : '#dde8ed' }}>{row.map((cell, j) => j === 0 ? <th key={cell} scope="row" className="p-2 font-normal text-left">{cell}</th> : <td key={cell} className="p-2">{cell}</td>)}</tr>)}</tbody></table></div>
      <div className="sm:hidden">{strategies.map(([name, how, when, loss]) => <Note key={name} title={name} color="#dde8ed"><p><strong>做法：</strong>{how}</p><p><strong>适合：</strong>{when}</p><p><strong>留意：</strong>{loss}</p></Note>)}</div>
      <p>过滤发生得越靠近数据源，越有机会减少后续搬运；如果服务只支持全量下载，也可以在执行环境先加工，给模型的回执仍能保持精简。<Ref n={3} /></p>
      <p>截断是兜底，无法判断哪一段最重要。需要继续查时，应保留完整原件或重查入口；仅有“省略了很多内容”的提示，还不足以恢复被删部分。<Ref n={1} /></p>
    </Section>
    <Section title="四、试一试：异常藏在后面怎么办？">
      <p>假设任务要求找出所有非成功支付记录。这里特意把两条异常放在不同页，并让它们使用不同措辞。</p>
      <ResultLab />
      <p>这组数据很小，目的是展示覆盖差异。关键词搜索确实检查了全部文字，但它回答的是“哪些记录包含这个词”；状态筛选回答的是“哪些记录满足这个条件”。两道题的答案可能不同。</p>
      <p>对于“全部、总共、有无遗漏”这样的要求，先确定完整的数据范围和可检查条件，再用程序扫描、数据库查询或有记录的逐项检查。拿几条搜索命中当全量结论，容易把“没找到”写成“不存在”。</p>
    </Section>
    <Section title="五、保存原件，再给一张可追查的回执">
      <p>一份有用的大结果回执，可以像资料柜的借阅单。下面是建议的教学格式，不是统一 API 标准：</p>
      <Note title="资料借阅单 · 示例" color="#e5ecd8"><p><strong>这次查了什么：</strong>订单快照 A，10 月 11 日全天，支付状态非成功。</p><p><strong>完整性：</strong>扫描 10 万条；匹配 28 条；当前仅展示 5 条，尚有结果未展示。</p><p><strong>原件位置：</strong>受控结果文件或结果 ID；记录生成时间与有效期。</p><p><strong>继续读取：</strong>下一页游标，或按记录编号读取；详情返回原始字段。</p><p><strong>证据定位：</strong>每条保留订单 ID、来源与时间；异常记录关联原始日志范围。</p></Note>
      <p>程序应在保存成功后再返回位置；临时文件可能消失，访问权限也可能变化。若只能重新查询，就明确说明结果会随数据变化。跨多页统计时，尽量使用同一快照或明确的时间边界，避免边翻页边新增数据造成重算或漏算。</p>
      <p>分页像翻书，游标像书签。具体结束条件要按工具协议判断。Slack 的游标分页就明确提醒：这一页少于请求条数，也不能据此判断已结束；应检查下一页游标。游标还可能过期。<Ref n={4} /></p>
      <p>如果已经在回执层截断、原件未保存、数据源也不可重查，那么缺失内容无法靠“让模型再想想”找回来。需要重新取得资料，并在结论里说明缺口。</p>
    </Section>
    <Section title="六、检索、摘要、分工，各有什么边界？">
      <p><strong>检索：从仓库取相关几页。</strong>关键词适合已知编号与原话，语义检索能找表达相近的内容。OpenAI 的 File search 同时提供这两类搜索，也允许控制返回数量。<Ref n={5} /> 少取一些会节省上下文，但返回前几名不能证明剩余资料没有例外；需要完整清单时，还应补充全量检查。</p>
      <p>检索后的材料如何进入回答，见 <Related slug="2026-05-30-rag">RAG</Related>；怎样切块，见 <Related slug="2026-06-07-chunking">Chunking</Related>。对于日志，可保留命中前后的记录；对合同，可连同定义与例外条款读取，避免切断关系。</p>
      <p><strong>摘要：把一箱访谈整理成主题卡。</strong>适合回答“大家主要抱怨什么”。建议每块都保留主题、例外、原文定位和未确认事项，再汇总；不能靠摘要精确计算金额，也不宜把摘要当成逐条审阅证明。特别少见的投诉可能在层层归纳中消失。</p>
      <p><strong>子任务分工：几位调查员各看一箱。</strong>子 Agent 可以隔离各自的阅读上下文，交回发现与来源。<Ref n={2} /> 但这需要拆分范围、合并重复项、处理跨箱关联；主 Agent 看到了报告，也不等于亲自看过每份原件。每个调查员仍有自己的上下文上限。</p>
      <Note title="不是越短越好" color="#f6e4cf"><p>处理的目标，是留下足以支持下一步判断的资料。若只返回“有异常”，却删掉编号、状态和来源，模型反而没法继续核实。</p><p>检索命中、模型摘要、程序计数应标清各自性质；无法确认的内容，应继续查原件或保留不确定性。</p></Note>
    </Section>
    <Section title="七、这一次变短了，聊久了还是会堆满">
      <p>单次回执控制的是“这回搬多少”；历史管理控制的是“桌上积了多少”。不断分页却把每页都留在后续请求中，仍会越积越多。</p>
      <p>可以在完成一段工作后保留任务目标、已检查范围、证据位置、结论与待办，清理重复细节；需要复查时再读原件。这是上下文压缩与外部笔记的用途。<Ref n={2} /></p>
      <p>不同产品的压缩实现不同。例如 OpenAI 官方文档中的 compaction 可以返回供后续请求使用的不透明压缩项，并不一定是一段人能直接阅读的摘要。<Ref n={6} /> 不能把“压缩过”理解成原始记录已被无损记住。</p>
      <Note title="三件事不要混在一起" color="#dde8ed"><p><strong>工具定义太多：</strong>先发现需要哪个工具，再加载接口说明。OpenAI Tool search 处理的是这一侧。<Ref n={7} /></p><p><strong>工具结果太大：</strong>过滤、计算、分块、存储与检索，控制返回的数据。</p><p><strong>历史越来越长：</strong>清理旧结果、压缩状态、保存外部笔记，安排后续请求。</p></Note>
      <p>换更长上下文的模型，有时能省去拆分，但仍要考虑费用、耗时和信息查找效果；“容得下”与“检查完整”是两回事。相关背景见 <Related slug="2026-05-26-context-window">Context Window</Related>。</p>
    </Section>
    <Section title="八、实际做一遍：查十万条订单">
      <p>回到开头的重复扣款问题。下面是一条可设计的流程，具体取决于工具是否支持查询、存储和计算：</p>
      <ol className="list-decimal pl-5 space-y-3"><li><strong>先定范围：</strong>确认客户、日期、订单标识，以及“重复扣款”的判断口径。</li><li><strong>源头查询：</strong>取得相关支付记录，只选必要字段；大结果保存并返回覆盖信息。</li><li><strong>程序检查：</strong>按业务规则关联支付流水和订单，生成疑似重复项。失败或超时记录本身不能证明重复扣款。</li><li><strong>模型看证据：</strong>读取疑似项、关联日志和政策，解释差异；资料不足就继续查询。</li><li><strong>回原件核实：</strong>确认候选记录与交易标识，检查退款、重试或冲正是否已发生。</li><li><strong>交付可追查结论：</strong>说明检查范围、程序口径、证据位置与尚未确认项。查询结果不自动授权退款。</li></ol>
      <Note title="给 Agent 的教学指令" color="#e5ecd8"><p>“先确认资料规模和可查询条件。全量统计交给程序，原始结果保留可重读位置。每次只返回相关片段，注明过滤条件、覆盖范围和是否还有后续内容。结论需要证据定位；只有部分资料时，不写成全量结论。”</p></Note>
      <p>这段话可以引导模型选择动作，但无法凭空给工具增加分页、存储或检索能力。设计系统时，还应分别测试“输入受控”和“证据完整”：把关键异常放到末页、改变措辞、制造跨块关联，再看是否仍能找到和解释。</p>
    </Section>
    <Section title="参考来源"><p className="text-sm sm:text-base text-stone-500">官方原始资料，accessed 2026-10-12。文中的仓库类比、组合流程、借阅单与演示为教学设计，不代表所有产品的默认行为。</p><ol className="list-decimal pl-5 space-y-3 text-sm sm:text-base" style={{ overflowWrap: 'anywhere' }}>{sources.map(([name, url, description], i) => <li key={url} id={`large-result-ref-${i + 1}`}><a href={url} target="_blank" rel="noreferrer" className="underline" style={{ color: INK_SEPIA }}>{name}</a> — {description}<span className="block text-stone-500">{url} · accessed 2026-10-12</span></li>)}</ol></Section>
    <Changelog created={meta.date} entries={meta.changelog} />
  </Paper>;
}
