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
  title: 'Rerank 重排',
  date: '2026-06-08',
  tags: ['AI 入门', 'RAG'],
  summary: '为什么 embedding 召回 + rerank 是 RAG 的黄金组合。 cross-encoder 原理与主流模型。',
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
          Rerank
        </h1>
        <div className="mt-1">
          <RoughUnderline width={170} seed={11} />
        </div>
        <p
          className="mt-2 sm:mt-3 text-lg sm:text-2xl"
          style={{ fontFamily: HAND, color: INK }}
        >
          —— 重排， 给 RAG 加一层"精排"
        </p>
      </header>

      <div
        className="text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-2.5"
        style={{ fontFamily: PEN }}
      >
        <p>
          RAG 用 embedding 检索 top-k 文档（详见 [RAG]、 [Embedding]）。 但 embedding 召回有个问题 ——
        </p>
        <p>
          query 和 doc 是<strong style={{ color: INK_RED }}>独立编码</strong>的（叫
          <Term en="bi-encoder" ch="双塔编码器" />）。 各自压缩成 1 个向量， 然后算余弦。
          快， 但容易"看起来很像， 其实答非所问"。
        </p>
        <p className="pt-2">
          Rerank 就是在召回完之后， 加一层<strong style={{ color: INK_SEPIA }}>更精的打分</strong>，
          把真正相关的提到前面。
        </p>
      </div>

      <Section title="一、bi-encoder vs cross-encoder" underlineWidth={300}>
        <p>
          <strong>Bi-encoder（embedding 召回用的）：</strong>
        </p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>query 单独算 embedding， doc 单独算 embedding</li>
          <li>用余弦相似度比对</li>
          <li>doc embedding 可以<strong>提前算好</strong>， 在线只算 query → 毫秒级返回</li>
          <li>缺点：query 和 doc 没"对话"过， 细节交互丢失</li>
        </ul>

        <p className="pt-3">
          <strong>Cross-encoder（rerank 用的）：</strong>
        </p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>query 和 doc 拼一起塞进模型， 一次前向输出一个相关性分数</li>
          <li>query 的每个 token 跟 doc 的每个 token 在 attention 里直接交互</li>
          <li>精度<strong style={{ color: INK_SEPIA}}>显著高</strong>， 但
            <strong>每次都要在线算， 慢</strong> —— 不可能对几亿 doc 都算
          </li>
        </ul>

        <p className="pt-3">
          所以工程上：<strong style={{ color: INK_RED }}>bi-encoder 召回粗排， cross-encoder 重排精排</strong>。
          先用 embedding 召回 top-100， 再用 reranker 算 100 对相关性， 取真正最相关的 top-5 喂给 LLM。
        </p>
      </Section>

      <Section title="二、典型 RAG with rerank 流程" underlineWidth={310}>
        <div
          className="mt-2 p-3 rounded-sm text-sm sm:text-base"
          style={{ backgroundColor: 'rgba(255,255,255,0.6)', fontFamily: PEN, color: INK }}
        >
          <pre className="whitespace-pre">{`query
  ↓
embed(query) → 向量
  ↓
Vector DB 检索 top-100 chunks  ← 召回（recall 高、 噪声多）
  ↓
对每个 (query, chunk) 跑 cross-encoder
  ↓
按 cross-encoder 分数排序， 取 top-5  ← 重排（精度高）
  ↓
塞进 LLM prompt， 生成回答`}</pre>
        </div>
      </Section>

      <Section title="三、主流 Reranker（2026-05）" underlineWidth={280}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>Cohere Rerank 3</strong> —— 商业 API， 多语言强， 长上下文友好。 几乎是行业默认
          </li>
          <li>
            <strong>Voyage rerank-2 / rerank-lite</strong> —— Anthropic 推荐合作伙伴， 性能接近 Cohere
          </li>
          <li>
            <strong>BGE-Reranker（v2-m3 等）</strong> —— 智源出品， 开源， 中文好
          </li>
          <li>
            <strong>Jina Reranker</strong> —— 开源 + 商业， 轻量
          </li>
          <li>
            <strong>LLM as reranker</strong> —— 让一个小 LLM 给 (query, chunk) 打 0~10 分。 灵活但贵
          </li>
        </ul>
      </Section>

      <Section title="四、效果有多大？" underlineWidth={170}>
        <p>
          经验值（不同语料差异大， 仅供参考）：
        </p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li>纯 embedding 召回 → 召回率 60~80%， 精度 30~50%</li>
          <li>加 rerank → 精度提到 70~90%</li>
          <li>最终 RAG 回答正确率：通常提升 10~20 个百分点</li>
        </ul>
        <p className="pt-2 text-sm sm:text-base text-stone-500">
          Cohere、 Anthropic 都在他们的 Contextual Retrieval 报告里强调过 rerank 的提升幅度
          <sup>[1]</sup>。
        </p>
      </Section>

      <Section title="五、成本权衡" underlineWidth={170}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>每次查询多一次 API 调用</strong> —— 多几十到几百毫秒延迟
          </li>
          <li>
            <strong>按 (query, doc) 对计费</strong> —— 召回 100 个 doc 就要算 100 次， 费用线性涨
          </li>
          <li>
            <strong>但塞给 LLM 的 chunk 变少</strong> —— 这部分省 token， 互相抵消一些
          </li>
        </ul>
        <p className="pt-2">
          实战策略：召回 top-50~100， rerank 后只取 top-3~5 进 prompt。 平衡精度和成本。
        </p>
      </Section>

      <Section title="六、术语小辞典" underlineWidth={200} color={INK_SEPIA}>
        <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg pl-0 list-none">
          <li><Term en="Rerank" ipa="/riːˈræŋk/" ch="重排" /></li>
          <li><Term en="Bi-encoder" ch="双塔编码器， query 和 doc 独立编码" /></li>
          <li><Term en="Cross-encoder" ch="交叉编码器， query 和 doc 一起进模型" /></li>
          <li><Term en="Recall" ch="召回率， 相关的有多少被检索到" /></li>
          <li><Term en="Precision" ipa="/prɪˈsɪʒən/" ch="精度， 检索到的有多少是相关的" /></li>
          <li><Term en="MRR" ch="Mean Reciprocal Rank， 衡量排序质量" /></li>
          <li><Term en="nDCG" ch="Normalized DCG， 排序的标准评估指标" /></li>
        </ul>
      </Section>

      <section className="mt-10 sm:mt-12">
        <FluidRoughBox height={130} seed={91} color={INK_RED}>
          <div
            className="text-base sm:text-xl leading-relaxed text-center px-2"
            style={{ fontFamily: HAND }}
          >
            <p className="text-sm text-stone-500 mb-1">★ 一句话总结</p>
            <p>Bi-encoder 召回快 + Cross-encoder 精排准</p>
            <p>= 商用 RAG 的黄金组合。</p>
          </div>
        </FluidRoughBox>
      </section>

      <Section title="参考来源 References" underlineWidth={260} color={INK_SEPIA}>
        <ol
          className="space-y-2 sm:space-y-3 text-sm sm:text-base pl-5 list-decimal"
          style={{ fontFamily: PEN }}
        >
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
            （embedding + BM25 + rerank 组合的实测数据）
          </li>
          <li>
            Cohere. <em>Rerank</em> docs.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://docs.cohere.com/docs/rerank-overview"
              target="_blank"
              rel="noreferrer"
            >
              docs.cohere.com/docs/rerank-overview
            </a>
            （accessed 2026-06-08）
          </li>
          <li>
            Nogueira, R., Cho, K. (2020).{' '}
            <em>Passage Re-ranking with BERT</em>. arXiv 1901.04085.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/1901.04085"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/1901.04085
            </a>
            （cross-encoder rerank 的代表论文）
          </li>
        </ol>
      </Section>

      <Changelog created={meta.date} entries={meta.changelog} />
    </Paper>
  );
}
