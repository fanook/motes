import { INK, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'embedding',
  index: 10,
  total: 10,
  title: '术语小辞典',
};

type Term = { en: string; ch: string };

const TERMS: Term[] = [
  { en: 'Embedding', ch: '向量化嵌入 ， 把文本变成一串数字' },
  { en: 'Dimension', ch: '向量维度 ， 数字的个数' },
  { en: 'Cosine similarity', ch: '余弦相似度 ， 看夹角判远近' },
  { en: 'Word2Vec', ch: '2013 经典词向量 ， 一词一向量' },
  { en: 'Matryoshka', ch: '套娃表征 ， 一份向量支持多种维度' },
  { en: 'Contrastive learning', ch: '对比学习 ， 拉近正样本推远负样本' },
  { en: 'MTEB', ch: 'embedding 业界评测基准排行榜' },
];

export default function Card10() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <CardSectionHeading>术语小辞典</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          {TERMS.map((t, i) => (
            <div
              key={t.en}
              style={{
                background: ['#fef3c7', '#dbeafe', '#fce7f3', '#d1fae5', '#ede9fe', '#ffedd5', '#f3e8ff'][i % 7],
                border: '3px solid ' + INK,
                borderRadius: 12,
                padding: '14px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 32, color: INK_SEPIA, fontWeight: 700 }}>{t.en}</div>
              <div style={{ fontFamily: PEN, fontSize: 26, color: INK, lineHeight: 1.35 }}>{t.ch}</div>
            </div>
          ))}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
