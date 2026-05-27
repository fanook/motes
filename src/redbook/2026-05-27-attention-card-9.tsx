import { INK, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'attention',
  index: 9,
  total: 9,
  title: '术语小辞典',
};

type Term = { en: string; ch: string };

const TERMS: Term[] = [
  { en: 'Attention', ch: '注意力 ， 每个 token 跟所有 token 算相关性' },
  { en: 'Self-attention', ch: '自注意力 ， Q/K/V 同源' },
  { en: 'Multi-head attention', ch: '多头注意力 ， 多个视角同时看' },
  { en: 'Query / Key / Value', ch: '查询 / 键 / 值' },
  { en: 'Softmax', ch: '把分数变成加起来=1 的概率分布' },
  { en: 'Causal mask', ch: '因果掩码 ， 防止"偷看未来"' },
  { en: 'GQA', ch: 'Grouped Query Attention ， 头间共享省显存' },
  { en: 'FlashAttention', ch: '工程优化 ， 显存与速度都更好' },
];

export default function Card9() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <CardSectionHeading>术语小辞典</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {TERMS.map((t, i) => (
            <div
              key={t.en}
              style={{
                background: ['#fef3c7', '#dbeafe', '#fce7f3', '#d1fae5', '#ede9fe', '#ffedd5', '#f3e8ff', '#fae8ff'][i % 8],
                border: '3px solid ' + INK,
                borderRadius: 12,
                padding: '12px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 30, color: INK_SEPIA, fontWeight: 700 }}>{t.en}</div>
              <div style={{ fontFamily: PEN, fontSize: 25, color: INK, lineHeight: 1.3 }}>{t.ch}</div>
            </div>
          ))}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
