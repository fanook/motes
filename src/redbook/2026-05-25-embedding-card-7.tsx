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
  slug: 'embedding',
  index: 7,
  total: 10,
  title: '主流模型',
};

type Cell = { label: string; bold?: boolean };

function Row({ cells, header = false }: { cells: Cell[]; header?: boolean }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2.1fr 1.3fr 0.9fr 1fr',
        background: header ? '#fef3c7' : 'transparent',
        borderBottom: '2px solid ' + INK,
      }}
    >
      {cells.map((c, i) => (
        <div
          key={i}
          style={{
            padding: '16px 16px',
            fontFamily: PEN,
            fontSize: header ? 28 : 26,
            color: header ? INK_SEPIA : INK,
            fontWeight: header || c.bold ? 700 : 400,
            borderRight: i < cells.length - 1 ? '2px solid ' + INK : 'none',
            lineHeight: 1.35,
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
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <CardSectionHeading>主流模型 (2026)</CardSectionHeading>

        <div style={{ border: '3px solid ' + INK, borderRadius: 14, overflow: 'hidden' }}>
          <Row header cells={[{ label: '模型' }, { label: '维度' }, { label: 'ctx' }, { label: '$/1M' }]} />
          <Row cells={[{ label: 'text-embedding-3-large', bold: true }, { label: '3072 ↓可缩' }, { label: '8K' }, { label: '$0.13' }]} />
          <Row cells={[{ label: 'text-embedding-3-small', bold: true }, { label: '1536 ↓可缩' }, { label: '8K' }, { label: '$0.02' }]} />
          <Row cells={[{ label: 'voyage-4-large', bold: true }, { label: '256~2048' }, { label: '32K' }, { label: '见官网' }]} />
          <Row cells={[{ label: 'voyage-code-3', bold: true }, { label: '1024 ↓可缩' }, { label: '32K' }, { label: '代码专用' }]} />
        </div>

        <CardText size={36}>
          挑选参考 <span style={{ color: INK_SEPIA, fontWeight: 700 }}>MTEB 排行榜</span>
          （Massive Text Embedding Benchmark）—— embedding 业界事实标准评测。
        </CardText>
        <CardText size={28}>* 价格易变 ， 实际以官网为准。</CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
