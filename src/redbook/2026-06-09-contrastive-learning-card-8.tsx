import { INK, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'contrastive-learning',
  index: 8,
  total: 8,
  title: '术语小辞典',
};

type Term = { en: string; ch: string };

const TERMS: Term[] = [
  { en: 'Contrastive learning', ch: '对比学习 ， 拉近正样本推远负样本' },
  { en: 'Anchor / Positive / Negative', ch: '锚点 / 正样本 / 负样本' },
  { en: 'InfoNCE', ch: '对比学习的主流损失函数' },
  { en: 'In-batch negatives', ch: '同 batch 内其他样本当负样本' },
  { en: 'Hard negatives', ch: '难负样本 ， 看似相似但不相关' },
  { en: 'Temperature τ', ch: '损失函数里的尖锐度参数' },
  { en: 'CLIP', ch: 'OpenAI 多模态对比学习模型' },
  { en: 'SimCSE', ch: '句子 embedding 对比学习' },
];

export default function Card8() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <CardSectionHeading>术语小辞典</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
              <div style={{ fontFamily: PEN, fontSize: 28, color: INK_SEPIA, fontWeight: 700 }}>{t.en}</div>
              <div style={{ fontFamily: PEN, fontSize: 24, color: INK, lineHeight: 1.3 }}>{t.ch}</div>
            </div>
          ))}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
