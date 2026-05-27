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
  index: 4,
  total: 8,
  title: '进阶变种',
};

const VARIANTS: { name: string; line: string }[] = [
  { name: 'Self-consistency', line: '采样多条思考链 ， 投票选最常出现的答案' },
  { name: 'Tree of Thoughts', line: '推理走树状结构 ， 每步多候选 ， 可回溯' },
  { name: 'Plan-and-Solve', line: '先让模型生成"计划" ， 再执行' },
  { name: 'ReAct', line: '思考 + 调工具 + 看结果 + 再思考 ， Agent 基础' },
];

export default function Card4() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <CardSectionHeading>进阶变种</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {VARIANTS.map((v, i) => (
            <div
              key={v.name}
              style={{
                background: ['#fef3c7', '#dbeafe', '#fce7f3', '#d1fae5'][i],
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '22px 30px',
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 36, color: INK_SEPIA, fontWeight: 700 }}>{v.name}</div>
              <div style={{ fontFamily: PEN, fontSize: 29, color: INK, lineHeight: 1.4 }}>{v.line}</div>
            </div>
          ))}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
