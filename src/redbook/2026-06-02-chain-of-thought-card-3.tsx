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
  slug: 'chain-of-thought',
  index: 3,
  total: 8,
  title: '两种触发方式',
};

export default function Card3() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <CardSectionHeading>两种触发方式</CardSectionHeading>

        <div
          style={{
            background: '#dbeafe',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '24px 30px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 36, color: INK_SEPIA, fontWeight: 700, marginBottom: 8 }}>
            1. Few-shot CoT
          </div>
          <div style={{ fontFamily: PEN, fontSize: 30, color: INK, lineHeight: 1.5 }}>
            在 prompt 里给几个 "问题 + 推理过程 + 答案" 的示例 ， 让模型模仿。
            （Wei et al. 2022 原版）
          </div>
        </div>

        <div
          style={{
            background: '#d1fae5',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '24px 30px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 36, color: INK_SEPIA, fontWeight: 700, marginBottom: 8 }}>
            2. Zero-shot CoT
          </div>
          <div style={{ fontFamily: PEN, fontSize: 30, color: INK, lineHeight: 1.5 }}>
            不给示例 ， 只在末尾加一句魔咒：
            <br />
            <span style={{ color: INK_RED, fontWeight: 700 }}>"Let's think step by step."</span>
            （Kojima et al. 2022）
          </div>
        </div>

        <CardText size={32}>
          中文场景用 "请一步一步思考"、 "让我一步步分析" 同样有效。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
