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
  slug: 'rlhf',
  index: 3,
  total: 7,
  title: '为什么这样设计',
};

export default function Card3() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <CardSectionHeading>为什么需要三步</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: PEN, fontSize: 32, color: INK }}>
          <div>· <b style={{ color: INK_SEPIA }}>SFT 教"形式"</b>：这样说话才像助手</div>
          <div>· <b style={{ color: INK_SEPIA }}>RM 学"偏好"</b>：把"什么算好回答"编码成可微分数</div>
          <div>· <b style={{ color: INK_SEPIA }}>RL 让探索</b>：自己生成自己学 ， 不用人写完美答案</div>
        </div>

        <div
          style={{
            background: '#fef3c7',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '30px 32px',
            textAlign: 'center',
          }}
        >
          <CardText size={44}>
            核心洞见：
            <br />
            <span style={{ color: INK_RED, fontWeight: 700 }}>评判 ≠ 写</span>
          </CardText>
          <CardText size={34}>
            人"评判好坏"比"写完美回答"容易得多 —— 所以能低成本大规模标注。
          </CardText>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
