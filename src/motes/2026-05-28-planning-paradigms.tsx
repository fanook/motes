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
  RoughBarChart,
} from '../components/handwriting';
import type { MoteMeta } from '../lib/motes';

export const meta: MoteMeta = {
  title: 'Agent 的五种 Planning 范式',
  date: '2026-05-28',
  tags: ['AI 入门', 'Agent', 'LLM'],
  summary:
    'ReAct / Plan-and-Solve / Reflexion / Tree of Thoughts / LATS。 原论文细节 + benchmark 数字 + 怎么选。',
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

/* —— 一个原语：伪代码块 —— */
function CodeBlock({ children }: { children: string }) {
  return (
    <div
      className="my-3 p-3 sm:p-4 rounded-sm overflow-x-auto text-sm sm:text-base"
      style={{
        backgroundColor: 'rgba(255,255,255,0.6)',
        fontFamily: PEN,
        color: INK,
        whiteSpace: 'pre',
        lineHeight: 1.6,
      }}
    >
      {children}
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
          Agent 的五种 Planning 范式
        </h1>
        <div className="mt-1">
          <RoughUnderline width={260} seed={1} />
        </div>
        <p
          className="mt-2 sm:mt-3 text-lg sm:text-2xl"
          style={{ fontFamily: HAND, color: INK }}
        >
          —— ReAct / Plan-Execute / Reflexion / ToT / LATS
        </p>
      </header>

      <div
        className="text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-2.5"
        style={{ fontFamily: PEN }}
      >
        <p>
          所有 Agent 的本质都是<strong style={{ color: INK_RED }}>同一个问题</strong> ：
          "下一步该干嘛？" 怎么让 LLM 想清楚再动手 ， 怎么从错误里学 ，
          怎么不一条路走到黑 —— 这就是 planning 范式要解决的事。
        </p>
        <p>
          下面五种范式按出现顺序排 ， 每种都给：核心思想 + 工作流程 + 真实例子 + 原论文 benchmark 数字。
        </p>
      </div>

      {/* ───────────── 0 为什么要 planning ───────────── */}
      <Section title="〇、为什么单次 LLM 调用不够" underlineWidth={290}>
        <p>
          LLM 本身只会"预测下一个 token"。 一次 forward pass 内 ， 它做完所有推理。
          这对"今天天气"够 ， 对下面这些不够：
        </p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>多步推理（Game of 24：用四个数字凑 24）</li>
          <li>带外部工具（查 Wikipedia 后再答）</li>
          <li>长任务（订机票全流程 / 写代码并跑通）</li>
          <li>有不确定性（一条路不行要换一条）</li>
        </ul>
        <p className="pt-2">
          于是出现了 planning 范式：
          <strong>把"一次想完"拆成"多次小步思考 + 行动 + 反思"</strong>。
          下面是这条路线五个关键节点。
        </p>
      </Section>

      {/* ───────────── 1 ReAct ───────────── */}
      <Section title="一、ReAct：边想边查" underlineWidth={280}>
        <p>
          <em>ReAct: Synergizing Reasoning and Acting in Language Models</em>{' '}
          <sup>[1]</sup>。 ICLR 2023。 也是 Agent 时代的真正开端。
        </p>
        <p>
          <strong>核心洞见</strong>：让模型把"思考"和"行动"
          <strong style={{ color: INK_SEPIA }}>交错</strong>输出 ，
          每行动一步就观察结果 ， 再决定下一步。
        </p>

        <p className="pt-2"><strong>循环结构</strong>：</p>
        <CodeBlock>{`Thought 1: 用户问"小李子主演的电影里最高分是哪部" ， 我需要先查他演过哪些
Action 1: search("Leonardo DiCaprio filmography")
Observation 1: [返回片单]
Thought 2: 我需要逐一查各片的评分 ， 但太多。 先挑高知名度的几部
Action 2: search("Inception IMDb rating")
Observation 2: 8.8
Thought 3: 再查 The Revenant、 Titanic、 Once Upon a Time
... (继续)
Thought N: 已经够了 ， Titanic 7.9 ， Inception 8.8 ， The Revenant 8.0 ， Inception 最高
Action N: finish("Inception")`}</CodeBlock>

        <p className="pt-2">
          每个 Thought 是模型自言自语 ， Action 是真的去调工具 ， Observation
          是工具返回。 关键是 <strong>Thought 显式写在 prompt 里</strong> ， 不藏在模型内部。
        </p>

        <p className="pt-3"><strong>原论文 benchmark</strong>：</p>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>HotpotQA / FEVER</strong>（多跳问答 / 事实核查）—— 接 Wikipedia API，
            比纯 CoT 更少幻觉、 解释性更好
          </li>
          <li>
            <strong>ALFWorld</strong>（文本版家庭环境模拟）—— 比模仿学习 / 强化学习 baseline
            成功率<strong style={{ color: INK_GREEN }}> 绝对提升 34%</strong>
          </li>
          <li>
            <strong>WebShop</strong>（购物站任务）—— 成功率
            <strong style={{ color: INK_GREEN }}> 绝对提升 10%</strong>
          </li>
        </ul>

        <p className="pt-3">
          <strong>什么时候用</strong>：是 Agent 的<strong>默认</strong>范式。 任务路径不确定 ，
          需要边查边想。 LangGraph / LlamaIndex / OpenAI Agents SDK 默认都是 ReAct 风格的循环。
        </p>

        <p
          className="mt-3 p-3 rounded-sm text-sm sm:text-base"
          style={{ backgroundColor: '#fef9c3', fontFamily: PEN }}
        >
          💡 ReAct 把"agent"这个词带火了。 之后的所有范式都是它的扩展或修补。
        </p>
      </Section>

      {/* ───────────── 2 Plan-and-Solve ───────────── */}
      <Section title="二、Plan-and-Solve：先列大纲再执行" underlineWidth={360}>
        <p>
          <em>Plan-and-Solve Prompting</em><sup>[2]</sup> 把任务做<strong>"先规划再执行"</strong>的两段式。
        </p>

        <p className="pt-2"><strong>跟 ReAct 的区别</strong>：</p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>
            <strong>ReAct</strong>：每步都重新思考 ， 路径动态调整
          </li>
          <li>
            <strong>Plan-Execute</strong>：开局一次性把 plan 写出来 ， 然后照着执行
          </li>
        </ul>

        <CodeBlock>{`Plan:
  1. 找出小李子的所有电影
  2. 挑出 IMDb 评分前 5
  3. 取最高分对应的电影名
  4. 输出

Execute:
  step 1 → ... done
  step 2 → ... done
  step 3 → ... done
  step 4 → 输出 "Inception"`}</CodeBlock>

        <p className="pt-2"><strong>原论文效果（GPT-3.5 时代）</strong>：</p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>在 10 个推理基准上 ， 平均比 Zero-shot CoT <strong>显著</strong>更好</li>
          <li>跟 <strong>8-shot CoT</strong>（要给 8 个示例）<strong>持平甚至略胜</strong></li>
          <li>意义：不用给示例 ， 加一句"先 plan 再 solve"就够了</li>
        </ul>

        <p className="pt-3"><strong>优点 / 缺点</strong>：</p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>
            <span style={{ color: INK_GREEN }}>✓</span> token 省 ， 不用每步重新规划
          </li>
          <li>
            <span style={{ color: INK_GREEN }}>✓</span> 透明 ， 用户看得到 plan
          </li>
          <li>
            <span style={{ color: INK_RED }}>✗</span> 一步出错 plan 可能整个报废 ， 鲁棒性差
          </li>
          <li>
            <span style={{ color: INK_RED }}>✗</span> plan 阶段没看到真实环境信号 ， 容易"想当然"
          </li>
        </ul>

        <p className="pt-3">
          <strong>什么时候用</strong>：任务<strong>结构清晰</strong>、 步骤可以提前枚举的场景。
          LangGraph 里的 "plan-and-execute agent" 模板就是这个。
        </p>
      </Section>

      {/* ───────────── 3 Reflexion ───────────── */}
      <Section title="三、Reflexion：错了再来" underlineWidth={260}>
        <p>
          <em>Reflexion: Language Agents with Verbal Reinforcement Learning</em>{' '}
          <sup>[3]</sup>。 NeurIPS 2023。
        </p>
        <p>
          <strong>核心洞见</strong>：让 agent 失败后<strong style={{ color: INK_SEPIA }}>用自然语言"反思"</strong>这次哪里错了 ，
          反思文本写进 episodic memory ， 下次试时把反思读回来。
        </p>

        <p className="pt-2"><strong>循环结构</strong>：</p>
        <CodeBlock>{`Trial 1:
  Agent 尝试 → 失败
  Evaluator 给反馈："你忘了边界条件 ， 当输入为空时 crash 了"
  Self-Reflection (LLM 自己写)：
    "我应该在循环前先检查 input 是否为空"
  → 把这段反思存到 episodic memory

Trial 2:
  Agent 读上次的反思 → 重新尝试 → 成功`}</CodeBlock>

        <p className="pt-2">
          神奇点：<strong>反思是文字</strong> ， 不修改任何模型权重。 但效果近似强化学习。
        </p>

        <p className="pt-3"><strong>原论文 benchmark</strong>：</p>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>HumanEval</strong>（Python 编程）：
            <span style={{ color: INK_GREEN, fontWeight: 700 }}> 91% pass@1</span> ，
            超过原版 GPT-4 的 80%
          </li>
          <li>
            <strong>AlfWorld</strong>：从 ReAct 的 60% 提升到 <strong>~97%</strong>
          </li>
          <li>
            <strong>HotpotQA</strong>：相对纯 CoT / ReAct 也有显著提升
          </li>
        </ul>

        <div className="mt-4">
          <RoughBarChart
            items={[
              { label: 'GPT-4 (原版)', value: 80, fill: '#fecaca', suffix: '% pass@1' },
              { label: 'GPT-4 + Reflexion', value: 91, fill: '#bbf7d0', suffix: '% pass@1' },
            ]}
            barHeight={36}
            labelWidth={150}
          />
          <div className="text-xs sm:text-sm text-stone-500 mt-1 text-center">
            HumanEval pass@1 ， 数据来自原论文
          </div>
        </div>

        <p className="pt-3">
          <strong>什么时候用</strong>：可以<strong>多次尝试</strong>的任务 ， 有<strong>明确的成功/失败信号</strong>。
          代码、 单元测试、 编辑器自动修复、 棋类游戏都很合适。
        </p>

        <p
          className="mt-3 p-3 rounded-sm text-sm sm:text-base"
          style={{ backgroundColor: '#fef9c3', fontFamily: PEN }}
        >
          💡 Reflexion 不是给 agent 加"反思" prompt 那么简单。 关键是<strong>反思文本要被持久化</strong> ， 在 trial 间传递。
        </p>
      </Section>

      {/* ───────────── 4 Tree of Thoughts ───────────── */}
      <Section title="四、Tree of Thoughts：分叉再选优" underlineWidth={360}>
        <p>
          <em>Tree of Thoughts: Deliberate Problem Solving with Large Language Models</em>{' '}
          <sup>[4]</sup>。 NeurIPS 2023。 ReAct 同一作者的另一突破。
        </p>
        <p>
          <strong>核心洞见</strong>：CoT / ReAct 都是
          <strong style={{ color: INK_RED }}>一条线</strong>走到黑。 真正会推理的人会
          "想几种可能 → 评估 → 选最好的一条 → 走不通就回头"。 ToT 就把这个搬进 LLM。
        </p>

        <p className="pt-2"><strong>工作机制</strong>：</p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>每一步生成<strong>多个候选 thought</strong>（不是一个）</li>
          <li>用 LLM 自己评估每个候选 ， 打分（"这个 thought 离目标多近"）</li>
          <li>用 BFS / DFS 等搜索算法在 thought 树上找路径</li>
          <li>能<strong>回溯</strong>：发现某条路走不通 ， 回到上一个分叉点换一条</li>
        </ul>

        <p className="pt-3"><strong>原论文最强例子：Game of 24</strong></p>
        <p>规则：用四个数字 + 加减乘除 ， 算出 24。 例：3, 5, 7, 11 → (11-7)×(3+(5-?))... 之类。</p>

        <div className="mt-4">
          <RoughBarChart
            items={[
              { label: 'GPT-4 + CoT', value: 4, fill: '#fecaca', suffix: '%' },
              { label: 'GPT-4 + ToT', value: 74, fill: '#bbf7d0', suffix: '%' },
            ]}
            barHeight={36}
            labelWidth={150}
          />
          <div className="text-xs sm:text-sm text-stone-500 mt-1 text-center">
            Game of 24 成功率 ， 数据来自原论文
          </div>
        </div>

        <p className="pt-3">
          <strong>从 4% 飙到 74%</strong>。 同样的模型 ， 只是加了树搜索 + 回溯。
        </p>

        <p className="pt-3"><strong>代价</strong>：</p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>token 暴涨：树有 N 个节点就要 N 次评估</li>
          <li>实现复杂：需要写 BFS/DFS + 评估器</li>
          <li>很多任务的 thought 空间不好定义（不像 24 那么离散）</li>
        </ul>

        <p className="pt-3">
          <strong>什么时候用</strong>：解空间<strong>可枚举</strong>、 中间状态可评估的任务。
          数学题、 谜题、 创意写作（探索不同结尾）适合 ， 开放对话不适合。
        </p>
      </Section>

      {/* ───────────── 5 LATS ───────────── */}
      <Section title="五、LATS：搜索树 + 反思 + 蒙特卡洛" underlineWidth={420}>
        <p>
          <em>Language Agent Tree Search Unifies Reasoning, Acting, and Planning</em>{' '}
          <sup>[5]</sup>。 ICML 2024。
        </p>
        <p>
          <strong>核心洞见</strong>：把<strong style={{ color: INK_SEPIA }}>
            ReAct + Reflexion + Tree of Thoughts
          </strong>糅成一个框架 ， 上面套<Term en="MCTS" ch="Monte Carlo Tree Search" />。
        </p>

        <p className="pt-2"><strong>工作机制</strong>（简化）：</p>
        <CodeBlock>{`选择 (Select)   ─ 在当前已展开的树里 ， 找最有希望的叶子
扩展 (Expand)   ─ 从该叶子用 ReAct 思考、 调工具 ， 生成多个子节点
评估 (Evaluate) ─ 用 LLM 自己当 value function 给每个子节点打分
回传 (Backup)   ─ 把分数回传更新祖先节点
反思 (Reflect)  ─ 失败时用 Reflexion 写反思 ， 加进 prompt 下次用`}</CodeBlock>

        <p className="pt-2"><strong>原论文 benchmark</strong>：</p>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>HumanEval</strong>（编程）：
            <span style={{ color: INK_GREEN, fontWeight: 700 }}> 92.7% pass@1</span> (GPT-4)
            —— SOTA
          </li>
          <li>
            <strong>WebShop</strong>：平均分 <strong>75.9</strong>
            —— 不需要梯度训练 ， 接近 fine-tuning 水平
          </li>
          <li>显著超过 ReAct / CoT / Reflexion / RAP 等 baseline</li>
        </ul>

        <p className="pt-3"><strong>代价</strong>：</p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>token 消耗是 ReAct 的几倍到几十倍 ， 看树的深度宽度</li>
          <li>实现复杂 ， 一般框架不开箱支持</li>
        </ul>

        <p className="pt-3">
          <strong>什么时候用</strong>：极端难、 极端重要的任务 ， 能接受高成本。 否则用 ReAct + Reflexion 已经够。
        </p>
      </Section>

      {/* ───────────── 6 怎么选 ───────────── */}
      <Section title="六、怎么选" underlineWidth={140}>
        <p>实战决策树（不严格 ， 当起点）：</p>

        <ol className="pl-5 list-decimal space-y-3 text-base sm:text-lg mt-3">
          <li>
            <strong>路径不确定 / 需要边查边想 / 多轮工具调用</strong>
            <br />
            → 默认 <strong style={{ color: INK_GREEN }}>ReAct</strong>。 LangGraph / OpenAI Agents SDK 自带
          </li>
          <li>
            <strong>步骤可以预先枚举清楚 ， 偶尔失败也能接受</strong>
            <br />
            → <strong style={{ color: INK_GREEN }}>Plan-and-Execute</strong>。 透明度高、 token 省
          </li>
          <li>
            <strong>有明确成功/失败信号（如代码 pass tests），可以多次重试</strong>
            <br />
            → ReAct + <strong style={{ color: INK_GREEN }}>Reflexion</strong>。 多 1~2 轮试错 ， 准确率显著上去
          </li>
          <li>
            <strong>解空间可枚举的硬题（数学、 棋类、 谜题）</strong>
            <br />
            → <strong style={{ color: INK_GREEN }}>Tree of Thoughts</strong>。 接受 token 涨
          </li>
          <li>
            <strong>极致性能、 长任务、 不计成本</strong>
            <br />
            → <strong style={{ color: INK_GREEN }}>LATS</strong>。 自己实现或读论文 reference 代码
          </li>
        </ol>

        <p
          className="mt-3 p-3 rounded-sm text-sm sm:text-base"
          style={{ backgroundColor: '#fef9c3', fontFamily: PEN }}
        >
          💡 大多数生产 agent 是 <strong>ReAct + 工具 + 简单 retry</strong> 的组合。
          Reflexion / ToT / LATS 是"性能不够再叠"的优化层 ， 不是默认起点。
        </p>
      </Section>

      {/* ───────────── 7 生产实战 ───────────── */}
      <Section title="七、把 paper 范式落到产品" underlineWidth={310}>
        <p>论文实现跟产品实现差很多。 这一节是工程要点：</p>

        <p className="pt-2"><strong>1. Thought 怎么不爆 token</strong></p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>每隔 N 轮就 summarize 一下 thought-action 历史 ， 不让 context 无限增长</li>
          <li>把工具的长结果（如整个网页）摘要后再放回 context</li>
          <li>用 prompt caching：把 system / 工具描述放前面缓存住 ， 省 token + 提速</li>
        </ul>

        <p className="pt-3"><strong>2. 怎么知道该停了</strong></p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>显式定义一个 <code className="px-1 bg-stone-100 rounded text-sm">finish(answer)</code> 工具 ， 模型调它就停</li>
          <li>设硬上限：最多 N 轮 ， 强制 finish</li>
          <li>同样的 action 重复 K 次 → 多半是死循环 ， 拦截</li>
        </ul>

        <p className="pt-3"><strong>3. Reflexion 落地的关键</strong></p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>反思必须是<strong>自然语言</strong>， 不是数字。 数字反馈训不出来这种效果</li>
          <li>反思文本要<strong>持久化</strong>到 episodic memory（向量库 / 文件）</li>
          <li>下次试时 ， 把反思放进 system prompt 顶部</li>
        </ul>

        <p className="pt-3"><strong>4. ToT/LATS 落地几乎都要剪枝</strong></p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>纯实现 token 会炸 ， 实战必须设宽度 / 深度上限</li>
          <li>评估器（value function）要稳 ， 不然剪到错的方向</li>
          <li>常见做法：先用 ReAct 跑 N 次（采样不同种子）再 ensemble ， 比 ToT 简单</li>
        </ul>
      </Section>

      {/* ───────────── 8 评估 ───────────── */}
      <Section title="八、Planning 怎么评估" underlineWidth={230}>
        <p>
          单步 LLM 的评估比较直接。 Agent / Planning 的评估难得多 ， 至少看四个层次：
        </p>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>任务成功率</strong>（task success rate） —— 最终交付是否符合预期
          </li>
          <li>
            <strong>步骤数 / token 消耗</strong> —— 同样的题 ， 用了多少步、 花了多少钱
          </li>
          <li>
            <strong>路径合理性</strong> —— 中间每一步是否朝目标推进 ， 还是绕远路
          </li>
          <li>
            <strong>失败模式分布</strong> —— 工具调错 / 数据用错 / 推理错 / 死循环 / 提前放弃
            分别占多少
          </li>
        </ul>
        <p className="pt-2">
          工具：<Term en="LangSmith" />、 <Term en="Langfuse" />、 <Term en="OpenAI Evals" />、{' '}
          <Term en="Anthropic SDK" /> 自带的 prompt eval。
          人工 review + LLM-as-judge 是常见两板斧。
        </p>
      </Section>

      {/* ───────────── 9 2026 视角 ───────────── */}
      <Section title="九、为什么文章里数字都是 GPT-4 时代的" underlineWidth={520}>
        <p>
          细心读者会发现 ， 上面引的数字都是 <strong>GPT-4 / GPT-3.5</strong> ， 没有 Claude Opus 4.6
          、 没有 DeepSeek R1。 不是偷懒 ， 是<strong>原论文当年用的就是 GPT-4</strong>
          —— 2023~2024 paper 跑实验时它是最强的可用基座。
        </p>
        <p>
          那 2026 的新模型上有没有同样系统的 paradigm 对比？
          <strong>几乎没有</strong>。 学术界视线已经移走 ， 主线变成了
          <strong>推理模型</strong>（o3 / Claude Opus 4.6 thinking / DeepSeek R1）：
          把"思考-反思-搜索"直接训进模型 ， 不靠外面套 prompt 范式。
        </p>
        <p>
          直观对比一下 ：同一个 HumanEval ， 当年 GPT-4 裸跑 80% ， 套上 LATS 搜索树拼到 92% ；
          现在的推理模型 base 上直接 95%+ <sup>[7]</sup>。
        </p>

        <div className="mt-4">
          <RoughBarChart
            items={[
              { label: 'GPT-4 base (2023)', value: 80, fill: '#fecaca', suffix: '%' },
              { label: 'LATS + GPT-4 (2024)', value: 92, fill: '#fed7aa', suffix: '%' },
              { label: 'Claude Opus 4.6 (2026)', value: 95, fill: '#bbf7d0', suffix: '%' },
              { label: 'DeepSeek R1 (2026)', value: 96, fill: '#bbf7d0', suffix: '%' },
            ]}
            barHeight={32}
            labelWidth={170}
          />
          <div className="text-xs sm:text-sm text-stone-500 mt-1 text-center">
            HumanEval pass@1 大致水平。 2026 数据来自第三方榜单 <sup>[7]</sup>，
            数字逐月在变 ， 实际以官方为准
          </div>
        </div>

        <p className="pt-3"><strong>那这些 prompt 范式过时了吗？ —— 没有 ， 但定位变了。</strong></p>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>基础任务 ， 边际收益变小</strong>。 单步 reasoning 题用 o3 直接跑就行 ，
            不必再外面套 ReAct / Reflexion / ToT
          </li>
          <li>
            <strong>但 Agent 框架的骨架仍是 ReAct</strong>。 多轮工具调用、 跨调用编排
            ， 推理模型内部"想得再深"也替代不了工程层的循环
          </li>
          <li>
            <strong>非推理模型用例还在</strong>。 Haiku / Sonnet 非 thinking 模式 / GPT-4o-mini
            ， 这些便宜模型加 prompt 范式仍然能拿大幅提升
          </li>
          <li>
            <strong>极长任务、 状态多分支</strong>。 推理模型也撑不起 50 轮工具调用 ，
            外部 planning 框架（LangGraph 状态机 / Reflexion 持久化）仍然必需
          </li>
          <li>
            <strong>token 经济</strong>。 推理模型贵 ， 一个 thinking 调用动辄几千 token。
            能用 ReAct + 普通模型解决的 ， 没必要上 reasoning model
          </li>
        </ul>

        <p
          className="mt-3 p-3 rounded-sm text-sm sm:text-base"
          style={{ backgroundColor: '#fef9c3', fontFamily: PEN }}
        >
          💡 一句话总结时代变化 ：
          <strong>
            "想清楚再答" 现在很多在模型内部完成了 ， "想清楚怎么组合多次调用" 仍然是工程问题。
          </strong>
        </p>
      </Section>

      {/* ───────────── 10 术语 ───────────── */}
      <Section title="十、术语小辞典" underlineWidth={200} color={INK_SEPIA}>
        <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg pl-0 list-none">
          <li>
            <Term en="Planning" ch="规划 ， Agent 决定下一步的能力" />
          </li>
          <li>
            <Term en="ReAct" ch="Reason + Act ， 思考-行动-观察交错循环" />
          </li>
          <li>
            <Term en="Plan-and-Execute" ch="先一次性写计划再执行" />
          </li>
          <li>
            <Term en="Reflexion" ch="失败后用自然语言反思 ， 写进 episodic memory" />
          </li>
          <li>
            <Term en="Tree of Thoughts (ToT)" ch="思考树 + 搜索算法 + 回溯" />
          </li>
          <li>
            <Term en="LATS" ch="Language Agent Tree Search ， ReAct+Reflexion+ToT+MCTS" />
          </li>
          <li>
            <Term en="Episodic memory" ch="情景记忆 ， 存过去尝试的反思" />
          </li>
          <li>
            <Term en="MCTS" ch="蒙特卡洛树搜索 ， AlphaGo 同款搜索算法" />
          </li>
          <li>
            <Term en="LLM-as-judge" ch="用 LLM 评估 LLM 的输出 ， agent 评测常用" />
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
            <p>从 ReAct 到 LATS ， 都在回答同一个问题：</p>
            <p>"怎么让 LLM 比单次预测想得更深、 更稳、 更会回头。"</p>
          </div>
        </FluidRoughBox>
      </section>

      <Section title="参考来源 References" underlineWidth={260} color={INK_SEPIA}>
        <ol
          className="space-y-2 sm:space-y-3 text-sm sm:text-base pl-5 list-decimal"
          style={{ fontFamily: PEN }}
        >
          <li>
            Yao, S., Zhao, J., Yu, D., Du, N., Shafran, I., Narasimhan, K., Cao, Y. 2022/2023.
            <em> ReAct: Synergizing Reasoning and Acting in Language Models</em>. ICLR 2023.{' '}
            <a
              href="https://arxiv.org/abs/2210.03629"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: INK_SEPIA }}
            >
              arxiv.org/abs/2210.03629
            </a>{' '}
            (accessed 2026-05-28)
          </li>
          <li>
            Wang, L., Xu, W., Lan, Y., Hu, Z., Lan, Y., Lee, R. K.-W., Lim, E.-P. 2023.
            <em> Plan-and-Solve Prompting: Improving Zero-Shot Chain-of-Thought Reasoning</em>.
            ACL 2023.{' '}
            <a
              href="https://arxiv.org/abs/2305.04091"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: INK_SEPIA }}
            >
              arxiv.org/abs/2305.04091
            </a>
          </li>
          <li>
            Shinn, N., Cassano, F., Berman, E., Gopinath, A., Narasimhan, K., Yao, S. 2023.
            <em> Reflexion: Language Agents with Verbal Reinforcement Learning</em>. NeurIPS 2023.{' '}
            <a
              href="https://arxiv.org/abs/2303.11366"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: INK_SEPIA }}
            >
              arxiv.org/abs/2303.11366
            </a>
          </li>
          <li>
            Yao, S., Yu, D., Zhao, J., Shafran, I., Griffiths, T. L., Cao, Y., Narasimhan, K. 2023.
            <em> Tree of Thoughts: Deliberate Problem Solving with Large Language Models</em>.
            NeurIPS 2023.{' '}
            <a
              href="https://arxiv.org/abs/2305.10601"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: INK_SEPIA }}
            >
              arxiv.org/abs/2305.10601
            </a>
          </li>
          <li>
            Zhou, A., Yan, K., Shlapentokh-Rothman, M., Wang, H., Wang, Y.-X. 2024.
            <em>
              {' '}
              Language Agent Tree Search Unifies Reasoning, Acting, and Planning in Language
              Models
            </em>
            . ICML 2024.{' '}
            <a
              href="https://arxiv.org/abs/2310.04406"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: INK_SEPIA }}
            >
              arxiv.org/abs/2310.04406
            </a>
          </li>
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
            Vellum.{' '}
            <em>LLM Leaderboard 2026 — Compare Top AI Models</em>.{' '}
            <a
              href="https://www.vellum.ai/llm-leaderboard"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: INK_SEPIA }}
            >
              vellum.ai/llm-leaderboard
            </a>{' '}
            (accessed 2026-05-28). 提供 HumanEval / SWE-bench 等的第三方排行榜。
            数字逐月更新 ， 文中引用为大致水平
          </li>
        </ol>
      </Section>

      <Changelog created={meta.date} entries={meta.changelog} />
    </Paper>
  );
}
