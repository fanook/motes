import { INK, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'function-calling',
  index: 3,
  total: 8,
  title: '典型工作流',
};

const STEPS: string[] = [
  '开发者声明可用工具（name + description + 参数 schema）',
  '用户提问 → 模型看到挂着的工具列表',
  '模型判断：能直接答就答 ， 要外部信息就发起 tool call',
  '应用代码执行该工具（调 API / 跑 SQL）拿到结果',
  '结果作为新消息回传给模型',
  '模型综合结果 ， 给最终自然语言回答',
];

export default function Card3() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <CardSectionHeading>典型工作流</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {STEPS.map((s, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 18,
                alignItems: 'center',
                background: i === 2 || i === 3 ? '#fef3c7' : '#f5f0e0',
                border: '3px solid ' + INK,
                borderRadius: 13,
                padding: '16px 24px',
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 36, color: INK_SEPIA, fontWeight: 700, minWidth: 46 }}>
                {i + 1}
              </div>
              <div style={{ fontFamily: PEN, fontSize: 28, color: INK, lineHeight: 1.35 }}>{s}</div>
            </div>
          ))}
        </div>

        <div style={{ fontFamily: PEN, fontSize: 28, color: INK_SEPIA, fontWeight: 700, textAlign: 'center' }}>
          步骤 3~5 可以多次循环（ReAct 模式）
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
