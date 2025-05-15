import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/Authentication/LoginForm';

const LoginPage = () => {
  const { user, loading } = useAuth();

  // Redirect to dashboard if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700">
      <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-2xl px-8 py-10 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-2">ENTNT Ship Maintenance</h1>
        <p className="text-lg text-gray-700 font-medium text-center mb-6">Sign in to your account</p>
        <LoginForm />
        <div className="mt-6 w-full">
          <div className="text-center text-gray-700 font-semibold mb-1">Demo Accounts:</div>
          <div className="text-sm text-gray-600 text-center">
            <span className="font-bold">Admin:</span> admin@entnt.com / Admin@2024<br />
            <span className="font-bold">Inspector:</span> inspector@entnt.com / Inspect@2024<br />
            <span className="font-bold">Engineer:</span> engineer@entnt.com / Engineer@2024
          </div>
        </div>
        <div className="mt-8 text-xs text-gray-400 text-center w-full">
          ENTNT Ship Maintenance System<br />
          © 2025 ENTNT Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 