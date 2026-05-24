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
  slug: 'prompt-caching',
  index: 3,
  total: 10,
  title: '工作原理',
};

export default function Card3() {
  return (
    <RedbookCard>
      <div
        style={{
          padding: '110px 90px 0 90px',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        <CardSectionHeading>到底缓存了什么</CardSectionHeading>

        <CardText size={36}>
          Transformer 每个 token 进入注意力层 ， 都会算出
          <span style={{ color: INK_SEPIA, fontWeight: 700 }}> Q / K / V</span> 三组向量。
          K、 V 算完就不会变 —— 这就是 <b>KV cache</b> 来源。
        </CardText>

        <div
          style={{
            background: '#dbeafe',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '24px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 32, color: INK_SEPIA, fontWeight: 700 }}>
            实现：块级哈希（PagedAttention）
          </div>
          <div style={{ fontFamily: PEN, fontSize: 28, color: INK, lineHeight: 1.55 }}>
            · token 序列按 <b>16 个 / 块</b> 切分（vLLM 默认）
            <br />
            · 每块 hash ={' '}
            <span style={{ color: INK_SEPIA, fontWeight: 700 }}>hash(父块, 本块)</span>{' '}
            ， 串成 hash 链
            <br />
            · 命中的块 → 跳过整段 prefill 计算 ， 直接读 KV
          </div>
        </div>

        <CardText size={32}>
          <span style={{ color: INK_RED, fontWeight: 700 }}>为什么必须前缀？</span>
          因为 hash 链是连着的 —— 改一个字 ， 链从此处断 ， 后面块全部算 "新" 。
        </CardText>

        <div style={{ fontFamily: PEN, fontSize: 24, color: INK, opacity: 0.6 }}>
          学术起点：Kwon et al. 2023 《PagedAttention》。 SGLang 的 RadixAttention 进一步支持 "分叉前缀" 共享。
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
