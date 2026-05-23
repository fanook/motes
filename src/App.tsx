import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MoteView from './pages/MoteView';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/m/:slug" element={<MoteView />} />
      </Routes>
    </BrowserRouter>
  );
}
