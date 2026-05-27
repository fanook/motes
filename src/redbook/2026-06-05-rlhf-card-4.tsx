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
  slug: 'rlhf',
  index: 4,
  total: 7,
  title: '效果有多大',
};

export default function Card4() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <CardSectionHeading>效果有多大</CardSectionHeading>
        <CardText size={38}>InstructGPT 论文里的关键数字 ——</CardText>

        <div
          style={{
            background: '#d1fae5',
            border: '3px solid ' + INK,
            borderRadius: 18,
            padding: '36px 32px',
            textAlign: 'center',
            fontFamily: PEN,
            fontSize: 40,
            color: INK,
            lineHeight: 1.5,
          }}
        >
          RLHF 后的
          <br />
          <b style={{ color: INK_SEPIA }}>InstructGPT 1.3B</b>
          <br />
          人类评测比未对齐的
          <br />
          <b style={{ color: INK_RED }}>GPT-3 175B</b>（大 100 倍）
          <br />
          更受偏好
        </div>

        <CardText size={38}>
          对齐换来的人类感知质量提升 ， 比"参数翻 100 倍"还大。
          这是行业立刻 all-in RLHF 的核心原因。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
