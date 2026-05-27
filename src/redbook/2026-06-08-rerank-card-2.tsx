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
  slug: 'rerank',
  index: 2,
  total: 7,
  title: '两种编码器',
};

export default function Card2() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <CardSectionHeading>Bi vs Cross encoder</CardSectionHeading>

        <div
          style={{
            background: '#dbeafe',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '22px 30px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 32, color: INK_SEPIA, fontWeight: 700, marginBottom: 6 }}>
            Bi-encoder（召回用）
          </div>
          <div style={{ fontFamily: PEN, fontSize: 27, color: INK, lineHeight: 1.5 }}>
            query 和 doc 各自独立算向量 ， 比余弦。 doc 可提前算好 ， 在线毫秒级。
            但两者没"对话"过 ， 细节交互丢失。
          </div>
        </div>

        <div
          style={{
            background: '#fce7f3',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '22px 30px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 32, color: INK_SEPIA, fontWeight: 700, marginBottom: 6 }}>
            Cross-encoder（重排用）
          </div>
          <div style={{ fontFamily: PEN, fontSize: 27, color: INK, lineHeight: 1.5 }}>
            query 和 doc 拼一起进模型 ， token 之间直接 attention 交互。
            精度高得多 ， 但每次在线算 ， 慢。
          </div>
        </div>

        <CardText size={34}>
          工程上：<span style={{ color: INK_RED, fontWeight: 700 }}>bi 召回粗排 + cross 重排精排</span>。
          先召回 top-100 ， 再 rerank 取 top-5。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
