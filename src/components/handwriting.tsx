import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import rough from 'roughjs';
import { CoverArt } from './cover-art';
import { TreeRings } from './tree-rings';

/* MoteContext： MoteView 提供当前 slug， Paper 用来渲染封面 */
export const MoteSlugContext = createContext<string | undefined>(undefined);

/* ---------- 墨水色 ---------- */
export const INK = '#1f2937';
export const INK_SEPIA = '#5b3a1f';
export const INK_RED = '#b91c1c';
export const INK_GREEN = '#166534';

/* ---------- 字体变量 ---------- */
export const HAND = 'var(--font-hand)'; // 标题 (Caveat)
export const PEN = 'var(--font-hand-pen)'; // 正文 (Kalam)

/* ---------- 纸张 ---------- */
export function Paper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const slug = useContext(MoteSlugContext);
  return (
    <div
      id="mote-paper"
      data-mote-paper
      className={`relative rounded-sm shadow-xl overflow-hidden min-h-[60vh] sm:min-h-[70vh] ${className ?? ''}`}
      style={{
        backgroundColor: '#fdfaf0',
        color: INK,
      }}
    >
      {slug && <CoverArt slug={slug} />}
      <div
        className="px-4 py-6 sm:px-12 sm:py-14"
        style={{
          backgroundImage:
            'repeating-linear-gradient(transparent, transparent 31px, rgba(30,58,138,0.07) 32px)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------- 章节标题（含下划线） ---------- */
export function Section({
  title,
  color = INK_SEPIA,
  underlineWidth,
  children,
}: {
  title: string;
  color?: string;
  underlineWidth?: number;
  children: ReactNode;
}) {
  const uw = underlineWidth ?? Math.min(220, title.length * 22 + 40);
  return (
    <section className="mt-8 sm:mt-10">
      <h2
        className="text-xl sm:text-3xl mb-1"
        style={{ fontFamily: HAND, color }}
      >
        {title}
      </h2>
      <RoughUnderline width={uw} color={color} />
      <div
        className="mt-2 sm:mt-3 text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-2.5"
        style={{ fontFamily: PEN }}
      >
        {children}
      </div>
    </section>
  );
}

/* ---------- 固定尺寸的手绘方框 ---------- */
export function RoughBox({
  width,
  height,
  seed = 1,
  color = INK,
  fillColor,
  className,
  children,
  style,
}: {
  width: number;
  height: number;
  seed?: number;
  color?: string;
  fillColor?: string;
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    const node = rc.rectangle(3, 3, width - 6, height - 6, {
      stroke: color,
      strokeWidth: 1.5,
      roughness: 1.6,
      seed,
      fill: fillColor,
      fillStyle: 'solid',
    });
    svg.appendChild(node);
  }, [width, height, seed, color, fillColor]);
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className ?? ''}`}
      style={{ width, height, ...style }}
    >
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="absolute inset-0 pointer-events-none"
      />
      <div className="relative px-2 text-center">{children}</div>
    </div>
  );
}

/* ---------- 自适应宽度的手绘方框（用于纸张内的横排元素） ---------- */
export function FluidRoughBox({
  height,
  seed = 1,
  color = INK,
  fillColor,
  className,
  children,
}: {
  height: number;
  seed?: number;
  color?: string;
  fillColor?: string;
  className?: string;
  children?: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [w, setW] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const cw = entries[0].contentRect.width;
      if (cw > 0) setW(Math.floor(cw));
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (w === 0) return;
    const svg = svgRef.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    const node = rc.rectangle(3, 3, w - 6, height - 6, {
      stroke: color,
      strokeWidth: 1.5,
      roughness: 1.5,
      seed,
      fill: fillColor,
      fillStyle: 'solid',
    });
    svg.appendChild(node);
  }, [w, height, seed, color, fillColor]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className ?? ''}`}
      style={{ height }}
    >
      <svg
        ref={svgRef}
        width={w}
        height={height}
        className="absolute inset-0 pointer-events-none"
      />
      <div className="relative h-full w-full flex items-center justify-center px-4">
        {children}
      </div>
    </div>
  );
}

/* ---------- 手绘箭头（支持方向） ---------- */
export function RoughArrow({
  width = 60,
  height = 24,
  seed = 2,
  color = INK,
  direction = 'right',
}: {
  width?: number;
  height?: number;
  seed?: number;
  color?: string;
  direction?: 'right' | 'down';
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const isDown = direction === 'down';
  const w = isDown ? height : width;
  const h = isDown ? width : height;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    if (isDown) {
      const x = w / 2;
      svg.appendChild(
        rc.line(x, 4, x, h - 8, {
          stroke: color,
          strokeWidth: 1.5,
          roughness: 1.4,
          seed,
        })
      );
      svg.appendChild(
        rc.line(x - 6, h - 14, x, h - 6, {
          stroke: color,
          strokeWidth: 1.5,
          roughness: 1.2,
          seed: seed + 10,
        })
      );
      svg.appendChild(
        rc.line(x + 6, h - 14, x, h - 6, {
          stroke: color,
          strokeWidth: 1.5,
          roughness: 1.2,
          seed: seed + 20,
        })
      );
    } else {
      const y = h / 2;
      svg.appendChild(
        rc.line(4, y, w - 8, y, {
          stroke: color,
          strokeWidth: 1.5,
          roughness: 1.4,
          seed,
        })
      );
      svg.appendChild(
        rc.line(w - 14, y - 6, w - 6, y, {
          stroke: color,
          strokeWidth: 1.5,
          roughness: 1.2,
          seed: seed + 10,
        })
      );
      svg.appendChild(
        rc.line(w - 14, y + 6, w - 6, y, {
          stroke: color,
          strokeWidth: 1.5,
          roughness: 1.2,
          seed: seed + 20,
        })
      );
    }
  }, [w, h, seed, color, isDown]);

  return (
    <svg
      ref={svgRef}
      width={w}
      height={h}
      className="inline-block align-middle"
    />
  );
}

