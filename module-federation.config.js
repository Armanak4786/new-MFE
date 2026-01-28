const { share, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'authentication',
  
  remotes: {
    dealer: 'http://localhost:4201/remoteEntry.js',
    commercial: 'http://localhost:4202/remoteEntry.js',
    admin: 'http://localhost:4203/remoteEntry.js',
  },

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
