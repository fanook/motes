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
  slug: 'context-window',
  index: 8,
  total: 9,
  title: '长上下文 vs RAG',
};

export default function Card8() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <CardSectionHeading>长上下文 vs RAG</CardSectionHeading>

        <div
          style={{
            background: '#d1fae5',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '22px 30px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 36, color: INK_SEPIA, fontWeight: 700, marginBottom: 10 }}>
            长上下文好用
          </div>
          <div style={{ fontFamily: PEN, fontSize: 30, color: INK, lineHeight: 1.5 }}>
            · 文档分析 / 跨段总结（全局推理）<br />
            · 代码理解（跨文件依赖）<br />
            · 多轮对话保留历史<br />
            · 少量、 一次性请求
          </div>
        </div>

        <div
          style={{
            background: '#dbeafe',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '22px 30px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 36, color: INK_SEPIA, fontWeight: 700, marginBottom: 10 }}>
            该用 RAG
          </div>
          <div style={{ fontFamily: PEN, fontSize: 30, color: INK, lineHeight: 1.5 }}>
            · 知识库大到塞不下<br />
            · 高频调用、 成本敏感<br />
            · 知识要频繁更新<br />
            · 需要可追溯来源
          </div>
        </div>

        <CardText size={34}>
          <span style={{ color: INK_GREEN, fontWeight: 700 }}>多数生产系统是混合</span>：RAG
          先粗筛 ， 把最相关的几 K token 塞进 prompt。 单纯"塞 1M"很少最优。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
