import { INK, INK_RED, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'hallucination',
  index: 7,
  total: 9,
  title: '怎么缓解',
};

const LAYERS: { name: string; color: string; items: string[] }[] = [
  {
    name: '工程层',
    color: '#d1fae5',
    items: ['RAG：检索权威资料塞进 prompt 开卷答', '工具调用：该查数据库就查', '让模型给引用 / 出处', '结构化输出（JSON Schema）'],
  },
  {
    name: 'prompt 层',
    color: '#dbeafe',
    items: ['明确说"不确定就说不知道"', '先列证据再下结论（CoT）', '降低 temperature'],
  },
  {
    name: '评估层',
    color: '#fce7f3',
    items: ['用 TruthfulQA / HaluEval 等基准', '第二个模型当 judge 核对', '关键场景人工审核'],
  },
];

export default function Card7() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <CardSectionHeading>怎么缓解（不是消除）</CardSectionHeading>
        <div style={{ fontFamily: PEN, fontSize: 32, color: INK_RED, fontWeight: 700 }}>
          幻觉不能根除 ， 只能 降低 + 检测 + 兜底。
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {LAYERS.map((l) => (
            <div
              key={l.name}
              style={{
                background: l.color,
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '18px 26px',
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 32, color: INK_SEPIA, fontWeight: 700, marginBottom: 6 }}>
                {l.name}
              </div>
              <div style={{ fontFamily: PEN, fontSize: 26, color: INK, lineHeight: 1.45 }}>
                {l.items.map((it, i) => (
                  <div key={i}>· {it}</div>
                ))}
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
