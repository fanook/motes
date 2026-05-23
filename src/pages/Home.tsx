import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motes, type MoteEntry } from '../lib/motes';
import {
  Paper,
  HAND,
  PEN,
  INK,
  INK_SEPIA,
  INK_RED,
  RoughUnderline,
  ShuffleIcon,
} from '../components/handwriting';

const cardColors = [
  '#fef3c7',
  '#dbeafe',
  '#fce7f3',
  '#d1fae5',
  '#ede9fe',
  '#ffedd5',
  '#fee2e2',
  '#cffafe',
  '#fef9c3',
  '#e0f2fe',
];

function simpleHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Home() {
  const [order, setOrder] = useState<MoteEntry[]>(motes);
  const [spin, setSpin] = useState(false);

  const items = useMemo(() => order, [order]);

  const handleShuffle = () => {
    setOrder((prev) => {
      // 保证至少跟当前顺序不同（条目 ≥ 2 时）
      if (prev.length < 2) return prev;
      let next = shuffleArray(prev);
      let safety = 5;
      while (
        safety-- > 0 &&
        next.every((m, i) => m.slug === prev[i].slug)
      ) {
        next = shuffleArray(prev);
      }
      return next;
    });
    setSpin((s) => !s);
  };

  return (
    <div className="mx-auto max-w-3xl px-3 sm:px-6 py-6 sm:py-12">
      <Paper>
        <header className="mb-8 sm:mb-10 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1
              className="text-5xl sm:text-6xl leading-none"
              style={{ fontFamily: HAND, color: INK_SEPIA }}
            >
              motes
            </h1>
            <div className="mt-1">
              <RoughUnderline width={120} seed={1} color={INK_RED} />
            </div>
            <p
              className="mt-3 text-lg sm:text-xl text-stone-500"
              style={{ fontFamily: PEN }}
            >
              每天一点 AI 知识碎片
            </p>
          </div>

          <button
            onClick={handleShuffle}
            title="打乱顺序"
            aria-label="打乱顺序"
            className="flex items-center justify-center pb-1 cursor-pointer hover:opacity-70 transition-opacity"
          >
            <ShuffleIcon color={INK_SEPIA} size={30} spin={spin} />
          </button>
        </header>

        {items.length === 0 ? (
          <p
            className="text-stone-400 text-lg"
            style={{ fontFamily: PEN }}
          >
            还没有 motes，把 .tsx 文件丢进 src/motes/ 即可。
          </p>
        ) : (
          <ColorListView motes={items} />
        )}
      </Paper>
    </div>
  );
}

function ColorListView({ motes }: { motes: MoteEntry[] }) {
  return (
    <ul className="space-y-2.5 sm:space-y-4">
      {motes.map(({ slug, meta }) => {
        const h = simpleHash(slug);
        const bg = cardColors[h % cardColors.length];
        const tilt = (((h >> 4) % 5) - 2) * 0.2;
        return (
          <li key={slug}>
            <Link
              to={`/m/${slug}`}
              className="block transition-transform hover:translate-x-0.5"
              style={{ transform: `rotate(${tilt}deg)` }}
            >
              <div
                className="px-3 py-2.5 sm:p-5 rounded-sm shadow-md hover:shadow-lg transition-shadow"
                style={{ backgroundColor: bg }}
              >
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <time
                    className="text-[11px] sm:text-sm text-stone-500 tabular-nums"
                    style={{ fontFamily: PEN }}
                  >
                    {meta.date}
                  </time>
                  {meta.tags?.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] sm:text-xs text-stone-500"
                      style={{ fontFamily: PEN }}
                    >
                      · {t}
                    </span>
                  ))}
                </div>
                <h2
                  className="text-base sm:text-3xl mt-0.5 leading-tight"
                  style={{ fontFamily: HAND, color: INK }}
                >
                  {meta.title}
                </h2>
                {meta.summary && (
                  <p
                    className="mt-0.5 sm:mt-1 text-xs sm:text-base text-stone-600 leading-snug"
                    style={{ fontFamily: PEN }}
                  >
                    {meta.summary}
                  </p>
                )}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
