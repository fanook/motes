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
  index: 9,
  total: 10,
  title: '几个坑',
};

type Pitfall = { title: string; line: string };

const PITS: Pitfall[] = [
  {
    title: 'prompt 改一个字 ， 全失效',
    line: '前缀字节级比对。 加个空格 / 换标点 → 后面全部 miss。',
  },
  {
    title: '把变量放前面',
    line: '"今天日期" / 用户名放最前 → 每次都新的 → 缓存形同虚设。',
  },
  {
    title: '工具定义变了 → 全失效',
    line: 'Anthropic 层级 tools → system → messages 。 上游变 ， 下游全作废。',
  },
  {
    title: '太短不缓存',
    line: '< 1024 / 4096 token 直接跳过 (不报错 ， 只是没省) 。',
  },
  {
    title: 'TTL 过期 + 跨 workspace',
    line: '默认 5 分钟没调用就清。 dev / prod 缓存互不可见。',
  },
  {
    title: '第一次永远没命中',
    line: 'cache 冷启动。 第一次比正常贵 1.25× ， 第二次起才省。',
  },
];

export default function Card7() {
  return (
    <RedbookCard>
      <div
        style={{
          padding: '110px 90px 0 90px',
          display: 'flex',
          flexDirection: 'column',
          gap: 30,
        }}
      >
        <CardSectionHeading>几个常见的坑</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {PITS.map((p, i) => (
            <div
              key={p.title}
              style={{
                display: 'flex',
                gap: 18,
                background: '#fef3c7',
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '20px 28px',
              }}
            >
              <div
                style={{
                  fontFamily: PEN,
                  fontSize: 40,
                  color: INK_RED,
                  fontWeight: 700,
                  minWidth: 48,
                }}
              >
                {i + 1}.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontFamily: PEN, fontSize: 36, color: INK_SEPIA, fontWeight: 700 }}>
                  {p.title}
                </div>
                <div style={{ fontFamily: PEN, fontSize: 28, color: INK }}>{p.line}</div>
              </div>
            </div>
          ))}
        </div>

        <CardText size={36}>
          想验证：拿同一段 prompt 调两次 ， 看返回的{' '}
          <span style={{ color: INK_SEPIA, fontWeight: 700 }}>cache_read_input_tokens</span>{' '}
          是不是大于 0。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
