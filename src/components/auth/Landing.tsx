import React from 'react';
import { getIDMeAuthUrl } from '../../services/idme-auth';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface LandingProps {
  onEmailSubmit?: (email: string) => void;
}

export const Landing: React.FC<LandingProps> = () => {
  const handleIDMeLogin = () => {
    window.location.href = getIDMeAuthUrl();
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 via-gray-800 to-black animate-gradient-xy">
      {/* Classification Banner */}
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-900/30 to-black/50 animate-gradient-x"></div>
      
      <div className="flex-1 flex items-center justify-center relative z-10 px-4">
        <Card className="bg-gray-800/80 backdrop-blur-md border border-gray-700/50 max-w-md w-full">
          <CardHeader className="text-center">
            <img 
              src="/logo.png" 
              alt="DAF Invite" 
              className="mx-auto h-28 md:h-32 w-auto mb-4"
            />
            <CardTitle className="text-2xl text-white">Welcome to DAF Invite</CardTitle>
          </CardHeader>
          
          <CardContent>
            <Button
              onClick={handleIDMeLogin}
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Sign in with ID.me
            </Button>
          </CardContent>
        </Card>
      </div>
      
    </div>
  );
};