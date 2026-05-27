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
  slug: 'embedding',
  index: 2,
  total: 10,
  title: '直觉',
};

function Scatter() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    // 三个语义簇
    const clusters = [
      { label: '动物', cx: 180, cy: 130, color: '#fce7f3', pts: [[-40, -20], [10, 20], [40, -10], [-10, 40]] },
      { label: '颜色', cx: 620, cy: 160, color: '#dbeafe', pts: [[-30, -20], [20, 10], [40, -25], [-15, 30]] },
      { label: '数字', cx: 380, cy: 380, color: '#d1fae5', pts: [[-35, -15], [15, 25], [35, -5], [-20, 35]] },
    ];
    clusters.forEach((cl, ci) => {
      cl.pts.forEach((p, i) => {
        svg.appendChild(
          rc.circle(cl.cx + p[0], cl.cy + p[1], 26, {
            stroke: INK,
            strokeWidth: 2.5,
            roughness: 1.3,
            fill: cl.color,
            fillStyle: 'solid',
            seed: ci * 10 + i,
          })
        );
      });
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', String(cl.cx));
      t.setAttribute('y', String(cl.cy - 70));
      t.setAttribute('text-anchor', 'middle');
      t.setAttribute('font-family', PEN);
      t.setAttribute('font-size', '38');
      t.setAttribute('fill', INK_SEPIA);
      t.setAttribute('font-weight', '700');
      t.textContent = cl.label;
      svg.appendChild(t);
    });
  }, []);
  return <svg ref={ref} viewBox="0 0 820 480" width={820} height={480} />;
}

export default function Card2() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 36 }}>
        <CardSectionHeading>意义变成坐标</CardSectionHeading>
        <CardText size={42}>
          把每个词 / 句子 ， 变成一串数字（一个向量）。 关键是：
          <span style={{ color: INK_RED, fontWeight: 700 }}> 意思相近 ， 坐标就相近。</span>
        </CardText>
        <Scatter />
        <CardText size={38}>
          动物挤一角 ， 颜色挤一角 ， 数字挤一角。 有了"位置感" ，
          机器才能判断相似、 做搜索、 做分类。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
