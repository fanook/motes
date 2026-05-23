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
  title: 'Prompt Caching 是什么',
  date: '2026-05-24',
  tags: ['AI 入门', 'LLM', '成本'],
  summary:
    '从 KV cache 到块级哈希， 把"为什么能省 90% 钱"的底层机制讲清楚。',
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
      {ch && (
        <span className="text-xs sm:text-sm text-stone-500">≈ {ch}</span>
      )}
    </span>
  );
}

function PromptBlock({
  label,
  type,
  size = 'large',
}: {
  label: string;
  type: 'static' | 'variable';
  size?: 'small' | 'large';
}) {
  const bg = type === 'static' ? '#d1fae5' : '#fef3c7';
  const note = type === 'static' ? '静态· 可缓存' : '变量· 不缓存';
  const w = size === 'large' ? 'w-full' : 'w-3/4 sm:w-2/3';
  return (
    <div
      className={`${w} p-2.5 sm:p-3 rounded-sm`}
      style={{ backgroundColor: bg }}
    >
      <p
        className="text-base sm:text-lg"
        style={{ fontFamily: HAND, color: INK }}
      >
        {label}
      </p>
      <p
        className="text-xs sm:text-sm text-stone-500"
        style={{ fontFamily: PEN }}
      >
        {note}
      </p>
    </div>
  );
}

