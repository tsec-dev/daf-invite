import React, { useState } from 'react';
import './App.css';
import { Landing } from './components/auth/Landing';
import { EmailSent } from './components/auth/EmailSent';
import { sendMagicLink } from './services/auth';

function App() {
  const [emailSent, setEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleEmailSubmit = async (email: string) => {
    try {
      await sendMagicLink(email);
      setUserEmail(email);
      setEmailSent(true);
    } catch (error) {
      console.error('Failed to send magic link:', error);
      throw error;
    }
  };

  const handleBack = () => {
    setEmailSent(false);
    setUserEmail('');
  };

  if (emailSent) {
    return <EmailSent email={userEmail} onBack={handleBack} />;
  }

  return <Landing onEmailSubmit={handleEmailSubmit} />;
}

export default App;
