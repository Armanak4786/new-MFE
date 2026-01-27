export const environment = {
    production: false,
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

