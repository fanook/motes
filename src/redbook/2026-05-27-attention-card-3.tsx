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
  slug: 'attention',
  index: 3,
  total: 9,
  title: 'Q/K/V 直觉',
};

type QKV = { letter: string; name: string; line: string; color: string };

const ITEMS: QKV[] = [
  { letter: 'Q', name: 'Query 查询', line: '"我现在要找什么" —— 当前位置的提问', color: '#fef3c7' },
  { letter: 'K', name: 'Key 键', line: '"我的标签是什么" —— 像书脊上的标签', color: '#dbeafe' },
  { letter: 'V', name: 'Value 值', line: '"我真正的内容" —— 实际要贡献的信息', color: '#fce7f3' },
];

export default function Card3() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <CardSectionHeading>Q / K / V 直觉</CardSectionHeading>
        <CardText size={38}>
          类比一个检索系统 —— attention 干的就是"带着问题去图书馆查书"：
        </CardText>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {ITEMS.map((it) => (
            <div
              key={it.letter}
              style={{
                background: it.color,
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '20px 28px',
                display: 'flex',
                gap: 24,
                alignItems: 'center',
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 64, color: INK_SEPIA, fontWeight: 700, minWidth: 70 }}>
                {it.letter}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontFamily: PEN, fontSize: 36, color: INK_SEPIA, fontWeight: 700 }}>
                  {it.name}
                </div>
                <div style={{ fontFamily: PEN, fontSize: 28, color: INK, lineHeight: 1.4 }}>{it.line}</div>
              </div>
            </div>
          ))}
        </div>

        <CardText size={34}>
          流程：用 <b>Q</b> 跟所有 <b>K</b> 算相似度 → 得到一组权重 → 对 <b>V</b> 加权求和。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
