import { INK, INK_RED, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'context-window',
  index: 6,
  total: 9,
  title: '不止丢中间',
};

type Finding = { title: string; line: string };

const FINDINGS: Finding[] = [
  { title: '多针推理崩', line: '能找到 1 根针 ， 但在多根针间做多跳推理 ， 正确率断崖下降' },
  { title: '非字面匹配崩', line: '"针" 和 "问题" 用同义不同字眼时 ， 检索能力大幅退化 (NoLiMa)' },
  { title: 'distraction 干扰', line: '上下文里有相关但无关 / 相反的信息 ， 模型容易被带偏' },
  { title: 'RoPE 外推失效', line: '训练只见过 8K ， 强推到 128K ， 远端 token 的"位置感"失真' },
];

export default function Card6() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <CardSectionHeading>远不止"丢中间"</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {FINDINGS.map((f, i) => (
            <div
              key={f.title}
              style={{
                display: 'flex',
                gap: 18,
                background: '#fef3c7',
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '20px 28px',
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 38, color: INK_RED, fontWeight: 700, minWidth: 44 }}>
                {i + 1}.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontFamily: PEN, fontSize: 36, color: INK_SEPIA, fontWeight: 700 }}>
                  {f.title}
                </div>
                <div style={{ fontFamily: PEN, fontSize: 28, color: INK, lineHeight: 1.4 }}>{f.line}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontFamily: PEN, fontSize: 28, color: INK, opacity: 0.6 }}>
          结论：窗口标得再大 ， "真能可靠用"的部分要打折看。
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
