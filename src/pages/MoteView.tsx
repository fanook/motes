import { lazy, Suspense, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { findMote } from '../lib/motes';
import { HAND, PEN, INK_SEPIA } from '../components/handwriting';

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
      <div className="mx-auto max-w-3xl px-3 sm:px-6 py-6 sm:py-12">
        <BackLink />
        <p
          className="mt-8 text-stone-500 text-lg"
          style={{ fontFamily: PEN }}
        >
          没找到这条 mote。
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-3 sm:px-6 py-6 sm:py-12">
      <div className="mb-3 sm:mb-4 flex items-baseline justify-between gap-3 flex-wrap pl-1">
        <BackLink />
        <div className="flex items-baseline gap-2 flex-wrap">
          <time
            className="text-base sm:text-lg text-stone-500 tabular-nums"
            style={{ fontFamily: PEN }}
          >
            {entry.meta.date}
          </time>
          {entry.meta.tags?.map((t) => (
            <span
              key={t}
              className="text-base text-stone-500"
              style={{ fontFamily: PEN }}
            >
              · {t}
            </span>
          ))}
        </div>
      </div>
      <Suspense
        fallback={
          <p
            className="text-stone-400 text-lg"
            style={{ fontFamily: PEN }}
          >
            加载中…
          </p>
        }
      >
        <LazyMote />
      </Suspense>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      to="/"
      className="inline-flex items-baseline gap-1 hover:opacity-70 transition-opacity"
      style={{ fontFamily: HAND, color: INK_SEPIA }}
    >
      <span className="text-2xl leading-none">←</span>
      <span className="text-xl sm:text-2xl">返回</span>
    </Link>
  );
}
