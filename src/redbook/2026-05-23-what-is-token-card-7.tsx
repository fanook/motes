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
  index: 7,
  total: 9,
  title: 'output 比 input 贵',
};

function InOutBars() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);

    const draw = (y: number, label: string, value: number, max: number, fill: string, seed: number) => {
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', '0');
      t.setAttribute('y', String(y + 56));
      t.setAttribute('font-family', PEN);
      t.setAttribute('font-size', '40');
      t.setAttribute('fill', INK);
      t.textContent = label;
      svg.appendChild(t);
      const w = (value / max) * 460;
      svg.appendChild(
        rc.rectangle(220, y + 16, w, 60, {
          stroke: INK,
          strokeWidth: 3,
          roughness: 1.4,
          fill,
          fillStyle: 'solid',
          seed,
        })
      );
      const v = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      v.setAttribute('x', String(220 + w + 18));
      v.setAttribute('y', String(y + 56));
      v.setAttribute('font-family', PEN);
      v.setAttribute('font-size', '40');
      v.setAttribute('fill', INK);
      v.textContent = `$${value} / 1M`;
      svg.appendChild(v);
    };

    draw(20, 'input', 3, 15, '#dbeafe', 5);
    draw(140, 'output', 15, 15, '#fce7f3', 6);
  }, []);
  return <svg ref={ref} viewBox="0 0 900 240" width={900} height={240} />;
}

export default function Card7() {
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
        <CardSectionHeading>output 比 input 贵 5×</CardSectionHeading>
        <CardText size={42}>
          很多人只看了 input 价格 ， 漏算了 output。
          AI 写出的每个字也按 token 收费 ， 而且单价高得多。
        </CardText>

        <InOutBars />

        <CardText size={40}>
          以 <span style={{ color: INK_SEPIA, fontWeight: 700 }}>Claude Sonnet 4.6</span>{' '}
          为例 ， output 是 input 的 <b>5×</b>。 其他主流模型 4~5× 不等。
        </CardText>

        <div
          style={{
            background: '#fef3c7',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '24px 32px',
          }}
        >
          <CardText size={40}>
            <span style={{ color: INK_RED, fontWeight: 700 }}>实战</span>：让 AI
            "少说话" 比 "少看资料" 更省钱 ——
            <br />
            缩短 max_tokens、 prompt 写"简短回答"。
          </CardText>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
