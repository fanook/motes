import { useEffect, useRef } from 'react';
import rough from 'roughjs';

/* ---------- 调色板 ---------- */
type Palette = {
  bg: string; // 外层奶油纸色
  panelA: string; // 左侧色块
  panelB: string; // 右侧色块
  ink: string; // 黑墨线
  card: string; // 白方块（grid card）
  dot: string; // halftone 圆点色
};

const PALETTES: Record<string, Palette> = {
  // 经典 Anthropic 配色： 赤陶 + 鼠尾草
  terracotta: {
    bg: '#f4ecd8',
    panelA: '#c47350',
    panelB: '#a4b596',
    ink: '#1a1a1a',
    card: '#fdfaf0',
    dot: '#7b8e6f',
  },
  mustard: {
    bg: '#f4ecd8',
    panelA: '#d4a847',
    panelB: '#3e4863',
    ink: '#1a1a1a',
    card: '#fdfaf0',
    dot: '#2c3450',
  },
  pink: {
    bg: '#f4ecd8',
    panelA: '#d68b94',
    panelB: '#8a9a5b',
    ink: '#1a1a1a',
    card: '#fdfaf0',
    dot: '#5e6b3e',
  },
};

function hashSlug(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function paletteForSlug(slug: string): Palette {
  const keys = Object.keys(PALETTES);
  return PALETTES[keys[hashSlug(slug) % keys.length]];
}

/* ---------- 主组件 ---------- */
export function CoverArt({ slug, symbol }: { slug: string; symbol?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const palette = paletteForSlug(slug);
  const seed = hashSlug(slug);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    // 清除之前的 rough 绘制
    svg.querySelectorAll('[data-rough]').forEach((n) => n.remove());
    const rc = rough.svg(svg);

    // 三条粗黑墨线穿过整图（roughjs 曲线， 看起来手绘）
    const inkPaths: [number, number][][] = [
      [
        [40, 180],
        [400, 100],
        [800, 220],
        [1160, 140],
      ],
      [
        [80, 480],
        [500, 540],
        [900, 460],
        [1130, 540],
      ],
      [
        [580, 60],
        [620, 280],
        [700, 480],
        [780, 640],
      ],
    ];
    inkPaths.forEach((pts, i) => {
      const path = rc.curve(pts, {
        stroke: palette.ink,
        strokeWidth: 6,
        roughness: 1.6,
        seed: seed + i * 37,
      });
      path.setAttribute('data-rough', 'true');
      svg.appendChild(path);
    });
  }, [slug, palette, seed]);

  return (
    <svg
      ref={ref}
      viewBox="0 0 1200 675"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', width: '100%', height: 'auto' }}
    >
      {/* 外层奶油纸色 */}
      <rect width="1200" height="675" fill={palette.bg} />

      {/* halftone dot pattern */}
      <defs>
        <pattern
          id={`halftone-${slug}`}
          x="0"
          y="0"
          width="14"
          height="14"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="7" cy="7" r="1.6" fill={palette.dot} opacity="0.45" />
        </pattern>
      </defs>

      {/* 左侧色块 */}
      <rect x="50" y="50" width="500" height="575" fill={palette.panelA} />

      {/* 右侧色块 */}
      <rect x="570" y="50" width="580" height="575" fill={palette.panelB} />

      {/* 右侧色块的下半部分加 halftone */}
      <rect
        x="570"
        y="350"
        width="580"
        height="275"
        fill={`url(#halftone-${slug})`}
      />

      {/* 左侧的主符号 */}
      <SymbolForSlug slug={slug} fillColor={palette.card} strokeColor={palette.ink} seed={seed} customSymbol={symbol} />

      {/* 右侧的白色 grid card， 微微旋转 */}
      <g transform="translate(650, 110) rotate(-3 200 200)">
        <rect width="400" height="380" fill={palette.card} />
        {/* 网格 */}
        <GridPattern color={palette.dot} />
        {/* 卡片里画一条手绘曲线 */}
        <GridCardSquiggle seed={seed + 1000} ink={palette.ink} />
      </g>
    </svg>
  );
}

/* ---------- 网格 ---------- */
function GridPattern({ color }: { color: string }) {
  const lines = [];
  for (let i = 1; i < 20; i++) {
    lines.push(
      <line
        key={`h${i}`}
        x1="0"
        y1={i * 20}
        x2="400"
        y2={i * 20}
        stroke={color}
        strokeWidth="0.5"
        opacity="0.25"
      />
    );
  }
  for (let i = 1; i < 20; i++) {
    lines.push(
      <line
        key={`v${i}`}
        x1={i * 20}
        y1="0"
        x2={i * 20}
        y2="380"
        stroke={color}
        strokeWidth="0.5"
        opacity="0.25"
      />
    );
  }
  return <>{lines}</>;
}

