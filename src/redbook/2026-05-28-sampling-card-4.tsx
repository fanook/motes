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
  slug: 'sampling',
  index: 4,
  total: 9,
  title: 'Top-k',
};

const BARS: [string, number, boolean][] = [
  ['is', 0.42, true],
  ['are', 0.18, true],
  ['was', 0.12, true],
  ['were', 0.05, false],
  ['rocks', 0.005, false],
];

function TopkChart() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    BARS.forEach((b, i) => {
      const [word, p, kept] = b;
      const y = i * 64;
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', '0');
      t.setAttribute('y', String(y + 42));
      t.setAttribute('font-family', PEN);
      t.setAttribute('font-size', '30');
      t.setAttribute('fill', kept ? INK : '#b0a99a');
      t.textContent = word;
      svg.appendChild(t);
      const ww = Math.max(p * 480, 5);
      svg.appendChild(
        rc.rectangle(150, y + 8, ww, 40, {
          stroke: kept ? INK : '#b0a99a',
          strokeWidth: 2.5,
          roughness: 1.3,
          fill: kept ? '#d1fae5' : '#eee',
          fillStyle: 'solid',
          seed: 10 + i,
        })
      );
      if (!kept) {
        // 划掉
        svg.appendChild(rc.line(150, y + 28, 150 + ww + 90, y + 28, { stroke: INK_RED, strokeWidth: 3, roughness: 1.5, seed: 50 + i }));
      }
    });
  }, []);
  return <svg ref={ref} viewBox="0 0 760 340" width={760} height={340} />;
}

export default function Card4() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <CardSectionHeading>Top-k：只留最高 k 个</CardSectionHeading>
        <CardText size={38}>
          只在概率最高的 <b style={{ color: INK_SEPIA }}>k</b> 个 token 里采样 ，
          其他全部砍掉 ， 重新归一化。 例：k = 3 ——
        </CardText>
        <TopkChart />
        <CardText size={34}>
          问题：k 是<b>固定数</b>。 分布尖时 k 太大没意义 ， 分布扁时 k 太小又会
          <span style={{ color: INK_RED, fontWeight: 700 }}>错杀好选项</span>。 所以才有了 top-p。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
