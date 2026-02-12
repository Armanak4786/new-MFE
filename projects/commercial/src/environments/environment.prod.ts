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
    microservices: {
        contractCommercial: 'ContractCommercial',
        assetCommercial: 'AssetCommercial',
        paymentCommercial: 'PaymentCommercial',
        UserCommercial: 'UserCommercial',
        ReportCommercial: 'ReportCommercial',
        LookupCommercial: 'LookupCommercial',
        ServicingRequest: 'ServicingRequest',
        CommercialDocument: 'CommercialDocument',
        TaskCommercial: 'TaskDetails',
        Product: 'Product',
        NoteCommercial: 'NoteCommercial',
        Contract: 'Contract',
        Motocheck: 'Motocheck',
        customerCommercial: 'CustomerDetailsCommercial',
        WorkFlowsCommercial: 'WorkFlowsCommercial',
    },
    apiUrl: 'http://testudcportalgateway:444/gateway',
    // OIDC Config : Start
    authority:
        'https://login.microsoftonline.com/2c4787bf-22ff-4192-bda2-7055d259e141',
    revokeAllTokenFIS:
        'https://login10.fisglobal.com/idp/aurionpro/rest/1.0/idptoken/delete/alltoken/me',
    redirectUrl: window.location.origin + '/authentication',
    CommonConfiguration: "/auro-ui-assets/api-json/commonConfiguration.json",
    postLogoutRedirectUri: window.location.origin + '/post-logout',
    // clientId: 'd4ea1b2b-7183-4465-a51a-d36e7f10ca69',

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
