import { supabase } from './supabase';

export interface AuthSession {
  email: string;
  expiresAt: number;
}

const SESSION_KEY = 'daf_invite_session';

export const sendMagicLink = async (email: string): Promise<void> => {
  // Get the current origin and ensure it's in the correct format
  const redirectUrl = process.env.REACT_APP_ENVIRONMENT === 'production' 
    ? 'https://daf-invite.app' 
    : window.location.origin;
    
  console.log('Using redirect URL:', redirectUrl); // Debug log
  
  // Always use signInWithOtp with shouldCreateUser: true
  // This will either send a magic link to existing users or create new user and send confirmation
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectUrl,
      shouldCreateUser: true, // Allow creating new users
    },
  });

  if (error) {
    console.error('Supabase error:', error);
    throw new Error('Failed to send authentication email');
  }
};

export const verifyMagicLink = async (token: string): Promise<AuthSession | null> => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email',
    });

    if (error || !data.user) {
      return null;
    }

    const session: AuthSession = {
      email: data.user.email!,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  } catch (error) {
    return null;
  }
};

export const getSession = (): AuthSession | null => {
  try {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;

    const session: AuthSession = JSON.parse(sessionStr);
    
    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    return session;
  } catch {
    return null;
  }
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem(SESSION_KEY);
  await supabase.auth.signOut();
};