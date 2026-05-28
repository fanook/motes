import { INK, INK_GREEN, INK_RED } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  CardText,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'mcp',
  index: 2,
  total: 9,
  title: '解决什么',
};

export default function Card2() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <CardSectionHeading>它解决什么</CardSectionHeading>
        <CardText size={38}>
          想让 Cursor 查你的 Notion、 想让自己的 SaaS 被 Claude/ChatGPT 都能调 —— 以前每对组合都要写一次胶水代码。
        </CardText>

        <div
          style={{
            background: '#fee2e2',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '28px 32px',
            textAlign: 'center',
          }}
        >
          <CardText size={46}>
            之前：N 个客户端 × M 个服务
            <br />
            = <span style={{ color: INK_RED, fontWeight: 700 }}>N × M 次集成</span>
          </CardText>
        </div>

        <div
          style={{
            background: '#d1fae5',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '28px 32px',
            textAlign: 'center',
          }}
        >
          <CardText size={46}>
            MCP 之后：各实现一次
            <br />
            = <span style={{ color: INK_GREEN, fontWeight: 700 }}>N + M</span>
          </CardText>
        </div>

        <CardText size={36}>
          每个客户端实现一次 MCP client ， 每个服务实现一次 MCP server ， 之后随意组合。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
