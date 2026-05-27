import { INK, INK_RED, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'mcp',
  index: 8,
  total: 9,
  title: '坑',
};

const PITS: { title: string; line: string }[] = [
  { title: '权限 / 安全', line: 'Server 能干啥用户能干啥 ， 滥用容易把敏感数据泄进 LLM 上下文' },
  { title: 'tool 数量爆', line: '接 10 个 server ， 总工具几十上百 ， tools/list 就吃 token' },
  { title: '状态管理', line: 'Server 有状态 ， 网络抖动 / 重连要处理好' },
  { title: '版本协商', line: '协议在演进 ， Client / Server 要互相支持' },
];

export default function Card8() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <CardSectionHeading>几个坑</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {PITS.map((p, i) => (
            <div
              key={p.title}
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
                <div style={{ fontFamily: PEN, fontSize: 33, color: INK_SEPIA, fontWeight: 700 }}>{p.title}</div>
                <div style={{ fontFamily: PEN, fontSize: 27, color: INK, lineHeight: 1.4 }}>{p.line}</div>
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
