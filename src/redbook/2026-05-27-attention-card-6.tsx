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
  slug: 'attention',
  index: 6,
  total: 9,
  title: 'Self + Multi-Head',
};

export default function Card6() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <CardSectionHeading>自注意力 + 多头</CardSectionHeading>

        <div
          style={{
            background: '#d1fae5',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '22px 30px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 38, color: INK_SEPIA, fontWeight: 700, marginBottom: 8 }}>
            Self-Attention 自注意力
          </div>
          <div style={{ fontFamily: PEN, fontSize: 30, color: INK, lineHeight: 1.5 }}>
            Q / K / V 全从同一段输入来。 每个 token 既是"提问者"又是"被查的书"。
            <br />
            "苹果手机" 和 "苹果好吃" 里的苹果 ， 就是被它算出不一样的。
          </div>
        </div>

        <div
          style={{
            background: '#dbeafe',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '22px 30px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 38, color: INK_SEPIA, fontWeight: 700, marginBottom: 8 }}>
            Multi-Head 多头
          </div>
          <div style={{ fontFamily: PEN, fontSize: 30, color: INK, lineHeight: 1.5 }}>
            一组 Q/K/V 只能学一种关注模式。 原版用 8 个头 ， 各学不同偏好：
            有的学主谓宾 ， 有的学指代（it 指什么）， 有的学远距离依赖。
            <br />
            各头输出拼起来 ， 再过一层线性变换。
          </div>
        </div>

        <CardText size={30}>
          实战 head 数 8 ~ 128 都有。 大模型为省显存用 GQA —— 多个 query head 共享 key/value。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
