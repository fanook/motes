/* eslint react-refresh/only-export-components: ["error", { "allowExportNames": ["meta"] }] -- The article registry reads this metadata export. */
import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Paper, Section, Changelog, HAND, PEN, INK, INK_SEPIA,
  INK_RED, INK_GREEN, RoughUnderline, RoughArrow,
} from '../components/handwriting';
import type { MoteMeta } from '../lib/motes';

export const meta: MoteMeta = {
  title: 'Harness 是什么',
  date: '2026-10-10',
  tags: ['Agent', 'Harness', 'AI 入门'],
  summary: '模型之外的工作系统：上下文、工具调度、Skill、任务状态、权限和错误恢复，如何一起支撑任务执行。',
};

const references = [
  ['Harness 与执行环境', 'https://developers.openai.com/api/docs/guides/agents/sandboxes', '区分围绕模型的控制系统和实际执行工作的环境。'],
  ['Agents API 架构', 'https://developers.openai.com/api/docs/guides/agents-api/architecture', '模型与工具循环、会话，以及执行环境的分工。'],
  ['工具调用', 'https://developers.openai.com/api/docs/guides/function-calling', '工具请求由程序执行，结果与调用对应后返回模型。'],
  ['Skills', 'https://learn.chatgpt.com/docs/build-skills', 'Skill 的组成，以及先看名称和描述、再按需读取指导的机制。'],
  ['权限与安全', 'https://learn.chatgpt.com/docs/agent-approvals-security', '沙箱与审批对实际动作的约束。'],
  ['错误与恢复', 'https://developers.openai.com/api/docs/guides/agents-api/errors', '检查失败状态、已保存工作，以及有边界地重试。'],
  ['上下文压缩', 'https://developers.openai.com/api/docs/guides/compaction', '用更少的 token 延续关键任务状态。'],
  ['Agent 运行方式', 'https://developers.openai.com/api/docs/guides/agents', '直接调用模型、自行组织循环和托管运行机制之间的选择。'],
];

function Ref({ n }: { n: number }) {
  return <sup className="ml-0.5 text-xs"><a href={`#harness-ref-${n}`} className="underline" aria-label={`参考来源 ${n}`}>[{n}]</a></sup>;
}

function Slip({ title, children, color = '#eee5d2' }: { title?: string; children: ReactNode; color?: string }) {
  return <div className="my-3 rounded-sm border border-dashed border-stone-400 px-3 py-3 sm:px-5 sm:py-4" style={{ backgroundColor: color, overflowWrap: 'anywhere' }}>
    {title && <p className="mb-2 text-lg sm:text-xl" style={{ fontFamily: HAND, color: INK_SEPIA }}>{title}</p>}
    <div className="space-y-2">{children}</div>
  </div>;
}

const desks = [
  { name: '资料台', subtitle: '上下文管理', color: '#e5ecd8', model: '我需要本周反馈、上一期格式，以及这次的交付要求。', harness: '根据规则组织当前请求里的材料；接入读取工具，把新获得的资料带回后续请求。', evidence: '需求：保存一页周报，先别发送。资料：已读取的本周反馈。', missing: '没有实际读到资料，模型只能凭现有信息回答；给出文件名并不等于提供了文件内容。' },
  { name: '工具台', subtitle: '动作调度', color: '#dde8ed', model: '请打开反馈文件；稍后把整理结果保存成文档。', harness: '解析工具名称和参数，交给对应执行程序，再把回执与原调用对应起来。', evidence: '读取调用－01 → 返回反馈内容。保存调用－02 → 返回文件路径。', missing: '模型写出“请保存文档”，文件也不会自己出现；必须有可执行的工具和连接。' },
  { name: '进度板', subtitle: '任务状态', color: '#f6e4cf', model: '已有资料，正在整理；文档保存后还要检查。', harness: '跟踪请求、工具执行和等待状态；提供事件或日志，让应用能展示进度。', evidence: '整理完成；保存处理中；尚未收到成功回执。', missing: '断开或等待时，如果没保存足够状态，就难以判断做到了哪一步、还能怎样继续。' },
  { name: '门禁台', subtitle: '权限与审批', color: '#ebe1ed', model: '申请读取资料和保存文件。', harness: '把操作交给配置的权限、沙箱或审批机制；返回允许、拒绝或等待结果。', evidence: '项目文件夹可以写入；本任务没有获得发送邮件的授权。', missing: '仅在提示词里写“不要乱动”，无法代替执行环境对文件和网络的实际约束。' },
  { name: '回执台', subtitle: '失败与恢复', color: '#f1ebd2', model: '保存请求没有明确结果，我需要先确认文件是否存在。', harness: '保留可用记录，回传错误，支持按实现继续或重试；有些故障还需要人处理。', evidence: '先查询保存结果，确认未成功后再决定是否重试。', missing: '把超时一律当作没执行，直接再做一遍，可能造成重复文件或重复发送。' },
];

