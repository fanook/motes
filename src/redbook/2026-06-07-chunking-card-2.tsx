import { INK, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  CardText,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'chunking',
  index: 2,
  total: 8,
  title: '为什么必须切',
};

const REASONS: { title: string; line: string; color: string }[] = [
  { title: 'Embedding 有上限', line: '8K~32K token ， 长文档直接喂会被截断', color: '#fef3c7' },
  { title: '检索粒度要精', line: '整本 100 页 PDF 当一个 chunk ， 检索拿到一整本没用', color: '#dbeafe' },
  { title: '塞 LLM 省 token', line: '只想给模型最相关的几段 ， 不是整篇', color: '#d1fae5' },
];

export default function Card2() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <CardSectionHeading>为什么必须切</CardSectionHeading>
        <CardText size={38}>
          做 RAG 第一步就是把长文档切成小块（chunk）。 为什么不能整篇直接用？
        </CardText>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {REASONS.map((r) => (
            <div
              key={r.title}
              style={{
                background: r.color,
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '22px 30px',
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 34, color: INK_SEPIA, fontWeight: 700 }}>{r.title}</div>
              <div style={{ fontFamily: PEN, fontSize: 28, color: INK, lineHeight: 1.4 }}>{r.line}</div>
            </div>
          ))}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
