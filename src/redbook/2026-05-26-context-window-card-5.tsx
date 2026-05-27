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
  slug: 'context-window',
  index: 5,
  total: 9,
  title: '丢失中间',
};

function UCurve() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    // 坐标轴
    svg.appendChild(rc.line(80, 320, 820, 320, { stroke: INK, strokeWidth: 3, roughness: 1 }));
    svg.appendChild(rc.line(80, 40, 80, 320, { stroke: INK, strokeWidth: 3, roughness: 1 }));
    // U 形曲线（召回率：高-低-高）
    const pts = [];
    for (let i = 0; i <= 20; i++) {
      const x = 80 + (i / 20) * 740;
      const t = i / 20;
      // U 形：1 - 4*t*(1-t) 的反 ， 即两端高中间低
      const recall = 0.35 + 0.6 * Math.pow(2 * t - 1, 2);
      const y = 320 - recall * 260;
      pts.push([x, y]);
    }
    svg.appendChild(rc.curve(pts, { stroke: INK_RED, strokeWidth: 5, roughness: 1.2, seed: 7 }));
    // 标注
    const label = (x, y, txt, color) => {
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', String(x));
      t.setAttribute('y', String(y));
      t.setAttribute('text-anchor', 'middle');
      t.setAttribute('font-family', PEN);
      t.setAttribute('font-size', '30');
      t.setAttribute('fill', color);
      t.textContent = txt;
      svg.appendChild(t);
    };
    label(140, 370, '开头', INK_SEPIA);
    label(450, 370, '中段', INK_RED);
    label(770, 370, '结尾', INK_SEPIA);
    label(450, 30, '召回率', INK);
  }, []);
  return <svg ref={ref} viewBox="0 0 900 390" width={900} height={390} />;
}

export default function Card5() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <CardSectionHeading>"丢失中间"现象</CardSectionHeading>
        <CardText size={38}>
          就算有有效上下文 ， 模型对窗口 <b style={{ color: INK_RED }}>中段</b>
          内容的召回 ， 明显低于开头和结尾。
        </CardText>
        <UCurve />
        <div
          style={{
            background: '#fef3c7',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '22px 30px',
          }}
        >
          <CardText size={36}>
            <span style={{ color: INK_SEPIA, fontWeight: 700 }}>实战</span>：写 RAG / system prompt 时 ，
            最关键的信息放<b>头</b>或<b>尾</b> ， 别埋中间。
          </CardText>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
