import { INK, INK_RED, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'embedding',
  index: 4,
  total: 10,
  title: '历史脉络',
};

type Era = { year: string; name: string; line: string; color: string };

const ERAS: Era[] = [
  { year: '2013', name: 'Word2Vec', line: '一起出现的词含义相似。 缺点：一词一向量 ， 没上下文', color: '#fef3c7' },
  { year: '2014', name: 'GloVe', line: '基于全局词共现统计 ， 思路类似', color: '#ffedd5' },
  { year: '2018', name: 'BERT / ELMo', line: '上下文相关：同一个词在不同句子给不同向量', color: '#dbeafe' },
  { year: '2024+', name: '现代 API embedding', line: 'OpenAI / Voyage / Cohere ， 对比学习 ， 为 RAG 优化', color: '#d1fae5' },
];

export default function Card4() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <CardSectionHeading>从查表到神经网络</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {ERAS.map((e) => (
            <div
              key={e.name}
              style={{
                background: e.color,
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '20px 28px',
                display: 'flex',
                gap: 22,
                alignItems: 'baseline',
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 34, color: INK_RED, fontWeight: 700, minWidth: 110 }}>
                {e.year}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontFamily: PEN, fontSize: 38, color: INK_SEPIA, fontWeight: 700 }}>
                  {e.name}
                </div>
                <div style={{ fontFamily: PEN, fontSize: 28, color: INK, lineHeight: 1.4 }}>{e.line}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
