import { INK, INK_GREEN, INK_SEPIA } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  CardText,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'vector-db',
  index: 2,
  total: 8,
  title: '核心问题 ANN',
};

export default function Card2() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <CardSectionHeading>它解决的核心问题</CardSectionHeading>
        <CardText size={40}>
          在百万、 上亿个向量里 ， "找最像的前 k 个" —— 靠的是
          <span style={{ color: INK_SEPIA, fontWeight: 700 }}> ANN（近似最近邻）</span>。
        </CardText>

        <div
          style={{
            background: '#fef3c7',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '26px 32px',
          }}
        >
          <CardText size={40}>
            关键词是 <b>"近似"</b>：不保证返回真·最近的那个 ，
            只保证大概率返回前 k 个中的大多数。 用<b>召回率</b>（recall@k）衡量精度。
          </CardText>
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
          <CardText size={44}>
            把 <b>O(n)</b> 查询降到{' '}
            <span style={{ color: INK_GREEN, fontWeight: 700 }}>O(log n)</span>
            <br />
            百万向量也能毫秒级返回
          </CardText>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
