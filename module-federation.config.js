const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'authentication',
  
  remotes: {
    dealer: 'http://localhost:4201/remoteEntry.js',
    commercial: 'http://localhost:4202/remoteEntry.js',
    admin: 'http://localhost:4203/remoteEntry.js',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});

