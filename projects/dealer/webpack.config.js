const mfConfig = require('./module-federation.config.js');

module.exports = {
  ...mfConfig,
  output: {
    ...mfConfig.output,
    uniqueName: "dealer",
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
