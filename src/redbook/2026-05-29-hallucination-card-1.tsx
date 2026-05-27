import { CoverArt } from '../components/cover-art';
import { CardSignature, CardTitle, RedbookCard } from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'hallucination',
  index: 1,
  total: 9,
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
          <CoverArt slug="hallucination" />
        </div>
        <CardTitle subtitle="AI 为什么会一本正经地胡说">Hallucination 幻觉</CardTitle>
      </div>
      <CardSignature />
    </RedbookCard>
  );
}
