import { INK, INK_RED, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  CardText,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'hello-motes',
  index: 2,
  total: 4,
  title: '听过却说不清',
};

const TERMS = ['Token', 'Embedding', 'Context Window', 'RAG', 'Fine-tuning', 'MoE', 'Attention'];

export default function Card2() {
  return (
    <RedbookCard>
      <div
        style={{
          padding: '110px 90px 0 90px',
          display: 'flex',
          flexDirection: 'column',
          gap: 48,
        }}
      >
        <CardSectionHeading>很多词 ， 听过</CardSectionHeading>
        <CardText>
          但真要说清楚 ， 张不开嘴 ——
        </CardText>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 18,
            marginTop: 8,
          }}
        >
          {TERMS.map((t, i) => (
            <span
              key={t}
              style={{
                fontFamily: PEN,
                fontSize: 44,
                color: INK_SEPIA,
                background: ['#fef3c7', '#dbeafe', '#fce7f3', '#d1fae5', '#ede9fe', '#ffedd5', '#f3e8ff'][i % 7],
                border: '3px solid ' + INK,
                borderRadius: 16,
                padding: '14px 26px',
                fontWeight: 700,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        <CardText size={44}>
          在新闻里、 工具的设置面板里、 朋友的对话里 反复出现。
        </CardText>
        <CardText size={48}>
          点头 ， 假装懂。 真要解释 ——{' '}
          <span style={{ color: INK_RED, fontWeight: 700 }}>说不清楚。</span>
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
