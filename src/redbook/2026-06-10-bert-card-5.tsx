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
  slug: 'bert',
  index: 5,
  total: 8,
  title: 'embedding 祖宗',
};

const USES: { title: string; line: string }[] = [
  { title: '句子 embedding', line: '取 [CLS] 或池化 ， Sentence-BERT / BGE 的雏形' },
  { title: '分类', line: '[CLS] 接 MLP ， 训情感 / 意图分类器' },
  { title: '命名实体识别', line: '每个 token 接 MLP 打类别标签' },
  { title: '抽取式问答', line: '输出答案在原文的 start/end 位置' },
  { title: 'Cross-encoder rerank', line: 'query+doc 拼一起 ， 输出相关性分数' },
];

export default function Card5() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <CardSectionHeading>为什么是 embedding 祖宗</CardSectionHeading>
        <CardText size={32}>
          预训练完 ， 每个 token 都有上下文相关 embedding。 稍改造就能干很多事：
        </CardText>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {USES.map((u) => (
            <div
              key={u.title}
              style={{
                background: '#fef3c7',
                border: '3px solid ' + INK,
                borderRadius: 13,
                padding: '15px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 30, color: INK_SEPIA, fontWeight: 700 }}>{u.title}</div>
              <div style={{ fontFamily: PEN, fontSize: 25, color: INK, lineHeight: 1.3 }}>{u.line}</div>
            </div>
          ))}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
