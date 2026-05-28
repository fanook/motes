import { useEffect, useRef } from 'react';
import rough from 'roughjs';
import type { RoughSVG } from 'roughjs/bin/svg';

/* ─────────────────────────────────────────────
   Palettes
   ───────────────────────────────────────────── */
type Palette = {
  bg: string; // 主背景色块
  ink: string; // 主笔触墨色
  card: string; // 符号填色 / 卡片白
  dot: string; // halftone 圆点色
  paper: string; // 外层 paper border
  tint: string; // 列表卡片背景： 跟封面色互补的浅色调
};

const PALETTES: Palette[] = [
  { bg: '#c47350', ink: '#1a1a1a', card: '#fdfaf0', dot: '#8b4a30', paper: '#f4ecd8', tint: '#fde6d8' }, // 砖红 → 浅桃
  { bg: '#a4b596', ink: '#1a1a1a', card: '#fdfaf0', dot: '#5f7050', paper: '#f4ecd8', tint: '#dde8d0' }, // 鼠尾草 → 浅薄荷
  { bg: '#d4a847', ink: '#1a1a1a', card: '#fdfaf0', dot: '#9a7820', paper: '#f4ecd8', tint: '#fbf2d2' }, // 芥黄 → 奶黄
  { bg: '#3e4863', ink: '#f4ecd8', card: '#fdfaf0', dot: '#1d2335', paper: '#f4ecd8', tint: '#dbe0ef' }, // 深蓝 → 浅蓝灰
  { bg: '#d68b94', ink: '#1a1a1a', card: '#fdfaf0', dot: '#a5616a', paper: '#f4ecd8', tint: '#fadce0' }, // 粉 → 浅腮红
  { bg: '#7a93a8', ink: '#1a1a1a', card: '#fdfaf0', dot: '#465e74', paper: '#f4ecd8', tint: '#dbe7f0' }, // 灰蓝 → 浅天蓝
  { bg: '#b59760', ink: '#1a1a1a', card: '#fdfaf0', dot: '#7a6535', paper: '#f4ecd8', tint: '#f1e7cc' }, // 麦褐 → 浅米
  { bg: '#8a9a5b', ink: '#1a1a1a', card: '#fdfaf0', dot: '#5e6b3e', paper: '#f4ecd8', tint: '#e2e8c8' }, // 橄榄绿 → 浅橄榄
];

