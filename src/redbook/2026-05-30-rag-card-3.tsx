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
  index: 3,
  total: 9,
  title: '工作流程',
};

function FlowRow({ nodes }: { nodes: { label: string; color: string }[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'nowrap' }}>
      {nodes.map((n, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div
            style={{
              background: n.color,
              border: '3px solid ' + INK,
              borderRadius: 12,
              padding: '18px 14px',
              fontFamily: PEN,
              fontSize: 28,
              color: INK,
              fontWeight: 700,
              textAlign: 'center',
              minWidth: 110,
              whiteSpace: 'pre-line',
              lineHeight: 1.3,
            }}
          >
            {n.label}
          </div>
          {i < nodes.length - 1 && (
            <span style={{ fontFamily: PEN, fontSize: 34, color: INK_SEPIA }}>→</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Card3() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 70px 0 70px', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <CardSectionHeading>两条流水线</CardSectionHeading>

        <div>
          <div style={{ fontFamily: PEN, fontSize: 34, color: INK_SEPIA, fontWeight: 700, marginBottom: 16 }}>
            离线建索引（一次 ， 之后增量）
          </div>
          <FlowRow
            nodes={[
              { label: '文档库', color: '#fef3c7' },
              { label: '切块\nchunks', color: '#dbeafe' },
              { label: '算向量\nembedding', color: '#fce7f3' },
              { label: 'Vector DB', color: '#d1fae5' },
            ]}
          />
        </div>

        <div>
          <div style={{ fontFamily: PEN, fontSize: 34, color: INK_SEPIA, fontWeight: 700, marginBottom: 16 }}>
            在线问答（每次请求）
          </div>
          <FlowRow
            nodes={[
              { label: '用户问题\nquery', color: '#fef3c7' },
              { label: '查相似\ntop-k', color: '#dbeafe' },
              { label: 'Q + 资料\n塞 prompt', color: '#ede9fe' },
              { label: '生成回答', color: '#d1fae5' },
            ]}
          />
        </div>

        <div
          style={{
            background: '#fef3c7',
            border: '3px solid ' + INK,
            borderRadius: 14,
            padding: '20px 28px',
            fontFamily: PEN,
            fontSize: 32,
            color: INK,
            lineHeight: 1.5,
            marginTop: 10,
          }}
        >
          建索引时把全部文档变成向量存好 ， 提问时只捞出最相关的几段塞给模型。
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