function OfficeTour() {
  const [active, setActive] = useState(0);
  const desk = desks[active];
  return <div className="my-4">
    <p className="mb-3 text-sm sm:text-base text-stone-500">点击工作台，看看模型和配套程序各自负责什么。以下是教学分工示意。</p>
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2" role="group" aria-label="选择办公室工作台">
      {desks.map((d, i) => <button key={d.name} type="button" aria-pressed={active === i} onClick={() => setActive(i)} className="cursor-pointer border border-dashed rounded-sm px-2 py-3 text-left" style={{ backgroundColor: active === i ? d.color : 'rgba(255,255,255,0.3)', borderColor: active === i ? INK_SEPIA : '#a8a29e' }}><span className="block text-xl" style={{ fontFamily: HAND, color: INK_SEPIA }}>{d.name}</span><span className="block text-xs sm:text-sm text-stone-600">{d.subtitle}</span></button>)}
    </div>
    <div aria-live="polite">
      <Slip title={`${desk.name} · ${desk.subtitle}`} color={desk.color}>
        <p><strong>模型提出：</strong>“{desk.model}”</p>
        <p><strong>配套程序负责：</strong>{desk.harness}</p>
        <p><strong>工作记录示意：</strong>{desk.evidence}</p>
      </Slip>
      <p className="text-sm sm:text-base" style={{ color: INK_RED }}>如果缺少这部分：{desk.missing}</p>
    </div>
  </div>;
}

const incidents = [
  { name: '读取失败', badge: '资料还没到', report: '反馈文件未找到。', record: '读取失败；没有获得文件内容。', response: '把错误带回模型，让它检查路径、寻找可用文件，或请用户补充位置。', boundary: '不能把“读不到”变成“我已经看过了”，更不能补编客户反馈。' },
  { name: '工具还在运行', badge: '工作进行中', report: '文档导出已开始，尚未结束。', record: '记录正在执行的任务与标识，等待或查询完成结果。', response: '收到结果后继续检查；等待期间可以向用户说明进度。', boundary: '暂时没文字不等于模型卡住；正在执行也不等于已经保存成功。' },
  { name: '保存超时', badge: '结果不确定', report: '保存请求超时，没有收到明确成功或失败。', record: '保存动作已发出，但最终结果未知。', response: '先查询目标文件或服务端状态；确认结果后，再决定继续还是重试。', boundary: '超时可能发生在成功写入之后。查清再重试，可以避免重复动作。' },
  { name: '请求被拒绝', badge: '需要调整动作', report: '写入目标目录被权限机制拒绝。', record: '这次写入未获准执行。', response: '把拒绝原因带回模型，考虑已获授权的保存位置；如果任务确实需要更高权限，再按策略处理。', boundary: '权限拒绝不能靠反复改命令绕过；要根据边界和用户授权重新选择动作。' },
];

function IncidentDesk() {
  const [active, setActive] = useState(0);
  const incident = incidents[active];
  return <div className="my-4">
    <div className="flex flex-wrap gap-2" role="group" aria-label="选择任务中的意外情况">
      {incidents.map((item, i) => <button key={item.name} type="button" onClick={() => setActive(i)} aria-pressed={active === i} className="cursor-pointer px-3 py-2 border-b-2 border-dashed text-sm sm:text-base" style={{ color: active === i ? INK_RED : INK_SEPIA, borderColor: active === i ? INK_RED : '#a8a29e' }}>{item.name}</button>)}
    </div>
    <div aria-live="polite">
      <Slip title={`回执：${incident.badge}`} color="#f6e4cf"><p>{incident.report}</p></Slip>
      <Slip title="进度板怎样记录" color="#dde8ed"><p>{incident.record}</p></Slip>
      <Slip title="怎样继续工作" color="#e5ecd8"><p>{incident.response}</p></Slip>
      <p style={{ color: INK_RED }}>{incident.boundary}</p>
    </div>
    <p className="mt-3 text-sm sm:text-base text-stone-500">可恢复到哪一步，取决于具体系统保存了什么、工具支持怎样查询，以及执行环境是否仍可用。演示不保证任何产品自动处理所有故障。</p>
  </div>;
}

