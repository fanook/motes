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
  slug: 'bert',
  index: 4,
  total: 8,
  title: 'MLM',
};

export default function Card4() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <CardSectionHeading>MLM 掩码语言建模</CardSectionHeading>
        <CardText size={36}>
          双向 attention 好 ， 但训练目标怎么定？ 不能用"预测下一个"（那是单向的）。
          BERT 的解法 ——
        </CardText>

        <div
          style={{
            background: '#fef3c7',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '26px 32px',
            fontFamily: PEN,
            fontSize: 34,
            color: INK,
            lineHeight: 1.5,
          }}
        >
          今天 [MASK] 气真好
          <br />
          <span style={{ fontSize: 28, color: INK_SEPIA }}>↓ 用左右两侧上下文预测</span>
          <br />
          [MASK] = <b style={{ color: INK_RED }}>天</b>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: PEN, fontSize: 29, color: INK }}>
          <div>· 随机把句子 15% 的 token 替换成 [MASK]</div>
          <div>· 让模型根据左右上下文预测被遮的词</div>
          <div>· 强制模型用<b>全句信息</b> ， 而不是只看一侧</div>
        </div>

        <CardText size={28}>
          配套还有 NSP（预测两句是否相邻）， 后续发现用处不大 ， RoBERTa 去掉了。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
