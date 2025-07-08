import React from 'react';

interface EmailSentProps {
  email: string;
  onBack: () => void;
}

export const EmailSent: React.FC<EmailSentProps> = ({ email, onBack }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="h-8 w-8 text-green-600"
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

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Check Your Email
          </h2>
          
          <p className="text-gray-600 mb-4">
            We've sent a secure sign-in link to:
          </p>
          
          <p className="font-medium text-military-blue mb-6">
            {email}
          </p>

          <div className="space-y-3 text-sm text-gray-500">
            <p>
              Click the link in the email to access your dashboard.
            </p>
            <p>
              The link will expire in 1 hour for security.
            </p>
          </div>

          <button
            onClick={onBack}
            className="mt-6 text-sm text-military-blue hover:underline"
          >
            Use a different email
          </button>
        </div>
      </div>
    </div>
  );
};