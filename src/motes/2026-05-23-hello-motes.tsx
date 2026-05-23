import type { MoteMeta } from '../lib/motes';

export const meta: MoteMeta = {
  title: '欢迎来到 motes',
  date: '2026-05-23',
  tags: ['meta'],
  summary: '关于这个项目，以及为什么每条知识都是一个独立的 React 组件。',
};

export default function Mote() {
  return (
    <article className="prose prose-stone dark:prose-invert max-w-none">
      <h1 className="text-3xl font-semibold tracking-tight">{meta.title}</h1>
      <p className="mt-6">
        每天积累一点细碎的知识。每一条 mote 就是 <code className="px-1 py-0.5 rounded bg-stone-100 dark:bg-stone-800">src/motes/</code> 下的一个 <code className="px-1 py-0.5 rounded bg-stone-100 dark:bg-stone-800">.tsx</code> 文件。
      </p>
      <p className="mt-4">
        因为它是 React 组件，你可以随意发挥：自定义排版、嵌入可交互的小工具、做图表、动画……markdown 做不到的，这里都可以。
      </p>
      <div className="mt-8 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 bg-white dark:bg-stone-900">
        <p className="text-sm text-stone-400">小贴士</p>
        <p className="mt-1">
          文件名建议用 <code className="px-1 py-0.5 rounded bg-stone-100 dark:bg-stone-800">YYYY-MM-DD-slug.tsx</code>，导出 <code className="px-1 py-0.5 rounded bg-stone-100 dark:bg-stone-800">meta</code> 和 <code className="px-1 py-0.5 rounded bg-stone-100 dark:bg-stone-800">default</code> 组件即可，列表会自动收录。
        </p>
      </div>
    </article>
  );
}
