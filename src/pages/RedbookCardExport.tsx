import { useParams } from 'react-router-dom';
import { CARD_H, CARD_W } from '../components/redbook-card';
import { getCard } from '../lib/redbook';

export default function RedbookCardExport() {
  const { slug = '', index = '1' } = useParams();
  const card = getCard(slug, Number(index));
  if (!card) {
    return <div style={{ padding: 40 }}>未找到卡片： {slug} #{index}</div>;
  }
  const C = card.Component;
  return (
    <div
      id="redbook-card-export"
      style={{
        width: CARD_W,
        height: CARD_H,
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <C />
    </div>
  );
}
