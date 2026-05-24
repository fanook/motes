import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MoteView from './pages/MoteView';
import CoverPage from './pages/CoverPage';
import AvatarPreview from './pages/AvatarPreview';
import AvatarExport from './pages/AvatarExport';
import FaviconExport from './pages/FaviconExport';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/m/:slug" element={<MoteView />} />
        <Route path="/cover/:slug" element={<CoverPage />} />
        <Route path="/avatars" element={<AvatarPreview />} />
        <Route path="/avatar/:id" element={<AvatarExport />} />
        <Route path="/favicon-export" element={<FaviconExport />} />
      </Routes>
    </BrowserRouter>
  );
}
