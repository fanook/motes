import { INK, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'vector-db',
  index: 5,
  total: 8,
  title: '主流产品',
};

const PRODUCTS: { name: string; type: string; note: string }[] = [
  { name: 'Pinecone', type: 'SaaS', note: '最早商业化 ， 托管省心' },
  { name: 'Weaviate', type: '开源+云', note: '模块化 ， 支持混合搜索' },
  { name: 'Milvus / Zilliz', type: '开源+云', note: '主打超大规模 ， 国产生态强' },
  { name: 'Qdrant', type: '开源+云', note: 'Rust 实现 ， 性能+内存好' },
  { name: 'pgvector', type: 'PG 扩展', note: '有 Postgres 就不用加新组件' },
  { name: 'Chroma', type: '开源', note: '本地原型最方便 ， 几行起步' },
  { name: 'FAISS', type: '算法库', note: 'Meta 出品 ， 底层库非数据库' },
];

export default function Card5() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 80px 0 80px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <CardSectionHeading>主流产品 (2026)</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          {PRODUCTS.map((p, i) => (
            <div
              key={p.name}
              style={{
                display: 'flex',
                gap: 16,
                alignItems: 'center',
                background: ['#fef3c7', '#dbeafe', '#fce7f3', '#d1fae5', '#ede9fe', '#ffedd5', '#f3e8ff'][i % 7],
                border: '3px solid ' + INK,
                borderRadius: 12,
                padding: '13px 22px',
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 30, color: INK_SEPIA, fontWeight: 700, minWidth: 230 }}>
                {p.name}
              </div>
              <div style={{ fontFamily: PEN, fontSize: 24, color: INK }}>{p.note}</div>
            </div>
          ))}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
