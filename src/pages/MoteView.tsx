import { lazy, Suspense, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toPng } from 'html-to-image';
import { findMote } from '../lib/motes';
import { HAND, PEN, INK_SEPIA } from '../components/handwriting';
import { CoverArt } from '../components/cover-art';

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
          <DownloadButton slug={slug} />
        </div>
      </div>
      <div className="mb-4 sm:mb-6 rounded-sm overflow-hidden shadow-md">
        <CoverArt slug={slug} />
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

function DownloadButton({ slug }: { slug: string }) {
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle');

  const handleClick = async () => {
    const node = document.getElementById('mote-paper');
    if (!node) return;
    setState('busy');
    try {
      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#fdfaf0',
      });
      const link = document.createElement('a');
      link.download = `${slug}.png`;
      link.href = dataUrl;
      link.click();
      setState('done');
      setTimeout(() => setState('idle'), 1500);
    } catch (e) {
      console.error(e);
      setState('idle');
    }
  };

  const label =
    state === 'busy' ? '生成中…' : state === 'done' ? '✓ 已下载' : '⤓ 下载图片';

  return (
    <button
      onClick={handleClick}
      disabled={state === 'busy'}
      className="text-sm sm:text-base text-stone-500 hover:text-stone-700 transition-colors px-2 py-1 disabled:opacity-50"
      style={{ fontFamily: PEN }}
      data-no-screenshot
    >
      {label}
    </button>
  );
}
