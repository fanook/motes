import { INK, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'rlhf',
  index: 7,
  total: 7,
  title: '术语小辞典',
};

type Term = { en: string; ch: string };

const TERMS: Term[] = [
  { en: 'RLHF', ch: '人类反馈强化学习' },
  { en: 'SFT', ch: '监督微调' },
  { en: 'Reward Model (RM)', ch: '奖励模型 ， 给回答打分' },
  { en: 'PPO', ch: 'Proximal Policy Optimization' },
  { en: 'DPO', ch: 'Direct Preference Optimization ， 现代主流' },
  { en: 'GRPO', ch: 'DeepSeek 提出的简化 RL 算法' },
  { en: 'RLAIF', ch: '用 AI 替代人当评判' },
  { en: 'Alignment tax', ch: '对齐税 ， 原始能力的损失' },
];

export default function Card7() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <CardSectionHeading>术语小辞典</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {TERMS.map((t, i) => (
            <div
              key={t.en}
              style={{
                background: ['#fef3c7', '#dbeafe', '#fce7f3', '#d1fae5', '#ede9fe', '#ffedd5', '#f3e8ff', '#fae8ff'][i % 8],
                border: '3px solid ' + INK,
                borderRadius: 12,
                padding: '13px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
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
