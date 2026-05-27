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
  slug: 'moe',
  index: 3,
  total: 8,
  title: '总参数 vs 激活',
};

const MODELS: { name: string; total: string; active: string }[] = [
  { name: 'DeepSeek V3', total: '671B', active: '37B' },
  { name: 'Mixtral 8x22B', total: '141B', active: '39B' },
  { name: 'Qwen3-235B', total: '235B', active: '22B' },
];

export default function Card3() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <CardSectionHeading>两个参数量</CardSectionHeading>
        <CardText size={32}>
          · <b style={{ color: INK_SEPIA }}>总参数</b>：所有专家加起来 ， 决定<b>知识容量</b><br />
          · <b style={{ color: INK_SEPIA }}>激活参数</b>：单 token 真正经过的 ， 决定<b>推理成本</b>
        </CardText>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {MODELS.map((m) => (
            <div
              key={m.name}
              style={{
                background: '#fef3c7',
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '18px 28px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 32, color: INK_SEPIA, fontWeight: 700 }}>{m.name}</div>
              <div style={{ fontFamily: PEN, fontSize: 30, color: INK }}>
                总 <b>{m.total}</b> / 激活 <b style={{ color: INK_GREEN }}>{m.active}</b>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: '#d1fae5',
            border: '3px solid ' + INK,
            borderRadius: 14,
            padding: '22px 30px',
          }}
        >
          <CardText size={36}>
            所以 MoE 能同时<b>很大</b>（容量）+ <b>便宜</b>（推理）。
          </CardText>
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
