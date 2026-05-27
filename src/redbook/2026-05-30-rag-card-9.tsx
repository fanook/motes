import { INK, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'rag',
  index: 9,
  total: 9,
  title: '术语小辞典',
};

type Term = { en: string; ch: string };

const TERMS: Term[] = [
  { en: 'RAG', ch: '检索增强生成 ， 先查再答' },
  { en: 'Chunking', ch: '切块 ， 把长文档切成可检索小段' },
  { en: 'Retriever', ch: '检索器 ， 从向量库捞相关 chunk' },
  { en: 'Reranker', ch: '重排器 ， cross-encoder 精排' },
  { en: 'Dense retrieval', ch: '基于 embedding 的检索' },
  { en: 'BM25', ch: '基于词频的经典关键词检索' },
  { en: 'ANN', ch: '近似最近邻搜索' },
  { en: 'Groundedness', ch: '可对应性 ， 关键 RAG 评估指标' },
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
