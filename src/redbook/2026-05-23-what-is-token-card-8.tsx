import { useEffect, useRef } from 'react';
import rough from 'roughjs';
import { INK, INK_RED, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'what-is-token',
  index: 8,
  total: 9,
  title: '价格横评 + CTA',
};

type Row = { name: string; price: number; color: string };

function PriceBars({ rows }: { rows: Row[] }) {
  const ref = useRef<SVGSVGElement>(null);
  const max = Math.max(...rows.map((r) => r.price));
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    rows.forEach((r, i) => {
      const y = i * 100;
      // 模型名
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', '0');
      t.setAttribute('y', String(y + 56));
      t.setAttribute('font-family', PEN);
      t.setAttribute('font-size', '34');
      t.setAttribute('fill', INK);
      t.textContent = r.name;
      svg.appendChild(t);
      // bar
      const w = (r.price / max) * 460;
      svg.appendChild(
        rc.rectangle(360, y + 16, w, 60, {
          stroke: INK,
          strokeWidth: 3,
          roughness: 1.4,
          fill: r.color,
          fillStyle: 'solid',
          seed: 20 + i,
        })
      );
      // 价格标签
      const v = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      v.setAttribute('x', String(360 + w + 18));
      v.setAttribute('y', String(y + 56));
      v.setAttribute('font-family', PEN);
      v.setAttribute('font-size', '34');
      v.setAttribute('fill', INK);
      v.textContent = `$${r.price}`;
      svg.appendChild(v);
    });
  }, [rows]);
  const height = rows.length * 100;
  return <svg ref={ref} viewBox={`0 0 900 ${height}`} width={900} height={height} />;
}

export default function Card7() {
  return (
    <RedbookCard>
      <div
        style={{
          padding: '110px 90px 0 90px',
          display: 'flex',
          flexDirection: 'column',
          gap: 36,
        }}
      >
        <CardSectionHeading>主流模型 input 价格 / 1M token</CardSectionHeading>

        <PriceBars
          rows={[
            { name: 'GPT-4o-mini', price: 0.15, color: '#d1fae5' },
            { name: 'Claude Haiku 4.5', price: 1, color: '#dbeafe' },
            { name: 'GPT-4o', price: 2.5, color: '#fef3c7' },
            { name: 'Claude Sonnet 4.6', price: 3, color: '#fce7f3' },
          ]}
        />

        <div
          style={{
            fontFamily: PEN,
            fontSize: 38,
            color: INK,
            background: '#fef3c7',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '24px 32px',
            lineHeight: 1.5,
            marginTop: 8,
          }}
        >
          差价能 <span style={{ color: INK_SEPIA, fontWeight: 700 }}>20×</span>。
          做产品先想清楚： 哪些用顶配 ， 哪些便宜模型够用。
        </div>

        <div
          style={{
            fontFamily: PEN,
            fontSize: 28,
            color: INK_RED,
            marginTop: 12,
          }}
        >
          * 价格以官方为准
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
