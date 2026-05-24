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
  slug: 'what-is-token',
  index: 6,
  total: 9,
  title: '价格',
};

export default function Card4() {
  return (
    <RedbookCard>
      <div
        style={{
          padding: '110px 90px 0 90px',
          display: 'flex',
          flexDirection: 'column',
          gap: 56,
        }}
      >
        <CardSectionHeading>Token = 钱</CardSectionHeading>
        <CardText>
          AI 厂商按 <span style={{ color: INK_SEPIA, fontWeight: 700 }}>token 数</span> 收费
          ， 不是按文章数或者请求数。 看个真实价：
        </CardText>

        <div
          style={{
            background: '#fef3c7',
            border: '3px solid ' + INK,
            borderRadius: 20,
            padding: '40px 48px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            fontFamily: PEN,
            fontSize: 44,
          }}
        >
          <div>
            <span style={{ color: INK_SEPIA, fontWeight: 700 }}>Claude Sonnet 4.6</span>
          </div>
          <div>input ＝ <b>$3</b> / 100 万 token</div>
          <div>output ＝ <b>$15</b> / 100 万 token</div>
        </div>

        <CardText size={42}>
          一篇 3000 字中文文章 (≈ 7500 token) 让 AI 读完， 不到 <span style={{ color: INK_GREEN, fontWeight: 700 }}>¥0.16</span>。
        </CardText>

        <CardText size={38}>
          <span style={{ color: INK_RED }}>* 价格以官方为准</span>
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
