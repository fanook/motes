import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// 自托管字体，避免依赖 Google CDN（大陆容易加载失败）
// 只 import 用得到的子集（latin + chinese-simplified），不要加载完整 .css，否则会带上 cyrillic/devanagari/越南语 等没用的部分
import '@fontsource/caveat/latin-400.css'
import '@fontsource/caveat/latin-700.css'
import '@fontsource/kalam/latin-400.css'
import '@fontsource/kalam/latin-700.css'
import '@fontsource/ma-shan-zheng/latin-400.css'
import '@fontsource/ma-shan-zheng/chinese-simplified-400.css'
import '@fontsource/long-cang/latin-400.css'
import '@fontsource/long-cang/chinese-simplified-400.css'

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
