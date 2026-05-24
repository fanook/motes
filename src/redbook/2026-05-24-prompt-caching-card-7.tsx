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
  index: 7,
  total: 10,
  title: 'Anthropic vs OpenAI',
};

type Cell = { label: string; bold?: boolean };

function Row({ cells, header = false }: { cells: Cell[]; header?: boolean }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.6fr 1.7fr 1.7fr',
        background: header ? '#fef3c7' : 'transparent',
        borderBottom: '2px solid ' + INK,
      }}
    >
      {cells.map((c, i) => (
        <div
          key={i}
          style={{
            padding: '18px 22px',
            fontFamily: PEN,
            fontSize: header ? 32 : 28,
            color: header ? INK_SEPIA : INK,
            fontWeight: header || c.bold ? 700 : 400,
            borderRight: i < cells.length - 1 ? '2px solid ' + INK : 'none',
            lineHeight: 1.4,
          }}
        >
          {c.label}
        </div>
      ))}
    </div>
  );
}

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
        <CardSectionHeading>Anthropic vs OpenAI</CardSectionHeading>

        <div
          style={{
            border: '3px solid ' + INK,
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          <Row
            header
            cells={[{ label: '维度' }, { label: 'Anthropic' }, { label: 'OpenAI' }]}
          />
          <Row
            cells={[
              { label: '触发方式', bold: true },
              { label: '显式 cache_control' },
              { label: '完全自动' },
            ]}
          />
          <Row
            cells={[
              { label: '最小可缓存', bold: true },
              { label: '1,024 / 4,096 token' },
              { label: '1,024 token' },
            ]}
          />
          <Row
            cells={[
              { label: '默认 TTL', bold: true },
              { label: '5 分钟' },
              { label: '5~10 分钟' },
            ]}
          />
          <Row
            cells={[
              { label: '最长 TTL', bold: true },
              { label: '1 小时' },
              { label: '24 小时 (extended)' },
            ]}
          />
          <Row
            cells={[
              { label: '命中折扣', bold: true },
              { label: '0.1× (省 90%)' },
              { label: '最多 0.1×' },
            ]}
          />
        </div>

        <div
          style={{
            fontFamily: PEN,
            fontSize: 30,
            color: INK,
            background: '#dbeafe',
            border: '3px solid ' + INK,
            borderRadius: 14,
            padding: '20px 28px',
            lineHeight: 1.5,
          }}
        >
          <b>Anthropic</b>：你显式控 ， 哪段缓存清楚。{' '}
          <b>OpenAI</b>：省心 ， 用{' '}
          <span style={{ color: INK_SEPIA, fontWeight: 700 }}>prompt_cache_key</span>{' '}
          帮助路由同台机器。
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
