import { INK, INK_RED, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  CardText,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'sampling',
  index: 6,
  total: 9,
  title: '组合使用',
};

const STEPS = [
  'temperature 缩放分布',
  'top-k 砍长尾（如 k=50）',
  'top-p 进一步收紧（如 p=0.95）',
  '从剩下的 token 里按概率随机采样',
];

export default function Card6() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <CardSectionHeading>三个参数怎么配合</CardSectionHeading>
        <CardText size={40}>
          三个参数可以<b>同时用</b> ， 一般的处理流程是 ——
        </CardText>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {STEPS.map((s, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 20,
                alignItems: 'center',
                background: ['#fef3c7', '#dbeafe', '#fce7f3', '#d1fae5'][i],
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '20px 28px',
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 44, color: INK_SEPIA, fontWeight: 700, minWidth: 56 }}>
                {i + 1}
              </div>
              <div style={{ fontFamily: PEN, fontSize: 34, color: INK, lineHeight: 1.35 }}>{s}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: '#fee2e2',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '22px 30px',
          }}
        >
          <CardText size={34}>
            <span style={{ color: INK_RED, fontWeight: 700 }}>官方建议</span>：OpenAI / Anthropic
            都说 —— temperature 和 top-p <b>只调一个</b> ， 别俩一起 fine-tune ， 容易理解错。
          </CardText>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
