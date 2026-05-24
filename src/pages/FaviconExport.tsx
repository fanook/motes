import { useEffect } from 'react';
import { TreeRings } from '../components/tree-rings';

export default function FaviconExport() {
  // 强制透明 ， 让 Playwright 截 PNG 时背景为 alpha 0
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.background;
    const prevBody = body.style.background;
    html.style.background = 'transparent';
    body.style.background = 'transparent';
    return () => {
      html.style.background = prevHtml;
      body.style.background = prevBody;
    };
  }, []);

  return (
    <div
      id="favicon-export"
      style={{
        width: '512px',
        height: '512px',
        margin: 0,
        padding: 0,
        background: 'transparent',
      }}
    >
      <TreeRings size={512} color="#1f2937" ringCount={3} />
    </div>
  );
}