/* ---------- grid card 内的手绘小曲线 ---------- */
function GridCardSquiggle({ seed, ink }: { seed: number; ink: string }) {
  const ref = useRef<SVGGElement>(null);
  useEffect(() => {
    const g = ref.current;
    if (!g) return;
    while (g.firstChild) g.removeChild(g.firstChild);
    const svg = g.ownerSVGElement;
    if (!svg) return;
    const rc = rough.svg(svg);
    // 在 grid card 里画两条手绘弯线
    g.appendChild(
      rc.curve(
        [
          [60, 100],
          [180, 60],
          [280, 200],
          [340, 140],
        ],
        { stroke: ink, strokeWidth: 4, roughness: 1.5, seed }
      )
    );
    // 几个点
    [
      [120, 130, 8],
      [220, 200, 10],
      [310, 150, 6],
    ].forEach(([x, y, r], i) => {
      g.appendChild(
        rc.circle(x, y, r * 2, {
          stroke: ink,
          fill: ink,
          fillStyle: 'solid',
          strokeWidth: 1,
          roughness: 0.8,
          seed: seed + 100 + i,
        })
      );
    });
  }, [seed, ink]);
  return <g ref={ref} />;
}

/* ---------- 主符号：根据 slug 不同符号 ---------- */
function SymbolForSlug({
  slug,
  fillColor,
  strokeColor,
  seed,
  customSymbol,
}: {
  slug: string;
  fillColor: string;
  strokeColor: string;
  seed: number;
  customSymbol?: string;
}) {
  const ref = useRef<SVGGElement>(null);
  const which = customSymbol ?? slug;

  useEffect(() => {
    const g = ref.current;
    if (!g) return;
    while (g.firstChild) g.removeChild(g.firstChild);
    const svg = g.ownerSVGElement;
    if (!svg) return;
    const rc = rough.svg(svg);

    if (which.includes('hello-motes') || customSymbol === 'notebook') {
      // 欢迎篇： 散落的"概念片段"被聚集到一本笔记里
      const note = rc.rectangle(0, 0, 200, 260, {
        stroke: strokeColor,
        strokeWidth: 4,
        roughness: 1.4,
        fill: fillColor,
        fillStyle: 'solid',
        seed,
      });
      const noteG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      noteG.setAttribute('transform', 'translate(100, 70) rotate(-4 100 130)');
      noteG.appendChild(note);
      [40, 90, 140].forEach((y, i) => {
        const w = i === 1 ? 130 : 110;
        noteG.appendChild(
          rc.line(30, y, 30 + w, y, {
            stroke: strokeColor,
            strokeWidth: 3,
            roughness: 1.6,
            seed: seed + 10 + i,
          })
        );
      });
      g.appendChild(noteG);

      const fragments: { cx: number; cy: number; r: number }[] = [
        { cx: 40, cy: 50, r: 22 },
        { cx: 410, cy: 80, r: 18 },
        { cx: 30, cy: 380, r: 28 },
        { cx: 430, cy: 360, r: 16 },
        { cx: 220, cy: 440, r: 20 },
      ];
      fragments.forEach((f, i) => {
        g.appendChild(
          rc.line(f.cx, f.cy, 200, 200, {
            stroke: strokeColor,
            strokeWidth: 1.5,
            roughness: 1.3,
            seed: seed + 200 + i,
          })
        );
        g.appendChild(
          rc.circle(f.cx, f.cy, f.r * 2, {
            stroke: strokeColor,
            strokeWidth: 3,
            fill: fillColor,
            fillStyle: 'solid',
            roughness: 1.4,
            seed: seed + 300 + i,
          })
        );
      });
    } else {
      // 通用 fallback： 几何符号 + 散落点
      // 一个大圆 + 几条切线 + 几个小圆点， 整体抽象但有"中心 + 外延"的结构感
      const cx = 230;
      const cy = 230;
      g.appendChild(
        rc.circle(cx, cy, 220, {
          stroke: strokeColor,
          strokeWidth: 5,
          roughness: 1.6,
          fill: fillColor,
          fillStyle: 'solid',
          seed,
        })
      );
      // 内部 3 条放射线
      const angles = [
        seed % 360,
        (seed * 7 + 80) % 360,
        (seed * 11 + 200) % 360,
      ];
      angles.forEach((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x2 = cx + Math.cos(rad) * 180;
        const y2 = cy + Math.sin(rad) * 180;
        g.appendChild(
          rc.line(cx, cy, x2, y2, {
            stroke: strokeColor,
            strokeWidth: 4,
            roughness: 1.4,
            seed: seed + 50 + i,
          })
        );
        // 末端小球
        g.appendChild(
          rc.circle(x2, y2, 28, {
            stroke: strokeColor,
            strokeWidth: 3,
            fill: fillColor,
            fillStyle: 'solid',
            roughness: 1.3,
            seed: seed + 100 + i,
          })
        );
      });
      // 中心实心点
      g.appendChild(
        rc.circle(cx, cy, 36, {
          stroke: strokeColor,
          strokeWidth: 2,
          fill: strokeColor,
          fillStyle: 'solid',
          roughness: 1,
          seed: seed + 999,
        })
      );
    }
  }, [which, fillColor, strokeColor, seed, customSymbol]);

  // 左侧 panel 内的 viewBox: 整体 (50,50)-(550,625)， 放符号
  return <g ref={ref} transform="translate(75, 75)" />;
}
