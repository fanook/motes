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
  slug: 'train-vs-finetune-vs-rag',
  index: 3,
  total: 8,
  title: 'Fine-tuning',
};

export default function Card3() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <CardSectionHeading>② 微调 Fine-tuning</CardSectionHeading>
        <CardText size={38}>
          在 base 模型上 ， 用你的"问题-期望回答"数据训练 ， 让它在你的任务上更好。
        </CardText>

        <div
          style={{
            background: '#dbeafe',
            border: '3px solid ' + INK,
            borderRadius: 14,
            padding: '20px 28px',
            fontFamily: PEN,
            fontSize: 28,
            color: INK,
            lineHeight: 1.5,
          }}
        >
          · <b>SFT</b>：给大量输入-输出样本直接教<br />
          · <b>LoRA / QLoRA</b>：只训小矩阵 ， 几张消费级 GPU 就行<br />
          · <b>DPO / RLHF</b>：教模型"偏好"
        </div>

        <div
          style={{
            background: '#fef3c7',
            border: '3px solid ' + INK,
            borderRadius: 14,
            padding: '20px 28px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 32, color: INK_SEPIA, fontWeight: 700, marginBottom: 6 }}>
            何时做
          </div>
          <div style={{ fontFamily: PEN, fontSize: 28, color: INK, lineHeight: 1.5 }}>
            要稳定的<b>输出风格/格式</b> ， 稳定的<b>领域行为</b> ，
            或把工具调用嵌进模型。 有大量"我要它这么答"的样本。
          </div>
        </div>

        <CardText size={28}>代价：几百~几万条标注 ， LoRA 几小时几十刀 ， 全参几天几千刀。</CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
