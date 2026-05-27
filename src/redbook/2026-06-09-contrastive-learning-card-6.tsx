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
  index: 6,
  total: 8,
  title: '为什么革命性',
};

const REASONS: { title: string; line: string }[] = [
  { title: '不需要"标准答案"', line: '只要"什么和什么相似" ， 不要"输入对应什么数字"' },
  { title: '能从未标注数据学', line: '"同文档不同段"、 "同图不同 crop"都是天然正样本' },
  { title: '学出的空间适合检索', line: '余弦相似度直接可用 ， 不用再加 head' },
  { title: '规模化好', line: 'batch 越大 ， in-batch negatives 越多 ， 信号越丰富' },
];

export default function Card6() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <CardSectionHeading>为什么对 embedding 革命性</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {REASONS.map((r, i) => (
            <div
              key={r.title}
              style={{
                background: ['#fef3c7', '#dbeafe', '#fce7f3', '#d1fae5'][i],
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '20px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 33, color: INK_SEPIA, fontWeight: 700 }}>{r.title}</div>
              <div style={{ fontFamily: PEN, fontSize: 27, color: INK, lineHeight: 1.4 }}>{r.line}</div>
            </div>
          ))}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
