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
  slug: 'hallucination',
  index: 6,
  total: 9,
  title: '模型自己知道吗',
};

export default function Card6() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <CardSectionHeading>模型自己知道吗</CardSectionHeading>

        <div
          style={{
            background: '#fef3c7',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '28px 32px',
          }}
        >
          <CardText size={40}>
            有趣的是：模型瞎编时 ， 它内部
            <span style={{ color: INK_SEPIA, fontWeight: 700 }}>概率分布的熵往往更高</span>
            （没有一个明显胜出的词）。
          </CardText>
        </div>

        <div
          style={{
            background: '#fce7f3',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '24px 32px',
            textAlign: 'center',
          }}
        >
          <CardText size={44}>
            也就是说 —— <b>它"心里没底" ， 只是嘴上很硬。</b>
          </CardText>
        </div>

        <CardText size={38}>近年研究用模型自身的不确定度去检测幻觉：</CardText>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: PEN, fontSize: 32, color: INK }}>
          <div>· 多次采样看一致性（self-consistency）</div>
          <div>· token 概率监控</div>
          <div>· 让模型同时输出 confidence score</div>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
