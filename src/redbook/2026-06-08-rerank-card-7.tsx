import { INK, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'rerank',
  index: 7,
  total: 7,
  title: '术语小辞典',
};

type Term = { en: string; ch: string };

const TERMS: Term[] = [
  { en: 'Rerank', ch: '重排 ， 对召回结果精排' },
  { en: 'Bi-encoder', ch: '双塔编码器 ， query/doc 独立编码' },
  { en: 'Cross-encoder', ch: '交叉编码器 ， query/doc 一起进模型' },
  { en: 'Recall', ch: '召回率 ， 相关的有多少被检索到' },
  { en: 'Precision', ch: '精度 ， 检索到的有多少是相关的' },
  { en: 'MRR', ch: 'Mean Reciprocal Rank ， 衡量排序质量' },
  { en: 'nDCG', ch: 'Normalized DCG ， 排序标准评估指标' },
];

export default function Card7() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <CardSectionHeading>术语小辞典</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {TERMS.map((t, i) => (
            <div
              key={t.en}
              style={{
                background: ['#fef3c7', '#dbeafe', '#fce7f3', '#d1fae5', '#ede9fe', '#ffedd5', '#f3e8ff'][i % 7],
                border: '3px solid ' + INK,
                borderRadius: 12,
                padding: '13px 24px',
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
