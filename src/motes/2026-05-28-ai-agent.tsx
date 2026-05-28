import {
  Paper,
  Section,
  Changelog,
  HAND,
  PEN,
  INK,
  INK_SEPIA,
  INK_RED,
  INK_GREEN,
  FluidRoughBox,
  RoughUnderline,
} from '../components/handwriting';
import type { MoteMeta } from '../lib/motes';

export const meta: MoteMeta = {
  title: 'AI Agent 是什么',
  date: '2026-05-28',
  tags: ['AI 入门', 'Agent', 'LLM'],
  summary:
    'Workflow 跟 Agent 的区别、 四件套架构、 七种构建模式、 三种 planning 范式、 主流框架、 生产环境的坑。',
};

function Term({
  en,
  ipa,
  ch,
}: {
  en: string;
  ipa?: string;
  ch?: string;
}) {
  return (
    <span className="whitespace-nowrap">
      <strong style={{ color: INK_SEPIA }}>{en}</strong>
      {ipa && (
        <span
          className="text-xs sm:text-sm text-stone-400"
          style={{ fontFamily: 'var(--font-hand-pen)' }}
        >
          {' '}
          {ipa}
        </span>
      )}
      {ch && (
        <span className="text-xs sm:text-sm text-stone-500"> ≈ {ch}</span>
      )}
    </span>
  );
}

/* —— 内联组件：组件方块 —— */
function ComponentBox({
  label,
  desc,
  color,
}: {
  label: string;
  desc: string;
  color: string;
}) {
  return (
    <div
      style={{
        background: color,
        border: `2.5px solid ${INK}`,
        borderRadius: 14,
        padding: '14px 18px',
        fontFamily: PEN,
        textAlign: 'center',
        minWidth: 0,
      }}
    >
      <div
        className="text-base sm:text-lg"
        style={{ color: INK_SEPIA, fontWeight: 700, marginBottom: 4 }}
      >
        {label}
      </div>
      <div className="text-xs sm:text-sm" style={{ color: INK, lineHeight: 1.4 }}>
        {desc}
      </div>
    </div>
  );
}

/* —— 内联组件：循环箭头说明 ReAct —— */
function ReactLoop() {
  return (
    <div
      className="my-3 sm:my-4 p-3 sm:p-4 rounded-sm"
      style={{
        backgroundColor: 'rgba(255,255,255,0.6)',
        fontFamily: PEN,
        color: INK,
      }}
    >
      <div
        className="text-base sm:text-lg leading-relaxed"
        style={{ whiteSpace: 'pre-line' }}
      >{`Thought  ─ 我现在要找什么？该不该调工具？
   ↓
Action   ─ 调 search("北京天气")
   ↓
Observation ─ 工具返回 "今天 24°C, 多云"
   ↓
Thought  ─ 有了 ， 还需要看明天吗？
   ↓
   ... 循环到 Thought 决定"完成"为止`}</div>
    </div>
  );
}

