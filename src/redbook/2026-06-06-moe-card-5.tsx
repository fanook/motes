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
  slug: 'moe',
  index: 5,
  total: 8,
  title: 'router 怎么训',
};

export default function Card5() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <CardSectionHeading>router 怎么训</CardSectionHeading>
        <CardText size={38}>
          router 是个小线性层 + softmax。 训练时要平衡两个矛盾：
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
            专家专门化
          </div>
          <div style={{ fontFamily: PEN, fontSize: 29, color: INK }}>把相似 token 路由给同一专家</div>
        </div>

        <div
          style={{
            background: '#fce7f3',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '24px 30px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 34, color: INK_SEPIA, fontWeight: 700, marginBottom: 6 }}>
            负载均衡
          </div>
          <div style={{ fontFamily: PEN, fontSize: 29, color: INK }}>
            所有专家都要被用到 ， 不能几个忙死、 其他闲死
          </div>
        </div>

        <CardText size={34}>
          通常加一个 <span style={{ color: INK_RED, fontWeight: 700 }}>负载均衡 loss</span> ，
          鼓励每个专家被均匀使用。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
