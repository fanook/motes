import { useEffect, useRef } from 'react';
import rough from 'roughjs';
import { INK, INK_GREEN, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  CardText,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'rerank',
  index: 5,
  total: 7,
  title: '效果有多大',
};

function PrecisionBars() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    const rows = [
      { name: '纯 embedding 召回', v: 40, color: '#fce7f3' },
      { name: '加 rerank 后', v: 80, color: '#d1fae5' },
    ];
    rows.forEach((r, i) => {
      const y = i * 120;
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', '0');
      t.setAttribute('y', String(y + 54));
      t.setAttribute('font-family', PEN);
      t.setAttribute('font-size', '34');
      t.setAttribute('fill', INK);
      t.textContent = r.name;
      svg.appendChild(t);
      const w = (r.v / 100) * 380;
      svg.appendChild(
        rc.rectangle(420, y + 14, w, 60, {
          stroke: INK,
          strokeWidth: 3,
          roughness: 1.4,
          fill: r.color,
          fillStyle: 'solid',
          seed: 10 + i,
        })
      );
      const v = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      v.setAttribute('x', String(420 + w + 16));
      v.setAttribute('y', String(y + 54));
      v.setAttribute('font-family', PEN);
      v.setAttribute('font-size', '34');
      v.setAttribute('fill', INK);
      v.textContent = `~${r.v}%`;
      svg.appendChild(v);
    });
  }, []);
  return <svg ref={ref} viewBox="0 0 900 240" width={900} height={240} />;
}

export default function Card5() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <CardSectionHeading>效果有多大</CardSectionHeading>
        <CardText size={36}>检索<b>精度</b>对比（经验值 ， 不同语料有差异）：</CardText>

        <PrecisionBars />

        <div
          style={{
            background: '#d1fae5',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '24px 30px',
          }}
        >
          <CardText size={36}>
            最终 RAG 回答正确率通常提升
            <span style={{ color: INK_GREEN, fontWeight: 700 }}> 10~20 个百分点</span>。
            性价比很高的一步。
          </CardText>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
