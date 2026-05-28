import { useEffect, useRef } from 'react';
import rough from 'roughjs';
import { INK, PEN } from '../components/handwriting';
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
  index: 3,
  total: 9,
  title: '真实切例',
};

function ExampleBlocks({
  blocks,
  y,
}: {
  blocks: { label: string; color: string; w: number }[];
  y: number;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const totalW = blocks.reduce((s, b) => s + b.w, 0) + (blocks.length - 1) * 12;
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    let x = 0;
    blocks.forEach((b, i) => {
      svg.appendChild(
        rc.rectangle(x, 0, b.w, 100, {
          stroke: INK,
          strokeWidth: 3,
          roughness: 1.4,
          fill: b.color,
          fillStyle: 'solid',
          seed: 10 + i + y,
        })
      );
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', String(x + b.w / 2));
      t.setAttribute('y', '66');
      t.setAttribute('text-anchor', 'middle');
      t.setAttribute('font-family', PEN);
      t.setAttribute('font-size', '40');
      t.setAttribute('fill', INK);
      t.textContent = b.label;
      svg.appendChild(t);
      x += b.w + 12;
    });
  }, [blocks, y]);
  return (
    <svg ref={ref} viewBox={`0 0 ${totalW} 110`} width={totalW} height={110} />
  );
}

function ExampleRow({
  source,
  blocks,
  count,
}: {
  source: string;
  blocks: { label: string; color: string; w: number }[];
  count: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontFamily: PEN, fontSize: 36, color: INK }}>
        {source} <span style={{ opacity: 0.5 }}>→</span>
      </div>
      <ExampleBlocks blocks={blocks} y={blocks.length} />
      <div style={{ fontFamily: PEN, fontSize: 30, color: INK, opacity: 0.6 }}>
        {count}
      </div>
    </div>
  );
}

export default function Card3() {
  return (
    <RedbookCard>
      <div
        style={{
          padding: '110px 90px 0 90px',
          display: 'flex',
          flexDirection: 'column',
          gap: 40,
        }}
      >
        <CardSectionHeading>看几个真实切例</CardSectionHeading>
        <CardText size={40}>
          同样一段内容 ， 不同语言 / 字符 ， token 数差很多。
        </CardText>

        <ExampleRow
          source="unbelievable"
          blocks={[
            { label: 'un', color: '#fef3c7', w: 110 },
            { label: 'believ', color: '#dbeafe', w: 200 },
            { label: 'able', color: '#fce7f3', w: 160 },
          ]}
          count="3 token (12 字母)"
        />

        <ExampleRow
          source="人工智能"
          blocks={[
            { label: '人', color: '#fce7f3', w: 110 },
            { label: '工', color: '#fce7f3', w: 110 },
            { label: '智', color: '#fce7f3', w: 110 },
            { label: '能', color: '#fce7f3', w: 110 },
          ]}
          count="≈ 8 token (一个汉字 ≈ 2 token)"
        />

        <ExampleRow
          source="hello_world"
          blocks={[
            { label: 'hello', color: '#d1fae5', w: 180 },
            { label: '_', color: '#ede9fe', w: 80 },
            { label: 'world', color: '#dbeafe', w: 180 },
          ]}
          count="3 token (符号 / 标点都算一格)"
        />
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
