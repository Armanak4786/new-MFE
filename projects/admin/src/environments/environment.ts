export const environment = {
    production: false,
    microservices: {
        userAdmin: 'UserAdmin',
        reportAdmin: 'ReportAdmin',
        lookupAdmin: 'LookupAdmin',
        configAdmin: 'ConfigAdmin',
    },
    apiUrl: 'http://testudcportalgateway:444/gateway',
    authority:
        'https://login.microsoftonline.com/2c4787bf-22ff-4192-bda2-7055d259e141',
    revokeAllTokenFIS:
        'https://login10.fisglobal.com/idp/aurionpro/rest/1.0/idptoken/delete/alltoken/me',
    redirectUrl: window.location.origin + '/authentication',
    postLogoutRedirectUri: window.location.origin + '/post-logout',
    scope: 'openid profile email User.Read',
    autoUserInfo: false,
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    secureRoutes: ['https://graph.microsoft.com/'],
    maxIdTokenIatOffsetAllowedInSeconds: 600,
    FIS: true,
    grant_type: 'client_credentials',
};



