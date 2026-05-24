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

function rect(
  rc: RoughSVG,
  x: number,
  y: number,
  w: number,
  h: number,
  o: DrawOpts,
  extra: { stroke?: number; rough?: number; seedOffset?: number; fill?: string } = {}
) {
  return rc.rectangle(x, y, w, h, {
    stroke: o.stroke,
    strokeWidth: extra.stroke ?? 5,
    roughness: extra.rough ?? 1.4,
    fill: extra.fill ?? o.fill,
    fillStyle: 'solid',
    seed: o.seed + (extra.seedOffset ?? 0),
  });
}

function circle(
  rc: RoughSVG,
  cx: number,
  cy: number,
  r: number,
  o: DrawOpts,
  extra: { stroke?: number; rough?: number; seedOffset?: number; solidStroke?: boolean; fill?: string } = {}
) {
  return rc.circle(cx, cy, r * 2, {
    stroke: o.stroke,
    strokeWidth: extra.stroke ?? 4,
    roughness: extra.rough ?? 1.3,
    fill: extra.solidStroke ? o.stroke : extra.fill ?? o.fill,
    fillStyle: 'solid',
    seed: o.seed + (extra.seedOffset ?? 0),
  });
}

function line(
  rc: RoughSVG,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  o: DrawOpts,
  extra: { stroke?: number; rough?: number; seedOffset?: number } = {}
) {
  return rc.line(x1, y1, x2, y2, {
    stroke: o.stroke,
    strokeWidth: extra.stroke ?? 4,
    roughness: extra.rough ?? 1.2,
    seed: o.seed + (extra.seedOffset ?? 0),
  });
}

/* —— Attention 系列 ——
   核心意象： 一个中心 / 焦点 ， 周围多条粗细不一的关联线
   表示"对不同位置投以不同权重的注意力"
*/

/* A1. 中心辐射 —— 中心实心点 + 4 周节点 + 粗细不一连线 */
const drawAttnRadiate: AvatarDrawer = (g, rc, o) => {
  const cx = 250;
  const cy = 250;
  // 4 个外围节点
  const nodes: { x: number; y: number; w: number }[] = [
    { x: 90, y: 130, w: 12 }, // 最粗 — 最强注意
    { x: 410, y: 130, w: 4 },
    { x: 90, y: 370, w: 6 },
    { x: 410, y: 370, w: 9 },
  ];
  nodes.forEach((n, i) => {
    g.appendChild(line(rc, cx, cy, n.x, n.y, o, { stroke: n.w, seedOffset: 10 + i }));
    g.appendChild(circle(rc, n.x, n.y, 30, o, { stroke: 6, seedOffset: 20 + i }));
  });
  // 中心实心圆
  g.appendChild(circle(rc, cx, cy, 50, o, { solidStroke: true, stroke: 8, seedOffset: 1 }));
};

/* A2. 靶心 —— 三层同心圆 + 中心实心点 */
const drawAttnTarget: AvatarDrawer = (g, rc, o) => {
  g.appendChild(circle(rc, 250, 250, 175, o, { stroke: 10, seedOffset: 1 }));
  g.appendChild(circle(rc, 250, 250, 115, o, { stroke: 9, seedOffset: 2 }));
  g.appendChild(circle(rc, 250, 250, 55, o, { solidStroke: true, stroke: 8, seedOffset: 3 }));
};

/* A3. 加权扇形 —— 中心一个点 + 多条线 ， 中间粗两边细 */
const drawAttnFan: AvatarDrawer = (g, rc, o) => {
  const cx = 250;
  const cy = 380;
  // 7 条扇形线 ， 中间粗两边细 ， 长度一致
  const n = 7;
  const widths = [3, 5, 8, 14, 8, 5, 3];
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + ((i - (n - 1) / 2) / (n - 1)) * (Math.PI * 0.7);
    const x = cx + Math.cos(a) * 260;
    const y = cy + Math.sin(a) * 260;
    g.appendChild(line(rc, cx, cy, x, y, o, { stroke: widths[i], seedOffset: 10 + i }));
  }
  // 中心实心
  g.appendChild(circle(rc, cx, cy, 32, o, { solidStroke: true, stroke: 8, seedOffset: 1 }));
};

