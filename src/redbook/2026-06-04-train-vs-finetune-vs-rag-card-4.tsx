import { INK, INK_GREEN, PEN } from '../components/handwriting';
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
  index: 4,
  total: 8,
  title: 'RAG',
};

export default function Card4() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <CardSectionHeading>③ 检索增强 RAG</CardSectionHeading>
        <CardText size={40}>
          模型<b>不变</b> ， 把权威资料检索后塞进 prompt —— 让它"开卷答"。
        </CardText>

        <div
          style={{
            background: '#d1fae5',
            border: '3px solid ' + INK,
            borderRadius: 14,
            padding: '20px 28px',
            fontFamily: PEN,
            fontSize: 28,
            color: INK,
            lineHeight: 1.5,
          }}
        >
          · 数据：你已有的文档库即可<br />
          · 算力：embedding + 向量库 ， 单机起步<br />
          · 难点：切块 / 召回 / rerank 的工程实现
        </div>

        <div
          style={{
            background: '#fef3c7',
            border: '3px solid ' + INK,
            borderRadius: 14,
            padding: '20px 28px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 32, color: INK_GREEN, fontWeight: 700, marginBottom: 6 }}>
            何时做
          </div>
          <div style={{ fontFamily: PEN, fontSize: 28, color: INK, lineHeight: 1.5 }}>
            要回答<b>训练时不知道的事实</b>（内部数据/实时）；
            知识<b>频繁更新</b>；需要<b>可追溯来源</b>；知识库远大于 context。
          </div>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
