import { INK, INK_RED, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'rag',
  index: 6,
  total: 9,
  title: '常见的坑',
};

const PITS: { title: string; line: string }[] = [
  { title: '切块太碎', line: '一个完整概念被切两段 ， 检索找不全' },
  { title: '切块太大', line: '信息密度低 ， 嵌入向量含义模糊' },
  { title: '语义相似 ≠ 答案相关', line: '"什么是 X" 和 "X 的缺点" 语义近 ， 需要 rerank' },
  { title: '多跳问题', line: '"CEO 是谁？他多大？" 一次检索拿不全 ， 要多步' },
  { title: 'embedding 漂移', line: '升级 embedding 模型后 ， 老向量库要全部重嵌' },
  { title: '没引用', line: '用户看不到出处 ， 无法验证答案真假' },
];

export default function Card6() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <CardSectionHeading>常见的坑</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          {PITS.map((p, i) => (
            <div
              key={p.title}
              style={{
                display: 'flex',
                gap: 16,
                background: '#fef3c7',
                border: '3px solid ' + INK,
                borderRadius: 13,
                padding: '15px 24px',
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 32, color: INK_RED, fontWeight: 700, minWidth: 40 }}>
                {i + 1}.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ fontFamily: PEN, fontSize: 31, color: INK_SEPIA, fontWeight: 700 }}>{p.title}</div>
                <div style={{ fontFamily: PEN, fontSize: 26, color: INK, lineHeight: 1.35 }}>{p.line}</div>
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