/* A4. 多箭头汇聚 —— 4 方向粗箭头指向中心 */
const drawAttnConverge: AvatarDrawer = (g, rc, o) => {
  // 中心方块（被关注的对象）
  g.appendChild(rect(rc, 195, 195, 110, 110, o, { stroke: 10, seedOffset: 1 }));
  g.appendChild(circle(rc, 250, 250, 20, o, { solidStroke: true, seedOffset: 2 }));
  // 4 个粗箭头
  const arrows: [number, number, number, number, number][] = [
    [250, 50, 250, 180, 10],
    [250, 450, 250, 320, 11],
    [50, 250, 180, 250, 12],
    [450, 250, 320, 250, 13],
  ];
  arrows.forEach(([x1, y1, x2, y2, seed]) => {
    g.appendChild(line(rc, x1, y1, x2, y2, o, { stroke: 11, seedOffset: seed }));
    const ang = Math.atan2(y2 - y1, x2 - x1);
    const h = 22;
    g.appendChild(
      line(
        rc,
        x2 - Math.cos(ang - Math.PI / 7) * h,
        y2 - Math.sin(ang - Math.PI / 7) * h,
        x2,
        y2,
        o,
        { stroke: 11, seedOffset: seed + 20 }
      )
    );
    g.appendChild(
      line(
        rc,
        x2 - Math.cos(ang + Math.PI / 7) * h,
        y2 - Math.sin(ang + Math.PI / 7) * h,
        x2,
        y2,
        o,
        { stroke: 11, seedOffset: seed + 30 }
      )
    );
  });
};

/* A5. QKV 三圆 —— 三个圆 + 互连 */
const drawAttnQKV: AvatarDrawer = (g, rc, o) => {
  // 三个圆位置（正三角， 顶向上）
  const r = 145;
  const cx = 250;
  const cy = 270;
  const pts: [number, number][] = [];
  for (let i = 0; i < 3; i++) {
    const a = -Math.PI / 2 + (i / 3) * Math.PI * 2;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  // 先画连线（在圆下层）
  for (let i = 0; i < 3; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % 3];
    g.appendChild(line(rc, a[0], a[1], b[0], b[1], o, { stroke: 6, seedOffset: 30 + i }));
  }
  // 三个实心圆
  pts.forEach((p, i) => {
    g.appendChild(circle(rc, p[0], p[1], 55, o, { solidStroke: true, stroke: 8, seedOffset: 10 + i }));
  });
};

/* A7. 年轮 —— 多圈同心圆 ， 低 roughness 让圈更整齐 + 一道径向裂缝 */
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

/* A6. 聚焦光锥 —— 上方眼/点 + 下方光锥 + 被照亮目标 */
const drawAttnSpotlight: AvatarDrawer = (g, rc, o) => {
  // 顶部"观察者"圆
  g.appendChild(circle(rc, 250, 110, 38, o, { solidStroke: true, stroke: 8, seedOffset: 1 }));
  // 光锥（梯形， 用 4 条线）
  g.appendChild(line(rc, 218, 145, 110, 410, o, { stroke: 8, seedOffset: 10 }));
  g.appendChild(line(rc, 282, 145, 390, 410, o, { stroke: 8, seedOffset: 11 }));
  g.appendChild(line(rc, 110, 410, 390, 410, o, { stroke: 8, seedOffset: 12 }));
  // 锥底被照亮的目标方块
  g.appendChild(rect(rc, 210, 380, 80, 60, o, { stroke: 9, seedOffset: 30 }));
};

/* —— 1. 方头机器人 —— 头 + 双眼 + 天线 */
const drawRobotHead: AvatarDrawer = (g, rc, o) => {
  // 天线
  g.appendChild(line(rc, 250, 50, 250, 130, o, { stroke: 10, seedOffset: 1 }));
  g.appendChild(circle(rc, 250, 50, 20, o, { solidStroke: true, seedOffset: 2 }));
  // 方头
  g.appendChild(rect(rc, 100, 130, 300, 280, o, { stroke: 11, seedOffset: 3 }));
  // 两眼
  g.appendChild(circle(rc, 180, 250, 36, o, { solidStroke: true, seedOffset: 10 }));
  g.appendChild(circle(rc, 320, 250, 36, o, { solidStroke: true, seedOffset: 11 }));
};

/* —— 2. 笑脸 AI —— 大圆 + 双眼 + 嘴弧 */
const drawSmile: AvatarDrawer = (g, rc, o) => {
  g.appendChild(circle(rc, 250, 250, 175, o, { stroke: 11 }));
  // 双眼
  g.appendChild(circle(rc, 195, 215, 14, o, { solidStroke: true, seedOffset: 5 }));
  g.appendChild(circle(rc, 305, 215, 14, o, { solidStroke: true, seedOffset: 6 }));
  // 笑弧 (curve)
  g.appendChild(
    rc.curve(
      [
        [180, 290],
        [220, 340],
        [280, 340],
        [320, 290],
      ],
      {
        stroke: o.stroke,
        strokeWidth: 10,
        roughness: 1.3,
        seed: o.seed + 20,
      }
    )
  );
};

/* —— 3. 大写 M —— 品牌字母 motes */
const drawBigM: AvatarDrawer = (g, rc, o) => {
  // 4 段粗折线构成 M
  const pts: [number, number][] = [
    [110, 410],
    [110, 120],
    [250, 320],
    [390, 120],
    [390, 410],
  ];
  for (let i = 0; i < pts.length - 1; i++) {
    g.appendChild(
      line(rc, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], o, {
        stroke: 28,
        seedOffset: 10 + i,
      })
    );
  }
};

