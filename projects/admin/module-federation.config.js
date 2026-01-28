const { share, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'admin',

  exposes: {
    './Module': './projects/admin/src/app/admin.module.ts',
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
