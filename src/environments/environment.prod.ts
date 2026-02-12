// Production environment configuration
// For single-server deployment, remotes are served from the same origin with subpaths
// For multi-server deployment, update these URLs to point to your remote servers
const getRemoteUrls = () => {
  // Use same origin with subpaths (single server deployment)
  // This works when all apps are served from the same Express server
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  
  return {
    dealer: `${origin}/dealer`,
    commercial: `${origin}/commercial`,
    admin: `${origin}/admin`,
  };
  
  // For multi-server deployment, uncomment and update these:
  // return {
  //   dealer: 'https://dealer.yourdomain.com',
  //   commercial: 'https://commercial.yourdomain.com',
  //   admin: 'https://admin.yourdomain.com',
  // };
};

export const environment = {
  production: true,
  remotes: getRemoteUrls()
};