/* —— 4. AI Spark —— 一颗大四角星 + 一小颗 */
const drawSparkBig: AvatarDrawer = (g, rc, o) => {
  const star = (cx: number, cy: number, size: number, seed: number) => {
    const pts: [number, number][] = [
      [cx, cy - size],
      [cx + size * 0.35, cy - size * 0.35],
      [cx + size, cy],
      [cx + size * 0.35, cy + size * 0.35],
      [cx, cy + size],
      [cx - size * 0.35, cy + size * 0.35],
      [cx - size, cy],
      [cx - size * 0.35, cy - size * 0.35],
    ];
    g.appendChild(
      rc.polygon(pts, {
        stroke: o.stroke,
        strokeWidth: 10,
        roughness: 1.3,
        fill: o.stroke,
        fillStyle: 'solid',
        seed: o.seed + seed,
      })
    );
  };
  star(220, 260, 170, 1);
  star(400, 130, 55, 30);
};

/* —— 5. 大眼 —— 椭圆 + 虹膜 + 高光 */
const drawBigEye: AvatarDrawer = (g, rc, o) => {
  g.appendChild(
    rc.ellipse(250, 250, 380, 220, {
      stroke: o.stroke,
      strokeWidth: 11,
      roughness: 1.3,
      fill: o.fill,
      fillStyle: 'solid',
      seed: o.seed + 1,
    })
  );
  g.appendChild(circle(rc, 250, 250, 80, o, { solidStroke: true, seedOffset: 10 }));
  // 高光
  g.appendChild(circle(rc, 285, 225, 18, o, { fill: o.fill, stroke: 4, seedOffset: 20 }));
};

/* —— 6. 爱心 —— AI 助手温度感 */
const drawHeart: AvatarDrawer = (g, rc, o) => {
  const d =
    'M 250 410 ' +
    'C 200 380 100 320 100 220 ' +
    'C 100 150 160 110 210 130 ' +
    'C 235 140 250 165 250 165 ' +
    'C 250 165 265 140 290 130 ' +
    'C 340 110 400 150 400 220 ' +
    'C 400 320 300 380 250 410 Z';
  g.appendChild(
    rc.path(d, {
      stroke: o.stroke,
      strokeWidth: 11,
      roughness: 1.5,
      fill: o.stroke,
      fillStyle: 'solid',
      seed: o.seed + 1,
    })
  );
};

/* —— 7. 中文 "念" —— 单字手写 */
const drawZhiChar: AvatarDrawer = (g, rc, o) => {
  // SVG <text> 直接渲染， 不走 rough（保留手写感， 因为 PEN 字体本身就是手写）
  // 但是 useEffect 里走 rc， 这里改用 g.appendChild + foreign text
  const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  t.setAttribute('x', '250');
  t.setAttribute('y', '360');
  t.setAttribute('text-anchor', 'middle');
  t.setAttribute('font-family', 'var(--font-hand-pen)');
  t.setAttribute('font-size', '380');
  t.setAttribute('font-weight', '700');
  t.setAttribute('fill', o.stroke);
  t.textContent = '念';
  g.appendChild(t);
};

/* —— 8. 猫脸 AI —— 圆头 + 双耳 + 双眼 */
const drawCat: AvatarDrawer = (g, rc, o) => {
  // 左耳
  g.appendChild(
    rc.polygon(
      [
        [120, 230],
        [145, 90],
        [220, 180],
      ],
      {
        stroke: o.stroke,
        strokeWidth: 10,
        roughness: 1.3,
        fill: o.fill,
        fillStyle: 'solid',
        seed: o.seed + 1,
      }
    )
  );
  // 右耳
  g.appendChild(
    rc.polygon(
      [
        [380, 230],
        [355, 90],
        [280, 180],
      ],
      {
        stroke: o.stroke,
        strokeWidth: 10,
        roughness: 1.3,
        fill: o.fill,
        fillStyle: 'solid',
        seed: o.seed + 2,
      }
    )
  );
  // 头
  g.appendChild(circle(rc, 250, 290, 155, o, { stroke: 11, seedOffset: 3 }));
  // 双眼
  g.appendChild(circle(rc, 195, 275, 22, o, { solidStroke: true, seedOffset: 10 }));
  g.appendChild(circle(rc, 305, 275, 22, o, { solidStroke: true, seedOffset: 11 }));
  // 小三角鼻
  g.appendChild(
    rc.polygon(
      [
        [240, 330],
        [260, 330],
        [250, 345],
      ],
      {
        stroke: o.stroke,
        strokeWidth: 5,
        roughness: 1.2,
        fill: o.stroke,
        fillStyle: 'solid',
        seed: o.seed + 20,
      }
    )
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