export default function Mote() {
  return (
    <Paper>
      <header className="mb-6 sm:mb-8">
        <h1
          className="text-3xl sm:text-5xl leading-tight"
          style={{ fontFamily: HAND, color: INK_SEPIA }}
        >
          AI Agent 是什么
        </h1>
        <div className="mt-1">
          <RoughUnderline width={220} seed={1} />
        </div>
        <p
          className="mt-2 sm:mt-3 text-lg sm:text-2xl"
          style={{ fontFamily: HAND, color: INK }}
        >
          —— 从"会说话"到"会按按钮"再到"会自己想"
        </p>
      </header>

      <div
        className="text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-2.5"
        style={{ fontFamily: PEN }}
      >
        <p>2026 的 AI 圈 ， 一半人在说"我们在做 Agent"。</p>
        <p>
          但你问"Agent 到底是什么" ， 十个人给十一个答案。 套壳 chatbot 叫 agent ， 多步
          prompt chain 也叫 agent ， 跑 cron 的 Python 脚本接 LLM 也叫 agent。
        </p>
        <p>
          这篇尝试把它<strong style={{ color: INK_RED }}>讲清楚</strong> ：定义、 架构、 模式、 框架、 坑。
          做 AI 产品的人 ， 半年内大概率会撞到这个词。
        </p>
      </div>

      {/* ───────────── 1 直觉 ───────────── */}
      <Section title="一、从 chatbot 到 agent" underlineWidth={260}>
        <p>
          先看一个真实场景：
          <strong style={{ color: INK_SEPIA }}>
            "帮我订下周五去上海的机票 ， 选下午 3 点以前到的 ， 经济舱预算 1500"。
          </strong>
        </p>

        <p className="pt-2">普通 chatbot 的反应：</p>
        <FluidRoughBox seed={11} color={INK_RED} height={70}>
          <div className="text-sm sm:text-base px-3" style={{ color: INK }}>
            "好的 ， 您可以打开携程或飞猪搜索北京到上海的航班…" ← 没用
          </div>
        </FluidRoughBox>

        <p className="pt-2">Agent 的反应：</p>
        <ol className="pl-5 list-decimal space-y-1 text-base sm:text-lg">
          <li>
            <strong>理解目标</strong>：起点（推测北京）、 终点（上海）、 时间（下周五）、 限制（下午 3 点前 / 经济舱 / ¥1500）
          </li>
          <li>
            <strong>拆步骤</strong>：先查航班列表 → 筛选条件 → 排序 → 让用户确认 → 调下单 API
          </li>
          <li>
            <strong>调工具</strong>：
            <code className="px-1 py-0.5 bg-stone-100 rounded text-sm">
              flight_search(from='北京', to='上海', date='2026-06-19')
            </code>
          </li>
          <li>
            <strong>看结果再决策</strong>：返回 12 个航班 → 过滤掉到达 ≥ 15:00 的 → 剩 5 个 → 按价格排序
          </li>
          <li>
            <strong>遇到障碍能转弯</strong>：所有候选都 ＞ ¥1500 → 主动告诉用户 "最便宜的 ¥1620 ， 是否考虑放宽预算"
          </li>
          <li>
            <strong>等用户确认</strong>再执行不可逆操作（下单）
          </li>
        </ol>

        <p
          className="mt-3 p-3 rounded-sm text-sm sm:text-base"
          style={{ backgroundColor: '#fef9c3', fontFamily: PEN }}
        >
          💡 区别不是"它能调工具" —— 真正的差别是
          <strong>"它在自己决定下一步是什么"</strong>。
        </p>
      </Section>

      {/* ───────────── 2 Anthropic 的关键定义 ───────────── */}
      <Section title="二、关键定义：Workflow vs Agent" underlineWidth={300}>
        <p>
          Anthropic 2024 年底的研究文章 <em>Building Effective Agents</em>{' '}
          <sup>[1]</sup> 把所有"用 LLM 干活"的系统统称
          <Term en="agentic systems" ch="智能体系统" /> ， 然后做了一个关键区分：
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 sm:mt-4">
          <FluidRoughBox seed={21} color={INK} height={170}>
            <div className="text-sm sm:text-base px-3" style={{ color: INK }}>
              <div
                style={{ fontFamily: HAND, fontSize: 22, color: INK_SEPIA, marginBottom: 6 }}
              >
                Workflow
              </div>
              LLM 和工具按
              <strong>预定义的代码路径</strong>编排。
              <br />
              步骤、 顺序、 出口都是<strong>写死</strong>的。
            </div>
          </FluidRoughBox>
          <FluidRoughBox seed={22} color={INK} height={170}>
            <div className="text-sm sm:text-base px-3" style={{ color: INK }}>
              <div
                style={{ fontFamily: HAND, fontSize: 22, color: INK_SEPIA, marginBottom: 6 }}
              >
                Agent
              </div>
              LLM <strong>动态指导</strong>自己的过程和工具使用 ，
              对"如何完成任务"<strong>保持控制权</strong>。
            </div>
          </FluidRoughBox>
        </div>

        <p className="pt-3">
          <strong style={{ color: INK_GREEN }}>承认 workflow 不丢人</strong>：
          大多数生产环境真正能跑、 真正稳定的 ， 都是 workflow。
        </p>
        <p>
          Agent 适合"步骤数无法预测、 路径靠模型自己摸"的开放任务。 简单任务用 workflow
          更稳、 更便宜、 更可控。
        </p>

        <p
          className="mt-3 p-3 rounded-sm text-sm sm:text-base"
          style={{ backgroundColor: '#fef9c3', fontFamily: PEN }}
        >
          💡 Anthropic 的建议（值得反复读）：
          <strong> 从最简单方案开始 ， 只在更简方法明显不够时才加复杂性。</strong>
        </p>
      </Section>

      {/* ───────────── 3 四件套架构 ───────────── */}
      <Section title="三、经典架构：四件套" underlineWidth={210}>
        <p>2026 主流 Agent 架构 ， 通常由这四块组成：</p>

        <div className="grid grid-cols-2 gap-3 mt-3 sm:mt-4">
          <ComponentBox
            label="LLM Core"
            desc="决策中心。 推理 / 规划 / 解读结果都在这里"
            color="#fef3c7"
          />
          <ComponentBox
            label="Tools"
            desc="手。 查 API / 跑 SQL / 读文件 / 发邮件"
            color="#dbeafe"
          />
          <ComponentBox
            label="Memory"
            desc="记忆。 短期（context） + 长期（向量库）"
            color="#fce7f3"
          />
          <ComponentBox
            label="Planning"
            desc="规划。 把大目标拆步骤 ， 出错能改"
            color="#d1fae5"
          />
        </div>

        <p className="pt-3">
          每个组件的质量都决定了 Agent 的上限：
        </p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>
            <strong>LLM Core</strong> 不够强 → 推理错 / 调错工具 / 编参数
          </li>
          <li>
            <strong>Tools</strong> 描述不清 / schema 不严 → 模型调用准确率低
          </li>
          <li>
            <strong>Memory</strong> 太短 → 多轮就忘 ； 太长 → 上下文爆 + 噪声
          </li>
          <li>
            <strong>Planning</strong> 不会修正 → 一步错步步错
          </li>
        </ul>
      </Section>

      {/* ───────────── 4 七种构建模式 ───────────── */}
      <Section title={'四、七种构建模式（从浅到深）'} underlineWidth={310}>
        <p>
          Anthropic 给出了一份非常实用的模式清单 <sup>[1]</sup>。 从最简单到最复杂排：
        </p>

        <ol className="pl-5 list-decimal space-y-3 text-base sm:text-lg mt-3">
          <li>
            <strong>Augmented LLM（增强型）</strong> ——
            基础构建块：LLM + 检索 + 工具 + 记忆。 单次调用 ， 没循环。
            <span style={{ color: INK_SEPIA }}> "ChatGPT 加联网" 就是这个。</span>
          </li>
          <li>
            <strong>Prompt Chaining（提示链）</strong> ——
            把任务拆几步 ， 每步处理上一步输出。 比如：先大纲 → 再扩写 → 再校对。
            适合<strong>能预先拆分</strong>的任务。
          </li>
          <li>
            <strong>Routing（路由）</strong> ——
            先分类 query ， 再分发给专门的下游处理。 比如客服：技术问题 → 走文档库 ，
            投诉 → 走人工坐席 ， 闲聊 → 走通用 LLM。
          </li>
          <li>
            <strong>Parallelization（并行）</strong> ——
            同时跑多个子任务再合并。 两种典型 ：
            <em>分段</em>（一份长文档拆成几段并行总结）和
            <em>投票</em>（同一个 query 跑多次 ， 取多数）。
          </li>
          <li>
            <strong>Orchestrator-Workers（协调-工作者）</strong> ——
            中央 LLM <strong>动态</strong>把任务拆给若干 worker LLM。 跟 prompt chaining 的区别
            ：步骤不是预定义的 ， 是 orchestrator <strong>当场决定</strong>的。
          </li>
          <li>
            <strong>Evaluator-Optimizer（评估-优化）</strong> ——
            一个 LLM 生成 ， 另一个 LLM 评估并反馈 ， 循环直到满足标准。
            写代码、 写文案都常用：先写一版 → 找问题 → 改 → 再评 → 通过为止。
          </li>
          <li>
            <strong>Autonomous Agent（自主 Agent）</strong> ——
            LLM 在<strong>环境反馈</strong>中循环使用工具 ， 自己判断什么时候停。
            最自由、 最不可预测、 也最容易翻车。 适合开放性问题（如代码 agent / 调研 agent）。
          </li>
        </ol>

        <p className="pt-3 text-sm sm:text-base text-stone-500">
          实战中很少需要 7 ， 大多数生产系统是 1~4 的组合。 把 7 当成"实验性"的另册。
        </p>
      </Section>

      {/* ───────────── 5 ReAct ───────────── */}
      <Section title="五、Planning 的三种范式" underlineWidth={250}>
        <p><strong>1. ReAct（Reason + Act）</strong></p>
        <p>
          Yao et al. 2023 提出 <sup>[2]</sup>。 也是最被广泛实现的范式。
          模型在每一步都交替输出 <strong>Thought（思考）</strong>、{' '}
          <strong>Action（行动）</strong> 和读到的{' '}
          <strong>Observation（观察）</strong>：
        </p>
        <ReactLoop />
        <p>
          关键洞见：
          <strong style={{ color: INK_SEPIA }}>
            让模型把"思考"显式写出来 ， 它就能基于自己的思考下决策。
          </strong>{' '}
          这跟 Chain of Thought 同源（详见 [CoT]）。
        </p>

        <p className="pt-3"><strong>2. Plan-and-Execute（先规划再执行）</strong></p>
        <p>
          ReAct 的一个变种：先一次性<strong>把整个计划写出来</strong> ，
          再按计划执行。 优点是 token 省（不用每步都重新规划）、 透明度高
          （用户能看到 plan）。 缺点是<strong>一步错可能整个 plan 报废</strong> ， 鲁棒性差。
        </p>

        <p className="pt-3"><strong>3. Hierarchical Planning（分层规划）</strong></p>
        <p>
          复杂任务用<strong>分层</strong>：顶层规划 = 抽象大步骤
          ， 每个大步骤再展开成具体小步骤。 像项目经理拆 epic → story → task。
          目前主要在 Manus、 OpenAI Operator、 Claude Computer Use 等"长任务" Agent 里见到。
        </p>

        <p
          className="mt-3 p-3 rounded-sm text-sm sm:text-base"
          style={{ backgroundColor: '#fef9c3', fontFamily: PEN }}
        >
          💡 实战推荐：默认用<strong>ReAct</strong> ， 对结构清晰的任务用
          <strong>Plan-and-Execute</strong> ， 巨型任务才用 hierarchical。
        </p>
      </Section>

      {/* ───────────── 6 Memory ───────────── */}
      <Section title={'六、Memory：让 Agent "记得" 上次说的'} underlineWidth={350}>
        <p>2026 行业共识 <sup>[3]</sup>：</p>
        <p>
          <strong style={{ color: INK_RED }}>
            Memory 是独立的架构组件 ， 不只是更长的 context window。
          </strong>
        </p>
        <p>典型分层：</p>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <Term en="Working memory" ch="工作记忆" /> ——
            就是当前 context（系统提示 + 历史对话 + 工具结果）。
            会话级别 ， 跨会话就丢
          </li>
          <li>
            <Term en="Episodic memory" ch="情景记忆" /> ——
            过去发生过的事件。 "上次他问我推荐了 Notion ， 他选了 Obsidian"。
            常存进向量库 ， 按相关度召回
          </li>
          <li>
            <Term en="Semantic memory" ch="语义记忆" /> ——
            提炼出的事实和偏好。 "用户是产品经理 / 喜欢极简风 / 不吃辣"
          </li>
          <li>
            <Term en="Procedural memory" ch="程序性记忆" /> ——
            学会的技能 / 工作流模板。 "用户每周一让我总结日历"
          </li>
        </ul>

        <p className="pt-3">主流框架：</p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>
            <strong>mem0</strong> —— 2026 用得最多的开源 memory 中间件 ， 自动 extract facts
          </li>
          <li>
            <strong>Letta</strong>（前 MemGPT） —— 把 memory 当作 OS 概念 ，
            包括 "main memory" / "archival" / "recall" 分级
          </li>
          <li>
            <strong>LangGraph state</strong> —— 用图状态机管理 memory ， checkpoint 持久化
          </li>
          <li>
            <strong>自己撸</strong> —— 真实需求小的话 ， 一个 vector DB + 几条提示模板就够
          </li>
        </ul>
      </Section>

      {/* ───────────── 7 框架现状 ───────────── */}
      <Section title="七、主流框架现状（2026）" underlineWidth={250}>
        <div className="mt-2 overflow-x-auto">
          <table
            className="text-sm sm:text-base w-full"
            style={{ fontFamily: PEN, borderCollapse: 'collapse' }}
          >
            <thead>
              <tr style={{ color: INK_SEPIA }}>
                <th className="text-left p-2 border-b-2 border-dashed border-stone-400">
                  框架
                </th>
                <th className="text-left p-2 border-b-2 border-dashed border-stone-400">
                  语言
                </th>
                <th className="text-left p-2 border-b-2 border-dashed border-stone-400">
                  特点
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border-b border-dashed border-stone-300">
                  <strong>LangGraph</strong>
                </td>
                <td className="p-2 border-b border-dashed border-stone-300">Python / TS</td>
                <td className="p-2 border-b border-dashed border-stone-300">
                  图状态机 ， 分支 / 重试 / 人工节点齐全 ， 大厂生产首选
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-dashed border-stone-300">
                  <strong>CrewAI</strong>
                </td>
                <td className="p-2 border-b border-dashed border-stone-300">Python</td>
                <td className="p-2 border-b border-dashed border-stone-300">
                  角色 / 任务 / crew 模型 ， 适合多 agent 协作 ， 上手快
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-dashed border-stone-300">
                  <strong>Mastra</strong>
                </td>
                <td className="p-2 border-b border-dashed border-stone-300">TypeScript</td>
                <td className="p-2 border-b border-dashed border-stone-300">
                  Next.js 时代的 TS 主力 ， workflow / human-in-loop 原语清晰
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-dashed border-stone-300">
                  <strong>OpenAI Agents SDK</strong>
                </td>
                <td className="p-2 border-b border-dashed border-stone-300">Python / JS</td>
                <td className="p-2 border-b border-dashed border-stone-300">
                  OpenAI 官方 ， 简单直接 ， 紧贴 GPT 系列功能
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-dashed border-stone-300">
                  <strong>Google ADK</strong>
                </td>
                <td className="p-2 border-b border-dashed border-stone-300">Python / Java</td>
                <td className="p-2 border-b border-dashed border-stone-300">
                  原生支持 A2A（agent-to-agent）协议 ， 跨框架调用
                </td>
              </tr>
              <tr>
                <td className="p-2 border-b border-dashed border-stone-300">
                  <strong>无框架</strong>
                </td>
                <td className="p-2 border-b border-dashed border-stone-300">—</td>
                <td className="p-2 border-b border-dashed border-stone-300">
                  Anthropic 反复说过 ： 简单 agent 直接调 SDK 就够 ， 不必上框架
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="pt-3 text-sm sm:text-base text-stone-500">
          数据来源 ：各家官方文档 + 2026 框架对比综述 <sup>[4]</sup>。
        </p>
        <p className="pt-2">
          <strong>选择建议</strong> ：
        </p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>原型 / 实验 → 直接 SDK 不用框架</li>
          <li>多 agent 协作 → CrewAI</li>
          <li>复杂状态机 / 严肃生产 → LangGraph</li>
          <li>TS 全栈 → Mastra</li>
          <li>OpenAI 一家亲 → Agents SDK</li>
        </ul>
      </Section>

      {/* ───────────── 8 什么时候不该用 ───────────── */}
      <Section title="八、什么时候不该用 Agent" underlineWidth={270}>
        <p>
          这是<strong style={{ color: INK_RED }}>最容易被忽略的一节</strong>。
          不是所有问题都该用 Agent ， 强行上反而踩坑。
        </p>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>简单任务</strong> —— 一次 LLM 调用能搞定 ， 别叠加 thinking + tool + memory 三层
          </li>
          <li>
            <strong>延迟敏感</strong> —— Agent 多轮 ， 首字延迟动辄 5~30 秒 ， 实时交互不适合
          </li>
          <li>
            <strong>成本敏感、 调用频繁</strong> —— 每次循环都吃 token ， 大流量场景算账要清楚
          </li>
          <li>
            <strong>需要绝对正确的结果</strong> —— Agent 的"自主性"换来的就是不确定性 ， 用 workflow 把路径写死更稳
          </li>
          <li>
            <strong>无监督的高风险动作</strong> —— 转账 / 发邮件 / 改数据库 ， 没有 human-in-loop 别让 agent 自决
          </li>
        </ul>

        <p
          className="mt-3 p-3 rounded-sm text-sm sm:text-base"
          style={{ backgroundColor: '#fef9c3', fontFamily: PEN }}
        >
          💡 一个判断标准 ：
          <strong>
            "我能写出一个明确的步骤清单吗？" 能 → workflow ， 不能 → 才考虑 agent。
          </strong>
        </p>
      </Section>

      {/* ───────────── 9 生产环境的坑 ───────────── */}
      <Section title="九、生产环境的坑" underlineWidth={210}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>不可逆操作</strong> —— 下单、 转账、 删数据 ， 一定要
            human-in-loop 确认。 Agent 跑飞了真会把数据搞乱
          </li>
          <li>
            <strong>错误传染</strong> —— 第一步推理错 ， 后面全部基于错的前提。 加
            "自检 / 反思"步骤、 重试上限、 检查点
          </li>
          <li>
            <strong>token 雪球</strong> —— 每一轮的 thought / observation 都进下一轮 context ，
            十几轮就几万 token。 该截断、 该 summarize 就做
          </li>
          <li>
            <strong>prompt injection 攻击</strong> —— Agent 读到的网页 / 邮件 /
            工具返回值 ， 都可能藏指令。 把"用户指令"和"工具返回"明确分隔
          </li>
          <li>
            <strong>评估难</strong> —— Agent 的成功不是单步对错 ， 是端到端任务完成度。
            写 task-level eval 比单轮难得多
          </li>
          <li>
            <strong>调试难</strong> —— 一次失败可能跑了 30 轮 ， 谁都不想看 30k token 的 trace。
            上 LangSmith / Langfuse 这类 trace 工具早晚要上
          </li>
        </ul>
      </Section>

      {/* ───────────── 10 术语 ───────────── */}
      <Section title="十、术语小辞典" underlineWidth={200} color={INK_SEPIA}>
        <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg pl-0 list-none">
          <li>
            <Term en="Agent" ipa="/ˈeɪdʒənt/" ch="智能体" />
          </li>
          <li>
            <Term en="Agentic system" ch="智能体系统 ， 涵盖 workflow 和 agent" />
          </li>
          <li>
            <Term en="Workflow" ch="预定义路径的多步系统" />
          </li>
          <li>
            <Term en="ReAct" ch="Reason + Act ， 思考-行动-观察循环" />
          </li>
          <li>
            <Term en="Plan-and-Execute" ch="先一次性规划再执行的范式" />
          </li>
          <li>
            <Term en="Tool use / Function calling" ch="工具调用" />
          </li>
          <li>
            <Term en="Working / Episodic / Semantic memory" ch="工作 / 情景 / 语义记忆" />
          </li>
          <li>
            <Term en="Human-in-the-loop (HITL)" ch="关键节点要用户确认" />
          </li>
          <li>
            <Term en="Trace" ipa="/treɪs/" ch="一次 Agent 执行的完整记录 ， 调试用" />
          </li>
        </ul>
      </Section>

      <section className="mt-10 sm:mt-12">
        <FluidRoughBox height={130} seed={91} color={INK_RED}>
          <div
            className="text-base sm:text-xl leading-relaxed text-center px-2"
            style={{ fontFamily: HAND }}
          >
            <p className="text-sm text-stone-500 mb-1">★ 一句话总结</p>
            <p>Agent = LLM + 工具 + 记忆 + 规划 + 循环。</p>
            <p>关键不在"会调工具" ， 而在"它自己决定下一步"。</p>
          </div>
        </FluidRoughBox>
      </section>

      <Section title="参考来源 References" underlineWidth={260} color={INK_SEPIA}>
        <ol
          className="space-y-2 sm:space-y-3 text-sm sm:text-base pl-5 list-decimal"
          style={{ fontFamily: PEN }}
        >
          <li>
            Anthropic. <em>Building Effective Agents</em>. 2024-12.{' '}
            <a
              href="https://www.anthropic.com/research/building-effective-agents"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: INK_SEPIA }}
            >
              anthropic.com/research/building-effective-agents
            </a>{' '}
            (accessed 2026-05-28)
          </li>
          <li>
            Yao et al. 2023. <em>ReAct: Synergizing Reasoning and Acting in Language Models</em>.
            ICLR.{' '}
            <a
              href="https://arxiv.org/abs/2210.03629"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: INK_SEPIA }}
            >
              arxiv.org/abs/2210.03629
            </a>
          </li>
          <li>
            mem0.{' '}
            <em>State of AI Agent Memory 2026: Benchmarks, Architectures & Production Gaps</em>.{' '}
            <a
              href="https://mem0.ai/blog/state-of-ai-agent-memory-2026"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: INK_SEPIA }}
            >
              mem0.ai/blog/state-of-ai-agent-memory-2026
            </a>{' '}
            (accessed 2026-05-28)
          </li>
          <li>
            Alice Labs. <em>AI Agent Frameworks 2026: Production-Tested Ranking</em>.{' '}
            <a
              href="https://alicelabs.ai/en/insights/best-ai-agent-frameworks-2026"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: INK_SEPIA }}
            >
              alicelabs.ai/en/insights/best-ai-agent-frameworks-2026
            </a>{' '}
            (accessed 2026-05-28)
          </li>
          <li>
            Salesforce. <em>8 Ways AI Agents Are Evolving in 2026</em>.{' '}
            <a
              href="https://www.salesforce.com/blog/ai-agent-trends-2026/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: INK_SEPIA }}
            >
              salesforce.com/blog/ai-agent-trends-2026/
            </a>{' '}
            (accessed 2026-05-28)
          </li>
        </ol>
      </Section>

      <Changelog created={meta.date} entries={meta.changelog} />
    </Paper>
  );
}