function hashSlug(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** 给外部（如 Home 卡片背景）用的 palette 查询 */
export function paletteForSlug(slug: string): Palette {
  return PALETTES[hashSlug(slug) % PALETTES.length];
}

/* ─────────────────────────────────────────────
   Symbol drawers
   每个 drawer 在 (0, 0) ~ (500, 500) 的局部坐标里画
   ───────────────────────────────────────────── */
type DrawOpts = { stroke: string; fill: string; seed: number };
type SymbolDrawer = (g: SVGGElement, rc: RoughSVG, o: DrawOpts) => void;

// 共享 helper
function fillRect(
  rc: RoughSVG,
  x: number,
  y: number,
  w: number,
  h: number,
  o: DrawOpts,
  extra: { stroke?: number; rough?: number; seedOffset?: number } = {}
) {
  return rc.rectangle(x, y, w, h, {
    stroke: o.stroke,
    strokeWidth: extra.stroke ?? 4,
    roughness: extra.rough ?? 1.4,
    fill: o.fill,
    fillStyle: 'solid',
    seed: o.seed + (extra.seedOffset ?? 0),
  });
}
function fillCircle(
  rc: RoughSVG,
  cx: number,
  cy: number,
  r: number,
  o: DrawOpts,
  extra: { stroke?: number; rough?: number; seedOffset?: number; solidStroke?: boolean } = {}
) {
  return rc.circle(cx, cy, r * 2, {
    stroke: o.stroke,
    strokeWidth: extra.stroke ?? 3,
    roughness: extra.rough ?? 1.3,
    fill: extra.solidStroke ? o.stroke : o.fill,
    fillStyle: 'solid',
    seed: o.seed + (extra.seedOffset ?? 0),
  });
}

/* —— 1. Welcome（笔记 + 散落概念） —— */
const drawNotebook: SymbolDrawer = (g, rc, o) => {
  // 中央笔记本
  const noteG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  noteG.setAttribute('transform', 'translate(150, 110) rotate(-4 100 130)');
  noteG.appendChild(fillRect(rc, 0, 0, 200, 260, o));
  [40, 90, 140].forEach((y, i) => {
    const w = i === 1 ? 130 : 110;
    noteG.appendChild(
      rc.line(30, y, 30 + w, y, {
        stroke: o.stroke,
        strokeWidth: 3,
        roughness: 1.6,
        seed: o.seed + 10 + i,
      })
    );
  });
  g.appendChild(noteG);
  // 周围 4 个概念碎片 + 连接线
  [
    [60, 70, 22],
    [430, 100, 18],
    [50, 400, 24],
    [440, 380, 18],
  ].forEach(([cx, cy, r], i) => {
    g.appendChild(
      rc.line(cx, cy, 250, 240, {
        stroke: o.stroke,
        strokeWidth: 1.5,
        roughness: 1.3,
        seed: o.seed + 200 + i,
      })
    );
    g.appendChild(fillCircle(rc, cx, cy, r, o, { seedOffset: 300 + i }));
  });
};

/* —— 2. Token（被切碎的方块） —— */
const drawBrokenBlocks: SymbolDrawer = (g, rc, o) => {
  // 一个长长的方块，被几道虚线切断
  // 切出四段不同长度的小方块
  const segments = [
    { x: 40, w: 90 },
    { x: 140, w: 70 },
    { x: 220, w: 130 },
    { x: 360, w: 90 },
  ];
  segments.forEach((s, i) => {
    g.appendChild(fillRect(rc, s.x, 200, s.w, 100, o, { seedOffset: i * 7 }));
  });
  // 切割虚线
  [130, 215, 355].forEach((x, i) => {
    for (let y = 170; y < 340; y += 16) {
      g.appendChild(
        rc.line(x, y, x, y + 8, {
          stroke: o.stroke,
          strokeWidth: 2,
          roughness: 0.8,
          seed: o.seed + 500 + i * 30 + y,
        })
      );
    }
  });
};

/* —— 3. Prompt Caching（嵌套盒子 / 缓存层） —— */
const drawCacheLayers: SymbolDrawer = (g, rc, o) => {
  // 三层嵌套的圆角矩形， 模拟缓存层级
  [
    { x: 50, y: 90, w: 400, h: 320 },
    { x: 110, y: 130, w: 280, h: 240 },
    { x: 170, y: 170, w: 160, h: 160 },
  ].forEach((b, i) => {
    g.appendChild(fillRect(rc, b.x, b.y, b.w, b.h, o, { seedOffset: i * 7 }));
  });
  // 中心一个实心点
  g.appendChild(fillCircle(rc, 250, 250, 20, o, { seedOffset: 90, solidStroke: true }));
  // 几个箭头指向中心（reuse 的暗示）
  [
    [30, 50, 200, 200],
    [470, 60, 300, 200],
    [30, 450, 200, 300],
  ].forEach(([x1, y1, x2, y2], i) => {
    g.appendChild(
      rc.line(x1, y1, x2, y2, {
        stroke: o.stroke,
        strokeWidth: 2.5,
        roughness: 1.3,
        seed: o.seed + 700 + i,
      })
    );
  });
};

/* —— 4. Embedding（点云聚集） —— */
const drawPointCloud: SymbolDrawer = (g, rc, o) => {
  // 三个聚集的点群， 不同位置不同大小
  const clusters = [
    { cx: 150, cy: 150, n: 6, r: 60, dot: 14 },
    { cx: 360, cy: 180, n: 5, r: 50, dot: 12 },
    { cx: 250, cy: 360, n: 7, r: 70, dot: 13 },
  ];
  clusters.forEach((cl, ci) => {
    for (let i = 0; i < cl.n; i++) {
      const angle = (i / cl.n) * Math.PI * 2 + (o.seed % 100) / 100;
      const dist = (((o.seed + i * 7) % 100) / 100) * cl.r;
      const x = cl.cx + Math.cos(angle) * dist;
      const y = cl.cy + Math.sin(angle) * dist;
      g.appendChild(
        fillCircle(rc, x, y, cl.dot, o, {
          seedOffset: ci * 30 + i,
          solidStroke: true,
        })
      );
    }
  });
};

/* —— 5. Context Window（开口大括号， 框住一些点） —— */
const drawWindowFrame: SymbolDrawer = (g, rc, o) => {
  // 一个粗描边的大矩形， 框住内部的内容
  g.appendChild(fillRect(rc, 60, 100, 380, 300, o, { stroke: 6 }));
  // 框内散落的小方块（代表 token）
  const tokens = [
    [110, 180, 70, 30],
    [200, 170, 100, 30],
    [320, 190, 60, 30],
    [110, 240, 90, 30],
    [220, 250, 130, 30],
    [110, 310, 60, 30],
    [190, 320, 80, 30],
    [290, 310, 100, 30],
  ];
  tokens.forEach((t, i) => {
    g.appendChild(
      fillRect(rc, t[0], t[1], t[2], t[3], o, {
        stroke: 2,
        seedOffset: 100 + i,
      })
    );
  });
};

/* —— 6. Attention（中心节点辐射） —— */
const drawRadiation: SymbolDrawer = (g, rc, o) => {
  const cx = 250;
  const cy = 250;
  // 6 个外围节点 + 连线
  const n = 6;
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * 180;
    const y = cy + Math.sin(angle) * 180;
    // 连线粗细变化暗示注意力权重不同
    const strokeW = 2 + ((o.seed + i) % 4);
    g.appendChild(
      rc.line(cx, cy, x, y, {
        stroke: o.stroke,
        strokeWidth: strokeW,
        roughness: 1.3,
        seed: o.seed + 50 + i,
      })
    );
    g.appendChild(fillCircle(rc, x, y, 22, o, { seedOffset: 100 + i }));
  }
  // 中心实心节点
  g.appendChild(fillCircle(rc, cx, cy, 38, o, { solidStroke: true, seedOffset: 999 }));
};

