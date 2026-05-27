import { INK, INK_RED, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'function-calling',
  index: 6,
  total: 8,
  title: '实战要点',
};

const POINTS: { title: string; line: string }[] = [
  { title: '工具数量别爆', line: '每个工具的描述都进 prompt 算 token ， 几十个轻松吃几千 token' },
  { title: 'description 是 prompt 的一部分', line: '写清"什么场景该用" ， 模型调对率更高' },
  { title: '参数严格 schema', line: '用 JSON Schema 约束必填 / 类型 / 枚举 ， 别让模型自由发挥' },
  { title: '错误也要反馈', line: '工具失败时把错误信息返回给模型 ， 它会调整策略' },
  { title: '幂等性', line: '关键操作（下单 / 转账）务必带幂等键 ， 防重复调用' },
  { title: '超时', line: '工具响应慢会拖累整个对话 ， 给每个工具设超时' },
];

export default function Card6() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <CardSectionHeading>几个实战要点</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {POINTS.map((p, i) => (
            <div
              key={p.title}
              style={{
                display: 'flex',
                gap: 16,
                background: '#fef3c7',
                border: '3px solid ' + INK,
                borderRadius: 13,
                padding: '15px 24px',
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 32, color: INK_RED, fontWeight: 700, minWidth: 40 }}>
                {i + 1}.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ fontFamily: PEN, fontSize: 30, color: INK_SEPIA, fontWeight: 700 }}>{p.title}</div>
                <div style={{ fontFamily: PEN, fontSize: 25, color: INK, lineHeight: 1.35 }}>{p.line}</div>
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
