import { INK, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  CardText,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'rag',
  index: 7,
  total: 9,
  title: '评估指标',
};

const METRICS: { title: string; line: string; color: string }[] = [
  { title: 'Retrieval recall / precision', line: '检索到的 chunks 里有多少是真相关的', color: '#fef3c7' },
  { title: 'Groundedness 可对应性', line: '答案每句话能否在 chunks 里找到依据', color: '#dbeafe' },
  { title: 'Answer relevance 答案相关性', line: '答案是否切题', color: '#fce7f3' },
  { title: 'Context utilization 利用率', line: '模型有没有真"看见"塞进去的资料', color: '#d1fae5' },
];

export default function Card7() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <CardSectionHeading>怎么评估 RAG</CardSectionHeading>
        <CardText size={38}>至少看 4 个维度：</CardText>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {METRICS.map((m) => (
            <div
              key={m.title}
              style={{
                background: m.color,
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '20px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 32, color: INK_SEPIA, fontWeight: 700 }}>{m.title}</div>
              <div style={{ fontFamily: PEN, fontSize: 28, color: INK, lineHeight: 1.35 }}>{m.line}</div>
            </div>
          ))}
        </div>

        <CardText size={30}>工具：RAGAS、 TruLens、 Anthropic evals 等。</CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
