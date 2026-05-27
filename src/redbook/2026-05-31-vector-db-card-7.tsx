import { INK, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  CardText,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'vector-db',
  index: 7,
  total: 8,
  title: '关键能力清单',
};

const CAPS: { title: string; line: string }[] = [
  { title: '元数据过滤', line: '"2024 年后、 类型=spec 的文档里检索"——过滤 + 向量召回联合' },
  { title: '混合检索', line: '同时跑 BM25 + 向量 ， 加权融合' },
  { title: '增量更新', line: '新文档来了能 insert ， 不用全量重建' },
  { title: '持久化', line: '服务挂了向量还在' },
  { title: '多租户', line: '不同客户的数据隔离' },
  { title: '分布式', line: '单机存不下时能水平扩展' },
];

export default function Card7() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <CardSectionHeading>除了算法 ， 还要看</CardSectionHeading>
        <CardText size={34}>选 Vector DB 时 ， 这些工程能力同样关键：</CardText>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          {CAPS.map((c) => (
            <div
              key={c.title}
              style={{
                background: '#fef3c7',
                border: '3px solid ' + INK,
                borderRadius: 13,
                padding: '15px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 31, color: INK_SEPIA, fontWeight: 700 }}>{c.title}</div>
              <div style={{ fontFamily: PEN, fontSize: 26, color: INK, lineHeight: 1.35 }}>{c.line}</div>
            </div>
          ))}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
