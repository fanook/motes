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
  slug: 'chunking',
  index: 4,
  total: 8,
  title: '关键参数',
};

export default function Card4() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <CardSectionHeading>两个关键参数</CardSectionHeading>

        <div
          style={{
            background: '#fef3c7',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '24px 30px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 36, color: INK_SEPIA, fontWeight: 700, marginBottom: 8 }}>
            Chunk size
          </div>
          <div style={{ fontFamily: PEN, fontSize: 28, color: INK, lineHeight: 1.5 }}>
            · 太小（&lt;100 token）→ 信息片段化 ， 丢上下文<br />
            · 太大（&gt;2000 token）→ embedding 失真 ， 检索精度降<br />
            · 常用 <b style={{ color: INK_RED }}>200~800 token</b>
          </div>
        </div>

        <div
          style={{
            background: '#dbeafe',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '24px 30px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 36, color: INK_SEPIA, fontWeight: 700, marginBottom: 8 }}>
            Overlap 重叠
          </div>
          <div style={{ fontFamily: PEN, fontSize: 28, color: INK, lineHeight: 1.5 }}>
            相邻 chunk 故意保留一段重复 ， 防关键信息正好被切在边界。
            常用 <b style={{ color: INK_RED }}>chunk 的 10%~20%</b>
            （chunk=500 ， overlap=50~100）。
          </div>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
