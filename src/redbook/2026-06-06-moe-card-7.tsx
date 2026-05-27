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
  slug: 'moe',
  index: 7,
  total: 8,
  title: '谁在用',
};

const USERS: { name: string; line: string }[] = [
  { name: 'DeepSeek V3 / R1', line: '671B / 37B ， 把 MoE + 推理模型一起推出圈' },
  { name: 'Mixtral 8x7B / 8x22B', line: 'Mistral 开源系列 ， 把 MoE 带进开源社区' },
  { name: 'Qwen3-MoE', line: '阿里千问的 MoE 版' },
  { name: 'GPT-4 / GPT-5', line: 'OpenAI 没明说 ， 但业界普遍认为是 MoE' },
  { name: 'Gemini 1.5+', line: 'Google 明确说用了 MoE' },
];

export default function Card7() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <CardSectionHeading>谁在用</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {USERS.map((u, i) => (
            <div
              key={u.name}
              style={{
                background: ['#fef3c7', '#dbeafe', '#fce7f3', '#d1fae5', '#ede9fe'][i],
                border: '3px solid ' + INK,
                borderRadius: 14,
                padding: '18px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 33, color: INK_SEPIA, fontWeight: 700 }}>{u.name}</div>
              <div style={{ fontFamily: PEN, fontSize: 27, color: INK, lineHeight: 1.35 }}>{u.line}</div>
            </div>
          ))}
        </div>

        <div style={{ fontFamily: PEN, fontSize: 28, color: INK_SEPIA, fontWeight: 700 }}>
          2024 是 dense → MoE 拐点 ， 2026 新 frontier 模型几乎全是 MoE。
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
