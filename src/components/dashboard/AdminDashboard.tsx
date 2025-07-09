import React, { useState } from 'react';
import { logout } from '../../services/auth';
import { EventWizard } from '../events/EventWizard';

interface AdminDashboardProps {
  userEmail: string;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ userEmail, onLogout }) => {
  const [showEventWizard, setShowEventWizard] = useState(false);

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  const handleCreateEvent = () => {
    setShowEventWizard(true);
  };

  const handleCloseWizard = () => {
    setShowEventWizard(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 via-gray-800 to-black animate-gradient-xy">
      {/* Classification Banner */}
      <div className="w-full bg-green-600 text-white text-center py-1 font-bold text-sm tracking-wider relative z-20">
        UNCLASSIFIED
      </div>
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-900/30 to-black/50 animate-gradient-x"></div>

      <div className="flex-1 relative z-10">
        {/* Header */}
        <header className="bg-gray-800/80 backdrop-blur-md border-b border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <img 
                  src="/logo.png" 
                  alt="DAF Invite" 
                  className="h-8 w-auto mr-3"
                />
                <h1 className="text-xl font-bold text-white">
                  DAF eInvite Dashboard
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300">
                  {userEmail}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Welcome to DAF eInvite
              </h2>
              <p className="text-gray-400 text-lg">
                Create and manage military event invitations
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <button
                onClick={handleCreateEvent}
                className="bg-gray-700/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50 hover:bg-gray-700/70 transition-colors cursor-pointer text-left w-full"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-600 rounded-lg p-3">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-white">
                    Create Event
                  </h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Start a new military event invitation
                </p>
              </button>

              <div className="bg-gray-700/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50 hover:bg-gray-700/70 transition-colors cursor-pointer">
                <div className="flex items-center mb-4">
                  <div className="bg-green-600 rounded-lg p-3">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-white">
                    My Events
                  </h3>
                </div>
                <p className="text-gray-400 text-sm">
                  View and manage your events
                </p>
              </div>

              <div className="bg-gray-700/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50 hover:bg-gray-700/70 transition-colors cursor-pointer">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-600 rounded-lg p-3">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-white">
                    Templates
                  </h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Browse invitation templates
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">
                Recent Activity
              </h3>
              <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30">
                <p className="text-gray-400 text-center">
                  No recent activity. Create your first event to get started!
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Event Wizard Modal */}
      {showEventWizard && (
        <EventWizard
          userEmail={userEmail}
          onClose={handleCloseWizard}
        />
      )}
    </div>
  );
};