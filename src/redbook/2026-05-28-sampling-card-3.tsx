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
  slug: 'sampling',
  index: 3,
  total: 9,
  title: 'Temperature',
};

const GROUPS = [
  { title: 'T = 0.3（冷 ， 趋于确定）', color: '#dbeafe', bars: [['is', 0.85], ['are', 0.10], ['was', 0.04], ['rocks', 0.001]] },
  { title: 'T = 1.0（原始分布）', color: '#d1fae5', bars: [['is', 0.42], ['are', 0.18], ['was', 0.12], ['rocks', 0.005]] },
  { title: 'T = 1.5（热 ， 更随机）', color: '#fce7f3', bars: [['is', 0.28], ['are', 0.20], ['was', 0.17], ['rocks', 0.03]] },
];

function TempChart() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    let y = 0;
    GROUPS.forEach((g, gi) => {
      const tt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      tt.setAttribute('x', '0');
      tt.setAttribute('y', String(y + 26));
      tt.setAttribute('font-family', PEN);
      tt.setAttribute('font-size', '28');
      tt.setAttribute('fill', INK_SEPIA);
      tt.setAttribute('font-weight', '700');
      tt.textContent = g.title;
      svg.appendChild(tt);
      y += 44;
      g.bars.forEach((b, bi) => {
        const word = b[0] as string;
        const p = b[1] as number;
        const wt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        wt.setAttribute('x', '0');
        wt.setAttribute('y', String(y + 26));
        wt.setAttribute('font-family', PEN);
        wt.setAttribute('font-size', '26');
        wt.setAttribute('fill', INK);
        wt.textContent = word;
        svg.appendChild(wt);
        const ww = Math.max(p * 520, 4);
        svg.appendChild(
          rc.rectangle(130, y + 4, ww, 30, {
            stroke: INK,
            strokeWidth: 2,
            roughness: 1.2,
            fill: g.color,
            fillStyle: 'solid',
            seed: gi * 10 + bi,
          })
        );
        y += 40;
      });
      y += 22;
    });
  }, []);
  return <svg ref={ref} viewBox="0 0 720 680" width={720} height={680} />;
}

export default function Card3() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <CardSectionHeading>Temperature 调随机度</CardSectionHeading>
        <CardText size={34}>
          把原始分数（logits）<b>除以 T</b> 再 softmax。 T 越大 ， 分布越平 ，
          低概率词翻身机会越大。
        </CardText>
        <TempChart />
        <div
          style={{
            background: '#fef3c7',
            border: '3px solid ' + INK,
            borderRadius: 14,
            padding: '18px 26px',
          }}
        >
          <CardText size={32}>
            确定性输出（代码 / JSON / 工具调用）用 <b>T=0~0.3</b>；
            要创意（写故事 / 头脑风暴）用 <b>T=0.8~1.2</b>。
          </CardText>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
