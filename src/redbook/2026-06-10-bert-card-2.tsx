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
  index: 2,
  total: 8,
  title: 'Word2Vec 的问题',
};

export default function Card2() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <CardSectionHeading>它解决了什么</CardSectionHeading>
        <CardText size={40}>
          上一辈 Word2Vec / GloVe 的死穴：
          <span style={{ color: INK_RED, fontWeight: 700 }}> 一词一向量</span>。
        </CardText>

        <div
          style={{
            background: '#fee2e2',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '28px 32px',
            fontFamily: PEN,
            fontSize: 40,
            color: INK,
            lineHeight: 1.5,
          }}
        >
          "<b>苹果</b>手机" 和 "<b>苹果</b>好吃"
          <br />
          里的苹果 ， 是<b style={{ color: INK_RED }}>同一个</b> embedding —— 完全没上下文。
        </div>

        <div
          style={{
            background: '#d1fae5',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '28px 32px',
          }}
        >
          <CardText size={40}>
            BERT 用 Transformer 给同一个词在不同句子里输出
            <span style={{ color: INK_SEPIA, fontWeight: 700 }}>不同的 embedding</span>。
            这是它的根本贡献。
          </CardText>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
