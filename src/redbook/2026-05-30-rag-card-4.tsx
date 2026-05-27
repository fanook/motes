import { INK, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'rag',
  index: 4,
  total: 9,
  title: '关键组件',
};

const PARTS: { n: string; title: string; line: string }[] = [
  { n: '1', title: 'Chunking 切块', line: '长文档切成小段 ， 常 200~1000 token ， 带 overlap' },
  { n: '2', title: 'Embedding', line: 'chunk 和 query 都变向量 ， query/doc 必须同一模型' },
  { n: '3', title: 'Vector DB', line: '存向量 + 元数据 ， 支持快速近似最近邻 (ANN)' },
  { n: '4', title: 'Retriever 检索器', line: '实战常 hybrid：embedding + BM25 关键词融合' },
  { n: '5', title: 'Reranker 重排', line: '召回 top-100 → cross-encoder 精排 → 取 top-5' },
  { n: '6', title: 'Generator 生成器', line: '大模型接收 query + chunks 生成回答' },
];

export default function Card4() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <CardSectionHeading>关键组件</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {PARTS.map((p) => (
            <div
              key={p.n}
              style={{
                display: 'flex',
                gap: 16,
                background: '#fef3c7',
                border: '3px solid ' + INK,
                borderRadius: 13,
                padding: '15px 24px',
                alignItems: 'baseline',
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 34, color: INK_SEPIA, fontWeight: 700, minWidth: 36 }}>
                {p.n}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ fontFamily: PEN, fontSize: 31, color: INK_SEPIA, fontWeight: 700 }}>{p.title}</div>
                <div style={{ fontFamily: PEN, fontSize: 26, color: INK, lineHeight: 1.35 }}>{p.line}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
