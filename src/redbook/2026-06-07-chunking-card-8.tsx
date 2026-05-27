import { INK, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'chunking',
  index: 8,
  total: 8,
  title: '术语小辞典',
};

type Term = { en: string; ch: string };

const TERMS: Term[] = [
  { en: 'Chunking', ch: '切块 ， 把长文档切成可检索小段' },
  { en: 'Chunk size', ch: '切块长度（token 或字符）' },
  { en: 'Overlap', ch: '相邻块的重叠 ， 防边界丢信息' },
  { en: 'Recursive splitter', ch: '递归切分器 ， 主流实现' },
  { en: 'Semantic chunking', ch: '语义切块 ， 按相似度分界' },
  { en: 'Parent-child chunking', ch: '父子块 ， 召回小块喂大块给 LLM' },
];

export default function Card8() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <CardSectionHeading>术语小辞典</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {TERMS.map((t, i) => (
            <div
              key={t.en}
              style={{
                background: ['#fef3c7', '#dbeafe', '#fce7f3', '#d1fae5', '#ede9fe', '#ffedd5'][i % 6],
                border: '3px solid ' + INK,
                borderRadius: 12,
                padding: '14px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 30, color: INK_SEPIA, fontWeight: 700 }}>{t.en}</div>
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
