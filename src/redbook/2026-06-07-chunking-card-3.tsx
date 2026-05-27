import { INK, INK_GREEN, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'chunking',
  index: 3,
  total: 8,
  title: '主流切法',
};

const METHODS: { n: string; name: string; line: string; rec?: boolean }[] = [
  { n: '1', name: '固定长度切', line: '每 500 token 一刀。 最简单 ， 但会切断句子。 不推荐' },
  { n: '2', name: '句子级切', line: '按句号/段落 ， 保证完整句。 但长短不均' },
  { n: '3', name: '递归字符切', line: '段落→句号→逗号→字符逐级退。 当前主流', rec: true },
  { n: '4', name: '结构化切', line: '按 markdown/HTML 标题切 ， 保留章节层次' },
  { n: '5', name: '语义切', line: '按相邻句相似度 ， 话题变化处下刀' },
  { n: '6', name: 'LLM-based 切', line: '让 LLM 自己切 ， 质量最高但贵且慢' },
];

export default function Card3() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 80px 0 80px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <CardSectionHeading>主流切法（笨→聪明）</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {METHODS.map((m) => (
            <div
              key={m.n}
              style={{
                display: 'flex',
                gap: 16,
                background: m.rec ? '#d1fae5' : '#fef3c7',
                border: '3px solid ' + INK,
                borderRadius: 13,
                padding: '15px 24px',
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 32, color: INK_SEPIA, fontWeight: 700, minWidth: 38 }}>
                {m.n}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ fontFamily: PEN, fontSize: 30, color: INK_SEPIA, fontWeight: 700 }}>
                  {m.name}
                  {m.rec && <span style={{ fontSize: 24, color: INK_GREEN, marginLeft: 10 }}>← 推荐</span>}
                </div>
                <div style={{ fontFamily: PEN, fontSize: 25, color: INK, lineHeight: 1.3 }}>{m.line}</div>
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
