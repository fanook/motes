# motes

每天用 AI 整理一些细碎的知识。每条知识 = `src/motes/` 下的一个 `.tsx` 文件，自动收录、自动生成路由。

## 技术栈

- Vite + React + TypeScript
- React Router（`/` 列表，`/m/:slug` 详情）
- Tailwind CSS v4（`@tailwindcss/vite` 插件）
- 部署：Cloudflare Pages（纯静态，构建命令 `npm run build`，输出 `dist`）

## 添加一条新 mote

新建 `src/motes/YYYY-MM-DD-slug.tsx`，导出 `meta` 和默认组件：

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

无需手动注册路由 —— `src/lib/motes.ts` 通过 `import.meta.glob` 自动扫描。

## 约定

- 文件名格式：`YYYY-MM-DD-slug.tsx`，`slug` 部分即 URL。
- `meta.date` 用 ISO 日期字符串，列表按日期倒序。
- 每条 mote 可以自由用 React/Tailwind 做任意排版与交互，不必拘泥统一模板。

## Git 提交规范

- **commit message 简洁为主**，一行能讲清就一行，不写多段详述。
- 形如 `add mote: 标题`、`tweak home layout`、`fix router` 即可。
- 不要堆砌 "what/why/how" 多段说明，PR/diff 已经能看出细节。
