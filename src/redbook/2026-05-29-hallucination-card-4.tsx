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
  slug: 'hallucination',
  index: 4,
  total: 9,
  title: '分类',
};

export default function Card4() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <CardSectionHeading>幻觉怎么分类</CardSectionHeading>

        <div
          style={{
            background: '#dbeafe',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '22px 30px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 32, color: INK_SEPIA, fontWeight: 700, marginBottom: 8 }}>
            按是否依赖外部源
          </div>
          <div style={{ fontFamily: PEN, fontSize: 28, color: INK, lineHeight: 1.5 }}>
            · <b>内在 Intrinsic</b>：输出和给的文档矛盾（总结出原文没说的）
            <br />
            · <b>外在 Extrinsic</b>：无法用提供的事实验证（编造不存在的论文）
          </div>
        </div>

        <div
          style={{
            background: '#fef3c7',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '22px 30px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 32, color: INK_SEPIA, fontWeight: 700, marginBottom: 8 }}>
            按表现
          </div>
          <div style={{ fontFamily: PEN, fontSize: 28, color: INK, lineHeight: 1.5 }}>
            · <b>事实型</b>：说错数字 / 人名 / 时间<br />
            · <b>逻辑型</b>：前后矛盾 / 推理跑偏<br />
            · <b>语境型</b>：答非所问 / 生造内容<br />
            · <b>引用型</b>：编造论文 / URL / 作者
          </div>
        </div>

        <CardText size={28}>来源：Huang et al. 2024 幻觉综述。</CardText>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
