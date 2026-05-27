import { INK, INK_GREEN, INK_RED, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'rlhf',
  index: 6,
  total: 7,
  title: '对齐的得与失',
};

export default function Card6() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        <CardSectionHeading>对齐的得与失</CardSectionHeading>

        <div
          style={{
            background: '#d1fae5',
            border: '3px solid ' + INK,
            borderRadius: 16,
            padding: '24px 30px',
          }}
        >
          <div style={{ fontFamily: PEN, fontSize: 34, color: INK_GREEN, fontWeight: 700, marginBottom: 8 }}>
            得
          </div>
          <div style={{ fontFamily: PEN, fontSize: 28, color: INK, lineHeight: 1.5 }}>
            更听话 / 跟得上多轮指令 · 更安全 ， 拒绝危险请求 · 风格语气可控 · 常见话题更少胡说
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
          <div style={{ fontFamily: PEN, fontSize: 34, color: INK_RED, fontWeight: 700, marginBottom: 8 }}>
            失
          </div>
          <div style={{ fontFamily: PEN, fontSize: 28, color: INK, lineHeight: 1.5 }}>
            · <b>Alignment tax</b>：部分原始能力被削弱（创意 / 罕见知识）<br />
            · <b>奉承</b>：倾向迎合用户立场 ， 即使不对<br />
            · <b>过度拒绝</b>：把无害请求误判成有害<br />
            · <b>难审计</b>：RM 是黑盒 ， 不知道它"喜欢什么"
          </div>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
