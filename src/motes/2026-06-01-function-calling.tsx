import {
  Paper,
  Section,
  Changelog,
  HAND,
  PEN,
  INK,
  INK_SEPIA,
  INK_RED,
  FluidRoughBox,
  RoughUnderline,
} from '../components/handwriting';
import type { MoteMeta } from '../lib/motes';

export const meta: MoteMeta = {
  title: 'Function Calling',
  date: '2026-06-01',
  tags: ['AI 入门', 'LLM', 'Agent'],
  summary: '让 LLM 调用外部工具 / API。 工作流、 Anthropic / OpenAI 风格差异、 实战要点。',
};

function Term({ en, ipa, ch }: { en: string; ipa?: string; ch?: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 flex-wrap">
      <strong style={{ color: INK_SEPIA }}>{en}</strong>
      {ipa && (
        <span
          className="text-xs sm:text-sm text-stone-400"
          style={{ fontFamily: 'ui-monospace, Consolas, monospace' }}
        >
          {ipa}
        </span>
      )}
      {ch && <span className="text-xs sm:text-sm text-stone-500">≈ {ch}</span>}
    </span>
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
          Function Calling
        </h1>
        <div className="mt-1">
          <RoughUnderline width={280} seed={11} />
        </div>
        <p
          className="mt-2 sm:mt-3 text-lg sm:text-2xl"
          style={{ fontFamily: HAND, color: INK }}
        >
          —— 让 AI 学会"按按钮"
        </p>
      </header>

      <div
        className="text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-2.5"
        style={{ fontFamily: PEN }}
      >
        <p>
          单纯生成文字的 LLM， 像一个"只会说话不动手"的人。 你问"今天北京天气"，
          它只能凭训练数据猜， 也可能直接幻觉。
        </p>
        <p>
          <Term en="Function calling" ch="函数调用" /> /
          <Term en="Tool use" ch="工具使用" /> ——
          让模型在需要时， <strong style={{ color: INK_RED }}>主动发起一次"调用工具"的请求</strong>：
          查天气、 搜资料、 执行代码、 调内部 API……
        </p>
        <p className="pt-1">
          这是 Agent 的基础设施。
        </p>
      </div>

      <Section title="一、典型工作流" underlineWidth={170}>
        <ol className="pl-5 list-decimal space-y-2 text-base sm:text-lg">
          <li>
            <strong>开发者声明</strong>有哪些工具可用（每个工具有 name + description + 参数 schema）
          </li>
          <li>
            用户提问 → LLM 看到 system prompt 里挂的工具列表
          </li>
          <li>
            模型判断：能直接答 → 答；需要外部信息 → <strong style={{ color: INK_SEPIA }}>发起 tool call</strong>
            （返回一个结构化的"我要调 weather(city='北京')"）
          </li>
          <li>
            <strong>应用代码执行</strong>该工具（调天气 API、 跑 SQL...）， 拿到结果
          </li>
          <li>
            结果回传给 LLM 作为新一轮 message
          </li>
          <li>
            LLM 综合工具结果， 给最终自然语言回答
          </li>
          <li>
            一个对话里 可以多次循环 3~5
          </li>
        </ol>
      </Section>

      <Section title={'二、工具是怎么"声明"的'} underlineWidth={260}>
        <p>
          开发者给 LLM 一份工具清单， 每个工具长这样（伪代码）：
        </p>
        <div
          className="mt-2 p-3 sm:p-4 rounded-sm text-sm sm:text-base overflow-x-auto"
          style={{ backgroundColor: 'rgba(255,255,255,0.6)', fontFamily: PEN, color: INK }}
        >
          <pre className="whitespace-pre">{`tool {
  name: "get_weather"
  description: "查询某个城市当前天气"
  parameters: {
    city:   { type: string, required }
    unit:   { type: enum["celsius","fahrenheit"], default: "celsius" }
  }
}`}</pre>
        </div>
        <p className="pt-3">
          模型根据 <strong>description + 参数 schema</strong> 决定该不该调、 传什么参数。
          所以 description 写得越清楚， 调用准确率越高。
        </p>
      </Section>

      <Section title="三、模型调用工具时返回什么" underlineWidth={290}>
        <p>
          不是普通自然语言， 而是一个<strong>结构化 block</strong>， 大致长这样：
        </p>
        <div
          className="mt-2 p-3 rounded-sm text-sm sm:text-base overflow-x-auto"
          style={{ backgroundColor: '#fef9c3', fontFamily: PEN, color: INK }}
        >
          <pre className="whitespace-pre">{`tool_call {
  id:   "call_abc123"
  name: "get_weather"
  args: { city: "北京", unit: "celsius" }
}`}</pre>
        </div>
        <p className="pt-2">
          应用代码 parse 这个 block， 执行真实函数， 把结果作为
          <code className="px-1 py-0.5 bg-stone-100 rounded text-sm">tool_result</code>
          再喂给模型。
        </p>
      </Section>

      <Section title="四、Anthropic vs OpenAI 的差异" underlineWidth={300}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>消息结构</strong>：Anthropic 用 content-block 数组（text 块和 tool_use 块并列），
            OpenAI 把 tool_calls 放在 message 的独立字段。 语义类似， 字段名不同
          </li>
          <li>
            <strong>工具上限</strong>：OpenAI 单次请求约 128 tools， Anthropic 约 64
          </li>
          <li>
            <strong>tool_choice 控制</strong>：两家都有 auto / required / specific tool 三档
          </li>
          <li>
            <strong>并行调用</strong>：两家都支持模型一次返回多个 tool_call
          </li>
          <li>
            <strong>系统工具</strong>：Anthropic 有内置的 web_search、 web_fetch、 code execution、 computer use；
            OpenAI 有 function calling 之外的 file search、 code interpreter
          </li>
        </ul>
        <p className="pt-2 text-sm sm:text-base text-stone-500">
          实战中如果想跨厂商， 用 <strong>MCP</strong> （详见 [MCP]）或者 LangChain / LlamaIndex 这种抽象层。
        </p>
      </Section>

      <Section title="五、几个实战要点" underlineWidth={170}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>工具数量不要爆</strong> ——
            每个工具的 name/description/schema 都进 prompt 算 token。 几十个工具能轻松吃掉几千 token
          </li>
          <li>
            <strong>description 是 prompt 的一部分</strong> ——
            写得越精准、 越有"什么场景该用"的指引， 模型调对的概率越高
          </li>
          <li>
            <strong>参数严格 schema</strong> ——
            用 JSON Schema 约束， 别让模型自由发挥。 必填、 类型、 枚举值都明确
          </li>
          <li>
            <strong>错误反馈</strong> ——
            工具执行失败时， 把错误信息也返回给模型， 它会调整下一步策略
          </li>
          <li>
            <strong>幂等性</strong> ——
            有些 tool call 可能被模型"重复发起"（比如重试）， 关键操作（下单、 转账）务必带幂等键
          </li>
          <li>
            <strong>超时</strong> —— 工具响应慢会拖累整个对话延迟， 给每个工具设超时
          </li>
        </ul>
      </Section>

      <Section title="六、常见场景" underlineWidth={140}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li><strong>查数据</strong>：天气、 股价、 数据库 SELECT</li>
          <li><strong>查代码</strong>：grep / 文件读取（IDE assistants）</li>
          <li><strong>外部 API 编排</strong>：发邮件、 建日程、 调内部业务</li>
          <li><strong>数学 / 计算</strong>：让模型调 calculator， 别自己心算（容易错）</li>
          <li><strong>搜索 / RAG</strong>：动态决定是否检索</li>
          <li><strong>代码执行</strong>：让模型写代码 + 用 sandbox 跑（详见 [Agent]）</li>
          <li><strong>多步推理</strong>：思考 → 调工具 → 看结果 → 再思考 → 答（ReAct 模式）</li>
        </ul>
      </Section>

      <Section title="七、术语小辞典" underlineWidth={200} color={INK_SEPIA}>
        <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg pl-0 list-none">
          <li><Term en="Function calling / Tool use" ch="函数调用 / 工具使用， 同一概念" /></li>
          <li><Term en="tool_call" ch="模型发起的调用请求" /></li>
          <li><Term en="tool_result" ch="应用层执行后回填的结果" /></li>
          <li><Term en="JSON Schema" ch="参数类型描述， 工具声明的核心" /></li>
          <li><Term en="ReAct" ch="Reason + Act， 推理-行动-观察循环" /></li>
          <li><Term en="Server tools" ch="厂商内置工具（如 Claude 的 web_search）" /></li>
          <li><Term en="Client tools" ch="开发者自定义工具" /></li>
        </ul>
      </Section>

      <section className="mt-10 sm:mt-12">
        <FluidRoughBox height={130} seed={91} color={INK_RED}>
          <div
            className="text-base sm:text-xl leading-relaxed text-center px-2"
            style={{ fontFamily: HAND }}
          >
            <p className="text-sm text-stone-500 mb-1">★ 一句话总结</p>
            <p>Function calling 把"会说话"的 LLM</p>
            <p>升级成"会按按钮"的 agent。</p>
          </div>
        </FluidRoughBox>
      </section>

      <Section title="参考来源 References" underlineWidth={260} color={INK_SEPIA}>
        <ol
          className="space-y-2 sm:space-y-3 text-sm sm:text-base pl-5 list-decimal"
          style={{ fontFamily: PEN }}
        >
          <li>
            Anthropic. <em>Tool use overview</em>.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview"
              target="_blank"
              rel="noreferrer"
            >
              platform.claude.com/docs/en/agents-and-tools/tool-use/overview
            </a>
            （accessed 2026-06-01）
          </li>
          <li>
            OpenAI. <em>Function calling guide</em>.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://platform.openai.com/docs/guides/function-calling"
              target="_blank"
              rel="noreferrer"
            >
              platform.openai.com/docs/guides/function-calling
            </a>
            （accessed 2026-06-01）
          </li>
          <li>
            Yao, S., Zhao, J. et al. (2022).{' '}
            <em>ReAct: Synergizing Reasoning and Acting in Language Models</em>. ICLR 2023.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2210.03629"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2210.03629
            </a>
          </li>
        </ol>
      </Section>

      <Changelog created={meta.date} entries={meta.changelog} />
    </Paper>
  );
}
