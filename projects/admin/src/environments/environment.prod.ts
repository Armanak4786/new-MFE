// Helper to get remote URLs based on current origin
const getRemoteUrls = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return {
        dealer: `${origin}/dealer`,
        commercial: `${origin}/commercial`,
        admin: `${origin}/admin`,
    };
};

export const environment = {
    production: true,
    // Remote app URLs for portal switching (same domain in production)
    remotes: getRemoteUrls(),
    apiUrl: 'https://devportalgateway.aurionpro.com/gateway',
    clientId: 'AURPRIA.RESTAPI.DEVPORTAL',
    // OIDC Config
    authority: 'https://login10.fisglobal.com/idp/aurionpro',
    revokeAllTokenFIS: 'https://login10.fisglobal.com/idp/aurionpro/rest/1.0/idptoken/delete/alltoken/me',
    revokeSessionUrlEntra: 'https://graph.microsoft.com/v1.0/me/revokeSignInSessions',
    redirectUrl: window.location.origin + '/authentication/login',
    postLogoutRedirectUri: window.location.origin + '/post-logout',
    scope: 'openid profile email offline_access',
    autoUserInfo: false,
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    secureRoutes: [''],
    maxIdTokenIatOffsetAllowedInSeconds: 600,
    FIS: true,
    grant_type: 'client_credentials',
    ActiveClient: 'UDCDO',
};

