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
  slug: 'bert',
  index: 3,
  total: 8,
  title: 'BERT vs GPT',
};

export default function Card3() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <CardSectionHeading>和 GPT 的根本差异</CardSectionHeading>
        <CardText size={34}>
          Transformer 原版是 encoder-decoder ， 后来分化成两派：
        </CardText>

        <div
          style={{
            background: '#dbeafe',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '24px 30px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 34, color: INK_SEPIA, fontWeight: 700, marginBottom: 6 }}>
            GPT —— decoder-only
          </div>
          <div style={{ fontFamily: PEN, fontSize: 28, color: INK, lineHeight: 1.5 }}>
            加 causal mask ， 每个 token 只看自己之前。 目标：自回归生成。 适合写作 / 对话。
          </div>
        </div>

        <div
          style={{
            background: '#d1fae5',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '24px 30px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 34, color: INK_SEPIA, fontWeight: 700, marginBottom: 6 }}>
            BERT —— encoder-only
          </div>
          <div style={{ fontFamily: PEN, fontSize: 28, color: INK, lineHeight: 1.5 }}>
            不加 mask ， 每个 token 能看到整句前后所有 token（双向）。
            目标：理解 / 表征。 适合分类 / 抽取 / 检索。
          </div>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
