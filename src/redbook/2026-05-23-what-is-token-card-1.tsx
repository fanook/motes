import { CoverArt } from '../components/cover-art';
import type { RedbookCardMeta } from '../lib/redbook';
import { CardSignature, CardTitle, RedbookCard } from '../components/redbook-card';

export const meta: RedbookCardMeta = {
  slug: 'what-is-token',
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
          <CoverArt slug="what-is-token" />
        </div>
        <CardTitle subtitle={'AI 眼里的"小积木"'}>Token 是什么</CardTitle>
      </div>
      <CardSignature />
    </RedbookCard>
  );
}