/* —— 7. RAG（书 + 放大镜） —— */
const drawBookSearch: SymbolDrawer = (g, rc, o) => {
  // 书： 长方形 + 中间线（书脊）
  g.appendChild(fillRect(rc, 80, 130, 280, 220, o));
  g.appendChild(
    rc.line(220, 130, 220, 350, {
      stroke: o.stroke,
      strokeWidth: 3,
      roughness: 1.4,
      seed: o.seed + 30,
    })
  );
  // 书页上几条线
  [180, 220, 260].forEach((y, i) => {
    g.appendChild(
      rc.line(110, y, 200, y, {
        stroke: o.stroke,
        strokeWidth: 2,
        roughness: 1.5,
        seed: o.seed + 40 + i,
      })
    );
  });
  // 放大镜： 大圆 + 把手
  g.appendChild(fillCircle(rc, 360, 380, 60, o, { stroke: 5 }));
  g.appendChild(
    rc.line(400, 420, 460, 470, {
      stroke: o.stroke,
      strokeWidth: 8,
      roughness: 1.2,
      seed: o.seed + 80,
    })
  );
};

/* —— 8. Vector DB（3D 网格 + 点） —— */
const drawVectorGrid: SymbolDrawer = (g, rc, o) => {
  // 一个看起来"立体"的网格平面（菱形）
  // 4 角:
  const corners = [
    [80, 200],
    [250, 130],
    [420, 200],
    [250, 330],
  ];
  // 描边
  corners.forEach((p, i) => {
    const next = corners[(i + 1) % corners.length];
    g.appendChild(
      rc.line(p[0], p[1], next[0], next[1], {
        stroke: o.stroke,
        strokeWidth: 4,
        roughness: 1.3,
        seed: o.seed + i,
      })
    );
  });
  // 内部网格线
  for (let i = 1; i < 5; i++) {
    const t = i / 5;
    const x1 = 80 + (250 - 80) * t;
    const y1 = 200 + (130 - 200) * t;
    const x2 = 250 + (420 - 250) * t;
    const y2 = 330 + (200 - 330) * t;
    g.appendChild(
      rc.line(x1, y1, x2, y2, {
        stroke: o.stroke,
        strokeWidth: 1.5,
        roughness: 1,
        seed: o.seed + 100 + i,
      })
    );
    const x1b = 80 + (250 - 80) * t;
    const y1b = 200 + (330 - 200) * t;
    const x2b = 250 + (420 - 250) * t;
    const y2b = 130 + (200 - 130) * t;
    g.appendChild(
      rc.line(x1b, y1b, x2b, y2b, {
        stroke: o.stroke,
        strokeWidth: 1.5,
        roughness: 1,
        seed: o.seed + 200 + i,
      })
    );
  }
  // 散落的"向量点"
  [
    [180, 200, 14],
    [320, 230, 14],
    [240, 280, 14],
    [250, 380, 18],
  ].forEach(([x, y, r], i) => {
    g.appendChild(
      fillCircle(rc, x, y, r, o, { solidStroke: true, seedOffset: 500 + i })
    );
  });
};

/* —— 9. Function Calling（齿轮模块互连） —— */
const drawModules: SymbolDrawer = (g, rc, o) => {
  // 3 个模块（圆角方块）+ 连接线
  const modules = [
    { x: 60, y: 130, w: 140, h: 120 },
    { x: 310, y: 100, w: 140, h: 120 },
    { x: 180, y: 320, w: 140, h: 120 },
  ];
  modules.forEach((m, i) => {
    g.appendChild(fillRect(rc, m.x, m.y, m.w, m.h, o, { seedOffset: i * 11 }));
    // 每个模块里画 3 个小点表示"内部"
    [-30, 0, 30].forEach((dx, j) => {
      g.appendChild(
        fillCircle(rc, m.x + m.w / 2 + dx, m.y + m.h / 2, 8, o, {
          solidStroke: true,
          seedOffset: 50 + i * 10 + j,
        })
      );
    });
  });
  // 互连
  const connects: [number, number, number, number][] = [
    [200, 190, 310, 160],
    [380, 220, 320, 320],
    [250, 380, 130, 250],
  ];
  connects.forEach((c, i) => {
    g.appendChild(
      rc.line(c[0], c[1], c[2], c[3], {
        stroke: o.stroke,
        strokeWidth: 4,
        roughness: 1.4,
        seed: o.seed + 700 + i,
      })
    );
  });
};

