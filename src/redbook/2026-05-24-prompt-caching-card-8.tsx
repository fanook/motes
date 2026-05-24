import { INK, INK_GREEN, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  CardText,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'prompt-caching',
  index: 8,
  total: 10,
  title: '必开场景',
};

type Scene = { who: string; why: string; color: string };

const SCENES: Scene[] = [
  {
    who: 'Agent / 多轮对话',
    why: 'system + 工具描述固定 ， 每轮都复用',
    color: '#fef3c7',
  },
  {
    who: 'RAG 检索增强',
    why: '同一批文档反复被问 ， 文档缓存住',
    color: '#dbeafe',
  },
  {
    who: 'Few-shot prompt',
    why: '大段示例固定 ， 只有最后输入变',
    color: '#fce7f3',
  },
  {
    who: '长 context 多次问答',
    why: '一篇长论文 / 长合同 ， 用户反复问',
    color: '#d1fae5',
  },
];

export default function Card6() {
  return (
    <RedbookCard>
      <div
        style={{
          padding: '110px 90px 0 90px',
          display: 'flex',
          flexDirection: 'column',
          gap: 36,
        }}
      >
        <CardSectionHeading>什么场景必开</CardSectionHeading>
        <CardText size={40}>
          只要 prompt 里有"大段不变 + 后面小段变化"的结构 ， 就该开 ——
        </CardText>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {SCENES.map((s) => (
            <div
              key={s.who}
              style={{
                background: s.color,
                border: '3px solid ' + INK,
                borderRadius: 16,
                padding: '22px 30px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 40, color: INK_SEPIA, fontWeight: 700 }}>
                {s.who}
              </div>
              <div style={{ fontFamily: PEN, fontSize: 32, color: INK }}>{s.why}</div>
            </div>
          ))}
        </div>

        <CardText size={36}>
          <span style={{ color: INK_GREEN, fontWeight: 700 }}>原则</span>：单次调用别开 ，
          重复调用必开。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
