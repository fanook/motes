import { useParams } from 'react-router-dom';
import { CoverArt } from '../components/cover-art';

export default function CoverPage() {
  const { slug = '' } = useParams();
  return (
    <div
      id="cover-art-page"
      style={{
        width: '1200px',
        height: '1200px',
        margin: 0,
        padding: 0,
        background: '#f4ecd8',
      }}
    >
      <CoverArt slug={slug} />
    </div>
  );
}
