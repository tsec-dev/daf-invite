export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, state } = req.body;

  if (!code || !state) {
    return res.status(400).json({ error: 'Missing code or state' });
  }

  try {
    const config = {
      clientId: process.env.IDME_CLIENT_ID,
      clientSecret: process.env.IDME_CLIENT_SECRET,
      redirectUri: 'https://daf-invite.app/idme/callback',
      tokenEndpoint: 'https://api.id.me/oauth/token',
      userInfoEndpoint: 'https://api.id.me/api/public/v3/attributes.json',
    };

    console.log('Processing ID.me callback with config:', {
      clientId: config.clientId,
      redirectUri: config.redirectUri,
    });

    // Exchange authorization code for access token
    const tokenResponse = await fetch(config.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.redirectUri,
      }),
    });

    console.log('Token response status:', tokenResponse.status);

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      return res.status(400).json({ error: `Token exchange failed: ${errorText}` });
    }

    const tokenData = await tokenResponse.json();
    console.log('Token data received:', {
      access_token: tokenData.access_token ? 'present' : 'missing',
      expires_in: tokenData.expires_in,
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
      return res.status(400).json({ error: `User info fetch failed: ${errorText}` });
    }

    const userData = await userResponse.json();
    console.log('User data received:', {
      email: userData.email,
      verified: userData.verified,
      status: userData.status,
    });

    // Check if user has military verification
    const militaryStatus = userData.status?.find(s => s.group === 'military');
    const isVerified = militaryStatus?.verified || false;

    if (!isVerified) {
      return res.status(403).json({ 
        error: 'Military verification required',
        verified: false 
      });
    }

    // Return user session data
    const session = {
      email: userData.email,
      expiresAt: Date.now() + (tokenData.expires_in * 1000),
      idmeId: userData.uuid,
      firstName: userData.fname,
      lastName: userData.lname,
      verified: isVerified,
      militaryStatus: militaryStatus,
    };

    console.log('Returning session:', { email: session.email, verified: session.verified });
    res.status(200).json({ success: true, session });

  } catch (error) {
    console.error('ID.me callback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}