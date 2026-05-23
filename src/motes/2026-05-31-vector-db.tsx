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
  title: 'Vector DB 向量数据库',
  date: '2026-05-31',
  tags: ['AI 入门', 'RAG', '基础设施'],
  summary: '在百万、 上亿向量里"找最像的几个"靠什么算法。 HNSW / IVF / PQ， 主流产品对比。',
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
          Vector DB
        </h1>
        <div className="mt-1">
          <RoughUnderline width={170} seed={11} />
        </div>
        <p
          className="mt-2 sm:mt-3 text-lg sm:text-2xl"
          style={{ fontFamily: HAND, color: INK }}
        >
          —— 向量数据库
        </p>
      </header>

      <div
        className="text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-2.5"
        style={{ fontFamily: PEN }}
      >
        <p>
          RAG 需要在百万、 千万、 上亿向量里
          <strong style={{ color: INK_SEPIA }}>快速找到跟 query 最像的几个</strong>。
        </p>
        <p>
          穷举（每个都算余弦相似度）行不行？ 行， 但 100 万向量 × 1536 维度 ×
          每次几百毫秒延迟 —— 生产环境直接死。
        </p>
        <p className="pt-2">
          所以才有了 Vector DB 这个品类： 用近似算法换速度。
        </p>
      </div>

      <Section title="一、它解决的核心问题：ANN" underlineWidth={260}>
        <p>
          <Term en="ANN" ch="Approximate Nearest Neighbor， 近似最近邻搜索" />
        </p>
        <p>
          关键词是<strong>近似</strong>。 不保证返回真·最近的那个，
          只保证<strong style={{ color: INK_SEPIA}}>大概率返回前 k 个中的大多数</strong>。
          用<strong>召回率</strong>（recall@k）来衡量精度。
        </p>
        <p className="pt-2">
          换来的好处：把 <strong>O(n)</strong> 的查询降到 <strong>O(log n)</strong> 级别。 百万向量也能毫秒级返回。
        </p>
      </Section>

      <Section title="二、三种主流索引算法" underlineWidth={230}>
        <p><strong>1. HNSW（最主流）</strong></p>
        <p>
          <Term en="HNSW" ch="Hierarchical Navigable Small World， 分层可导航小世界图" />
          —— Malkov & Yashunin 2016/2018 提出 <sup>[1]</sup>。
        </p>
        <p>
          直觉：把所有向量组成一张"图"， 相邻的连边。 再分多层：上层稀疏（用来快速跨越长距离），
          下层密集（用来精确定位）。 查询时从上层入口出发， "贪心"地往最近的邻居走， 逐层下降。
        </p>
        <p className="pt-1">
          <strong style={{ color: INK_SEPIA}}>优点：召回率高、 延迟低</strong>。 内存占用高。
        </p>

        <p className="pt-3"><strong>2. IVF（Inverted File）</strong></p>
        <p>
          先对向量空间做<strong>聚类</strong>（k-means， 比如分 1000 个簇）， 每个向量挂在最近的簇中心下。
          查询时先找最近的几个簇， 只在这些簇里穷举。
        </p>
        <p>
          <strong>优点：内存友好</strong>。 缺点：召回率略低， 需要平衡探针数（nprobe）。
        </p>

        <p className="pt-3"><strong>3. PQ（Product Quantization）</strong></p>
        <p>
          <Term en="PQ" ch="乘积量化" /> —— 把高维向量切成多段， 每段用 8-bit 编码（256 个聚类中心代替原始 float）。
          1536 维 × float32 = 6KB； PQ 之后可能 24~64 字节。
        </p>
        <p>
          <strong>用途</strong>：超大规模 (10 亿+) 时压缩内存。 常和 IVF / HNSW 组合用 (IVF-PQ， HNSW-PQ)。
        </p>
      </Section>

      <Section title="三、距离度量" underlineWidth={140}>
        <p>查询时怎么算"相似"， 跟 embedding 那篇说过：</p>
        <ul className="pl-5 list-disc space-y-1 text-base sm:text-lg">
          <li><strong>Cosine</strong> —— 大多数 embedding 模型默认</li>
          <li><strong>Dot product</strong> —— 归一化向量上 = cosine， 计算更快</li>
          <li><strong>Euclidean (L2)</strong> —— 几何距离</li>
        </ul>
        <p className="pt-2 text-sm sm:text-base text-stone-500">
          每个 Vector DB 都得指定建索引时用哪种度量。 建错了召回率会很低。
        </p>
      </Section>

      <Section title="四、主流产品对比（2026-05）" underlineWidth={300}>
        <div className="mt-2 overflow-x-auto">
          <table
            className="text-sm sm:text-base w-full"
            style={{ fontFamily: PEN, borderCollapse: 'collapse' }}
          >
            <thead>
              <tr style={{ color: INK_SEPIA }}>
                <th className="text-left p-2 border-b-2 border-dashed border-stone-400">产品</th>
                <th className="text-left p-2 border-b-2 border-dashed border-stone-400">类型</th>
                <th className="text-left p-2 border-b-2 border-dashed border-stone-400">特点</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border-b border-dashed border-stone-300"><strong>Pinecone</strong></td>
                <td className="p-2 border-b border-dashed border-stone-300">SaaS</td>
                <td className="p-2 border-b border-dashed border-stone-300">最早商业化， 托管省心， 按使用付费</td>
              </tr>
              <tr>
                <td className="p-2 border-b border-dashed border-stone-300"><strong>Weaviate</strong></td>
                <td className="p-2 border-b border-dashed border-stone-300">开源 + 云</td>
                <td className="p-2 border-b border-dashed border-stone-300">自带模块化能力（embedding、 generative）， 支持混合搜索</td>
              </tr>
              <tr>
                <td className="p-2 border-b border-dashed border-stone-300"><strong>Milvus / Zilliz</strong></td>
                <td className="p-2 border-b border-dashed border-stone-300">开源 + 云</td>
                <td className="p-2 border-b border-dashed border-stone-300">主打超大规模， 国产生态强</td>
              </tr>
              <tr>
                <td className="p-2 border-b border-dashed border-stone-300"><strong>Qdrant</strong></td>
                <td className="p-2 border-b border-dashed border-stone-300">开源 + 云</td>
                <td className="p-2 border-b border-dashed border-stone-300">Rust 实现， 性能 + 内存效率好</td>
              </tr>
              <tr>
                <td className="p-2 border-b border-dashed border-stone-300"><strong>pgvector</strong></td>
                <td className="p-2 border-b border-dashed border-stone-300">PostgreSQL 扩展</td>
                <td className="p-2 border-b border-dashed border-stone-300">已有 Postgres？ 不用再加新组件， 几 MB 向量库的 RAG 直接用</td>
              </tr>
              <tr>
                <td className="p-2 border-b border-dashed border-stone-300"><strong>Chroma</strong></td>
                <td className="p-2 border-b border-dashed border-stone-300">开源</td>
                <td className="p-2 border-b border-dashed border-stone-300">本地开发原型最方便， 几行代码起步</td>
              </tr>
              <tr>
                <td className="p-2 border-b border-dashed border-stone-300"><strong>Elasticsearch / OpenSearch</strong></td>
                <td className="p-2 border-b border-dashed border-stone-300">搜索引擎</td>
                <td className="p-2 border-b border-dashed border-stone-300">本来就有 → 加 HNSW 索引就能搞混合搜索</td>
              </tr>
              <tr>
                <td className="p-2 border-b border-dashed border-stone-300"><strong>FAISS</strong></td>
                <td className="p-2 border-b border-dashed border-stone-300">库</td>
                <td className="p-2 border-b border-dashed border-stone-300">Meta 出品， 不是数据库， 是底层算法库， 自己拼存储</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="五、选型决策树" underlineWidth={170}>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>原型 / 个人项目</strong> → Chroma 或 pgvector
          </li>
          <li>
            <strong>已有 Postgres + 不大（&lt; 几百万向量）</strong> → pgvector
          </li>
          <li>
            <strong>团队不想运维</strong> → Pinecone / Zilliz Cloud / Weaviate Cloud
          </li>
          <li>
            <strong>已有 Elasticsearch</strong> → 直接加向量字段， 不另起炉灶
          </li>
          <li>
            <strong>超大规模 (亿+) / 极致性能</strong> → Milvus 或 Qdrant
          </li>
        </ul>
      </Section>

      <Section title="六、关键能力清单" underlineWidth={170}>
        <p>挑 Vector DB 时除了算法， 还要看：</p>
        <ul className="pl-5 list-disc space-y-2 text-base sm:text-lg">
          <li>
            <strong>过滤（metadata filtering）</strong> ——
            "在 2024 年之后的、 类型为 spec 的文档里检索" —— 元数据过滤 + 向量召回联合
          </li>
          <li>
            <strong>混合检索（hybrid search）</strong> —— 同时跑 BM25 + 向量， 加权融合
          </li>
          <li>
            <strong>增量更新</strong> —— 新文档来了能 insert， 不需要全量重建
          </li>
          <li>
            <strong>持久化</strong> —— 服务挂了向量还在
          </li>
          <li>
            <strong>多租户</strong> —— 不同客户的数据隔离
          </li>
          <li>
            <strong>分布式</strong> —— 单机存不下时能水平扩展
          </li>
        </ul>
      </Section>

      <Section title="七、术语小辞典" underlineWidth={200} color={INK_SEPIA}>
        <ul className="space-y-2 sm:space-y-3 text-base sm:text-lg pl-0 list-none">
          <li><Term en="ANN" ch="Approximate Nearest Neighbor， 近似最近邻" /></li>
          <li><Term en="HNSW" ch="分层可导航小世界图， 现代主流索引" /></li>
          <li><Term en="IVF" ch="Inverted File， 倒排聚类索引" /></li>
          <li><Term en="PQ" ch="Product Quantization， 乘积量化压缩" /></li>
          <li><Term en="Recall@k" ch="召回率， 返回前 k 个中包含多少真·最近邻" /></li>
          <li><Term en="Hybrid search" ch="混合检索， 向量 + 关键词" /></li>
          <li><Term en="Metadata filtering" ch="元数据过滤" /></li>
        </ul>
      </Section>

      <section className="mt-10 sm:mt-12">
        <FluidRoughBox height={130} seed={91} color={INK_RED}>
          <div
            className="text-base sm:text-xl leading-relaxed text-center px-2"
            style={{ fontFamily: HAND }}
          >
            <p className="text-sm text-stone-500 mb-1">★ 一句话总结</p>
            <p>Vector DB = ANN 算法 + 持久化 + 过滤 + 运维。</p>
            <p>原型用 pgvector， 规模上来再考虑专业产品。</p>
          </div>
        </FluidRoughBox>
      </section>

      <Section title="参考来源 References" underlineWidth={260} color={INK_SEPIA}>
        <ol
          className="space-y-2 sm:space-y-3 text-sm sm:text-base pl-5 list-decimal"
          style={{ fontFamily: PEN }}
        >
          <li>
            Malkov, Y. A., Yashunin, D. A. (2018).{' '}
            <em>Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs</em>. IEEE TPAMI.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://arxiv.org/abs/1603.09320"
              target="_blank"
              rel="noreferrer"
            >
              arxiv.org/abs/1603.09320
            </a>
            （HNSW 原论文）
          </li>
          <li>
            Jégou, H., Douze, M., Schmid, C. (2011).{' '}
            <em>Product Quantization for Nearest Neighbor Search</em>. IEEE TPAMI.
            （PQ 原论文）
          </li>
          <li>
            FAISS library by Facebook AI Research.{' '}
            <a
              className="underline break-all"
              style={{ color: INK_SEPIA }}
              href="https://github.com/facebookresearch/faiss"
              target="_blank"
              rel="noreferrer"
            >
              github.com/facebookresearch/faiss
            </a>
            （ANN 算法库参考实现）
          </li>
        </ol>
      </Section>

      <Changelog created={meta.date} entries={meta.changelog} />
    </Paper>
  );
}
