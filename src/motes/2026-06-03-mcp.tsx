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
  title: 'MCP 协议',
  date: '2026-06-03',
  tags: ['AI 入门', 'Agent', '协议'],
  summary: 'AI 应用接外部数据 / 工具的统一标准。 架构、 三大原语、 为什么是"USB-C"。',
};

function Term({ en, ipa, ch }: { en: string; ipa?: string; ch?: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 flex-wrap">
      <strong style={{ color: INK_SEPIA }}>{en}</strong>
      {ipa && (
        <span
          className="text-xs sm:text-sm text-stone-400"
          style={{ fontFamily: 'var(--font-hand-pen)' }}
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
          MCP
        </h1>
        <div className="mt-1">
          <RoughUnderline width={120} seed={11} />
        </div>
        <p
          className="mt-2 sm:mt-3 text-lg sm:text-2xl"
          style={{ fontFamily: HAND, color: INK }}
        >
          —— Model Context Protocol
        </p>
      </header>

      <div
        className="text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-2.5"
        style={{ fontFamily: PEN }}
      >
        <p>
          每个 AI 应用要接外部数据/工具时， 都要写一遍"function calling"集成（详见 [Function Calling]）：
          ChatGPT 一套、 Claude 一套、 自家 agent 又一套。 重复造轮子， 还彼此不通。
        </p>
        <p>
          <Term en="MCP" ch="Model Context Protocol， 模型上下文协议" /> ——
          由 Anthropic 2024 年 11 月开源 <sup>[1]</sup>， 一个<strong>统一标准</strong>，
          像 <strong>USB-C 之于硬件</strong>： 任何 AI 客户端 + 任何工具服务器， 接上就能用。
        </p>
        <p className="pt-1">
          2026 年已被 Claude、 ChatGPT、 VSCode、 Cursor 等主流客户端支持。
        </p>
      </div>

      <Section title="一、它解决什么" underlineWidth={170}>
        <p><strong>问题：</strong></p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>"我想让 Cursor 能查我的 Notion / Linear / Postgres / 内部 API"</li>
          <li>"我做了个 SaaS， 想让 Claude / ChatGPT 都能调"</li>
          <li>"老板要求 AI 助手能管邮件、 日程、 文档"</li>
        </ul>
        <p className="pt-2">
          <strong>之前的做法</strong>：每对组合都写一次胶水代码。 N 个客户端 × M 个服务 = N×M 次集成。
        </p>
        <p>
          <strong>MCP 之后</strong>：每个客户端实现一次 MCP 客户端， 每个服务实现一次 MCP 服务器。
          N + M， 而非 N × M。
        </p>
      </Section>

      <Section title="二、参与方：Host / Client / Server" underlineWidth={310}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>MCP Host</strong> —— 用户实际打开的 AI 应用
            （Claude Desktop、 Cursor、 VSCode 等）
          </li>
          <li>
            <strong>MCP Client</strong> —— Host 内部的连接管理器。 每对接一个 Server 就实例化一个 Client
          </li>
          <li>
            <strong>MCP Server</strong> —— 向外暴露能力的程序， 可本地（stdio）或远程（HTTP）
          </li>
        </ul>

        <div
          className="mt-3 p-3 rounded-sm text-sm sm:text-base"
          style={{ backgroundColor: 'rgba(255,255,255,0.6)', fontFamily: PEN, color: INK }}
        >
          <pre className="whitespace-pre">{`Host (Cursor)
├── Client 1 ←→ Server A (filesystem, 本地 stdio)
├── Client 2 ←→ Server B (Postgres, 本地 stdio)
└── Client 3 ←→ Server C (Sentry, 远程 HTTP)`}</pre>
        </div>
      </Section>

      <Section title="三、Server 暴露什么（三大原语）" underlineWidth={310}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <Term en="Tools" ch="工具" /> ——
            可执行函数。 AI 调它做事：查数据库、 调 API、 操作文件。
            类似 function calling， 但是标准化的
          </li>
          <li>
            <Term en="Resources" ch="资源" /> ——
            上下文数据。 AI 可以读但不会主动改：文件内容、 数据库记录、 schema
          </li>
          <li>
            <Term en="Prompts" ch="提示模板" /> ——
            可复用的 prompt / few-shot 模板。 让服务作者
            "捎带"提供最佳实践
          </li>
        </ul>
        <p className="pt-2 text-sm sm:text-base text-stone-500">
          每个原语都有 <code className="px-1 bg-stone-100 rounded text-sm">*/list</code>（发现）和{' '}
          <code className="px-1 bg-stone-100 rounded text-sm">*/get</code> 或{' '}
          <code className="px-1 bg-stone-100 rounded text-sm">*/call</code>（使用）。
        </p>
      </Section>

      <Section title="四、Client 也能反向暴露能力" underlineWidth={300}>
        <p>Server 可以反过来请 Client 做的事：</p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>
            <Term en="Sampling" ch="采样" /> ——
            Server 想用 LLM 但不想自己集成模型 → 让 Host 帮它调一次 LLM
          </li>
          <li>
            <Term en="Elicitation" ch="征询用户" /> ——
            Server 需要更多输入或要用户确认 → 让 Host 弹个对话框
          </li>
          <li>
            <strong>Logging</strong> —— Server 把日志发回 Client， 方便调试
          </li>
        </ul>
      </Section>

      <Section title="五、传输层" underlineWidth={150}>
        <p>MCP 跑在 <Term en="JSON-RPC 2.0" /> 之上。 两种传输：</p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>
            <strong>stdio</strong> —— 本地进程间通信， 标准输入输出。 性能最好， 无网络开销。
            适合本地 server（filesystem、 sqlite 等）
          </li>
          <li>
            <strong>Streamable HTTP + SSE</strong> —— 远程服务用， 支持 OAuth 等认证。
            适合 SaaS server（Sentry、 GitHub、 Notion 等托管在公网上的）
          </li>
        </ul>
      </Section>

      <Section title="六、一次会话的样子（高度简化）" underlineWidth={300}>
        <ol className="pl-5 list-decimal space-y-1 text-base sm:text-lg">
          <li>Client 发 <code className="px-1 bg-stone-100 rounded text-sm">initialize</code>， 报告自己能力</li>
          <li>Server 回应， 报告自己能力（支持哪些原语）</li>
          <li>Client 发 <code className="px-1 bg-stone-100 rounded text-sm">tools/list</code>， 拿到工具清单</li>
          <li>用户与 LLM 对话 → LLM 决定调某个工具 → Client 发 <code className="px-1 bg-stone-100 rounded text-sm">tools/call</code></li>
          <li>Server 执行， 返回结果</li>
          <li>结果回到 LLM， 继续对话</li>
          <li>Server 状态变化时主动发 <code className="px-1 bg-stone-100 rounded text-sm">notifications/tools/list_changed</code>， Client 刷新</li>
        </ol>
      </Section>

      <Section title="七、为什么开发者关心" underlineWidth={200}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>写一次， 多处用</strong> —— 给公司内部数据写一个 MCP server， Claude / ChatGPT / Cursor 都能接
          </li>
          <li>
            <strong>不绑定模型厂商</strong> —— Function calling 各家格式不同， MCP 把它抽象走
          </li>
          <li>
            <strong>生态正在膨胀</strong> —— 官方/社区已有数百个现成 server（GitHub、 Slack、 Notion、 Linear、 Stripe 等）
          </li>
          <li>
            <strong>可审计</strong> —— 协议明确， 每个 tool call、 每个数据访问都看得见
          </li>
        </ul>
      </Section>

      <Section title="八、坑" underlineWidth={120}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>权限 / 安全</strong> —— Server 能干什么用户能干什么。 滥用 MCP 容易把敏感数据泄给 LLM 上下文
          </li>
          <li>
            <strong>tool 数量爆</strong> —— 接了 10 个 server， 总工具数几十上百 → tools/list 就吃 token
          </li>
          <li>
            <strong>状态管理</strong> —— Server 是有状态的（生命周期、 capability 协商），
            网络抖动 / 重连要处理好
          </li>
          <li>
            <strong>版本协商</strong> —— 协议本身在演进， Client / Server 要互相支持
          </li>
        </ul>
      </Section>

      <Section title="九、术语小辞典" underlineWidth={200} color={INK_SEPIA}>
        <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg pl-0 list-none">
          <li><Term en="MCP" ch="Model Context Protocol" /></li>
          <li><Term en="Host" ch="用户使用的 AI 应用" /></li>
          <li><Term en="Client" ch="Host 内部对应每个 Server 的连接" /></li>
          <li><Term en="Server" ch="对外暴露 tools / resources / prompts 的程序" /></li>
          <li><Term en="Tools / Resources / Prompts" ch="Server 三大原语" /></li>
          <li><Term en="Sampling / Elicitation" ch="Client 反向暴露给 Server 的能力" /></li>
          <li><Term en="JSON-RPC 2.0" ch="MCP 用的消息格式" /></li>
        </ul>
      </Section>

      <section className="mt-10 sm:mt-12">
        <FluidRoughBox height={130} seed={91} color={INK_RED}>
          <div
            className="text-base sm:text-xl leading-relaxed text-center px-2"
            style={{ fontFamily: HAND }}
          >
            <p className="text-sm text-stone-500 mb-1">★ 一句话总结</p>
            <p>MCP = AI 时代的 USB-C：</p>
            <p>任何 AI 客户端， 任何工具服务器， 接上就能用。</p>
          </div>
        </FluidRoughBox>
      </section>

      <Section title="参考来源 References" underlineWidth={260} color={INK_SEPIA}>
        <ol
          className="space-y-2 sm:space-y-3 text-sm sm:text-base pl-5 list-decimal"
          style={{ fontFamily: PEN }}
        >
          <li>
            Anthropic. <em>Introducing the Model Context Protocol</em>. 2024-11.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://www.anthropic.com/news/model-context-protocol"
              target="_blank"
              rel="noreferrer"
            >
              anthropic.com/news/model-context-protocol
            </a>
            （发布公告）
          </li>
          <li>
            <em>MCP Architecture Overview</em>.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://modelcontextprotocol.io/docs/learn/architecture"
              target="_blank"
              rel="noreferrer"
            >
              modelcontextprotocol.io/docs/learn/architecture
            </a>
            （accessed 2026-06-03， Host/Client/Server、 三大原语、 传输层）
          </li>
          <li>
            <em>MCP Specification</em>.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://modelcontextprotocol.io/specification/latest"
              target="_blank"
              rel="noreferrer"
            >
              modelcontextprotocol.io/specification/latest
            </a>
          </li>
        </ol>
      </Section>

      <Changelog created={meta.date} entries={meta.changelog} />
    </Paper>
  );
}
