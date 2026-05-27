import { INK, INK_RED, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  CardText,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'rag',
  index: 5,
  total: 9,
  title: 'Prompt 结构',
};

export default function Card5() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <CardSectionHeading>Prompt 长什么样</CardSectionHeading>
        <CardText size={38}>RAG 的 prompt 结构通常是三段 ——</CardText>

        <div
          style={{
            background: '#fef3c7',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '26px 30px',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            fontFamily: PEN,
            fontSize: 30,
            color: INK,
            lineHeight: 1.5,
          }}
        >
          <div>
            <b style={{ color: INK_SEPIA }}>system</b>：你是 XX 助手。
            <span style={{ color: INK_RED }}>只用下方"参考资料"里的信息回答 ， 不在资料里就说"我不确定"。</span>
          </div>
          <div>
            <b style={{ color: INK_SEPIA }}>参考资料</b>：[chunk 1] [chunk 2] [chunk 3] …
          </div>
          <div>
            <b style={{ color: INK_SEPIA }}>用户问题</b>：query
          </div>
        </div>

        <CardText size={36}>
          关键：明确告诉模型
          <span style={{ color: INK_RED, fontWeight: 700 }}>"只用提供的资料"</span> ，
          引导它别瞎编。 这能显著降低幻觉。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