function Related({ slug, children }: { slug: string; children: ReactNode }) {
  return <Link to={`/m/${slug}`} className="underline decoration-dashed underline-offset-4" style={{ color: INK_SEPIA }}>{children}</Link>;
}

export default function Mote() {
  return <Paper>
    <header className="mb-6 sm:mb-8">
      <h1 className="text-3xl sm:text-5xl leading-tight" style={{ fontFamily: HAND, color: INK_SEPIA }}>Harness 是什么</h1>
      <div className="mt-1"><RoughUnderline width={240} seed={61} /></div>
      <p className="mt-2 sm:mt-3 text-lg sm:text-2xl" style={{ fontFamily: HAND, color: INK }}>—— 给大模型配一间能工作的办公室</p>
    </header>
    <div className="text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-2.5" style={{ fontFamily: PEN }}>
      <p>你让 AI 整理周报。它能读资料、套格式、保存文档，出错后还会接着处理。我们很容易把这些都归结为“大模型很聪明”。</p>
      <p>但还有另一组问题：谁把文件内容给它？谁执行保存动作？工具运行时，谁记着它还没结束？</p>
      <p>这些工作需要模型周围的配套程序。<strong style={{ color: INK_RED }}>Agent Harness，就是把模型调用、工具执行和任务状态组织起来的运行系统。</strong><Ref n={1} /></p>
      <p className="text-sm sm:text-base text-stone-500">“办公室”是帮助理解的类比。各产品对 Harness 的边界划分不同，本文用官方公开机制说明常见职责；工作台和周报过程均为教学示意，不代表某款产品的完整内部架构。</p>
    </div>

    <Section title="一、聪明的顾问，也需要工作条件">
      <p>想象请来一位顾问，让他把客户反馈写成周报。你只给了一句话，却没给资料、模板，也没告诉他结果保存在哪里。</p>
      <p>他可以提出建议，但要交出真实文档，还需要资料、可用设备，以及传递结果的流程。</p>
      <Slip title="今天的任务" color="#f6e4cf"><p>“把项目文件夹里的本周客户反馈，整理成一页周报。沿用上期格式，保留反馈来源，保存到项目文件夹，先别发送。”</p></Slip>
      <p>这句话同时包含内容要求、格式要求、保存位置和动作边界。一个工作系统需要把它们带入后续处理，而不是只在开头出现一次。</p>
      <p>在这里，可以把 Harness 理解为“运行框架”，也就是办公室的工作系统：顾问负责分析和提议，配套程序负责让这些提议进入执行流程。它本身是软件；有些判断还可以调用模型协助。<Ref n={1} /></p>
    </Section>

    <Section title="二、办公室里，有哪些工作台？">
      <p>先看它要组织的几类工作。五个工作台是按职责分的，不要求真实系统恰好有五个模块。</p>
      <OfficeTour />
      <p>技术文档有时把 Harness 称为 <strong>控制平面</strong>：管理调用、路由、状态和恢复的这一侧。实际读写文件、运行命令的地方，则是执行环境。<Ref n={1} /></p>
      <p>办公室的协调工作，与文档最终保存在哪台电脑上，是两个问题。执行环境可以是本机、远程容器，也可以通过外部服务工具提供能力；并非所有 Agent 都需要专属电脑或沙箱。<Ref n={2} /></p>
    </Section>

    <Section title="三、一次提议，怎样接上下一次？">
      <p>周报任务里，模型可能先提出：“读取本周反馈和上期周报。”</p>
      <div className="my-4 border-l-2 border-dashed border-stone-400 pl-4 sm:pl-6 space-y-2">
        <p><strong style={{ color: INK_SEPIA }}>准备资料：</strong>任务要求、可用工具、已有记录。</p>
        <RoughArrow direction="down" width={32} seed={61} />
        <p><strong style={{ color: INK_SEPIA }}>调用模型：</strong>根据这些材料提出读取动作。</p>
        <RoughArrow direction="down" width={32} seed={62} />
        <p><strong style={{ color: INK_SEPIA }}>执行工具：</strong>打开文件，返回内容或错误。</p>
        <RoughArrow direction="down" width={32} seed={63} />
        <p><strong style={{ color: INK_SEPIA }}>继续请求：</strong>把回执带回模型，让它决定下一步。</p>
        <p className="pt-1" style={{ color: INK_GREEN }}>↳ 需要更多资料或动作，就继续接力。</p>
      </div>
      <p><strong>模型决定“下一步想做什么”；运行程序负责“怎样把这一步接到现实里”。</strong>工具回执与调用对应，让后续请求能知道哪次读取、哪次保存得到什么结果。<Ref n={3} /></p>
      <p>有些工作方式由开发者自己编写这段循环，有些 SDK 提供运行器，也有托管服务管理它。Harness 并不专指某一家公司的产品。<Ref n={8} /></p>
      <p>上一篇 <Related slug="2026-10-10-codex-task-loop">Codex 如何做任务</Related> 展开了每轮请求的“资料袋”。这里换个角度，关注是谁组织资料、执行动作和延续状态。</p>
    </Section>

    <Section title="四、Skill、Tool 和门禁，分别放哪里？">
      <p>办公室有操作手册，也有设备，还有访问规则。这几样经常一起出现，但各自的作用不同。</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        {[
          ['Skill · 操作手册', '周报怎样分章节，如何归类反馈，引用来源要保留哪些信息。'],
          ['Tool · 执行设备', '读取文件、创建文档、检查文件内容，或调用外部服务。'],
          ['Sandbox · 工作范围', '这次执行能访问哪些文件、网络和系统资源。'],
          ['Harness · 工作系统', '组织这些能力与规则，让模型调用、动作执行和结果反馈接起来。'],
        ].map(([name, desc]) => <div key={name} className="rounded-sm border border-dashed border-stone-400 p-3 sm:p-4 bg-white/40"><p className="text-xl mb-2" style={{ color: INK_SEPIA, fontFamily: HAND }}>{name}</p><p>{desc}</p></div>)}
      </div>
      <Slip title="从手册到动作" color="#e5ecd8">
        <p>① 系统提供可用 Skill 的名称与简介，例如“整理客户反馈周报”。</p>
        <p>② 模型判断这个手册适合当前任务，读取具体指导。</p>
        <p>③ 按指导选择读取、整理、保存和检查所需的工具。</p>
        <p>④ 运行程序安排工具执行，拿回结果，继续工作。</p>
      </Slip>
      <p>在 Codex 的公开机制里，Skill 可以先提供名称和描述，被选用后再加载完整指导。这像先看书架目录，再打开需要的手册。Skill 还可以带脚本、参考资料和模板，并非只能是一段文字。<Ref n={4} /></p>
      <p>手册写了“保存周报”，不等于保存工具已执行；执行前还要服从权限与用户授权。沙箱和审批是实际的执行约束，不能用手册中的一句要求代替。<Ref n={5} /></p>
      <p>MCP 可以帮助连接外部工具或服务。它负责连接这一环，不能单独代替整个任务运行系统。详见 <Related slug="2026-06-03-mcp">MCP</Related>。<Ref n={2} /></p>
    </Section>

    <Section title="五、任务出意外，进度板怎么用？">
      <p>工作系统的价值，在顺利时不太显眼；出问题时，就需要分清到底哪里失败了。</p>
      <IncidentDesk />
      <p>错误处理要看回执和已保存的工作：输入错误要修输入，临时故障可能适合有限重试，执行结果不确定时先检查状态。恢复也可能需要用户或系统维护者介入。<Ref n={6} /></p>
      <p>“任务状态”还要与“模型此刻看到的内容”分开。进度板可以记录一份文件已保存；要让模型据此继续，还需要把相关状态或查询结果放到后续上下文里。</p>
      <Slip title="三个位置，别混成一处" color="#dde8ed">
        <p><strong>模型上下文：</strong>本次请求可用的资料。</p>
        <p><strong>运行状态：</strong>系统保存的调用、等待、完成或失败记录。</p>
        <p><strong>工作成果：</strong>文件夹里已经写入的周报。</p>
      </Slip>
      <p>长任务还可能压缩上下文，用更短的状态表示继续。压缩帮助控制模型要处理的材料规模；它并不自动恢复已经丢失的文件或断开的执行环境。详见 <Related slug="2026-05-26-context-window">Context Window</Related>。<Ref n={7} /></p>
    </Section>

    <Section title="六、它怎样帮助判断“做完了”？">
      <p>模型说“已保存”，只是一个输出。交付更需要对应的执行结果和检查依据。</p>
      <Slip title="给周报准备一张验收单" color="#e5ecd8">
        <p>资料是否覆盖本周反馈？每项结论能否找到来源？</p>
        <p>文档是否沿用上期格式？是否符合一页的要求？</p>
        <p>保存位置是否正确？能否重新打开？</p>
        <p>有没有遵守“先别发送”？</p>
      </Slip>
      <p>Harness 可以组织检查动作、收集回执和记录结果；检查内容仍需要任务定义、模型判断、工具或人的配合。例如“能重新打开”可由文件检查提供依据，“摘要有没有误解客户”还需要核对原文。</p>
      <p>一套完善的配套系统能改善执行和观察条件，却不能保证模型每次都正确。模型误读、工具错误、遗漏验收点，都可能影响结果。</p>
      <p>所以看一个 Agent，除了看它能生成什么，还要看：<strong style={{ color: INK_RED }}>动作是否真的执行，过程是否可追踪，结果是否有证据。</strong></p>
    </Section>

    <Section title="七、同一个模型，为什么体验不同？">
      <p>设想两个产品用同一个模型，都接到周报任务。以下是对比示意，并非产品测评。</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        <Slip title="工作条件 A" color="#f6e4cf"><p>只提供任务文字。没有反馈读取工具，也没有保存能力。</p><p>模型可以问你要资料，或者给你一份整理方法；难以直接交付实际文件。</p></Slip>
        <Slip title="工作条件 B" color="#e5ecd8"><p>提供相关资料、格式手册、读写工具，并记录执行结果。</p><p>模型可以依据真实材料工作，申请保存，再检查结果。</p></Slip>
      </div>
      <p>这个例子里，差异来自工作条件。真实产品的体验还受模型版本、请求设置、提示词、工具质量、网络和数据影响；不能把所有差异都算到 Harness 头上。</p>
      <p>对产品经理来说，排查任务失败可以沿着这条线问：</p>
      <ol className="list-decimal pl-5 space-y-2">
        <li><strong>资料：</strong>模型实际拿到了正确的信息吗？</li>
        <li><strong>动作：</strong>所需工具存在、可用，而且真的执行了吗？</li>
        <li><strong>状态：</strong>失败或中断时，记录足够继续吗？</li>
        <li><strong>验收：</strong>最后检查的内容，与用户需求一致吗？</li>
      </ol>
      <p>再决定该改模型、补资料、修工具，还是调整任务流程。直接调用模型、自行组织循环、使用托管运行机制，是不同的工程选择，不能只用“多写一点提示词”概括。<Ref n={8} /></p>
    </Section>

    <Section title="八、用一句话记住这间办公室">
      <Slip color="#f1ebd2"><p>模型根据资料提出行动；Harness 组织资料、调度执行、延续状态，把一连串行动接成可观察的工作过程。</p></Slip>
      <p>下次看到 AI 在读文件、等待工具、报告错误或继续任务，可以想起这间办公室：桌上的资料、工作的设备、进度板和门禁，正在一起发挥作用。</p>
    </Section>

    <Section title="参考来源">
      <p className="text-sm sm:text-base text-stone-500">以下均为 OpenAI 官方资料，访问日期 2026-10-10。具体能力以当前文档为准；API 与 SDK 的说明用于解释机制，不代表所有 Harness 都提供相同功能。</p>
      <ol className="list-decimal pl-5 space-y-3 text-sm sm:text-base" style={{ overflowWrap: 'anywhere' }}>
        {references.map(([title, url, desc], i) => <li id={`harness-ref-${i + 1}`} key={url}><a href={url} target="_blank" rel="noreferrer" className="underline underline-offset-4" style={{ color: INK_SEPIA }}>{title}</a> — {desc}<span className="block text-stone-500">{url} · accessed 2026-10-10</span></li>)}
      </ol>
    </Section>
    <Changelog created={meta.date} entries={meta.changelog} />
  </Paper>;
}
