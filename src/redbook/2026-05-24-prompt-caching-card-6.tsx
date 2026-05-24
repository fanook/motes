import { useEffect, useRef } from 'react';
import rough from 'roughjs';
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
  index: 6,
  total: 10,
  title: '价格倍数',
};

function PriceBars() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    const rows = [
      { name: 'cache 读 (命中)', value: 0.3, color: '#d1fae5' },
      { name: '正常 input', value: 3, color: '#fce7f3' },
      { name: 'cache 写 (首次)', value: 3.75, color: '#fef3c7' },
    ];
    const max = 4;
    rows.forEach((r, i) => {
      const y = i * 100;
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', '0');
      t.setAttribute('y', String(y + 50));
      t.setAttribute('font-family', PEN);
      t.setAttribute('font-size', '34');
      t.setAttribute('fill', INK);
      t.textContent = r.name;
      svg.appendChild(t);
      const w = (r.value / max) * 380;
      svg.appendChild(
        rc.rectangle(420, y + 12, w, 56, {
          stroke: INK,
          strokeWidth: 3,
          roughness: 1.4,
          fill: r.color,
          fillStyle: 'solid',
          seed: 10 + i,
        })
      );
      const v = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      v.setAttribute('x', String(420 + w + 18));
      v.setAttribute('y', String(y + 50));
      v.setAttribute('font-family', PEN);
      v.setAttribute('font-size', '34');
      v.setAttribute('fill', INK);
      v.textContent = `$${r.value}`;
      svg.appendChild(v);
    });
  }, []);
  return <svg ref={ref} viewBox="0 0 900 320" width={900} height={320} />;
}

export default function Card5() {
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
        <CardSectionHeading>价格倍数 (per 1M token)</CardSectionHeading>
        <CardText size={40}>
          以 <span style={{ color: INK_SEPIA, fontWeight: 700 }}>Claude Sonnet 4.6</span>{' '}
          为例 ， 三种 input 价格分别是：
        </CardText>

        <PriceBars />

        <CardText size={36}>
          <b>cache 读 = 正常 1/10</b>。 <b>cache 写 = 正常 1.25×</b>{' '}
          （写一次贵一点 ， 后面省回来）。
        </CardText>
        <CardText size={32}>
          <span style={{ color: INK_RED }}>* 默认 TTL 5 分钟 ， 可延 1 小时 (Anthropic)。 价格以官方为准。</span>
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
