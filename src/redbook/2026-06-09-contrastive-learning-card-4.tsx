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
  index: 4,
  total: 8,
  title: 'InfoNCE',
};

const LOSS = `L = - log( exp(sim(a, pos) / τ)
          / Σ exp(sim(a, x) / τ) )

x ∈ {正样本} ∪ {负样本}`;

export default function Card4() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <CardSectionHeading>损失函数 InfoNCE</CardSectionHeading>
        <CardText size={36}>现代对比学习几乎都用 InfoNCE loss：</CardText>

        <div
          style={{
            background: '#fdf6e3',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '26px 30px',
            fontFamily: PEN,
            fontSize: 28,
            color: INK,
            whiteSpace: 'pre',
            lineHeight: 1.6,
          }}
        >
          {LOSS}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: PEN, fontSize: 28, color: INK }}>
          <div>· 分子：anchor 跟 positive 的相似度</div>
          <div>· 分母：anchor 跟所有候选的相似度之和</div>
          <div>· 本质 = <b style={{ color: INK_SEPIA }}>把 positive 当正确答案的分类损失</b></div>
          <div>· τ 控制 softmax 的尖锐程度</div>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
