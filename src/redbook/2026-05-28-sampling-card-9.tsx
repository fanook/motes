import { INK, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'sampling',
  index: 9,
  total: 9,
  title: '术语小辞典',
};

type Term = { en: string; ch: string };

const TERMS: Term[] = [
  { en: 'Logits', ch: '模型最后一层输出的未归一化分数' },
  { en: 'Softmax', ch: '把 logits 变成概率分布' },
  { en: 'Temperature', ch: 'logits 除以的标量 ， 控制随机度' },
  { en: 'Top-k', ch: '只在概率最高的 k 个候选里采样' },
  { en: 'Top-p / Nucleus', ch: '按累计概率到 p 切 ， 核采样' },
  { en: 'Greedy decoding', ch: '贪心解码 ， 永远取最高' },
  { en: 'Beam search', ch: '束搜索 ， 保留多条候选路径' },
];

export default function Card9() {
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
