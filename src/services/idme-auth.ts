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
  clientSecret: process.env.REACT_APP_IDME_CLIENT_SECRET!,
  redirectUri: 'https://daf-invite.app/idme/callback',
  authorizationEndpoint: 'https://groups.id.me/',
  tokenEndpoint: 'https://api.id.me/oauth/token',
  userInfoEndpoint: 'https://api.id.me/api/public/v3/attributes.json',
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
    const config = getIDMeConfig();
    
    console.log('ID.me config:', { 
      clientId: config.clientId, 
      redirectUri: config.redirectUri,
      tokenEndpoint: config.tokenEndpoint 
    });
    
    // Exchange authorization code for access token
    const tokenRequestBody = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: config.redirectUri,
    });
    
    console.log('Token request body:', tokenRequestBody.toString());
    
    const tokenResponse = await fetch(config.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${config.clientId}:${config.clientSecret}`)}`,
      },
      body: tokenRequestBody,
    });

    console.log('Token response status:', tokenResponse.status);
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      throw new Error(`Failed to exchange code for token: ${tokenResponse.status} ${errorText}`);
    }

    const tokenData: IDMeTokenResponse = await tokenResponse.json();
    console.log('Token data received:', { 
      access_token: tokenData.access_token ? 'present' : 'missing',
      expires_in: tokenData.expires_in,
      scope: tokenData.scope 
    });

    // Fetch user information
    const userResponse = await fetch(config.userInfoEndpoint, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    console.log('User info response status:', userResponse.status);

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('User info fetch failed:', errorText);
      throw new Error(`Failed to fetch user information: ${userResponse.status} ${errorText}`);
    }

    const userData: IDMeUserInfo = await userResponse.json();
    console.log('User data received:', { 
      email: userData.email,
      verified: userData.verified,
      affiliation: userData.affiliation,
      uuid: userData.uuid 
    });

    // Store user in Supabase if military verified
    if (userData.verified && userData.affiliation === 'MILITARY') {
      console.log('Storing verified military user in Supabase');
      const { error } = await supabase.from('users').upsert({
        email: userData.email,
        idme_id: userData.uuid,
        first_name: userData.fname,
        last_name: userData.lname,
        verified: true,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'email',
      });

      if (error) {
        console.error('Error storing user in Supabase:', error);
      }
    } else {
      console.warn('User not verified or not military:', { 
        verified: userData.verified, 
        affiliation: userData.affiliation 
      });
    }

    // Create session
    const session: AuthSession = {
      email: userData.email,
      expiresAt: Date.now() + (tokenData.expires_in * 1000),
      idmeId: userData.uuid,
      firstName: userData.fname,
      lastName: userData.lname,
      verified: userData.verified,
    };

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
    const config = getIDMeConfig();
    
    const response = await fetch(config.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${config.clientId}:${config.clientSecret}`)}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    return await response.json();
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