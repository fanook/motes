import { INK, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'prompt-caching',
  index: 10,
  total: 10,
  title: '术语小辞典',
};

type Term = { en: string; ch: string };

const TERMS: Term[] = [
  { en: 'KV cache', ch: '键值缓存 ， 注意力层算出的 K / V 张量' },
  { en: 'Prompt caching', ch: '把 KV cache 跨请求持久化复用' },
  { en: 'PagedAttention', ch: '按块管理 KV ， 像操作系统的虚拟内存分页' },
  { en: 'Prefix matching', ch: '前缀匹配 ， 改一字哈希链就断' },
  { en: 'TTL', ch: 'Time to live ， 缓存活多久 (默认 5 分钟)' },
  { en: 'cache_control', ch: 'Anthropic 显式标记 "这段要缓存"' },
  { en: 'cache_read_input_tokens', ch: 'API 返回字段 ， 用来验证缓存命中' },
];

export default function Card10() {
  return (
    <RedbookCard>
      <div
        style={{
          padding: '110px 90px 0 90px',
          display: 'flex',
          flexDirection: 'column',
          gap: 26,
        }}
      >
        <CardSectionHeading>术语小辞典</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {TERMS.map((t, i) => (
            <div
              key={t.en}
              style={{
                background: ['#fef3c7', '#dbeafe', '#fce7f3', '#d1fae5', '#ede9fe', '#ffedd5', '#f3e8ff'][i % 7],
                border: '3px solid ' + INK,
                borderRadius: 12,
                padding: '14px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 32, color: INK_SEPIA, fontWeight: 700 }}>
                {t.en}
              </div>
              <div style={{ fontFamily: PEN, fontSize: 26, color: INK, lineHeight: 1.4 }}>
                {t.ch}
              </div>
            </div>
          ))}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
