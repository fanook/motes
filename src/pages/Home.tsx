import { Link } from 'react-router-dom';
import { motes } from '../lib/motes';

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-semibold tracking-tight">motes</h1>
        <p className="mt-2 text-stone-500">每天一点细碎的知识</p>
      </header>

      <ul className="space-y-6">
        {motes.map(({ slug, meta }) => (
          <li key={slug} className="group">
            <Link to={`/m/${slug}`} className="block">
              <div className="flex items-baseline gap-3">
                <time className="text-sm text-stone-400 tabular-nums">
                  {meta.date}
                </time>
                {meta.tags?.map((t) => (
                  <span
                    key={t}
                    className="text-xs text-stone-400 rounded-full border border-stone-200 dark:border-stone-700 px-2 py-0.5"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <h2 className="mt-1 text-xl font-medium group-hover:text-stone-500 transition-colors">
                {meta.title}
              </h2>
              {meta.summary && (
                <p className="mt-1 text-stone-500">{meta.summary}</p>
              )}
            </Link>
          </li>
        ))}
      </ul>

      {motes.length === 0 && (
        <p className="text-stone-400">还没有 motes，把 .tsx 文件丢进 src/motes/ 即可。</p>
      )}
    </div>
  );
}
