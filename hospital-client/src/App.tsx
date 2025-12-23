import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/layout/Layout';
import { Loading } from './components/common/Loading';

// Pages
import { Home } from './pages/Home';
import { ServicesList } from './pages/Services/ServicesList';
import { ServiceDetail } from './pages/Services/ServiceDetail';
import { BookService } from './pages/Services/BookService';
import { BookLab } from './pages/Laboratory/BookLab';
import { TrackResult } from './pages/Laboratory/TrackResult';
import { Login } from './pages/Patient/Login';
import { Register } from './pages/Patient/Register';
import { Profile } from './pages/Patient/Profile';
import { Requests } from './pages/Patient/Requests';
import { SelectClinic } from './pages/Clinics/SelectClinic';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/patient/login" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesList />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/book/:serviceId" element={<BookService />} />
        <Route path="/laboratory" element={<BookLab />} />
        <Route path="/laboratory/track" element={<TrackResult />} />
        <Route path="/patient/login" element={<Login />} />
        <Route path="/patient/register" element={<Register />} />
        <Route
          path="/patient/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/requests"
          element={
            <ProtectedRoute>
              <Requests />
            </ProtectedRoute>
          }
        />
        <Route path="/clinics/select" element={<SelectClinic />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
