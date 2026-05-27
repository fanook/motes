import { INK, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'function-calling',
  index: 7,
  total: 8,
  title: '常见场景',
};

const SCENES: { title: string; line: string; color: string }[] = [
  { title: '查数据', line: '天气 / 股价 / 数据库 SELECT', color: '#fef3c7' },
  { title: '查代码', line: 'grep / 文件读取（IDE 助手）', color: '#dbeafe' },
  { title: '外部 API 编排', line: '发邮件 / 建日程 / 调内部业务', color: '#fce7f3' },
  { title: '数学计算', line: '调 calculator ， 别让模型心算（易错）', color: '#d1fae5' },
  { title: '搜索 / RAG', line: '动态决定是否检索', color: '#ede9fe' },
  { title: '多步推理', line: '思考→调工具→看结果→再思考（ReAct）', color: '#ffedd5' },
];

export default function Card7() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <CardSectionHeading>常见场景</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {SCENES.map((s) => (
            <div
              key={s.title}
              style={{
                background: s.color,
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '18px 28px',
                display: 'flex',
                gap: 20,
                alignItems: 'baseline',
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 34, color: INK_SEPIA, fontWeight: 700, minWidth: 200 }}>
                {s.title}
              </div>
              <div style={{ fontFamily: PEN, fontSize: 27, color: INK }}>{s.line}</div>
            </div>
          ))}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
