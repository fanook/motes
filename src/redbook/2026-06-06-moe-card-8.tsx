import { INK, INK_SEPIA, PEN } from '../components/handwriting';
import {
  CardPager,
  CardSectionHeading,
  CardSignature,
  RedbookCard,
} from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'moe',
  index: 8,
  total: 8,
  title: '术语小辞典',
};

type Term = { en: string; ch: string };

const TERMS: Term[] = [
  { en: 'MoE', ch: 'Mixture of Experts ， 混合专家' },
  { en: 'Dense model', ch: '稠密模型 ， 每 token 用所有参数' },
  { en: 'Expert', ch: '专家 ， MoE 里的子网络' },
  { en: 'Router', ch: '路由器 ， 决定 token 走哪些专家' },
  { en: 'Active parameters', ch: '激活参数 ， 单 token 实际经过的量' },
  { en: 'Load balancing loss', ch: '负载均衡损失 ， 防专家闲忙不均' },
  { en: 'Top-k routing', ch: '每个 token 选 k 个专家' },
];

export default function Card8() {
  return (
    <RedbookCard>
      <div style={{ padding: '110px 90px 0 90px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <CardSectionHeading>术语小辞典</CardSectionHeading>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          {TERMS.map((t, i) => (
            <div
              key={t.en}
              style={{
                background: ['#fef3c7', '#dbeafe', '#fce7f3', '#d1fae5', '#ede9fe', '#ffedd5', '#f3e8ff'][i % 7],
                border: '3px solid ' + INK,
                borderRadius: 12,
                padding: '13px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <div style={{ fontFamily: PEN, fontSize: 29, color: INK_SEPIA, fontWeight: 700 }}>{t.en}</div>
              <div style={{ fontFamily: PEN, fontSize: 25, color: INK, lineHeight: 1.3 }}>{t.ch}</div>
            </div>
          ))}
        </div>
      </div>
      <CardPager index={meta.index} total={meta.total} />
      <CardSignature />
    </RedbookCard>
  );
}
