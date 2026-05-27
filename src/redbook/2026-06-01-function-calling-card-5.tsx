import { INK, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  CardText,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'function-calling',
  index: 5,
  total: 8,
  title: '调用返回什么',
};

const CALL = `tool_call {
  id:   "call_abc123"
  name: "get_weather"
  args: { city: "北京", unit: "c" }
}`;

export default function Card5() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <CardSectionHeading>模型调用时返回什么</CardSectionHeading>
        <CardText size={38}>
          不是自然语言 ， 而是一个<b style={{ color: INK_SEPIA }}>结构化 block</b>：
        </CardText>

        <div
          style={{
            background: '#fef3c7',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '28px 34px',
            fontFamily: PEN,
            fontSize: 33,
            color: INK,
            whiteSpace: 'pre',
            lineHeight: 1.55,
          }}
        >
          {CALL}
        </div>

        <CardText size={36}>
          应用代码 parse 这个 block ， 执行真实函数 ， 把结果作为
          <span style={{ color: INK_SEPIA, fontWeight: 700 }}> tool_result</span> 再喂回模型。
        </CardText>

        <div style={{ fontFamily: PEN, fontSize: 28, color: INK, opacity: 0.7 }}>
          Anthropic 用 content-block 数组 ， OpenAI 放 message 的 tool_calls 字段 —— 语义一样 ， 字段名不同。 想跨厂商用 MCP 抽象层。
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