/* —— 10. Chain of Thought（链环） —— */
const drawChain: SymbolDrawer = (g, rc, o) => {
  // 4 个椭圆环交错， 形成链条
  const links = [
    { cx: 110, cy: 250, rot: 25 },
    { cx: 210, cy: 250, rot: -25 },
    { cx: 310, cy: 250, rot: 25 },
    { cx: 410, cy: 250, rot: -25 },
  ];
  links.forEach((l, i) => {
    const ellipse = rc.ellipse(0, 0, 100, 60, {
      stroke: o.stroke,
      strokeWidth: 5,
      roughness: 1.3,
      seed: o.seed + i,
    });
    const linkG = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'g'
    );
    linkG.setAttribute(
      'transform',
      `translate(${l.cx}, ${l.cy}) rotate(${l.rot})`
    );
    linkG.appendChild(ellipse);
    g.appendChild(linkG);
  });
};

/* —— 11. MCP（多插头汇合） —— */
const drawConnectorHub: SymbolDrawer = (g, rc, o) => {
  // 中心枢纽（六边形/圆）
  g.appendChild(fillCircle(rc, 250, 250, 65, o, { stroke: 5 }));
  // 4 个"插头"模块在四角， 由粗连线引到中心
  const plugs = [
    { x: 50, y: 80, w: 90, h: 60 },
    { x: 360, y: 80, w: 90, h: 60 },
    { x: 50, y: 380, w: 90, h: 60 },
    { x: 360, y: 380, w: 90, h: 60 },
  ];
  plugs.forEach((p, i) => {
    g.appendChild(fillRect(rc, p.x, p.y, p.w, p.h, o, { seedOffset: i * 5 }));
    const cx = p.x + p.w / 2;
    const cy = p.y + p.h / 2;
    g.appendChild(
      rc.line(cx, cy, 250, 250, {
        stroke: o.stroke,
        strokeWidth: 4,
        roughness: 1.3,
        seed: o.seed + 100 + i,
      })
    );
  });
};

/* —— 12. Hallucination（扭曲波纹） —— */
const drawDistortion: SymbolDrawer = (g, rc, o) => {
  // 中央"问号般"的扭曲曲线
  for (let i = 0; i < 4; i++) {
    const yo = 150 + i * 40;
    const amp = 30 + i * 5;
    const pts: [number, number][] = [];
    for (let x = 50; x <= 450; x += 30) {
      pts.push([
        x,
        yo + Math.sin((x / 50) + i + (o.seed % 10) * 0.3) * amp,
      ]);
    }
    g.appendChild(
      rc.curve(pts, {
        stroke: o.stroke,
        strokeWidth: 4 - i * 0.4,
        roughness: 1.8,
        seed: o.seed + i * 10,
      })
    );
  }
  // 一两个"幻觉点"
  g.appendChild(
    fillCircle(rc, 380, 180, 18, o, { solidStroke: true, seedOffset: 800 })
  );
  g.appendChild(
    fillCircle(rc, 150, 380, 14, o, { solidStroke: true, seedOffset: 810 })
  );
};

/* —— 13. Sampling（树状分支） —— */
const drawBranching: SymbolDrawer = (g, rc, o) => {
  // 一个起点， 三层分叉
  const root = { x: 250, y: 80 };
  const l1 = [
    { x: 140, y: 200 },
    { x: 360, y: 200 },
  ];
  const l2 = [
    { x: 70, y: 340 },
    { x: 210, y: 340 },
    { x: 290, y: 340 },
    { x: 430, y: 340 },
  ];
  // 连接
  const drawLine = (
    a: { x: number; y: number },
    b: { x: number; y: number },
    seed: number,
    w = 3
  ) => {
    g.appendChild(
      rc.line(a.x, a.y, b.x, b.y, {
        stroke: o.stroke,
        strokeWidth: w,
        roughness: 1.4,
        seed,
      })
    );
  };
  drawLine(root, l1[0], o.seed + 1, 5);
  drawLine(root, l1[1], o.seed + 2, 3);
  drawLine(l1[0], l2[0], o.seed + 3, 4);
  drawLine(l1[0], l2[1], o.seed + 4, 2);
  drawLine(l1[1], l2[2], o.seed + 5, 2);
  drawLine(l1[1], l2[3], o.seed + 6, 4);
  // 节点
  g.appendChild(fillCircle(rc, root.x, root.y, 22, o, { solidStroke: true, seedOffset: 11 }));
  [...l1, ...l2].forEach((p, i) => {
    g.appendChild(fillCircle(rc, p.x, p.y, 16, o, { seedOffset: 100 + i }));
  });
};

