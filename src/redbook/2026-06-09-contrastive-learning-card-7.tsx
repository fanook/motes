import { INK, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'contrastive-learning',
  index: 7,
  total: 8,
  title: '典型应用',
};

const APPS: { title: string; line: string }[] = [
  { title: '文本 embedding', line: 'OpenAI text-embedding-3 / Voyage / BGE / GTE 全是它训的' },
  { title: '多模态对齐', line: 'CLIP / ALIGN —— 图片 embedding 和描述文字靠近' },
  { title: '自监督视觉', line: 'SimCLR / MoCo —— 同图两种增强算正样本' },
  { title: 'Rerank 训练', line: 'cross-encoder 也常用对比方式训' },
];

export default function Card7() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <CardSectionHeading>典型应用</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {APPS.map((a, i) => (
            <div
              key={a.title}
              style={{
                background: ['#fef3c7', '#dbeafe', '#fce7f3', '#d1fae5'][i],
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '20px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 33, color: INK_SEPIA, fontWeight: 700 }}>{a.title}</div>
              <div style={{ fontFamily: PEN, fontSize: 27, color: INK, lineHeight: 1.4 }}>{a.line}</div>
            </div>
          ))}
        </div>

        <div style={{ fontFamily: PEN, fontSize: 28, color: INK_SEPIA, fontWeight: 700, textAlign: 'center' }}>
          你用的几乎所有 embedding 模型 ， 背后都是对比学习。
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
