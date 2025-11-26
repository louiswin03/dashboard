import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/dashboard';
import Revenus from './pages/revenus';
import Investissements from './pages/investissements';
import Agenda from './pages/agenda';
import Projets from './pages/projets';
import Fiscalite from './pages/fiscalite';
import Settings from './pages/settings';
import Login from './pages/auth/login';
import Register from './pages/auth/register';

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
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="revenus" element={<Revenus />} />
            <Route path="investissements" element={<Investissements />} />
            <Route path="agenda" element={<Agenda />} />
            <Route path="projets" element={<Projets />} />
            <Route path="fiscalite" element={<Fiscalite />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
