import { CoverArt } from '../components/cover-art';
import { CardSignature, CardTitle, RedbookCard } from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'train-vs-finetune-vs-rag',
  index: 1,
  total: 8,
  title: '封面',
};

export default function Card1() {
  return (
    <RedbookCard noLines>
      <div
        style={{
          width: '100%',
          height: '100%',
          padding: '180px 90px 220px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ width: 620, height: 620 }}>
          <CoverArt slug="train-vs-finetune-vs-rag" />
        </div>
        <CardTitle subtitle="想让 AI 懂业务 ， 该选哪条路">训练 vs 微调 vs RAG</CardTitle>
      </div>
      <CardSignature />
    </RedbookCard>
  );
}
