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
  index: 7,
  total: 9,
  title: '为什么关心',
};

const REASONS: { title: string; line: string }[] = [
  { title: '写一次 ， 多处用', line: '给内部数据写一个 MCP server ， Claude / ChatGPT / Cursor 都能接' },
  { title: '不绑定模型厂商', line: 'function calling 各家格式不同 ， MCP 把它抽象走' },
  { title: '生态正在膨胀', line: '官方/社区已有数百个现成 server（GitHub / Slack / Notion…）' },
  { title: '可审计', line: '协议明确 ， 每个 tool call、 每次数据访问都看得见' },
];

export default function Card7() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <CardSectionHeading>为什么开发者关心</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {REASONS.map((r, i) => (
            <div
              key={r.title}
              style={{
                background: ['#fef3c7', '#dbeafe', '#fce7f3', '#d1fae5'][i],
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '20px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 34, color: INK_SEPIA, fontWeight: 700 }}>{r.title}</div>
              <div style={{ fontFamily: PEN, fontSize: 28, color: INK, lineHeight: 1.4 }}>{r.line}</div>
            </div>
          ))}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