/* —— 14. RLHF（反馈回路） —— */
const drawFeedbackLoop: SymbolDrawer = (g, rc, o) => {
  // 两个矩形（model 和 human） + 中间循环箭头
  g.appendChild(fillRect(rc, 60, 200, 140, 100, o));
  g.appendChild(fillRect(rc, 300, 200, 140, 100, o, { seedOffset: 50 }));
  // 上下两个箭头形成循环
  g.appendChild(
    rc.curve(
      [
        [195, 230],
        [250, 150],
        [305, 230],
      ],
      {
        stroke: o.stroke,
        strokeWidth: 4,
        roughness: 1.3,
        seed: o.seed + 100,
      }
    )
  );
  g.appendChild(
    rc.curve(
      [
        [305, 270],
        [250, 350],
        [195, 270],
      ],
      {
        stroke: o.stroke,
        strokeWidth: 4,
        roughness: 1.3,
        seed: o.seed + 101,
      }
    )
  );
  // 内部小圆， 表示输入
  g.appendChild(
    fillCircle(rc, 130, 250, 18, o, { solidStroke: true, seedOffset: 200 })
  );
  g.appendChild(
    fillCircle(rc, 370, 250, 18, o, { solidStroke: true, seedOffset: 210 })
  );
};

/* —— 15. MoE（一对多专家） —— */
const drawExperts: SymbolDrawer = (g, rc, o) => {
  // 顶部一个 router (大方块)， 下面 5 个 expert (小方块)
  g.appendChild(fillRect(rc, 180, 70, 140, 80, o, { stroke: 5 }));
  // expert blocks
  for (let i = 0; i < 5; i++) {
    const x = 50 + i * 90;
    g.appendChild(fillRect(rc, x, 280, 70, 100, o, { seedOffset: 30 + i }));
    // 连接（只有 2 条被激活， 加粗）
    const active = i === 1 || i === 3;
    g.appendChild(
      rc.line(x + 35, 280, 250, 150, {
        stroke: o.stroke,
        strokeWidth: active ? 5 : 1.5,
        roughness: active ? 1.3 : 0.8,
        seed: o.seed + 60 + i,
      })
    );
  }
};

/* —— 16. Chunking（被切分的长条） —— */
const drawChunks: SymbolDrawer = (g, rc, o) => {
  // 6 个不同高度的小方块， 紧挨着， 暗示连续 chunk
  const cols = [
    { h: 180, w: 60 },
    { h: 220, w: 70 },
    { h: 160, w: 60 },
    { h: 240, w: 80 },
    { h: 180, w: 60 },
    { h: 210, w: 70 },
  ];
  let x = 50;
  cols.forEach((c, i) => {
    g.appendChild(
      fillRect(rc, x, 400 - c.h, c.w, c.h, o, { seedOffset: i * 5 })
    );
    x += c.w + 4;
  });
  // 上方一个长条暗示原文档
  g.appendChild(
    fillRect(rc, 30, 120, 440, 50, o, { seedOffset: 90 })
  );
  // 从原文档到 chunk 的虚线
  for (let i = 0; i < 6; i++) {
    const startX = 30 + ((440 / 6) * i + 30);
    for (let y = 180; y < 220; y += 10) {
      g.appendChild(
        rc.line(startX, y, startX, y + 5, {
          stroke: o.stroke,
          strokeWidth: 1.5,
          roughness: 0.5,
          seed: o.seed + 200 + i * 30 + y,
        })
      );
    }
  }
};

/* —— 17. Rerank（重新排序） —— */
const drawReorder: SymbolDrawer = (g, rc, o) => {
  // 左侧 4 个项目（原始顺序）， 右侧 4 个（重排后）
  for (let i = 0; i < 4; i++) {
    g.appendChild(
      fillRect(rc, 50, 100 + i * 70, 130, 50, o, { seedOffset: i })
    );
    g.appendChild(
      fillRect(rc, 320, 100 + i * 70, 130, 50, o, { seedOffset: i + 100 })
    );
  }
  // 重排连接线（交叉）
  const order = [2, 0, 3, 1]; // 原序 → 新序
  order.forEach((to, from) => {
    g.appendChild(
      rc.line(
        180,
        125 + from * 70,
        320,
        125 + to * 70,
        {
          stroke: o.stroke,
          strokeWidth: from === 0 ? 5 : 2.5,
          roughness: 1.4,
          seed: o.seed + 500 + from,
        }
      )
    );
  });
};

