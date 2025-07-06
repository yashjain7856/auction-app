import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import SetupWindow from './pages/SetupWindow';
import AuctionWindow from './pages/AuctionWindow';
import TeamsWindow from './pages/TeamsWindow';
import PlayersPage from './pages/PlayersPage';
import ExportImportPanel from './pages/ExportImportPanel';

export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/setup" element={<SetupWindow />} />
        <Route path="/auction" element={<AuctionWindow />} />
        <Route path="/teams" element={<TeamsWindow />} />
        <Route path="/players" element={<PlayersPage />} />
        <Route path="/share" element={<ExportImportPanel />} />
      </Routes>
    </div>
  );
}