/* ---------- 手绘下划线（章节标题下方） ---------- */
export function RoughUnderline({
  width = 200,
  seed = 3,
  color = INK_RED,
}: {
  width?: number;
  seed?: number;
  color?: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    svg.appendChild(
      rc.line(2, 6, width - 2, 8, {
        stroke: color,
        strokeWidth: 2.5,
        roughness: 2,
        seed,
      })
    );
  }, [width, seed, color]);
  return (
    <svg ref={svgRef} width={width} height={14} className="block max-w-full" />
  );
}

/* ---------- 变更历史 ---------- */
export function Changelog({
  created,
  entries,
}: {
  created: string;
  entries?: { date: string; note: string }[];
}) {
  // 合并：最新变更在最上，"创建"那条放最下
  const merged = [
    ...(entries ?? []),
    { date: created, note: '创建' },
  ];
  const lastUpdate = merged[0]?.date ?? created;
  return (
    <section className="mt-8 sm:mt-10 pt-4 sm:pt-5 border-t border-dashed border-stone-400">
      <h3
        className="text-base sm:text-lg mb-2 sm:mb-3 flex items-baseline gap-2"
        style={{ fontFamily: HAND, color: INK_SEPIA }}
      >
        ✎ 变更历史
        <span className="text-xs sm:text-sm text-stone-400">
          最近更新 {lastUpdate}
        </span>
      </h3>
      <ul
        className="space-y-1.5 text-sm sm:text-base text-stone-600"
        style={{ fontFamily: PEN }}
      >
        {merged.map((e, i) => (
          <li key={i} className="flex items-baseline gap-2 sm:gap-3">
            <time className="tabular-nums text-stone-500 shrink-0">
              {e.date}
            </time>
            <span className="text-stone-400">·</span>
            <span>{e.note}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- 手绘图标 ---------- */
export function ListIcon({
  color = INK,
  size = 26,
}: {
  color?: string;
  size?: number;
}) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    const ys = [4, 12, 20];
    ys.forEach((y, i) => {
      svg.appendChild(
        rc.line(3, y, size - 3, y, {
          stroke: color,
          strokeWidth: 2,
          roughness: 1.8,
          seed: 71 + i,
        })
      );
    });
  }, [color, size]);
  return <svg ref={ref} width={size} height={size * 0.95} />;
}

export function ShuffleIcon({
  color = INK,
  size = 26,
  spin = false,
}: {
  color?: string;
  size?: number;
  spin?: boolean;
}) {
  // 直接复用 TreeRings 组件 ， 保证跟 favicon / 头像完全一致
  return (
    <div
      style={{
        display: 'inline-block',
        transition: 'transform 0.5s ease-out',
        transform: spin ? 'rotate(180deg)' : 'rotate(0deg)',
      }}
    >
      <TreeRings size={size} color={color} ringCount={3} />
    </div>
  );
}

/* ---------- 自适应宽度的手绘柱状图 ---------- */
export function RoughBarChart({
  items,
  barHeight = 32,
  gap = 12,
  labelWidth = 110,
}: {
  items: { label: string; value: number; fill: string; suffix?: string }[];
  barHeight?: number;
  gap?: number;
  labelWidth?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [w, setW] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const cw = entries[0].contentRect.width;
      if (cw > 0) setW(Math.floor(cw));
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (w === 0) return;
    const svg = svgRef.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    const max = Math.max(...items.map((i) => i.value));
    const lblW = w < 380 ? 90 : labelWidth;
    const valueGap = 44;
    const chartW = w - lblW - valueGap - 8;

    items.forEach((item, i) => {
      const y = i * (barHeight + gap);
      const barW = Math.max(4, (item.value / max) * chartW);
      const rect = rc.rectangle(lblW, y, barW, barHeight, {
        stroke: INK,
        strokeWidth: 1.5,
        roughness: 1.5,
        seed: 200 + i * 7,
        fill: item.fill,
        fillStyle: 'solid',
      });
      svg.appendChild(rect);

      const SVG_NS = 'http://www.w3.org/2000/svg';

      const lblText = document.createElementNS(SVG_NS, 'text');
      lblText.setAttribute('x', String(lblW - 8));
      lblText.setAttribute('y', String(y + barHeight / 2 + 6));
      lblText.setAttribute('text-anchor', 'end');
      lblText.setAttribute('font-family', 'Kalam, "Ma Shan Zheng", cursive');
      lblText.setAttribute('font-size', '15');
      lblText.setAttribute('fill', INK);
      lblText.textContent = item.label;
      svg.appendChild(lblText);

      const valText = document.createElementNS(SVG_NS, 'text');
      valText.setAttribute('x', String(lblW + barW + 6));
      valText.setAttribute('y', String(y + barHeight / 2 + 6));
      valText.setAttribute('font-family', 'Kalam, "Ma Shan Zheng", cursive');
      valText.setAttribute('font-size', '15');
      valText.setAttribute('font-weight', '700');
      valText.setAttribute('fill', INK);
      valText.textContent = String(item.value) + (item.suffix ?? '');
      svg.appendChild(valText);
    });
  }, [w, items, barHeight, gap, labelWidth]);

  const totalHeight = items.length * (barHeight + gap) - gap + 4;

  return (
    <div ref={containerRef} className="w-full" style={{ height: totalHeight }}>
      <svg ref={svgRef} width={w} height={totalHeight} />
    </div>
  );
}
