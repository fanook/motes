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
  slug: 'embedding',
  index: 5,
  total: 10,
  title: '维度取舍',
};

export default function Card5() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <CardSectionHeading>维度怎么选</CardSectionHeading>
        <CardText size={40}>
          向量维度（dimension）是个权衡：
        </CardText>

        <div style={{ display: 'flex', gap: 18 }}>
          <div
            style={{
              flex: 1,
              background: '#fce7f3',
              border: '3px solid ' + INK,
              borderRadius: 14,
              padding: '24px 28px',
              fontFamily: PEN,
              color: INK,
            }}
          >
            <div style={{ fontSize: 38, color: INK_SEPIA, fontWeight: 700, marginBottom: 8 }}>高维 3072</div>
            <div style={{ fontSize: 30, lineHeight: 1.45 }}>表达力强 ， 区分细微差异。 但存储贵、 检索慢。</div>
          </div>
          <div
            style={{
              flex: 1,
              background: '#dbeafe',
              border: '3px solid ' + INK,
              borderRadius: 14,
              padding: '24px 28px',
              fontFamily: PEN,
              color: INK,
            }}
          >
            <div style={{ fontSize: 38, color: INK_SEPIA, fontWeight: 700, marginBottom: 8 }}>低维 256~768</div>
            <div style={{ fontSize: 30, lineHeight: 1.45 }}>紧凑、 快。 但精度有损失。</div>
          </div>
        </div>

        <div
          style={{
            background: '#fef3c7',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '24px 32px',
          }}
        >
          <CardText size={36}>
            <span style={{ color: INK_GREEN, fontWeight: 700 }}>Matryoshka 套娃表征</span>
            ：训练时让前 N 维就单独能用。 一份 embedding 同时支持 256 / 512 / 1024 / 3072。
          </CardText>
          <CardText size={32}>
            实战：存大维度 ， 查时小维度粗筛 ， 再大维度精排。
          </CardText>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
