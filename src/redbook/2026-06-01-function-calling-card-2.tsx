import { INK, INK_GREEN, INK_SEPIA, PEN } from '../components/handwriting';
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
  index: 2,
  total: 8,
  title: '是什么',
};

export default function Card2() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <CardSectionHeading>它是什么</CardSectionHeading>
        <CardText size={42}>
          LLM 本身只会"生成文字"。 Function Calling 让它能
          <span style={{ color: INK_SEPIA, fontWeight: 700 }}>主动调用外部工具</span>
          —— 查天气、 跑 SQL、 发邮件、 算数。
        </CardText>

        <div
          style={{
            background: '#d1fae5',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '30px 32px',
            textAlign: 'center',
          }}
        >
          <CardText size={46}>
            把"会说话"的 LLM
            <br />
            升级成{' '}
            <span style={{ color: INK_GREEN, fontWeight: 700 }}>"会按按钮"的 Agent</span>
          </CardText>
        </div>

        <CardText size={38}>
          模型不直接执行 —— 它返回一个<b>结构化请求</b>说"我要调 weather(北京)" ，
          你的代码去执行 ， 再把结果回传给它。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
