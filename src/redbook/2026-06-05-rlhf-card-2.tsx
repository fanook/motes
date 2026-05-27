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
  index: 2,
  total: 7,
  title: '三阶段流程',
};

const STAGES: { n: string; title: string; line: string; color: string }[] = [
  { n: '1', title: 'SFT 监督微调', line: '人工写大量"理想问答对" ， 教模型基本的"听指令"能力', color: '#fef3c7' },
  { n: '2', title: '训练奖励模型 RM', line: '对同一问题生成多个回答 ， 人工"排序" ， 训一个模型模拟"人有多喜欢"', color: '#dbeafe' },
  { n: '3', title: 'RL 优化策略', line: '模型生成 → RM 打分 → PPO 朝高分更新。 加 KL 惩罚防"为高分胡说"', color: '#d1fae5' },
];

export default function Card2() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <CardSectionHeading>三阶段流程</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {STAGES.map((s) => (
            <div
              key={s.n}
              style={{
                background: s.color,
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '22px 28px',
                display: 'flex',
                gap: 18,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 48, color: INK_SEPIA, fontWeight: 700, minWidth: 50 }}>
                {s.n}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ fontFamily: PEN, fontSize: 34, color: INK_SEPIA, fontWeight: 700 }}>{s.title}</div>
                <div style={{ fontFamily: PEN, fontSize: 27, color: INK, lineHeight: 1.4 }}>{s.line}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontFamily: PEN, fontSize: 27, color: INK, opacity: 0.7 }}>
          RM 用"相对排序"而非绝对打分 —— 人判断"哪个更好"比"打几分"稳定得多。
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
