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
  slug: 'what-is-token',
  index: 2,
  total: 9,
  title: 'BPE 切法',
};

function TokenSliced() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    // 三块 ， 代表 "un" "believ" "able"
    const blocks: { x: number; w: number; label: string; color: string }[] = [
      { x: 30, w: 130, label: 'un', color: '#fef3c7' },
      { x: 175, w: 260, label: 'believ', color: '#dbeafe' },
      { x: 450, w: 200, label: 'able', color: '#fce7f3' },
    ];
    blocks.forEach((b, i) => {
      svg.appendChild(
        rc.rectangle(b.x, 60, b.w, 140, {
          stroke: INK,
          strokeWidth: 4,
          roughness: 1.4,
          fill: b.color,
          fillStyle: 'solid',
          seed: 10 + i,
        })
      );
      const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      txt.setAttribute('x', String(b.x + b.w / 2));
      txt.setAttribute('y', '150');
      txt.setAttribute('text-anchor', 'middle');
      txt.setAttribute('font-family', PEN);
      txt.setAttribute('font-size', '54');
      txt.setAttribute('fill', INK);
      txt.textContent = b.label;
      svg.appendChild(txt);
    });
  }, []);
  return <svg ref={ref} viewBox="0 0 680 240" width={680} height={240} />;
}

export default function Card2() {
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
        <CardSectionHeading>1 个字 ≠ 1 token</CardSectionHeading>
        <CardText>
          AI 把文字切成小块再算账。 切法叫 <b style={{ color: INK_SEPIA }}>BPE</b>
          ， 把常见字母组合 "合并" 成一块。
        </CardText>
        <div style={{ marginTop: 16 }}>
          <div style={{ fontFamily: PEN, fontSize: 44, marginBottom: 24 }}>
            unbelievable →
          </div>
          <TokenSliced />
          <div style={{ fontFamily: PEN, fontSize: 36, color: INK, opacity: 0.7, marginTop: 12 }}>
            3 个 token (不是 12 个字母)
          </div>
        </div>
        <CardText size={42}>
          <span style={{ color: INK_SEPIA, fontWeight: 700 }}>中文</span> 更碎：
          一个汉字常常 = 2 ~ 3 个 token。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
