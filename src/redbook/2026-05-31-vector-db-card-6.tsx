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
  index: 6,
  total: 8,
  title: '选型决策树',
};

const ROWS: { cond: string; pick: string; color: string }[] = [
  { cond: '原型 / 个人项目', pick: 'Chroma 或 pgvector', color: '#d1fae5' },
  { cond: '已有 Postgres + 不大（<几百万）', pick: 'pgvector', color: '#dbeafe' },
  { cond: '团队不想运维', pick: 'Pinecone / Zilliz / Weaviate Cloud', color: '#fce7f3' },
  { cond: '已有 Elasticsearch', pick: '直接加向量字段', color: '#ede9fe' },
  { cond: '超大规模（亿+）/ 极致性能', pick: 'Milvus 或 Qdrant', color: '#ffedd5' },
];

export default function Card6() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 80px 0 80px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <CardSectionHeading>选型决策树</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {ROWS.map((r) => (
            <div
              key={r.cond}
              style={{
                background: r.color,
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '20px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 30, color: INK }}>{r.cond}</div>
              <div style={{ fontFamily: PEN, fontSize: 32, color: INK_SEPIA, fontWeight: 700 }}>
                → {r.pick}
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