/* —— 18. Contrastive Learning（拉近/推远） —— */
const drawContrastive: SymbolDrawer = (g, rc, o) => {
  // 左上：两个相似的点， 中间有"拉近"箭头
  g.appendChild(fillCircle(rc, 90, 130, 30, o, { solidStroke: true, seedOffset: 1 }));
  g.appendChild(fillCircle(rc, 160, 160, 28, o, { solidStroke: true, seedOffset: 2 }));
  // 拉近的指示（两条向内的小线）
  g.appendChild(
    rc.line(120, 105, 140, 130, {
      stroke: o.stroke,
      strokeWidth: 3,
      roughness: 1,
      seed: o.seed + 10,
    })
  );
  g.appendChild(
    rc.line(155, 105, 135, 130, {
      stroke: o.stroke,
      strokeWidth: 3,
      roughness: 1,
      seed: o.seed + 11,
    })
  );
  // 右下：两个相距远的点 + "推远"
  g.appendChild(fillCircle(rc, 320, 320, 30, o, { solidStroke: true, seedOffset: 100 }));
  g.appendChild(fillCircle(rc, 440, 420, 28, o, { solidStroke: true, seedOffset: 101 }));
  // 推远箭头
  g.appendChild(
    rc.line(350, 350, 410, 410, {
      stroke: o.stroke,
      strokeWidth: 3,
      roughness: 1,
      seed: o.seed + 50,
    })
  );
  // 两个虚线圈包住相似 / 不相似的组
  g.appendChild(
    rc.ellipse(125, 145, 150, 120, {
      stroke: o.stroke,
      strokeWidth: 2,
      roughness: 1.6,
      seed: o.seed + 90,
    })
  );
  g.appendChild(
    rc.ellipse(380, 370, 200, 180, {
      stroke: o.stroke,
      strokeWidth: 2,
      roughness: 1.6,
      seed: o.seed + 91,
    })
  );
};

/* —— 19. BERT（双向箭头） —— */
const drawBidirectional: SymbolDrawer = (g, rc, o) => {
  // 中央一个"被遮"的方块（mask）
  g.appendChild(fillRect(rc, 200, 200, 100, 100, o, { stroke: 5 }));
  // 中间画一个 "?"
  g.appendChild(
    rc.curve(
      [
        [228, 245],
        [240, 230],
        [264, 230],
        [275, 248],
        [262, 265],
        [252, 270],
        [252, 280],
      ],
      {
        stroke: o.stroke,
        strokeWidth: 4,
        roughness: 1.2,
        seed: o.seed + 10,
      }
    )
  );
  g.appendChild(
    fillCircle(rc, 252, 290, 5, o, { solidStroke: true, seedOffset: 11 })
  );
  // 左侧 3 个 token
  for (let i = 0; i < 3; i++) {
    g.appendChild(
      fillRect(rc, 30, 200 + i * 35, 60, 28, o, { seedOffset: 30 + i })
    );
  }
  // 右侧 3 个 token
  for (let i = 0; i < 3; i++) {
    g.appendChild(
      fillRect(rc, 410, 200 + i * 35, 60, 28, o, { seedOffset: 50 + i })
    );
  }
  // 左侧 → 中央箭头
  for (let i = 0; i < 3; i++) {
    g.appendChild(
      rc.line(90, 215 + i * 35, 200, 250, {
        stroke: o.stroke,
        strokeWidth: 2,
        roughness: 1.2,
        seed: o.seed + 70 + i,
      })
    );
  }
  // 右侧 → 中央箭头
  for (let i = 0; i < 3; i++) {
    g.appendChild(
      rc.line(410, 215 + i * 35, 300, 250, {
        stroke: o.stroke,
        strokeWidth: 2,
        roughness: 1.2,
        seed: o.seed + 80 + i,
      })
    );
  }
};

/* —— 20. Train/Finetune/RAG（三岔路） —— */
const drawThreePaths: SymbolDrawer = (g, rc, o) => {
  const start = { x: 250, y: 80 };
  const ends = [
    { x: 80, y: 380, label: 'train' },
    { x: 250, y: 380, label: 'finetune' },
    { x: 420, y: 380, label: 'rag' },
  ];
  g.appendChild(
    fillCircle(rc, start.x, start.y, 28, o, { solidStroke: true, seedOffset: 1 })
  );
  ends.forEach((e, i) => {
    g.appendChild(
      rc.line(start.x, start.y, e.x, e.y, {
        stroke: o.stroke,
        strokeWidth: 4 + i,
        roughness: 1.3,
        seed: o.seed + 50 + i,
      })
    );
    g.appendChild(
      fillRect(rc, e.x - 50, e.y - 30, 100, 60, o, { seedOffset: 100 + i })
    );
  });
};

