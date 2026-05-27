import { INK, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'hallucination',
  index: 9,
  total: 9,
  title: '术语小辞典',
};

type Term = { en: string; ch: string };

const TERMS: Term[] = [
  { en: 'Hallucination', ch: '幻觉 ， 模型一本正经地编造' },
  { en: 'Intrinsic / Extrinsic', ch: '内在（和源矛盾）/ 外在（无法验证）' },
  { en: 'Faithfulness', ch: '忠实度 ， 输出是否忠于源材料' },
  { en: 'Groundedness', ch: '可对应性 ， 能否在源里找到依据' },
  { en: 'Self-consistency', ch: '多次采样看一致性的检测法' },
  { en: 'TruthfulQA', ch: '一个评测幻觉的 benchmark' },
];

export default function Card9() {
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
                padding: '16px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 31, color: INK_SEPIA, fontWeight: 700 }}>{t.en}</div>
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
