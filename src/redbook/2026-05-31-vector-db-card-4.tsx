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
  index: 4,
  total: 8,
  title: '距离度量',
};

const METRICS: { en: string; ch: string; color: string }[] = [
  { en: 'Cosine', ch: '余弦 ， 大多数 embedding 模型默认', color: '#d1fae5' },
  { en: 'Dot product', ch: '点积 ， 归一化后 = cosine ， 更快', color: '#dbeafe' },
  { en: 'Euclidean (L2)', ch: '欧氏 ， 几何直线距离', color: '#fce7f3' },
];

export default function Card4() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <CardSectionHeading>距离怎么算"相似"</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {METRICS.map((m) => (
            <div
              key={m.en}
              style={{
                background: m.color,
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '24px 30px',
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 38, color: INK_SEPIA, fontWeight: 700 }}>{m.en}</div>
              <div style={{ fontFamily: PEN, fontSize: 30, color: INK }}>{m.ch}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: '#fee2e2',
            border: '3px solid ' + INK,
            borderRadius: 14,
            padding: '22px 30px',
          }}
        >
          <CardText size={34}>
            每个 Vector DB 建索引时都要指定用哪种度量。
            <b> 建错了召回率会很低。</b>
          </CardText>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
