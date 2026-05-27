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
  slug: 'rerank',
  index: 6,
  total: 7,
  title: '成本权衡',
};

export default function Card6() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <CardSectionHeading>成本权衡</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: PEN, fontSize: 31, color: INK }}>
          <div>· <b style={{ color: INK_RED }}>每次查询多一次 API</b>：几十~几百毫秒延迟</div>
          <div>· <b style={{ color: INK_RED }}>按 (query, doc) 对计费</b>：召回 100 个就算 100 次</div>
          <div>· <b style={{ color: INK_GREEN }}>但塞给 LLM 的 chunk 变少</b>：省 token ， 互相抵消一些</div>
        </div>

        <div
          style={{
            background: '#fef3c7',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '26px 32px',
          }}
        >
          <CardText size={36}>
            <span style={{ color: INK_SEPIA, fontWeight: 700 }}>实战策略</span>：召回 top-50~100 ，
            rerank 后只取 top-3~5 进 prompt。 平衡精度和成本。
          </CardText>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
