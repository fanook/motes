import { INK, INK_SEPIA } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  CardText,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'prompt-caching',
  index: 2,
  total: 10,
  title: '是什么',
};

export default function Card2() {
  return (
    <RedbookCard>
      <div
        style={{
          padding: '110px 90px 0 90px',
          display: 'flex',
          flexDirection: 'column',
          gap: 40,
        }}
      >
        <CardSectionHeading>是什么</CardSectionHeading>
        <CardText size={42}>
          每次调 AI ， <span style={{ color: INK_SEPIA, fontWeight: 700 }}>system prompt</span>
          + 工具描述 + 长 context 都要从头算一遍 ， 而它们其实没变过。
        </CardText>

        <div
          style={{
            background: '#dbeafe',
            border: '3px solid ' + INK,
            borderRadius: 20,
            padding: '36px 48px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <CardText size={52}>
            <span style={{ color: INK_SEPIA, fontWeight: 700 }}>Prompt Caching</span>
          </CardText>
          <CardText size={40}>
            把没变过的那部分 <b>缓存住</b> ， 下次直接复用。
          </CardText>
        </div>

        <CardText size={40}>
          原理：LLM 把上下文转成
          <span style={{ color: INK_SEPIA, fontWeight: 700 }}> KV cache</span>
          （键值缓存）。 缓存住的部分 ， 下次跳过计算 ， 价格降到 1/10。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
