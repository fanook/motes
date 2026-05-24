import { useEffect, useRef } from 'react';
import rough from 'roughjs';
import { INK, INK_GREEN, INK_RED, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  CardText,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'prompt-caching',
  index: 5,
  total: 10,
  title: '算笔账',
};

function MonthBars() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    const rows = [
      { name: '不开 cache', cost: 1515, color: '#fce7f3' },
      { name: '开 cache', cost: 167, color: '#d1fae5' },
    ];
    const max = 1515;
    rows.forEach((r, i) => {
      const y = i * 110;
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', '0');
      t.setAttribute('y', String(y + 56));
      t.setAttribute('font-family', PEN);
      t.setAttribute('font-size', '34');
      t.setAttribute('fill', INK);
      t.textContent = r.name;
      svg.appendChild(t);
      const w = (r.cost / max) * 380;
      svg.appendChild(
        rc.rectangle(290, y + 14, w, 60, {
          stroke: INK,
          strokeWidth: 3,
          roughness: 1.4,
          fill: r.color,
          fillStyle: 'solid',
          seed: 10 + i,
        })
      );
      const v = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      v.setAttribute('x', String(290 + w + 18));
      v.setAttribute('y', String(y + 56));
      v.setAttribute('font-family', PEN);
      v.setAttribute('font-size', '34');
      v.setAttribute('fill', INK);
      v.textContent = `$${r.cost}/月`;
      svg.appendChild(v);
    });
  }, []);
  return <svg ref={ref} viewBox="0 0 900 240" width={900} height={240} />;
}

export default function Card5() {
  return (
    <RedbookCard>
      <div
        style={{
          padding: '110px 90px 0 90px',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        <CardSectionHeading>算笔账</CardSectionHeading>
        <CardText size={32}>
          假设：system prompt <b>10K token</b> 固定 ， 每条用户消息 100 token ，
          每天调 <b>1,000 次</b> 。 用 Claude Opus 4.7
          （input $5 / cache 写 $6.25 / cache 读 $0.5）。
        </CardText>

        <div
          style={{
            background: '#fee2e2',
            border: '3px solid ' + INK,
            borderRadius: 14,
            padding: '20px 28px',
            fontFamily: PEN,
            fontSize: 30,
            color: INK,
            lineHeight: 1.55,
          }}
        >
          <span style={{ color: INK_RED, fontWeight: 700 }}>✗ 不开 cache</span>
          ：每次 10,100 × $5 / 1M = $0.0505 。 1 月 ={' '}
          <b>$1,515</b>
        </div>

        <div
          style={{
            background: '#d1fae5',
            border: '3px solid ' + INK,
            borderRadius: 14,
            padding: '20px 28px',
            fontFamily: PEN,
            fontSize: 30,
            color: INK,
            lineHeight: 1.55,
          }}
        >
          <span style={{ color: INK_GREEN, fontWeight: 700 }}>✓ 开 cache</span>
          ：首次 $0.063 + 之后 999 次 × $0.0055 = ~$5.55/天 。 1 月 ={' '}
          <b>$167</b>
        </div>

        <MonthBars />

        <CardText size={32}>
          <span style={{ color: INK_GREEN, fontWeight: 700 }}>省 89%</span> ， 一个月省{' '}
          <span style={{ color: INK_SEPIA, fontWeight: 700 }}>$1,348</span> 。
          system prompt 越长、 调用越频繁 ， 越值。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
