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
  index: 4,
  total: 8,
  title: '为什么行得通',
};

export default function Card4() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <CardSectionHeading>为什么 MoE 行得通</CardSectionHeading>
        <CardText size={40}>
          直觉：不同领域的知识 ， 其实<b style={{ color: INK_SEPIA }}>不需要全部一起调用</b>。
        </CardText>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: PEN, fontSize: 34, color: INK }}>
          <div>· 处理"今天天气" → 数学专家休息</div>
          <div>· 处理"积分公式" → 闲聊专家休息</div>
          <div>· 处理代码 → 中文小说专家休息</div>
        </div>

        <div
          style={{
            background: '#fef3c7',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '26px 32px',
          }}
        >
          <CardText size={36}>
            router 学会"什么 token 该找谁" —— 让模型形成
            <span style={{ color: INK_SEPIA, fontWeight: 700 }}>领域专门化</span>。
            总容量增大 ， 但每次只用一小部分。
          </CardText>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
