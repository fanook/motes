import { INK, INK_GREEN, INK_RED, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'contrastive-learning',
  index: 3,
  total: 8,
  title: '正负样本',
};

export default function Card3() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <CardSectionHeading>正负样本从哪来</CardSectionHeading>

        <div
          style={{
            background: '#d1fae5',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '22px 30px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 32, color: INK_GREEN, fontWeight: 700, marginBottom: 6 }}>
            正样本
          </div>
          <div style={{ fontFamily: PEN, fontSize: 27, color: INK, lineHeight: 1.5 }}>
            · (query, 标注的相关 doc)——搜索点击日志<br />
            · (query, query 的同义改写)<br />
            · (doc 片段, 同文档另一片段)<br />
            · 数据增强：扰动前后（CLIP / SimCSE）
          </div>
        </div>

        <div
          style={{
            background: '#fee2e2',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '22px 30px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 32, color: INK_RED, fontWeight: 700, marginBottom: 6 }}>
            负样本
          </div>
          <div style={{ fontFamily: PEN, fontSize: 27, color: INK, lineHeight: 1.5 }}>
            · <b>In-batch negatives</b>：同 batch 其他样本 ， 几乎免费但太简单<br />
            · <b style={{ color: INK_SEPIA }}>Hard negatives</b>：看似相似实则无关 ， 效果显著好
          </div>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
