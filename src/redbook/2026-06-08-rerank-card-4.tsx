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
  index: 4,
  total: 7,
  title: '主流 Reranker',
};

const RR: { name: string; line: string }[] = [
  { name: 'Cohere Rerank 3', line: '商业 API ， 多语言强 ， 长上下文友好。 行业默认' },
  { name: 'Voyage rerank-2', line: 'Anthropic 推荐合作伙伴 ， 性能接近 Cohere' },
  { name: 'BGE-Reranker', line: '智源出品 ， 开源 ， 中文好' },
  { name: 'Jina Reranker', line: '开源 + 商业 ， 轻量' },
  { name: 'LLM as reranker', line: '让小 LLM 给 (query, chunk) 打分。 灵活但贵' },
];

export default function Card4() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <CardSectionHeading>主流 Reranker (2026)</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {RR.map((r, i) => (
            <div
              key={r.name}
              style={{
                background: ['#fef3c7', '#dbeafe', '#fce7f3', '#d1fae5', '#ede9fe'][i],
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '18px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 33, color: INK_SEPIA, fontWeight: 700 }}>{r.name}</div>
              <div style={{ fontFamily: PEN, fontSize: 27, color: INK, lineHeight: 1.35 }}>{r.line}</div>
            </div>
          ))}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