/* —— 22. Planning（搜索树 + 高亮主路径 + 回溯 X） —— */
const drawPlanningTree: SymbolDrawer = (g, rc, o) => {
  // 根节点（顶部）
  const root = { x: 250, y: 60 };
  g.appendChild(fillCircle(rc, root.x, root.y, 32, o, { solidStroke: true, seedOffset: 1, stroke: 6 }));

  // Level-1: 4 个候选分支
  const l1 = [
    { x: 70, y: 230, status: 'normal' as const },
    { x: 180, y: 230, status: 'main' as const },   // 主路径节点（被选中）
    { x: 320, y: 230, status: 'normal' as const },
    { x: 430, y: 230, status: 'failed' as const }, // 探索失败 ， 打 X
  ];

  l1.forEach((p, i) => {
    const isMain = p.status === 'main';
    const isFailed = p.status === 'failed';
    // 连线 ， 主路径加粗
    g.appendChild(
      rc.line(root.x, root.y, p.x, p.y, {
        stroke: o.stroke,
        strokeWidth: isMain ? 9 : 3,
        roughness: 1.3,
        seed: o.seed + 20 + i,
      })
    );
    // 节点
    g.appendChild(
      fillCircle(rc, p.x, p.y, isMain ? 26 : 20, o, {
        solidStroke: isMain,
        stroke: isMain ? 6 : 4,
        seedOffset: 50 + i,
      })
    );
    // 失败分支打 X
    if (isFailed) {
      g.appendChild(
        rc.line(p.x - 18, p.y - 18, p.x + 18, p.y + 18, {
          stroke: o.stroke,
          strokeWidth: 5,
          roughness: 1.4,
          seed: o.seed + 90 + i,
        })
      );
      g.appendChild(
        rc.line(p.x + 18, p.y - 18, p.x - 18, p.y + 18, {
          stroke: o.stroke,
          strokeWidth: 5,
          roughness: 1.4,
          seed: o.seed + 95 + i,
        })
      );
    }
  });

  // Level-2: 从主路径节点（l1[1]）再展开 2 个 ， 其中一个是最终选中
  const l2 = [
    { x: 110, y: 400, status: 'normal' as const },
    { x: 220, y: 400, status: 'final' as const },
  ];
  l2.forEach((p, i) => {
    const isFinal = p.status === 'final';
    g.appendChild(
      rc.line(l1[1].x, l1[1].y, p.x, p.y, {
        stroke: o.stroke,
        strokeWidth: isFinal ? 9 : 3,
        roughness: 1.3,
        seed: o.seed + 120 + i,
      })
    );
    g.appendChild(
      fillCircle(rc, p.x, p.y, isFinal ? 24 : 16, o, {
        solidStroke: isFinal,
        stroke: isFinal ? 6 : 4,
        seedOffset: 150 + i,
      })
    );
  });
};

/* —— 21. AI Agent（中央大脑 + 四件套 + 循环箭头） —— */
const drawAgent: SymbolDrawer = (g, rc, o) => {
  // 中央 LLM 大方块
  g.appendChild(fillRect(rc, 195, 195, 110, 110, o, { stroke: 8 }));
  // 中央实心点表示"大脑"
  g.appendChild(fillCircle(rc, 250, 250, 20, o, { solidStroke: true, seedOffset: 1 }));
  // 4 个外围组件（上下左右）：感知 / 工具 / 记忆 / 规划
  const corners: [number, number][] = [
    [195, 60],   // 上 (感知)
    [395, 195],  // 右 (工具)
    [195, 380],  // 下 (记忆)
    [50, 195],   // 左 (规划)
  ];
  corners.forEach((c, i) => {
    g.appendChild(fillRect(rc, c[0], c[1], 60, 60, o, { stroke: 5, seedOffset: 10 + i }));
  });
  // 4 条循环箭头（顺时针 think → act → observe → memory）
  // 上→右
  g.appendChild(
    rc.curve(
      [[280, 95], [340, 130], [400, 200]],
      { stroke: o.stroke, strokeWidth: 3, roughness: 1.3, seed: o.seed + 30 }
    )
  );
  // 右→下
  g.appendChild(
    rc.curve(
      [[420, 270], [380, 340], [280, 390]],
      { stroke: o.stroke, strokeWidth: 3, roughness: 1.3, seed: o.seed + 31 }
    )
  );
  // 下→左
  g.appendChild(
    rc.curve(
      [[200, 410], [130, 380], [80, 280]],
      { stroke: o.stroke, strokeWidth: 3, roughness: 1.3, seed: o.seed + 32 }
    )
  );
  // 左→上 (闭环)
  g.appendChild(
    rc.curve(
      [[80, 200], [130, 130], [200, 90]],
      { stroke: o.stroke, strokeWidth: 3, roughness: 1.3, seed: o.seed + 33 }
    )
  );
};

