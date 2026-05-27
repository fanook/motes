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
  slug: 'rag',
  index: 2,
  total: 9,
  title: '是什么 + 为什么',
};

export default function Card2() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <CardSectionHeading>RAG = 开卷答题</CardSectionHeading>

        <div
          style={{
            background: '#d1fae5',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '26px 32px',
          }}
        >
          <CardText size={42}>
            把"模型凭记忆答" ， 换成
            <span style={{ color: INK_GREEN, fontWeight: 700 }}>"先查资料 ， 再照着答"</span>。
            现代 AI 产品的事实地基。
          </CardText>
        </div>

        <CardText size={38}>
          "既然有 1M context ， 把整个知识库塞进去不就行？" —— 不行 ， 三个原因：
        </CardText>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontFamily: PEN, fontSize: 32, color: INK }}>
          <div>· <b style={{ color: INK_RED }}>知识库远大于 1M</b>：公司 wiki 动辄百万 chunk</div>
          <div>· <b style={{ color: INK_RED }}>每次重塞太贵</b>：1M token 每天 10 万次 = 几十万刀</div>
          <div>· <b style={{ color: INK_RED }}>丢失中间</b>：塞满 1M ， 中段召回也低</div>
        </div>

        <CardText size={34}>
          RAG 收益：只把相关的几 K token 喂给模型 ， 其余百万都不参与计算。
          <span style={{ color: INK_SEPIA, fontWeight: 700 }}>成本、 准确率双赢。</span>
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
