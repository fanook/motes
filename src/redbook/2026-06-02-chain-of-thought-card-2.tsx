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
  slug: 'chain-of-thought',
  index: 2,
  total: 8,
  title: '为什么管用',
};

export default function Card2() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <CardSectionHeading>为什么管用</CardSectionHeading>
        <CardText size={38}>
          模型每次只预测一个 token ， 没有"先在脑子里想清楚再开口"的机制。
          直接答 → 容易错。 让它先写中间步骤 ——
        </CardText>

        <div
          style={{
            background: '#fef3c7',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '26px 32px',
            fontFamily: PEN,
            fontSize: 34,
            color: INK,
            lineHeight: 1.6,
          }}
        >
          原来有 5 个。
          <br />
          买了 2 罐 × 3 个 = 6 个。
          <br />
          总共 5 + 6 = 11 个。
          <br />
          答案：<b style={{ color: INK_GREEN }}>11</b>
        </div>

        <CardText size={38}>
          每一步都是模型能<span style={{ color: INK_SEPIA, fontWeight: 700 }}>局部正确</span>
          推理的小步骤。 把一次性复杂计算 ， 拆成多个简单步 ， 让模型有更多 token 思考。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
