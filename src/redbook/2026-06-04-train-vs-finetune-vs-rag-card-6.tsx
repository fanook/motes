import { INK, INK_GREEN, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'train-vs-finetune-vs-rag',
  index: 6,
  total: 8,
  title: '选型决策树',
};

const QS: { q: string; a: string; color: string }[] = [
  { q: 'Q1. 要解决"知识"还是"行为"？', a: '不知道业务→知识→看Q2；说话啰嗦/格式不对→行为→fine-tune', color: '#fef3c7' },
  { q: 'Q2. 知识更新频率？', a: '每天变→RAG；很少变体量小→都行；核心领域极大量→continued pre-train', color: '#dbeafe' },
  { q: 'Q3. 预算和数据？', a: '没标注/没预算→RAG；几百~几千样本→LoRA/SFT；千万刀+半年→pre-train', color: '#fce7f3' },
];

export default function Card6() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 80px 0 80px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <CardSectionHeading>选型决策树</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {QS.map((item) => (
            <div
              key={item.q}
              style={{
                background: item.color,
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '20px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 32, color: INK_SEPIA, fontWeight: 700 }}>{item.q}</div>
              <div style={{ fontFamily: PEN, fontSize: 26, color: INK, lineHeight: 1.4 }}>{item.a}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: '#d1fae5',
            border: '3px solid ' + INK,
            borderRadius: 14,
            padding: '20px 28px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 32, color: INK_GREEN, fontWeight: 700 }}>
            实战几乎都是：RAG 优先 + 必要时 fine-tune。
          </div>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
