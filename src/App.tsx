import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/layout/Layout';
import Dashboard from './pages/dashboard';
import Revenus from './pages/revenus';
import Investissements from './pages/investissements';
import Agenda from './pages/agenda';
import Projets from './pages/projets';
import Fiscalite from './pages/fiscalite';
import Settings from './pages/settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="revenus" element={<Revenus />} />
            <Route path="investissements" element={<Investissements />} />
            <Route path="agenda" element={<Agenda />} />
            <Route path="projets" element={<Projets />} />
            <Route path="fiscalite" element={<Fiscalite />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
