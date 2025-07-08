import React, { useState } from 'react';
import { validateMilEmail } from '../../services/supabase';

interface LandingProps {
  onEmailSubmit: (email: string) => void;
}

export const Landing: React.FC<LandingProps> = ({ onEmailSubmit }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!validateMilEmail(email)) {
      setError('Please enter a valid .mil email address');
      return;
    }

    setIsLoading(true);
    try {
      await onEmailSubmit(email);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-military-blue mb-2">
              Military eInvitations
            </h1>
            <p className="text-gray-600">
              Create beautiful military event invitations
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Military Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@mail.mil"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-military-blue focus:border-military-blue"
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Access restricted to .mil email addresses only
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-military-blue hover:bg-blue-800 text-white'
              }`}
            >
              {isLoading ? 'Sending...' : 'Get Started'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Authorized for official military use only</p>
          </div>
        </div>
      </div>
    </div>
  );
};