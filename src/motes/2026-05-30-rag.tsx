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
  RoughBox,
  FluidRoughBox,
  RoughArrow,
  RoughUnderline,
} from '../components/handwriting';
import type { MoteMeta } from '../lib/motes';

export const meta: MoteMeta = {
  title: 'RAG 检索增强生成',
  date: '2026-05-30',
  tags: ['AI 入门', 'LLM', 'RAG'],
  summary: '商用 AI 系统的核心范式。 工作流程、 关键组件、 常见坑、 评估方法。',
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

function FlowItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center">
      {children}
      <span
        className="mt-1 text-sm sm:text-base text-stone-500"
        style={{ fontFamily: HAND }}
      >
        {label}
      </span>
    </div>
  );
}

function FlowArrow({ seed }: { seed: number }) {
  return (
    <>
      <span className="sm:hidden">
        <RoughArrow width={36} height={28} seed={seed} direction="down" />
      </span>
      <span className="hidden sm:inline">
        <RoughArrow width={42} seed={seed} />
      </span>
    </>
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
          RAG
        </h1>
        <div className="mt-1">
          <RoughUnderline width={120} seed={11} />
        </div>
        <p
          className="mt-2 sm:mt-3 text-lg sm:text-2xl"
          style={{ fontFamily: HAND, color: INK }}
        >
          —— 检索增强生成
        </p>
      </header>

      <div
        className="text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-2.5"
        style={{ fontFamily: PEN }}
      >
        <p>
          模型自己"记"的知识是有限的、 易过期的、 会胡说的（详见 [Hallucination]）。
        </p>
        <p>
          一个朴素的想法 —— 别让它<strong>闭卷答</strong>， 让它<strong>开卷答</strong>：
          每次回答前， 先从你的知识库里检索几段相关资料， 塞进 prompt， 再让模型回答。
        </p>
        <p className="pt-2">
          这就是 <Term en="RAG" ipa="/ræg/" ch="Retrieval-Augmented Generation" />。
          由 Lewis et al. 2020 在 NeurIPS 提出 <sup>[1]</sup>。
        </p>
      </div>

      <Section title="一、RAG 的工作流程" underlineWidth={210}>
        <p><strong>分两条流水线：</strong></p>

        <p className="pt-3"><strong>📚 离线建索引（一次， 之后增量）</strong></p>
        <section className="my-3 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-3">
          <FlowItem label="原始文档">
            <RoughBox width={100} height={42} seed={61} fillColor="#fef9c3">
              <span className="text-sm sm:text-base" style={{ fontFamily: PEN }}>
                文档库
              </span>
            </RoughBox>
          </FlowItem>
          <FlowArrow seed={62} />
          <FlowItem label="切块">
            <RoughBox width={92} height={42} seed={63} fillColor="#dbeafe">
              <span className="text-sm sm:text-base" style={{ fontFamily: PEN }}>
                chunks
              </span>
            </RoughBox>
          </FlowItem>
          <FlowArrow seed={64} />
          <FlowItem label="算 embedding">
            <RoughBox width={92} height={42} seed={65} fillColor="#fce7f3">
              <span className="text-sm sm:text-base" style={{ fontFamily: PEN }}>
                向量
              </span>
            </RoughBox>
          </FlowItem>
          <FlowArrow seed={66} />
          <FlowItem label="向量库">
            <RoughBox width={100} height={42} seed={67} fillColor="#d1fae5">
              <span className="text-sm sm:text-base" style={{ fontFamily: PEN }}>
                Vector DB
              </span>
            </RoughBox>
          </FlowItem>
        </section>

        <p className="pt-4"><strong>🔍 在线问答（每次请求）</strong></p>
        <section className="my-3 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-3">
          <FlowItem label="用户问题">
            <RoughBox width={88} height={42} seed={71} fillColor="#fef9c3">
              <span className="text-sm sm:text-base" style={{ fontFamily: PEN }}>
                query
              </span>
            </RoughBox>
          </FlowItem>
          <FlowArrow seed={72} />
          <FlowItem label="查相似 chunks">
            <RoughBox width={100} height={42} seed={73} fillColor="#dbeafe">
              <span className="text-sm sm:text-base" style={{ fontFamily: PEN }}>
                top-k
              </span>
            </RoughBox>
          </FlowItem>
          <FlowArrow seed={74} />
          <FlowItem label="塞 prompt">
            <RoughBox width={100} height={42} seed={75} fillColor="#ede9fe">
              <span className="text-sm sm:text-base" style={{ fontFamily: PEN }}>
                Q + 资料
              </span>
            </RoughBox>
          </FlowItem>
          <FlowArrow seed={76} />
          <FlowItem label="生成回答">
            <div className="text-3xl sm:text-4xl">🧠</div>
          </FlowItem>
        </section>
      </Section>

      <Section title="二、为什么不直接塞长上下文？" underlineWidth={290}>
        <p>"既然有 1M context， 把整个知识库塞进去不就行了？"</p>
        <p>不行， 三个原因：</p>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>知识库远大于 1M</strong> —— 公司 wiki、 产品文档、 内部知识，
            动辄百万级 chunk， 一个 context 装不下
          </li>
          <li>
            <strong>每次都重塞太贵</strong> —— 1M token × $3/M × 每天 10 万次 = $30 万/天
            （详见 [Context Window]）
          </li>
          <li>
            <strong>Lost in the middle</strong> —— 即使塞了 1M， 中段信息召回也低
          </li>
        </ul>
        <p className="pt-2">
          RAG 的核心收益：<strong style={{ color: INK_GREEN }}>把相关的几 k token 喂给模型， 其他百万 token 都不参与计算</strong>。 成本、 准确率双赢。
        </p>
      </Section>

      <Section title="三、关键组件" underlineWidth={170}>
        <p><strong>1. Chunking（切块）</strong></p>
        <p>
          长文档切成可检索的小段。 大小常见 200~1000 token， 带 overlap 防止跨边界丢信息。
          详见 [Chunking]。
        </p>

        <p className="pt-3"><strong>2. Embedding 模型</strong></p>
        <p>
          把 chunk 和 query 都映射成向量， 详见 [Embedding]。 选用商业 (OpenAI text-embedding-3 / Voyage)
          或开源 (BGE / GTE) 都可以， 关键是 query 和 doc 用<strong>同一个模型</strong>。
        </p>

        <p className="pt-3"><strong>3. Vector DB</strong></p>
        <p>
          存向量 + 元数据， 支持快速近似最近邻 (ANN) 查询。 主流：
          Pinecone、 Weaviate、 Milvus、 Qdrant、 pgvector、 Chroma。 详见 [Vector DB]。
        </p>

        <p className="pt-3"><strong>4. Retriever（检索器）</strong></p>
        <p>
          单纯靠 embedding 相似度叫 <Term en="dense retrieval" ch="稠密检索" />。 实战常 hybrid：
          embedding + BM25（关键词匹配）一起用， 加权融合。
        </p>

        <p className="pt-3"><strong>5. Reranker（重排器）</strong></p>
        <p>
          召回 top-100 后， 用更精的 cross-encoder 模型给每对 (query, chunk) 打分， 取前 top-5 进 prompt。
          Cohere Rerank、 Voyage rerank-2 是常用。 详见 [Rerank]。
        </p>

        <p className="pt-3"><strong>6. Generator（生成器）</strong></p>
        <p>大模型， 接收 query + 检索到的 chunks， 生成回答。 这步就是普通 LLM 调用。</p>
      </Section>

      <Section title="四、Prompt 长什么样" underlineWidth={170}>
        <p>
          RAG 的 prompt 结构通常是 ——
        </p>
        <div
          className="mt-2 p-3 sm:p-4 rounded-sm space-y-2 text-sm sm:text-base"
          style={{ backgroundColor: 'rgba(255,255,255,0.6)', fontFamily: PEN, color: INK }}
        >
          <p><strong>system</strong>： 你是 XX 助手。 只用下方"参考资料"里的信息回答， 如不在资料中请说"我不确定"。</p>
          <p><strong>参考资料</strong>： [chunk 1] [chunk 2] [chunk 3] ...</p>
          <p><strong>用户问题</strong>： query</p>
        </div>
        <p className="pt-2 text-sm sm:text-base text-stone-500">
          关键：明确告诉模型"只用提供的资料"， 引导它不要瞎编。 这能显著降低幻觉。
        </p>
      </Section>

      <Section title="五、常见的坑" underlineWidth={170}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>切块太碎</strong> —— 一个完整概念被切成两段， 检索找不全
          </li>
          <li>
            <strong>切块太大</strong> —— 单个 chunk 信息密度低， 嵌入向量含义模糊
          </li>
          <li>
            <strong>语义相似 ≠ 答案相关</strong> —— "什么是 X" 和 "X 的缺点" 语义相似， 但回答方向不同。 需要 rerank
          </li>
          <li>
            <strong>多跳问题</strong> —— "A 公司的 CEO 是谁？他多大年纪？" 一次检索只能拿到 CEO 名字， 需要多步检索
          </li>
          <li>
            <strong>embedding 漂移</strong> —— 升级 embedding 模型后， 老向量库需要全部重新嵌入
          </li>
          <li>
            <strong>知识更新</strong> —— 文档变了， 索引需要重建或增量更新
          </li>
          <li>
            <strong>没引用</strong> —— 用户看不到答案出处， 无法验证
          </li>
        </ul>
      </Section>

      <Section title="六、评估指标" underlineWidth={170}>
        <p>评估 RAG 系统， 至少看 4 个维度：</p>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>Retrieval recall / precision</strong> —— 检索到的 chunks 里有多少是真相关的
          </li>
          <li>
            <Term en="Groundedness" ch="可对应性" /> —— 答案的每个陈述是否都能在 chunks 里找到依据
          </li>
          <li>
            <Term en="Answer relevance" ch="答案相关性" /> —— 答案是否切题
          </li>
          <li>
            <Term en="Context utilization" ch="上下文利用率" /> —— 模型有没有"看见"塞进去的资料
          </li>
        </ul>
        <p className="pt-2 text-sm sm:text-base text-stone-500">
          工具：RAGAS、 TruLens、 Anthropic 的 evals 等。
        </p>
      </Section>

      <Section title="七、进阶版本" underlineWidth={170}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>Hybrid search</strong> —— dense + BM25 融合， 兼顾语义和关键词
          </li>
          <li>
            <strong>Query rewriting</strong> —— 先让 LLM 改写 query 再检索（如把口语化问题转成更检索友好的形式）
          </li>
          <li>
            <strong>Multi-query</strong> —— 一个 query 拆成多个子查询并行检索
          </li>
          <li>
            <strong>Agentic RAG</strong> —— 模型自己决定要不要检索、 检索多少次、 用哪个工具
          </li>
          <li>
            <strong>GraphRAG</strong> —— 把文档拆成实体 + 关系的图， 用图遍历召回（微软 2024 提出 <sup>[2]</sup>）
          </li>
        </ul>
      </Section>

      <Section title="八、术语小辞典" underlineWidth={200} color={INK_SEPIA}>
        <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg pl-0 list-none">
          <li><Term en="RAG" ch="检索增强生成" /></li>
          <li><Term en="Chunking" ch="切块" /></li>
          <li><Term en="Retriever" ipa="/rɪˈtriːvər/" ch="检索器" /></li>
          <li><Term en="Reranker" ch="重排器" /></li>
          <li><Term en="Dense retrieval" ch="基于 embedding 的检索" /></li>
          <li><Term en="BM25" ch="基于词频的经典关键词检索算法" /></li>
          <li><Term en="ANN" ch="Approximate Nearest Neighbor， 近似最近邻搜索" /></li>
          <li><Term en="Groundedness" ch="可对应性， 关键的 RAG 评估指标" /></li>
        </ul>
      </Section>

      <section className="mt-10 sm:mt-12">
        <FluidRoughBox height={130} seed={91} color={INK_RED}>
          <div
            className="text-base sm:text-xl leading-relaxed text-center px-2"
            style={{ fontFamily: HAND }}
          >
            <p className="text-sm text-stone-500 mb-1">★ 一句话总结</p>
            <p>RAG = "开卷答题"，</p>
            <p>把"模型回忆"换成"先查再答"， 现代 AI 产品的事实地基。</p>
          </div>
        </FluidRoughBox>
      </section>

      <Section title="参考来源 References" underlineWidth={260} color={INK_SEPIA}>
        <ol
          className="space-y-2 sm:space-y-3 text-sm sm:text-base pl-5 list-decimal"
          style={{ fontFamily: PEN }}
        >
          <li>
            Lewis, P. et al. (2020).{' '}
            <em>Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks</em>. NeurIPS 2020.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2005.11401"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2005.11401
            </a>
            （RAG 概念原始论文）
          </li>
          <li>
            Edge, D. et al. (2024).{' '}
            <em>From Local to Global: A Graph RAG Approach to Query-Focused Summarization</em>. arXiv 2404.16130.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2404.16130"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2404.16130
            </a>
            （微软 GraphRAG）
          </li>
          <li>
            Gao, Y. et al. (2023).{' '}
            <em>Retrieval-Augmented Generation for Large Language Models: A Survey</em>. arXiv 2312.10997.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/2312.10997"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/2312.10997
            </a>
          </li>
        </ol>
      </Section>

      <Changelog created={meta.date} entries={meta.changelog} />
    </Paper>
  );
}
