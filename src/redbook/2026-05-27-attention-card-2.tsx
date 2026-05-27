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
  slug: 'attention',
  index: 2,
  total: 9,
  title: '解决什么问题',
};

export default function Card2() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 36 }}>
        <CardSectionHeading>它解决什么问题</CardSectionHeading>
        <CardText size={40}>
          Attention 之前 ， 处理一句话主流靠 <b style={{ color: INK_SEPIA }}>RNN</b>：
          像人读字一样 ， 一个一个把 token 喂进去。 两个致命伤 ——
        </CardText>

        <div
          style={{
            background: '#fee2e2',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '26px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 40, color: INK }}>
            <b style={{ color: INK_RED }}>串行</b> ， 没法并行训练 → 很慢
          </div>
          <div style={{ fontFamily: PEN, fontSize: 40, color: INK }}>
            <b style={{ color: INK_RED }}>长距离衰减</b> ， 句首信息传到句尾多半丢了
          </div>
        </div>

        <div
          style={{
            background: '#d1fae5',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '26px 32px',
          }}
        >
          <CardText size={42}>
            Attention 一刀切：让每个 token 直接看见所有其他 token ，
            <span style={{ color: INK_SEPIA, fontWeight: 700 }}>距离 = 同等对待</span>。
          </CardText>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
