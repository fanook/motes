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
  index: 9,
  total: 9,
  title: '图片 / 音频也是 token',
};

function MultimodalBars() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    const rows = [
      { name: '100 字中文', tok: 250, color: '#fce7f3' },
      { name: '一张 1024px 图', tok: 850, color: '#dbeafe' },
      { name: '一分钟音频', tok: 2000, color: '#d1fae5' },
    ];
    const max = 2000;
    rows.forEach((r, i) => {
      const y = i * 110;
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', '0');
      t.setAttribute('y', String(y + 56));
      t.setAttribute('font-family', PEN);
      t.setAttribute('font-size', '36');
      t.setAttribute('fill', INK);
      t.textContent = r.name;
      svg.appendChild(t);
      const w = (r.tok / max) * 380;
      svg.appendChild(
        rc.rectangle(360, y + 16, w, 60, {
          stroke: INK,
          strokeWidth: 3,
          roughness: 1.4,
          fill: r.color,
          fillStyle: 'solid',
          seed: 10 + i,
        })
      );
      const v = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      v.setAttribute('x', String(360 + w + 18));
      v.setAttribute('y', String(y + 56));
      v.setAttribute('font-family', PEN);
      v.setAttribute('font-size', '34');
      v.setAttribute('fill', INK);
      v.textContent = `≈ ${r.tok}`;
      svg.appendChild(v);
    });
  }, []);
  return <svg ref={ref} viewBox="0 0 900 360" width={900} height={360} />;
}

export default function Card9() {
  return (
    <RedbookCard>
      <div
        style={{
          padding: '110px 90px 0 90px',
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
        }}
      >
        <CardSectionHeading>图片 / 音频也是 token</CardSectionHeading>
        <CardText size={40}>
          多模态模型把 <span style={{ color: INK_SEPIA, fontWeight: 700 }}>图、 音频</span>
          也切成 token。 一张图 / 一段语音 = 几百到几千 token ， 都要钱。
        </CardText>

        <MultimodalBars />

        <div
          style={{
            background: '#fef3c7',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '24px 32px',
          }}
        >
          <CardText size={36}>
            <span style={{ color: INK_RED, fontWeight: 700 }}>注意</span>：传一张高分辨率图
            可能 = 数千 token ， 相当于一整篇文章。 PDF 截图、 长截屏更夸张。
          </CardText>
        </div>

        <CardText size={32}>
          * 数字按主流模型 (GPT-4o / Claude / Gemini) 的中位估算 ， 实际按厂商文档为准。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
