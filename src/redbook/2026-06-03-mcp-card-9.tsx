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
  index: 9,
  total: 9,
  title: '术语小辞典',
};

type Term = { en: string; ch: string };

const TERMS: Term[] = [
  { en: 'MCP', ch: 'Model Context Protocol' },
  { en: 'Host', ch: '用户使用的 AI 应用' },
  { en: 'Client', ch: 'Host 内对应每个 Server 的连接' },
  { en: 'Server', ch: '对外暴露 tools/resources/prompts 的程序' },
  { en: 'Tools / Resources / Prompts', ch: 'Server 三大原语' },
  { en: 'Sampling / Elicitation', ch: 'Client 反向暴露给 Server 的能力' },
  { en: 'JSON-RPC 2.0', ch: 'MCP 用的消息格式' },
];

export default function Card9() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <CardSectionHeading>术语小辞典</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          {TERMS.map((t, i) => (
            <div
              key={t.en}
              style={{
                background: ['#fef3c7', '#dbeafe', '#fce7f3', '#d1fae5', '#ede9fe', '#ffedd5', '#f3e8ff'][i % 7],
                border: '3px solid ' + INK,
                borderRadius: 12,
                padding: '13px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 29, color: INK_SEPIA, fontWeight: 700 }}>{t.en}</div>
              <div style={{ fontFamily: PEN, fontSize: 25, color: INK, lineHeight: 1.3 }}>{t.ch}</div>
            </div>
          ))}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
