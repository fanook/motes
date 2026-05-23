import {
  Paper,
  Section,
  Changelog,
  HAND,
  PEN,
  INK,
  INK_SEPIA,
  INK_RED,
  RoughUnderline,
} from '../components/handwriting';
import type { MoteMeta } from '../lib/motes';

export const meta: MoteMeta = {
  title: '欢迎来到 motes',
  date: '2026-05-23',
  tags: ['关于本子'],
  summary: '为什么开这个本子？把听过却说不清的概念，一条条记下来。',
};

export default function Mote() {
  return (
    <Paper>
      <header className="mb-6 sm:mb-8">
        <h1
          className="text-3xl sm:text-5xl leading-tight"
          style={{ fontFamily: HAND, color: INK_SEPIA }}
        >
          欢迎来到 motes
        </h1>
        <div className="mt-1">
          <RoughUnderline width={200} seed={1} />
        </div>
        <p
          className="mt-2 sm:mt-3 text-lg sm:text-2xl"
          style={{ fontFamily: HAND, color: INK }}
        >
          —— 一本写给自己的概念辞典
        </p>
      </header>

      <div
        className="text-base sm:text-lg leading-relaxed space-y-2 sm:space-y-2.5"
        style={{ fontFamily: PEN }}
      >
        <p>很多东西， 我"听过"。</p>
        <p>
          但 ——
          <span
            className="ml-2"
            style={{ color: INK_RED, fontWeight: 700 }}
          >
            说不清楚。
          </span>
        </p>
        <p>
          <span style={{ color: INK_SEPIA, fontWeight: 700 }}>Token</span>、
          <span style={{ color: INK_SEPIA, fontWeight: 700 }}>Embedding</span>、
          <span style={{ color: INK_SEPIA, fontWeight: 700 }}>
            Context Window
          </span>
          、{' '}
          <span style={{ color: INK_SEPIA, fontWeight: 700 }}>RAG</span>、{' '}
          <span style={{ color: INK_SEPIA, fontWeight: 700 }}>Fine-tuning</span>
          ……
        </p>
        <p>
          这些词在新闻里、 在工具的设置面板里、 在朋友的对话里 反复出现。
        </p>
        <p>我点头， 假装懂。 真要解释 —— 张不开嘴。</p>
      </div>

      <Section title="所以有了这个本子" underlineWidth={200}>
        <p>
          每天一篇。 把听过却没真懂的、 工作中绕不开的、
          想搞清楚的概念， 一条条系统性地记下来。
        </p>
        <p>
          <span style={{ color: INK_RED, fontWeight: 700 }}>不求多， 求懂。</span>{' '}
          一个概念配一个图、 一个例子、 一个类比 —— 任何能"真的搞懂"的方式都用上。
        </p>
      </Section>

      <Section title="AI 是整理伙伴" underlineWidth={180} color={INK_SEPIA}>
        <p>
          每条 mote 都是 AI 帮我把零碎的好奇心 整理成可以反复翻阅的笔记。
        </p>
        <p>
          我读、 我改、 我提问、 它再整理 ——
        </p>
        <p>
          慢慢地， 一本属于我自己的"概念辞典"就长出来了。
        </p>
      </Section>

      <Section title="为什么不是普通博客？" underlineWidth={220}>
        <p>
          因为有些概念， 仅靠文字写不清楚。
        </p>
        <p>
          这里每一篇都是一段会动、 可以交互、 可以画图、可以试一试的笔记。
        </p>
        <p className="text-base sm:text-lg text-stone-500">
          （技术上， 它们是一个个独立的 React 组件。）
        </p>
      </Section>

      <Changelog created={meta.date} entries={meta.changelog} />
    </Paper>
  );
}