export default function Mote() {
  return (
    <Paper>
      {/* 标题 */}
      <header className="mb-6 sm:mb-8">
        <h1
          className="text-3xl sm:text-5xl leading-tight"
          style={{ fontFamily: HAND, color: INK_SEPIA }}
        >
          Prompt Caching
        </h1>
        <div className="mt-1">
          <RoughUnderline width={240} seed={11} />
        </div>
        <p
          className="mt-2 sm:mt-3 text-lg sm:text-2xl"
          style={{ fontFamily: HAND, color: INK }}
        >
          —— 让 AI 别每次都"读一遍说明书"
        </p>
      </header>

      {/* 引言 */}
      <div
        className="text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-2.5"
        style={{ fontFamily: PEN }}
      >
        <p>你给 AI 写过长 system prompt 吗？</p>
        <p className="pl-4 text-stone-600">· 5000 字的产品说明书</p>
        <p className="pl-4 text-stone-600">· 一个角色人格档案</p>
        <p className="pl-4 text-stone-600">· 几十个 few-shot 示例</p>
        <p className="pl-4 text-stone-600">· RAG 检索回来的整篇文档……</p>
        <p className="pt-2">
          每次调用 API，<strong style={{ color: INK_RED }}>这部分都会被重新计费 + 重新处理一遍</strong>。
          调用 1 万次， 同样的"说明书"就被无脑送进去 1 万次。
        </p>
        <p className="pt-2">
          <Term en="Prompt Caching" ch="提示词缓存" /> 就是为这个设计的 ——
          <strong style={{ color: INK_GREEN }}>相同前缀缓存住， 下次省 90% 钱、 80% 延迟</strong>
          <sup>[1][2]</sup>。
        </p>
      </div>

      {/* ─── 1 工作原理 ─── */}
      <Section title="一、工作原理：从 KV Cache 说起" underlineWidth={290}>
        <p className="text-sm sm:text-base text-stone-500">
          ⚠️ 一个常见误解（包括 Anthropic 自家文档里的措辞）：prompt caching ≠ KV cache。 严格说，
          <strong style={{ color: INK_RED }}>它就是把 KV cache 持久化到跨请求</strong>，
          只不过用户层看不到细节。 下面从根上讲。
        </p>

        <p className="pt-3">
          <strong>1. Transformer 怎么算 attention？</strong>
        </p>
        <p>
          每个 token 进入注意力层时都会算出三个向量：<strong>Q</strong>（query）、 <strong>K</strong>（key）、 <strong>V</strong>（value）。
          模型用 Q 去和所有先前 token 的 K 算相似度， 再加权它们的 V，得到这个位置的输出。
        </p>

        <p className="pt-3">
          <strong>2. <Term en="KV cache" ch="键值缓存" /> —— 同一次请求里的优化</strong>
        </p>
        <p>
          自回归生成第 N+1 个 token 时， 前 N 个 token 的 K 和 V <strong>不会变</strong>。
          所以推理引擎把它们<strong style={{ color: INK_SEPIA }}>缓存在 GPU 显存里</strong>，
          下次只算新 token 的 K、 V，避免对整段 prompt 重做一遍 attention。
        </p>
        <p className="text-sm sm:text-base text-stone-500">
          这是所有现代 LLM 推理（vLLM、 TGI、 TensorRT-LLM）都用的标准技术。
        </p>

        <p className="pt-3">
          <strong>3. Prompt Caching = 跨请求复用 KV cache</strong>
        </p>
        <p>关键洞察：</p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>同一个 system prompt 的 K、 V 张量， 不管谁请求， 算出来都一样</li>
          <li>那为什么每次请求都要重算一遍？</li>
          <li>把这些 KV 张量<strong>存到内存 / 快存里</strong>， 下次直接读 ——
            <span style={{ color: INK_GREEN }}>跳过整个 prefill 计算</span>
          </li>
        </ul>

        <p className="pt-3">
          <strong>4. 实际算法：块级哈希（PagedAttention）</strong>
        </p>
        <p>
          直接缓存"整段 prompt"太死板， 主流实现（vLLM 等 <sup>[4]</sup>）的做法：
        </p>
        <ol className="pl-5 list-decimal space-y-1 text-base sm:text-lg">
          <li>把 token 序列切成<strong>固定大小的块</strong>（vLLM 默认 16 token / 块）</li>
          <li>每个块的哈希 = <code className="px-1 bg-stone-100 rounded text-sm">hash(父块哈希, 本块 token)</code> ——
            <strong style={{ color: INK_RED }}>形成哈希链</strong>
          </li>
          <li>全局哈希表记录"哈希 → 物理 KV 块"映射</li>
          <li>新请求来 → 逐块算哈希、 查表 → 命中的块直接复用， 没命中的块才计算并写入</li>
        </ol>

        <p className="pt-3">
          <strong>5. 这就是为什么"前缀"</strong>
        </p>
        <p>
          因为哈希是链式的 ——
          <strong style={{ color: INK_RED }}>改一个字， 哈希链从此处断裂</strong>，
          后面的块即使内容相同也算"新"。 所以缓存必须从开头开始连续匹配。
        </p>

        <p className="pt-3">
          <strong>6. 满了怎么淘汰？</strong>
        </p>
        <p>
          <Term en="LRU" ch="最近最少使用" /> 策略：维护一个引用计数 + 空闲队列，
          没被引用的块按"最久没用"顺序淘汰。
        </p>

        <div
          className="mt-4 p-3 rounded-sm text-sm sm:text-base"
          style={{ backgroundColor: '#fef9c3', fontFamily: PEN }}
        >
          💡 <strong>所以为什么是"前缀缓存"</strong>：因为哈希按块链式累积， 前缀完全一样
          才能逐块命中。 改一个字， 哈希链断， 后面全部需要重算。
        </div>

        <p className="pt-3 text-sm sm:text-base text-stone-500">
          学术起点：Kwon et al. 2023 的 PagedAttention <sup>[5]</sup>，
          把操作系统的虚拟内存分页思想搬到了 KV cache 管理。
          SGLang 的 RadixAttention 用 radix 树进一步支持"分叉前缀"共享。
        </p>
      </Section>

      {/* ─── 2 Anthropic 显式 ─── */}
      <Section title="二、Anthropic 版本：显式标记" underlineWidth={260}>
        <p>
          需要你主动告诉 API "这块要缓存"<sup>[1]</sup>：
        </p>

        <div
          className="mt-2 p-3 sm:p-4 rounded-sm text-xs sm:text-sm overflow-x-auto"
          style={{
            backgroundColor: 'rgba(255,255,255,0.6)',
            fontFamily: 'ui-monospace, Consolas, monospace',
            color: INK,
          }}
        >
          <pre className="whitespace-pre">{`{
  "system": [{
    "type": "text",
    "text": "长 system prompt ...",
    `}<span style={{ color: INK_RED }}>{`"cache_control": {"type": "ephemeral"}`}</span>{`
  }],
  "messages": [ ... ]
}`}</pre>
        </div>

        <p className="pt-3"><strong>最小可缓存长度</strong>：</p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>Sonnet 4.6 / Sonnet 4.5 / Opus 4.1: <strong>1,024 token</strong></li>
          <li>Opus 4.7 / 4.6 / 4.5 / Haiku 4.5: <strong>4,096 token</strong> <sup>[1]</sup></li>
        </ul>

        <p className="pt-3"><strong>TTL 选择</strong>（缓存活多久）：</p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li><strong>5 分钟</strong>（默认）—— 写入价 1.25× 基础 input 价</li>
          <li><strong>1 小时</strong> —— 写入价 2× 基础 input 价， 适合 agentic 场景</li>
          <li>命中（cache read）—— <strong style={{ color: INK_GREEN }}>0.1× 基础 input 价， 即 9 折省 90%</strong></li>
        </ul>

        <p className="pt-2 text-sm sm:text-base text-stone-500">
          其他规则：最多 4 个 cache breakpoint； 工具定义、 system、 messages、 图片、 文档都能缓存。
        </p>
      </Section>

      {/* ─── 3 OpenAI 自动 ─── */}
      <Section title="三、OpenAI 版本：完全自动" underlineWidth={250}>
        <p>
          不需要写任何代码 ——
          <strong style={{ color: INK_SEPIA }}>所有 GPT-4o 及更新模型默认开启</strong>
          <sup>[2]</sup>。
        </p>
        <p className="pt-2">机制：</p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>请求按 prompt 前缀的<strong>哈希</strong>路由到同一台机器</li>
          <li>哈希通常取前 256 token（视模型略有差异）</li>
          <li>缓存命中以 <strong>128 token</strong> 为粒度递增</li>
          <li>最小可缓存：<strong>1,024 token</strong></li>
          <li>TTL：5~10 分钟无活动失效， 最长 1 小时（Extended retention 可达 24 小时）</li>
          <li>cache read 最多省 <strong>90%</strong> input 价</li>
        </ul>

        <p className="pt-3">
          可选参数 <code className="px-1 py-0.5 bg-stone-100 rounded text-sm">prompt_cache_key</code>：
          同一业务的请求带相同 key， 帮助路由命中同一台缓存机器（提高命中率）。
        </p>

        <div
          className="mt-3 p-3 rounded-sm text-sm sm:text-base"
          style={{ backgroundColor: '#fef9c3', fontFamily: PEN }}
        >
          ⚖️ <strong>Anthropic vs OpenAI</strong>
          ：前者要你显式标记， 控制力强； 后者全自动， 省心但你不能精确控制哪段缓存。
        </div>
      </Section>

      {/* ─── 4 黄金原则 ─── */}
      <Section title="四、黄金原则：静态在前，变量在后" underlineWidth={290}>
        <p>缓存的是前缀。 prompt 结构应该长这样 ——</p>

        <div className="mt-3 space-y-2">
          <PromptBlock type="static" label="系统提示 / 角色设定" />
          <PromptBlock type="static" label="工具定义" />
          <PromptBlock type="static" label="RAG 检索的文档" />
          <PromptBlock type="static" label="Few-shot 示例" />
          <div className="my-2 text-center text-stone-400 text-sm">↓ 分隔 ↓</div>
          <PromptBlock type="variable" label="本次用户输入" size="small" />
        </div>

        <p className="pt-3">
          倒过来放（用户输入在最前面）——
          <strong style={{ color: INK_RED }}>缓存 0 命中</strong>。 每次都按"前缀全变了"处理。
        </p>
      </Section>

      {/* ─── 5 算笔账 ─── */}
      <Section title="五、真算笔账（用 Claude Opus 4.7）" underlineWidth={310}>
        <p>假设场景：</p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>System prompt：<strong>10,000 token</strong>（产品说明 + few-shot 示例）</li>
          <li>每次用户消息：100 token</li>
          <li>每天调用 <strong>1,000 次</strong></li>
          <li>Claude Opus 4.7 价格 <sup>[3]</sup>：input $5/MTok， cache write 5m $6.25/MTok， cache read $0.50/MTok</li>
        </ul>

        <p className="pt-3"><strong>❌ 不开 caching：</strong></p>
        <div
          className="p-3 rounded-sm space-y-1 text-sm sm:text-base"
          style={{
            backgroundColor: '#fee2e2',
            fontFamily: 'ui-monospace, Consolas, monospace',
            color: INK,
          }}
        >
          <p>每次：10,100 × $5/MTok = $0.0505</p>
          <p>一天 1000 次：<strong>$50.5</strong></p>
          <p>一个月：<strong>$1,515</strong></p>
        </div>

        <p className="pt-3"><strong>✅ 开 caching（5 分钟 TTL）：</strong></p>
        <div
          className="p-3 rounded-sm space-y-1 text-sm sm:text-base"
          style={{
            backgroundColor: '#d1fae5',
            fontFamily: 'ui-monospace, Consolas, monospace',
            color: INK,
          }}
        >
          <p>第 1 次（写）：10,000 × $6.25/MTok + 100 × $5 = $0.063</p>
          <p>第 2~1000 次（读）：10,000 × $0.50/MTok + 100 × $5 = $0.0055 × 999 ≈ $5.49</p>
          <p>一天合计：<strong>~$5.55</strong></p>
          <p>一个月：<strong>~$167</strong></p>
        </div>

        <div className="mt-4">
          <RoughBarChart
            items={[
              {
                label: '不开 caching',
                value: 1515,
                fill: '#fecaca',
                suffix: ' $/月',
              },
              {
                label: '开 caching',
                value: 167,
                fill: '#bbf7d0',
                suffix: ' $/月',
              },
            ]}
            barHeight={36}
            labelWidth={130}
          />
        </div>

        <p className="pt-3">
          <strong style={{ color: INK_GREEN }}>省 89%</strong>。
          系统 prompt 越长、 调用越频繁， 越赚。
        </p>
      </Section>

      {/* ─── 6 坑 ─── */}
      <Section title="六、几个常见的坑" underlineWidth={210}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>时间戳 / 当前日期不要塞进缓存部分</strong> —— 每次都变 → 永远 0 命中
          </li>
          <li>
            <strong>改一个字， 整段失效</strong> —— prefix 是字节级比对。 system prompt 加个标点都不行
          </li>
          <li>
            <strong>工具定义变了 → 全失效</strong> —— Anthropic 的层级是<br />
            <code className="px-1 py-0.5 bg-stone-100 rounded text-sm">tools → system → messages</code>
            。 上游变了下游一起作废 <sup>[1]</sup>
          </li>
          <li>
            <strong>太短不缓存</strong> —— &lt; 1,024 / 4,096 token 直接跳过缓存（不报错， 只是没省）
          </li>
          <li>
            <strong>跨 workspace 隔离</strong> —— 你 dev 环境 vs prod 缓存互不可见
          </li>
        </ul>
      </Section>

      {/* ─── 7 必开场景 ─── */}
      <Section title="七、什么场景必开？" underlineWidth={210}>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>长 system prompt 的 chatbot ✓</li>
          <li>RAG 应用（相同文档反复参考） ✓</li>
          <li>Few-shot 大量示例 ✓</li>
          <li>多轮长对话（历史不断变长） ✓</li>
          <li>Agentic 长上下文工作流 ✓</li>
        </ul>
        <p className="pt-3 text-stone-500 text-sm sm:text-base">
          反过来：一次性请求、 每次内容都变、 短 prompt 的场景 → 没用。
        </p>
      </Section>

      {/* ─── 8 术语 ─── */}
      <Section title="八、术语小辞典" underlineWidth={200} color={INK_SEPIA}>
        <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg pl-0 list-none">
          <li><Term en="Prompt caching" ch="提示词缓存（API 层， 不是 KV cache）" /></li>
          <li><Term en="Cache breakpoint" ch="缓存断点， Anthropic 用 cache_control 显式标记" /></li>
          <li><Term en="Prefix matching" ch="前缀匹配， 缓存命中机制" /></li>
          <li><Term en="TTL" ipa="/tiː tiː ɛl/" ch="Time To Live， 缓存存活时间" /></li>
          <li><Term en="KV cache" ch="键值缓存， 是模型推理内部的事， 与 prompt caching 不是一回事" /></li>
          <li>
            <Term en="prompt_cache_key" ch="OpenAI 的可选路由提示参数" />
          </li>
        </ul>
      </Section>

      {/* ─── 一句话总结 ─── */}
      <section className="mt-10 sm:mt-12">
        <FluidRoughBox height={130} seed={91} color={INK_RED}>
          <div
            className="text-base sm:text-xl leading-relaxed text-center px-2"
            style={{ fontFamily: HAND }}
          >
            <p className="text-sm text-stone-500 mb-1">★ 一句话总结</p>
            <p>把"AI 每次都要读的说明书"缓存住，</p>
            <p>别让它重复读 1 万遍。</p>
          </div>
        </FluidRoughBox>
      </section>

      {/* ─── 参考来源 ─── */}
      <Section title="参考来源 References" underlineWidth={260} color={INK_SEPIA}>
        <ol
          className="space-y-2 sm:space-y-3 text-sm sm:text-base pl-5 list-decimal"
          style={{ fontFamily: PEN }}
        >
          <li>
            Anthropic. <em>Prompt caching</em>.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://platform.claude.com/docs/en/build-with-claude/prompt-caching"
              target="_blank"
              rel="noreferrer"
            >
              platform.claude.com/docs/en/build-with-claude/prompt-caching
            </a>
            （accessed 2026-05-24；机制、 TTL、 最小 token 数、 cache_control 用法、 缓存失效层级）
          </li>
          <li>
            OpenAI. <em>Prompt caching</em>.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://developers.openai.com/api/docs/guides/prompt-caching"
              target="_blank"
              rel="noreferrer"
            >
              developers.openai.com/api/docs/guides/prompt-caching
            </a>
            （accessed 2026-05-24；自动机制、 前 256 token 哈希、 128 token 粒度、 90% 折扣）
          </li>
          <li>
            Anthropic. <em>Pricing</em>.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://platform.claude.com/docs/en/about-claude/pricing"
              target="_blank"
              rel="noreferrer"
            >
              platform.claude.com/docs/en/about-claude/pricing
            </a>
            （accessed 2026-05-24；价格倍率 1.25× / 2× / 0.1×）
          </li>
          <li>
            vLLM. <em>Automatic Prefix Caching</em>.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://docs.vllm.ai/en/stable/design/prefix_caching/"
              target="_blank"
              rel="noreferrer"
            >
              docs.vllm.ai/en/stable/design/prefix_caching/
            </a>
            （accessed 2026-05-24；块级哈希、 哈希链、 LRU 淘汰）
          </li>
          <li>
            Kwon, W., Li, Z., Zhuang, S. et al. (2023).{' '}
            <em>
              Efficient Memory Management for Large Language Model Serving with
              PagedAttention
            </em>
            . SOSP 2023.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2309.06180"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2309.06180
            </a>
          </li>
        </ol>
      </Section>

      <Changelog created={meta.date} entries={meta.changelog} />
    </Paper>
  );
}
