import './input.css';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, AdminRoute } from './components/core/RouteProtection';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import HomePage from "./pages/HomePage";
import AdminPage from './pages/AdminPage';
import Header from './components/core/Header';
import Footer from './components/core/Footer';

// Layout with header/footer and nested route outlet
const Layout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes - no header/footer */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes with header/footer */}
          <Route element={<PrivateRoute />}>          
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Admin-only nested under PrivateRoute + Layout */}
              <Route element={<AdminRoute />}>  
                <Route path="/admin" element={<AdminPage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
