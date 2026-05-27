import { INK, INK_GREEN, INK_RED, INK_SEPIA, PEN } from '../components/handwriting';
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
  index: 8,
  total: 9,
  title: '产品层面的态度',
};

export default function Card8() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <CardSectionHeading>产品层面的态度</CardSectionHeading>
        <CardText size={40}>
          别假定"接入了大模型就有事实"。 做产品该有的判断：
        </CardText>

        <div
          style={{
            background: '#fee2e2',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '22px 30px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 34, color: INK_RED, fontWeight: 700, marginBottom: 6 }}>
            高风险（医疗 / 法律 / 财务）
          </div>
          <div style={{ fontFamily: PEN, fontSize: 30, color: INK }}>
            必须 RAG + 引用 + 人工 review
          </div>
        </div>

        <div
          style={{
            background: '#d1fae5',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '22px 30px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 34, color: INK_GREEN, fontWeight: 700, marginBottom: 6 }}>
            低风险（写邮件 / 头脑风暴）
          </div>
          <div style={{ fontFamily: PEN, fontSize: 30, color: INK }}>
            允许偶发翻车 ， 但要告知"AI 生成内容"
          </div>
        </div>

        <CardText size={36}>
          <span style={{ color: INK_SEPIA, fontWeight: 700 }}>UI 要提示不确定性</span> ，
          别把模型输出包装成"权威结论"。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
