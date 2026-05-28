import { useEffect, useRef } from 'react';
import rough from 'roughjs';
import type { RoughSVG } from 'roughjs/bin/svg';

/* ─────────────────────────────────────────────
   小程序头像（AI 主题 / 模块流风）
   - 正方形 500×500
   - 主体集中在中央 60~80%， 留 padding 防裁圆切到
   - 48px 也能看清： 笔触粗 (4~8)、 形状简单、 不堆细节
   ───────────────────────────────────────────── */

export type AvatarPalette = {
  bg: string;
  ink: string;
  card: string;
  dot: string;
};

export const AVATAR_PALETTES: Record<string, AvatarPalette> = {
  brick: { bg: '#c47350', ink: '#1a1a1a', card: '#fdfaf0', dot: '#8b4a30' },
  sage: { bg: '#a4b596', ink: '#1a1a1a', card: '#fdfaf0', dot: '#5f7050' },
  mustard: { bg: '#d4a847', ink: '#1a1a1a', card: '#fdfaf0', dot: '#9a7820' },
  navy: { bg: '#3e4863', ink: '#f4ecd8', card: '#fdfaf0', dot: '#1d2335' },
  blush: { bg: '#d68b94', ink: '#1a1a1a', card: '#fdfaf0', dot: '#a5616a' },
  slate: { bg: '#7a93a8', ink: '#1a1a1a', card: '#fdfaf0', dot: '#465e74' },
  wheat: { bg: '#b59760', ink: '#1a1a1a', card: '#fdfaf0', dot: '#7a6535' },
  olive: { bg: '#8a9a5b', ink: '#1a1a1a', card: '#fdfaf0', dot: '#5e6b3e' },
};

type DrawOpts = { stroke: string; fill: string; seed: number };
type AvatarDrawer = (g: SVGGElement, rc: RoughSVG, o: DrawOpts) => void;

/* —— 头像绘制 —— */

/* 年轮 —— 多圈同心圆 ， 低 roughness 让圈更整齐 + 一道径向裂缝 */
const drawTreeRings: AvatarDrawer = (g, rc, o) => {
  // 5 圈年轮 ， 外圈 roughness 更低（最容易看出抖动） ， 内圈可以稍微颤
  const radii = [205, 165, 125, 85, 48];
  radii.forEach((r, i) => {
    g.appendChild(
      rc.circle(250, 250, r * 2, {
        stroke: o.stroke,
        strokeWidth: i === radii.length - 1 ? 7 : 5,
        // 外圈最整齐 ， 越往内可以略颤
        roughness: 1.2 + i * 0.15,
        seed: o.seed + 10 + i,
      })
    );
  });
  // 一道径向裂缝（从外圈往中心延伸， 微微弯）
  g.appendChild(
    rc.curve(
      [
        [250, 45],
        [255, 130],
        [248, 220],
        [252, 280],
      ],
      {
        stroke: o.stroke,
        strokeWidth: 6,
        roughness: 1.8,
        seed: o.seed + 100,
      }
    )
  );
  // 中心实心小圆
  g.appendChild(
    rc.circle(250, 250, 18, {
      stroke: o.stroke,
      strokeWidth: 4,
      roughness: 1.3,
      fill: o.stroke,
      fillStyle: 'solid',
      seed: o.seed + 200,
    })
  );
};

/* ─────────────────────────────────────────────
   头像注册表
   ───────────────────────────────────────────── */
export type AvatarSpec = {
  id: string;
  label: string;
  drawer: AvatarDrawer;
  paletteKey: keyof typeof AVATAR_PALETTES;
  halftone?: 'top' | 'bottom' | 'none';
};

export const AVATAR_SPECS: AvatarSpec[] = [
  { id: 'tree-rings', label: '年轮（麦褐 · 5 圈）', drawer: drawTreeRings, paletteKey: 'wheat', halftone: 'none' },
];

/* ─────────────────────────────────────────────
   AvatarArt 组件
   ───────────────────────────────────────────── */
export function AvatarArt({ spec, size = 256 }: { spec: AvatarSpec; size?: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const palette = AVATAR_PALETTES[spec.paletteKey];
  const seed = (() => {
    let h = 0;
    for (let i = 0; i < spec.id.length; i++) h = (h * 31 + spec.id.charCodeAt(i)) | 0;
    return Math.abs(h);
  })();

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    svg.querySelectorAll('[data-rough]').forEach((n) => n.remove());
    const rc = rough.svg(svg);
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('data-rough', 'true');
    spec.drawer(g, rc, { stroke: palette.ink, fill: palette.card, seed });
    svg.appendChild(g);
  }, [spec, palette, seed]);

  const halftone = spec.halftone ?? 'none';
  const ht = halftone !== 'none';

  return (
    <svg
      ref={ref}
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', width: size, height: size }}
    >
      <rect width="500" height="500" fill={palette.bg} />
      {ht && (
        <>
          <defs>
            <pattern
              id={`halftone-avatar-${spec.id}`}
              x="0"
              y="0"
              width="14"
              height="14"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="7" cy="7" r="2" fill={palette.dot} opacity="0.45" />
            </pattern>
          </defs>
          <rect
            x="0"
            y={halftone === 'top' ? 0 : 360}
            width="500"
            height="140"
            fill={`url(#halftone-avatar-${spec.id})`}
          />
        </>
      )}
    </svg>
  );
}
