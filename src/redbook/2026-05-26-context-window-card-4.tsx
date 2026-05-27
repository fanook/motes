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
  slug: 'context-window',
  index: 4,
  total: 9,
  title: '标称 vs 真能用',
};

export default function Card4() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 36 }}>
        <CardSectionHeading>标称 ≠ 真能用</CardSectionHeading>

        <div
          style={{
            background: '#fee2e2',
            border: '3px solid ' + INK,
            borderRadius: 20,
            padding: '36px 40px',
            fontFamily: PEN,
            fontSize: 42,
            color: INK,
            lineHeight: 1.5,
          }}
        >
          "声称 32K context 的模型 ， <span style={{ color: INK_RED, fontWeight: 700 }}>只有一半</span>
          能在 32K 长度上维持令人满意的表现。"
        </div>
        <CardText size={30}>—— RULER 基准 (Hsieh et al. 2024, COLM)</CardText>

        <CardText size={40}>
          经典的 <span style={{ color: INK_SEPIA, fontWeight: 700 }}>海捞针</span>
          测试（把一句话埋进大段文本里找）太简单 ， 大家都满分 ——
          但这不代表模型真在"用"上下文。
        </CardText>

        <CardText size={38}>
          RULER 加了多步追踪、 聚合、 多针等更难的任务 ， 才暴露出
          "有效上下文" 远低于 "标称上下文"。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
