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
  index: 5,
  total: 9,
  title: '反向能力 + 传输',
};

export default function Card5() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <CardSectionHeading>反向能力 + 传输层</CardSectionHeading>

        <div
          style={{
            background: '#ede9fe',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '22px 30px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 32, color: INK_SEPIA, fontWeight: 700, marginBottom: 8 }}>
            Client 反向暴露给 Server
          </div>
          <div style={{ fontFamily: PEN, fontSize: 28, color: INK, lineHeight: 1.5 }}>
            · <b>Sampling</b>：Server 想用 LLM 但不自己集成 → 让 Host 帮调<br />
            · <b>Elicitation</b>：Server 要更多输入 / 确认 → 让 Host 弹框<br />
            · <b>Logging</b>：Server 把日志发回 Client 方便调试
          </div>
        </div>

        <div
          style={{
            background: '#dbeafe',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '22px 30px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 32, color: INK_SEPIA, fontWeight: 700, marginBottom: 8 }}>
            传输层（跑在 JSON-RPC 2.0 上）
          </div>
          <div style={{ fontFamily: PEN, fontSize: 28, color: INK, lineHeight: 1.5 }}>
            · <b>stdio</b>：本地进程通信 ， 性能最好 ， 适合本地 server<br />
            · <b>HTTP + SSE</b>：远程 ， 支持 OAuth ， 适合 SaaS server
          </div>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
