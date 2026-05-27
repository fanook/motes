import { INK, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'embedding',
  index: 8,
  total: 10,
  title: '能做什么',
};

type Use = { title: string; line: string; color: string; star?: boolean };

const USES: Use[] = [
  { title: '语义搜索 / RAG', line: '问题和文档都变向量 ， 找最近的几条丢给 LLM', color: '#fef3c7', star: true },
  { title: '聚类', line: '大量未标注文本 ， 按相似度自动分组', color: '#dbeafe' },
  { title: '分类', line: '看 query 离哪个类别向量更近', color: '#fce7f3' },
  { title: '推荐', line: '用户 / 物品变向量 ， 找相似的', color: '#d1fae5' },
  { title: '异常检测', line: '离任何已知簇都远 ， 可能是异常', color: '#ede9fe' },
  { title: '去重 / 内容审核', line: '找近似重复内容', color: '#ffedd5' },
];

export default function Card8() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <CardSectionHeading>Embedding 能做什么</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {USES.map((u) => (
            <div
              key={u.title}
              style={{
                background: u.color,
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '18px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 36, color: INK_SEPIA, fontWeight: 700 }}>
                {u.title}
                {u.star && <span style={{ fontSize: 26, color: INK, marginLeft: 12 }}>← 商用最大场景</span>}
              </div>
              <div style={{ fontFamily: PEN, fontSize: 28, color: INK, lineHeight: 1.35 }}>{u.line}</div>
            </div>
          ))}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
