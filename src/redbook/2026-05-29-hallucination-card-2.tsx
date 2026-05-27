import { INK, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  CardText,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'hallucination',
  index: 2,
  total: 9,
  title: '为什么必然发生',
};

const CAUSES: { title: string; line: string }[] = [
  { title: '它是"下一个 token 预测器"', line: '训练目标只有一个：预测下一个词。 没有"事实检查"模块' },
  { title: '流畅性 ≠ 准确性', line: '对的句子和错的句子 ， 语法 / 流畅度完全一样' },
  { title: '训练数据有边界 + 时间冻结', line: '截止日期后的事不知道 ， 数据本身也有错误噪声' },
  { title: '压缩损失', line: '几十 TB 知识压进有限参数 ， 越冷门越模糊' },
];

export default function Card2() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <CardSectionHeading>为什么必然发生</CardSectionHeading>
        <CardText size={38}>
          幻觉不是 bug ， 是机制的<b style={{ color: INK_SEPIA }}>副产物</b>。 四个根因：
        </CardText>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {CAUSES.map((c, i) => (
            <div
              key={c.title}
              style={{
                display: 'flex',
                gap: 18,
                background: ['#fef3c7', '#dbeafe', '#fce7f3', '#d1fae5'][i],
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '20px 26px',
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 36, color: INK_SEPIA, fontWeight: 700, minWidth: 44 }}>
                {i + 1}.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontFamily: PEN, fontSize: 33, color: INK_SEPIA, fontWeight: 700 }}>
                  {c.title}
                </div>
                <div style={{ fontFamily: PEN, fontSize: 27, color: INK, lineHeight: 1.4 }}>{c.line}</div>
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
