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
  slug: 'chain-of-thought',
  index: 5,
  total: 8,
  title: '推理模型',
};

export default function Card5() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <CardSectionHeading>推理模型：CoT 内化</CardSectionHeading>
        <CardText size={38}>
          2024 起 ， Reasoning 模型（OpenAI o 系列、 Claude 4.7 thinking、 DeepSeek R1）
          把思考链<span style={{ color: INK_SEPIA, fontWeight: 700 }}>内化</span>进训练里。
        </CardText>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: PEN, fontSize: 30, color: INK }}>
          <div>· 不需要你写"think step by step"</div>
          <div>· 自动产生很长的内部思考（可能几千 token）</div>
          <div>· 你只看到最终答案 ， 但按 reasoning token 也计费</div>
          <div>· 数学 / 代码 / 逻辑题准确率大幅提升</div>
          <div>· 对 temperature 不敏感 ， 内部思考已定路径</div>
        </div>

        <div
          style={{
            background: '#fef3c7',
            border: '3px solid ' + INK,
            borderRadius: 14,
            padding: '22px 30px',
          }}
        >
          <CardText size={34}>
            <span style={{ color: INK_RED, fontWeight: 700 }}>趋势</span>：CoT 正从
            "用户 prompt 技巧" 演化成 "模型自带能力"。
          </CardText>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
