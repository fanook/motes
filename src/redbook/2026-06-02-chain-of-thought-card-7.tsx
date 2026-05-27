import { INK, INK_RED, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'chain-of-thought',
  index: 7,
  total: 8,
  title: '几个坑',
};

const PITS: { title: string; line: string }[] = [
  { title: '过程对 ≠ 答案对', line: '推理合理但答案抄错 ， 或事后合理化（先定答案再补推理）' },
  { title: '占 output token', line: 'output 比 input 贵 ， 一长串思考是真要钱的' },
  { title: '和结构化输出冲突', line: 'JSON + CoT 要用两段式 ， 或放弃 CoT' },
  { title: '小模型不一定有用', line: 'CoT 主要在大模型（100B+）才显著 ， 小模型可能有害' },
];

export default function Card7() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <CardSectionHeading>几个坑</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {PITS.map((p, i) => (
            <div
              key={p.title}
              style={{
                display: 'flex',
                gap: 18,
                background: '#fef3c7',
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '20px 28px',
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 38, color: INK_RED, fontWeight: 700, minWidth: 44 }}>
                {i + 1}.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontFamily: PEN, fontSize: 33, color: INK_SEPIA, fontWeight: 700 }}>{p.title}</div>
                <div style={{ fontFamily: PEN, fontSize: 27, color: INK, lineHeight: 1.4 }}>{p.line}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
