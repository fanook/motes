import { INK, INK_GREEN, INK_RED, INK_SEPIA, PEN } from '../components/handwriting';
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
  index: 2,
  total: 8,
  title: '直觉',
};

export default function Card2() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <CardSectionHeading>核心直觉</CardSectionHeading>
        <CardText size={38}>
          要训 embedding ， 关键是定义"什么算相似"。 对比学习的做法 ——
        </CardText>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#fef3c7', border: '3px solid ' + INK, borderRadius: 14, padding: '18px 28px', fontFamily: PEN, fontSize: 32, color: INK }}>
            <b style={{ color: INK_SEPIA }}>锚点 anchor</b>：一个样本
          </div>
          <div style={{ background: '#d1fae5', border: '3px solid ' + INK, borderRadius: 14, padding: '18px 28px', fontFamily: PEN, fontSize: 32, color: INK }}>
            <b style={{ color: INK_GREEN }}>正样本 positive</b>：和锚点相似的
          </div>
          <div style={{ background: '#fee2e2', border: '3px solid ' + INK, borderRadius: 14, padding: '18px 28px', fontFamily: PEN, fontSize: 32, color: INK }}>
            <b style={{ color: INK_RED }}>负样本 negative</b>：和锚点不相似的
          </div>
        </div>

        <div
          style={{
            background: '#dbeafe',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '24px 30px',
            textAlign: 'center',
          }}
        >
          <CardText size={38}>
            训练目标：把 anchor 和 positive
            <span style={{ color: INK_GREEN, fontWeight: 700 }}>拉近</span> ，
            和 negative <span style={{ color: INK_RED, fontWeight: 700 }}>推远</span>。
          </CardText>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
