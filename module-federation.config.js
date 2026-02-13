const { share, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

// Get remote URLs from environment variables or use defaults for development
const getRemoteUrls = () => {
  const isProduction = process.env['NODE_ENV'] === 'production';
  
  if (isProduction) {
    // In production, use environment variables or default to same origin with paths
    const baseUrl = process.env['REMOTE_BASE_URL'] || '';
    return {
      dealer: `${baseUrl}/dealer/remoteEntry.js`,
      commercial: `${baseUrl}/commercial/remoteEntry.js`,
      admin: `${baseUrl}/admin/remoteEntry.js`,
    };
  }
  
  // Development defaults
  return {
    dealer: 'http://localhost:4201/remoteEntry.js',
    commercial: 'http://localhost:4202/remoteEntry.js',
    admin: 'http://localhost:4203/remoteEntry.js',
  };
};

module.exports = withModuleFederationPlugin({
  name: 'authentication',
  
  remotes: getRemoteUrls(),

  shared: share({
    "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    "@angular/common/http": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    "@angular/router": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    "@angular/forms": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    "@angular/platform-browser": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    "@angular/platform-browser-dynamic": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    "@angular/animations": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    "rxjs": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    "primeng": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    "auro-ui": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  }),
});
