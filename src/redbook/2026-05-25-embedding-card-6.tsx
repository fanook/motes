import { INK, INK_GREEN, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  CardText,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'embedding',
  index: 6,
  total: 10,
  title: '距离怎么算',
};

type Metric = { en: string; ch: string; line: string; recommended?: boolean };

const METRICS: Metric[] = [
  { en: 'Cosine similarity', ch: '余弦相似度', line: '看两向量夹角 ， 范围 [-1,1]。 主流模型默认推荐', recommended: true },
  { en: 'Euclidean distance', ch: '欧氏距离', line: '几何直线距离。 向量没归一化时用' },
  { en: 'Dot product', ch: '点积', line: '归一化后 = cosine ， 计算最快' },
];

export default function Card6() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <CardSectionHeading>两个向量有多近</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {METRICS.map((m) => (
            <div
              key={m.en}
              style={{
                background: m.recommended ? '#d1fae5' : '#fef3c7',
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '22px 30px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 36, color: INK_SEPIA, fontWeight: 700 }}>
                {m.en} <span style={{ fontSize: 30, color: INK }}>{m.ch}</span>
                {m.recommended && (
                  <span style={{ fontSize: 26, color: INK_GREEN, marginLeft: 12 }}>← 最常用</span>
                )}
              </div>
              <div style={{ fontFamily: PEN, fontSize: 30, color: INK, lineHeight: 1.4 }}>{m.line}</div>
            </div>
          ))}
        </div>

        <CardText size={36}>
          实战：先看你用的模型推荐什么。 大多数情况是
          <span style={{ color: INK_SEPIA, fontWeight: 700 }}>余弦相似度</span>
          （向量已被 L2 归一化）。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
