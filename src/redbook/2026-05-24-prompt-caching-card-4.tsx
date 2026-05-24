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
  index: 4,
  total: 10,
  title: '黄金原则',
};

function PromptLayout({
  blocks,
}: {
  blocks: { label: string; type: 'static' | 'variable'; size: number }[];
}) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
      {blocks.map((b, i) => (
        <div
          key={i}
          style={{
            flex: b.size,
            background: b.type === 'static' ? '#fef3c7' : '#fce7f3',
            border: '3px solid ' + INK,
            borderRadius: 14,
            padding: '24px 18px',
            textAlign: 'center',
            fontFamily: PEN,
            fontSize: 30,
            color: INK,
            minHeight: 130,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <div style={{ fontWeight: 700, color: INK_SEPIA, fontSize: 32 }}>{b.label}</div>
          <div style={{ fontSize: 24, opacity: 0.7 }}>
            {b.type === 'static' ? '静态' : '变量'}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Card3() {
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
        <CardSectionHeading>静态在前 ， 变量在后</CardSectionHeading>
        <CardText size={42}>
          缓存只能从 prompt 开头连续匹配。 任何一个字符变了 ， 后面全部失效。
        </CardText>

        <PromptLayout
          blocks={[
            { label: 'system', type: 'static', size: 1 },
            { label: '工具', type: 'static', size: 1 },
            { label: '长 docs', type: 'static', size: 2 },
            { label: '当前 query', type: 'variable', size: 1 },
          ]}
        />

        <div
          style={{
            display: 'flex',
            gap: 16,
            justifyContent: 'space-between',
            fontFamily: PEN,
            fontSize: 32,
            color: INK,
          }}
        >
          <div>← 缓存住</div>
          <div style={{ color: INK_RED }}>变 →</div>
        </div>

        <CardText size={40}>
          <span style={{ color: INK_RED, fontWeight: 700 }}>错例</span>：把
          "今天日期" / 用户名 放最前 ， 一变就 cache miss ， 等于白开。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
