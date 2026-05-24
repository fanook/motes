import { useParams } from 'react-router-dom';
import { AVATAR_SPECS, AvatarArt } from '../components/avatar-art';

export default function AvatarExport() {
  const { id = '' } = useParams();
  const spec = AVATAR_SPECS.find((s) => s.id === id);
  if (!spec) {
    return <div style={{ padding: 40, fontFamily: 'monospace' }}>avatar not found: {id}</div>;
  }
  return (
    <div
      id="avatar-export"
      style={{
        width: '512px',
        height: '512px',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <AvatarArt spec={spec} size={512} />
    </div>
  );
}
