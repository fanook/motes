import { INK, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'sampling',
  index: 7,
  total: 9,
  title: '实战速查',
};

const ROWS: { scene: string; t: string; color: string }[] = [
  { scene: '代码 / 数学 / 工具调用', t: 'T = 0 ~ 0.3', color: '#dbeafe' },
  { scene: '翻译 / 摘要 / 提取结构', t: 'T = 0.3 ~ 0.7', color: '#d1fae5' },
  { scene: '客服对话 / 一般问答', t: 'T = 0.7 ~ 1.0', color: '#fef3c7' },
  { scene: '创意写作 / 头脑风暴 / 起名', t: 'T = 1.0 ~ 1.3', color: '#fce7f3' },
  { scene: '可复现（评测 / 调试）', t: 'T = 0 或固定 seed', color: '#ede9fe' },
];

export default function Card7() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <CardSectionHeading>实战速查：T 怎么选</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {ROWS.map((r) => (
            <div
              key={r.scene}
              style={{
                background: r.color,
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '20px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 34, color: INK, fontWeight: 700 }}>{r.scene}</div>
              <div style={{ fontFamily: PEN, fontSize: 32, color: INK_SEPIA, fontWeight: 700 }}>{r.t}</div>
            </div>
          ))}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
