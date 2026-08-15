import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuthStore } from './store/authStore.js';
import { getCurrentUser } from './utils/api.js';

const App = () => {
  const location = useLocation();
  const { token, isLoading, setLoading, syncAuth, logout } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser(token);
        if (response?.data?.user) {
          syncAuth(response.data.user, token);
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
    };

    initializeAuth();
  }, [token, setLoading, logout, syncAuth]);

  if (isLoading) {
    return (
      <div className="app-shell app-shell--loading">
        <div className="loading-spinner" aria-label="Loading session" />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="app-main"
        >
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
    </div>
  );
};

export default App;
