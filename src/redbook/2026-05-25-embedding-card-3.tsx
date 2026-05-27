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
  slug: 'embedding',
  index: 3,
  total: 10,
  title: '著名等式',
};

export default function Card3() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 40 }}>
        <CardSectionHeading>最神奇的等式</CardSectionHeading>

        <div
          style={{
            background: '#fef3c7',
            border: '3px solid ' + INK,
            borderRadius: 20,
            padding: '44px 32px',
            textAlign: 'center',
            fontFamily: PEN,
            fontSize: 44,
            color: INK,
            lineHeight: 1.5,
          }}
        >
          vec(<b style={{ color: INK_SEPIA }}>国王</b>) − vec(<b>男</b>) + vec(<b>女</b>)
          <br />
          ≈ vec(<b style={{ color: INK_RED }}>女王</b>)
        </div>

        <CardText size={42}>
          embedding 不是随便排 —— 它把
          <span style={{ color: INK_SEPIA, fontWeight: 700 }}>语义关系编码成了几何关系</span>。
          "皇室身份" 在空间里 ， 就是一个固定方向。
        </CardText>

        <CardText size={38}>
          最妙的是：<b>没人教模型"皇室"这个概念</b> ， 它从海量语料里自己学出了这个结构。
        </CardText>

        <CardText size={30}>
          Mikolov et al. 2013 (Word2Vec) 发现的现象。
        </CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
