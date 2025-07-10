import React, { useState, useEffect } from 'react';
import './App.css';
import { Landing } from './components/auth/Landing';
import { EmailSent } from './components/auth/EmailSent';
import { AuthCallback } from './components/auth/AuthCallback';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { sendMagicLink, getSession } from './services/auth';

type AppState = 'landing' | 'email-sent' | 'auth-callback' | 'dashboard' | 'auth-error';

function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [userEmail, setUserEmail] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    // Check for existing session on app load
    const session = getSession();
    if (session) {
      setUserEmail(session.email);
      setAppState('dashboard');
      return;
    }

    // Check if this is an auth callback
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    if (hashParams.get('access_token') || urlParams.get('access_token')) {
      setAppState('auth-callback');
    }
  }, []);

  const handleEmailSubmit = async (email: string) => {
    try {
      await sendMagicLink(email);
      setUserEmail(email);
      setAppState('email-sent');
    } catch (error) {
      console.error('Failed to send magic link:', error);
      throw error;
    }
  };

  const handleBack = () => {
    setAppState('landing');
    setUserEmail('');
    setAuthError('');
  };

  const handleAuthSuccess = (email: string) => {
    setUserEmail(email);
    setAppState('dashboard');
  };

  const handleAuthError = (error: string) => {
    setAuthError(error);
    setAppState('auth-error');
  };

  const handleLogout = () => {
    setUserEmail('');
    setAppState('landing');
  };

  switch (appState) {
    case 'email-sent':
      return <EmailSent email={userEmail} onBack={handleBack} />;
    
    case 'auth-callback':
      return (
        <AuthCallback 
          onAuthSuccess={handleAuthSuccess}
          onAuthError={handleAuthError}
        />
      );
    
    case 'dashboard':
      return (
        <AdminDashboard 
          userEmail={userEmail}
          onLogout={handleLogout}
        />
      );
    
    case 'auth-error':
      return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 via-gray-800 to-black animate-gradient-xy">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-900/30 to-black/50 animate-gradient-x"></div>
          <div className="flex-1 flex items-center justify-center relative z-10 px-4">
            <div className="bg-gray-800/80 backdrop-blur-md shadow-2xl rounded-2xl p-8 md:p-10 text-center border border-gray-700/50">
              <h2 className="text-2xl font-bold text-white mb-4">Authentication Error</h2>
              <p className="text-gray-400 mb-6">{authError}</p>
              <button
                onClick={handleBack}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    
    default:
      return <Landing onEmailSubmit={handleEmailSubmit} />;
  }
}

export default App;
