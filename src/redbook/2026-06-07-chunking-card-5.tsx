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
  slug: 'chunking',
  index: 5,
  total: 8,
  title: '加 metadata',
};

export default function Card5() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <CardSectionHeading>别忘了加 metadata</CardSectionHeading>
        <CardText size={36}>
          每个 chunk 除了文本 ， 还该带元数据 —— 这是最容易被忽略的优化：
        </CardText>

        <div
          style={{
            background: '#fef3c7',
            border: '3px solid ' + INK,
            borderRadius: 14,
            padding: '20px 28px',
            fontFamily: PEN,
            fontSize: 29,
            color: INK,
            lineHeight: 1.5,
          }}
        >
          来源文档 / URL · 所在章节标题 · 页码 / 位置 · 时间戳 · 类型标签（spec/FAQ）
        </div>

        <CardText size={34}>这些元数据在 RAG 时能：</CardText>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: PEN, fontSize: 28, color: INK }}>
          <div>· 预先过滤："只在 2024 年后的 spec 里检索"</div>
          <div>· 给 LLM 引用时标注来源</div>
          <div>· <b style={{ color: INK_SEPIA }}>父子合并</b>：召回小 chunk ， 回拉它所在的大段落</div>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
