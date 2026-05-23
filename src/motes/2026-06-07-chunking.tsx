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
  title: 'Chunking 切块策略',
  date: '2026-06-07',
  tags: ['AI 入门', 'RAG'],
  summary: 'RAG 系统里最容易翻车的环节。 切块的大小、 边界、 重叠、 语义切法对比。',
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
          Chunking
        </h1>
        <div className="mt-1">
          <RoughUnderline width={180} seed={11} />
        </div>
        <p
          className="mt-2 sm:mt-3 text-lg sm:text-2xl"
          style={{ fontFamily: HAND, color: INK }}
        >
          —— RAG 的切块策略
        </p>
      </header>

      <div
        className="text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-2.5"
        style={{ fontFamily: PEN }}
      >
        <p>
          做 RAG（详见 [RAG]）的人都知道：检索效果好不好， 一半看 embedding 模型， 另一半看
          <strong style={{ color: INK_RED }}>切块怎么切</strong>。
        </p>
        <p>
          切得太碎 → 单段信息不全， 召回不到完整答案；
          切得太大 → 单段含义模糊， embedding 表达力被稀释。
        </p>
      </div>

      <Section title="一、为什么必须切" underlineWidth={170}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>Embedding 模型有上下文上限</strong> —— 8K~32K token， 长文档直接喂会被截断
          </li>
          <li>
            <strong>检索粒度要够精</strong> —— 整篇 100 页 PDF 作为一个 chunk， 检索时拿到一整本根本没用
          </li>
          <li>
            <strong>塞给 LLM 时省 token</strong> —— 只想给模型最相关的几段， 不是整篇
          </li>
        </ul>
      </Section>

      <Section title="二、几种主流切法（从笨到聪明）" underlineWidth={330}>
        <p><strong>1. 固定长度切（character / token level）</strong></p>
        <p>
          按字符或 token 数切， 比如每 500 token 一刀。
          最简单， 但会切断句子甚至单词。 适合纯文本快速原型， 实际不推荐。
        </p>

        <p className="pt-3"><strong>2. 句子级切</strong></p>
        <p>
          按句号 / 段落切。 保证单 chunk 内是完整句子。 但句子长短差异大， chunk size 不均匀。
        </p>

        <p className="pt-3"><strong>3. 递归字符切（recursive character splitter）</strong></p>
        <p>
          LangChain / LlamaIndex 默认。 先尝试按段落分； 段落太长再按句号； 还太长再按逗号； 最后才砍字符。
          兼顾"语义边界"和"长度上限"。 当前主流推荐。
        </p>

        <p className="pt-3"><strong>4. 结构化切（按 markdown / HTML 标签）</strong></p>
        <p>
          代码文档、 wiki， 按 H1 / H2 标题切。 保留章节层次信息， 还可以把"父标题"作为元数据带上。
        </p>

        <p className="pt-3"><strong>5. 语义切（semantic chunking）</strong></p>
        <p>
          先用 embedding 算相邻句子的相似度， 在相似度突然下降的地方切。 这样 chunk 之间的"话题"是分开的。
        </p>

        <p className="pt-3"><strong>6. Agentic / LLM-based 切</strong></p>
        <p>
          让 LLM 读完文档自己切。 质量最高， 但贵且慢， 适合一次性文档（合同、 论文）。
        </p>
      </Section>

      <Section title="三、关键参数：chunk size 和 overlap" underlineWidth={310}>
        <p><strong>Chunk size</strong>：</p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>太小（&lt;100 token） —— 信息片段化， 上下文丢失</li>
          <li>太大（&gt;2000 token） —— embedding 失真， 检索精度下降</li>
          <li>常用 <strong>200~800 token</strong>， 视内容类型调</li>
        </ul>

        <p className="pt-3"><strong>Overlap（重叠）</strong>：</p>
        <p>
          相邻 chunk 之间故意保留一段重复， 防止关键信息正好被切在边界。
        </p>
        <p>常用 <strong>10%~20% 的 chunk size</strong>， 比如 chunk=500， overlap=50~100。</p>
      </Section>

      <Section title="四、加 metadata（容易被忽略的优化）" underlineWidth={340}>
        <p>
          每个 chunk 除了文本本身， 应该携带元数据：
        </p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>来源文档 / URL</li>
          <li>所在章节标题</li>
          <li>页码 / 位置</li>
          <li>时间戳（文档创建 / 更新时间）</li>
          <li>类型标签（spec / FAQ / 内部备注）</li>
        </ul>
        <p className="pt-2">
          这些元数据在 RAG 时可以：
        </p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>预先过滤（"只在 2024 年之后的 spec 里检索"）</li>
          <li>给 LLM 引用时标注来源</li>
          <li>对同一文档的 chunk 做"父子合并"（先按相关性召回 chunk， 再回拉它所在的更大段落）
          </li>
        </ul>
      </Section>

      <Section title="五、几个坑" underlineWidth={120}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>表格 / 代码块被切散</strong> ——
            HTML/Markdown 提取要保留这些块为整体， 不能粗暴按字符切
          </li>
          <li>
            <strong>列表项被切断</strong> ——
            "因为：1. ... 2. ... 3. ..." 被切到第 2 条 → 第 3 条丢了上下文
          </li>
          <li>
            <strong>PDF 提取错误</strong> ——
            扫描版 PDF 用 OCR， 错字 / 换行错位严重影响 chunk 质量
          </li>
          <li>
            <strong>多语种混合</strong> ——
            按"字符 500"切英文和中文， 实际 chunk size 差几倍， 应统一按 token 数算
          </li>
        </ul>
      </Section>

      <Section title="六、实战建议" underlineWidth={140}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>原型阶段：recursive character splitter， chunk 500、 overlap 50</li>
          <li>正式上线前：分别测 200 / 400 / 800 / 1600， 看哪个 size 召回率最好</li>
          <li>结构化文档（API docs、 wiki）：按 H2/H3 切， 比按字符更稳</li>
          <li>低延迟要求高：embedding 一次性算， 别每次重做</li>
          <li>非结构化（合同、 论文）：考虑 semantic 或 LLM-based</li>
        </ul>
      </Section>

      <Section title="七、术语小辞典" underlineWidth={200} color={INK_SEPIA}>
        <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg pl-0 list-none">
          <li><Term en="Chunking" ch="切块" /></li>
          <li><Term en="Chunk size" ch="切块长度（token 或字符）" /></li>
          <li><Term en="Overlap" ipa="/ˌoʊvərˈlæp/" ch="相邻块的重叠， 防止边界丢信息" /></li>
          <li><Term en="Recursive splitter" ch="递归切分器， 主流实现" /></li>
          <li><Term en="Semantic chunking" ch="语义切块， 按相似度分界" /></li>
          <li><Term en="Parent-child chunking" ch="父子块， 召回小块、 喂大块给 LLM" /></li>
        </ul>
      </Section>

      <section className="mt-10 sm:mt-12">
        <FluidRoughBox height={130} seed={91} color={INK_RED}>
          <div
            className="text-base sm:text-xl leading-relaxed text-center px-2"
            style={{ fontFamily: HAND }}
          >
            <p className="text-sm text-stone-500 mb-1">★ 一句话总结</p>
            <p>切块是 RAG 系统最容易出问题的环节。</p>
            <p>没有"最佳 chunk size"， 只有"针对你的语料测出来的"。</p>
          </div>
        </FluidRoughBox>
      </section>

      <Section title="参考来源 References" underlineWidth={260} color={INK_SEPIA}>
        <ol
          className="space-y-2 sm:space-y-3 text-sm sm:text-base pl-5 list-decimal"
          style={{ fontFamily: PEN }}
        >
          <li>
            LangChain 文档：Text splitters.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://python.langchain.com/docs/concepts/text_splitters"
              target="_blank"
              rel="noreferrer"
            >
              python.langchain.com/docs/concepts/text_splitters
            </a>
            （recursive splitter 等主流实现）
          </li>
          <li>
            LlamaIndex 文档：Node parsers.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://docs.llamaindex.ai/en/stable/module_guides/loading/node_parsers/"
              target="_blank"
              rel="noreferrer"
            >
              docs.llamaindex.ai/.../node_parsers/
            </a>
          </li>
          <li>
            Anthropic. <em>Contextual Retrieval</em>. 2024-09.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://www.anthropic.com/news/contextual-retrieval"
              target="_blank"
              rel="noreferrer"
            >
              anthropic.com/news/contextual-retrieval
            </a>
            （给 chunk 注入文档级语境提升召回的实战做法）
          </li>
        </ol>
      </Section>

      <Changelog created={meta.date} entries={meta.changelog} />
    </Paper>
  );
}
