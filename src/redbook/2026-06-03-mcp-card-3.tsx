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
  index: 3,
  total: 9,
  title: '三个参与方',
};

const PARTIES: { name: string; line: string; color: string }[] = [
  { name: 'Host', line: '用户实际打开的 AI 应用（Claude Desktop / Cursor / VSCode）', color: '#fef3c7' },
  { name: 'Client', line: 'Host 内部的连接管理器 ， 每对接一个 Server 实例化一个', color: '#dbeafe' },
  { name: 'Server', line: '向外暴露能力的程序 ， 可本地（stdio）或远程（HTTP）', color: '#d1fae5' },
];

const TREE = `Host (Cursor)
├─ Client 1 ←→ Server A (文件系统, stdio)
├─ Client 2 ←→ Server B (Postgres, stdio)
└─ Client 3 ←→ Server C (Sentry, HTTP)`;

export default function Card3() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 80px 0 80px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <CardSectionHeading>三个参与方</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {PARTIES.map((p) => (
            <div
              key={p.name}
              style={{
                background: p.color,
                border: '3px solid ' + INK,
                borderRadius: 13,
                padding: '16px 24px',
                display: 'flex',
                gap: 18,
                alignItems: 'baseline',
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 34, color: INK_SEPIA, fontWeight: 700, minWidth: 130 }}>
                {p.name}
              </div>
              <div style={{ fontFamily: PEN, fontSize: 25, color: INK, lineHeight: 1.35 }}>{p.line}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: '#fdf6e3',
            border: '3px solid ' + INK,
            borderRadius: 14,
            padding: '22px 26px',
            fontFamily: PEN,
            fontSize: 27,
            color: INK,
            whiteSpace: 'pre',
            lineHeight: 1.6,
          }}
        >
          {TREE}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
