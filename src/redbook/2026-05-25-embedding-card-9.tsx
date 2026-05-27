import { INK, INK_RED, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'embedding',
  index: 9,
  total: 10,
  title: '几个坑',
};

type Pit = { title: string; line: string };

const PITS: Pit[] = [
  { title: '跨模型不通用', line: 'OpenAI 的向量和 Voyage 的不在一个空间。 换模型 = 重算全部 embedding' },
  { title: '多语言不保证', line: '不同模型对中文 / 小语种差异大。 混语料检索易翻车 ， 看 MTEB 多语言子榜' },
  { title: '截断风险', line: '输入超 ctx 长度会被截掉。 长文档要先切块（chunking）' },
  { title: '语义相似 ≠ 答案相关', line: '"什么是 ML" 和 "ML 有哪些缺点" 语义近 ， 但答案方向不同。 靠 rerank 补救' },
  { title: 'cosine 不是绝对语义', line: '向量训练目标决定它对齐什么。 检索 embedding 优化的是相关性' },
];

export default function Card9() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <CardSectionHeading>几个常见的坑</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {PITS.map((p, i) => (
            <div
              key={p.title}
              style={{
                display: 'flex',
                gap: 18,
                background: '#fef3c7',
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '18px 26px',
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 36, color: INK_RED, fontWeight: 700, minWidth: 44 }}>
                {i + 1}.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontFamily: PEN, fontSize: 34, color: INK_SEPIA, fontWeight: 700 }}>
                  {p.title}
                </div>
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
