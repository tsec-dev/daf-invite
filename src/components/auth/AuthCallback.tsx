import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';

interface AuthCallbackProps {
  onAuthSuccess: (email: string) => void;
  onAuthError: (error: string) => void;
}

export const AuthCallback: React.FC<AuthCallbackProps> = ({ onAuthSuccess, onAuthError }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for hash parameters (magic link or email confirmation)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const urlParams = new URLSearchParams(window.location.search);
        
        const accessToken = hashParams.get('access_token') || urlParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token') || urlParams.get('refresh_token');
        const type = hashParams.get('type') || urlParams.get('type');
        
        if (!accessToken) {
          // Check if this is a confirmation link without tokens yet
          if (type === 'signup' || window.location.search.includes('confirmation')) {
            // This is a signup confirmation, wait for Supabase to process
            const { data: { session }, error } = await supabase.auth.getSession();
            if (session?.user?.email) {
              const sessionData = {
                email: session.user.email,
                expiresAt: Date.now() + (24 * 60 * 60 * 1000),
              };
              localStorage.setItem('daf_invite_session', JSON.stringify(sessionData));
              window.history.replaceState({}, document.title, window.location.pathname);
              onAuthSuccess(session.user.email);
              return;
            }
          }
          throw new Error('No authentication data found in URL');
        }

        // Set the session in Supabase
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        if (error) {
          throw error;
        }

        if (data.user?.email) {
          // Store session info
          const sessionData = {
            email: data.user.email,
            expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
          };
          localStorage.setItem('daf_invite_session', JSON.stringify(sessionData));
          
          // Clear the URL hash/search
          window.history.replaceState({}, document.title, window.location.pathname);
          
          onAuthSuccess(data.user.email);
        } else {
          throw new Error('No user email found');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        onAuthError(error instanceof Error ? error.message : 'Authentication failed');
      } finally {
        setIsLoading(false);
      }
    };

    handleAuthCallback();
  }, [onAuthSuccess, onAuthError]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 via-gray-800 to-black animate-gradient-xy">
      {/* Classification Banner */}
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-900/30 to-black/50 animate-gradient-x"></div>

      <div className="flex-1 flex items-center justify-center relative z-10 px-4">
        <div className="bg-gray-800/80 backdrop-blur-md shadow-2xl rounded-2xl p-8 md:p-10 text-center border border-gray-700/50">
          {isLoading ? (
            <>
              <div className="mb-6">
                <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Verifying Authentication
              </h2>
              <p className="text-gray-400">
                Please wait while we verify your access...
              </p>
            </>
          ) : (
            <>
              <div className="mb-6">
                <div className="mx-auto h-16 w-16 bg-red-600 rounded-full flex items-center justify-center">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Authentication Failed
              </h2>
              <p className="text-gray-400 mb-6">
                There was an issue verifying your access.
              </p>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Return to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};