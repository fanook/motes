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
  slug: 'contrastive-learning',
  index: 5,
  total: 8,
  title: '温度系数',
};

export default function Card5() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <CardSectionHeading>温度系数 τ 的影响</CardSectionHeading>

        <div
          style={{
            background: '#dbeafe',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '24px 30px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 36, color: INK_SEPIA, fontWeight: 700, marginBottom: 8 }}>
            τ 小（如 0.05）
          </div>
          <div style={{ fontFamily: PEN, fontSize: 29, color: INK, lineHeight: 1.5 }}>
            softmax 尖锐 ， 对 hard negative 敏感 ， 区分能力强
          </div>
        </div>

        <div
          style={{
            background: '#fce7f3',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '24px 30px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 36, color: INK_SEPIA, fontWeight: 700, marginBottom: 8 }}>
            τ 大（如 1）
          </div>
          <div style={{ fontFamily: PEN, fontSize: 29, color: INK, lineHeight: 1.5 }}>
            softmax 平坦 ， 梯度温和 ， 但区分细微差异能力变弱
          </div>
        </div>

        <div
          style={{
            background: '#fef3c7',
            border: '3px solid ' + INK,
            borderRadius: 14,
            padding: '22px 30px',
          }}
        >
          <CardText size={36}>
            实战常用 <span style={{ color: INK_SEPIA, fontWeight: 700 }}>τ = 0.05 ~ 0.1</span>。
          </CardText>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
