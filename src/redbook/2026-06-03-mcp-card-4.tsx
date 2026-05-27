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
  slug: 'mcp',
  index: 4,
  total: 9,
  title: '三大原语',
};

const PRIMS: { en: string; ch: string; line: string; color: string }[] = [
  { en: 'Tools', ch: '工具', line: '可执行函数 ， AI 调它做事：查库 / 调 API / 操作文件', color: '#fef3c7' },
  { en: 'Resources', ch: '资源', line: '上下文数据 ， AI 可读但不主动改：文件 / 记录 / schema', color: '#dbeafe' },
  { en: 'Prompts', ch: '提示模板', line: '可复用的 prompt / few-shot ， 服务作者"捎带"最佳实践', color: '#fce7f3' },
];

export default function Card4() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <CardSectionHeading>Server 暴露什么</CardSectionHeading>
        <CardText size={36}>Server 通过三大原语对外提供能力：</CardText>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {PRIMS.map((p) => (
            <div
              key={p.en}
              style={{
                background: p.color,
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '22px 30px',
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 36, color: INK_SEPIA, fontWeight: 700 }}>
                {p.en} <span style={{ fontSize: 30, color: INK }}>{p.ch}</span>
              </div>
              <div style={{ fontFamily: PEN, fontSize: 28, color: INK, lineHeight: 1.4 }}>{p.line}</div>
            </div>
          ))}
        </div>

        <CardText size={30}>
          每个原语都有 list（发现）+ get/call（使用）两类操作。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
