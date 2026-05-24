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
  slug: 'hello-motes',
  index: 4,
  total: 4,
  title: '一起搞懂 AI',
};

function HeartScribble() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    svg.appendChild(
      rc.circle(120, 80, 130, {
        stroke: INK_RED,
        strokeWidth: 6,
        roughness: 1.6,
        fill: '#fce7f3',
        fillStyle: 'solid',
        seed: 5,
      })
    );
    svg.appendChild(
      rc.circle(240, 80, 130, {
        stroke: INK_RED,
        strokeWidth: 6,
        roughness: 1.6,
        fill: '#fce7f3',
        fillStyle: 'solid',
        seed: 7,
      })
    );
    svg.appendChild(
      rc.polygon(
        [
          [55, 110],
          [180, 240],
          [305, 110],
        ],
        {
          stroke: INK_RED,
          strokeWidth: 6,
          roughness: 1.4,
          fill: '#fce7f3',
          fillStyle: 'solid',
          seed: 11,
        }
      )
    );
  }, []);
  return <svg ref={ref} viewBox="0 0 360 270" width={360} height={270} />;
}

export default function Card5() {
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
        <CardSectionHeading>一起搞懂 AI</CardSectionHeading>

        <CardText size={48}>
          每天一条 <span style={{ color: INK_SEPIA, fontWeight: 700 }}>AI 知识碎片</span>。
        </CardText>
        <CardText size={42}>
          适合：做 AI 产品的人 / 想搞懂 AI 又怕术语的人 / 跟 AI 一起工作的人。
        </CardText>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
          <HeartScribble />
        </div>

        <div
          style={{
            fontFamily: PEN,
            fontSize: 44,
            color: INK,
            textAlign: 'center',
            marginTop: 12,
            lineHeight: 1.5,
          }}
        >
          关注一下吧 ， 别走丢了 ——
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
