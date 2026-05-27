import { INK, INK_RED, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'sampling',
  index: 8,
  total: 9,
  title: '坑',
};

const PITS: { title: string; line: string }[] = [
  { title: 'T 越高 ≠ 越聪明', line: 'T 提到 2 以上 ， 输出经常是胡言乱语' },
  { title: 'T=0 不是"完全确定"', line: '有些后端仍保留少量随机性 ， 想严格确定要传 seed' },
  { title: 'Reasoning 模型对 T 不敏感', line: 'o 系列 / Claude thinking ， 思考链已定走向 ， T 影响小' },
  { title: 'API 默认值不一样', line: 'OpenAI / Anthropic 默认 T=1 ， 部分本地框架默认 0.7。 写代码显式指定' },
];

export default function Card8() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <CardSectionHeading>几个坑</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {PITS.map((p, i) => (
            <div
              key={p.title}
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
                  {p.title}
                </div>
                <div style={{ fontFamily: PEN, fontSize: 28, color: INK, lineHeight: 1.4 }}>{p.line}</div>
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
