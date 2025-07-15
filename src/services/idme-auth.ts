import { supabase } from './supabase';

export interface AuthSession {
  email: string;
  expiresAt: number;
  idmeId?: string;
  firstName?: string;
  lastName?: string;
  verified?: boolean;
}

export interface IDMeTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface IDMeUserInfo {
  uuid: string;
  email: string;
  fname?: string;
  lname?: string;
  verified: boolean;
  affiliation?: string;
}

const SESSION_KEY = 'daf_invite_session';

const getIDMeConfig = () => ({
  clientId: process.env.REACT_APP_IDME_CLIENT_ID!,
  redirectUri: 'https://daf-invite.app/idme/callback',
  authorizationEndpoint: 'https://groups.id.me/',
  scope: 'government,military',
});

export const getIDMeAuthUrl = (): string => {
  const config = getIDMeConfig();
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scopes: config.scope,
    state: generateState(),
  });

  return `${config.authorizationEndpoint}?${params.toString()}`;
};

export const handleIDMeCallback = async (code: string, state: string): Promise<AuthSession | null> => {
  try {
    console.log('Sending callback to server API...');
    
    // Call our secure server-side API
    const response = await fetch('/api/idme-callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, state }),
    });

    console.log('API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API callback failed:', errorData);
      throw new Error(errorData.error || 'Authentication failed');
    }

    const data = await response.json();
    console.log('API response data:', data);

    if (!data.success || !data.session) {
      throw new Error('Invalid response from authentication server');
    }

    const session: AuthSession = data.session;

    // Store user in Supabase if military verified
    if (session.verified) {
      console.log('Storing verified military user in Supabase');
      const { error } = await supabase.from('users').upsert({
        email: session.email,
        idme_id: session.idmeId,
        first_name: session.firstName,
        last_name: session.lastName,
        verified: true,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'email',
      });

      if (error) {
        console.error('Error storing user in Supabase:', error);
      }
    }

    console.log('Creating session:', session);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  } catch (error) {
    console.error('ID.me callback error:', error);
    return null;
  }
};

export const refreshIDMeToken = async (refreshToken: string): Promise<IDMeTokenResponse | null> => {
  try {
    // Token refresh would need to be implemented server-side as well
    // For now, we'll just return null and require re-authentication
    console.warn('Token refresh not implemented - user will need to re-authenticate');
    return null;
  } catch (error) {
    console.error('Token refresh error:', error);
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
  // ID.me doesn't require server-side logout for this use case
};

function generateState(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}