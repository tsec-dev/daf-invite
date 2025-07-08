import React from 'react';

interface EmailSentProps {
  email: string;
  onBack: () => void;
}

export const EmailSent: React.FC<EmailSentProps> = ({ email, onBack }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 bg-military-blue rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-air-force-blue rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white shadow-2xl rounded-xl p-10 text-center backdrop-blur-sm bg-opacity-95 animate-fade-in">
          <div className="mb-8">
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <svg
                className="h-10 w-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3 font-military">
            Check Your Email
          </h2>
          
          <p className="text-gray-600 mb-6 text-lg">
            We've sent a secure sign-in link to:
          </p>
          
          <div className="bg-blue-50 rounded-lg px-4 py-3 mb-8">
            <p className="font-semibold text-military-blue text-lg break-all">
              {email}
            </p>
          </div>

          <div className="space-y-4 text-gray-600 mb-8">
            <div className="flex items-start justify-center space-x-2">
              <svg className="w-5 h-5 text-military-blue mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">
                Click the link in the email to access your dashboard
              </p>
            </div>
            <div className="flex items-start justify-center space-x-2">
              <svg className="w-5 h-5 text-military-blue mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">
                The link will expire in 1 hour for security
              </p>
            </div>
          </div>

          <button
            onClick={onBack}
            className="inline-flex items-center text-sm text-military-blue hover:text-blue-800 font-medium transition-colors group"
          >
            <svg className="w-4 h-4 mr-1 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Use a different email
          </button>
        </div>
      </div>
    </div>
  );
};