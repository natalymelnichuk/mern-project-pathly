
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { TripDetailPage } from './pages/TripDetailPage';
import { Toaster } from 'react-hot-toast';


export const App: React.FC = () => {
  return (
    <>
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'dark:bg-slate-800 dark:text-white rounded-2xl border dark:border-slate-700 shadow-xl',
          duration: 3000,
        }} 
      />
      <AuthProvider>

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/trips/:id" element={<TripDetailPage />} />
            </Route>

            {/* Redirect any unknown routes to the landing page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

      </AuthProvider>
    </>
  );
};

export default App;
