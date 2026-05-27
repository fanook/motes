import { INK, INK_RED, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  CardText,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'sampling',
  index: 2,
  total: 9,
  title: 'Greedy',
};

export default function Card2() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 36 }}>
        <CardSectionHeading>最朴素：贪心解码</CardSectionHeading>
        <CardText size={42}>
          每一步直接取概率最高的那个 token —— 叫
          <span style={{ color: INK_SEPIA, fontWeight: 700 }}> Greedy decoding</span>。
          看着最合理 ， 但有几个问题：
        </CardText>

        <div
          style={{
            background: '#fee2e2',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '26px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            fontFamily: PEN,
            fontSize: 36,
            color: INK,
          }}
        >
          <div>· 同一个 prompt 永远生成同一段话 ， 单调</div>
          <div>· 容易陷入重复："I think I think I think…"</div>
          <div>· 局部最优 ≠ 全局最优 ， 错失更好的整体路径</div>
        </div>

        <CardText size={40}>
          所以实际生成基本都用 <b style={{ color: INK_RED }}>随机采样</b> ，
          但加上控制参数避免"乱"。 这就是 T / top-k / top-p 登场的地方。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
