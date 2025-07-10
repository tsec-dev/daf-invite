import React from 'react';

interface EmailSentProps {
  email: string;
  onBack: () => void;
}

export const EmailSent: React.FC<EmailSentProps> = ({ email, onBack }) => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 via-gray-800 to-black animate-gradient-xy">
      {/* Classification Banner */}
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-900/30 to-black/50 animate-gradient-x"></div>

      <div className="flex-1 flex items-center justify-center relative z-10 px-4">
        <div className="bg-gray-800/80 backdrop-blur-md shadow-2xl rounded-2xl p-8 md:p-10 text-center border border-gray-700/50">
          <div className="mb-6">
            <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Check Your Email
          </h2>
          
          <p className="text-gray-400 mb-6">
            We've sent a secure sign-in link to:
          </p>
          
          <div className="bg-gray-700 rounded-lg px-4 py-3 mb-6">
            <p className="font-medium text-blue-400 break-all">
              {email}
            </p>
          </div>

          <div className="space-y-3 text-sm text-gray-400 mb-8">
            <p>Click the link in your email to complete authentication</p>
            <p>If this is your first time, you may need to confirm your email first</p>
            <p>The link expires in 1 hour for security</p>
          </div>

          <button
            onClick={onBack}
            className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Use a different email
          </button>
        </div>
      </div>
      
    </div>
  );
};