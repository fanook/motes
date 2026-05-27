import { INK, INK_RED, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'chunking',
  index: 6,
  total: 8,
  title: '几个坑',
};

const PITS: { title: string; line: string }[] = [
  { title: '表格 / 代码块被切散', line: 'HTML/Markdown 提取要把这些保留为整体 ， 别粗暴按字符切' },
  { title: '列表项被切断', line: '"1. … 2. … 3. …" 切到第 2 条 ， 第 3 条丢了上下文' },
  { title: 'PDF 提取错误', line: '扫描版 PDF 的 OCR 错字 / 换行错位 ， 严重影响 chunk 质量' },
  { title: '多语种混合', line: '按"字符 500"切中英 ， 实际 size 差几倍 ， 应统一按 token 算' },
];

export default function Card6() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <CardSectionHeading>几个坑</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {PITS.map((p, i) => (
            <div
              key={p.title}
              style={{
                display: 'flex',
                gap: 18,
                background: '#fef3c7',
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '20px 28px',
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 38, color: INK_RED, fontWeight: 700, minWidth: 44 }}>
                {i + 1}.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontFamily: PEN, fontSize: 32, color: INK_SEPIA, fontWeight: 700 }}>{p.title}</div>
                <div style={{ fontFamily: PEN, fontSize: 27, color: INK, lineHeight: 1.4 }}>{p.line}</div>
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
