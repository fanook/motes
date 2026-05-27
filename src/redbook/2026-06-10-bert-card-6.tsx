import { INK, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'bert',
  index: 6,
  total: 8,
  title: 'BERT 之后的演化',
};

const EVO: { name: string; line: string }[] = [
  { name: 'RoBERTa', line: '更大 batch / 更多数据 / 去掉 NSP（Facebook 2019）' },
  { name: 'ALBERT', line: '参数共享版 ， 小内存（Google 2019）' },
  { name: 'ELECTRA', line: '判断"哪个 token 被替换" ， 不预测 mask（2020）' },
  { name: 'DeBERTa', line: '改进 attention 与位置编码（Microsoft 2020）' },
  { name: 'Sentence-BERT', line: '用对比学习变成句子 embedding 模型（2019）' },
];

export default function Card6() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <CardSectionHeading>BERT 之后的演化</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          {EVO.map((e, i) => (
            <div
              key={e.name}
              style={{
                background: ['#fef3c7', '#dbeafe', '#fce7f3', '#d1fae5', '#ede9fe'][i],
                border: '3px solid ' + INK,
                borderRadius: 13,
                padding: '16px 26px',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 31, color: INK_SEPIA, fontWeight: 700 }}>{e.name}</div>
              <div style={{ fontFamily: PEN, fontSize: 26, color: INK, lineHeight: 1.3 }}>{e.line}</div>
            </div>
          ))}
        </div>

        <div style={{ fontFamily: PEN, fontSize: 27, color: INK, opacity: 0.7 }}>
          现代 embedding（BGE/GTE/OpenAI/Voyage）基本都是 BERT 思路 + 对比学习。
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
