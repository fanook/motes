import { INK, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'chain-of-thought',
  index: 8,
  total: 8,
  title: '术语小辞典',
};

type Term = { en: string; ch: string };

const TERMS: Term[] = [
  { en: 'Chain of Thought (CoT)', ch: '思维链 ， 让模型逐步推理' },
  { en: 'Few-shot CoT', ch: '少样本思维链 ， 给示例' },
  { en: 'Zero-shot CoT', ch: '零样本思维链 ， 直接加魔咒' },
  { en: 'Self-consistency', ch: '多路采样 + 投票' },
  { en: 'Tree of Thoughts', ch: '思考树 ， 可回溯' },
  { en: 'ReAct', ch: '思考 + 行动循环 ， Agent 范式' },
  { en: 'Reasoning model', ch: '把思考链内化到训练的模型' },
];

export default function Card8() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <CardSectionHeading>术语小辞典</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          {TERMS.map((t, i) => (
            <div
              key={t.en}
              style={{
                background: ['#fef3c7', '#dbeafe', '#fce7f3', '#d1fae5', '#ede9fe', '#ffedd5', '#f3e8ff'][i % 7],
                border: '3px solid ' + INK,
                borderRadius: 12,
                padding: '13px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 29, color: INK_SEPIA, fontWeight: 700 }}>{t.en}</div>
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
