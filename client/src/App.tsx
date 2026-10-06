
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage'

const LoginPage = () => <div className="p-8 text-center text-xl">Login Page (In development)</div>;
const RegisterPage = () => <div className="p-8 text-center text-xl">Register Page (In development)</div>;
const DashboardPage = () => <div className="p-8 text-center text-xl font-bold">Dashboard (Protected Page)</div>;



export const App: React.FC = () => {
  return (
    <AuthProvider>

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          {/* Redirect for non-existent pages */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

    </AuthProvider>
  );
};

export default App;
