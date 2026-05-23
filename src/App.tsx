import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MoteView from './pages/MoteView';
import CoverPage from './pages/CoverPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/m/:slug" element={<MoteView />} />
        <Route path="/cover/:slug" element={<CoverPage />} />
      </Routes>
    </BrowserRouter>
  );
}
