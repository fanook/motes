import { useState } from 'react';
import type { MoteMeta } from '../lib/motes';

export const meta: MoteMeta = {
  title: '一条带交互的 mote',
  date: '2026-05-23',
  tags: ['示例', '交互'],
  summary: '为了证明这玩意儿真的是 React，不是 markdown。',
};

export default function Mote() {
  const [n, setN] = useState(0);
  return (
    <article>
      <h1 className="text-3xl font-semibold tracking-tight">{meta.title}</h1>
      <p className="mt-6">
        既然每条知识都是 React 组件，那直接放个计数器演示一下：
      </p>
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={() => setN((v) => v - 1)}
          className="w-10 h-10 rounded-full border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
        >
          −
        </button>
        <span className="text-3xl font-mono tabular-nums w-12 text-center">
          {n}
        </span>
        <button
          onClick={() => setN((v) => v + 1)}
          className="w-10 h-10 rounded-full border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
        >
          +
        </button>
      </div>
      <p className="mt-8 text-stone-500">
        想象一下：解释一个算法时直接放可视化、记一个 RegExp 时直接放试输入框…… markdown 给不了的，这里都行。
      </p>
    </article>
  );
}
