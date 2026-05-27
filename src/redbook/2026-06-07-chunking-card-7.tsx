import { INK, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'chunking',
  index: 7,
  total: 8,
  title: '实战建议',
};

const TIPS: { scene: string; advice: string; color: string }[] = [
  { scene: '原型阶段', advice: 'recursive splitter ， chunk 500 / overlap 50', color: '#fef3c7' },
  { scene: '上线前调优', advice: '分别测 200/400/800/1600 ， 看哪个召回最好', color: '#dbeafe' },
  { scene: '结构化文档', advice: 'API docs / wiki 按 H2/H3 切 ， 比字符稳', color: '#fce7f3' },
  { scene: '非结构化', advice: '合同 / 论文 ， 考虑 semantic 或 LLM-based', color: '#d1fae5' },
];

export default function Card7() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <CardSectionHeading>实战建议</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {TIPS.map((t) => (
            <div
              key={t.scene}
              style={{
                background: t.color,
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '20px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 32, color: INK_SEPIA, fontWeight: 700 }}>{t.scene}</div>
              <div style={{ fontFamily: PEN, fontSize: 28, color: INK, lineHeight: 1.4 }}>{t.advice}</div>
            </div>
          ))}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
