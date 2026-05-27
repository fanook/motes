import { INK, INK_GREEN, INK_SEPIA, PEN } from '../components/handwriting';
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
  index: 7,
  total: 8,
  title: '为什么不火了',
};

export default function Card7() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <CardSectionHeading>为什么"不火了"</CardSectionHeading>
        <CardText size={38}>
          2022 ChatGPT 之后 ， 注意力都转向生成式（decoder-only）。 但 BERT 没消失 ，
          只是变成了<span style={{ color: INK_SEPIA, fontWeight: 700 }}>后台基础设施</span>：
        </CardText>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontFamily: PEN, fontSize: 30, color: INK }}>
          <div>· 你用 RAG 的 embedding ， 背后大概率是 BERT 家族</div>
          <div>· 搜索引擎的 query understanding ， 大概率是 BERT 家族</div>
          <div>· 分类 / 抽取 / 标注 ， 仍是 BERT 类模型最高效</div>
        </div>

        <div
          style={{
            background: '#d1fae5',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '26px 32px',
            textAlign: 'center',
          }}
        >
          <CardText size={38}>
            <span style={{ color: INK_GREEN, fontWeight: 700 }}>generation 是 decoder 的天下 ，
            understanding 仍是 BERT 的天下。</span>
          </CardText>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
