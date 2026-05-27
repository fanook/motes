import { INK, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'mcp',
  index: 6,
  total: 9,
  title: '一次会话',
};

const STEPS: string[] = [
  'Client 发 initialize ， 报告自己能力',
  'Server 回应 ， 报告支持哪些原语',
  'Client 发 tools/list ， 拿到工具清单',
  '用户对话 → LLM 决定调工具 → Client 发 tools/call',
  'Server 执行 ， 返回结果',
  '结果回到 LLM ， 继续对话',
];

export default function Card6() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <CardSectionHeading>一次会话的样子</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          {STEPS.map((s, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 18,
                alignItems: 'center',
                background: '#fef3c7',
                border: '3px solid ' + INK,
                borderRadius: 13,
                padding: '16px 24px',
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 34, color: INK_SEPIA, fontWeight: 700, minWidth: 44 }}>
                {i + 1}
              </div>
              <div style={{ fontFamily: PEN, fontSize: 28, color: INK, lineHeight: 1.35 }}>{s}</div>
            </div>
          ))}
        </div>

        <div style={{ fontFamily: PEN, fontSize: 27, color: INK, opacity: 0.7 }}>
          Server 状态变化时主动发 list_changed 通知 ， Client 刷新工具清单。
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
