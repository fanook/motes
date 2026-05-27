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
  slug: 'rlhf',
  index: 5,
  total: 7,
  title: 'PPO 之后的演化',
};

const EVO: { name: string; line: string; color: string }[] = [
  { name: 'DPO', line: '数学等价 RM+RL ， 但只需 SFT 风格训练 ， 不要单独 RM、 不要 RL。 开源主流', color: '#fef3c7' },
  { name: 'RLAIF', line: '用更强的 LLM 当评判 ， 替代人工标注。 Anthropic 的 Constitutional AI 是代表', color: '#dbeafe' },
  { name: 'GRPO', line: '去掉 PPO 的 value model。 DeepSeek R1 / Qwen 等推理模型大量采用', color: '#fce7f3' },
];

export default function Card5() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <CardSectionHeading>PPO 之后的演化</CardSectionHeading>
        <CardText size={36}>
          PPO 实现复杂、 两阶段易不稳。 后续有几条简化路径：
        </CardText>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {EVO.map((e) => (
            <div
              key={e.name}
              style={{
                background: e.color,
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '22px 30px',
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 36, color: INK_SEPIA, fontWeight: 700 }}>{e.name}</div>
              <div style={{ fontFamily: PEN, fontSize: 27, color: INK, lineHeight: 1.4 }}>{e.line}</div>
            </div>
          ))}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
