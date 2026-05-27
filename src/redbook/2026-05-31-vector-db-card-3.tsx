import { INK, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'vector-db',
  index: 3,
  total: 8,
  title: '三种索引算法',
};

const ALGOS: { name: string; line: string; pro: string; color: string }[] = [
  {
    name: 'HNSW（最主流）',
    line: '把向量连成多层图 ， 上层稀疏跨长距离 ， 下层密集精定位 ， 贪心逐层下降',
    pro: '召回高、 延迟低 ， 但内存占用大',
    color: '#d1fae5',
  },
  {
    name: 'IVF 倒排聚类',
    line: '先 k-means 聚类分簇 ， 查询时只在最近的几个簇里穷举',
    pro: '内存友好 ， 召回略低 ， 要调探针数',
    color: '#dbeafe',
  },
  {
    name: 'PQ 乘积量化',
    line: '高维向量切段压缩 ， 1536维 6KB → 24~64 字节',
    pro: '超大规模（10亿+）省内存 ， 常和 IVF/HNSW 组合',
    color: '#fce7f3',
  },
];

export default function Card3() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <CardSectionHeading>三种主流索引算法</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {ALGOS.map((a) => (
            <div
              key={a.name}
              style={{
                background: a.color,
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '20px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 34, color: INK_SEPIA, fontWeight: 700 }}>{a.name}</div>
              <div style={{ fontFamily: PEN, fontSize: 27, color: INK, lineHeight: 1.4 }}>{a.line}</div>
              <div style={{ fontFamily: PEN, fontSize: 25, color: INK, opacity: 0.7 }}>→ {a.pro}</div>
            </div>
          ))}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
