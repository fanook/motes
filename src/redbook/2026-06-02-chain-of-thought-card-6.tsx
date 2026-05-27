import { INK, INK_GREEN, INK_RED, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'chain-of-thought',
  index: 6,
  total: 8,
  title: '什么时候用',
};

export default function Card6() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <CardSectionHeading>什么时候用 / 不用</CardSectionHeading>

        <div
          style={{
            background: '#d1fae5',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '24px 30px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 36, color: INK_GREEN, fontWeight: 700, marginBottom: 8 }}>
            该用
          </div>
          <div style={{ fontFamily: PEN, fontSize: 29, color: INK, lineHeight: 1.5 }}>
            · 多步数学 / 推理<br />
            · 需要分类 / 决策（先列依据再下结论）<br />
            · 需要解释 / 引用的回答<br />
            · 用普通（非推理）模型时 ， 性价比高
          </div>
        </div>

        <div
          style={{
            background: '#fee2e2',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '24px 30px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 36, color: INK_RED, fontWeight: 700, marginBottom: 8 }}>
            别用 / 没必要
          </div>
          <div style={{ fontFamily: PEN, fontSize: 29, color: INK, lineHeight: 1.5 }}>
            · 简单查询 / 翻译 / 改写<br />
            · 用推理模型时 ， 自带 thinking 别叠加<br />
            · 对延迟敏感的场景<br />
            · 需要纯结构化输出（CoT 会啰嗦一段）
          </div>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
