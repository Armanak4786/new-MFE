const mfConfig = require('./module-federation.config.js');

module.exports = {
  ...mfConfig,
  output: {
    ...mfConfig.output,
    uniqueName: "admin",
    publicPath: "auto",
    scriptType: "module"
  },
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    }
  },
  experiments: {
    outputModule: true
  },
};
