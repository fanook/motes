import { INK, INK_RED, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'moe',
  index: 6,
  total: 8,
  title: '代价',
};

const COSTS: { title: string; line: string }[] = [
  { title: '显存翻倍', line: '总参数都要加载到显存才能 router 选择 ， 训练 / 部署都更费' },
  { title: '训练不稳定', line: 'router 离散选择难训 ， 容易出现 dead experts（完全闲置）' },
  { title: '分布式复杂', line: '专家分布在不同 GPU ， token 要跨设备路由（all-to-all 通信）' },
  { title: '批次效率受影响', line: '一个 batch 的 token 去不同专家 ， 通信/计算 pattern 比 dense 复杂' },
];

export default function Card6() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <CardSectionHeading>代价</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {COSTS.map((c, i) => (
            <div
              key={c.title}
              style={{
                display: 'flex',
                gap: 18,
                background: '#fef3c7',
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '20px 28px',
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 38, color: INK_RED, fontWeight: 700, minWidth: 44 }}>
                {i + 1}.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontFamily: PEN, fontSize: 33, color: INK_SEPIA, fontWeight: 700 }}>{c.title}</div>
                <div style={{ fontFamily: PEN, fontSize: 27, color: INK, lineHeight: 1.4 }}>{c.line}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
