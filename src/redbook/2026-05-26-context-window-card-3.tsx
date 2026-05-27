import { INK, INK_RED, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  CardText,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'context-window',
  index: 3,
  total: 9,
  title: '二次复杂度',
};

export default function Card3() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 36 }}>
        <CardSectionHeading>为什么变大这么难</CardSectionHeading>
        <CardText size={40}>
          Transformer 的核心是 <b style={{ color: INK_SEPIA }}>自注意力</b>：
          每个 token 都要跟所有其他 token 算一次相关性。
        </CardText>

        <div
          style={{
            background: '#fee2e2',
            border: '3px solid ' + INK,
            borderRadius: 20,
            padding: '40px 32px',
            textAlign: 'center',
            fontFamily: PEN,
            fontSize: 60,
            color: INK_RED,
            fontWeight: 700,
          }}
        >
          n 个 token = O(n²) 计算量
        </div>

        <CardText size={40}>
          n 从 2K 到 2M ， 差距是 <span style={{ color: INK_RED, fontWeight: 700 }}>百万倍</span>。 后果：
        </CardText>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: PEN, fontSize: 36, color: INK }}>
          <div>· 计算成本飞涨</div>
          <div>· 显存占用飞涨（KV cache 也是 O(n)）</div>
          <div>· 首字延迟（TTFT）显著拖长</div>
        </div>

        <CardText size={30}>
          业界靠 sliding window / sparse / FlashAttention 等逼近优化 ， 但长上下文本质上仍然贵、 慢。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
