import { INK, INK_RED, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'attention',
  index: 5,
  total: 9,
  title: '公式',
};

const STEPS = [
  { k: 'Q · Kᵀ', v: 'query 和每个 key 算点积 ， 得到相似度矩阵' },
  { k: '/ √dₖ', v: '除以维度平方根 ， 防止数值太大、 梯度消失' },
  { k: 'softmax', v: '把相似度转成"加起来 = 1"的概率分布' },
  { k: '· V', v: '用这组权重对 value 加权求和 ， 得到输出' },
];

export default function Card5() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <CardSectionHeading>公式（看一眼就行）</CardSectionHeading>

        <div
          style={{
            background: '#fef3c7',
            border: '3px solid ' + INK,
            borderRadius: 18,
            padding: '34px 28px',
            textAlign: 'center',
            fontFamily: PEN,
            fontSize: 40,
            color: INK,
            lineHeight: 1.5,
          }}
        >
          Attention(Q,K,V) =
          <br />
          softmax( <b style={{ color: INK_RED }}>Q · Kᵀ</b> / √dₖ ) · V
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {STEPS.map((s, i) => (
            <div
              key={s.k}
              style={{
                display: 'flex',
                gap: 20,
                alignItems: 'center',
                background: '#dbeafe',
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '16px 26px',
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 34, color: INK_RED, fontWeight: 700, minWidth: 40 }}>
                {i + 1}
              </div>
              <div style={{ fontFamily: PEN, fontSize: 34, color: INK_SEPIA, fontWeight: 700, minWidth: 180 }}>
                {s.k}
              </div>
              <div style={{ fontFamily: PEN, fontSize: 28, color: INK, lineHeight: 1.35 }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
