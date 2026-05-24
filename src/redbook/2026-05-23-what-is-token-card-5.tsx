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
  slug: 'what-is-token',
  index: 5,
  total: 9,
  title: '中英对比',
};

function CompareBars() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);

    const draw = (y: number, label: string, value: number, max: number, fill: string, seed: number) => {
      // label
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', '0');
      t.setAttribute('y', String(y + 60));
      t.setAttribute('font-family', PEN);
      t.setAttribute('font-size', '40');
      t.setAttribute('fill', INK);
      t.textContent = label;
      svg.appendChild(t);
      // bar
      const w = (value / max) * 440;
      svg.appendChild(
        rc.rectangle(280, y, w, 80, {
          stroke: INK,
          strokeWidth: 3,
          roughness: 1.4,
          fill,
          fillStyle: 'solid',
          seed,
        })
      );
      // value
      const v = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      v.setAttribute('x', String(280 + w + 18));
      v.setAttribute('y', String(y + 56));
      v.setAttribute('font-family', PEN);
      v.setAttribute('font-size', '40');
      v.setAttribute('fill', INK);
      v.textContent = `${value} token`;
      svg.appendChild(v);
    };

    draw(40, '中文 100 字', 250, 300, '#fce7f3', 5);
    draw(180, '英文 100 词', 140, 300, '#dbeafe', 6);
  }, []);
  return <svg ref={ref} viewBox="0 0 900 320" width={900} height={320} />;
}

export default function Card3() {
  return (
    <RedbookCard>
      <div
        style={{
          padding: '110px 90px 0 90px',
          display: 'flex',
          flexDirection: 'column',
          gap: 56,
        }}
      >
        <CardSectionHeading>100 字 ≈ 多少 token？</CardSectionHeading>
        <CardText>
          同样长一段话， 中文比英文 "更碎" —— 因为汉字大多不在 token 词表的高频组合里。
        </CardText>
        <CompareBars />
        <CardText size={42}>
          <span style={{ color: INK_RED, fontWeight: 700 }}>结论</span>：
          中文调 LLM 的 token 消耗约是英文的 <span style={{ color: INK_SEPIA, fontWeight: 700 }}>1.7×</span>。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
