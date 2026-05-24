import { CoverArt } from '../components/cover-art';
import { CardSignature, CardTitle, RedbookCard } from '../components/redbook-card';
import type { RedbookCardMeta } from '../lib/redbook';

export const meta: RedbookCardMeta = {
  slug: 'hello-motes',
  index: 1,
  total: 4,
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
          <CoverArt slug="hello-motes" />
        </div>
        <CardTitle subtitle="一本写给自己的概念辞典">欢迎来到 motes</CardTitle>
      </div>
      <CardSignature />
    </RedbookCard>
  );
}
