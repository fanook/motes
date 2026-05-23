import type { ComponentType } from 'react';

export type MoteMeta = {
  title: string;
  date: string;
  tags?: string[];
  summary?: string;
};

export type MoteModule = {
  meta: MoteMeta;
  default: ComponentType;
};

export type MoteEntry = {
  slug: string;
  meta: MoteMeta;
  load: () => Promise<MoteModule>;
};

const modules = import.meta.glob<MoteModule>('../motes/*.tsx');
const eagerMeta = import.meta.glob<MoteMeta>('../motes/*.tsx', {
  import: 'meta',
  eager: true,
});

function pathToSlug(path: string): string {
  const file = path.split('/').pop() ?? '';
  return file.replace(/\.tsx$/, '');
}

export const motes: MoteEntry[] = Object.entries(modules)
  .map(([path, load]) => ({
    slug: pathToSlug(path),
    meta: eagerMeta[path],
    load,
  }))
  .sort((a, b) => (a.meta.date < b.meta.date ? 1 : -1));

export function findMote(slug: string): MoteEntry | undefined {
  return motes.find((m) => m.slug === slug);
}
