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
  index: 3,
  total: 7,
  title: '流程',
};

const FLOW = `query
  ↓
embed(query) → 向量
  ↓
Vector DB 检索 top-100   ← 召回 (高召回, 有噪声)
  ↓
每个 (query, chunk) 跑 cross-encoder
  ↓
按分数排序 ， 取 top-5     ← 重排 (高精度)
  ↓
塞进 LLM ， 生成回答`;

export default function Card3() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 80px 0 80px', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <CardSectionHeading>RAG + rerank 流程</CardSectionHeading>

        <div
          style={{
            background: '#fdf6e3',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '30px 30px',
            fontFamily: PEN,
            fontSize: 29,
            color: INK,
            whiteSpace: 'pre',
            lineHeight: 1.7,
          }}
        >
          {FLOW}
        </div>

        <div
          style={{
            background: '#fef3c7',
            border: '3px solid ' + INK,
            borderRadius: 14,
            padding: '20px 28px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 32, color: INK_SEPIA, fontWeight: 700 }}>
            召回管"找得全" ， 重排管"排得准"。
          </div>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
