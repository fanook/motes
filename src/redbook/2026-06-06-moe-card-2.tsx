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
  slug: 'moe',
  index: 2,
  total: 8,
  title: 'dense vs MoE',
};

const FLOW = `token x
  ↓
router 给每个专家打分 → softmax
  ↓
挑出 top-k=2 个专家 (E1, E37)
  ↓
y = w1·E1(x) + w37·E37(x)`;

export default function Card2() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <CardSectionHeading>dense vs MoE</CardSectionHeading>
        <CardText size={34}>
          <b style={{ color: INK_SEPIA }}>Dense（传统）</b>：每层一个大 FFN ，
          每个 token 都要把所有参数过一遍。
        </CardText>
        <CardText size={34}>
          <b style={{ color: INK_SEPIA }}>MoE（稀疏）</b>：每层有 N 个"专家"小 FFN + 1 个 router。
          router 只给每个 token 挑 top-k 个专家算。
        </CardText>

        <div
          style={{
            background: '#fdf6e3',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '26px 32px',
            fontFamily: PEN,
            fontSize: 30,
            color: INK,
            whiteSpace: 'pre',
            lineHeight: 1.6,
          }}
        >
          {FLOW}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
