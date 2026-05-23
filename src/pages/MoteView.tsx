import { lazy, Suspense, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { findMote } from '../lib/motes';

export default function MoteView() {
  const { slug = '' } = useParams();
  const entry = findMote(slug);

  const LazyMote = useMemo(() => {
    if (!entry) return null;
    return lazy(async () => {
      const mod = await entry.load();
      return { default: mod.default };
    });
  }, [entry]);

  if (!entry || !LazyMote) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link to="/" className="text-sm text-stone-400 hover:text-stone-600">
          ← 返回
        </Link>
        <p className="mt-8 text-stone-500">没找到这条 mote。</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link to="/" className="text-sm text-stone-400 hover:text-stone-600">
        ← 返回
      </Link>
      <div className="mt-4 mb-8 flex items-baseline gap-3">
        <time className="text-sm text-stone-400 tabular-nums">
          {entry.meta.date}
        </time>
        {entry.meta.tags?.map((t) => (
          <span
            key={t}
            className="text-xs text-stone-400 rounded-full border border-stone-200 dark:border-stone-700 px-2 py-0.5"
          >
            {t}
          </span>
        ))}
      </div>
      <Suspense fallback={<p className="text-stone-400">加载中…</p>}>
        <LazyMote />
      </Suspense>
    </div>
  );
}
