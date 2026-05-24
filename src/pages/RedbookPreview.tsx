import { useParams } from 'react-router-dom';
import { CARD_H, CARD_W } from '../components/redbook-card';
import { getGroup, listGroups } from '../lib/redbook';

/* 缩放卡片到屏幕方便预览 ， 实际截图走 /redbook-card/:slug/:index */
const DISPLAY_W = 220; // 缩到 ~ 220 宽显示 ， 一行能放 5~6 张

function CardThumb({
  index,
  Component,
  label,
}: {
  index: number;
  Component: React.ComponentType;
  label: string;
}) {
  const scale = DISPLAY_W / CARD_W;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
      <div
        style={{
          width: DISPLAY_W,
          height: CARD_H * scale,
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          borderRadius: 12,
        }}
      >
        <div
          style={{
            width: CARD_W,
            height: CARD_H,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <Component />
        </div>
      </div>
      <div style={{ fontSize: 14, color: '#666' }}>
        #{index} {label}
      </div>
    </div>
  );
}

export default function RedbookPreview() {
  const { slug } = useParams();
  if (slug) {
    const cards = getGroup(slug);
    if (!cards) return <div style={{ padding: 40 }}>未找到组：{slug}</div>;
    return (
      <div style={{ padding: 24, background: '#f4ecd8', minHeight: '100vh' }}>
        <h1 style={{ marginBottom: 8 }}>{slug}</h1>
        <p style={{ marginBottom: 24, color: '#666' }}>
          共 {cards.length} 张， 单卡导出地址：
          <code>/redbook-card/{slug}/&lt;index&gt;</code>
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {cards.map((c) => (
            <CardThumb
              key={c.meta.index}
              index={c.meta.index}
              Component={c.Component}
              label={c.meta.title}
            />
          ))}
        </div>
      </div>
    );
  }
  // 列表所有组
  const groups = listGroups();
  return (
    <div style={{ padding: 24, background: '#f4ecd8', minHeight: '100vh' }}>
      <h1>小红书卡片组</h1>
      <ul>
        {groups.map((g) => (
          <li key={g.slug} style={{ marginBottom: 8 }}>
            <a href={`/redbook/${g.slug}`}>
              {g.slug} ({g.cards.length} 张)
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
