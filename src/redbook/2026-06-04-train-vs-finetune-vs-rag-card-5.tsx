import { INK, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'train-vs-finetune-vs-rag',
  index: 5,
  total: 8,
  title: '对比表',
};

const ROWS: string[][] = [
  ['维度', 'Pre-train', 'Fine-tune', 'RAG'],
  ['改行为/风格', '✓✓✓', '✓✓', '✗'],
  ['注入新事实', '✓✓✓', '✓ 易忘', '✓✓✓'],
  ['知识可更新', '慢', '慢', '实时'],
  ['可追溯出处', '✗', '✗', '✓'],
  ['成本', '$M~$B', '$10~10k', '$1~1k 起'],
  ['上线时间', '月', '天-周', '天'],
];

export default function Card5() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 70px 0 70px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <CardSectionHeading>三者对比</CardSectionHeading>

        <div style={{ border: '3px solid ' + INK, borderRadius: 14, overflow: 'hidden' }}>
          {ROWS.map((row, ri) => (
            <div
              key={ri}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 1.2fr 1.2fr 1fr',
                background: ri === 0 ? '#fef3c7' : ri % 2 ? '#fff' : '#f7f2e4',
                borderBottom: ri < ROWS.length - 1 ? '2px solid ' + INK : 'none',
              }}
            >
              {row.map((cell, ci) => (
                <div
                  key={ci}
                  style={{
                    padding: '16px 14px',
                    fontFamily: PEN,
                    fontSize: ri === 0 ? 28 : 26,
                    color: ri === 0 || ci === 0 ? INK_SEPIA : INK,
                    fontWeight: ri === 0 || ci === 0 ? 700 : 400,
                    borderRight: ci < row.length - 1 ? '2px solid ' + INK : 'none',
                    textAlign: ci === 0 ? 'left' : 'center',
                  }}
                >
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ fontFamily: PEN, fontSize: 28, color: INK_SEPIA, fontWeight: 700, textAlign: 'center' }}>
          改"知识"看 RAG ， 改"行为"看 Fine-tune。
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
