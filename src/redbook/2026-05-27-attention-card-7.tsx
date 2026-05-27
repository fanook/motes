import { INK, INK_RED, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'attention',
  index: 7,
  total: 9,
  title: '配套设计',
};

type Item = { title: string; line: string };

const ITEMS: Item[] = [
  {
    title: '位置编码 Positional Encoding',
    line: 'attention 打乱 token 顺序结果不变 ， 所以要额外注入"位置感"。 现代用 RoPE。',
  },
  {
    title: '因果掩码 Causal Mask',
    line: 'decoder-only LLM 每个 token 只能看它之前的 ， 不能偷看未来。 把矩阵上三角设 -∞。',
  },
  {
    title: 'O(n²) 复杂度',
    line: '要算 n×n 的相似度矩阵 —— 这就是长上下文为什么贵的根本原因。',
  },
];

export default function Card7() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <CardSectionHeading>几个配套设计</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {ITEMS.map((it, i) => (
            <div
              key={it.title}
              style={{
                background: ['#fef3c7', '#dbeafe', '#fce7f3'][i],
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '22px 30px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 34, color: INK_SEPIA, fontWeight: 700 }}>
                {it.title}
              </div>
              <div style={{ fontFamily: PEN, fontSize: 29, color: INK, lineHeight: 1.45 }}>{it.line}</div>
            </div>
          ))}
        </div>

        <div style={{ fontFamily: PEN, fontSize: 28, color: INK_RED }}>
          注：O(n²) 也是 Context Window 那篇讲的"长上下文贵"的根。
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
