import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import { Landing } from './components/auth/Landing';
import { AuthCallback } from './components/auth/AuthCallback';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { getSession, logout } from './services/idme-auth';

function App() {
  const [userEmail, setUserEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session on app load
    const session = getSession();
    if (session) {
      setUserEmail(session.email);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);


  const handleAuthSuccess = (email: string) => {
    setUserEmail(email);
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const handleAuthError = (error: string) => {
    navigate('/', { state: { error } });
  };

  const handleLogout = async () => {
    await logout();
    setUserEmail('');
    setIsAuthenticated(false);
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route 
        path="/idme/callback" 
        element={
          <AuthCallback 
            onAuthSuccess={handleAuthSuccess}
            onAuthError={handleAuthError}
          />
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          isAuthenticated ? (
            <AdminDashboard 
              userEmail={userEmail}
              onLogout={handleLogout}
            />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
