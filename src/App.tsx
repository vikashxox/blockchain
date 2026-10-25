import React from 'react';
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ElectionStoreProvider } from './store/electionStore';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { RegisterPage } from './pages/RegisterPage';
import { VoterBoothPage } from './pages/VoterBoothPage';
import { VerifyVotePage } from './pages/VerifyVotePage';
import { ExplorerPage } from './pages/ExplorerPage';
import { ResultsPage } from './pages/ResultsPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { AdminPage } from './pages/AdminPage';

export const App: React.FC = () => {
  return (
    <HashRouter>
      <ElectionStoreProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="voter" element={<VoterBoothPage />} />
            <Route path="verify" element={<VerifyVotePage />} />
            <Route path="explorer" element={<ExplorerPage />} />
            <Route path="results" element={<ResultsPage />} />
            <Route path="roadmap" element={<RoadmapPage />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ElectionStoreProvider>
    </HashRouter>
  );
};

export default App;
