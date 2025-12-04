import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/admin/Home/Home';
import Patients from './pages/Patients';
import Doctors from './pages/admin/Doctors/DoctorsList';
import Appointments from './pages/Appointments';
import PatientForm from './pages/PatientForm';
import DoctorForm from './pages/DoctorForm';
import Login from './pages/Login';
import Register from './pages/Register';
import ClinicsList from './pages/admin/Clinics/ClinicsList';
import InsurancesList from './pages/admin/Insurances/InsurancesList';
import ServiceCategoriesList from './pages/admin/ServiceCategories/ServiceCategoriesList';
import ServicesList from './pages/admin/Services/ServicesList';
import AppointmentsList from './pages/admin/Appointments/AppointmentsList';
import ClinicServicesList from './pages/admin/ClinicServices/ClinicServicesList';
import SpecialtiesList from './pages/admin/Specialties/SpecialtiesList';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/clinics"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ClinicsList />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/insurances"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <InsurancesList />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/service-categories"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ServiceCategoriesList />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/specialties"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <SpecialtiesList />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Patients />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients/new"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <PatientForm />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients/:id/edit"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <PatientForm />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctors"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Doctors />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctors/new"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <DoctorForm />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctors/:id/edit"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <DoctorForm />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/services"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ServicesList />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <AppointmentsList />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/clinics/:id/services"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ClinicServicesList />
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
            <ToastContainer
              position="top-left"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={true}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;