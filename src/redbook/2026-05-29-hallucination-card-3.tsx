import { INK, INK_GREEN, INK_RED, PEN } from '../components/handwriting';
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
  index: 3,
  total: 9,
  title: '流畅≠准确',
};

export default function Card3() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 36 }}>
        <CardSectionHeading>流畅 ≠ 准确</CardSectionHeading>
        <CardText size={40}>
          模型被训练得能输出流畅语言。 但流畅 ， 跟对不对 ， 是两回事 ——
        </CardText>

        <div
          style={{
            background: '#d1fae5',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '28px 32px',
            fontFamily: PEN,
            fontSize: 42,
            color: INK,
          }}
        >
          <span style={{ color: INK_GREEN, fontWeight: 700 }}>✓</span> "李白写过《静夜思》"
        </div>

        <div
          style={{
            background: '#fee2e2',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '28px 32px',
            fontFamily: PEN,
            fontSize: 42,
            color: INK,
          }}
        >
          <span style={{ color: INK_RED, fontWeight: 700 }}>✗</span> "白居易写过《冬夜思》"
        </div>

        <CardText size={40}>
          这两句在语法、 风格、 流畅度上
          <span style={{ color: INK_RED, fontWeight: 700 }}>没有任何区别</span>。
          模型只是按概率在采样 —— 它不知道哪句是编的。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
