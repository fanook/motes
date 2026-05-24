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
  slug: 'hello-motes',
  index: 3,
  total: 4,
  title: '写给谁',
};

type Persona = { who: string; line: string; color: string };

const PERSONAS: Persona[] = [
  {
    who: 'AI 产品经理 / 业务决策',
    line: '一边做产品 ， 一边想懂底层逻辑',
    color: '#fef3c7',
  },
  {
    who: '工程师 / 设计师 转型',
    line: '系统补缺 AI 概念地图',
    color: '#dbeafe',
  },
  {
    who: '想用 AI 但被术语劝退',
    line: 'Token / Embedding / RAG 听过 ， 说不清',
    color: '#fce7f3',
  },
  {
    who: '跟 AI 一起工作的人',
    line: '用得越深 ， 越想知道它的脾气',
    color: '#d1fae5',
  },
];

export default function Card3() {
  return (
    <RedbookCard>
      <div
        style={{
          padding: '110px 90px 0 90px',
          display: 'flex',
          flexDirection: 'column',
          gap: 40,
        }}
      >
        <CardSectionHeading>写给谁看</CardSectionHeading>
        <CardText size={42}>
          motes 适合下面这几类人 ， 看看有没有你 ——
        </CardText>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {PERSONAS.map((p) => (
            <div
              key={p.who}
              style={{
                background: p.color,
                border: '3px solid ' + INK,
                borderRadius: 16,
                padding: '24px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div
                style={{
                  fontFamily: PEN,
                  fontSize: 42,
                  color: INK_SEPIA,
                  fontWeight: 700,
                }}
              >
                {p.who}
              </div>
              <div style={{ fontFamily: PEN, fontSize: 32, color: INK }}>{p.line}</div>
            </div>
          ))}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
