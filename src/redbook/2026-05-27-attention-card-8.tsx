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
  slug: 'attention',
  index: 8,
  total: 9,
  title: '为什么统治一切',
};

type Reason = { title: string; line: string };

const REASONS: Reason[] = [
  { title: '并行', line: 'attention 是矩阵乘法 ， GPU 极爽 ， 比 RNN 快很多' },
  { title: '距离无关', line: '句首到句尾一步连接 ， 没有 RNN 的衰减' },
  { title: '表达力强', line: '多头能学多种关注模式' },
  { title: '可堆叠', line: '多层叠起来就是 Transformer ， 越深拟合越复杂的语义' },
];

export default function Card8() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <CardSectionHeading>为什么它统治了一切</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {REASONS.map((r, i) => (
            <div
              key={r.title}
              style={{
                background: ['#fef3c7', '#dbeafe', '#fce7f3', '#d1fae5'][i],
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '20px 28px',
                display: 'flex',
                gap: 20,
                alignItems: 'baseline',
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 36, color: INK_SEPIA, fontWeight: 700, minWidth: 150 }}>
                {r.title}
              </div>
              <div style={{ fontFamily: PEN, fontSize: 29, color: INK, lineHeight: 1.4 }}>{r.line}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: '#d1fae5',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '22px 30px',
          }}
        >
          <CardText size={36}>
            一句话：<span style={{ color: INK_GREEN, fontWeight: 700 }}>每个 token 跟所有 token 直接对话</span>
            —— 这是 Transformer 取代 RNN 的关键。
          </CardText>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
