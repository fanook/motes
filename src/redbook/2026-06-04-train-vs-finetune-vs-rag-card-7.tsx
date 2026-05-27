import { INK, INK_RED, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'train-vs-finetune-vs-rag',
  index: 7,
  total: 8,
  title: '常见误区',
};

const MYTHS: { wrong: string; right: string }[] = [
  { wrong: '"用 fine-tune 注入知识"', right: '可以但效率低、 易遗忘、 难更新。 一般 RAG 更优' },
  { wrong: '"RAG 解决一切"', right: 'RAG 改不了说话风格 / 推理 / 格式 ， 这些要 fine-tune' },
  { wrong: '"先 fine-tune 再 RAG"', right: '不必一开始就上 ， 先纯 RAG 跑通再说' },
  { wrong: '"自己 pre-train 才安全"', right: '对多数业务是过度工程 ， 闭源模型 + 数据隔离够了' },
];

export default function Card7() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <CardSectionHeading>常见误区</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {MYTHS.map((m) => (
            <div
              key={m.wrong}
              style={{
                background: '#fef3c7',
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '20px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 31, color: INK_RED, fontWeight: 700 }}>
                ✗ {m.wrong}
              </div>
              <div style={{ fontFamily: PEN, fontSize: 27, color: INK, lineHeight: 1.4 }}>{m.right}</div>
            </div>
          ))}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
