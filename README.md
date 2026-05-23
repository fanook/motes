# motes

每天用 AI 整理一些细碎的知识。每条知识 = 一个独立的 React 组件，可任意排版与交互。

🌐 在线访问：<https://motes.yifanook.com/>

## 快速开始

```bash
npm install
npm run dev      # 本地预览
npm run build    # 产出 dist/，部署到 Cloudflare Pages
```

## 添加一条新 mote

在 `src/motes/` 下新建文件 `YYYY-MM-DD-slug.tsx`：

```tsx
import type { MoteMeta } from '../lib/motes';

export const meta: MoteMeta = {
  title: '标题',
  date: '2026-05-23',
  tags: ['可选'],
  summary: '可选的一句话简介',
};

export default function Mote() {
  return <article>...</article>;
}
```

保存即可，列表会自动收录，访问路径 `/m/<slug>`。

## 项目结构

```
src/
├── motes/      ← 每条知识一个 .tsx
├── pages/      ← Home（列表）/ MoteView（详情）
├── lib/        ← motes.ts 自动扫描收录
├── App.tsx     ← 路由
└── index.css   ← Tailwind 入口
```

## 技术栈

Vite · React · TypeScript · React Router · Tailwind CSS v4

## 部署

Cloudflare Pages：连接此 repo，构建命令 `npm run build`，输出目录 `dist`。`public/_redirects` 已配置 SPA fallback。
