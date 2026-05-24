import type { ComponentType } from 'react';

export type RedbookCardMeta = {
  /** 所属 mote slug */
  slug: string;
  /** 在该组中的 index (从 1 开始) */
  index: number;
  /** 该组卡片总数 */
  total: number;
  /** 卡片简短描述 (用于预览列表) */
  title: string;
};

type Mod = {
  default: ComponentType;
  meta: RedbookCardMeta;
};

const modules = import.meta.glob<Mod>('../redbook/*.tsx', { eager: true });

export type CardEntry = {
  file: string;
  meta: RedbookCardMeta;
  Component: ComponentType;
};

/** 按 slug 分组 ， 每组按 index 排好序 */
export function listGroups(): { slug: string; cards: CardEntry[] }[] {
  const all: CardEntry[] = Object.entries(modules).map(([file, m]) => ({
    file,
    meta: m.meta,
    Component: m.default,
  }));
  const grouped = new Map<string, CardEntry[]>();
  for (const c of all) {
    if (!grouped.has(c.meta.slug)) grouped.set(c.meta.slug, []);
    grouped.get(c.meta.slug)!.push(c);
  }
  return Array.from(grouped.entries()).map(([slug, cards]) => ({
    slug,
    cards: cards.sort((a, b) => a.meta.index - b.meta.index),
  }));
}

export function getGroup(slug: string): CardEntry[] | undefined {
  return listGroups().find((g) => g.slug === slug)?.cards;
}

export function getCard(slug: string, index: number): CardEntry | undefined {
  return getGroup(slug)?.find((c) => c.meta.index === index);
}
