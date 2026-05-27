import { useEffect, useRef } from 'react';
import rough from 'roughjs';
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
  slug: 'context-window',
  index: 2,
  total: 9,
  title: '现在到哪一档',
};

function ModelBars() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    const rows = [
      { name: 'GPT-5.5', k: 400, color: '#dbeafe' },
      { name: 'Claude Opus 4.7', k: 1000, color: '#d1fae5' },
      { name: 'Gemini 2.5 Pro', k: 1000, color: '#ede9fe' },
      { name: 'Gemini 3 Pro', k: 2000, color: '#fce7f3' },
    ];
    const max = 2000;
    rows.forEach((r, i) => {
      const y = i * 95;
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', '0');
      t.setAttribute('y', String(y + 52));
      t.setAttribute('font-family', PEN);
      t.setAttribute('font-size', '32');
      t.setAttribute('fill', INK);
      t.textContent = r.name;
      svg.appendChild(t);
      const w = (r.k / max) * 380;
      svg.appendChild(
        rc.rectangle(400, y + 14, w, 56, {
          stroke: INK,
          strokeWidth: 3,
          roughness: 1.4,
          fill: r.color,
          fillStyle: 'solid',
          seed: 10 + i,
        })
      );
      const v = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      v.setAttribute('x', String(400 + w + 16));
      v.setAttribute('y', String(y + 52));
      v.setAttribute('font-family', PEN);
      v.setAttribute('font-size', '32');
      v.setAttribute('fill', INK);
      v.textContent = `${r.k >= 1000 ? r.k / 1000 + 'M' : r.k + 'K'}`;
      svg.appendChild(v);
    });
  }, []);
  return <svg ref={ref} viewBox="0 0 900 390" width={900} height={390} />;
}

export default function Card2() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <CardSectionHeading>现在都到哪一档了</CardSectionHeading>
        <CardText size={38}>
          2026 上半年 ， 主流模型标称的 input context window：
        </CardText>
        <ModelBars />
        <div
          style={{
            background: '#fef3c7',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '24px 32px',
          }}
        >
          <CardText size={38}>
            直觉换算：<span style={{ color: INK_SEPIA, fontWeight: 700 }}>1M token</span>
            {' '}≈ 75 万英文词 ≈ 50 万汉字 ≈ 一本长篇小说。
          </CardText>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
