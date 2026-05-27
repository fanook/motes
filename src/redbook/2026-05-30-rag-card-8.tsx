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
  index: 8,
  total: 9,
  title: '进阶版本',
};

const ADV: { title: string; line: string }[] = [
  { title: 'Hybrid search', line: 'dense + BM25 融合 ， 兼顾语义和关键词' },
  { title: 'Query rewriting', line: '先让 LLM 改写 query 再检索 ， 更检索友好' },
  { title: 'Multi-query', line: '一个 query 拆成多个子查询并行检索' },
  { title: 'Agentic RAG', line: '模型自己决定要不要查、 查几次、 用哪个工具' },
  { title: 'GraphRAG', line: '把文档拆成实体+关系图 ， 用图遍历召回（微软 2024）' },
];

export default function Card8() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <CardSectionHeading>进阶版本</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {ADV.map((a, i) => (
            <div
              key={a.title}
              style={{
                background: ['#fef3c7', '#dbeafe', '#fce7f3', '#d1fae5', '#ede9fe'][i],
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '20px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 33, color: INK_SEPIA, fontWeight: 700 }}>{a.title}</div>
              <div style={{ fontFamily: PEN, fontSize: 27, color: INK, lineHeight: 1.35 }}>{a.line}</div>
            </div>
          ))}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
