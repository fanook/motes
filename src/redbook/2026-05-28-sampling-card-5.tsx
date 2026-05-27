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
  slug: 'sampling',
  index: 5,
  total: 9,
  title: 'Top-p',
};

// 累加：is .42 -> .60 -> .72 -> .77 (停)；rocks 被排除
const BARS: [string, number, number, boolean][] = [
  ['is', 0.42, 0.42, true],
  ['are', 0.18, 0.60, true],
  ['was', 0.12, 0.72, true],
  ['were', 0.05, 0.77, true],
  ['rocks', 0.005, 0.775, false],
];

function ToppChart() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    BARS.forEach((b, i) => {
      const [word, p, cum, kept] = b;
      const y = i * 60;
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', '0');
      t.setAttribute('y', String(y + 40));
      t.setAttribute('font-family', PEN);
      t.setAttribute('font-size', '28');
      t.setAttribute('fill', kept ? INK : '#b0a99a');
      t.textContent = word as string;
      svg.appendChild(t);
      const ww = Math.max((p as number) * 420, 5);
      svg.appendChild(
        rc.rectangle(130, y + 6, ww, 36, {
          stroke: kept ? INK : '#b0a99a',
          strokeWidth: 2.5,
          roughness: 1.3,
          fill: kept ? '#d1fae5' : '#eee',
          fillStyle: 'solid',
          seed: 10 + i,
        })
      );
      // 累计标注
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      c.setAttribute('x', String(130 + ww + 16));
      c.setAttribute('y', String(y + 40));
      c.setAttribute('font-family', PEN);
      c.setAttribute('font-size', '24');
      c.setAttribute('fill', kept ? INK_GREEN : '#b0a99a');
      c.textContent = `累计 ${(cum as number).toFixed(2)}`;
      svg.appendChild(c);
    });
  }, []);
  return <svg ref={ref} viewBox="0 0 760 320" width={760} height={320} />;
}

export default function Card5() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <CardSectionHeading>Top-p：按概率质量切</CardSectionHeading>
        <CardText size={36}>
          又叫<b style={{ color: INK_SEPIA }}>核采样</b>。 按概率从高到低
          <b>累加</b> ， 刚超过 p 就停手 ， 只在这个"核"里采样。 例：p = 0.9 ——
        </CardText>
        <ToppChart />
        <div
          style={{
            background: '#fef3c7',
            border: '3px solid ' + INK,
            borderRadius: 14,
            padding: '18px 26px',
          }}
        >
          <CardText size={32}>
            比 top-k 好在：<b>候选数随分布自适应</b>。 分布尖时核小 ， 分布扁时核大。
            实战常用 <b>top-p = 0.9 ~ 0.95</b>。
          </CardText>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
