import { useEffect, useRef } from 'react';
import rough from 'roughjs';
import { INK, INK_RED, PEN } from '../components/handwriting';
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
  index: 7,
  total: 9,
  title: '价格的代价',
};

function CostBars() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    const rows = [
      { name: '塞 10K', cost: 0.03, color: '#d1fae5' },
      { name: '塞 200K', cost: 0.6, color: '#dbeafe' },
      { name: '塞满 1M', cost: 3, color: '#fce7f3' },
    ];
    const max = 3;
    rows.forEach((r, i) => {
      const y = i * 100;
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', '0');
      t.setAttribute('y', String(y + 52));
      t.setAttribute('font-family', PEN);
      t.setAttribute('font-size', '34');
      t.setAttribute('fill', INK);
      t.textContent = r.name;
      svg.appendChild(t);
      const w = Math.max((r.cost / max) * 420, 8);
      svg.appendChild(
        rc.rectangle(300, y + 14, w, 56, {
          stroke: INK,
          strokeWidth: 3,
          roughness: 1.4,
          fill: r.color,
          fillStyle: 'solid',
          seed: 10 + i,
        })
      );
      const v = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      v.setAttribute('x', String(300 + w + 16));
      v.setAttribute('y', String(y + 52));
      v.setAttribute('font-family', PEN);
      v.setAttribute('font-size', '34');
      v.setAttribute('fill', INK);
      v.textContent = `$${r.cost}`;
      svg.appendChild(v);
    });
  }, []);
  return <svg ref={ref} viewBox="0 0 900 320" width={900} height={320} />;
}

export default function Card7() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <CardSectionHeading>价格的代价</CardSectionHeading>
        <CardText size={40}>
          context 长 <b>不是"开了 1M 就免费用"</b>。 每次请求都按 input token 数
          计费 + 算延迟。 以 Claude Sonnet 4.6（$3/1M）为例：
        </CardText>
        <CostBars />
        <div
          style={{
            background: '#fee2e2',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '22px 30px',
          }}
        >
          <CardText size={38}>
            1 万次塞满 1M = <span style={{ color: INK_RED, fontWeight: 700 }}>$30,000</span>。
            "把整本书塞进去"听着爽 ， 做产品要算账 —— 配合 prompt caching 能省 90%。
          </CardText>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