/* ─────────────────────────────────────────────
   Slug → drawer 映射
   ───────────────────────────────────────────── */
const SYMBOL_REGISTRY: { test: (slug: string) => boolean; drawer: SymbolDrawer }[] = [
  { test: (s) => s.includes('hello-motes'), drawer: drawNotebook },
  { test: (s) => s.includes('what-is-token'), drawer: drawBrokenBlocks },
  { test: (s) => s.includes('prompt-caching'), drawer: drawCacheLayers },
  { test: (s) => s.includes('embedding'), drawer: drawPointCloud },
  { test: (s) => s.includes('context-window'), drawer: drawWindowFrame },
  { test: (s) => s.includes('attention'), drawer: drawRadiation },
  { test: (s) => s.includes('rag') && !s.includes('train-vs'), drawer: drawBookSearch },
  { test: (s) => s.includes('vector-db'), drawer: drawVectorGrid },
  { test: (s) => s.includes('function-calling'), drawer: drawModules },
  { test: (s) => s.includes('chain-of-thought'), drawer: drawChain },
  { test: (s) => s.includes('mcp'), drawer: drawConnectorHub },
  { test: (s) => s.includes('hallucination'), drawer: drawDistortion },
  { test: (s) => s.includes('sampling'), drawer: drawBranching },
  { test: (s) => s.includes('rlhf'), drawer: drawFeedbackLoop },
  { test: (s) => s.includes('moe'), drawer: drawExperts },
  { test: (s) => s.includes('chunking'), drawer: drawChunks },
  { test: (s) => s.includes('rerank'), drawer: drawReorder },
  { test: (s) => s.includes('contrastive'), drawer: drawContrastive },
  { test: (s) => s.includes('bert'), drawer: drawBidirectional },
  { test: (s) => s.includes('train-vs') || s.includes('finetune'), drawer: drawThreePaths },
  { test: (s) => s.includes('ai-agent'), drawer: drawAgent },
  { test: (s) => s.includes('planning-paradigms'), drawer: drawPlanningTree },
];

function pickDrawer(slug: string): SymbolDrawer {
  for (const { test, drawer } of SYMBOL_REGISTRY) {
    if (test(slug)) return drawer;
  }
  return drawRadiation; // fallback
}

/* ─────────────────────────────────────────────
   Main CoverArt 组件
   ───────────────────────────────────────────── */
export function CoverArt({ slug }: { slug: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const seed = hashSlug(slug);
  const palette = PALETTES[seed % PALETTES.length];
  const variant = (seed >> 8) % 3; // 0/1/2 三种布局变体

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    // 清掉之前 rough 的产物
    svg.querySelectorAll('[data-rough]').forEach((n) => n.remove());
    const rc = rough.svg(svg);

    // 主符号永远画在正中心， 放大 1.4 倍占据更多视觉空间
    // 符号本身在 0-500 局部坐标里画
    // translate(250, 250) + scale(1.4) → 符号填充 250~950， 中心 (600, 600) = canvas 中心
    const symbolG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    symbolG.setAttribute('transform', 'translate(250, 250) scale(1.4)');
    symbolG.setAttribute('data-rough', 'true');
    const drawer = pickDrawer(slug);
    drawer(symbolG, rc, { stroke: palette.ink, fill: palette.card, seed });
    svg.appendChild(symbolG);

  }, [slug, seed, palette, variant]);

  return (
    <svg
      ref={ref}
      viewBox="0 0 1200 1200"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', width: '100%', height: 'auto' }}
    >
      {/* 主色块铺满整个图 */}
      <rect width="1200" height="1200" fill={palette.bg} />

      {/* halftone 装饰： 三种 variant —— 0 在下、 1 没有、 2 在上 */}
      {variant !== 1 && (
        <>
          <defs>
            <pattern
              id={`halftone-${slug}`}
              x="0"
              y="0"
              width="16"
              height="16"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="8" cy="8" r="2" fill={palette.dot} opacity="0.4" />
            </pattern>
          </defs>
          {variant === 0 ? (
            <rect
              x="0"
              y="880"
              width="1200"
              height="320"
              fill={`url(#halftone-${slug})`}
            />
          ) : (
            <rect
              x="0"
              y="0"
              width="1200"
              height="320"
              fill={`url(#halftone-${slug})`}
            />
          )}
        </>
      )}
    </svg>
  );
}
