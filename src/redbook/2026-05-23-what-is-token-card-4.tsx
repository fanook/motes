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
  slug: 'what-is-token',
  index: 4,
  total: 9,
  title: '上下文窗口',
};

export default function Card4() {
  return (
    <RedbookCard>
      <div
        style={{
          padding: '110px 90px 0 90px',
          display: 'flex',
          flexDirection: 'column',
          gap: 48,
        }}
      >
        <CardSectionHeading>"128K 上下文" 是多少字？</CardSectionHeading>
        <CardText>
          AI 模型一次能"看"的文字总量 ， 用 token 计算。 厂商说的 "128K context"
          意思就是 <b style={{ color: INK_SEPIA }}>128,000 token</b>。
        </CardText>

        <div
          style={{
            background: '#dbeafe',
            border: '3px solid ' + INK,
            borderRadius: 20,
            padding: '40px 48px',
            fontFamily: PEN,
            fontSize: 44,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div>128,000 token ÷ 1.7 (中文比率)</div>
          <div style={{ fontSize: 56, color: INK_SEPIA, fontWeight: 700 }}>
            ≈ 75,000 个中文字
          </div>
          <div style={{ fontSize: 36, opacity: 0.7, marginTop: 6 }}>
            约 1 本短篇小说的篇幅
          </div>
        </div>

        <CardText size={42}>
          常见值：GPT-4o 128K ， Claude 200K ， Gemini 1M。 越大 = 一次能读
          <span style={{ color: INK_GREEN, fontWeight: 700 }}>越长的资料</span>
          ， 也 = <span style={{ color: INK_SEPIA, fontWeight: 700 }}>每次成本越高</span>。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
