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
  slug: 'attention',
  index: 4,
  total: 9,
  title: '注意力权重',
};

function WeightBars() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    const rows = [
      { word: 'The', w: 0.05 },
      { word: 'cat', w: 0.45 },
      { word: 'sat', w: 1.0 },
      { word: 'on', w: 0.08 },
      { word: 'the', w: 0.05 },
      { word: 'mat', w: 0.25 },
    ];
    rows.forEach((r, i) => {
      const y = i * 62;
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', '0');
      t.setAttribute('y', String(y + 42));
      t.setAttribute('font-family', PEN);
      t.setAttribute('font-size', '34');
      t.setAttribute('fill', r.word === 'sat' ? INK_RED : INK);
      t.setAttribute('font-weight', r.word === 'sat' ? '700' : '400');
      t.textContent = r.word;
      svg.appendChild(t);
      const ww = Math.max(r.w * 520, 6);
      svg.appendChild(
        rc.rectangle(200, y + 8, ww, 44, {
          stroke: INK,
          strokeWidth: 2.5,
          roughness: 1.3,
          fill: r.word === 'sat' ? '#fca5a5' : '#dbeafe',
          fillStyle: 'solid',
          seed: 10 + i,
        })
      );
      const v = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      v.setAttribute('x', String(200 + ww + 14));
      v.setAttribute('y', String(y + 42));
      v.setAttribute('font-family', PEN);
      v.setAttribute('font-size', '30');
      v.setAttribute('fill', INK);
      v.textContent = r.w.toFixed(2);
      svg.appendChild(v);
    });
  }, []);
  return <svg ref={ref} viewBox="0 0 820 390" width={820} height={390} />;
}

export default function Card4() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <CardSectionHeading>一个真实例子</CardSectionHeading>
        <CardText size={36}>
          句子 "The cat sat on the mat" ， 当 query 是
          <b style={{ color: INK_RED }}> sat</b> 时 ， 它给每个词分配的注意力权重：
        </CardText>
        <WeightBars />
        <CardText size={34}>
          最关注自己 ， 也关注 <b>cat</b>（主语）和 <b>mat</b>（受事）。
          整句的"含义"就是这些权重<span style={{ color: INK_SEPIA, fontWeight: 700 }}>加权混合</span>出来的。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
