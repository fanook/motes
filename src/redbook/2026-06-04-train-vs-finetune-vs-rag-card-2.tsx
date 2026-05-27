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
  slug: 'train-vs-finetune-vs-rag',
  index: 2,
  total: 8,
  title: 'Pre-training',
};

export default function Card2() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <CardSectionHeading>① 预训练 Pre-training</CardSectionHeading>
        <CardText size={40}>
          从随机权重出发 ， 在海量文本上做下一 token 预测 —— 从零造一个基础模型。
        </CardText>

        <div
          style={{
            background: '#fee2e2',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '24px 30px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 34, color: INK_RED, fontWeight: 700, marginBottom: 8 }}>
            代价极高
          </div>
          <div style={{ fontFamily: PEN, fontSize: 30, color: INK, lineHeight: 1.5 }}>
            · 数据：百 G ~ 十 T token<br />
            · 算力：万 GPU·月 ， 千万~亿美元<br />
            · 时间：数月
          </div>
        </div>

        <CardText size={36}>
          <span style={{ color: INK_SEPIA, fontWeight: 700 }}>何时做</span>：语言/领域差异极大 ，
          或要做独立基础模型。 <b>普通公司基本不做。</b>
        </CardText>
        <CardText size={32}>
          变种：Continued pre-training —— 在开源 base（Llama/Qwen）上用领域语料继续训 ， 便宜得多。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
